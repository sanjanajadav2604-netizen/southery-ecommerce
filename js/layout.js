const API_URL = 'https://southery-backend.vercel.app'; // Production Vercel Backend URL

async function apiCall(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('southery_token');
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...(body && { body: JSON.stringify(body) })
    };
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something went wrong');
    return data;
}

/**
 * Unified Layout & Sidebar System for Southery Sentie
 * Handles Cart, Wishlist, Auth, Search, and Mobile Nav site-wide.
 */

// Global State
window.cart = [];
window.wishlist = [];
window.currentUser = null;
window.recentSearches = [];

try {
    window.cart = JSON.parse(localStorage.getItem('southery_cart')) || [];
    window.wishlist = JSON.parse(localStorage.getItem('southery_wishlist')) || [];
    window.currentUser = JSON.parse(localStorage.getItem('southery_user')) || null;
    window.recentSearches = JSON.parse(localStorage.getItem('recent_searches')) || [];
} catch (e) {
    console.warn("Error parsing global state:", e);
}

function dispatchAuthChange() {
    window.dispatchEvent(new CustomEvent('authChange', { detail: currentUser }));
}

// Announcement Bar HTML
const announcementBarHTML = `
    <div class="announcement-bar">
        &#10024; Free shipping on all orders over &#8377;4,999 + Extra 10% off on your first purchase! Use code: FIRST10
    </div>
`;

// Sidebars & Modals HTML template
const sidebarHTML = `
    <!-- Search Drawer -->
    <div id="search-modal" class="search-wrapper fixed inset-0 z-[999999] hidden pointer-events-none overflow-y-auto">
        <div id="search-overlay" class="backdrop-bg absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 transition-opacity duration-500" onclick="toggleSearch()"></div>
        <div class="search-container search-dropdown sidebar-panel absolute top-0 left-0 right-0 bg-white shadow-2xl p-6 xs:p-8 md:p-12 -translate-y-full transition-transform duration-500 ease-out rounded-b-[40px] z-[999999]">
            <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-6 mb-8">
                    <svg class="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input type="text" id="search-input" 
                        class="flex-1 text-2xl md:text-3xl bg-transparent border-none outline-none text-charcoal placeholder-gray-200 font-display font-medium" 
                        placeholder="Discover your next treasure..."
                        oninput="handleSearch(this.value)"
                        onkeydown="if(event.key==='Enter'){ searchNow(this.value); }">
                    <button onclick="toggleSearch()" class="w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all text-3xl font-light">&times;</button>
                </div>
                
                <div id="search-initial" class="search-suggestions grid md:grid-cols-2 gap-12 animate-fade-in relative mt-6">
                    <div>
                        <h4 class="text-[10px] uppercase font-bold tracking-widest text-muted mb-6">Trending Collections</h4>
                        <div class="flex flex-wrap gap-3">
                            <button onclick="fillSearch('Handmade')" class="px-5 py-2 rounded-full bg-cream text-[11px] font-bold text-charcoal hover:bg-terracotta hover:text-white transition-all">Handmade</button>
                            <button onclick="fillSearch('Anti-Tarnish')" class="px-5 py-2 rounded-full bg-cream text-[11px] font-bold text-charcoal hover:bg-terracotta hover:text-white transition-all">Anti-Tarnish</button>
                            <button onclick="fillSearch('Necklaces')" class="px-5 py-2 rounded-full bg-cream text-[11px] font-bold text-charcoal hover:bg-terracotta hover:text-white transition-all">Necklaces</button>
                            <button onclick="fillSearch('Earrings')" class="px-5 py-2 rounded-full bg-cream text-[11px] font-bold text-charcoal hover:bg-terracotta hover:text-white transition-all">Earrings</button>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-[10px] uppercase font-bold tracking-widest text-muted mb-6">Recent Searches</h4>
                        <div id="recent-searches" class="flex flex-wrap gap-3">
                            <!-- Populated via JS -->
                        </div>
                    </div>
                </div>
                
                <div id="search-results" class="search-results-panel max-h-[70vh] overflow-y-auto hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 relative"></div>
                
                <div id="search-footer" class="mt-8 pt-8 border-t border-gray-100 hidden text-center">
                    <button id="view-all-search" class="text-[10px] uppercase font-bold tracking-widest text-terracotta hover:text-charcoal transition-colors">View All Results</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Navigation Overlay -->
    <div id="mobile-nav-overlay" class="fixed inset-0 z-[999999] hidden">
        <div class="backdrop-bg absolute inset-0 bg-cream/95 backdrop-blur-xl opacity-0 transition-opacity duration-500" onclick="toggleMobileMenu()"></div>
        <aside class="sidebar-panel absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col -translate-x-full transition-transform duration-500 ease-out">
            <div class="p-8 border-b border-gray-50">
                <div class="flex justify-between items-center mb-6">
                    <a href="index.html" class="flex items-center gap-2 group" onclick="toggleMobileMenu()">
                        <div class="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-white font-display text-sm shadow-md">S</div>
                        <div class="flex items-baseline">
                            <span class="font-display italic font-bold text-xl text-terracotta leading-none">Southery</span>
                            <span class="font-display font-semibold text-lg text-terracotta leading-none ml-0.5">Sentie</span>
                        </div>
                    </a>
                    <button onclick="toggleMobileMenu()" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-2xl font-light">&times;</button>
                </div>
                <p class="text-[8px] text-muted font-bold tracking-[0.2em] uppercase opacity-60">Handcrafted with love, delivered to your door</p>
            </div>
            
            <div class="flex-1 px-8 py-4 overflow-y-auto">
                <nav class="flex flex-col gap-2">
                    <a href="index.html" class="py-4 text-2xl font-display font-bold text-charcoal border-b border-gray-50 flex justify-between items-center group">
                        Home <span class="text-terracotta opacity-0 group-hover:opacity-100 transition-all">&rarr;</span>
                    </a>
                    <a href="shop.html" class="py-4 text-2xl font-display font-bold text-charcoal border-b border-gray-50 flex justify-between items-center group">
                        Shop <span class="text-terracotta opacity-0 group-hover:opacity-100 transition-all">&rarr;</span>
                    </a>
                    <a href="about.html" class="py-4 text-2xl font-display font-bold text-charcoal border-b border-gray-50 flex justify-between items-center group">
                        Our Story <span class="text-terracotta opacity-0 group-hover:opacity-100 transition-all">&rarr;</span>
                    </a>
                    <a href="contact.html" class="py-4 text-2xl font-display font-bold text-charcoal border-b border-gray-50 flex justify-between items-center group">
                        Contact <span class="text-terracotta opacity-0 group-hover:opacity-100 transition-all">&rarr;</span>
                    </a>
                </nav>
                
                <div class="mt-12 space-y-4">
                    <p class="text-[10px] uppercase font-bold tracking-widest text-muted">Customer Support</p>
                    <div class="grid grid-cols-2 gap-4">
                        <a href="shipping.html" class="text-xs font-semibold text-charcoal hover:text-terracotta">Shipping</a>
                        <a href="faq.html" class="text-xs font-semibold text-charcoal hover:text-terracotta">FAQs</a>
                        <a href="care-guide.html" class="text-xs font-semibold text-charcoal hover:text-terracotta">Jewelry Care</a>
                        <a href="order-tracking.html" class="text-xs font-semibold text-charcoal hover:text-terracotta">Track Order</a>
                    </div>
                </div>
            </div>
            
            <div class="p-8 border-t bg-gray-50/50">
                <button id="mobile-auth-btn" onclick="window.location.href='account.html'" class="btn-dynamic btn-base w-full py-4 text-xs tracking-widest uppercase shadow-lg shadow-terracotta/10">Sign In</button>
            </div>
        </aside>
    </div>

    <!-- Cart Sidebar -->
    <div id="cart-sidebar" class="fixed inset-0 z-[999999] hidden">
        <div class="backdrop-bg absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 transition-opacity duration-300" onclick="toggleCart()"></div>
        <aside class="sidebar-panel absolute right-0 top-0 bottom-0 w-[85%] sm:w-full max-w-md bg-white shadow-2xl flex flex-col translate-x-full transition-transform duration-300 ease-out will-change-transform">
            <div class="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                    <h2 class="font-display text-2xl text-charcoal">Shopping Bag</h2>
                    <p class="text-[10px] text-muted uppercase tracking-widest mt-1">Your Curated Collection</p>
                </div>
                <button onclick="toggleCart()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-2xl font-light">&times;</button>
            </div>
            <div id="cart-items" class="flex-1 overflow-y-auto p-6 space-y-6"></div>
            <div id="cart-empty" class="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div class="w-20 h-20 bg-cream rounded-full flex items-center justify-center mb-6">
                    <svg class="w-10 h-10 text-terracotta/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                </div>
                <h3 class="font-display text-xl text-charcoal mb-2">Your bag is empty</h3>
                <p class="text-xs text-muted max-w-[200px] mb-8">Discover our handcrafted pieces and start building your collection.</p>
                <button onclick="toggleCart(); goToShop()" class="btn-dynamic btn-base px-8 py-3 text-xs uppercase tracking-widest">Discover Now</button>
            </div>
            <div id="cart-footer" class="border-t p-6 pb-24 md:pb-6 bg-gray-50/50 hidden">
                <div class="flex justify-between items-center mb-6">
                    <span class="text-xs uppercase tracking-widest text-muted font-bold">Subtotal</span>
                    <span id="cart-total" class="text-xl font-bold text-charcoal">&#8377;0</span>
                </div>
                <a href="checkout.html" class="w-full py-4 text-center block text-xs uppercase tracking-widest bg-terracotta text-white rounded-xl shadow-xl shadow-terracotta/20 hover:bg-black transition-all font-bold mb-3">Proceed to Checkout</a>
                <a href="cart.html" class="w-full py-4 text-center block text-[10px] uppercase tracking-widest text-charcoal bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold">View Full Bag</a>
                <p class="text-[10px] text-center text-muted mt-4">Shipping & taxes calculated at checkout</p>
            </div>
        </aside>
    </div>

    <!-- Wishlist Sidebar -->
    <div id="wishlist-sidebar" class="fixed inset-0 z-[999999] hidden">
        <div class="backdrop-bg absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 transition-opacity duration-300" onclick="toggleWishlist()"></div>
        <aside class="sidebar-panel absolute right-0 top-0 bottom-0 w-[85%] sm:w-full max-w-sm bg-white shadow-2xl flex flex-col translate-x-full transition-transform duration-300 ease-out will-change-transform">
            <div class="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                    <h2 class="font-display text-2xl text-charcoal">Wishlist</h2>
                    <p class="text-[10px] text-muted uppercase tracking-widest mt-1">Saved Treasures</p>
                </div>
                <button onclick="toggleWishlist()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-2xl font-light">&times;</button>
            </div>
            <div id="wishlist-items" class="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 space-y-6"></div>
            <div id="wishlist-empty" class="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div class="w-20 h-20 bg-cream rounded-full flex items-center justify-center mb-6 text-rose-300">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <h3 class="font-display text-xl text-charcoal mb-2">Wishlist is empty</h3>
                <p class="text-xs text-muted max-w-[200px] mb-8">Click the heart on any item to save it here for later.</p>
                <button onclick="toggleWishlist(); goToShop()" class="btn-sage btn-base px-8 py-3 text-xs uppercase tracking-widest">Explore Collections</button>
            </div>
            <div id="wishlist-footer" class="border-t p-6 pb-24 md:pb-6 bg-gray-50/50 hidden">
                <a href="wishlist.html" class="w-full py-4 text-center block text-[10px] uppercase tracking-widest text-charcoal bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold">View Full Wishlist</a>
            </div>
        </aside>
    </div>

    <!-- Auth Modal -->
    <div id="auth-modal" class="fixed inset-0 z-[999999] hidden">
        <div class="backdrop-bg absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 transition-opacity duration-300" onclick="closeAuthModal()"></div>
        <aside class="sidebar-panel absolute right-0 top-0 bottom-0 w-[90%] sm:w-full max-w-md bg-white shadow-2xl flex flex-col translate-x-full transition-transform duration-300 ease-out will-change-transform">
            <div class="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                    <h2 class="font-display text-2xl text-charcoal">Account</h2>
                    <p class="text-[10px] text-muted uppercase tracking-widest mt-1">Join the Sentie Circle</p>
                </div>
                <button onclick="closeAuthModal()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-2xl font-light">&times;</button>
            </div>
            
            <div class="flex-1 overflow-y-auto px-8 py-8 pb-24 md:pb-8">
                <div class="flex mb-8 border-b border-gray-100">
                    <button id="tab-login" onclick="switchAuthTab('login')" class="flex-1 pb-4 text-center text-[10px] uppercase tracking-widest font-bold border-b-2 border-terracotta text-terracotta transition-all">Sign In</button>
                    <button id="tab-signup" onclick="switchAuthTab('signup')" class="flex-1 pb-4 text-center text-[10px] uppercase tracking-widest font-bold border-b-2 border-transparent text-gray-400 hover:text-charcoal transition-all">Create Account</button>
                </div>

                <!-- Login Form -->
                <div id="modal-login-view">
                    <form id="form-login" onsubmit="handleLogin(event)" class="space-y-4">
                        <div class="space-y-1.5">
                            <label class="text-[9px] uppercase tracking-widest font-bold text-muted ml-1">Email</label>
                            <input type="email" id="login-email" class="w-full px-5 py-3.5 bg-cream/30 border border-gray-100 rounded-2xl focus:outline-none focus:border-terracotta/50 transition-all text-sm" placeholder="nature@southery.com" required>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] uppercase tracking-widest font-bold text-muted ml-1">Password</label>
                            <div class="relative">
                                <input type="password" id="login-password" class="w-full px-5 py-3.5 bg-cream/30 border border-gray-100 rounded-2xl focus:outline-none focus:border-terracotta/50 transition-all text-sm pr-12" placeholder="••••••••" required>
                                <button type="button" onclick="togglePasswordVisibility('login-password')" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-terracotta transition-colors" tabindex="-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </button>
                            </div>
                        </div>
                        <div class="flex justify-end pt-1">
                            <button type="button" onclick="showCustomAlert('Recovery Sent', 'A password reset link has been sent to your email.', 'success')" class="text-[9px] uppercase tracking-widest font-bold text-terracotta hover:underline">Forgot Password?</button>
                        </div>
                        <button type="submit" class="btn-dynamic btn-base w-full py-4 text-xs uppercase tracking-widest shadow-xl shadow-terracotta/10 mt-2">Sign In</button>
                    </form>

                    <div class="relative my-6 flex items-center justify-center">
                        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
                        <span class="relative px-4 bg-white text-[9px] uppercase tracking-widest font-bold text-muted">Or continue with</span>
                    </div>

                    <button type="button" class="w-full py-3.5 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all text-xs font-bold text-charcoal shadow-sm">
                        <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Google
                    </button>
                </div>

                <!-- Signup Form -->
                <div id="modal-signup-view" class="hidden">
                    <form id="form-signup" onsubmit="handleSignup(event)" class="space-y-4">
                        <div class="space-y-1.5">
                            <label class="text-[9px] uppercase tracking-widest font-bold text-muted ml-1">Full Name</label>
                            <input type="text" id="signup-name" class="w-full px-5 py-3.5 bg-cream/30 border border-gray-100 rounded-2xl focus:outline-none focus:border-terracotta/50 transition-all text-sm" placeholder="Aria Winds" required>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] uppercase tracking-widest font-bold text-muted ml-1">Email</label>
                            <input type="email" id="signup-email" class="w-full px-5 py-3.5 bg-cream/30 border border-gray-100 rounded-2xl focus:outline-none focus:border-terracotta/50 transition-all text-sm" placeholder="nature@southery.com" required>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] uppercase tracking-widest font-bold text-muted ml-1">Password</label>
                            <div class="relative">
                                <input type="password" id="signup-password" class="w-full px-5 py-3.5 bg-cream/30 border border-gray-100 rounded-2xl focus:outline-none focus:border-terracotta/50 transition-all text-sm pr-12" placeholder="Minimum 8 characters" required>
                                <button type="button" onclick="togglePasswordVisibility('signup-password')" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-terracotta transition-colors" tabindex="-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="btn-dynamic btn-base w-full py-4 text-xs uppercase tracking-widest shadow-xl shadow-terracotta/10 mt-2">Sign Up</button>
                    </form>

                    <div class="relative my-6 flex items-center justify-center">
                        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
                        <span class="relative px-3 bg-white text-[9px] uppercase tracking-widest font-bold text-muted">Or continue with</span>
                    </div>

                    <button type="button" class="w-full py-3.5 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all text-xs font-bold text-charcoal shadow-sm">
                        <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Google
                    </button>
                    
                    <p class="text-[9px] text-center text-muted mt-6 px-4">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
            </div>
        </aside>
    </div>

    <!-- Custom Alert/Confirm Modal -->
    <div id="custom-modal" class="fixed inset-0 z-[999999] hidden">
        <div class="backdrop-bg absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 transition-opacity duration-300"></div>
        <div class="modal-panel absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[32px] p-8 shadow-2xl scale-90 opacity-0 transition-all duration-300">
            <div id="modal-icon" class="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta mx-auto mb-6">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 id="modal-title" class="font-display text-2xl text-charcoal text-center mb-2 font-bold">Heads Up</h3>
            <p id="modal-message" class="text-sm text-muted text-center mb-8 leading-relaxed">This is a custom message from the boutique.</p>
            <div id="modal-actions" class="flex gap-3">
                <button id="modal-cancel" class="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-charcoal bg-gray-50 hover:bg-gray-100 transition-all hidden">Cancel</button>
                <button id="modal-confirm" class="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white bg-terracotta hover:bg-black transition-all shadow-lg shadow-terracotta/20">Okay</button>
            </div>
        </div>
    </div>

    <!-- Luxury Cursor -->
    <div class="custom-cursor"></div>
    <div class="custom-cursor-follower"></div>

    <!-- Global Toast Container (Top Layer) -->
    <div id="toast-container" class="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-3 pointer-events-none" style="z-index: 2147483647 !important;"></div>

    <!-- Mobile Bottom Navigation -->
    <div class="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center z-[99999]">
        <a href="index.html" class="flex flex-col items-center text-charcoal/60 hover:text-terracotta transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span class="text-[9px] font-bold uppercase tracking-tighter mt-1">Home</span>
        </a>
        <a href="shop.html" class="flex flex-col items-center text-charcoal/60 hover:text-terracotta transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span class="text-[9px] font-bold uppercase tracking-tighter mt-1">Shop</span>
        </a>
        <button onclick="toggleCart()" class="flex flex-col items-center text-charcoal/60 hover:text-terracotta transition-colors">
            <div class="relative">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span id="m-bot-cart-count" class="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 bg-terracotta text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white hidden">0</span>
            </div>
            <span class="text-[9px] font-bold uppercase tracking-tighter mt-1">Bag</span>
        </button>
        <button onclick="handleMobileAuthClick()" class="flex flex-col items-center text-charcoal/60 hover:text-terracotta transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span id="mobile-account-label-bot" class="text-[9px] font-bold uppercase tracking-tighter mt-1">Sign In</span>
        </button>
    </div>
`;

// Initialize Layout
function initLayout() {
    // Inject Announcement Bar (unless disabled)
    if (!document.querySelector('.announcement-bar')) {
        const bar = document.createElement('div');
        bar.innerHTML = announcementBarHTML;
        document.body.prepend(bar.firstElementChild);
    }

    // Inject Sidebar HTML
    if (!document.getElementById('cart-sidebar')) {
        const div = document.createElement('div');
        div.innerHTML = sidebarHTML;
        while (div.firstChild) {
            document.body.appendChild(div.firstChild);
        }
    }

    // QA GLOBAL OVERRIDE: Open Modal instead of Redirecting
    const authBtn = document.getElementById('auth-default');
    if (authBtn) {
        // Desktop uses full page login
        authBtn.onclick = (e) => { e.preventDefault(); window.location.href = 'account.html'; };
    }
    const mobileAuthBtn = document.getElementById('mobile-auth-btn');
    if (mobileAuthBtn) {
        mobileAuthBtn.onclick = (e) => { e.preventDefault(); openAuthModal('login'); };
    }

    // Data Load
    try { window.cart = JSON.parse(localStorage.getItem('southery_cart')) || []; } catch (e) { window.cart = []; }
    try { window.wishlist = JSON.parse(localStorage.getItem('southery_wishlist')) || []; } catch (e) { window.wishlist = []; }
    try { window.currentUser = JSON.parse(localStorage.getItem('southery_user')) || null; } catch (e) { window.currentUser = null; }

    // Wait for Live Products before initializing data-dependent UI
    updateAllCounts();
    updateAuthUI();

    // Check for hash
    if (window.location.hash === '#cart') setTimeout(toggleCart, 100);
    if (window.location.hash === '#wishlist') setTimeout(toggleWishlist, 100);

    // Premium Interactions
    initPremiumInteractions();

    // Site-wide Year Logic
    const yr = document.getElementById("yr");
    if (yr) yr.textContent = new Date().getFullYear();
}

// UI Functions - Sidebars
function toggleCart() {
    const s = document.getElementById('cart-sidebar');
    if (!s) return;
    const panel = s.querySelector('.sidebar-panel');
    const backdrop = s.querySelector('.backdrop-bg');
    const isHidden = s.classList.contains('hidden');

    if (isHidden) {
        closeAllSidebars(['cart']);
        s.classList.remove('hidden');
        renderCart();
        setTimeout(() => {
            panel.classList.remove('translate-x-full');
            backdrop.classList.remove('opacity-0');
        }, 10);
        document.body.style.overflow = 'hidden';
    } else {
        closeCart();
    }
}

function closeCart() {
    const s = document.getElementById('cart-sidebar');
    if (!s || s.classList.contains('hidden')) return;
    const panel = s.querySelector('.sidebar-panel');
    const backdrop = s.querySelector('.backdrop-bg');
    panel.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
        s.classList.add('hidden');
        if (!isAnySidebarOpen()) document.body.style.overflow = '';
    }, 500);
}

function toggleWishlist() {
    const s = document.getElementById('wishlist-sidebar');
    if (!s) return;
    const panel = s.querySelector('.sidebar-panel');
    const backdrop = s.querySelector('.backdrop-bg');
    const isHidden = s.classList.contains('hidden');

    if (isHidden) {
        closeAllSidebars(['wishlist']);
        s.classList.remove('hidden');
        renderWishlist();
        setTimeout(() => {
            panel.classList.remove('translate-x-full');
            backdrop.classList.remove('opacity-0');
        }, 10);
        document.body.style.overflow = 'hidden';
    } else {
        closeWishlist();
    }
}

function closeWishlist() {
    const s = document.getElementById('wishlist-sidebar');
    if (!s || s.classList.contains('hidden')) return;
    const panel = s.querySelector('.sidebar-panel');
    const backdrop = s.querySelector('.backdrop-bg');
    panel.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
        s.classList.add('hidden');
        if (!isAnySidebarOpen()) document.body.style.overflow = '';
    }, 500);
}

// Search Logic
function toggleSearch() {
    const modal = document.getElementById('search-modal');
    if (!modal) return;
    const panel = modal.querySelector('.sidebar-panel');
    const backdrop = modal.querySelector('.backdrop-bg');
    const isHidden = modal.classList.contains('hidden');

    if (isHidden) {
        closeAllSidebars(['search']);
        const shopSidebar = document.getElementById('filter-sidebar');
        if (shopSidebar && shopSidebar.classList.contains('open')) {
            if (typeof toggleMobileFilters === 'function') toggleMobileFilters();
        }

        modal.classList.remove('hidden');
        modal.classList.add('pointer-events-auto');
        modal.classList.remove('pointer-events-none');
        renderRecentSearches();
        document.getElementById('search-initial').classList.remove('hidden');
        document.getElementById('search-results').classList.add('hidden');
        document.getElementById('search-footer').classList.add('hidden');
        setTimeout(() => {
            panel.classList.remove('-translate-y-full');
            backdrop.classList.remove('opacity-0');
            const input = document.getElementById('search-input');
            if (input) { input.value = ''; input.focus(); }
        }, 10);
        document.body.style.overflow = 'hidden';
    } else {
        closeSearch();
    }
}

function closeSearch() {
    const modal = document.getElementById('search-modal');
    if (!modal || modal.classList.contains('hidden')) return;
    const panel = modal.querySelector('.sidebar-panel');
    const backdrop = modal.querySelector('.backdrop-bg');
    panel.classList.add('-translate-y-full');
    backdrop.classList.add('opacity-0');
    modal.classList.add('pointer-events-none');
    modal.classList.remove('pointer-events-auto');
    setTimeout(() => {
        modal.classList.add('hidden');
        if (!isAnySidebarOpen()) document.body.style.overflow = '';
        const input = document.getElementById('search-input');
        if (input) input.value = '';
    }, 500);
}

function fillSearch(q) {
    const input = document.getElementById('search-input');
    if (input) {
        input.value = q;
        handleSearch(q);
    }
}

function handleSearch(query) {
    const results = document.getElementById('search-results');
    const initial = document.getElementById('search-initial');
    const footer = document.getElementById('search-footer');
    const viewAllBtn = document.getElementById('view-all-search');

    if (!query || !query.trim()) {
        results.classList.add('hidden');
        initial.classList.remove('hidden');
        footer.classList.add('hidden');
        return;
    }

    initial.classList.add('hidden');
    results.classList.remove('hidden');
    const q = query.toLowerCase().trim();

    // Use products from products.js if available
    if (typeof products === 'undefined') return;

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase() === q) ||
        (p.category && (p.category.toLowerCase() + 's') === q)
    );

    let html = '';
    if (filtered.length === 0) {
        html = `
            <div class="py-16 flex flex-col items-center justify-center text-center col-span-full animate-fade-in">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <svg class="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <h3 class="font-display text-2xl text-charcoal mb-2">No treasures found</h3>
                <p class="text-sm text-muted max-w-xs mx-auto mb-8">We couldn't find any results for <span class="text-terracotta font-bold">"${query}"</span>. Try adjusting your search or explore our collections.</p>
                <button onclick="document.getElementById('search-input').value=''; handleSearch('');" 
                        class="px-8 py-3 rounded-full bg-charcoal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-terracotta transition-all shadow-lg">Clear Search</button>
            </div>
        `;
        footer.classList.add('hidden');
    } else {
        html = filtered.slice(0, 6).map(p => `
            <div class="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group" 
                 onclick="saveSearchQuery('${query.replace(/'/g, "\\'")}'); window.location.href='product.html?id=${p.id}'">
                <div class="w-16 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-bold text-sm text-charcoal truncate mb-1">${p.name}</p>
                    <p class="text-[10px] text-muted uppercase tracking-widest mb-1">${p.category} &bull; ${p.collection}</p>
                    <p class="text-terracotta font-bold text-xs">&#8377;${p.price.toLocaleString()}</p>
                </div>
            </div>
        `).join('');

        if (filtered.length > 6) {
            footer.classList.remove('hidden');
            viewAllBtn.onclick = () => searchNow(query);
        } else {
            footer.classList.add('hidden');
        }
    }
    results.innerHTML = html;
}

function saveSearchQuery(q) {
    q = q.trim();
    if (!q || q.length < 2) return;
    recentSearches = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    localStorage.setItem('recent_searches', JSON.stringify(recentSearches));
}

function searchNow(q) {
    if (!q || q.trim().length === 0) return;
    saveSearchQuery(q);
    window.location.href = `shop.html?search=${encodeURIComponent(q.trim())}`;
}

function renderRecentSearches() {
    const container = document.getElementById('recent-searches');
    if (!container) return;
    if (recentSearches.length === 0) {
        container.innerHTML = '<p class="text-[11px] text-muted italic">No recent history</p>';
        return;
    }
    container.innerHTML = recentSearches.map(s => `
        <button onclick="fillSearch('${s.replace(/'/g, "\\'")}')" 
                class="flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-[11px] font-bold text-charcoal hover:bg-terracotta hover:text-white transition-all">
            <svg class="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            ${s}
        </button>
    `).join('');
}

function searchNow(q) {
    if (!q.trim()) return;
    saveSearchQuery(q);
    window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
}

// Mobile Menu Logic
function toggleMobileMenu() {
    const overlay = document.getElementById('mobile-nav-overlay');
    if (!overlay) return;
    const panel = overlay.querySelector('.sidebar-panel');
    const backdrop = overlay.querySelector('.backdrop-bg');
    const isHidden = overlay.classList.contains('hidden');

    if (isHidden) {
        closeAllSidebars(['mobile']);
        overlay.classList.remove('hidden');
        setTimeout(() => {
            panel.classList.remove('-translate-x-full');
            backdrop.classList.remove('opacity-0');
        }, 10);
        document.body.style.overflow = 'hidden';
    } else {
        closeMobileMenu();
    }
}

function closeMobileMenu() {
    const overlay = document.getElementById('mobile-nav-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;
    const panel = overlay.querySelector('.sidebar-panel');
    const backdrop = overlay.querySelector('.backdrop-bg');
    panel.classList.add('-translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
        overlay.classList.add('hidden');
        if (!isAnySidebarOpen()) document.body.style.overflow = '';
    }, 500);
}

// Global UI Helpers
function closeAllSidebars(exclude = []) {
    if (!exclude.includes('search')) closeSearch();
    if (!exclude.includes('cart')) closeCart();
    if (!exclude.includes('wishlist')) closeWishlist();
    if (!exclude.includes('mobile')) closeMobileMenu();
    if (!exclude.includes('auth')) closeAuthModal();
}

function isAnySidebarOpen() {
    const ids = ['search-modal', 'cart-sidebar', 'wishlist-sidebar', 'mobile-nav-overlay', 'auth-modal'];
    return ids.some(id => {
        const el = document.getElementById(id);
        return el && !el.classList.contains('hidden');
    });
}

// Rendering Functions
function renderCart() {
    const items = document.getElementById('cart-items');
    const empty = document.getElementById('cart-empty');
    const footer = document.getElementById('cart-footer');
    if (!items) return;

    if (window.cart.length === 0) {
        items.innerHTML = '';
        empty.classList.remove('hidden');
        footer.classList.add('hidden');
        return;
    }

    empty.classList.add('hidden');
    footer.classList.remove('hidden');
    let total = 0;

    items.innerHTML = window.cart.map(c => {
        const p = (typeof products !== 'undefined') ? products.find(x => x.id === c.id) : null;
        if (!p) return '';
        total += p.price * c.qty;
        return `
            <div class="flex gap-4 p-3 xs:p-4 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:border-terracotta/20 transition-all group">
                <div class="w-20 h-24 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    <img src="${p.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                </div>
                <div class="flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-1">
                        <h4 class="font-bold text-sm text-charcoal pr-4">${p.name}</h4>
                        <button onclick="updateCartQty(${c.id}, -${c.qty})" class="text-gray-300 hover:text-red-400 transition-colors">&times;</button>
                    </div>
                    ${p.stock <= 5 ? `<p class="text-[9px] font-bold text-terracotta mb-1 animate-pulse uppercase tracking-wider">Only ${p.stock} left &bull; Order soon</p>` : ''}
                    <p class="text-terracotta font-bold text-sm mb-auto">&#8377;${p.price.toLocaleString()}</p>
                    <div class="flex items-center gap-2 mt-2 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm w-fit">
                            <button onclick="updateCartQty(${c.id}, -1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-terracotta transition-colors">&minus;</button>
                            <span class="w-8 text-center text-xs font-bold text-charcoal">${c.qty}</span>
                            <button onclick="updateCartQty(${c.id}, 1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-terracotta transition-colors">&plus;</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerHTML = `&#8377;${total.toLocaleString()}`;
}

function renderWishlist() {
    const items = document.getElementById('wishlist-items');
    const empty = document.getElementById('wishlist-empty');
    if (!items) return;

    if (window.wishlist.length === 0) {
        items.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    items.innerHTML = window.wishlist.map(w => {
        const p = (typeof products !== 'undefined') ? products.find(x => x.id === w.id) : null;
        if (!p) return '';
        return `
            <div class="flex gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:border-rose-200 transition-all group cursor-pointer" onclick="window.location.href='product.html?id=${p.id}'">
                <div class="w-16 h-20 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    <img src="${p.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-sm text-charcoal truncate mb-1">${p.name}</h4>
                    <p class="text-terracotta font-bold text-xs">&#8377;${p.price.toLocaleString()}</p>
                    <div class="flex flex-col gap-1">
                        <button onclick="event.stopPropagation(); addToCart(${p.id})" class="text-[10px] font-bold text-terracotta uppercase tracking-widest hover:text-charcoal transition-colors">Add to Bag</button>
                    </div>
                </div>
                <button onclick="event.stopPropagation(); toggleWishlistItem(${p.id})" class="text-rose-400 hover:text-rose-600 transition-colors flex-shrink-0">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
            </div>
        `;
    }).join('');

    const footer = document.getElementById('wishlist-footer');
    if (footer) footer.classList.remove('hidden');
}

// Data Update Functions
window.updateCartQty = function (id, change) {
    const itemIndex = window.cart.findIndex(c => c.id === id);
    if (itemIndex > -1) {
        window.cart[itemIndex].qty += change;
        if (window.cart[itemIndex].qty <= 0) window.cart.splice(itemIndex, 1);
        localStorage.setItem('southery_cart', JSON.stringify(window.cart));
        updateAllCounts();
        renderCart();
        if (typeof renderSummary === 'function') renderSummary();
    }
};

window.toggleWishlistItem = function (id) {
    const index = window.wishlist.findIndex(w => w.id === id);
    if (index > -1) window.wishlist.splice(index, 1);
    else window.wishlist.push({ id });
    localStorage.setItem('southery_wishlist', JSON.stringify(window.wishlist));
    updateAllCounts();
    renderWishlist();
    if (typeof updateWishlistUI === 'function') updateWishlistUI();
    showToast(index > -1 ? "Removed from wishlist" : "Saved to wishlist");
};

window.addToCartFromWishlist = function (id) {
    const item = window.cart.find(c => c.id === id);
    if (item) item.qty += 1;
    else window.cart.push({ id, qty: 1 });
    localStorage.setItem('southery_cart', JSON.stringify(window.cart));
    updateAllCounts();
    showToast("Added to bag!");
};

window.updateCartQty = function (id, change) {
    const index = window.cart.findIndex(c => c.id === id);
    if (index === -1) return;
    window.cart[index].qty += change;
    if (window.cart[index].qty <= 0) window.cart.splice(index, 1);
    localStorage.setItem('southery_cart', JSON.stringify(window.cart));
    updateAllCounts();
    renderCart();
};

window.addToCart = function (id, qty = 1) {
    if (!currentUser) {
        showToast('Please sign in to add items to your bag.', 'info');
        openAuthModal('login');
        return;
    }
    const item = window.cart.find(c => c.id === id);
    if (item) item.qty += qty;
    else window.cart.push({ id, qty });
    localStorage.setItem('southery_cart', JSON.stringify(window.cart));
    updateAllCounts();
    renderCart();
    showToast("Added to bag!");
};

function updateAllCounts() {
    const cartCount = window.cart.reduce((a, b) => a + (b.qty || 0), 0);
    const wishCount = window.wishlist.length;
    const badgeIds = ['d-cart-count', 'd-wish-count', 'm-top-cart-count', 'm-top-wish-count', 'm-bot-cart-count', 'm-bot-wish-count'];

    badgeIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const count = id.includes('cart') ? cartCount : wishCount;
            el.textContent = count;
            count > 0 ? el.classList.remove('hidden') : el.classList.add('hidden');
        }
    });
}

function updateAuthUI() {
    const components = {
        default: document.getElementById('auth-default'),
        loggedIn: document.getElementById('auth-logged-in'),
        name: document.getElementById('user-name-display'),
        avatar: document.getElementById('user-avatar-initial'),
        mobileBtn: document.getElementById('mobile-auth-btn'),
        mobileBot: document.getElementById('mobile-account-label-bot')
    };

    if (currentUser) {
        const displayName = currentUser.name ? (currentUser.name.includes('@') ? currentUser.name.split('@')[0] : currentUser.name) : "User";
        if (components.name) components.name.textContent = displayName;
        if (components.avatar) components.avatar.textContent = displayName.charAt(0).toUpperCase();
        if (components.default) components.default.classList.add('hidden');
        if (components.loggedIn) { components.loggedIn.classList.remove('hidden'); components.loggedIn.classList.add('flex'); }
        if (components.mobileBtn) components.mobileBtn.textContent = 'Account';
        if (components.mobileBot) components.mobileBot.textContent = 'Account';
    } else {
        if (components.default) components.default.classList.remove('hidden');
        if (components.loggedIn) { components.loggedIn.classList.add('hidden'); components.loggedIn.classList.remove('flex'); }
        if (components.mobileBtn) components.mobileBtn.textContent = 'Sign In';
        if (components.mobileBot) components.mobileBot.textContent = 'Sign In';
    }
}

// Auth Functions
function openAuthModal(mode = 'login') {
    // QA FIX: If we are already on the full account page, don't open the sidebar
    if (window.location.pathname.includes('account.html')) {
        const loginSection = document.getElementById('auth-container');
        if (loginSection) {
            loginSection.scrollIntoView({ behavior: 'smooth' });
            return;
        }
    }

    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    // Set initial tab
    switchAuthTab(mode);

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.querySelector('.sidebar-panel').classList.remove('translate-x-full');
        modal.querySelector('.backdrop-bg').classList.remove('opacity-0');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.querySelector('.sidebar-panel').classList.add('translate-x-full');
    modal.querySelector('.backdrop-bg').classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 500);
}

function switchAuthTab(tab) {
    const views = { login: document.getElementById('modal-login-view'), signup: document.getElementById('modal-signup-view') };
    const tabs = { login: document.getElementById('tab-login'), signup: document.getElementById('tab-signup') };

    if (!views.login || !views.signup) return;

    if (tab === 'login') {
        views.login.classList.remove('hidden');
        views.signup.classList.add('hidden');
        tabs.login.classList.add('border-terracotta', 'text-terracotta');
        tabs.login.classList.remove('border-transparent', 'text-gray-400');
        tabs.signup.classList.remove('border-terracotta', 'text-terracotta');
        tabs.signup.classList.add('border-transparent', 'text-gray-400');
    } else {
        views.login.classList.add('hidden');
        views.signup.classList.remove('hidden');
        tabs.signup.classList.add('border-terracotta', 'text-terracotta');
        tabs.signup.classList.remove('border-transparent', 'text-gray-400');
        tabs.login.classList.remove('border-terracotta', 'text-terracotta');
        tabs.login.classList.add('border-transparent', 'text-gray-400');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email')?.value?.trim();
    const password = document.getElementById('login-password')?.value;
    const btn = event.target.querySelector('button[type="submit"]');
    if (!email || !password) return showToast('Please enter your email and password.', 'error');
    const originalText = btn?.textContent;
    if (btn) { btn.textContent = 'Signing In...'; btn.disabled = true; }
    try {
        const data = await apiCall('/api/auth/login', 'POST', { email, password });
        localStorage.setItem('southery_token', data.token);
        localStorage.setItem('southery_user', JSON.stringify(data.user));
        currentUser = data.user;
        updateAuthUI();
        closeAuthModal();
        showToast(data.message, 'success');
        dispatchAuthChange();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        if (btn) { btn.textContent = originalText; btn.disabled = false; }
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name')?.value?.trim();
    const email = document.getElementById('signup-email')?.value?.trim();
    const password = document.getElementById('signup-password')?.value;
    const btn = event.target.querySelector('button[type="submit"]');
    if (!name || !email || !password) return showToast('Please fill in all fields.', 'error');
    const originalText = btn?.textContent;
    if (btn) { btn.textContent = 'Creating Account...'; btn.disabled = true; }
    try {
        const data = await apiCall('/api/auth/signup', 'POST', { name, email, password });
        localStorage.setItem('southery_token', data.token);
        localStorage.setItem('southery_user', JSON.stringify(data.user));
        currentUser = data.user;
        updateAuthUI();
        closeAuthModal();
        showToast(data.message, 'success');
        dispatchAuthChange();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        if (btn) { btn.textContent = originalText; btn.disabled = false; }
    }
}

function logout() {
    localStorage.removeItem('southery_token');
    localStorage.removeItem('southery_user');
    currentUser = null;
    updateAuthUI();
    showToast('You have been signed out.', 'success');
    dispatchAuthChange();
    const protectedPages = ['account.html', 'checkout.html'];
    if (protectedPages.some(p => window.location.pathname.includes(p))) {
        window.location.href = 'index.html';
    }
}

// Keep handleLogout as an alias for backward compatibility
function handleLogout() { logout(); }

function handleMobileAuthClick() {
    window.location.href = 'account.html';
}

// Utility functions
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast flex items-center gap-3 px-6 py-4 bg-charcoal text-white rounded-2xl shadow-2xl transition-all duration-500 translate-y-8 opacity-0';
    t.style.zIndex = '2147483647';
    t.style.position = 'relative';
    const isError = type === 'error';
    const iconBg = isError ? 'bg-red-500' : 'bg-sage';
    const iconSvg = isError
        ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>'
        : '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>';
    t.innerHTML = `
        <div class="w-6 h-6 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0">
            ${iconSvg}
        </div>
        <span class="text-sm font-medium pr-2">${message}</span>
    `;
    container.appendChild(t);
    setTimeout(() => t.classList.remove('translate-y-8', 'opacity-0'), 10);
    setTimeout(() => {
        t.classList.add('translate-y-8', 'opacity-0');
        setTimeout(() => t.remove(), 500);
    }, 3000);
}

// Custom Modal System (Alert/Confirm)
function showCustomAlert(title, message, iconType = 'alert') {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-modal');
        const panel = modal.querySelector('.modal-panel');
        const backdrop = modal.querySelector('.backdrop-bg');
        const titleEl = document.getElementById('modal-title');
        const msgEl = document.getElementById('modal-message');
        const confirmBtn = document.getElementById('modal-confirm');
        const cancelBtn = document.getElementById('modal-cancel');
        const iconEl = document.getElementById('modal-icon');

        titleEl.textContent = title;
        msgEl.textContent = message;
        cancelBtn.classList.add('hidden');
        confirmBtn.textContent = 'Understood';

        // Icon logic
        if (iconType === 'success') {
            iconEl.className = 'w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center text-sage mx-auto mb-6';
            iconEl.innerHTML = '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>';
        } else {
            iconEl.className = 'w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta mx-auto mb-6';
            iconEl.innerHTML = '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
        }

        modal.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            panel.classList.remove('scale-90', 'opacity-0');
        }, 10);

        confirmBtn.onclick = () => {
            closeCustomModal();
            resolve(true);
        };
    });
}

function showCustomConfirm(title, message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-modal');
        const panel = modal.querySelector('.modal-panel');
        const backdrop = modal.querySelector('.backdrop-bg');
        const titleEl = document.getElementById('modal-title');
        const msgEl = document.getElementById('modal-message');
        const confirmBtn = document.getElementById('modal-confirm');
        const cancelBtn = document.getElementById('modal-cancel');
        const iconEl = document.getElementById('modal-icon');

        titleEl.textContent = title;
        msgEl.textContent = message;
        cancelBtn.classList.remove('hidden');
        confirmBtn.textContent = 'Confirm';

        iconEl.className = 'w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-charcoal mx-auto mb-6';
        iconEl.innerHTML = '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

        modal.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            panel.classList.remove('scale-90', 'opacity-0');
        }, 10);

        confirmBtn.onclick = () => {
            closeCustomModal();
            resolve(true);
        };
        cancelBtn.onclick = () => {
            closeCustomModal();
            resolve(false);
        };
    });
}

function closeCustomModal() {
    const modal = document.getElementById('custom-modal');
    if (!modal) return;
    const panel = modal.querySelector('.modal-panel');
    const backdrop = modal.querySelector('.backdrop-bg');

    panel.classList.add('scale-90', 'opacity-0');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function goToShop() {
    if (window.location.pathname.includes('shop.html')) {
        const section = document.getElementById('products-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    } else window.location.href = 'shop.html';
}

// Event Listeners
document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobile-nav-overlay');
    if (mobileMenu && !mobileMenu.classList.contains('hidden') && e.target === mobileMenu.querySelector('.backdrop-bg')) {
        toggleMobileMenu();
    }
    const searchModal = document.getElementById('search-modal');
    if (searchModal && !searchModal.classList.contains('hidden') && e.target === searchModal.querySelector('.backdrop-bg')) {
        toggleSearch();
    }
});

// Escape Key Support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllSidebars();
        // Also close product detail modal if open
        if (typeof closeDetailModal === 'function') closeDetailModal();
        // Also close custom alert if open
        if (typeof closeCustomModal === 'function') closeCustomModal();
    }
});



// Run Init
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLayout);
else initLayout();

// ============================================================
// NEWSLETTER HANDLER — Site-wide via capture phase
// Intercepts ALL footer newsletter forms without editing HTML
// ============================================================

/**
 * handleNewsletter(event)
 * Called directly (order-tracking.html) or via capture-phase interceptor below.
 * 
 * TO CONNECT MAILCHIMP / BREVO:
 *   1. Sign up at mailchimp.com (free up to 500 contacts)
 *   2. Go to: Audience → Signup Forms → Embedded Forms → copy the action URL
 *   3. Replace MAILCHIMP_ACTION_URL below with your form action URL
 *   4. Set USE_MAILCHIMP = true
 */
const NEWSLETTER_CONFIG = {
    USE_MAILCHIMP: false,
    MAILCHIMP_ACTION_URL: 'https://YOUR_STORE.us1.list-manage.com/subscribe/post?u=XXXXX&id=YYYYY'
    // ↑ Replace this with your Mailchimp form action URL
};

function handleNewsletter(e) {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : '';
    const btn = form.querySelector('button[type="submit"]');

    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address.');
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Subscribing...';
    }

    if (NEWSLETTER_CONFIG.USE_MAILCHIMP) {
        // Real Mailchimp submission via JSONP (no-cors workaround)
        const mcUrl = NEWSLETTER_CONFIG.MAILCHIMP_ACTION_URL.replace('/post?', '/post-json?') + '&EMAIL=' + encodeURIComponent(email) + '&c=?';
        const script = document.createElement('script');
        script.src = mcUrl;
        document.body.appendChild(script);
        setTimeout(() => {
            document.body.removeChild(script);
            newsletterSuccess(form, email, btn);
        }, 2000);
    } else {
        // Mock success — swap to real Mailchimp / Brevo when ready
        setTimeout(() => newsletterSuccess(form, email, btn), 800);
    }
}

function newsletterSuccess(form, email, btn) {
    form.reset();
    if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
    showCustomAlert(
        'You\'re In! ✨',
        `Welcome to the Sentie Inner Circle, ${email}. Expect early access, exclusive offers & style inspiration in your inbox soon.`,
        'success'
    );
}

/**
 * Premium Luxury Cursor & Scroll Interactions
 */
function initPremiumInteractions() {
    // 1. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (cursor && follower && window.innerWidth > 1024) {
        let mouseX = 0, mouseY = 0;
        let posX = 0, posY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        const animateFollower = () => {
            posX += (mouseX - posX) / 9;
            posY += (mouseY - posY) / 9;
            follower.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Hover states
        const interactiveEls = document.querySelectorAll('a, button, .cursor-pointer, .product-card, .cat-scroll-card');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('active'));
            el.addEventListener('mouseleave', () => follower.classList.remove('active'));
        });
    }

    // 2. Reveal on Scroll (Intersection Observer)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.1 });

    window.refreshAnimations = function () {
        document.querySelectorAll('.animate-in, .product-card, .trust-badge').forEach(el => {
            if (!el.classList.contains('is-observed')) {
                revealObserver.observe(el);
                el.classList.add('is-observed');
            }
        });
    };

    window.refreshAnimations();
}

async function fetchUserOrders() {
    try {
        return await apiCall('/api/orders');
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
    }
}

async function handleContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn?.textContent;

    const formData = {
        name: document.getElementById('name')?.value,
        email: document.getElementById('email')?.value,
        subject: document.getElementById('subject')?.value,
        message: document.getElementById('message')?.value,
        website: document.getElementById('website')?.value // Honeypot field
    };

    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
    }

    try {
        await apiCall('/api/contact', 'POST', formData);
        showToast('Message sent! Our artisan team will contact you shortly.', 'success');
        form.reset();
    } catch (error) {
        console.error('Contact form error:', error);
        showToast(error.message || 'Failed to send message. Please try again later.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }
}

// Enhanced Scroll Handler
window.addEventListener('scroll', function () {
    const header = document.querySelector('.site-header');
    if (header) {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
            header.style.paddingBlock = '0.75rem';
        } else {
            header.classList.remove('scrolled');
            header.style.paddingBlock = '1.25rem';
        }
    }
});


// Load and validate user session on every page load
async function loadUserFromServer() {
    const token = localStorage.getItem('southery_token');
    if (!token) {
        currentUser = null;
        localStorage.removeItem('southery_user');
        updateAuthUI();
        return;
    }

    try {
        const data = await apiCall('/api/auth/me');
        currentUser = data.user;
        localStorage.setItem('southery_user', JSON.stringify(currentUser));
        updateAuthUI();
        dispatchAuthChange();
    } catch (error) {
        console.warn('Session invalid or expired:', error.message);
        // Token expired or invalid — clear session completely
        localStorage.removeItem('southery_token');
        localStorage.removeItem('southery_user');
        currentUser = null;
        updateAuthUI();
        dispatchAuthChange();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    loadUserFromServer();
    const yrEl = document.getElementById('yr');
    if (yrEl) yrEl.textContent = new Date().getFullYear();
});

// Password Visibility Toggle Function
window.togglePasswordVisibility = function(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
};
