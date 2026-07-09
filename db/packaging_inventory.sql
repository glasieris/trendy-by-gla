-- Point 6: packaging inventory.
--
-- A small inventory of packaging materials (boxes, bags, etc.) that get
-- consumed when an order ships. Each category can point to one default
-- packaging material; when an order is marked "enviado", one unit of the
-- packaging for each distinct category present in the order is deducted
-- (once per order, guarded by orders.packaging_deducted).

-- 1) Packaging materials inventory.
create table if not exists packaging_inventory (
  id bigserial primary key,
  name text not null,
  qty integer not null default 0,
  unit_cost numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Default packaging per category (one per category, optional).
alter table categories
  add column if not exists packaging_id bigint
  references packaging_inventory(id) on delete set null;

-- 3) Idempotency flag so a given order never deducts packaging twice.
alter table orders
  add column if not exists packaging_deducted boolean not null default false;
