create table public.collec (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null,
  updated_at timestamptz default now()
);
alter table public.collec enable row level security;
create policy "lire" on public.collec for select using (auth.uid() = user_id);
create policy "creer" on public.collec for insert with check (auth.uid() = user_id);
create policy "modifier" on public.collec for update using (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('collec', 'collec', true);
create policy "img lire" on storage.objects for select to authenticated using (bucket_id = 'collec' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "img ajouter" on storage.objects for insert to authenticated with check (bucket_id = 'collec' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "img supprimer" on storage.objects for delete to authenticated using (bucket_id = 'collec' and (storage.foldername(name))[1] = auth.uid()::text);
