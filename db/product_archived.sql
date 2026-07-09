-- Soft-delete flag for products. Archived products disappear from the active
-- admin list, the storefront and the category reports, but are NOT physically
-- deleted so historical orders keep showing their full info. Archiving also sets
-- active=false on the product and its variants; restoring reverses both.
-- Run once in the Supabase SQL editor.

alter table products
  add column if not exists archived boolean not null default false;

create index if not exists products_archived_idx on products (archived);
