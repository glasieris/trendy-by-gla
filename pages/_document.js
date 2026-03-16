import { Html, Head, Main, NextScript } from 'next/document'

const tailwindConfig = `
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: { pink: '#E91E8C', light: '#FDE4F0', dark: '#D81B60', text: '#1F2937' }
      },
      fontFamily: { sans: ['Poppins','sans-serif'], serif: ['Playfair Display','serif'] }
    }
  }
}
`

const globalCSS = `
* { box-sizing: border-box; }
body { margin: 0; }
.hide-scrollbar::-webkit-scrollbar{display:none}
.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
.bg-pattern{background-color:#FDE4F0;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L15 35h12l-5 20 20-30H30l5-20z' fill='%23fbcfe8' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")}
.modal-backdrop{backdrop-filter:blur(4px)}
.toast{animation:toastIn .3s ease-out,toastOut .3s ease-in 1.7s forwards}
@keyframes toastIn{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes toastOut{from{transform:translateY(0);opacity:1}to{transform:translateY(100%);opacity:0}}
.product-img{transition:transform .5s ease}
.product-card:hover .product-img{transform:scale(1.07)}
@keyframes checkDraw{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
@keyframes circleFill{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
.check-circle{animation:circleFill .5s ease-out forwards}
.check-path{stroke-dasharray:100;stroke-dashoffset:100;animation:checkDraw .6s ease-out .4s forwards}
.category-pills-bar{position:sticky;top:0;z-index:30}
`

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta charSet="UTF-8" />
        <title>Trendy by Gla | Mayor y Detal</title>
        <meta name="description" content="Accesorios de satén, maquillaje y productos trendy. Ventas al mayor y detal con envío a todo Venezuela." />
        <script src="https://cdn.tailwindcss.com/3.4.17" />
        <script dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      </Head>
      <body className="bg-pattern font-sans overflow-x-hidden" style={{ color: '#1F2937' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
