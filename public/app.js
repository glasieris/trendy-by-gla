// ===== CONFIG =====
const BCV_RATE = 443.26;
const CART_KEY = 'gla_cart_v3';

// ===== FABRICS =====
const fabrics = [
    {name:'Rosa Pastel', hex:'#FBCFE8'},
    {name:'Negro Profundo', hex:'#1F2937'},
    {name:'Champagne', hex:'#F5E6C8'},
    {name:'Azul Rey', hex:'#1D4ED8'},
    {name:'Vino Tinto', hex:'#7F1D1D'},
    {name:'Blanco Perla', hex:'#F8FAFC'},
    {name:'Fucsia', hex:'#DB2777'},
    {name:'Lila', hex:'#C084FC'},
    {name:'Dorado', hex:'#D4A574'}
];

// ===== CATEGORIES =====
const categories = ['All', 'Satin', 'Oro Laminado', 'Sets', 'Ultimos'];
const categoryLabels = {
    'All': 'Todos',
    'Satin': 'Accesorios de Satín',
    'Oro Laminado': 'Oro Laminado',
    'Sets': 'Set para Regalar',
    'Ultimos': 'Últimos Disponibles',
    'Al Mayor': 'Al Mayor'
};

const categoryDescriptions = {
    'Satin': 'Accesorios de satén premium para el cuidado y estilo de tu cabello.',
    'Oro Laminado': 'Joyería de oro laminado elegante para complementar cualquier look.',
    'Sets': 'Sets curados para regalar, ideales para cualquier ocasión.',
    'Ultimos': 'Los últimos productos disponibles — ¡no te los pierdas!'
};

// ===== PRODUCTS =====
const products = [
    // Accesorios de Satín
    {id:'s1',  name:'Bandanas Grandes',          category:'Satin',        is_hair:false, has_fabrics:true,  price_detal:6.50,  price_mayor:6.00,  min_mayor:6,   description:'Bandana de tela satinada, medida 1m x 1m'},
    {id:'s2',  name:'Bandanas Pequeñas',         category:'Satin',        is_hair:false, has_fabrics:true,  price_detal:9.50,  price_mayor:9.00,  min_mayor:6,   description:'Bandana de tela satinada, medida 60cm x 60cm'},
    {id:'s3',  name:'Llavero Satinado',          category:'Satin',        is_hair:false, has_fabrics:true,  price_detal:4.50,  price_mayor:4.20,  min_mayor:6,   description:'Llavero de tela con cancamo de metal'},
    {id:'s4',  name:'Maxi Scrunchies',           category:'Satin',        is_hair:true,  has_fabrics:true,  price_detal:2.00,  price_mayor:1.60,  min_mayor:24,  description:'Maxiscrunchies de tela satinada'},
    {id:'s5',  name:'Tubo de Ondas',             category:'Satin',        is_hair:false, has_fabrics:false, price_detal:10.50, price_mayor:9.50,  min_mayor:6,   description:'Tubo de tela satinada para hacer ondas en el cabello sin calor'},
    {id:'s6',  name:'Scrunchies',                category:'Satin',        is_hair:true,  has_fabrics:true,  price_detal:1.50,  price_mayor:1.20,  min_mayor:24,  description:'Scrunchies de tela satinada'},
    {id:'s7',  name:'Gorro Satinado',            category:'Satin',        is_hair:false, has_fabrics:true,  price_detal:10.50, price_mayor:9.50,  min_mayor:6,   description:'Gorro reversible de tela satinada con elástica'},
    {id:'s8',  name:'Neceser Satinado',          category:'Satin',        is_hair:false, has_fabrics:false, price_detal:8.00,  price_mayor:7.50,  min_mayor:6,   description:'Neceser grande de tela'},
    {id:'s9',  name:'Fundas de Almohada',        category:'Satin',        is_hair:false, has_fabrics:true,  price_detal:8.00,  price_mayor:7.70,  min_mayor:6,   description:'Fundas de almohada con tela satinada'},
    // Oro Laminado
    {id:'o1',  name:'Zarcillos',                 category:'Oro Laminado', is_hair:false, has_fabrics:false, price_detal:5.00,  price_mayor:5.00,  min_mayor:999, description:'Zarcillos de acero'},
    {id:'o2',  name:'Cadenas',                   category:'Oro Laminado', is_hair:false, has_fabrics:false, price_detal:6.00,  price_mayor:6.00,  min_mayor:999, description:'Cadenas de oro laminado'},
    // Set para Regalar
    {id:'g1',  name:'Caja de Regalo 6$',         category:'Sets',         is_hair:false, has_fabrics:false, price_detal:6.00,  price_mayor:6.00,  min_mayor:999, description:'Incluye mascarilla, lip balm, lápiz de labio, scrunchie'},
    {id:'g2',  name:'Caja de Regalo 10,50$',     category:'Sets',         is_hair:false, has_fabrics:false, price_detal:10.50, price_mayor:10.50, min_mayor:999, description:'Incluye rubor, pinza para el cabello, labial, scrunchie, lápiz delineador'},
    {id:'g3',  name:'Caja de Regalo 14$',        category:'Sets',         is_hair:false, has_fabrics:false, price_detal:14.00, price_mayor:14.00, min_mayor:999, description:'Incluye set de sombras, rubor, labial, lápiz delineador, scrunchie'},
    {id:'g4',  name:'Caja de Regalo 19$',        category:'Sets',         is_hair:false, has_fabrics:false, price_detal:19.00, price_mayor:19.00, min_mayor:999, description:'Incluye antibacterial, crema para manos, labial, rímel, rubor, scrunchie'},
    // Últimos Disponibles
    {id:'u1',  name:'Ahorradores',               category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:5.00,  price_mayor:5.00,  min_mayor:999, description:''},
    {id:'u2',  name:'Antibacterial',             category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:5.50,  price_mayor:5.50,  min_mayor:999, description:'Antibacterial marca Bath & Body works'},
    {id:'u3',  name:'Base',                      category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:3.00,  price_mayor:3.00,  min_mayor:999, description:'Base mouse marca Trendy'},
    {id:'u4',  name:'Cintillo Skincare',         category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:3.80,  price_mayor:3.80,  min_mayor:999, description:'Cintillo de tela para skincare'},
    {id:'u5',  name:'Corrector',                 category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:4.00,  price_mayor:4.00,  min_mayor:999, description:'Corrector liquido para ojeras'},
    {id:'u6',  name:'Crema de Manos',            category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:3.00,  price_mayor:3.00,  min_mayor:999, description:''},
    {id:'u7',  name:'Delineadores de Colores',   category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:1.00,  price_mayor:1.00,  min_mayor:999, description:'Delineadores para ojos líquidos de colores'},
    {id:'u8',  name:'Diadema',                   category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:1.00,  price_mayor:1.00,  min_mayor:999, description:'Diadema de tela satinada pequeña para niñas'},
    {id:'u9',  name:'Espejo',                    category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:1.50,  price_mayor:1.50,  min_mayor:999, description:'Espejo doble circular ideal para cartera'},
    {id:'u10', name:'Labiales',                  category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:2.00,  price_mayor:2.00,  min_mayor:999, description:''},
    {id:'u11', name:'Mascarillas',               category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:0.95,  price_mayor:0.95,  min_mayor:999, description:''},
    {id:'u12', name:'Pinza de Pestaña',          category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:2.00,  price_mayor:2.00,  min_mayor:999, description:'Pinza para pegar pestañas postizas marca Trendy'},
    {id:'u13', name:'Pinzas',                    category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:3.00,  price_mayor:3.00,  min_mayor:999, description:'Pinzas de plástico para el cabello'},
    {id:'u14', name:'Polvo',                     category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:4.00,  price_mayor:4.00,  min_mayor:999, description:''},
    {id:'u15', name:'Polvo de Hada',             category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:4.00,  price_mayor:4.00,  min_mayor:999, description:''},
    {id:'u16', name:'Rímel',                     category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:4.00,  price_mayor:4.00,  min_mayor:999, description:''},
    {id:'u17', name:'Set de Brochas',            category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:3.50,  price_mayor:3.50,  min_mayor:999, description:'Set viajero completo de brochas para maquillaje'},
    {id:'u18', name:'Sombra Líquida',            category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:3.00,  price_mayor:3.00,  min_mayor:999, description:'Sombra liquida brillante'},
    {id:'u19', name:'Tazas',                     category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:3.00,  price_mayor:3.00,  min_mayor:999, description:''},
    {id:'u20', name:'Toallitas Desmaquillantes', category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:2.50,  price_mayor:2.50,  min_mayor:999, description:''},
    {id:'u21', name:'Paletas',                   category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:4.00,  price_mayor:4.00,  min_mayor:999, description:''},
    {id:'u22', name:'Rubor',                     category:'Ultimos',      is_hair:false, has_fabrics:false, price_detal:3.00,  price_mayor:3.00,  min_mayor:999, description:''},
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
let currentCategory = 'All';
let fabricModalProduct = null;
let fabricModalColor = null;
let detailProduct = null;
let detailQty = 1;
let detailColor = null;

// ===== CART MATH =====
function calculateCartMath() {
    const baseTotal = cart.reduce((s, item) => s + item.price_detal * item.qty, 0);
    const isWholesaleGlobal = baseTotal > 70;
    let total = 0;
    const itemsWithPrice = cart.map(item => {
        const p = products.find(x => x.id === item.id);
        let unitPrice = item.price_detal;
        let isMayor = false;
        if (p) {
            if (p.is_hair) {
                if (item.qty >= 24) { unitPrice = p.price_mayor; isMayor = true; }
            } else {
                if (isWholesaleGlobal || item.qty >= p.min_mayor) { unitPrice = p.price_mayor; isMayor = true; }
            }
        }
        const subtotal = unitPrice * item.qty;
        total += subtotal;
        return { ...item, unitPrice, isMayor, subtotal };
    });
    return { itemsWithPrice, total, isWholesaleGlobal };
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ===== TOAST =====
function showToast(msg, type='success') {
    const el = document.createElement('div');
    el.className = `toast pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${type === 'success' ? 'bg-brand-pink text-white' : 'bg-gray-800 text-white'}`;
    el.innerHTML = (type === 'success' ? '✓ ' : 'ℹ ') + msg;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => el.remove(), 2100);
}

// ===== CATEGORY PILLS =====
function renderCategoryPills() {
    const el = document.getElementById('category-pills');
    el.innerHTML = categories.map(cat => `
        <button onclick="filterCategory('${cat}')"
            class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap
            ${currentCategory === cat ? 'bg-brand-pink text-white border-brand-pink shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-pink hover:text-brand-pink'}">
            ${categoryLabels[cat] || cat}
        </button>
    `).join('');
}

// ===== PRODUCTS RENDERING =====
function getProductImage(p) {
    return `/img/products/${p.id}.jpg`;
}

function getCategoryEmoji(cat) {
    if (cat === 'Satin') return '🎀';
    if (cat === 'Oro Laminado') return '✨';
    if (cat === 'Sets') return '🎁';
    return '🛍️';
}

function renderProducts() {
    let list = currentCategory === 'All' ? products
        : currentCategory === 'Al Mayor' ? products
        : products.filter(p => p.category === currentCategory);

    document.getElementById('catalog-title').textContent = currentCategory === 'All' ? 'Todos los Productos'
        : currentCategory === 'Al Mayor' ? 'Precios Al Mayor'
        : categoryLabels[currentCategory] || currentCategory;

    document.getElementById('catalog-subtitle').textContent = currentCategory === 'Al Mayor'
        ? 'Precios especiales por volumen · Desde 6 unidades'
        : currentCategory === 'All' ? 'Accesorios de satén premium · Mayor y detal'
        : (categoryDescriptions[currentCategory] || '');

    document.getElementById('product-count').textContent = `${list.length} producto${list.length !== 1 ? 's' : ''}`;

    document.getElementById('product-grid').innerHTML = list.map(p => {
        const mayorBadge = currentCategory === 'Al Mayor'
            ? `<div class="text-xs text-green-700 font-medium">Mayor: $${p.price_mayor.toFixed(2)} (${p.min_mayor}+ uds)</div>`
            : `<div class="text-xs text-gray-400">Mayor: $${p.price_mayor.toFixed(2)} · ${p.min_mayor}+ uds</div>`;
        const bsPrice = (p.price_detal * BCV_RATE).toFixed(0);
        return `
        <div class="product-card bg-white rounded-2xl shadow-md overflow-hidden group flex flex-col">
            <div class="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onclick="openDetailModal('${p.id}')">
                <img src="${getProductImage(p)}" alt="${p.name}" class="product-img w-full h-full object-cover"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                <div class="hidden w-full h-full items-center justify-center bg-gradient-to-br from-brand-light to-pink-200 text-4xl">
                    ${getCategoryEmoji(p.category)}
                </div>
            </div>
            <div class="p-3 flex flex-col flex-1">
                <span class="text-xs text-brand-pink font-medium mb-1">${categoryLabels[p.category] || p.category}</span>
                <h3 class="font-semibold text-sm text-gray-800 mb-1 leading-tight flex-1">${p.name}</h3>
                <div class="text-brand-pink font-bold text-base">$${p.price_detal.toFixed(2)} <span class="text-xs font-normal text-gray-500">Detal</span></div>
                ${mayorBadge}
                <div class="text-xs text-gray-400 mb-3">≈ ${Number(bsPrice).toLocaleString('es-VE')} Bs</div>
                <button onclick="quickAdd('${p.id}')" class="w-full bg-gray-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-brand-pink transition-colors">
                    Agregar
                </button>
            </div>
        </div>`;
    }).join('');
}

function filterCategory(cat) {
    currentCategory = cat;
    renderCategoryPills();
    renderProducts();
    document.getElementById('catalog-section').scrollIntoView({behavior:'smooth', block:'start'});
}

// ===== QUICK ADD =====
function quickAdd(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    if (p.has_fabrics) {
        openFabricModal(p);
    } else {
        addToCart(p, 1, null);
        showToast(`${p.name} agregado al carrito`);
    }
}

// ===== FABRIC MODAL =====
function openFabricModal(p) {
    fabricModalProduct = p;
    fabricModalColor = null;
    document.getElementById('fabric-modal-title').textContent = `Elige tu color · ${p.name}`;
    const swatchContainer = document.getElementById('fabric-swatches');
    swatchContainer.innerHTML = fabrics.map((f, i) => `
        <button onclick="selectFabric(${i})" id="swatch-${i}"
            class="flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-transparent hover:border-brand-pink transition-all">
            <div class="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm" style="background:${f.hex}"></div>
            <span class="text-xs text-gray-600 text-center leading-tight">${f.name}</span>
        </button>
    `).join('');
    document.getElementById('fabric-backdrop').classList.remove('hidden');
    document.getElementById('fabric-modal').classList.remove('hidden');
}

function selectFabric(i) {
    fabricModalColor = fabrics[i].name;
    document.querySelectorAll('[id^="swatch-"]').forEach((el, idx) => {
        el.classList.toggle('border-brand-pink', idx === i);
        el.classList.toggle('bg-brand-light', idx === i);
        el.classList.toggle('border-transparent', idx !== i);
    });
}

function closeFabricModal() {
    document.getElementById('fabric-backdrop').classList.add('hidden');
    document.getElementById('fabric-modal').classList.add('hidden');
    fabricModalProduct = null;
    fabricModalColor = null;
}

function confirmFabric() {
    if (!fabricModalColor) { showToast('Por favor selecciona un color', 'info'); return; }
    addToCart(fabricModalProduct, 1, fabricModalColor);
    showToast(`${fabricModalProduct.name} (${fabricModalColor}) agregado`);
    closeFabricModal();
}

// ===== ADD TO CART =====
function addToCart(p, qty, color) {
    const key = p.id + (color ? '_' + color : '');
    const existing = cart.find(x => x.key === key);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ key, id: p.id, name: p.name, category: p.category, is_hair: p.is_hair, has_fabrics: p.has_fabrics, price_detal: p.price_detal, price_mayor: p.price_mayor, min_mayor: p.min_mayor, qty, color });
    }
    saveCart();
    renderCart();
    updateCartBadge();
}

// ===== CART =====
function updateCartBadge() {
    const total = cart.reduce((s, x) => s + x.qty, 0);
    const badge = document.getElementById('cart-badge');
    badge.textContent = total;
    badge.classList.toggle('hidden', total === 0);
    updateCartFloat(total);
}

function updateCartFloat(total) {
    if (total === undefined) total = cart.reduce((s, x) => s + x.qty, 0);
    const btn = document.getElementById('cart-float-btn');
    const badge = document.getElementById('cart-float-badge');
    if (!btn) return;
    const scrolled = window.scrollY > 120;
    btn.classList.toggle('hidden', !(total > 0 && scrolled));
    if (badge) {
        badge.textContent = total;
        badge.classList.toggle('hidden', total === 0);
    }
}

function renderCart() {
    const { itemsWithPrice, total, isWholesaleGlobal } = calculateCartMath();
    const el = document.getElementById('cart-items');
    if (cart.length === 0) {
        el.innerHTML = '<div class="text-center text-gray-400 py-12"><div class="text-4xl mb-3">🛍️</div><p class="text-sm">Tu carrito está vacío</p></div>';
        document.getElementById('cart-totals').innerHTML = '';
        document.getElementById('cart-total').textContent = '$0.00';
        document.getElementById('cart-total-bs').textContent = '';
        return;
    }
    el.innerHTML = itemsWithPrice.map(item => `
        <div class="flex gap-3 bg-gray-50 rounded-xl p-3">
            <img src="/img/products/${item.id}.jpg" alt="${item.name}" class="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="hidden w-14 h-14 rounded-lg bg-brand-light items-center justify-center text-xl flex-shrink-0">${getCategoryEmoji(products.find(p=>p.id===item.id)?.category||'')}</div>
            <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm truncate">${item.name}</div>
                ${item.color ? `<div class="text-xs text-gray-500">${item.color}</div>` : ''}
                ${item.isMayor ? '<span class="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Mayor ✓</span>' : ''}
                <div class="flex items-center gap-2 mt-1.5">
                    <button onclick="changeQty('${item.key}', -1)" class="w-6 h-6 bg-white border border-gray-200 rounded-full text-sm font-bold flex items-center justify-center hover:border-brand-pink">-</button>
                    <span class="text-sm font-bold w-6 text-center">${item.qty}</span>
                    <button onclick="changeQty('${item.key}', 1)" class="w-6 h-6 bg-white border border-gray-200 rounded-full text-sm font-bold flex items-center justify-center hover:border-brand-pink">+</button>
                    <span class="ml-auto text-sm font-bold text-brand-pink">$${item.subtotal.toFixed(2)}</span>
                </div>
            </div>
            <button onclick="removeItem('${item.key}')" class="text-gray-300 hover:text-red-400 self-start ml-1 text-lg leading-none">×</button>
        </div>
    `).join('');

    let totalsHtml = '';
    if (isWholesaleGlobal) {
        totalsHtml += '<div class="text-green-700 text-xs bg-green-50 px-2 py-1 rounded-lg">✅ Precios mayor aplicados (total &gt; $70)</div>';
    }
    document.getElementById('cart-totals').innerHTML = totalsHtml;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('cart-total-bs').textContent = `≈ ${(total * BCV_RATE).toLocaleString('es-VE', {maximumFractionDigits:0})} Bs (BCV ${BCV_RATE})`;
}

function changeQty(key, delta) {
    const item = cart.find(x => x.key === key);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart();
    renderCart();
}

function removeItem(key) {
    cart = cart.filter(x => x.key !== key);
    saveCart();
    renderCart();
    updateCartBadge();
}

function openCart() {
    renderCart();
    document.getElementById('cart-backdrop').classList.remove('hidden');
    document.getElementById('cart-drawer').style.transform = 'translateX(0)';
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-backdrop').classList.add('hidden');
    document.getElementById('cart-drawer').style.transform = 'translateX(100%)';
    document.body.style.overflow = '';
}

// ===== PRODUCT DETAIL MODAL =====
function openDetailModal(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    detailProduct = p;
    detailQty = 1;
    detailColor = null;

    const bsPrice = (p.price_detal * BCV_RATE).toFixed(0);
    const swatchsHtml = p.has_fabrics ? `
        <div class="mb-4">
            <div class="text-sm font-semibold text-gray-700 mb-2">Color / Tela:</div>
            <div class="flex flex-wrap gap-2">
                ${fabrics.map((f, i) => `
                    <button onclick="selectDetailColor(${i}, this)" title="${f.name}"
                        class="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-brand-pink transition-all shadow-sm flex-shrink-0"
                        style="background:${f.hex}">
                    </button>
                `).join('')}
            </div>
            <div id="detail-color-label" class="text-xs text-gray-500 mt-1">Ningún color seleccionado</div>
        </div>
    ` : '';

    const description = p.description || categoryDescriptions[p.category] || 'Producto de alta calidad, ideal para complementar tu estilo.';

    document.getElementById('detail-content').innerHTML = `
        <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-72 flex-shrink-0">
                <div class="aspect-square rounded-xl overflow-hidden bg-gray-50">
                    <img src="${getProductImage(p)}" alt="${p.name}" class="w-full h-full object-cover"
                         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                    <div class="hidden w-full h-full items-center justify-center bg-brand-light text-6xl">
                        ${getCategoryEmoji(p.category)}
                    </div>
                </div>
                <div class="flex gap-2 mt-2">
                    </div>
            </div>
            <div class="flex-1">
                <span class="text-xs bg-brand-light text-brand-pink px-2.5 py-1 rounded-full font-medium">${categoryLabels[p.category] || p.category}</span>
                <h2 class="font-serif text-2xl font-bold text-gray-900 mt-2 mb-1">${p.name}</h2>
                <div class="flex items-baseline gap-3 mb-1">
                    <span class="text-3xl font-bold text-brand-pink">$${p.price_detal.toFixed(2)}</span>
                    <span class="text-sm text-gray-500">Detal</span>
                </div>
                ${p.min_mayor < 999 ? `<div class="text-sm text-gray-600 mb-1">Mayor: <span class="font-semibold text-green-700">$${p.price_mayor.toFixed(2)}</span> (${p.min_mayor}+ uds)</div>` : ''}
                <div class="text-xs text-gray-400 mb-4">≈ ${Number(bsPrice).toLocaleString('es-VE')} Bs (BCV ${BCV_RATE})</div>
                ${swatchsHtml}
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-sm font-semibold text-gray-700">Cantidad:</span>
                    <button onclick="changeDetailQty(-1)" class="w-8 h-8 border-2 border-gray-200 rounded-full font-bold text-lg flex items-center justify-center hover:border-brand-pink">−</button>
                    <span id="detail-qty-display" class="text-lg font-bold w-8 text-center">${detailQty}</span>
                    <button onclick="changeDetailQty(1)" class="w-8 h-8 border-2 border-gray-200 rounded-full font-bold text-lg flex items-center justify-center hover:border-brand-pink">+</button>
                </div>
                <button onclick="addFromDetail()" class="w-full bg-brand-pink text-white py-3 rounded-xl font-bold text-base hover:bg-brand-dark transition-colors mb-4">
                    🛍️ Agregar al Carrito
                </button>
                <p class="text-sm text-gray-500 mb-4">${description}</p>
                <div class="bg-gray-50 rounded-xl p-3">
                    <div class="text-xs font-bold text-gray-700 mb-2">Tabla de precios mayor:</div>
                    <div class="flex gap-4 text-xs text-gray-600">
                        <div><span class="font-semibold">1 - ${p.min_mayor - 1} uds:</span> $${p.price_detal.toFixed(2)} c/u</div>
                        <div><span class="font-semibold text-green-700">${p.min_mayor}+ uds:</span> $${p.price_mayor.toFixed(2)} c/u</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('detail-backdrop').classList.remove('hidden');
    document.getElementById('detail-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function selectDetailColor(i, btn) {
    detailColor = fabrics[i].name;
    document.getElementById('detail-modal').querySelectorAll('[onclick^="selectDetailColor"]').forEach(el => {
        el.classList.remove('border-brand-pink', 'scale-110');
        el.classList.add('border-gray-200');
    });
    btn.classList.remove('border-gray-200');
    btn.classList.add('border-brand-pink', 'scale-110');
    document.getElementById('detail-color-label').textContent = `Color: ${fabrics[i].name}`;
}

function changeDetailQty(delta) {
    detailQty = Math.max(1, detailQty + delta);
    const el = document.getElementById('detail-qty-display');
    if (el) el.textContent = detailQty;
}

function addFromDetail() {
    if (!detailProduct) return;
    if (detailProduct.has_fabrics && !detailColor) {
        showToast('Por favor selecciona un color', 'info');
        return;
    }
    addToCart(detailProduct, detailQty, detailColor);
    showToast(`${detailProduct.name}${detailColor ? ' (' + detailColor + ')' : ''} agregado`);
    closeDetailModal();
    openCart();
}

function closeDetailModal() {
    document.getElementById('detail-backdrop').classList.add('hidden');
    document.getElementById('detail-modal').classList.add('hidden');
    document.body.style.overflow = '';
    detailProduct = null;
}

// ===== CHECKOUT =====
function openCheckout() {
    if (cart.length === 0) { showToast('Tu carrito está vacío', 'info'); return; }
    closeCart();
    renderCheckoutDetail();
    updateCheckoutTotal();
    document.getElementById('checkout-backdrop').classList.remove('hidden');
    document.getElementById('checkout-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCheckout() {
    document.getElementById('checkout-backdrop').classList.add('hidden');
    document.getElementById('checkout-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

function renderCheckoutDetail() {
    const { itemsWithPrice, total } = calculateCartMath();
    const el = document.getElementById('co-order-detail');
    el.innerHTML = itemsWithPrice.map(item => `
        <div class="flex items-center justify-between gap-2 py-1 border-b border-gray-100 last:border-0">
            <div class="flex-1 min-w-0">
                <span class="font-medium text-gray-800">${item.name}</span>
                ${item.color ? `<span class="text-gray-500"> · ${item.color}</span>` : ''}
                ${item.isMayor ? `<span class="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Mayor ✓</span>` : ''}
            </div>
            <div class="text-right flex-shrink-0">
                <span class="text-gray-600">x${item.qty}</span>
                <span class="ml-2 font-semibold text-brand-pink">$${item.subtotal.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
    document.getElementById('co-subtotal').textContent = `$${total.toFixed(2)}`;
}

function updateDeliveryFields() {
    const val = document.querySelector('input[name="delivery"]:checked')?.value;
    document.getElementById('fields-local').classList.toggle('hidden', val !== 'local');
    document.getElementById('fields-nacional').classList.toggle('hidden', val !== 'nacional');
    updateCheckoutTotal();
}

function toggleGift() {
    const checked = document.getElementById('co-gift').checked;
    document.getElementById('gift-message-wrap').classList.toggle('hidden', !checked);
    updateCheckoutTotal();
}

function getDeliveryCost() {
    const val = document.querySelector('input[name="delivery"]:checked')?.value;
    if (val === 'local') {
        const zone = document.getElementById('co-zone').value;
        if (zone) return parseFloat(zone.split('|')[1]) || 0;
    }
    return 0;
}

function updateCheckoutTotal() {
    const { total } = calculateCartMath();
    const gift = document.getElementById('co-gift')?.checked ? 1 : 0;
    const delivery = getDeliveryCost();
    const grand = total + gift + delivery;
    document.getElementById('co-total-display').textContent = `$${grand.toFixed(2)}`;
    document.getElementById('co-total-bs').textContent = `≈ ${(grand * BCV_RATE).toLocaleString('es-VE', {maximumFractionDigits:0})} Bs (BCV ${BCV_RATE})`;
}

// ===== SUBMIT ORDER (via Resend email) =====
async function submitOrder() {
    const name = document.getElementById('co-name').value.trim();
    const phone = document.getElementById('co-phone').value.trim();
    const payment = document.getElementById('co-payment').value;
    const deliveryType = document.querySelector('input[name="delivery"]:checked')?.value;

    if (!name) { showToast('Ingresa tu nombre', 'info'); return; }
    if (!phone) { showToast('Ingresa tu teléfono', 'info'); return; }
    if (!payment) { showToast('Selecciona método de pago', 'info'); return; }
    if (!deliveryType) { showToast('Selecciona método de entrega', 'info'); return; }

    const { itemsWithPrice, total } = calculateCartMath();
    const gift = document.getElementById('co-gift').checked;
    const giftMsg = document.getElementById('co-gift-msg').value.trim();
    const delivery = getDeliveryCost();
    const grand = total + (gift ? 1 : 0) + delivery;
    const orderNum = 'GLA-' + String(Math.floor(1000 + Math.random() * 9000));

    // Build delivery info
    let deliveryLabel = '';
    let deliveryInfo = {};
    if (deliveryType === 'local') {
        const zoneFull = document.getElementById('co-zone').value;
        const zoneName = zoneFull ? zoneFull.split('|')[0] : '';
        deliveryLabel = `Delivery Local — ${zoneName}`;
        deliveryInfo = {
            zone: zoneName,
            receiver: document.getElementById('co-receiver').value.trim(),
            address: document.getElementById('co-address').value.trim(),
            schedule: document.getElementById('co-schedule').value.trim(),
        };
    } else if (deliveryType === 'nacional') {
        const courier = document.getElementById('co-courier').value;
        deliveryLabel = `Envío Nacional vía ${courier}`;
        deliveryInfo = {
            courier,
            destName: document.getElementById('co-dest-name').value.trim(),
            cedula: document.getElementById('co-cedula').value.trim(),
            destPhone: document.getElementById('co-dest-phone').value.trim(),
            agencyAddr: document.getElementById('co-agency-addr').value.trim(),
        };
    } else {
        deliveryLabel = 'Retiro en Tienda';
    }

    // Show loading state
    const btn = document.getElementById('submit-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Enviando...';
    }

    try {
        const res = await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderNum,
                customerName: name,
                customerPhone: phone,
                payment,
                deliveryType,
                deliveryLabel,
                deliveryInfo,
                items: itemsWithPrice,
                subtotal: total,
                deliveryCost: delivery,
                gift,
                giftMsg,
                grand,
                bcvRate: BCV_RATE,
            }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Error al enviar');
        }

        closeCheckout();
        showSuccessModal(itemsWithPrice, total, delivery, gift, grand, orderNum);
        cart = [];
        saveCart();
        updateCartBadge();
    } catch (e) {
        console.error(e);
        showToast('Error al enviar el pedido. Por favor intenta de nuevo.', 'info');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Confirmar Pedido';
        }
    }
}

// ===== SUCCESS MODAL =====
function showSuccessModal(items, subtotal, delivery, gift, grand, orderNum) {
    document.getElementById('success-order-num').textContent = '#' + orderNum;

    document.getElementById('success-items').innerHTML = items.map(item => `
        <div class="flex justify-between items-center gap-2 py-1 border-b border-gray-100 last:border-0">
            <div>
                <span class="font-medium">${item.name}</span>
                ${item.color ? `<span class="text-gray-500 text-xs"> · ${item.color}</span>` : ''}
                ${item.isMayor ? `<span class="ml-1 text-xs bg-green-100 text-green-700 px-1 rounded-full">Mayor</span>` : ''}
            </div>
            <div class="text-right flex-shrink-0 text-gray-600">x${item.qty} <span class="text-brand-pink font-semibold">$${item.subtotal.toFixed(2)}</span></div>
        </div>
    `).join('');

    let totalsHtml = `<div class="flex justify-between"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>`;
    if (delivery > 0) totalsHtml += `<div class="flex justify-between text-gray-600"><span>Delivery</span><span>$${delivery.toFixed(2)}</span></div>`;
    if (gift) totalsHtml += `<div class="flex justify-between text-gray-600"><span>Empaque regalo</span><span>$1.00</span></div>`;
    totalsHtml += `<div class="flex justify-between text-brand-pink font-bold pt-1 border-t border-pink-100"><span>TOTAL</span><span>$${grand.toFixed(2)}</span></div>`;
    totalsHtml += `<div class="text-xs text-gray-400 text-right">≈ ${(grand * BCV_RATE).toLocaleString('es-VE', {maximumFractionDigits:0})} Bs</div>`;
    document.getElementById('success-totals').innerHTML = totalsHtml;

    document.getElementById('success-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

// ===== MISC =====
function scrollToTop() { window.scrollTo({top:0, behavior:'smooth'}); }

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

function toggleMobileCategories() {
    document.getElementById('mobile-categories').classList.toggle('hidden');
}

// ===== INIT =====
renderCategoryPills();
renderProducts();
updateCartBadge();
window.addEventListener('scroll', () => updateCartFloat());
