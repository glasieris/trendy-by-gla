-- Third photo mode: "Solo referencia" (reference_only=true). A reference photo
-- has a visible label but is NOT a buyable variant: no stock, no cost, excluded
-- from inventory/cost reports. Mutually exclusive with on_demand (when
-- reference_only is set the API forces on_demand=false and stock=0).
-- Existing variants keep the current behaviour (default false).
-- Run once in the Supabase SQL editor.

alter table product_variants
  add column if not exists reference_only boolean not null default false;
