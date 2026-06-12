(function () {
  const CACHE_KEY = 'southery_products_cache';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  window.products = [];
  window.wishlist = window.wishlist || [];
  window.cart = window.cart || [];

  async function loadProducts() {
    // Try cache first
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && data.length > 0) {
          window.products = data;
          document.dispatchEvent(new CustomEvent('productsLoaded', { detail: data }));
          return;
        }
      }
    } catch (_) {}

    // Fetch from API
    try {
      const res = await fetch('https://southery-backend.vercel.app/api/products');
      if (!res.ok) throw new Error('API error ' + res.status);
      const json = await res.json();
      const raw = json.data?.products || [];

      // Normalise API shape to match what frontend already expects
      window.products = raw.map(function(p) {
        return {
          id: p._id,
          _id: p._id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          comparePrice: p.comparePrice,
          category: (p.category || '').toLowerCase(),
          collection: (p.collectionName || '').toLowerCase(),
          description: p.description,
          images: p.images || [],
          image: (p.images && p.images[0]) || '',
          stock: p.stock !== undefined ? p.stock : 0,
          isFeatured: p.isFeatured || false,
          specs: p.specs || {},
          ratingsAverage: p.ratingsAverage,
          salesCount: p.salesCount
        };
      });

      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
          data: window.products,
          timestamp: Date.now()
        }));
      } catch (_) {}

      document.dispatchEvent(new CustomEvent('productsLoaded', { detail: window.products }));
    } catch (err) {
      console.error('[products-api.js] Failed to load products:', err.message);
      document.dispatchEvent(new CustomEvent('productsLoaded', { detail: [] }));
    }
  }

  window.productsReady = loadProducts();
})();
