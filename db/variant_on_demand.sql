-- Per-variant stock mode: "Tengo stock" (on_demand=false, default) vs
-- "Bajo pedido" (on_demand=true = always available, ignores the stock number).
-- Existing variants keep the current behaviour (default false).
-- Run once in the Supabase SQL editor.

alter table product_variants
  add column if not exists on_demand boolean not null default false;
