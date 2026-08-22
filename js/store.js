/**
 * ============================================================
 *  Southery Sentie — Centralised State Store (store.js)
 * ============================================================
 *
 *  Single source of truth for all client-side state:
 *    • cart        — array of { id, qty }
 *    • wishlist    — array of { id }
 *    • currentUser — user object | null
 *    • token       — JWT string | null
 *    • recentSearches — string[]
 *    • products    — normalised product catalogue
 *
 *  Principles
 *  ──────────
 *  1. All state lives inside `SoutheryStore` — nothing on `window.*` globals.
 *  2. Every mutation goes through a store method so we can persist,
 *     sync to the API, and notify the UI in one place.
 *  3. The store is event-driven: call `store.on(event, fn)` to react to
 *     changes instead of directly coupling UI updates.
 *  4. localStorage / sessionStorage serialisation is handled here — no
 *     other file should touch `southery_*` keys directly.
 *
 *  Phase-1 scope: create the module. layout.js is NOT modified yet.
 *  Phase-2 will wire layout.js to import from this store.
 * ============================================================
 */

const SoutheryStore = (function () {

  // ─── Storage Keys ──────────────────────────────────────────
  const KEYS = Object.freeze({
    CART:         'southery_cart',
    WISHLIST:     'southery_wishlist',
    USER:         'southery_user',
    TOKEN:        'southery_token',
    ORDERS:       'southery_orders',
    SEARCHES:     'recent_searches',
    APP_VERSION:  'southery_app_version',
    PRODUCT_CACHE:'southery_products_cache',
  });

  const CURRENT_APP_VERSION = '2.0.0';
  const PRODUCT_CACHE_TTL   = 5 * 60 * 1000; // 5 min

  // ─── Internal State ────────────────────────────────────────
  let _cart          = [];
  let _wishlist      = [];
  let _currentUser   = null;
  let _token         = null;
  let _recentSearches = [];
  let _products      = [];
  let _productCache  = null; // fallback from products.js static array

  // ─── Event Bus ─────────────────────────────────────────────
  const _listeners = {};

  function on(event, fn) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(fn);
  }

  function off(event, fn) {
    if (!_listeners[event]) return;
    _listeners[event] = _listeners[event].filter(f => f !== fn);
  }

  function _emit(event, detail) {
    (_listeners[event] || []).forEach(fn => {
      try { fn(detail); } catch (e) { console.error(`[store] listener error (${event}):`, e); }
    });
  }

  // ─── Safe localStorage helpers ─────────────────────────────
  function _readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }

  function _writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function _readSessionJSON(key, fallback) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }

  function _writeSessionJSON(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  // ─── API Helpers (mirrors layout.js getApiBase + apiCall) ──
  function _getApiBase() {
    if (typeof window === 'undefined') return 'https://southery-backend.vercel.app';
    const override = localStorage.getItem('southery_api_base');
    if (override) return override.replace(/\/$/, '');
    const host = window.location.hostname;
    const isLocal = host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '[::1]' ||
      host.endsWith('.local') ||
      /^192\.168\./.test(host) ||
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host);
    return isLocal ? 'http://localhost:5000' : 'https://southery-backend.vercel.app';
  }

  async function _apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (_token) headers['Authorization'] = `Bearer ${_token}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const base = _getApiBase();
    const url  = `${base}${endpoint}`;

    try {
      const res  = await fetch(url, opts);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err    = new Error(data.message || `API Error: ${res.status} ${res.statusText}`);
        err.status   = res.status;
        throw err;
      }
      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          `Cannot reach the server at ${url}. ` +
          `Possible causes: backend not running, CORS misconfiguration, or mixed HTTP/HTTPS.`
        );
      }
      throw error;
    }
  }

  // ─── Boot / Hydration ──────────────────────────────────────

  /**
   * Hydrate in-memory state from localStorage.
   * Called once on script load, before DOMContentLoaded.
   */
  function _hydrate() {
    // Version gate — clear stale data on upgrade
    if (localStorage.getItem(KEYS.APP_VERSION) !== CURRENT_APP_VERSION) {
      localStorage.removeItem(KEYS.ORDERS);
      localStorage.setItem(KEYS.APP_VERSION, CURRENT_APP_VERSION);
    }

    _cart            = _readJSON(KEYS.CART, []);
    _wishlist        = _readJSON(KEYS.WISHLIST, []);
    _currentUser     = _readJSON(KEYS.USER, null);
    _token           = localStorage.getItem(KEYS.TOKEN) || null;
    _recentSearches  = _readJSON(KEYS.SEARCHES, []);
  }

  // ═══════════════════════════════════════════════════════════
  //  CART
  // ═══════════════════════════════════════════════════════════

  function getCart() { return _cart; }

  function getCartCount() {
    return _cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  }

  function getCartTotal(productList) {
    const prods = productList || getProducts();
    return _cart.reduce((total, c) => {
      const p = prods.find(x => String(x.id) === String(c.id));
      return total + (p ? p.price * c.qty : 0);
    }, 0);
  }

  function addToCart(id, qty = 1) {
    const existing = _cart.find(c => String(c.id) === String(id));
    if (existing) existing.qty += qty;
    else _cart.push({ id, qty });
    _persistCart();

    // Server sync (fire & forget)
    if (_token) {
      _apiCall('/api/cart/add', 'POST', { productId: String(id), quantity: qty })
        .catch(e => console.warn('[store] cart sync failed:', e.message));
    }

    _emit('cart:changed', { action: 'add', id, qty });
  }

  function updateCartQty(id, change) {
    const index = _cart.findIndex(c => String(c.id) === String(id));
    if (index === -1) return;

    _cart[index].qty += change;
    const removed = _cart[index].qty <= 0;
    if (removed) _cart.splice(index, 1);
    _persistCart();

    // Server sync
    if (_token) {
      if (removed) {
        _apiCall('/api/cart/remove/' + id, 'DELETE')
          .catch(e => console.warn('[store] cart remove sync failed:', e.message));
      } else {
        const current = _cart.find(c => String(c.id) === String(id));
        _apiCall('/api/cart/add', 'POST', {
          productId: String(id),
          quantity: current ? current.qty : 1
        }).catch(e => console.warn('[store] cart update sync failed:', e.message));
      }
    }

    _emit('cart:changed', { action: removed ? 'remove' : 'update', id, change });
  }

  function clearCart() {
    _cart = [];
    _persistCart();
    if (_token) {
      _apiCall('/api/cart/clear', 'DELETE')
        .catch(e => console.warn('[store] cart clear sync failed:', e.message));
    }
    _emit('cart:changed', { action: 'clear' });
  }

  function setCart(newCart) {
    _cart = Array.isArray(newCart) ? newCart : [];
    _persistCart();
    _emit('cart:changed', { action: 'set', cart: _cart });
  }

  function _persistCart() {
    _writeJSON(KEYS.CART, _cart);
  }

  // ═══════════════════════════════════════════════════════════
  //  WISHLIST
  // ═══════════════════════════════════════════════════════════

  function getWishlist() { return _wishlist; }

  function getWishlistCount() { return _wishlist.length; }

  function isInWishlist(id) {
    return _wishlist.some(w => String(w.id) === String(id));
  }

  function toggleWishlistItem(id) {
    const index = _wishlist.findIndex(w => String(w.id) === String(id));
    const isAdding = index === -1;

    if (isAdding) _wishlist.push({ id });
    else _wishlist.splice(index, 1);
    _persistWishlist();

    // Server sync
    if (_token) {
      if (isAdding) {
        _apiCall('/api/wishlist/add', 'POST', { productId: String(id) })
          .catch(e => console.warn('[store] wishlist sync failed:', e.message));
      } else {
        _apiCall('/api/wishlist/remove/' + id, 'DELETE')
          .catch(e => console.warn('[store] wishlist sync failed:', e.message));
      }
    }

    _emit('wishlist:changed', { action: isAdding ? 'add' : 'remove', id });
    return isAdding;
  }

  function addToCartFromWishlist(id) {
    addToCart(id, 1);
    _emit('wishlist:movedToCart', { id });
  }

  function _persistWishlist() {
    _writeJSON(KEYS.WISHLIST, _wishlist);
  }

  function setWishlist(newWishlist) {
    _wishlist = Array.isArray(newWishlist) ? newWishlist : [];
    _persistWishlist();
    _emit('wishlist:changed', { action: 'set', wishlist: _wishlist });
  }

  function clearWishlist() {
    _wishlist = [];
    _persistWishlist();
    if (_token) {
      _apiCall('/api/wishlist/clear', 'DELETE')
        .catch(e => console.warn('[store] wishlist clear sync failed:', e.message));
    }
    _emit('wishlist:changed', { action: 'clear' });
  }

  // ═══════════════════════════════════════════════════════════
  //  AUTH / USER
  // ═══════════════════════════════════════════════════════════

  function getCurrentUser() { return _currentUser; }
  function getToken()       { return _token; }
  function isLoggedIn()     { return !!_token && !!_currentUser; }

  async function login(email, password) {
    const data = await _apiCall('/api/auth/login', 'POST', { email, password });
    _setSession(data.token, data.user);
    // Clear local cart/wishlist so server data takes precedence
    localStorage.removeItem(KEYS.CART);
    localStorage.removeItem(KEYS.WISHLIST);
    localStorage.removeItem(KEYS.ORDERS);
    await fetchUserCartAndWishlist();
    _emit('auth:changed', { user: _currentUser, action: 'login' });
    return data;
  }

  async function signup(name, email, password) {
    const data = await _apiCall('/api/auth/signup', 'POST', { name, email, password });
    _setSession(data.token, data.user);
    _cart = [];
    _wishlist = [];
    _persistCart();
    _persistWishlist();
    localStorage.removeItem(KEYS.ORDERS);
    _emit('auth:changed', { user: _currentUser, action: 'signup' });
    return data;
  }

  function logout() {
    localStorage.clear();
    _currentUser = null;
    _token = null;
    _cart = [];
    _wishlist = [];
    _recentSearches = [];
    _emit('auth:changed', { user: null, action: 'logout' });
    _emit('cart:changed',     { action: 'clear' });
    _emit('wishlist:changed', { action: 'clear' });
  }

  /**
   * Validate existing session with `/api/auth/me`.
   * Called on every page load (DOMContentLoaded).
   */
  async function validateSession() {
    if (!_token) {
      _currentUser = null;
      localStorage.removeItem(KEYS.USER);
      _emit('auth:changed', { user: null, action: 'no-token' });
      return;
    }

    try {
      const data = await _apiCall('/api/auth/me');
      _currentUser = data.user;
      _writeJSON(KEYS.USER, _currentUser);
      _emit('auth:changed', { user: _currentUser, action: 'validated' });
      await fetchUserCartAndWishlist();
    } catch (error) {
      const isAuthError = error.status === 401 || error.status === 403;
      if (isAuthError) {
        // Token invalid/expired — full logout
        localStorage.removeItem(KEYS.TOKEN);
        localStorage.removeItem(KEYS.USER);
        _currentUser = null;
        _token = null;
        _emit('auth:changed', { user: null, action: 'expired' });
      } else {
        // Network/server error — keep local state
        console.log('[store] Network/server error — falling back to local user state.');
        _currentUser = _readJSON(KEYS.USER, null);
        _emit('auth:changed', { user: _currentUser, action: 'offline-fallback' });
        await fetchUserCartAndWishlist();
      }
    }
  }

  async function forgotPassword(email) {
    return _apiCall('/api/auth/forgot-password', 'POST', { email });
  }

  function _setSession(token, user) {
    _token       = token;
    _currentUser = user;
    localStorage.setItem(KEYS.TOKEN, token);
    _writeJSON(KEYS.USER, user);
  }

  // ═══════════════════════════════════════════════════════════
  //  SERVER SYNC  — Cart & Wishlist
  // ═══════════════════════════════════════════════════════════

  async function fetchUserCartAndWishlist() {
    const localCart = _readJSON(KEYS.CART, []);
    const localWish = _readJSON(KEYS.WISHLIST, []);

    if (!_token) {
      _cart     = localCart;
      _wishlist = localWish;
      _emit('cart:changed',     { action: 'hydrate' });
      _emit('wishlist:changed', { action: 'hydrate' });
      return;
    }

    // Cart
    try {
      const cartData = await _apiCall('/api/cart');
      if (cartData && Array.isArray(cartData.cart)) {
        _cart = cartData.cart.map(item => ({ id: item.productId, qty: item.quantity }));
        _persistCart();
      }
    } catch (e) {
      console.warn('[store] Failed to fetch cart from API:', e.message);
      _cart = localCart;
    }

    // Wishlist
    try {
      const wishData = await _apiCall('/api/wishlist');
      if (wishData && Array.isArray(wishData.wishlist)) {
        _wishlist = wishData.wishlist.map(item => ({ id: item.productId }));
        _persistWishlist();
      }
    } catch (e) {
      console.warn('[store] Failed to fetch wishlist from API:', e.message);
      _wishlist = localWish;
    }

    _emit('cart:changed',     { action: 'hydrate' });
    _emit('wishlist:changed', { action: 'hydrate' });
  }

  // ═══════════════════════════════════════════════════════════
  //  PRODUCTS
  // ═══════════════════════════════════════════════════════════

  function getProducts() {
    if (_products.length > 0) return _products;
    if (_productCache) return _productCache;
    // Fallback: try window-level (products.js sets a global)
    if (typeof products !== 'undefined' && Array.isArray(products)) return products;
    return [];
  }

  function setProducts(list) {
    _products = list;
    _emit('products:loaded', list);
  }

  function setProductCache(list) {
    _productCache = list;
  }

  function findProduct(id) {
    return getProducts().find(p => String(p.id) === String(id)) || null;
  }

  /**
   * Load products from the API (mirrors products-api.js behaviour).
   * Returns the loaded array.
   */
  async function loadProductsFromAPI() {
    // Check sessionStorage cache first
    const cached = _readSessionJSON(KEYS.PRODUCT_CACHE, null);
    if (cached && cached.data && cached.data.length > 0) {
      if (Date.now() - cached.timestamp < PRODUCT_CACHE_TTL) {
        _products = cached.data;
        _emit('products:loaded', _products);
        return _products;
      }
    }

    try {
      const res = await fetch(_getApiBase() + '/api/products');
      if (!res.ok) throw new Error('API error ' + res.status);
      const json = await res.json();
      const raw  = json.data?.products || [];

      _products = raw.map(p => ({
        id:             p._id,
        _id:            p._id,
        name:           p.name,
        slug:           p.slug,
        price:          p.price,
        comparePrice:   p.comparePrice,
        category:       (p.category || '').toLowerCase(),
        collection:     (p.collectionName || '').toLowerCase(),
        description:    p.description,
        images:         p.images || [],
        image:          (p.images && p.images[0]) || '',
        stock:          p.stock !== undefined ? p.stock : 0,
        isFeatured:     p.isFeatured || false,
        specs:          p.specs || {},
        ratingsAverage: p.ratingsAverage,
        salesCount:     p.salesCount,
      }));

      _writeSessionJSON(KEYS.PRODUCT_CACHE, {
        data: _products,
        timestamp: Date.now(),
      });

      _emit('products:loaded', _products);
      return _products;
    } catch (err) {
      console.error('[store] Failed to load products:', err.message);
      _emit('products:loaded', []);
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  SEARCH
  // ═══════════════════════════════════════════════════════════

  function getRecentSearches() { return _recentSearches; }

  function saveSearchQuery(q) {
    q = (q || '').trim();
    if (!q || q.length < 2) return;
    _recentSearches = [q, ..._recentSearches.filter(s => s !== q)].slice(0, 5);
    _writeJSON(KEYS.SEARCHES, _recentSearches);
    _emit('search:updated', _recentSearches);
  }

  function clearRecentSearches() {
    _recentSearches = [];
    localStorage.removeItem(KEYS.SEARCHES);
    _emit('search:updated', _recentSearches);
  }

  // ═══════════════════════════════════════════════════════════
  //  ORDERS
  // ═══════════════════════════════════════════════════════════

  async function fetchUserOrders() {
    try {
      return await _apiCall('/api/orders/myorders');
    } catch (error) {
      console.error('[store] Failed to fetch orders:', error);
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  CONTACT FORM
  // ═══════════════════════════════════════════════════════════

  async function submitContactForm(formData) {
    return _apiCall('/api/contact', 'POST', formData);
  }

  // ═══════════════════════════════════════════════════════════
  //  INITIALISE
  // ═══════════════════════════════════════════════════════════

  // Hydrate immediately on script parse
  _hydrate();

  // ═══════════════════════════════════════════════════════════
  //  PUBLIC API
  // ═══════════════════════════════════════════════════════════

  return Object.freeze({
    // Event bus
    on,
    off,

    // Keys (read-only, for debug / migration)
    KEYS,

    // API helper (exposed for edge cases; prefer store methods)
    apiCall: _apiCall,
    getApiBase: _getApiBase,

    // Cart
    getCart,
    getCartCount,
    getCartTotal,
    addToCart,
    updateCartQty,
    clearCart,
    setCart,

    // Wishlist
    getWishlist,
    getWishlistCount,
    isInWishlist,
    toggleWishlistItem,
    addToCartFromWishlist,
    clearWishlist,
    setWishlist,

    // Auth
    getCurrentUser,
    getToken,
    isLoggedIn,
    login,
    signup,
    logout,
    validateSession,
    forgotPassword,

    // Server Sync
    fetchUserCartAndWishlist,

    // Products
    getProducts,
    setProducts,
    setProductCache,
    findProduct,
    loadProductsFromAPI,

    // Search
    getRecentSearches,
    saveSearchQuery,
    clearRecentSearches,

    // Orders
    fetchUserOrders,

    // Contact
    submitContactForm,
  });

})();

