-- Prevents duplicate variant rows for the same photo. Duplicates were being
-- created by a race (a blur-triggered save + a mode-button click firing two
-- concurrent upserts, each inserting because neither saw the other's row yet),
-- amplified by .maybeSingle() erroring on >1 row and falling back to INSERT.
--
-- This migration (a) removes existing duplicates keeping the most recent row
-- per (product_id, image_url), and (b) adds a unique index so the API's upsert
-- (onConflict: product_id,image_url) can never duplicate again.
--
-- Transactional and idempotent (safe to run on dev and prod).
-- Run once in the Supabase SQL editor of EACH environment.

begin;

-- (a) Deduplicate: keep the highest id (latest save) per (product_id, image_url).
delete from product_variants a
using product_variants b
where a.product_id = b.product_id
  and a.image_url  = b.image_url
  and a.id < b.id;

-- (b) Enforce uniqueness going forward. A unique index (not a named constraint)
-- so "if not exists" makes re-runs a no-op. Works as an onConflict target.
create unique index if not exists product_variants_product_image_uniq
  on product_variants (product_id, image_url);

commit;
