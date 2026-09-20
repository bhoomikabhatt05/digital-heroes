-- Digital Heroes — winner-proofs storage setup
-- Run in Supabase SQL Editor if bucket does not exist.
-- The existing schema is NOT modified; this only ensures the private bucket exists with correct RLS.

-- 1. Create private bucket (if not exists)
insert into storage.buckets (id, name, public)
values ('winner-proofs', 'winner-proofs', false)
on conflict (id) do nothing;

-- 2. Enable RLS (already enabled by Supabase, but ensure)
-- storage.objects has RLS enabled by default

-- 3. Policies for winner-proofs

-- Allow authenticated users to upload ONLY to their own folder: {auth.uid()}/...
drop policy if exists "Users can upload own proof" on storage.objects;
create policy "Users can upload own proof"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'winner-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read ONLY their own proofs
drop policy if exists "Users can read own proof" on storage.objects;
create policy "Users can read own proof"
on storage.objects for select
to authenticated
using (
  bucket_id = 'winner-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update/delete their own proofs (re-upload)
drop policy if exists "Users can update own proof" on storage.objects;
create policy "Users can update own proof"
on storage.objects for update
to authenticated
using (bucket_id = 'winner-proofs' and (storage.foldername(name))[1] = auth.uid()::text)
with check (
  bucket_id = 'winner-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own proof" on storage.objects;
create policy "Users can delete own proof"
on storage.objects for delete
to authenticated
using (bucket_id = 'winner-proofs' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow admins to read all proofs for verification (relies on profiles.role = 'admin')
drop policy if exists "Admins can read all proofs" on storage.objects;
create policy "Admins can read all proofs"
on storage.objects for select
to authenticated
using (
  bucket_id = 'winner-proofs'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- 4. winner_proofs table RLS (if RLS enabled)
-- Users can insert their own proof row, and read their own; admins read all
-- Adjust table name if yours is winner_proofs or winner_proof

-- Enable RLS
alter table public.winner_proofs enable row level security;

drop policy if exists "Users insert own winner_proof" on public.winner_proofs;
create policy "Users insert own winner_proof"
on public.winner_proofs for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users read own winner_proof" on public.winner_proofs;
create policy "Users read own winner_proof"
on public.winner_proofs for select to authenticated
using (user_id = auth.uid() or exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role='admin'));

drop policy if exists "Admins update winner verification" on public.winner_proofs;
create policy "Admins update winner verification"
on public.winner_proofs for update to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role='admin'));

-- 5. Verify (run these to test)
-- select * from storage.buckets where id='winner-proofs';
-- select policyname from pg_policies where tablename='objects' and policyname like '%proof%';
