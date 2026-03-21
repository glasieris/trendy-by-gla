import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'

export default function SettingsPage() {
  const router = useRouter()
  const [bcv, setBcv] = useState('')
  const [colors, setColors] = useState([])
  const [saving, setSaving] = useState(false)
  const [newColor, setNewColor] = useState({ name:'', hex:'#E91E8C' })
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function fetchData() {
    const [sRes, cRes] = await Promise.all([fetch('/api/admin/settings'), fetch('/api/admin/fabric-colors')])
    if (sRes.status === 401) { router.push('/admin/login'); return }
    const s = await sRes.json()
    const c = await cRes.json()
    setBcv(String(s.bcv_rate))
    setColors(Array.isArray(c) ? c : [])
  }
  useEffect(() => { fetchData() }, [])

  async function saveBcv() {
    if (!bcv || isNaN(Number(bcv))) return showToast('Tasa invalida')
    setSaving(true)
    const res = await fetch('/api/admin/settings', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ bcv_rate: Number(bcv) }) })
    setSaving(false)
    showToast(res.ok ? 'Tasa BCV actualizada' : 'Error al guardar')
  }

  async function addColor() {
    if (!newColor.name || !newColor.hex) return
    const res = await fetch('/api/admin/fabric-colors', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(newColor) })
    if (res.ok) { showToast('Color agregado'); setNewColor({ name:'', hex:'#E91E8C' }); fetchData() }
    else showToast('Error')
  }

  async function deleteColor(id) {
    if (!confirm('Eliminar este color?')) return
    const res = await fetch(`/api/admin/fabric-colors/${id}`, { method:'DELETE' })
    if (res.ok) { showToast('Color eliminado'); fetchData() }
  }

  const inp = { border:'1.5px solid #fce7f3', borderRadius:10, padding:'10px 12px', fontSize:14, fontFamily:'Poppins,sans-serif', outline:'none' }

  return (
    <AdminLayout title="Configuracion">
      {toast && <div style={{ position:'fixed', bottom:90, left:'50%', transform:'translateX(-50%)', background:'#E91E8C', color:'white', padding:'10px 20px', borderRadius:12, fontWeight:600, fontSize:14, zIndex:200 }}>{toast}</div>}

      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>Configuracion</h2>

      <div style={{ background:'white', borderRadius:16, padding:20, marginBottom:16, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>Tasa BCV</h3>
        <p style={{ fontSize:13, color:'#9ca3af', marginBottom:14 }}>Se usa para mostrar los precios en Bolivares en la tienda.</p>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ position:'relative', flex:1 }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontWeight:600 }}>Bs</span>
            <input style={{...inp, paddingLeft:32, width:'100%'}} type="number" step="0.01" value={bcv} onChange={e => setBcv(e.target.value)} placeholder="443.26" />
          </div>
          <button onClick={saveBcv} disabled={saving}
            style={{ background:'#E91E8C', color:'white', border:'none', borderRadius:12, padding:'10px 20px', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}>
            {saving ? '...' : 'Guardar'}
          </button>
        </div>
        {bcv && <p style={{ fontSize:12, color:'#6b7280', marginTop:8 }}>Ejemplo: $10 = {(10 * Number(bcv)).toLocaleString('es-VE', {maximumFractionDigits:0})} Bs</p>}
      </div>

      <div style={{ background:'white', borderRadius:16, padding:20, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>Colores de Tela</h3>
        <p style={{ fontSize:13, color:'#9ca3af', marginBottom:14 }}>Los colores que aparecen cuando el cliente elige satin.</p>

        <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:16 }}>
          {colors.map(c => (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:6, background:'#f9fafb', borderRadius:10, padding:'6px 10px' }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:c.hex, border:'1.5px solid #e5e7eb' }} />
              <span style={{ fontSize:13, fontWeight:500 }}>{c.name}</span>
              <button onClick={() => deleteColor(c.id)} style={{ background:'none', border:'none', color:'#dc2626', cursor:'pointer', fontSize:16, lineHeight:1, padding:'0 2px' }}>x</button>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <input style={{...inp, flex:1, minWidth:120}} value={newColor.name} onChange={e => setNewColor(n => ({...n, name: e.target.value}))} placeholder="Nombre del color" />
          <input type="color" value={newColor.hex} onChange={e => setNewColor(n => ({...n, hex: e.target.value}))}
            style={{ width:48, height:44, border:'1.5px solid #fce7f3', borderRadius:10, cursor:'pointer', padding:2 }} />
          <button onClick={addColor}
            style={{ background:'#E91E8C', color:'white', border:'none', borderRadius:10, padding:'10px 16px', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>
            + Agregar
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
