import { withAdminAuth } from '../../../../lib/adminAuth'
import supabaseAdmin from '../../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  const { id } = req.query
  if (req.method === 'PATCH') {
    const { status, notes } = req.body
    const updates = {}
    if (status !== undefined) updates.status = status
    if (notes !== undefined) updates.notes = notes
    const { data, error } = await supabaseAdmin.from('orders').update(updates).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })

    // Deduct packaging when the order reaches its final "enviado" state — one
    // unit of each distinct category's default packaging, once per order.
    if (status === 'enviado' && data && !data.packaging_deducted) {
      await deductPackaging(data)
    }

    // Reconcile variant stock reservation on status change. Idempotent: applies
    // only the delta between the effect already applied (orders.stock_status) and
    // the target effect for the new status. Legacy orders (stock_status null) are
    // grandfathered inside applyStockEffect and never touch variant stock.
    if (status !== undefined && data) {
      const nextEffect = EFFECT_BY_STATUS[status]
      if (nextEffect && data.stock_status && data.stock_status !== nextEffect) {
        await applyStockEffect(data, nextEffect)
      }
    }
    return res.status(200).json(data)
  }
  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('orders').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }
  return res.status(405).end()
})

// ===== STOCK RESERVATION RECONCILIATION =====
// Map each order status to the stock effect it should have applied.
const EFFECT_BY_STATUS = {
  nuevo: 'reserved', procesando: 'reserved', listo: 'reserved',
  enviado: 'shipped', cancelado: 'released',
}
// Per-unit contribution of each effect, relative to the untouched baseline:
//   reserved -> +1 in reserved, stock unchanged
//   shipped  -> reservation freed, -1 in stock (definitive discount)
//   released -> reservation freed, stock unchanged
const EFFECT_CONTRIB = {
  reserved: { reserved: 1, stock: 0 },
  shipped: { reserved: 0, stock: -1 },
  released: { reserved: 0, stock: 0 },
}

// Apply only the DELTA between the order's already-applied effect and the target
// effect, per real-stock variant. Guarded (floors at 0) and idempotent. Legacy
// orders (stock_status null) are grandfathered: they never reserved anything, so
// we leave variant stock untouched. Best-effort — never blocks the status update.
async function applyStockEffect(order, nextEffect) {
  try {
    const prevEffect = order.stock_status
    if (!prevEffect || prevEffect === nextEffect) return // legacy or no change

    const prevC = EFFECT_CONTRIB[prevEffect] || { reserved: 0, stock: 0 }
    const nextC = EFFECT_CONTRIB[nextEffect] || { reserved: 0, stock: 0 }
    const dReserved = nextC.reserved - prevC.reserved
    const dStock = nextC.stock - prevC.stock

    if (dReserved !== 0 || dStock !== 0) {
      const items = Array.isArray(order.items) ? order.items : []
      const ids = [...new Set(items.map(it => it && it.variantId).filter(v => v != null))]
      if (ids.length) {
        const { data: variants } = await supabaseAdmin
          .from('product_variants')
          .select('id, stock, reserved, on_demand')
          .in('id', ids)
        const vmap = {}
        ;(variants || []).forEach(v => { vmap[v.id] = v })

        for (const it of items) {
          if (it.variantId == null) continue
          const v = vmap[it.variantId]
          if (!v || v.on_demand) continue // unlimited: never reserved
          const qty = Number(it.qty) || 0
          if (qty <= 0) continue
          const nextReserved = Math.max(0, Number(v.reserved || 0) + dReserved * qty)
          const nextStock = Math.max(0, Number(v.stock || 0) + dStock * qty)
          await supabaseAdmin
            .from('product_variants')
            .update({ reserved: nextReserved, stock: nextStock })
            .eq('id', it.variantId)
          // Keep local copy current in case the same variant repeats across items.
          v.reserved = nextReserved
          v.stock = nextStock
        }
      }
    }

    await supabaseAdmin.from('orders').update({ stock_status: nextEffect }).eq('id', order.id)
  } catch (err) {
    console.error('applyStockEffect error:', err)
  }
}

// Deduct one unit of packaging for each distinct product category present in
// the order. Category → packaging is the categories.packaging_id relation.
// Best-effort and idempotent: guarded by orders.packaging_deducted, floors at 0,
// and never blocks the status update if something goes wrong.
async function deductPackaging(order) {
  try {
    const items = Array.isArray(order.items) ? order.items : []
    const slugs = [...new Set(items.map(it => it && it.category).filter(Boolean))]
    if (slugs.length === 0) {
      await supabaseAdmin.from('orders').update({ packaging_deducted: true }).eq('id', order.id)
      return
    }

    const { data: cats } = await supabaseAdmin
      .from('categories')
      .select('slug, packaging_id')
      .in('slug', slugs)

    const packagingIds = [...new Set((cats || []).map(c => c.packaging_id).filter(Boolean))]
    if (packagingIds.length) {
      const { data: materials } = await supabaseAdmin
        .from('packaging_inventory')
        .select('id, qty')
        .in('id', packagingIds)

      for (const m of materials || []) {
        const next = Math.max(0, Number(m.qty || 0) - 1)
        await supabaseAdmin
          .from('packaging_inventory')
          .update({ qty: next, updated_at: new Date().toISOString() })
          .eq('id', m.id)
      }
    }

    await supabaseAdmin.from('orders').update({ packaging_deducted: true }).eq('id', order.id)
  } catch (err) {
    console.error('deductPackaging error:', err)
  }
}
