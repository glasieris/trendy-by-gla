import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'

const EMPTY = { id:'', name:'', category_slug:'Satin', is_hair:false, price_detal:'', price_mayor:'', min_mayor:'6', description:'', image_url:'', cost:'', provider:'' }

// Lowercase + strip accents so search matches "corazon" against "Corazón".
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

function Toast({ msg, ok }) {
  return msg ? <div style={{ position:'fixed', bottom:90, left:'50%', transform:'translateX(-50%)', background: ok ? '#E91E8C' : '#dc2626', color:'white', padding:'10px 20px', borderRadius:12, fontWeight:600, fontSize:14, zIndex:200, whiteSpace:'nowrap' }}>{msg}</div> : null
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [archivedProducts, setArchivedProducts] = useState([])
  const [showArchived, setShowArchived] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('') // real-time filter by product name
  const [editing, setEditing] = useState(null) // null | 'new' | product object
  const [form, setForm] = useState(EMPTY)
  const [productImages, setProductImages] = useState([]) // {id, url, sort_order}[]
  const [productVariants, setProductVariants] = useState([]) // {id, image_url, label, stock}[]
  const [variantEdits, setVariantEdits] = useState({}) // { [image_url]: { label, stock } }
  const [imgUploading, setImgUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg:'', ok:true })
  const imgRef = useRef()
  const listScrollY = useRef(0) // remembers list scroll position while editing
  const saveChain = useRef(Promise.resolve()) // serializes variant saves (avoids blur+click races)

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

  // Restore the list scroll position when returning from the edit/new form, so
  // saving or going back keeps the user where they were instead of jumping to top.
  useEffect(() => {
    if (editing === null) window.scrollTo(0, listScrollY.current)
  }, [editing])

  // Seed the editable label/stock inputs from the loaded variants (merging so
  // in-progress typing on other photos isn't wiped when one photo is saved).
  useEffect(() => {
    setVariantEdits(prev => {
      const seed = { ...prev }
      productVariants.forEach(v => { seed[v.image_url] = { label: v.label || '', stock: String(v.stock ?? ''), on_demand: !!v.on_demand, reference_only: !!v.reference_only } })
      return seed
    })
  }, [productVariants])

  // Default the Stock field to 1 for photos that aren't variants yet, so naming
  // one to create a new variant starts it in stock instead of "Agotado" (0).
  // Existing variants are seeded above and win via the `in seed` guard.
  useEffect(() => {
    setVariantEdits(prev => {
      const seed = { ...prev }
      productImages.forEach(img => { if (!(img.url in seed)) seed[img.url] = { label: '', stock: '1' } })
      return seed
    })
  }, [productImages])

  async function fetchProductImages(productId) {
    const res = await fetch(`/api/admin/products/${productId}/images`)
    if (res.ok) setProductImages(await res.json())
    else setProductImages([])
  }

  async function fetchProductVariants(productId) {
    const res = await fetch(`/api/admin/products/${productId}/variants`)
    if (res.ok) setProductVariants(await res.json())
    else setProductVariants([])
  }

  // Upsert the variant for a photo. Empty name removes it (plain gallery photo).
  // Saves are serialized through saveChain so a blur-triggered commit and a
  // mode-button click can't race (last one issued wins), and productVariants is
  // updated from the POST response — no full re-fetch that could land out of order.
  function saveVariant(image_url, label, stock, on_demand, reference_only) {
    const pid = form.id
    const run = async () => {
      const res = await fetch(`/api/admin/products/${pid}/variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url, label, stock: Number(stock || 0), on_demand: !!on_demand, reference_only: !!reference_only }),
      })
      if (!res.ok) { showToast('Error al guardar la variante', false); return }
      const data = await res.json()
      setProductVariants(prev => {
        const rest = prev.filter(v => v.image_url !== image_url)
        return data && data.deleted ? rest : [...rest, data]
      })
      showToast(String(label).trim() ? '✅ Variante guardada' : 'Variante quitada')
    }
    saveChain.current = saveChain.current.then(run, run)
    return saveChain.current
  }

  function setEdit(url, field, val) {
    setVariantEdits(prev => ({ ...prev, [url]: { ...prev[url], [field]: val } }))
  }

  // Save on blur, but only if the name/stock/mode actually changed.
  function commitVariant(url) {
    const e = variantEdits[url] || {}
    const label = String(e.label || '').trim()
    const referenceOnly = !!e.reference_only
    const onDemand = !referenceOnly && !!e.on_demand
    const stock = referenceOnly ? 0 : (e.stock === '' || e.stock == null ? 0 : Number(e.stock))
    const existing = productVariants.find(v => v.image_url === url)
    const prevLabel = String(existing?.label || '').trim()
    const prevStock = existing?.stock ?? 0
    const prevOnDemand = !!existing?.on_demand
    const prevReference = !!existing?.reference_only
    if (label === prevLabel && stock === prevStock && onDemand === prevOnDemand && referenceOnly === prevReference) return
    if (!label && !existing) return
    saveVariant(url, label, stock, onDemand, referenceOnly)
  }

  // Cycle a variant through the three photo modes:
  // Tengo stock → Bajo pedido → Solo referencia → (back to Tengo stock).
  // Reference mode is mutually exclusive with on_demand. Saves immediately for
  // photos that are already variants.
  function cycleMode(url) {
    const e = variantEdits[url] || {}
    // Current mode index: 0=stock, 1=on_demand, 2=reference.
    const current = e.reference_only ? 2 : e.on_demand ? 1 : 0
    const nextMode = (current + 1) % 3
    const nextOnDemand = nextMode === 1
    const nextReference = nextMode === 2
    setVariantEdits(prev => ({ ...prev, [url]: { ...prev[url], on_demand: nextOnDemand, reference_only: nextReference } }))
    const label = String(e.label || '').trim()
    const existing = productVariants.find(v => v.image_url === url)
    if (!label && !existing) return // not a variant yet; remember the choice for when it's named
    const stock = nextReference ? 0 : (e.stock === '' || e.stock == null ? 0 : Number(e.stock))
    saveVariant(url, label || existing.label, stock, nextOnDemand, nextReference)
  }

  function openNew() {
    setForm(EMPTY)
    setProductImages([])
    setProductVariants([])
    setVariantEdits({})
    setEditing('new')
  }

  function openEdit(p) {
    listScrollY.current = window.scrollY
    setForm({ ...p, price_detal: String(p.price_detal), price_mayor: String(p.price_mayor), min_mayor: String(p.min_mayor), cost: p.cost != null ? String(p.cost) : '', provider: p.provider || '' })
    setProductImages([])
    setProductVariants([])
    setVariantEdits({})
    setEditing(p)
    fetchProductImages(p.id)
    fetchProductVariants(p.id)
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
          await fetchProductVariants(form.id)
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
    const img = productImages.find(i => i.id === imageId)
    const res = await fetch(`/api/admin/products/${form.id}/images/${imageId}`, { method: 'DELETE' })
    if (res.ok) {
      // Also remove the variant tied to this photo, if any (empty label deletes it).
      if (img) {
        await fetch(`/api/admin/products/${form.id}/variants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: img.url, label: '' }),
        })
      }
      await fetchProductImages(form.id)
      await fetchProductVariants(form.id)
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
      cost: form.cost === '' || form.cost == null ? null : parseFloat(form.cost),
      provider: (form.provider || '').trim() || null,
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

  // Soft-delete: archive the product (and its variants) instead of removing it,
  // so historical orders keep working. Recoverable from "Productos archivados".
  async function handleDelete(p) {
    if (!confirm(`¿Eliminar "${p.name}"? Dejará de aparecer en la tienda y en el admin. (Recuperable desde "Productos archivados".)`)) return
    const res = await fetch(`/api/admin/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archived: true }) })
    if (res.ok) { showToast('Producto eliminado'); fetchData(); if (showArchived) fetchArchived() }
    else showToast('Error al eliminar', false)
  }

  async function handleRestore(p) {
    const res = await fetch(`/api/admin/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archived: false }) })
    if (res.ok) { showToast('Producto restaurado'); fetchArchived(); fetchData() }
    else showToast('Error al restaurar', false)
  }

  async function fetchArchived() {
    const res = await fetch('/api/admin/products?archived=true')
    if (res.ok) setArchivedProducts(await res.json())
  }

  function toggleArchivedView() {
    const next = !showArchived
    setShowArchived(next)
    if (next) fetchArchived()
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
            <div style={{ display:'flex', flexWrap:'wrap', gap:12, alignItems:'flex-start' }}>
              {productImages.map((img, idx) => {
                const edit = variantEdits[img.url] || {}
                const isVariant = String(edit.label || '').trim().length > 0
                const referenceOnly = !!edit.reference_only
                const onDemand = !referenceOnly && !!edit.on_demand
                const stockDisabled = onDemand || referenceOnly
                const isAgotado = isVariant && !onDemand && !referenceOnly && Number(edit.stock || 0) <= 0
                const vInput = { width:120, marginTop:5, border:'1.5px solid #fce7f3', borderRadius:8, padding:'6px 8px', fontSize:12, fontFamily:'Poppins,sans-serif', outline:'none' }
                return (
                  <div key={img.id} style={{ width:120 }}>
                    <div style={{ position:'relative', width:120, height:120 }}>
                      <img src={img.url} alt="" style={{ width:120, height:120, objectFit:'cover', borderRadius:10, border: idx === 0 ? '2.5px solid #E91E8C' : '2px solid #fce7f3' }} />
                      {idx === 0 && (
                        <div style={{ position:'absolute', bottom:2, left:0, right:0, textAlign:'center', fontSize:9, fontWeight:700, color:'#E91E8C', background:'rgba(255,255,255,0.85)', borderRadius:'0 0 8px 8px', padding:'1px 0' }}>PRINCIPAL</div>
                      )}
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        style={{ position:'absolute', top:-6, right:-6, background:'#dc2626', color:'white', border:'none', borderRadius:'50%', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, cursor:'pointer', fontWeight:700, lineHeight:1 }}
                      >×</button>
                    </div>
                    <input
                      value={edit.label ?? ''}
                      onChange={e => setEdit(img.url, 'label', e.target.value)}
                      onBlur={() => commitVariant(img.url)}
                      placeholder="Nombre (ej: Rosa)"
                      style={vInput}
                    />
                    {stockDisabled ? (
                      <div style={{ ...vInput, marginTop:4, background:'#f3f4f6', color:'#9ca3af', fontSize:11, textAlign:'center', cursor:'default' }}>
                        {referenceOnly ? 'Sin stock · referencia' : 'Sin stock · bajo pedido'}
                      </div>
                    ) : (
                      <input
                        type="number"
                        value={edit.stock ?? ''}
                        onChange={e => setEdit(img.url, 'stock', e.target.value)}
                        onBlur={() => commitVariant(img.url)}
                        placeholder="Stock"
                        style={{ ...vInput, marginTop:4 }}
                      />
                    )}
                    {isVariant && (
                      <button
                        type="button"
                        onClick={() => cycleMode(img.url)}
                        title="Cambiar modo: Tengo stock → Bajo pedido → Solo referencia"
                        style={{ width:120, marginTop:5, border:'1.5px solid', borderColor: referenceOnly ? '#7c3aed' : onDemand ? '#E91E8C' : '#fce7f3', borderRadius:8, padding:'5px 6px', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', background: referenceOnly ? '#ede9fe' : onDemand ? '#fce7f3' : 'white', color: referenceOnly ? '#7c3aed' : onDemand ? '#E91E8C' : '#6b7280' }}
                      >
                        {referenceOnly ? '🔖 Solo referencia' : onDemand ? '🕒 Bajo pedido' : '📦 Tengo stock'}
                      </button>
                    )}
                    {referenceOnly && isVariant && <div style={{ fontSize:9, color:'#7c3aed', fontWeight:600, marginTop:3, lineHeight:1.3 }}>Solo imagen · no comprable</div>}
                    {isAgotado && <div style={{ fontSize:10, color:'#dc2626', fontWeight:700, marginTop:3 }}>● Agotado</div>}
                  </div>
                )
              })}
              <button
                onClick={() => imgRef.current.click()}
                disabled={imgUploading}
                style={{ width:120, height:120, borderRadius:10, border:'2px dashed #E91E8C', background:'#fce7f3', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:26, color:'#E91E8C' }}
              >
                {imgUploading ? <span style={{ fontSize:11, fontWeight:600 }}>Subiendo...</span> : <><span>+</span><span style={{ fontSize:10, fontWeight:600, marginTop:2 }}>Agregar foto</span></>}
              </button>
              <input ref={imgRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAddImage} />
            </div>
          )}
          {productImages.length > 0 && (
            <div style={{ fontSize:11, color:'#9ca3af', marginTop:8, lineHeight:1.5 }}>
              La primera foto es la imagen principal del catálogo.<br />
              Ponle un <strong>Nombre</strong> a una foto para convertirla en una <strong>variante comprable</strong> (color/modelo). El <strong>Stock</strong> en 0 la marca como <strong>Agotado</strong>.<br />
              El botón de modo cicla entre <strong>📦 Tengo stock</strong>, <strong>🕒 Bajo pedido</strong> y <strong>🔖 Solo referencia</strong> (foto etiquetada que no se vende ni cuenta en inventario/costos).
            </div>
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
            <input type="checkbox" checked={form.is_hair} onChange={e => setForm(f => ({...f, is_hair: e.target.checked}))} /> Es accesorio de cabello
          </label>
        </div>

        {/* Internal-only fields — never exposed to the storefront/public API */}
        <div style={{ marginTop:20, border:'1.5px dashed #d1d5db', borderRadius:12, padding:'14px', background:'#f9fafb' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#6b7280', marginBottom:2 }}>🔒 Información interna</div>
          <div style={{ fontSize:11, color:'#9ca3af', marginBottom:12 }}>No visible para clientes. Solo para el panel de administración.</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <label style={label}>Costo ($)</label>
              <input style={inp} type="number" step="0.01" value={form.cost} onChange={e => setForm(f => ({...f, cost: e.target.value}))} placeholder="0.00" />
            </div>
            <div>
              <label style={label}>Proveedor</label>
              <input style={inp} value={form.provider} onChange={e => setForm(f => ({...f, provider: e.target.value}))} placeholder="Ej: Proveedor X" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          style={{ width:'100%', background:'#E91E8C', color:'white', border:'none', borderRadius:14, padding:'14px', fontWeight:700, fontSize:16, cursor:'pointer', fontFamily:'inherit', marginTop:20 }}>
          {saving ? 'Guardando...' : '💾 Guardar Producto'}
        </button>
      </AdminLayout>
    )
  }

  const q = norm(search.trim())
  const visibleProducts = q ? products.filter(p => norm(p.name).includes(q)) : products
  const grouped = categories.reduce((acc, cat) => {
    acc[cat.slug] = visibleProducts.filter(p => p.category_slug === cat.slug)
    return acc
  }, {})
  const noResults = q && visibleProducts.length === 0

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

      <div style={{ position:'relative', marginBottom:16 }}>
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:15, color:'#9ca3af', pointerEvents:'none' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto por nombre..."
          style={{ width:'100%', border:'1.5px solid #fce7f3', borderRadius:12, padding:'11px 36px', fontSize:14, fontFamily:'Poppins,sans-serif', outline:'none' }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'#fce7f3', border:'none', borderRadius:'50%', width:24, height:24, cursor:'pointer', color:'#E91E8C', fontWeight:700, lineHeight:1 }}
          >×</button>
        )}
      </div>

      {loading ? <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>Cargando...</div> : noResults ? (
        <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>Sin resultados para “{search.trim()}”.</div>
      ) : (
        categories.map(cat => {
          const items = grouped[cat.slug] || []
          if (q && items.length === 0) return null
          return (
          <div key={cat.slug} style={{ marginBottom:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#E91E8C', marginBottom:8, textTransform:'uppercase', letterSpacing:1 }}>{cat.label}</h3>
            {items.map(p => (
              <div key={p.id} style={{ background:'white', borderRadius:14, marginBottom:8, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 2px 6px rgba(0,0,0,0.05)', opacity: p.active ? 1 : 0.5 }}>
                <div style={{ width:52, height:52, borderRadius:10, overflow:'hidden', background:'#fce7f3', flexShrink:0 }}>
                  {p.thumb ?
                    <img src={p.thumb} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}
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
                  <button onClick={() => handleDelete(p)} style={{ background:'white', border:'1px solid #fecaca', borderRadius:8, padding:'5px 10px', fontSize:11, cursor:'pointer', fontFamily:'inherit', color:'#dc2626' }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          )
        })
      )}

      {/* Low-visibility archived section — recovery only, not for daily use */}
      <div style={{ marginTop:28, paddingTop:14, borderTop:'1px solid #f3f4f6', textAlign:'center' }}>
        <button onClick={toggleArchivedView}
          style={{ background:'none', border:'none', color:'#9ca3af', fontSize:12, cursor:'pointer', fontFamily:'inherit', textDecoration:'underline' }}>
          {showArchived ? 'Ocultar productos archivados' : 'Ver productos archivados'}
        </button>
      </div>

      {showArchived && (
        <div style={{ marginTop:12 }}>
          {archivedProducts.length === 0 ? (
            <div style={{ textAlign:'center', color:'#9ca3af', fontSize:13, padding:16 }}>No hay productos archivados.</div>
          ) : archivedProducts.map(p => (
            <div key={p.id} style={{ background:'#fafafa', borderRadius:14, marginBottom:8, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, border:'1px solid #f3f4f6' }}>
              <div style={{ width:44, height:44, borderRadius:10, overflow:'hidden', background:'#f3f4f6', flexShrink:0 }}>
                {p.thumb ?
                  <img src={p.thumb} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(1)' }} onError={e => { e.target.style.display='none' }} /> :
                  <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🗃️</div>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:14, color:'#6b7280', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize:11, color:'#9ca3af' }}>{categories.find(c => c.slug === p.category_slug)?.label || p.category_slug} · archivado</div>
              </div>
              <button onClick={() => handleRestore(p)} style={{ background:'#dcfce7', border:'none', borderRadius:8, padding:'6px 12px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', color:'#166534', flexShrink:0 }}>Restaurar</button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
