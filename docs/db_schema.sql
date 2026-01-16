-- MBTI Stock Database Schema

-- 1. Enable RLS (Row Level Security) is recommended for all tables (We will setup policies later)

-- 2. Create 'profiles' table (extends default auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  nickname text,
  mbti text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create 'portfolios' table
create table public.portfolios (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  cash_balance numeric default 10000000, -- 초기 자금 1000만원
  total_assets numeric default 10000000,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create 'holdings' table (stocks owned by user)
create table public.holdings (
  id uuid default uuid_generate_v4() primary key,
  portfolio_id uuid references public.portfolios(id) not null,
  ticker text not null,
  quantity integer not null default 0,
  avg_price numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create 'transactions' table (buy/sell history)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  portfolio_id uuid references public.portfolios(id) not null,
  type text not null check (type in ('BUY', 'SELL')),
  ticker text not null,
  quantity integer not null,
  price numeric not null,
  total_amount numeric not null, -- quantity * price
  executed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;
alter table public.holdings enable row level security;
alter table public.transactions enable row level security;

-- 7. Create Policies (Simple policies for now)

-- Profiles: Users can read/update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Portfolios: Users can see own portfolio
create policy "Users can view own portfolio" on public.portfolios
  for select using (auth.uid() = user_id);

create policy "Users can insert own portfolio" on public.portfolios
  for insert with check (auth.uid() = user_id);

create policy "Users can update own portfolio" on public.portfolios
  for update using (auth.uid() = user_id);

-- Holdings: Users can see own holdings via portfolio
create policy "Users can view own holdings" on public.holdings
  for select using (
    exists (
      select 1 from public.portfolios
      where portfolios.id = holdings.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can insert own holdings" on public.holdings
  for insert with check (
    exists (
      select 1 from public.portfolios
      where portfolios.id = holdings.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can update own holdings" on public.holdings
  for update using (
    exists (
      select 1 from public.portfolios
      where portfolios.id = holdings.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

-- Transactions: Users can see own transactions
create policy "Users can view own transactions" on public.transactions
  for select using (
    exists (
      select 1 from public.portfolios
      where portfolios.id = transactions.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can insert own transactions" on public.transactions
  for insert with check (
    exists (
      select 1 from public.portfolios
      where portfolios.id = transactions.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

-- Function to handle new user signup (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nickname)
  values (new.id, new.email, split_part(new.email, '@', 1));
  
  -- Create default portfolio for new user
  insert into public.portfolios (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
