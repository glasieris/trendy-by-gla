import { useRouter } from 'next/router'
import Head from 'next/head'

const NAV = [
  { href: '/admin/orders',     icon: '📦', label: 'Pedidos' },
  { href: '/admin/products',   icon: '🛍️', label: 'Productos' },
  { href: '/admin/categories', icon: '🏷️', label: 'Categorías' },
  { href: '/admin/settings',   icon: '⚙️', label: 'Configuración' },
]

export default function AdminLayout({ children, title = 'Admin' }) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <>
      <Head>
        <title>{title} — Trendy by Gla Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; background: #FFF0F7; color: #1f2937; }
        .brand-pink { color: #E91E8C; }
        .bg-pink { background: #E91E8C; }
        .bg-light { background: #FFF0F7; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{ background: '#E91E8C', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>💕</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Trendy Admin</span>
          </div>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Salir
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '16px', paddingBottom: 80, maxWidth: 700, margin: '0 auto', width: '100%' }}>
          {children}
        </main>

        {/* Bottom nav */}
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #fce7f3', display: 'flex', zIndex: 100 }}>
          {NAV.map(item => {
            const active = router.pathname === item.href
            return (
              <a key={item.href} href={item.href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px', textDecoration: 'none', color: active ? '#E91E8C' : '#9ca3af', background: active ? '#FFF0F7' : 'white', borderTop: active ? '2px solid #E91E8C' : '2px solid transparent', fontSize: 10, fontWeight: active ? 600 : 400, gap: 2 }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                {item.label}
              </a>
            )
          })}
        </nav>
      </div>
    </>
  )
}
