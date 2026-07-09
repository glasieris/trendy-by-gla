import { withAdminAuth } from '../../../../../../lib/adminAuth'
import supabaseAdmin from '../../../../../../lib/supabaseAdmin'

// Variants for a product. A variant is an uploaded photo that has been given a
// name (label) and its own stock. Keyed by (product_id, image_url) so the admin
// can turn any existing photo into a buyable variant.
export default withAdminAuth(async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .select('*')
      .eq('product_id', id)
      .order('sort_order')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data ?? [])
  }

  if (req.method === 'POST') {
    // Upsert a variant for a given photo (image_url).
    const { image_url, label, stock, sort_order, on_demand, reference_only } = req.body
    if (!image_url) return res.status(400).json({ error: 'image_url requerido' })

    const cleanLabel = String(label || '').trim()

    // Empty label => this photo is no longer a variant: remove any row for it
    // (matched by product_id+image_url, so it also cleans up stray duplicates).
    if (!cleanLabel) {
      await supabaseAdmin.from('product_variants').delete().eq('product_id', id).eq('image_url', image_url)
      return res.status(200).json({ deleted: true })
    }

    // "Solo referencia" is mutually exclusive with the buyable modes: force
    // on_demand=false and stock=0 so a reference photo never carries stock/cost.
    const isReference = !!reference_only
    const payload = {
      product_id: id,
      image_url,
      label: cleanLabel,
      stock: isReference ? 0 : Number(stock || 0),
      on_demand: isReference ? false : !!on_demand,
      reference_only: isReference,
    }
    // Only touch sort_order when the client sends it, so mode changes don't reset
    // ordering (on insert the column default applies; on conflict it's preserved).
    if (sort_order !== undefined) payload.sort_order = Number(sort_order || 0)

    // Atomic upsert keyed by (product_id, image_url): the DB unique index from
    // db/variant_unique_constraint.sql guarantees no duplicate variant rows can
    // ever be created for the same photo (fixes the buyable/reference duplication).
    // NOTE: never use .single() here. It throws PGRST116 ("Cannot coerce the
    // result to a single JSON object") whenever the returned set isn't exactly
    // one row (0 or >1), which can happen transiently. We upsert, then read the
    // canonical row back explicitly, so the response is always well-formed.
    let up = await supabaseAdmin
      .from('product_variants')
      .upsert(payload, { onConflict: 'product_id,image_url' })
      .select()

    // Fallback if the unique index isn't in place yet (upsert has no conflict
    // target to match): self-healing manual upsert — update the first matching
    // row, delete any stray duplicates, or insert when none exists.
    if (up.error) {
      const { data: rows } = await supabaseAdmin
        .from('product_variants')
        .select('id')
        .eq('product_id', id)
        .eq('image_url', image_url)
        .order('id', { ascending: true })
      if (rows && rows.length) {
        const extra = rows.slice(1).map(r => r.id)
        if (extra.length) await supabaseAdmin.from('product_variants').delete().in('id', extra)
        up = await supabaseAdmin.from('product_variants').update(payload).eq('id', rows[0].id).select()
      } else {
        up = await supabaseAdmin.from('product_variants').insert(payload).select()
      }
    }

    if (up.error) return res.status(500).json({ error: up.error.message })

    // Return the stored row (re-read to be safe, independent of upsert RETURNING).
    const { data: saved } = await supabaseAdmin
      .from('product_variants')
      .select('*')
      .eq('product_id', id)
      .eq('image_url', image_url)
      .order('id', { ascending: false })
      .limit(1)
    const row = (saved && saved[0]) || (Array.isArray(up.data) ? up.data[0] : up.data) || null
    return res.status(200).json(row)
  }

  return res.status(405).end()
})
