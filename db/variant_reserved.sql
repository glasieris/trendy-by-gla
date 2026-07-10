-- On-hold (reserved) units per variant. Available = max(stock - reserved, 0).
-- Reserved is incremented when a customer places an order (units held while the
-- order is reviewed/approved), decremented when the order is cancelled, and both
-- reserved and stock drop when the order is marked "enviado" (definitive discount).
-- "Bajo pedido" (on_demand) variants and products without variants are unlimited
-- and never reserved. Run once in the Supabase SQL editor.

alter table product_variants
  add column if not exists reserved integer not null default 0;
