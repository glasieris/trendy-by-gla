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
    return res.status(200).json(data)
  }
  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('orders').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }
  return res.status(405).end()
})

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
