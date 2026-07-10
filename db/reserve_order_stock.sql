-- Atomically reserve real stock for the variants in an order, with row-level
-- locking so concurrent checkouts can never over-sell. For each item:
--   * no variantId            -> unlimited (products have no stock): skip
--   * variant is on_demand    -> "Bajo pedido", unlimited: skip
--   * otherwise               -> grant least(qty, available) and bump reserved
-- Availability is stock - reserved (floored at 0). If the granted amount is less
-- than requested, the order is auto-adjusted (adjusted=true) and the caller must
-- clamp/drop the item and warn the customer with the exact change.
--
-- Returns: { "granted": [ { "variantId": <id>, "requested": <n>, "granted": <n> } ],
--            "adjusted": <bool> }
-- Only real-stock variants appear in "granted"; unlimited items are left untouched
-- by the caller. Run once in the Supabase SQL editor.

create or replace function reserve_order_stock(p_items jsonb)
returns jsonb
language plpgsql
as $$
declare
  it           jsonb;
  v_variant_id bigint;
  v_qty        integer;
  v_stock      integer;
  v_reserved   integer;
  v_on_demand  boolean;
  v_available  integer;
  v_grant      integer;
  v_granted    jsonb := '[]'::jsonb;
  v_adjusted   boolean := false;
begin
  for it in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
  loop
    -- Items without a variant are unlimited (products carry no stock).
    if (it ->> 'variantId') is null then
      continue;
    end if;

    v_variant_id := (it ->> 'variantId')::bigint;
    v_qty := coalesce((it ->> 'qty')::integer, 0);
    if v_qty <= 0 then
      continue;
    end if;

    -- Lock the variant row so parallel checkouts serialize on it.
    select stock, reserved, on_demand
      into v_stock, v_reserved, v_on_demand
      from product_variants
      where id = v_variant_id
      for update;

    -- Unknown variant or "Bajo pedido": unlimited, nothing to reserve.
    if not found or coalesce(v_on_demand, false) then
      continue;
    end if;

    v_available := greatest(coalesce(v_stock, 0) - coalesce(v_reserved, 0), 0);
    v_grant := least(v_qty, v_available);

    if v_grant > 0 then
      update product_variants
        set reserved = reserved + v_grant
        where id = v_variant_id;
    end if;

    if v_grant < v_qty then
      v_adjusted := true;
    end if;

    v_granted := v_granted || jsonb_build_object(
      'variantId', v_variant_id,
      'requested', v_qty,
      'granted',   v_grant
    );
  end loop;

  return jsonb_build_object('granted', v_granted, 'adjusted', v_adjusted);
end;
$$;
