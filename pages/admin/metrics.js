import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'

const money = n => '$' + Number(n || 0).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const num = n => Number(n || 0).toLocaleString('es-VE')

function Metric({ label, value, color }) {
  return (
    <div style={{ background: '#f9fafb', borderRadius: 10, padding: '8px 10px' }}>
      <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: color || '#1f2937', marginTop: 2 }}>{value}</div>
    </div>
  )
}

function CategoryCard({ m }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, marginBottom: 12, padding: 14, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#E91E8C' }}>{m.label}</h3>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{m.activeProducts} activo{m.activeProducts !== 1 ? 's' : ''}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
        <Metric label="Stock total" value={num(m.stockTotal)} />
        <Metric label="Agotados" value={num(m.agotados)} color={m.agotados > 0 ? '#dc2626' : '#1f2937'} />
        <Metric label="Costo invertido" value={money(m.costInvested)} />
        <Metric label="Valor de venta" value={money(m.saleValue)} />
        <Metric label="Ganancia potencial" value={money(m.profit)} color="#059669" />
      </div>
      {m.noCostCount > 0 && (
        <div style={{ marginTop: 10, fontSize: 12, color: '#92400e', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: '8px 10px' }}>
          ⚠️ {m.noCostCount} producto{m.noCostCount !== 1 ? 's' : ''} con stock sin costo definido — el costo invertido y la ganancia están incompletos para esta categoría.
        </div>
      )}
    </div>
  )
}

export default function MetricsPage() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchMetrics() {
    const res = await fetch('/api/admin/metrics')
    if (res.status === 401) { router.push('/admin/login'); return }
    if (res.ok) setData(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchMetrics() }, [])

  const t = data?.totals

  return (
    <AdminLayout title="Métricas">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>📊 Métricas por categoría</h2>
      <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>
        Stock, costo y valor se calculan solo desde productos con variantes, sumando las variantes en modo “Tengo stock”. Las “Bajo pedido” no cuentan como stock físico.
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Cargando métricas...</div>
      ) : !data ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>No se pudieron cargar las métricas.</div>
      ) : (
        <>
          {t && (
            <div style={{ background: 'linear-gradient(135deg,#E91E8C,#D81B60)', color: 'white', borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Totales</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
                <div><div style={{ fontSize: 11, opacity: 0.85 }}>Productos</div><div style={{ fontSize: 17, fontWeight: 800 }}>{num(t.activeProducts)}</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.85 }}>Stock total</div><div style={{ fontSize: 17, fontWeight: 800 }}>{num(t.stockTotal)}</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.85 }}>Invertido</div><div style={{ fontSize: 17, fontWeight: 800 }}>{money(t.costInvested)}</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.85 }}>Valor venta</div><div style={{ fontSize: 17, fontWeight: 800 }}>{money(t.saleValue)}</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.85 }}>Ganancia</div><div style={{ fontSize: 17, fontWeight: 800 }}>{money(t.profit)}</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.85 }}>Agotados</div><div style={{ fontSize: 17, fontWeight: 800 }}>{num(t.agotados)}</div></div>
              </div>
            </div>
          )}
          {data.rows.map(m => <CategoryCard key={m.slug} m={m} />)}
        </>
      )}
    </AdminLayout>
  )
}
