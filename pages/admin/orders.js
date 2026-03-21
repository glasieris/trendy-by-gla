import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'

const STATUS_LABELS = { nuevo: '🔵 Nuevo', procesando: '🟡 Procesando', listo: '🟢 Listo', enviado: '✅ Enviado' }
const STATUS_COLORS = { nuevo: '#dbeafe', procesando: '#fef9c3', listo: '#dcfce7', enviado: '#f3f4f6' }

function OrderCard({ order, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState(order.status)
  const [notes, setNotes] = useState(order.notes || '')
  const [saving, setSaving] = useState(false)

  const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]')

  async function saveChanges() {
    setSaving(true)
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })
    setSaving(false)
    if (res.ok) onUpdate()
  }

  const date = new Date(order.created_at).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ background: 'white', borderRadius: 16, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#E91E8C' }}>{order.order_num}</div>
          <div style={{ fontWeight: 600, fontSize: 15, marginTop: 2 }}>{order.customer_name}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{date} · {order.delivery_label}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: '#E91E8C' }}>${Number(order.grand).toFixed(2)}</div>
          <div style={{ fontSize: 11, background: STATUS_COLORS[order.status] || '#f3f4f6', padding: '2px 8px', borderRadius: 20, marginTop: 4, display: 'inline-block' }}>
            {STATUS_LABELS[order.status] || order.status}
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #fce7f3', padding: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, marginBottom: 6 }}>PRODUCTOS</div>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', borderBottom: '1px solid #f9fafb' }}>
                <span>{item.name}{item.color ? ` · ${item.color}` : ''} x{item.qty}</span>
                <span style={{ fontWeight: 600 }}>${Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
            {order.gift && <div style={{ fontSize: 12, color: '#E91E8C', marginTop: 6 }}>🎁 Empaque regalo +$1.00{order.gift_msg ? ` — "${order.gift_msg}"` : ''}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12, fontSize: 13 }}>
            <div><span style={{ color: '#9ca3af' }}>Teléfono:</span> <strong>{order.customer_phone}</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Pago:</span> <strong>{order.payment}</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Entrega:</span> <strong>{order.delivery_label}</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Total:</span> <strong style={{ color: '#E91E8C' }}>${Number(order.grand).toFixed(2)}</strong></div>
          </div>

          {order.delivery_info && Object.keys(order.delivery_info).length > 0 && (
            <div style={{ background: '#fff7fb', borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12 }}>
              {Object.entries(order.delivery_info).map(([k, v]) => v ? <div key={k}><strong>{k}:</strong> {v}</div> : null)}
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Estado del pedido</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              style={{ width: '100%', border: '1.5px solid #fce7f3', borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: 'Poppins, sans-serif', background: 'white' }}>
              <option value="nuevo">🔵 Nuevo</option>
              <option value="procesando">🟡 Procesando</option>
              <option value="listo">🟢 Listo para entregar</option>
              <option value="enviado">✅ Enviado</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Notas internas</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ej: Pagó el martes, empacado..."
              style={{ width: '100%', border: '1.5px solid #fce7f3', borderRadius: 10, padding: '10px 12px', fontSize: 13, fontFamily: 'Poppins, sans-serif', resize: 'none', height: 72 }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveChanges} disabled={saving}
              style={{ flex: 1, background: '#E91E8C', color: 'white', border: 'none', borderRadius: 12, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              {saving ? 'Guardando...' : '💾 Guardar'}
            </button>
            <a href={`https://wa.me/${order.customer_phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
              style={{ flex: 1, background: '#25D366', color: 'white', border: 'none', borderRadius: 12, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              💬 WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('todos')
  const [loading, setLoading] = useState(true)

  async function fetchOrders() {
    const res = await fetch(`/api/admin/orders?status=${filter}`)
    if (res.status === 401) { router.push('/admin/login'); return }
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { setLoading(true); fetchOrders() }, [filter])

  const filters = [
    { value: 'todos', label: 'Todos' },
    { value: 'nuevo', label: '🔵 Nuevo' },
    { value: 'procesando', label: '🟡 En proceso' },
    { value: 'listo', label: '🟢 Listo' },
    { value: 'enviado', label: '✅ Enviado' },
  ]

  return (
    <AdminLayout title="Pedidos">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>📦 Pedidos</h2>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
        {filters.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: '1.5px solid', borderColor: filter === f.value ? '#E91E8C' : '#fce7f3', background: filter === f.value ? '#E91E8C' : 'white', color: filter === f.value ? 'white' : '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
          <p>No hay pedidos {filter !== 'todos' ? `con estado "${filter}"` : 'aún'}</p>
        </div>
      ) : (
        orders.map(order => <OrderCard key={order.id} order={order} onUpdate={fetchOrders} />)
      )}
    </AdminLayout>
  )
}
