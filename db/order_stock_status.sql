-- Records which stock effect an order has already applied, so admin status
-- transitions reconcile idempotently (even going back and forth between states):
--   'reserved' -> units held in product_variants.reserved
--   'shipped'  -> units removed from product_variants.stock (definitive)
--   'released' -> reservation freed (cancelled)
-- NULL = legacy order created before stock reservation existed. Such orders are
-- grandfathered: their status changes NEVER touch variant stock, keeping old
-- orders safe and idempotent. Run once in the Supabase SQL editor.

alter table orders
  add column if not exists stock_status text;
