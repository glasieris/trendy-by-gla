import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function InventoryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetchInventory()
  }, [])

  async function fetchInventory() {
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      setErrorMsg(error.message)
      setItems([])
    } else {
      setItems(data || [])
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '8px' }}>Inventario</h1>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Panel interno de stock
      </p>

      {loading && <p>Cargando inventario...</p>}
      {errorMsg && <p style={{ color: 'red' }}>Error: {errorMsg}</p>}

      {!loading && !errorMsg && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Producto</th>
              <th style={th}>SKU</th>
              <th style={th}>Stock</th>
              <th style={th}>Compra</th>
              <th style={th}>Venta</th>
              <th style={th}>Mínimo</th>
              <th style={th}>Proveedor</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={td}>{item.id}</td>
                <td style={td}>{item.product_name}</td>
                <td style={td}>{item.sku}</td>
                <td style={td}>{item.stock}</td>
                <td style={td}>{item.purchase_price}</td>
                <td style={td}>{item.sale_price}</td>
                <td style={td}>{item.min_stock}</td>
                <td style={td}>{item.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const th = {
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  padding: '10px',
  background: '#f7f7f7'
}

const td = {
  borderBottom: '1px solid #eee',
  padding: '10px'
}
