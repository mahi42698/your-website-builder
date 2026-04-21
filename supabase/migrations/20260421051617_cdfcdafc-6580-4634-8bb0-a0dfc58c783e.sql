
-- Replace broad SELECT policy with one that disallows listing.
-- Public access via signed/public URL still works because that path doesn't go through storage.objects SELECT.
drop policy if exists "Public can read leaf images" on storage.objects;

-- We make the bucket non-public listing but keep public file access via URL by setting bucket public=true (already set)
-- and only allow SELECT on storage.objects for authenticated users (used internally), not anon listing.
create policy "Authenticated can list leaf images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'leaf-images');
