-- Columns table
create table columns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#22c55e',
  "order" integer not null default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Cards table
create table cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid references columns(id) on delete cascade not null,
  title text not null,
  description text,
  labels text[] default '{}',
  due_date timestamptz,
  "order" integer not null default 0,
  attachment_count integer default 0,
  comment_count integer default 0,
  archived_at timestamptz,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Comments table
create table comments (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete cascade not null,
  author text not null,
  author_initials text,
  text text not null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Attachments table
create table attachments (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('file', 'link')),
  url text,
  size text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table columns enable row level security;
alter table cards enable row level security;
alter table comments enable row level security;
alter table attachments enable row level security;

-- RLS Policies (allow all for now - can restrict to user_id later)
create policy "Allow all operations on columns" on columns for all using (true);
create policy "Allow all operations on cards" on cards for all using (true);
create policy "Allow all operations on comments" on comments for all using (true);
create policy "Allow all operations on attachments" on attachments for all using (true);

-- Indexes
create index idx_cards_column_id on cards(column_id);
create index idx_cards_archived on cards(archived_at) where archived_at is not null;
create index idx_comments_card_id on comments(card_id);
create index idx_attachments_card_id on attachments(card_id);

-- Insert default columns
insert into columns (name, color, "order") values
  ('To Do', '#22c55e', 0),
  ('In Progress', '#3b82f6', 1),
  ('Done', '#a855f7', 2);
