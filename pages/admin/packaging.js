import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

const emptyForm = { name: '', qty: '', unit_cost: '' }

export default function PackagingPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState(emptyForm)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  async function fetchItems() {
    setLoading(true)
    const res = await fetch('/api/admin/packaging')
    if (!res.ok) {
      setItems([]); setLoading(false); showToast('Error cargando empaques'); return
    }
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleAdd() {
    if (!form.name.trim()) return showToast('El nombre es requerido')
    setSaving(true)
    const res = await fetch('/api/admin/packaging', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        qty: Number(form.qty || 0),
        unit_cost: form.unit_cost === '' ? null : Number(form.unit_cost),
      }),
    })
    setSaving(false)
    if (!res.ok) { const d = await res.json(); showToast(d.error || 'Error al guardar'); return }
    setForm(emptyForm)
    showToast('Empaque agregado')
    fetchItems()
  }

  async function handleFieldUpdate(id, field, value) {
    const res = await fetch(`/api/admin/packaging/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    if (!res.ok) { const d = await res.json(); showToast(d.error || 'No se pudo guardar el cambio'); return }
    fetchItems()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este empaque? Las categorías que lo usaban quedarán sin empaque.')) return
    const res = await fetch(`/api/admin/packaging/${id}`, { method: 'DELETE' })
    if (!res.ok) { const d = await res.json(); showToast(d.error || 'Error eliminando'); return }
    showToast('Empaque eliminado')
    fetchItems()
  }

  const totals = useMemo(() => items.reduce((acc, it) => {
    const qty = Number(it.qty || 0)
    const cost = Number(it.unit_cost || 0)
    acc.qty += qty
    acc.invested += qty * cost
    return acc
  }, { qty: 0, invested: 0 }), [items])

  const inputStyle = {
    width: '100%', border: '1.5px solid #fce7f3', borderRadius: 10,
    padding: '10px 12px', fontSize: 14, fontFamily: 'Poppins,sans-serif', outline: 'none',
  }
  const labelStyle = { fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }
  const cellStyle = { borderBottom: '1px solid #fce7f3', padding: 8, verticalAlign: 'top' }

  return (
    <AdminLayout title="Empaques">
      {toast && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', background: '#E91E8C', color: 'white', padding: '10px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14, zIndex: 200 }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>📦 Empaques</h2>
      </div>

      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
        Materiales de empaque (cajas, bolsas, etc.). Se descuenta 1 unidad del empaque de cada categoría
        presente en un pedido cuando lo marcas como <strong>Enviado</strong>. Asigna el empaque por defecto de cada categoría en <strong>Categorías</strong>.
      </p>

      <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Agregar empaque</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Material</label>
            <input name="name" value={form.name} onChange={handleFormChange} placeholder="Ej: Cajita rosada" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Cantidad</label>
            <input name="qty" type="number" value={form.qty} onChange={handleFormChange} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Costo unit. (opcional)</label>
            <input name="unit_cost" type="number" step="0.01" value={form.unit_cost} onChange={handleFormChange} placeholder="—" style={inputStyle} />
          </div>
        </div>
        <button onClick={handleAdd} disabled={saving} style={{ width: '100%', marginTop: 12, background: '#E91E8C', color: 'white', border: 'none', borderRadius: 12, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
          {saving ? 'Guardando...' : 'Agregar empaque'}
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Resumen</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: '#fff7fb', padding: 12, borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Unidades totales</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{totals.qty}</div>
          </div>
          <div style={{ background: '#fff7fb', padding: 12, borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Invertido en empaques</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>${totals.invested.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#9ca3af' }}>Cargando empaques...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#9ca3af' }}>Aún no hay empaques registrados</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#fff7fb' }}>
                <th style={cellStyle}>Material</th>
                <th style={cellStyle}>Cantidad</th>
                <th style={cellStyle}>Costo unit.</th>
                <th style={cellStyle}>Valor total</th>
                <th style={cellStyle}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const qty = Number(item.qty || 0)
                const cost = item.unit_cost == null ? null : Number(item.unit_cost)
                const total = qty * (cost || 0)
                return (
                  <tr key={item.id}>
                    <td style={cellStyle}>
                      <input defaultValue={item.name || ''} onBlur={e => handleFieldUpdate(item.id, 'name', e.target.value)} style={inputStyle} />
                    </td>
                    <td style={cellStyle}>
                      <input type="number" defaultValue={qty} onBlur={e => handleFieldUpdate(item.id, 'qty', e.target.value)} style={{ ...inputStyle, width: 90 }} />
                    </td>
                    <td style={cellStyle}>
                      <input type="number" step="0.01" defaultValue={cost == null ? '' : cost} placeholder="—" onBlur={e => handleFieldUpdate(item.id, 'unit_cost', e.target.value)} style={{ ...inputStyle, width: 110 }} />
                    </td>
                    <td style={cellStyle}><strong>${total.toFixed(2)}</strong></td>
                    <td style={cellStyle}>
                      <button onClick={() => handleDelete(item.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: 8, padding: '10px 12px', color: '#dc2626', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
