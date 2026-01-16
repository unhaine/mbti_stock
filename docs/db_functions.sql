-- 매수 함수 (Buy Stock)
create or replace function public.buy_stock(
  p_ticker text,
  p_quantity integer,
  p_price numeric
)
returns json
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_portfolio_id uuid;
  v_total_cost numeric;
  v_current_cash numeric;
  v_old_quantity integer;
  v_old_avg_price numeric;
  v_new_quantity integer;
  v_new_avg_price numeric;
begin
  -- 1. 사용자 및 포트폴리오 확인
  v_user_id := auth.uid();
  select id, cash_balance into v_portfolio_id, v_current_cash
  from public.portfolios
  where user_id = v_user_id;

  if v_portfolio_id is null then
    return json_build_object('success', false, 'error', 'Portfolio not found');
  end if;

  -- 2. 잔액 확인
  v_total_cost := p_quantity * p_price;
  if v_current_cash < v_total_cost then
    return json_build_object('success', false, 'error', 'Insufficient funds');
  end if;

  -- 3. 현금 차감
  update public.portfolios
  set cash_balance = cash_balance - v_total_cost,
      total_assets = total_assets -- 자산 총액은 변동 없음 (현금 -> 주식 이동이므로) 이지만, 시세 변동 반영을 위해선 별도 계산 필요. 일단 단순 교환으로 처리.
  where id = v_portfolio_id;

  -- 4. 거래 내역 기록
  insert into public.transactions (portfolio_id, type, ticker, quantity, price, total_amount)
  values (v_portfolio_id, 'BUY', p_ticker, p_quantity, p_price, v_total_cost);

  -- 5. 보유 주식 업데이트 (Upsert 로직 직접 구현)
  select quantity, avg_price into v_old_quantity, v_old_avg_price
  from public.holdings
  where portfolio_id = v_portfolio_id and ticker = p_ticker;

  if v_old_quantity is null then
    -- 신규 매수
    insert into public.holdings (portfolio_id, ticker, quantity, avg_price)
    values (v_portfolio_id, p_ticker, p_quantity, p_price);
  else
    -- 추가 매수 (평단가 계산)
    v_new_quantity := v_old_quantity + p_quantity;
    v_new_avg_price := ((v_old_quantity * v_old_avg_price) + v_total_cost) / v_new_quantity;
    
    update public.holdings
    set quantity = v_new_quantity,
        avg_price = v_new_avg_price,
        updated_at = now()
    where portfolio_id = v_portfolio_id and ticker = p_ticker;
  end if;

  return json_build_object('success', true, 'message', 'Buy executed successfully');
exception when others then
  return json_build_object('success', false, 'error', SQLERRM);
end;
$$;

-- 매도 함수 (Sell Stock)
create or replace function public.sell_stock(
  p_ticker text,
  p_quantity integer,
  p_price numeric
)
returns json
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_portfolio_id uuid;
  v_total_revenue numeric;
  v_current_quantity integer;
begin
  -- 1. 사용자 및 포트폴리오 확인
  v_user_id := auth.uid();
  select id into v_portfolio_id
  from public.portfolios
  where user_id = v_user_id;

  if v_portfolio_id is null then
    return json_build_object('success', false, 'error', 'Portfolio not found');
  end if;

  -- 2. 보유 수량 확인
  select quantity into v_current_quantity
  from public.holdings
  where portfolio_id = v_portfolio_id and ticker = p_ticker;

  if v_current_quantity is null or v_current_quantity < p_quantity then
    return json_build_object('success', false, 'error', 'Insufficient stocks');
  end if;

  v_total_revenue := p_quantity * p_price;

  -- 3. 현금 입금
  update public.portfolios
  set cash_balance = cash_balance + v_total_revenue
  where id = v_portfolio_id;

  -- 4. 거래 내역 기록
  insert into public.transactions (portfolio_id, type, ticker, quantity, price, total_amount)
  values (v_portfolio_id, 'SELL', p_ticker, p_quantity, p_price, v_total_revenue);

  -- 5. 보유 주식 업데이트
  if v_current_quantity = p_quantity then
    -- 전량 매도 -> 삭제
    delete from public.holdings
    where portfolio_id = v_portfolio_id and ticker = p_ticker;
  else
    -- 부분 매도
    update public.holdings
    set quantity = quantity - p_quantity,
        updated_at = now()
    where portfolio_id = v_portfolio_id and ticker = p_ticker;
  end if;

  return json_build_object('success', true, 'message', 'Sell executed successfully');
exception when others then
  return json_build_object('success', false, 'error', SQLERRM);
end;
$$;
