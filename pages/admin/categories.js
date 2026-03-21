import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'

export default function CategoriesPage() {
  const router = useRouter()
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ slug:'', label:'', description:'' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function fetchCats() {
    const res = await fetch('/api/admin/categories')
    if (res.status === 401) { router.push('/admin/login'); return }
    setCats(await res.json())
    setLoading(false)
  }
  useEffect(() => { fetchCats() }, [])

  async function handleAdd() {
    if (!form.slug || !form.label) return showToast('Nombre e identificador son requeridos')
    setSaving(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setSaving(false)
    if (res.ok) { showToast('Categoria creada'); setAdding(false); setForm({ slug:'', label:'', description:'' }); fetchCats() }
    else { const d = await res.json(); showToast(d.error || 'Error') }
  }

  async function handleDelete(cat) {
    if (!confirm('Eliminar categoria "' + cat.label + '"?')) return
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Categoria eliminada'); fetchCats() }
    else { const d = await res.json(); showToast(d.error || 'Error') }
  }

  const inp = { width:'100%', border:'1.5px solid #fce7f3', borderRadius:10, padding:'10px 12px', fontSize:14, fontFamily:'Poppins,sans-serif', outline:'none', marginBottom:10 }

  return (
    <AdminLayout title="Categorias">
      {toast && <div style={{ position:'fixed', bottom:90, left:'50%', transform:'translateX(-50%)', background:'#E91E8C', color:'white', padding:'10px 20px', borderRadius:12, fontWeight:600, fontSize:14, zIndex:200 }}>{toast}</div>}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <h2 style={{ fontSize:20, fontWeight:700 }}>Categorias</h2>
        <button onClick={() => setAdding(!adding)}
          style={{ background:'#E91E8C', color:'white', border:'none', borderRadius:12, padding:'10px 18px', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>
          {adding ? 'Cancelar' : '+ Nueva'}
        </button>
      </div>

      {adding && (
        <div style={{ background:'white', borderRadius:16, padding:16, marginBottom:14, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight:700, marginBottom:12 }}>Nueva Categoria</h3>
          <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:4 }}>Identificador (sin espacios, ej: Accesorios)</label>
          <input style={inp} value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value.replace(/\s/g,'')}))} placeholder="MiCategoria" />
          <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:4 }}>Nombre visible</label>
          <input style={inp} value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))} placeholder="Mis Accesorios" />
          <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:4 }}>Descripcion (opcional)</label>
          <input style={inp} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Descripcion para la tienda" />
          <button onClick={handleAdd} disabled={saving}
            style={{ width:'100%', background:'#E91E8C', color:'white', border:'none', borderRadius:12, padding:'12px', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>
            {saving ? 'Guardando...' : 'Crear Categoria'}
          </button>
        </div>
      )}

      {loading ? <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>Cargando...</div> : cats.map(cat => (
        <div key={cat.id} style={{ background:'white', borderRadius:14, marginBottom:10, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 2px 6px rgba(0,0,0,0.05)' }}>
          <div>
            <div style={{ fontWeight:700, fontSize:15 }}>{cat.label}</div>
            <div style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>ID: {cat.slug}{cat.description ? ' - ' + cat.description.substring(0,40) : ''}</div>
          </div>
          <button onClick={() => handleDelete(cat)}
            style={{ background:'#fef2f2', border:'none', borderRadius:8, padding:'8px 14px', color:'#dc2626', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            Eliminar
          </button>
        </div>
      ))}
    </AdminLayout>
  )
}
