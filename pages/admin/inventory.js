import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'

const emptyForm = {
  sku: '',
  category: '',
  description: '',
  stock: '',
  purchase_price: '',
  sale_price: '',
  supplier: ''
}

export default function InventoryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState(emptyForm)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  async function fetchInventory() {
    setLoading(true)

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      showToast('Error cargando inventario')
      setItems([])
    } else {
      setItems(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleAddItem() {
    if (!form.sku || !form.category || !form.description) {
      return showToast('SKU, categoria y descripcion son requeridos')
    }

    setSaving(true)

    const payload = {
      sku: form.sku.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      stock: Number(form.stock || 0),
      purchase_price: Number(form.purchase_price || 0),
      sale_price: Number(form.sale_price || 0),
      supplier: form.supplier.trim()
    }

    const { error } = await supabase
      .from('inventory')
      .insert([payload])

    setSaving(false)

    if (error) {
      showToast(error.message || 'Error al guardar')
      return
    }

    setForm(emptyForm)
    showToast('Item agregado')
    fetchInventory()
  }

  async function handleFieldUpdate(id, field, value) {
    const numericFields = ['stock', 'purchase_price', 'sale_price']
    const finalValue = numericFields.includes(field) ? Number(value || 0) : value

    const { error } = await supabase
      .from('inventory')
      .update({ [field]: finalValue })
      .eq('id', id)

    if (error) {
      showToast('No se pudo guardar el cambio')
      return
    }

    fetchInventory()
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar este item del inventario?')) return

    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)

    if (error) {
      showToast('Error eliminando item')
      return
    }

    showToast('Item eliminado')
    fetchInventory()
  }

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const cantidad = Number(item.stock || 0)
        const costoCompra = Number(item.purchase_price || 0)
        const precioVenta = Number(item.sale_price || 0)

        const totalCompra = cantidad * costoCompra
        const totalVenta = cantidad * precioVenta
        const ganancia = totalVenta - totalCompra

        acc.cantidad += cantidad
        acc.totalCompra += totalCompra
        acc.totalVenta += totalVenta
        acc.ganancia += ganancia

        return acc
      },
      { cantidad: 0, totalCompra: 0, totalVenta: 0, ganancia: 0 }
    )
  }, [items])

  const inputStyle = {
    width: '100%',
    border: '1.5px solid #fce7f3',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    fontFamily: 'Poppins,sans-serif',
    outline: 'none'
  }

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 4,
    display: 'block'
  }

  const cellStyle = {
    borderBottom: '1px solid #fce7f3',
    padding: 8,
    verticalAlign: 'top'
  }

  return (
    <AdminLayout title="Inventario">
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#E91E8C',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            zIndex: 200
          }}
        >
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>📋 Inventario</h2>
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Agregar mercancía</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>SKU</label>
            <input name="sku" value={form.sku} onChange={handleFormChange} placeholder="SKU" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Categoria</label>
            <input name="category" value={form.category} onChange={handleFormChange} placeholder="Categoria" style={inputStyle} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Descripcion</label>
            <input name="description" value={form.description} onChange={handleFormChange} placeholder="Descripcion" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Cantidad</label>
            <input name="stock" type="number" value={form.stock} onChange={handleFormChange} placeholder="Cantidad" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Costo de compra</label>
            <input name="purchase_price" type="number" step="0.01" value={form.purchase_price} onChange={handleFormChange} placeholder="Costo de compra" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Precio venta</label>
            <input name="sale_price" type="number" step="0.01" value={form.sale_price} onChange={handleFormChange} placeholder="Precio venta" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Proveedor</label>
            <input name="supplier" value={form.supplier} onChange={handleFormChange} placeholder="Proveedor" style={inputStyle} />
          </div>
        </div>

        <button
          onClick={handleAddItem}
          disabled={saving}
          style={{
            width: '100%',
            marginTop: 12,
            background: '#E91E8C',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            padding: '12px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          {saving ? 'Guardando...' : 'Agregar item'}
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#9ca3af' }}>Cargando inventario...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1400 }}>
            <thead>
              <tr style={{ background: '#fff7fb' }}>
                <th style={cellStyle}>SKU</th>
                <th style={cellStyle}>Categoria</th>
                <th style={cellStyle}>Descripcion</th>
                <th style={cellStyle}>Cantidad</th>
                <th style={cellStyle}>Costo de compra</th>
                <th style={cellStyle}>Total compra</th>
                <th style={cellStyle}>Precio venta</th>
                <th style={cellStyle}>Total venta</th>
                <th style={cellStyle}>Ganancia</th>
                <th style={cellStyle}>Proveedor</th>
                <th style={cellStyle}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const cantidad = Number(item.stock || 0)
                const costoCompra = Number(item.purchase_price || 0)
                const precioVenta = Number(item.sale_price || 0)

                const totalCompra = cantidad * costoCompra
                const totalVenta = cantidad * precioVenta
                const ganancia = totalVenta - totalCompra

                return (
                  <tr key={item.id}>
                    <td style={cellStyle}>
                      <input
                        defaultValue={item.sku || ''}
                        onBlur={e => handleFieldUpdate(item.id, 'sku', e.target.value)}
                        style={inputStyle}
                      />
                    </td>

                    <td style={cellStyle}>
                      <input
                        defaultValue={item.category || ''}
                        onBlur={e => handleFieldUpdate(item.id, 'category', e.target.value)}
                        style={inputStyle}
                      />
                    </td>

                    <td style={cellStyle}>
                      <input
                        defaultValue={item.description || ''}
                        onBlur={e => handleFieldUpdate(item.id, 'description', e.target.value)}
                        style={inputStyle}
                      />
                    </td>

                    <td style={cellStyle}>
                      <input
                        type="number"
                        defaultValue={item.stock || 0}
                        onBlur={e => handleFieldUpdate(item.id, 'stock', e.target.value)}
                        style={inputStyle}
                      />
                    </td>

                    <td style={cellStyle}>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={item.purchase_price || 0}
                        onBlur={e => handleFieldUpdate(item.id, 'purchase_price', e.target.value)}
                        style={inputStyle}
                      />
                    </td>

                    <td style={cellStyle}>
                      <strong>${totalCompra.toFixed(2)}</strong>
                    </td>

                    <td style={cellStyle}>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={item.sale_price || 0}
                        onBlur={e => handleFieldUpdate(item.id, 'sale_price', e.target.value)}
                        style={inputStyle}
                      />
                    </td>

                    <td style={cellStyle}>
                      <strong>${totalVenta.toFixed(2)}</strong>
                    </td>

                    <td style={cellStyle}>
                      <strong style={{ color: ganancia >= 0 ? '#16a34a' : '#dc2626' }}>
                        ${ganancia.toFixed(2)}
                      </strong>
                    </td>

                    <td style={cellStyle}>
                      <input
                        defaultValue={item.supplier || ''}
                        onBlur={e => handleFieldUpdate(item.id, 'supplier', e.target.value)}
                        style={inputStyle}
                      />
                    </td>

                    <td style={cellStyle}>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: '#fef2f2',
                          border: 'none',
                          borderRadius: 8,
                          padding: '10px 12px',
                          color: '#dc2626',
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
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

      <div style={{ background: 'white', borderRadius: 16, padding: 16, marginTop: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Resumen</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: '#fff7fb', padding: 12, borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Cantidad total</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{totals.cantidad}</div>
          </div>

          <div style={{ background: '#fff7fb', padding: 12, borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Total compra</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>${totals.totalCompra.toFixed(2)}</div>
          </div>

          <div style={{ background: '#fff7fb', padding: 12, borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Total venta</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>${totals.totalVenta.toFixed(2)}</div>
          </div>

          <div style={{ background: '#fff7fb', padding: 12, borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Ganancia</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: totals.ganancia >= 0 ? '#16a34a' : '#dc2626' }}>
              ${totals.ganancia.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
