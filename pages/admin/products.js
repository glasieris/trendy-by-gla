import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'

const EMPTY = { id:'', name:'', category_slug:'Satin', is_hair:false, has_fabrics:false, price_detal:'', price_mayor:'', min_mayor:'6', description:'', image_url:'' }

function Toast({ msg, ok }) {
  return msg ? <div style={{ position:'fixed', bottom:90, left:'50%', transform:'translateX(-50%)', background: ok ? '#E91E8C' : '#dc2626', color:'white', padding:'10px 20px', borderRadius:12, fontWeight:600, fontSize:14, zIndex:200, whiteSpace:'nowrap' }}>{msg}</div> : null
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imgPreview, setImgPreview] = useState(null)
  const [imgBase64, setImgBase64] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg:'', ok:true })
  const fileRef = useRef()

  function showToast(msg, ok=true) {
    setToast({ msg, ok })
    setTimeout(() => setToast({ msg:'', ok:true }), 2500)
  }

  async function fetchData() {
    const [pRes, cRes] = await Promise.all([fetch('/api/admin/products'), fetch('/api/admin/categories')])
    if (pRes.status === 401) { router.push('/admin/login'); return }
    setProducts(await pRes.json())
    setCategories(await cRes.json())
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function openNew() {
    setForm(EMPTY)
    setImgPreview(null)
    setImgBase64(null)
    setEditing('new')
  }

  function openEdit(p) {
    setForm({ ...p, price_detal: String(p.price_detal), price_mayor: String(p.price_mayor), min_mayor: String(p.min_mayor) })
    setImgPreview(p.image_url || null)
    setImgBase64(null)
    setEditing(p)
  }

  function handleImg(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const max = 800
        let w = img.width, h = img.height
        if (w > max) { h = Math.round(h * max / w); w = max }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        const b64 = canvas.toDataURL('image/jpeg', 0.82)
        setImgPreview(b64)
        setImgBase64(b64)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!form.name || !form.price_detal || !form.price_mayor) return showToast('Nombre y precios son requeridos', false)
    setSaving(true)
    let image_url = form.image_url || null

    if (imgBase64) {
      const productId = form.id || form.name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20) + '-' + Date.now()
      const upRes = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: imgBase64, productId: form.id || productId, mimeType: 'image/jpeg' })
      })
      if (upRes.ok) {
        const upData = await upRes.json()
        image_url = upData.url
      }
    }

    const body = { ...form, price_detal: parseFloat(form.price_detal), price_mayor: parseFloat(form.price_mayor), min_mayor: parseInt(form.min_mayor) || 999, image_url }

    let res
    if (editing === 'new') {
      if (!form.id) return showToast('El ID del producto es requerido (ej: s10)', false)
      res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else {
      res = await fetch(`/api/admin/products/${form.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }

    setSaving(false)
    if (res.ok) {
      showToast(editing === 'new' ? 'Producto creado' : 'Cambios guardados')
      setEditing(null)
      fetchData()
    } else {
      const d = await res.json()
      showToast(d.error || 'Error al guardar', false)
    }
  }

  async function handleDelete(p) {
    if (!confirm('Eliminar "' + p.name + '"? Esta accion no se puede deshacer.')) return
    const res = await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Producto eliminado'); fetchData() }
    else showToast('Error al eliminar', false)
  }

  async function toggleActive(p) {
    await fetch(`/api/admin/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !p.active }) })
    fetchData()
  }

  const inp = { width:'100%', border:'1.5px solid #fce7f3', borderRadius:10, padding:'10px 12px', fontSize:14, fontFamily:'Poppins,sans-serif', outline:'none', marginBottom:10 }
  const labelStyle = { fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:4 }

  if (editing !== null) {
    const isNew = editing === 'new'
    return (
      <AdminLayout title={isNew ? 'Nuevo Producto' : 'Editar Producto'}>
        <Toast {...toast} />
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <button onClick={() => setEditing(null)} style={{ background:'#fce7f3', border:'none', borderRadius:10, padding:'8px 14px', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>&larr; Volver</button>
          <h2 style={{ fontSize:18, fontWeight:700 }}>{isNew ? 'Nuevo Producto' : 'Editar: ' + form.name}</h2>
        </div>

        <div style={{ marginBottom:16, textAlign:'center' }}>
          <div onClick={() => fileRef.current.click()} style={{ width:140, height:140, borderRadius:16, overflow:'hidden', background:'#fce7f3', margin:'0 auto 8px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', border:'2px dashed #E91E8C' }}>
            {imgPreview ? <img src={imgPreview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:32 }}>+</span>}
          </div>
          <button onClick={() => fileRef.current.click()} style={{ background:'#fce7f3', border:'none', borderRadius:10, padding:'8px 16px', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:13, color:'#E91E8C' }}>
            {imgPreview ? 'Cambiar foto' : 'Subir foto'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleImg} />
        </div>

        {isNew && (
          <div>
            <label style={labelStyle}>ID del producto (unico, sin espacios, ej: s10)</label>
            <input style={inp} value={form.id} onChange={e => setForm(f => ({...f, id: e.target.value.toLowerCase().replace(/\s/g,'')}))} placeholder="s10" />
          </div>
        )}

        <label style={labelStyle}>Nombre del producto</label>
        <input style={inp} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Ej: Scrunchies Satinados" />

        <label style={labelStyle}>Categoria</label>
        <select style={{...inp}} value={form.category_slug} onChange={e => setForm(f => ({...f, category_slug: e.target.value}))}>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div>
            <label style={labelStyle}>Precio Detal ($)</label>
            <input style={inp} type="number" step="0.01" value={form.price_detal} onChange={e => setForm(f => ({...f, price_detal: e.target.value}))} placeholder="0.00" />
          </div>
          <div>
            <label style={labelStyle}>Precio Mayor ($)</label>
            <input style={inp} type="number" step="0.01" value={form.price_mayor} onChange={e => setForm(f => ({...f, price_mayor: e.target.value}))} placeholder="0.00" />
          </div>
        </div>

        <label style={labelStyle}>Cantidad minima al mayor (ej: 6, o 999 si no aplica)</label>
        <input style={inp} type="number" value={form.min_mayor} onChange={e => setForm(f => ({...f, min_mayor: e.target.value}))} placeholder="6" />

        <label style={labelStyle}>Descripcion</label>
        <textarea style={{...inp, resize:'none', height:72}} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Describe el producto..." />

        <div style={{ display:'flex', gap:8, marginTop:4 }}>
          <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, cursor:'pointer' }}>
            <input type="checkbox" checked={form.has_fabrics} onChange={e => setForm(f => ({...f, has_fabrics: e.target.checked}))} /> Tiene colores de tela
          </label>
          <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, cursor:'pointer', marginLeft:16 }}>
            <input type="checkbox" checked={form.is_hair} onChange={e => setForm(f => ({...f, is_hair: e.target.checked}))} /> Es accesorio de cabello
          </label>
        </div>

        <button onClick={handleSave} disabled={saving}
          style={{ width:'100%', background:'#E91E8C', color:'white', border:'none', borderRadius:14, padding:'14px', fontWeight:700, fontSize:16, cursor:'pointer', fontFamily:'inherit', marginTop:20 }}>
          {saving ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </AdminLayout>
    )
  }

  const grouped = categories.reduce((acc, cat) => {
    acc[cat.slug] = products.filter(p => p.category_slug === cat.slug)
    return acc
  }, {})

  return (
    <AdminLayout title="Productos">
      <Toast {...toast} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <h2 style={{ fontSize:20, fontWeight:700 }}>Productos</h2>
        <button onClick={openNew}
          style={{ background:'#E91E8C', color:'white', border:'none', borderRadius:12, padding:'10px 18px', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>
          + Agregar
        </button>
      </div>

      {loading ? <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>Cargando...</div> : (
        categories.map(cat => (
          <div key={cat.slug} style={{ marginBottom:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#E91E8C', marginBottom:8, textTransform:'uppercase', letterSpacing:1 }}>{cat.label}</h3>
            {(grouped[cat.slug] || []).map(p => (
              <div key={p.id} style={{ background:'white', borderRadius:14, marginBottom:8, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 2px 6px rgba(0,0,0,0.05)', opacity: p.active ? 1 : 0.5 }}>
                <div style={{ width:52, height:52, borderRadius:10, overflow:'hidden', background:'#fce7f3', flexShrink:0 }}>
                  <img src={p.image_url || `/img/products/${p.id}.jpg`} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}
                       onError={e => { e.target.style.display='none' }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'#6b7280' }}>Detal: <strong style={{ color:'#E91E8C' }}>${Number(p.price_detal).toFixed(2)}</strong> &middot; Mayor: <strong>${Number(p.price_mayor).toFixed(2)}</strong></div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
                  <button onClick={() => openEdit(p)} style={{ background:'#fce7f3', border:'none', borderRadius:8, padding:'6px 12px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', color:'#E91E8C' }}>Editar</button>
                  <button onClick={() => toggleActive(p)} style={{ background: p.active ? '#f3f4f6' : '#dcfce7', border:'none', borderRadius:8, padding:'5px 10px', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>{p.active ? 'Ocultar' : 'Activar'}</button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </AdminLayout>
  )
}
