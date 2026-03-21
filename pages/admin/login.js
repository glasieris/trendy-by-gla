import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      router.push('/admin/orders')
    } else {
      const d = await res.json()
      setError(d.error || 'Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin — Trendy by Gla</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: 'Poppins', sans-serif; background: #FFF0F7; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }`}</style>
      <div style={{ background: 'white', borderRadius: 24, padding: 32, maxWidth: 380, width: '100%', boxShadow: '0 4px 32px rgba(233,30,140,0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>💕</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>Trendy Admin</h1>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>Panel de administración</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com"
              style={{ width: '100%', border: '1.5px solid #fce7f3', borderRadius: 12, padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              style={{ width: '100%', border: '1.5px solid #fce7f3', borderRadius: 12, padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: 13, background: '#fef2f2', padding: '10px 14px', borderRadius: 10 }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ background: '#E91E8C', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </>
  )
}
