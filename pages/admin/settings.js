import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'

export default function SettingsPage() {
  const router = useRouter()
  const [bcv, setBcv] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function fetchData() {
    const sRes = await fetch('/api/admin/settings')
    if (sRes.status === 401) { router.push('/admin/login'); return }
    const s = await sRes.json()
    setBcv(String(s.bcv_rate))
  }
  useEffect(() => { fetchData() }, [])

  async function saveBcv() {
    if (!bcv || isNaN(Number(bcv))) return showToast('Tasa invalida')
    setSaving(true)
    const res = await fetch('/api/admin/settings', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ bcv_rate: Number(bcv) }) })
    setSaving(false)
    showToast(res.ok ? 'Tasa BCV actualizada' : 'Error al guardar')
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
    </AdminLayout>
  )
}
