import Script from 'next/script'

const bodyHTML = `
<!-- ===== TOP ANNOUNCEMENT BAR ===== -->
<div class="bg-brand-pink text-white text-center text-xs sm:text-sm py-2 px-4 font-medium">
    ✨ Hacemos envios a todo el pais y recibimos a tasa BCV ✨
</div>

<!-- ===== HEADER / TOP NAV ===== -->
<header class="bg-brand-light/95 backdrop-blur-md border-b border-pink-200 shadow-sm relative z-40" id="main-header">
    <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <button class="lg:hidden p-2 text-gray-600" onclick="toggleMobileMenu()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div class="flex items-center cursor-pointer" onclick="filterCategory('All');scrollToTop()">
            <img src="/img/logo.png" alt="Trendy by Gla" class="h-12 w-auto object-contain" style="mix-blend-mode:multiply"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="hidden items-center gap-1">
                <span class="text-xl font-serif italic font-bold text-brand-pink">by</span>
                <span class="text-2xl font-serif text-gray-800 font-bold">Gla</span>
                <span class="text-xs text-gray-500 ml-1">Accesorios</span>
            </div>
        </div>
        <nav class="hidden lg:flex items-center gap-6">
            <a href="#" class="text-sm font-semibold text-gray-700 hover:text-brand-pink transition-colors" onclick="filterCategory('All');scrollToTop();return false">HOME</a>
            <div class="relative group">
                <button class="text-sm font-semibold text-gray-700 hover:text-brand-pink transition-colors flex items-center gap-1">
                    CATEGORIAS
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="absolute top-full left-0 mt-1 bg-white border border-pink-100 rounded-xl shadow-lg py-2 min-w-[200px] hidden group-hover:block z-50">
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-pink" onclick="filterCategory('Cabello');return false">Accesorios para el cabello</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-pink" onclick="filterCategory('Oro Laminado');return false">Accesorios oro laminado</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-pink" onclick="filterCategory('Neceser');return false">Neceser</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-pink" onclick="filterCategory('Llaveros');return false">Llaveros</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-pink" onclick="filterCategory('Descuentos');return false">Descuentos</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-pink" onclick="filterCategory('Sets');return false">Sets para regalar</a>
                </div>
            </div>
            <a href="#" class="text-sm font-semibold text-gray-700 hover:text-brand-pink transition-colors" onclick="filterCategory('Al Mayor');return false">AL MAYOR</a>
            <a href="#quienes-somos" class="text-sm font-semibold text-gray-700 hover:text-brand-pink transition-colors">CONTACTO</a>
        </nav>
        <button onclick="openCart()" class="relative p-2 text-gray-700 hover:text-brand-pink transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7zM10 14v4m4-4v4"/></svg>
            <span id="cart-badge" class="absolute -top-1 -right-1 bg-brand-pink text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold hidden">0</span>
        </button>
    </div>
</header>

<!-- Mobile Menu -->
<div id="mobile-menu" class="hidden bg-white border-b border-pink-100 lg:hidden z-40 relative">
    <div class="px-4 py-3 space-y-1">
        <a href="#" class="block py-2 text-sm font-semibold text-gray-700" onclick="filterCategory('All');toggleMobileMenu();scrollToTop();return false">HOME</a>
        <div>
            <button class="py-2 text-sm font-semibold text-gray-700 flex items-center gap-2" onclick="toggleMobileCategories()">
                CATEGORIAS
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div id="mobile-categories" class="hidden pl-4 space-y-1">
                <a href="#" class="block py-1.5 text-sm text-gray-600" onclick="filterCategory('Cabello');toggleMobileMenu();return false">Accesorios para el cabello</a>
                <a href="#" class="block py-1.5 text-sm text-gray-600" onclick="filterCategory('Oro Laminado');toggleMobileMenu();return false">Accesorios oro laminado</a>
                <a href="#" class="block py-1.5 text-sm text-gray-600" onclick="filterCategory('Neceser');toggleMobileMenu();return false">Neceser</a>
                <a href="#" class="block py-1.5 text-sm text-gray-600" onclick="filterCategory('Llaveros');toggleMobileMenu();return false">Llaveros</a>
                <a href="#" class="block py-1.5 text-sm text-gray-600" onclick="filterCategory('Descuentos');toggleMobileMenu();return false">Descuentos</a>
                <a href="#" class="block py-1.5 text-sm text-gray-600" onclick="filterCategory('Sets');toggleMobileMenu();return false">Sets para regalar</a>
            </div>
        </div>
        <a href="#" class="block py-2 text-sm font-semibold text-gray-700" onclick="filterCategory('Al Mayor');toggleMobileMenu();return false">AL MAYOR</a>
        <a href="#quienes-somos" class="block py-2 text-sm font-semibold text-gray-700" onclick="toggleMobileMenu()">CONTACTO</a>
    </div>
</div>

<!-- ===== MAIN CONTENT ===== -->
<main>

<!-- Hero Section -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
    <div class="bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row relative">
        <div class="p-8 md:p-14 flex flex-col justify-center flex-1 z-10">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-pink leading-tight mb-4">
                Accesorios trendy<br>para cada momento
            </h1>
            <p class="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                Satén, maquillaje, joyería y más. Todo lo que necesitas para verte y sentirte increíble, al mayor y detal con envío a todo el país.
            </p>
            <div class="flex flex-wrap gap-3">
                <button onclick="filterCategory('All');document.getElementById('catalog-section').scrollIntoView({behavior:'smooth'})"
                    class="inline-block bg-brand-pink text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-brand-dark transform hover:-translate-y-1 transition-all uppercase tracking-wide">
                    Explorar Catálogo
                </button>
                <a href="https://wa.me/584228736390" target="_blank"
                    class="inline-block bg-white text-brand-pink font-bold py-3 px-8 rounded-full shadow-lg border-2 border-brand-pink hover:bg-brand-pink hover:text-white transform hover:-translate-y-1 transition-all uppercase tracking-wide">
                    Escríbenos
                </a>
            </div>
        </div>
        <div class="relative flex-1 min-h-[300px] md:min-h-[420px] flex items-center justify-center overflow-hidden">
            <img src="/img/hero.png" alt="Accesorios by Gla" class="absolute inset-0 w-full h-full object-cover" style="object-position: center center;"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="hidden w-full h-full items-center justify-center bg-gradient-to-br from-brand-light to-pink-200 flex-col gap-3 p-12">
                <span class="font-serif italic text-4xl text-brand-pink">by Gla</span>
            </div>
        </div>
    </div>
</section>

<!-- Wholesale Banner -->
<section class="max-w-7xl mx-auto px-4 pb-4">
    <div class="bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
                <div class="font-bold text-gray-800 text-sm">Activa Precios al Mayor!</div>
                <div class="text-gray-500 text-xs mt-0.5">Desde 6 unidades en productos de cabello o compras mayores a $70 en cualquier producto.</div>
            </div>
        </div>
        <div id="mayor-status-badge" class="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-500 font-medium whitespace-nowrap flex-shrink-0">
            <span class="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
            Mayor Inactivo
        </div>
    </div>
</section>

<!-- Category Pills (sticky) -->
<div class="category-pills-bar bg-white/90 backdrop-blur-sm border-b border-pink-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4">
        <div id="category-pills" class="flex gap-2 overflow-x-auto hide-scrollbar py-3"></div>
    </div>
</div>

<!-- Catalog Section -->
<section id="catalog-section" class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
        <div>
            <h2 id="catalog-title" class="font-serif text-2xl font-bold text-gray-800">Todos los Productos</h2>
            <p id="catalog-subtitle" class="text-gray-500 text-sm mt-1">Accesorios de satén premium · Mayor y detal</p>
        </div>
        <span id="product-count" class="text-xs text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm"></span>
    </div>
    <div id="product-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
</section>

<!-- Values Section -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-pink-100 shadow-sm">
            <div class="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h3 class="font-bold text-gray-800 text-lg mb-2">Calidad</h3>
            <p class="text-gray-500 text-sm leading-relaxed">Materiales premium seleccionados para durar y proteger.</p>
        </div>
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-pink-100 shadow-sm">
            <div class="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            </div>
            <h3 class="font-bold text-gray-800 text-lg mb-2">Estilo</h3>
            <p class="text-gray-500 text-sm leading-relaxed">Diseños trendy que complementan tu personalidad única.</p>
        </div>
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-pink-100 shadow-sm">
            <div class="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <h3 class="font-bold text-gray-800 text-lg mb-2">Confianza</h3>
            <p class="text-gray-500 text-sm leading-relaxed">Comprometidos con tu satisfacción en cada envío.</p>
        </div>
    </div>
</section>

<!-- Quienes Somos -->
<section id="quienes-somos" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-10">
    <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-lg border border-pink-100">
        <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
                <h2 class="font-serif text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-5">
                    Hecho con amor,<br>
                    <span class="text-brand-pink italic">pensado para ti.</span>
                </h2>
                <p class="text-gray-600 text-sm leading-relaxed mb-3">Somos una marca venezolana de accesorios de satén, maquillaje y productos trendy. Nacimos con una misión simple: que cada mujer se vea increíble con accesorios de calidad a precios accesibles, al mayor y detal.</p>
                <p class="text-gray-600 text-sm leading-relaxed mb-6">Envíos a todo el país a tasa BCV. Desde scrunchies hasta gorros y fundas de almohada, cada pieza está pensada para ti.</p>
                <div class="flex gap-8 mb-6">
                    <div>
                        <div class="text-3xl font-extrabold text-brand-pink leading-none">5+</div>
                        <div class="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-1">Años de<br>Pasión</div>
                    </div>
                    <div class="w-px bg-pink-100"></div>
                    <div>
                        <div class="text-3xl font-extrabold text-brand-pink leading-none">10k+</div>
                        <div class="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-1">Clientes<br>Felices</div>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    <a href="https://wa.me/584228736390" target="_blank" class="bg-[#25D366] text-white px-4 py-2 rounded-full font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z"/></svg>
                        WhatsApp
                    </a>
                    <a href="https://www.instagram.com/Trendybygla" target="_blank" class="border border-brand-pink text-brand-pink px-4 py-2 rounded-full font-semibold text-xs hover:bg-brand-light transition-colors">@Trendybygla</a>
                    <a href="https://tiktok.com/@trendybygla" target="_blank" class="border border-gray-300 text-gray-600 px-4 py-2 rounded-full font-semibold text-xs hover:bg-gray-50 transition-colors">TikTok @trendybygla</a>
                </div>
            </div>
            <div class="flex justify-center">
                <div class="relative w-64 h-72 rounded-2xl overflow-hidden shadow-lg">
                    <img src="/img/quienes-somos.png" alt="by Gla" class="w-full h-full object-cover"
                         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                    <div class="hidden w-full h-full bg-gradient-to-br from-brand-pink/20 to-brand-light items-center justify-center">
                        <span class="font-serif italic text-3xl text-brand-pink">by Gla</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

</main>

<!-- ===== FOOTER ===== -->
<footer id="footer" class="bg-white border-t border-pink-200 pt-12 pb-8 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
                <div class="mb-4">
                    <img src="/img/logo.png" alt="Trendy by Gla" class="h-10 w-auto object-contain" style="mix-blend-mode:multiply"
                         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                    <div class="hidden items-center gap-1">
                        <span class="font-serif italic font-bold text-brand-pink text-lg">by</span>
                        <span class="font-serif font-bold text-gray-800 text-xl">Gla</span>
                    </div>
                </div>
                <p class="text-gray-500 text-sm leading-relaxed">Accesorios de satén, maquillaje y productos trendy. Ventas al mayor y detal.</p>
            </div>
            <div>
                <h4 class="font-bold text-gray-800 mb-5 text-xs uppercase tracking-widest">Enlaces</h4>
                <ul class="space-y-3 text-sm text-gray-500">
                    <li><a href="#" class="hover:text-brand-pink transition-colors" onclick="window.scrollTo({top:0,behavior:'smooth'});return false">Inicio</a></li>
                    <li><a href="#" class="hover:text-brand-pink transition-colors" onclick="filterCategory('All');document.getElementById('catalog-section').scrollIntoView({behavior:'smooth'});return false">Catalogo</a></li>
                    <li><a href="#" class="hover:text-brand-pink transition-colors">Terminos y Condiciones</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold text-gray-800 mb-5 text-xs uppercase tracking-widest">Horario (Pickup)</h4>
                <ul class="space-y-3 text-sm text-gray-500">
                    <li>Lunes a Viernes</li>
                    <li>10:00 AM - 5:00 PM</li>
                    <li class="text-brand-pink font-semibold">Previa Cita</li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold text-gray-800 mb-5 text-xs uppercase tracking-widest">Contacto</h4>
                <ul class="space-y-3 text-sm text-gray-500">
                    <li>
                        <a href="https://wa.me/584228736390" target="_blank" class="flex items-center gap-2 hover:text-brand-pink transition-colors">
                            <svg class="w-4 h-4 text-brand-pink flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            0422-8736390
                        </a>
                    </li>
                    <li>
                        <a href="https://instagram.com/Trendybygla" target="_blank" class="flex items-center gap-2 hover:text-brand-pink transition-colors">
                            <svg class="w-4 h-4 text-brand-pink flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            @Trendybygla
                        </a>
                    </li>
                    <li>
                        <a href="https://tiktok.com/@trendybygla" target="_blank" class="flex items-center gap-2 hover:text-brand-pink transition-colors">
                            <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.3-.85.51-1.44 1.43-1.58 2.41-.05.51-.01 1.03.11 1.52.41 1.25 1.54 2.24 2.85 2.45.69.11 1.41.03 2.06-.2 1.1-.41 1.94-1.38 2.22-2.5.09-.53.11-1.07.1-1.61-.02-5.46.01-10.91-.02-16.36z"/></svg>
                            @trendybygla
                        </a>
                    </li>
                    <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-brand-pink flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        Envios a todo el pais
                    </li>
                </ul>
            </div>
        </div>
        <div class="border-t border-gray-100 pt-6 text-center">
            <p class="text-xs text-gray-400">© 2026 Trendy by Gla Accesorios. Todos los derechos reservados.</p>
        </div>
    </div>
</footer>

<!-- ===== WHATSAPP FLOAT BUTTON ===== -->
<a href="https://wa.me/584228736390" target="_blank"
   class="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
    <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM11.997 2C6.477 2 2 6.477 2 11.997c0 1.769.463 3.43 1.27 4.872L2 22l5.27-1.237A9.965 9.965 0 0011.997 22C17.517 22 22 17.523 22 12.003 22 6.477 17.517 2 11.997 2z"/></svg>
</a>

<!-- ===== CART DRAWER ===== -->
<div id="cart-backdrop" class="fixed inset-0 bg-black/40 z-50 hidden modal-backdrop" onclick="closeCart()"></div>
<div id="cart-drawer" class="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[60] transform translate-x-full transition-transform duration-300 flex flex-col shadow-2xl">
    <div class="flex items-center justify-between p-4 border-b border-pink-100">
        <h2 class="font-bold text-lg flex items-center gap-2">
            <svg class="w-5 h-5 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7zM10 14v4m4-4v4"/></svg>
            Tu Carrito
        </h2>
        <button onclick="closeCart()" class="p-2 hover:bg-gray-100 rounded-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
    </div>
    <div id="cart-items" class="flex-1 overflow-y-auto p-4 space-y-3"></div>
    <div class="border-t border-pink-100 p-4 space-y-3">
        <div id="cart-totals" class="text-sm space-y-1"></div>
        <div class="flex items-center justify-between font-bold text-lg">
            <span>Total</span>
            <span id="cart-total" class="text-brand-pink">$0.00</span>
        </div>
        <div id="cart-total-bs" class="text-xs text-gray-500 text-right"></div>
        <button onclick="openCheckout()" id="checkout-btn" class="w-full bg-brand-pink text-white py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors disabled:opacity-50">
            Completar Pedido
        </button>
    </div>
</div>

<!-- ===== FABRIC MODAL ===== -->
<div id="fabric-backdrop" class="fixed inset-0 bg-black/50 z-[70] hidden modal-backdrop"></div>
<div id="fabric-modal" class="fixed inset-0 z-[70] hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-lg" id="fabric-modal-title">Elige tu color</h3>
            <button onclick="closeFabricModal()" class="p-2 hover:bg-gray-100 rounded-full">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        <div id="fabric-swatches" class="grid grid-cols-3 gap-3 mb-6"></div>
        <button onclick="confirmFabric()" class="w-full bg-brand-pink text-white py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors">
            Agregar al carrito
        </button>
    </div>
</div>

<!-- ===== PRODUCT DETAIL MODAL ===== -->
<div id="detail-backdrop" class="fixed inset-0 bg-black/60 z-[80] hidden modal-backdrop" onclick="closeDetailModal()"></div>
<div id="detail-modal" class="fixed inset-0 z-[80] hidden overflow-y-auto">
    <div class="min-h-full flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative">
            <button onclick="closeDetailModal()" class="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div id="detail-content" class="p-6"></div>
        </div>
    </div>
</div>

<!-- ===== CHECKOUT MODAL ===== -->
<div id="checkout-backdrop" class="fixed inset-0 bg-black/50 z-[70] hidden modal-backdrop"></div>
<div id="checkout-modal" class="fixed inset-0 z-[70] hidden overflow-y-auto">
    <div class="min-h-full flex items-center justify-center p-4 py-8">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div class="flex items-center justify-between p-6 border-b border-pink-100">
                <h2 class="font-bold text-xl flex items-center gap-2">
                    <span class="text-brand-pink">🛍️</span> Finalizar Compra
                </h2>
                <button onclick="closeCheckout()" class="p-2 hover:bg-gray-100 rounded-full">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                <!-- 1. Datos Personales -->
                <div>
                    <h3 class="font-bold text-base mb-3 text-brand-pink">👤 Datos Personales</h3>
                    <div class="space-y-3">
                        <input id="co-name" type="text" placeholder="Nombre y Apellido *" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                        <input id="co-email" type="email" placeholder="Correo electrónico * (para recibir tu confirmación)" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                        <input id="co-phone" type="tel" placeholder="Teléfono WhatsApp *" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                    </div>
                </div>
                <!-- 2. Detalle del Pedido -->
                <div>
                    <h3 class="font-bold text-base mb-3 text-brand-pink">📋 Detalle del Pedido</h3>
                    <div id="co-order-detail" class="bg-gray-50 rounded-xl p-3 space-y-2 max-h-40 overflow-y-auto text-sm"></div>
                    <div class="flex justify-between font-semibold mt-2 text-sm px-1">
                        <span>Subtotal productos:</span>
                        <span id="co-subtotal">$0.00</span>
                    </div>
                </div>
                <!-- 3. Método de Pago -->
                <div>
                    <h3 class="font-bold text-base mb-3 text-brand-pink">💳 Método de Pago</h3>
                    <select id="co-payment" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                        <option value="">Seleccione método...</option>
                        <option>Zinli</option>
                        <option>Binance Pay</option>
                        <option>Efectivo (USD)</option>
                        <option>Pago Móvil</option>
                        <option>Transferencia Bancaria</option>
                    </select>
                </div>
                <!-- 4. Método de Entrega -->
                <div>
                    <h3 class="font-bold text-base mb-3 text-brand-pink">🚚 Método de Entrega</h3>
                    <div class="space-y-2">
                        <label class="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-brand-light/50">
                            <input type="radio" name="delivery" value="pickup" onchange="updateDeliveryFields()" class="text-brand-pink accent-pink-500"> <span class="text-sm font-medium">Retiro en Tienda</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-brand-light/50">
                            <input type="radio" name="delivery" value="local" onchange="updateDeliveryFields()" class="accent-pink-500"> <span class="text-sm font-medium">Delivery Local</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-brand-light/50">
                            <input type="radio" name="delivery" value="nacional" onchange="updateDeliveryFields()" class="accent-pink-500"> <span class="text-sm font-medium">Envío Nacional</span>
                        </label>
                    </div>
                    <div id="fields-local" class="hidden mt-3 space-y-3">
                        <select id="co-zone" onchange="updateCheckoutTotal()" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                            <option value="">Selecciona la zona...</option>
                            <option value="Barcelona|3">Barcelona — $3.00</option>
                            <option value="Puerto La Cruz|3">Puerto La Cruz — $3.00</option>
                            <option value="Lechería|2">Lechería — $2.00</option>
                        </select>
                        <input id="co-receiver" type="text" placeholder="Quién recibe" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                        <input id="co-address" type="text" placeholder="Dirección de entrega" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                        <input id="co-schedule" type="text" placeholder="Horario disponible para recibir (Ej: Lunes a Viernes 2pm-6pm)" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                    </div>
                    <div id="fields-nacional" class="hidden mt-3 space-y-3">
                        <select id="co-courier" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                            <option value="">Selecciona la agencia...</option>
                            <option>MRW</option>
                            <option>Zoom</option>
                            <option>Tealca</option>
                        </select>
                        <input id="co-dest-name" type="text" placeholder="Nombre y Apellido destinatario" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                        <input id="co-cedula" type="text" placeholder="Cédula del destinatario" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                        <input id="co-dest-phone" type="tel" placeholder="Teléfono del destinatario" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                        <input id="co-agency-addr" type="text" placeholder="Dirección de la agencia" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30">
                        <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                            ⚠️ El costo del envío se paga al momento del retiro en la agencia (cobro a destino)
                        </div>
                    </div>
                </div>
                <!-- 5. Regalo -->
                <div>
                    <label class="flex items-center gap-3 cursor-pointer p-3 bg-brand-light/50 rounded-xl">
                        <input type="checkbox" id="co-gift" onchange="toggleGift()" class="accent-pink-500 w-4 h-4">
                        <span class="text-sm font-medium">🎁 ¿Es para regalar? (+$1.00 empaque especial)</span>
                    </label>
                    <div id="gift-message-wrap" class="hidden mt-3">
                        <textarea id="co-gift-msg" placeholder="Mensaje para la tarjeta (opcional)" rows="2" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 resize-none"></textarea>
                    </div>
                </div>
            </div>
            <!-- Footer -->
            <div class="border-t border-pink-100 p-6">
                <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-lg">Total a pagar:</span>
                    <span id="co-total-display" class="text-2xl font-bold text-brand-pink">$0.00</span>
                </div>
                <div id="co-total-bs" class="text-xs text-gray-500 text-right mb-4"></div>
                <button id="submit-btn" onclick="submitOrder()" class="w-full bg-brand-pink text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-base">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    Confirmar Pedido
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ===== SUCCESS MODAL ===== -->
<div id="success-modal" class="fixed inset-0 z-[90] hidden bg-pattern overflow-y-auto">
    <div class="min-h-full flex items-center justify-center p-4 py-8">
        <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden">
            <div class="bg-gradient-to-b from-brand-light to-white px-8 py-10 text-center">
                <div class="check-circle w-20 h-20 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none">
                        <path class="check-path" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h2 class="font-serif text-3xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h2>
                <p class="text-gray-500 mb-2">Te enviamos la confirmación a tu correo electrónico. 💕</p>
                <div id="success-order-num" class="inline-block bg-brand-pink/10 text-brand-pink font-bold px-4 py-1.5 rounded-full text-sm">#GLA-0000</div>
            </div>
            <div class="px-8 pb-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 class="font-bold text-base mb-3 flex items-center gap-2">
                            <span class="text-brand-pink">📋</span> Resumen del Pedido
                        </h3>
                        <div id="success-items" class="space-y-2 text-sm"></div>
                        <div id="success-totals" class="border-t border-pink-100 pt-2 mt-2 space-y-1 text-sm font-medium"></div>
                    </div>
                    <div>
                        <h3 class="font-bold text-base mb-3 flex items-center gap-2">
                            <span class="text-brand-pink">📌</span> Próximos Pasos
                        </h3>
                        <div class="space-y-3">
                            <div class="flex gap-3">
                                <span class="w-7 h-7 bg-brand-pink text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                <p class="text-sm text-gray-600">Revisa tu correo electrónico para ver la confirmación de tu pedido.</p>
                            </div>
                            <div class="flex gap-3">
                                <span class="w-7 h-7 bg-brand-pink text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                <p class="text-sm text-gray-600">Te contactaremos por WhatsApp para confirmar disponibilidad y detalles del pago.</p>
                            </div>
                            <div class="flex gap-3">
                                <span class="w-7 h-7 bg-brand-pink text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                <p class="text-sm text-gray-600">Una vez confirmado el pago, preparamos tu pedido con mucho amor. 💕</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border-2 border-dashed border-brand-pink/40 rounded-2xl p-4 bg-brand-light/30 text-center mb-6">
                    <div class="text-2xl mb-1">🎁</div>
                    <p class="font-semibold text-brand-pink text-sm mb-1">¡Comparte y gana!</p>
                    <p class="text-xs text-gray-600">Recomienda Trendy by Gla Accesorios a tus amigas y obtén un <strong>10% de descuento</strong> en tu próxima compra.</p>
                </div>
                <div class="flex items-center justify-center gap-4 mb-6">
                    <a href="https://www.instagram.com/Trendybygla" target="_blank" class="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-pink transition-colors">
                        <svg class="w-5 h-5 text-brand-pink" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        @Trendybygla
                    </a>
                    <a href="https://www.tiktok.com/@trendybygla" target="_blank" class="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-pink transition-colors">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9a8.17 8.17 0 004.77 1.52V7.07a4.85 4.85 0 01-1-.38z"/></svg>
                        TikTok
                    </a>
                </div>
                <div class="text-center">
                    <button onclick="closeSuccessModal()" class="text-brand-pink hover:underline font-semibold text-sm">
                        ← Volver a la Tienda
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Toast container -->
<div id="toast-container" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none"></div>
`

export default function Home() {
  return (
    <>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: bodyHTML }} />
      <Script src="/app.js" strategy="afterInteractive" />
    </>
  )
}
