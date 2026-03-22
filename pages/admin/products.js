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
  const [editing, setEditing] = useState(null) // null | 'new' | product object
  const [form, setForm] = useState(EMPTY)
  const [productImages, setProductImages] = useState([]) // {id, url, sort_order}[]
  const [imgUploading, setImgUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg:'', ok:true })
  const imgRef = useRef()

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

  async function fetchProductImages(productId) {
    const res = await fetch(`/api/admin/products/${productId}/images`)
    if (res.ok) setProductImages(await res.json())
    else setProductImages([])
  }

  function openNew() {
    setForm(EMPTY)
    setProductImages([])
    setEditing('new')
  }

  function openEdit(p) {
    setForm({ ...p, price_detal: String(p.price_detal), price_mayor: String(p.price_mayor), min_mayor: String(p.min_mayor) })
    setProductImages([])
    setEditing(p)
    fetchProductImages(p.id)
  }

  function compressImage(file, callback) {
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const max = 800
        let w = img.width, h = img.height
        if (w > max) { h = Math.round(h * max / w); w = max }
        if (h > max) { w = Math.round(w * max / h); h = max }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        callback(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  async function handleAddImage(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    setImgUploading(true)
    compressImage(file, async (base64) => {
      try {
        const res = await fetch(`/api/admin/products/${form.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, mimeType: 'image/jpeg' })
        })
        if (res.ok) {
          await fetchProductImages(form.id)
          showToast('✅ Foto agregada')
        } else {
          const d = await res.json()
          showToast(d.error || 'Error al subir foto', false)
        }
      } catch(err) {
        showToast('Error al subir foto', false)
      }
      setImgUploading(false)
    })
  }

  async function handleDeleteImage(imageId) {
    if (!confirm('¿Eliminar esta foto?')) return
    const res = await fetch(`/api/admin/products/${form.id}/images/${imageId}`, { method: 'DELETE' })
    if (res.ok) {
      await fetchProductImages(form.id)
      showToast('Foto eliminada')
    } else {
      showToast('Error al eliminar foto', false)
    }
  }

  async function handleSave() {
    if (!form.name || !form.price_detal || !form.price_mayor) return showToast('Nombre y precios son requeridos', false)
    setSaving(true)

    const body = {
      ...form,
      price_detal: parseFloat(form.price_detal),
      price_mayor: parseFloat(form.price_mayor),
      min_mayor: parseInt(form.min_mayor) || 999,
    }

    let res
    if (editing === 'new') {
      if (!form.id) { setSaving(false); return showToast('El ID del producto es requerido (ej: s10)', false) }
      res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else {
      res = await fetch(`/api/admin/products/${form.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }

    setSaving(false)
    if (res.ok) {
      showToast(editing === 'new' ? '✅ Producto creado' : '✅ Cambios guardados')
      if (editing === 'new') {
        const created = await res.json()
        setEditing(created)
        setForm(f => ({ ...f, ...created, price_detal: String(created.price_detal), price_mayor: String(created.price_mayor), min_mayor: String(created.min_mayor) }))
        fetchData()
      } else {
        setEditing(null)
        fetchData()
      }
    } else {
      const d = await res.json()
      showToast(d.error || 'Error al guardar', false)
    }
  }

  async function handleDelete(p) {
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    const res = await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Producto eliminado'); fetchData() }
    else showToast('Error al eliminar', false)
  }

  async function toggleActive(p) {
    await fetch(`/api/admin/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !p.active }) })
    fetchData()
  }

  const inp = { width:'100%', border:'1.5px solid #fce7f3', borderRadius:10, padding:'10px 12px', fontSize:14, fontFamily:'Poppins,sans-serif', outline:'none', marginBottom:10 }
  const label = { fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:4 }

  if (editing !== null) {
    const isNew = editing === 'new'
    return (
      <AdminLayout title={isNew ? 'Nuevo Producto' : 'Editar Producto'}>
        <Toast {...toast} />
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <button onClick={() => setEditing(null)} style={{ background:'#fce7f3', border:'none', borderRadius:10, padding:'8px 14px', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>← Volver</button>
          <h2 style={{ fontSize:18, fontWeight:700 }}>{isNew ? '➕ Nuevo Producto' : `Editar: ${form.name}`}</h2>
        </div>

        {/* Galería de fotos */}
        <div style={{ marginBottom:20 }}>
          <label style={label}>📸 Fotos del producto</label>
          {isNew ? (
            <div style={{ background:'#fef9c3', borderRadius:12, padding:'10px 14px', fontSize:13, color:'#92400e', marginBottom:8 }}>
              Guarda el producto primero para poder agregar fotos.
            </div>
          ) : (
            <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {productImages.map((img, idx) => (
                <div key={img.id} style={{ position:'relative', width:90, height:90 }}>
                  <img src={img.url} alt="" style={{ width:90, height:90, objectFit:'cover', borderRadius:10, border: idx === 0 ? '2.5px solid #E91E8C' : '2px solid #fce7f3' }} />
                  {idx === 0 && (
                    <div style={{ position:'absolute', bottom:2, left:0, right:0, textAlign:'center', fontSize:9, fontWeight:700, color:'#E91E8C', background:'rgba(255,255,255,0.85)', borderRadius:'0 0 8px 8px', padding:'1px 0' }}>PRINCIPAL</div>
                  )}
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    style={{ position:'absolute', top:-6, right:-6, background:'#dc2626', color:'white', border:'none', borderRadius:'50%', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, cursor:'pointer', fontWeight:700, lineHeight:1 }}
                  >×</button>
                </div>
              ))}
              <button
                onClick={() => imgRef.current.click()}
                disabled={imgUploading}
                style={{ width:90, height:90, borderRadius:10, border:'2px dashed #E91E8C', background:'#fce7f3', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:26, color:'#E91E8C' }}
              >
                {imgUploading ? <span style={{ fontSize:11, fontWeight:600 }}>Subiendo...</span> : <><span>+</span><span style={{ fontSize:10, fontWeight:600, marginTop:2 }}>Agregar foto</span></>}
              </button>
              <input ref={imgRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAddImage} />
            </div>
          )}
          {productImages.length > 0 && (
            <div style={{ fontSize:11, color:'#9ca3af', marginTop:6 }}>La primera foto es la imagen principal del catálogo.</div>
          )}
        </div>

        {isNew && (
          <div>
            <label style={label}>ID del producto (único, sin espacios, ej: s10)</label>
            <input style={inp} value={form.id} onChange={e => setForm(f => ({...f, id: e.target.value.toLowerCase().replace(/\s/g,'')}))} placeholder="s10" />
          </div>
        )}

        <label style={label}>Nombre del producto</label>
        <input style={inp} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Ej: Scrunchies Satinados" />

        <label style={label}>Categoría</label>
        <select style={{...inp}} value={form.category_slug} onChange={e => setForm(f => ({...f, category_slug: e.target.value}))}>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div>
            <label style={label}>Precio Detal ($)</label>
            <input style={inp} type="number" step="0.01" value={form.price_detal} onChange={e => setForm(f => ({...f, price_detal: e.target.value}))} placeholder="0.00" />
          </div>
          <div>
            <label style={label}>Precio Mayor ($)</label>
            <input style={inp} type="number" step="0.01" value={form.price_mayor} onChange={e => setForm(f => ({...f, price_mayor: e.target.value}))} placeholder="0.00" />
          </div>
        </div>

        <label style={label}>Cantidad mínima al mayor (ej: 6, o 999 si no aplica)</label>
        <input style={inp} type="number" value={form.min_mayor} onChange={e => setForm(f => ({...f, min_mayor: e.target.value}))} placeholder="6" />

        <label style={label}>Descripción</label>
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
          {saving ? 'Guardando...' : '💾 Guardar Producto'}
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
        <h2 style={{ fontSize:20, fontWeight:700 }}>🛍️ Productos</h2>
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
                  {p.image_url ?
                    <img src={p.image_url} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}
                         onError={e => { e.target.style.display='none' }} /> :
                    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🛍️</div>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'#6b7280' }}>Detal: <strong style={{ color:'#E91E8C' }}>${Number(p.price_detal).toFixed(2)}</strong> · Mayor: <strong>${Number(p.price_mayor).toFixed(2)}</strong></div>
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
