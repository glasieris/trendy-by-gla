-- Selectable product variants (each is an uploaded photo given a name + stock).
-- Same price as the parent product; stock is manual and only drives the
-- "Agotado" state in the storefront (no automatic decrement on purchase).
-- Run once in the Supabase SQL editor.

create table if not exists product_variants (
  id           bigint generated always as identity primary key,
  product_id   text    not null references products(id) on delete cascade,
  label        text    not null,            -- variant name: "Rosa", "Azul", "Modelo A"
  image_url    text,                        -- the variant's photo
  stock        integer not null default 0,  -- manual stock; 0 => shown as "Agotado"
  active       boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists product_variants_product_id_idx on product_variants (product_id);
