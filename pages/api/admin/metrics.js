import { withAdminAuth } from '../../../lib/adminAuth'
import supabaseAdmin from '../../../lib/supabaseAdmin'

// Per-category business metrics. Stock/cost/value are computed ONLY from products
// that have at least one variant (option B), summing the stock of "Tengo stock"
// variants (on_demand=false). "Bajo pedido" variants are never counted as physical
// stock. Cost is admin-only, so this endpoint stays behind withAdminAuth.
export default withAdminAuth(async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const [catsRes, prodsRes, varsRes] = await Promise.all([
    supabaseAdmin.from('categories').select('slug, label').order('sort_order'),
    supabaseAdmin.from('products').select('id, category_slug, price_detal, cost, active').eq('active', true).eq('archived', false),
    supabaseAdmin.from('product_variants').select('product_id, stock, on_demand').eq('active', true),
  ])
  if (prodsRes.error) return res.status(500).json({ error: prodsRes.error.message })
  if (varsRes.error) return res.status(500).json({ error: varsRes.error.message })

  const categories = catsRes.data ?? []
  const products = prodsRes.data ?? []
  const variants = varsRes.data ?? []

  // Group variants by product: physical stock (Tengo stock only) + whether the
  // product has any physical-stock variant at all.
  const byProduct = {}
  for (const v of variants) {
    const g = (byProduct[v.product_id] ||= { hasAnyVariant: false, hasPhysical: false, physicalStock: 0 })
    g.hasAnyVariant = true
    if (!v.on_demand) { g.hasPhysical = true; g.physicalStock += Number(v.stock) || 0 }
  }

  // Seed metrics per category (include a bucket for any orphan category_slug too).
  const metrics = {}
  const ensure = (slug, label) => (metrics[slug] ||= {
    slug, label: label || slug,
    activeProducts: 0, stockTotal: 0, costInvested: 0, saleValue: 0, profit: 0,
    agotados: 0, noCostCount: 0,
  })
  categories.forEach(c => ensure(c.slug, c.label))

  for (const p of products) {
    const m = ensure(p.category_slug)
    m.activeProducts += 1

    const g = byProduct[p.id]
    if (!g || !g.hasAnyVariant) continue // option B: products without variants are excluded from stock reports

    const stock = g.physicalStock
    const cost = p.cost == null ? 0 : Number(p.cost)
    const price = Number(p.price_detal) || 0

    m.stockTotal += stock
    m.costInvested += stock * cost
    m.saleValue += stock * price
    if (g.hasPhysical && stock === 0) m.agotados += 1
    if (stock > 0 && p.cost == null) m.noCostCount += 1
  }

  const rows = Object.values(metrics).map(m => ({ ...m, profit: m.saleValue - m.costInvested }))

  // Totals across all categories.
  const totals = rows.reduce((t, m) => ({
    activeProducts: t.activeProducts + m.activeProducts,
    stockTotal: t.stockTotal + m.stockTotal,
    costInvested: t.costInvested + m.costInvested,
    saleValue: t.saleValue + m.saleValue,
    profit: t.profit + m.profit,
    agotados: t.agotados + m.agotados,
    noCostCount: t.noCostCount + m.noCostCount,
  }), { activeProducts: 0, stockTotal: 0, costInvested: 0, saleValue: 0, profit: 0, agotados: 0, noCostCount: 0 })

  return res.status(200).json({ rows, totals })
})
