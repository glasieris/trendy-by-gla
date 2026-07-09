-- Internal (admin-only) product fields: unit cost and provider name.
-- These are NEVER exposed by the public API: /api/config builds its response
-- from an explicit column whitelist and also selects explicit columns.
-- Run once in the Supabase SQL editor.

alter table products
  add column if not exists cost     numeric(10,2),   -- internal unit cost (NULL = undefined)
  add column if not exists provider text;            -- provider name (NULL = undefined)
