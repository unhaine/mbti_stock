-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Users)
-- Links to Supabase Auth
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  nickname text,
  mbti text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone" 
  on profiles for select 
  using ( true );

create policy "Users can insert their own profile" 
  on profiles for insert 
  with check ( auth.uid() = id );

create policy "Users can update own profile" 
  on profiles for update 
  using ( auth.uid() = id );

-- 2. Portfolios Table
create table portfolios (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  cash_balance numeric default 10000000 not null, -- Initial cash: 10M won
  total_assets numeric default 10000000 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS for portfolios
alter table portfolios enable row level security;

create policy "Users can view own portfolio" 
  on portfolios for select 
  using ( auth.uid() = user_id );

create policy "Users can update own portfolio" 
  on portfolios for update 
  using ( auth.uid() = user_id );

-- 3. Holdings Table
create table holdings (
  id uuid default uuid_generate_v4() primary key,
  portfolio_id uuid references portfolios(id) on delete cascade not null,
  ticker text not null,
  quantity integer not null check (quantity >= 0),
  avg_price numeric not null check (avg_price >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(portfolio_id, ticker)
);

-- Enable RLS for holdings
alter table holdings enable row level security;

create policy "Users can view own holdings" 
  on holdings for select 
  using ( 
    exists (
      select 1 from portfolios 
      where portfolios.id = holdings.portfolio_id 
      and portfolios.user_id = auth.uid()
    ) 
  );

-- 4. Transactions Table
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  portfolio_id uuid references portfolios(id) on delete cascade not null,
  type text not null check (type in ('BUY', 'SELL')),
  ticker text not null,
  quantity integer not null check (quantity > 0),
  price numeric not null check (price >= 0),
  executed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for transactions
alter table transactions enable row level security;

create policy "Users can view own transactions" 
  on transactions for select 
  using ( 
    exists (
      select 1 from portfolios 
      where portfolios.id = transactions.portfolio_id 
      and portfolios.user_id = auth.uid()
    ) 
  );

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, nickname)
  values (new.id, new.email, split_part(new.email, '@', 1));
  
  insert into public.portfolios (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
