-- Point 4: remove the legacy standalone `inventory` table.
--
-- This table was a manually-maintained jewelry catalog (98 rows: SKU,
-- purchase_price, sale_price, supplier) fully independent from the real
-- sales catalog in `products` / `product_variants`. Stock reporting now
-- lives in the per-category metrics panel (/admin/metrics), computed from
-- products + variants. The table and its admin screens are being retired.
--
-- Confirmed by the owner: drop without backup (data no longer needed).
-- This is DESTRUCTIVE and irreversible — the 98 rows are permanently gone.

drop table if exists inventory;
