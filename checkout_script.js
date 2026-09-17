
        let discount = 0;
        let checkoutTotal = 0;
        let RAZORPAY_KEY = '';

        window._qvCurrentId = null;
        window._qvTempQty = 1;
        window._qvTempSize = 'Standard';
        window._qvUnitPrice = 0;

        function openQuickView(id) {
            try {
                const allProducts = window.products || products || [];
                const allCart = window.cart || cart || [];

                const p = allProducts.find(prod => String(prod.id) === String(id));
                if (!p) return;

                const cartItem = allCart.find(c => String(c.id) === String(id));
                const quantity = cartItem ? cartItem.qty : 1;
                const size = cartItem?.size || p.specs?.size || 'Standard';

                window._qvCurrentId = id;
                window._qvTempQty = quantity;
                window._qvTempSize = size;
                window._qvUnitPrice = p.price || 0;

                const cat = (p.category || '').toLowerCase();
                let defaultSizes = ['Standard'];
                if (cat.includes('ring') && !cat.includes('earring')) defaultSizes = ['5', '6', '7', '8', '9'];
                else if (cat.includes('bracelet') || cat.includes('anklet') || cat.includes('bangle') || cat.includes('kada')) defaultSizes = ['XS (2.4")', 'S (2.6")', 'M (2.8")', 'L (3.0")'];

                const availableSizes = (p.availableSizes && p.availableSizes.length) ? p.availableSizes : (p.sizes && p.sizes.length) ? p.sizes : defaultSizes;
                if (size && !availableSizes.includes(size)) {
                    availableSizes.unshift(size);
                }

                const sizePillsHtml = availableSizes.map(sz => {
                    const isSelected = String(sz) === String(window._qvTempSize);
                    const activeClasses = isSelected
                        ? 'bg-charcoal text-white shadow-sm border-charcoal'
                        : 'bg-gray-100 text-charcoal hover:bg-gray-200 border-transparent';
                    const safeSz = String(sz).replace(/"/g, '&quot;');
                    return `<button type="button" onclick="qvSelectSize(this)" class="qv-size-pill px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 active:scale-95 ${activeClasses}" data-size="${safeSz}">${sz}</button>`;
                }).join(' ');

                const imgSrc = p.image || '';
                const itemSubtotal = '₹' + (p.price * quantity).toLocaleString('en-IN');

                const body = document.getElementById('qv-body');
                if (!body) return;

                body.innerHTML = `
                    <div class="p-6 md:p-7">
                        <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                            <div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-cream border border-black/5 shadow-sm">
                                <img src="${imgSrc}" alt="${p.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">
                            </div>
                            <div>
                                <h3 class="font-display font-bold text-lg text-charcoal leading-snug mb-1">${p.name}</h3>
                                <p class="text-xs font-semibold text-terracotta tracking-widest uppercase">Quick Edit Item</p>
                                <p class="text-xs text-muted mt-0.5">₹${(p.price || 0).toLocaleString('en-IN')} each</p>
                            </div>
                        </div>
                        <div class="space-y-4 mb-6">
                            <div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Select Size</span>
                                    <span id="qv-size-display" class="text-xs font-bold text-terracotta">${window._qvTempSize}</span>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    ${sizePillsHtml}
                                </div>
                            </div>
                            <div class="flex justify-between items-center py-3 border-y border-gray-100">
                                <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Quantity</span>
                                <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-1">
                                    <button type="button" onclick="qvChangeQty(-1)" class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-charcoal hover:bg-terracotta hover:text-white hover:border-terracotta transition-all active:scale-90 shadow-sm">-</button>
                                    <span id="qv-qty-val" class="w-8 text-center font-bold text-sm text-charcoal">${quantity}</span>
                                    <button type="button" onclick="qvChangeQty(1)" class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-charcoal hover:bg-terracotta hover:text-white hover:border-terracotta transition-all active:scale-90 shadow-sm">+</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-1">
                                <span class="text-sm font-bold text-charcoal">Item Subtotal</span>
                                <span id="qv-subtotal" class="text-xl font-bold text-terracotta font-display">${itemSubtotal}</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <button type="button" onclick="closeQuickView()" class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl font-bold uppercase text-xs tracking-wider transition-all">
                                Cancel
                            </button>
                            <button type="button" onclick="qvSaveEdit()" class="w-full py-3 bg-charcoal hover:bg-terracotta text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md active:scale-95">
                                Save Edit
                            </button>
                        </div>
                    </div>
                `;

                const modal = document.getElementById('quick-view-modal');
                if (modal) modal.classList.add('active', 'open');
                document.body.style.overflow = 'hidden';

            } catch (err) {
                console.error('openQuickView error:', err);
                closeQuickView();
            }
        }

        function qvSelectSize(btn) {
            const sizeVal = typeof btn === 'string' ? btn : btn.getAttribute('data-size');
            window._qvTempSize = sizeVal;
            const sizeDisp = document.getElementById('qv-size-display');
            if (sizeDisp) sizeDisp.innerText = sizeVal;

            const pills = document.querySelectorAll('.qv-size-pill');
            pills.forEach(b => {
                if (b.getAttribute('data-size') === String(sizeVal)) {
                    b.className = 'qv-size-pill px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 active:scale-95 bg-charcoal text-white shadow-sm border-charcoal';
                } else {
                    b.className = 'qv-size-pill px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 active:scale-95 bg-gray-100 text-charcoal hover:bg-gray-200 border-transparent';
                }
            });
        }

        function qvChangeQty(delta) {
            window._qvTempQty = Math.max(1, window._qvTempQty + delta);
            const qtyVal = document.getElementById('qv-qty-val');
            if (qtyVal) qtyVal.innerText = window._qvTempQty;

            const subtotalVal = document.getElementById('qv-subtotal');
            if (subtotalVal) {
                const newTotal = window._qvUnitPrice * window._qvTempQty;
                subtotalVal.innerHTML = '₹' + newTotal.toLocaleString('en-IN');
            }
        }

        function qvSaveEdit() {
            try {
                const allCart = window.cart || cart || [];
                const item = allCart.find(c => String(c.id) === String(window._qvCurrentId));
                if (item) {
                    item.qty = window._qvTempQty;
                    item.size = window._qvTempSize;
                    localStorage.setItem('southery_cart', JSON.stringify(allCart));
                    if (typeof window.SoutheryStore !== 'undefined' && typeof window.SoutheryStore.updateCartBadge === 'function') {
                        window.SoutheryStore.updateCartBadge();
                    }
                    if (typeof renderSummary === 'function') {
                        renderSummary();
                    }
                }
            } catch (e) {
                console.error('qvSaveEdit error:', e);
            }
            closeQuickView();
        }

        function closeQuickView() {
            const modal = document.getElementById('quick-view-modal');
            if (modal) modal.classList.remove('active', 'open');
            document.body.style.overflow = '';
        }

        // Safety net: Escape key always closes the modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeQuickView();
        });


        function prefillUser() {
            const user = window.currentUser || JSON.parse(localStorage.getItem('southery_user') || 'null');
            if (!user) return;
            
            // Hide the create account checkbox for logged-in users
            const createAccountWrapper = document.getElementById('create-account-wrapper');
            if (createAccountWrapper) createAccountWrapper.style.display = 'none';

            if (document.getElementById('email')) document.getElementById('email').value = user.email || '';
            if (document.getElementById('phone') && user.phone) document.getElementById('phone').value = user.phone;
            if (user.name) {
                const names = user.name.split(' ');
                if (document.getElementById('fname')) document.getElementById('fname').value = names[0] || '';
                if (document.getElementById('lname')) document.getElementById('lname').value = names.slice(1).join(' ') || '';
            }
        }

        function toggleMobileSummary() {
            const content = document.getElementById('mobile-summary-content');
            const chevron = document.getElementById('summary-chevron');
            const isActive = content.classList.toggle('active');
            chevron.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        function saveOrderToLocal(orderId, method) {
            const currentOrders = JSON.parse(localStorage.getItem('southery_orders')) || [];
            const newOrder = {
                orderId: orderId,
                _id: orderId,
                date: new Date().toISOString(),
                total: checkoutTotal,
                status: 'Processing',
                method: method,
                items: cart.map(item => {
                    const p = products.find(prod => String(prod.id) === String(item.id));
                    return p ? { name: p.name, image: p.image, category: p.category, price: p.price, qty: item.qty } : null;
                }).filter(i => i !== null)
            };
            currentOrders.unshift(newOrder);
            localStorage.setItem('southery_orders', JSON.stringify(currentOrders));
        }


        function updateCheckoutQty(id, delta) {
            const index = cart.findIndex(item => String(item.id) === String(id));
            if (index > -1) {
                cart[index].qty += delta;
                if (cart[index].qty < 1) {
                    removeFromCheckout(id);
                } else {
                    localStorage.setItem('southery_cart', JSON.stringify(cart));
                    renderSummary();
                    window.cart = cart; if (typeof updateAllCounts === 'function') updateAllCounts(); if (typeof updateCartUI === 'function') updateCartUI();
                    window.dispatchEvent(new Event('storage'));
                }
            }
        }

        function removeFromCheckout(id) {
            const index = cart.findIndex(item => String(item.id) === String(id));
            if (index > -1) {
                cart.splice(index, 1);
                localStorage.setItem('southery_cart', JSON.stringify(cart));
                renderSummary();
                window.cart = cart; if (typeof updateAllCounts === 'function') updateAllCounts(); if (typeof updateCartUI === 'function') updateCartUI();
                window.dispatchEvent(new Event('storage'));
                showToast('Item removed from order');
            }
        }

        function renderSummary() {
            const container = document.getElementById('checkout-items');
            const mContainer = document.getElementById('m-summary-items');
            if (!container) return;

            if (cart.length === 0) {
                const emptyHtml = '<div class="text-center py-8"><p class="text-muted text-sm">Cart is empty</p></div>';
                container.innerHTML = emptyHtml;
                if (mContainer) mContainer.innerHTML = emptyHtml;

                document.getElementById('subtotal').textContent = `₹0`;
                document.getElementById('tax').textContent = `₹0`;
                document.getElementById('total-amount').textContent = `₹0`;
                if (document.getElementById('m-subtotal')) document.getElementById('m-subtotal').textContent = `₹0`;
                if (document.getElementById('m-summary-total')) document.getElementById('m-summary-total').textContent = `₹0`;
                return;
            }

            let subtotal = 0;
            const itemsHtml = cart.map(item => {
                const p = products.find(prod => String(prod.id) === String(item.id));
                if (!p) return '';
                subtotal += p.price * item.qty;
                return `
                    <div class="flex gap-4 items-center group/item animate-in is-visible">
                        <div onclick="openQuickView('${p.id}')" class="relative w-16 h-16 bg-cream rounded-lg overflow-hidden border cursor-pointer hover:ring-1 ring-terracotta/30 transition-all flex-shrink-0">
                            <img loading="lazy" src="${p.image}" class="w-full h-full object-cover" alt="${p.name}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'64\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' fill=\'%23f5f0eb\'/%3E%3Ctext x=\'50%25\' y=\'55%25\' text-anchor=\'middle\' font-size=\'24\' fill=\'%23c8a97e\'%3E✦%3C/text%3E%3C/svg%3E'">
                        </div>
                        <div class="flex-1 min-w-0">
                            <div onclick="openQuickView('${p.id}')" class="cursor-pointer group">
                                <h3 class="text-xs font-bold text-charcoal truncate uppercase tracking-tighter group-hover:text-terracotta transition-colors">${p.name}</h3>
                                <p class="text-[9px] text-muted uppercase tracking-widest mt-0.5">Luxury Collection</p>
                            </div>
                            
                            <div class="flex items-center gap-3 mt-2">
                                <div class="flex items-center bg-white border border-black/5 rounded-md px-1 py-0.5">
                                    <button type="button" onclick="updateCheckoutQty('${p.id}', -1)" class="qty-control-btn w-5 h-5 flex items-center justify-center text-muted hover:text-charcoal transition-colors">
                                        <svg class="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" stroke-width="3" stroke-linecap="round"/></svg>
                                    </button>
                                    <span class="w-5 text-center text-[10px] font-bold text-charcoal">${item.qty}</span>
                                    <button type="button" onclick="updateCheckoutQty('${p.id}', 1)" class="qty-control-btn w-5 h-5 flex items-center justify-center text-muted hover:text-charcoal transition-colors">
                                        <svg class="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="3" stroke-linecap="round"/></svg>
                                    </button>
                                </div>
                                <button type="button" onclick="removeFromCheckout('${p.id}')" class="text-[9px] text-rose-500/60 hover:text-rose-500 font-bold uppercase tracking-widest transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                        <div class="text-right flex-shrink-0">
                            <p class="font-bold text-sm text-charcoal">₹${(p.price * item.qty).toLocaleString()}</p>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = itemsHtml;

            const tax = Math.round(subtotal * 0.03);
            const total = subtotal + tax - discount;
            checkoutTotal = total;

            const formattedSubtotal = `₹${subtotal.toLocaleString()}`;
            const formattedTax = `₹${tax.toLocaleString()}`;
            const formattedTotal = `₹${total.toLocaleString()}`;

            document.getElementById('subtotal').textContent = formattedSubtotal;
            document.getElementById('tax').textContent = formattedTax;
            document.getElementById('total-amount').textContent = formattedTotal;

            // Mobile Sync
            if (document.getElementById('m-top-total')) document.getElementById('m-top-total').textContent = formattedTotal;

            // Sync Mobile-Final Review
            if (document.getElementById('m-final-sub')) document.getElementById('m-final-sub').textContent = formattedSubtotal;
            if (document.getElementById('m-final-tax')) document.getElementById('m-final-tax').textContent = formattedTax;
            if (document.getElementById('m-final-total')) document.getElementById('m-final-total').textContent = formattedTotal;

            // Render mobile-final-review
            const mFinalItems = document.getElementById('mobile-final-items');
            if (mFinalItems) mFinalItems.innerHTML = itemsHtml;
        }

        function applyPromo() {
            const code = document.getElementById('promo-input').value.toUpperCase();
            const msg = document.getElementById('promo-msg');
            msg.classList.remove('hidden');

            const subtotalStr = document.getElementById('subtotal').textContent.replace('₹', '').replace(/,/g, '');
            const currentSubtotal = parseInt(subtotalStr) || 0;

            if (code === 'WELCOME10') {
                discount = 500;
                msg.textContent = 'Promo Applied: ₹500 discount';
                msg.className = 'text-[10px] mt-1 text-sage font-bold';
            } else if (code === 'FIRST10') {
                discount = Math.round(currentSubtotal * 0.1);
                msg.textContent = `Promo Applied: 10% discount (₹${discount})`;
                msg.className = 'text-[10px] mt-1 text-sage font-bold';
            } else {
                discount = 0;
                msg.textContent = 'Invalid promo code';
                msg.className = 'text-[10px] mt-1 text-red-500 font-bold';
            }
            renderSummary();
        }

        function checkAuth() {
            // Guest checkout enabled — pre-fill form when logged in
            prefillUser();
        }

        function getCheckoutCustomer() {
            const fname = document.getElementById('fname').value.trim();
            const lname = document.getElementById('lname').value.trim();
            return {
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                fname,
                lname,
                fullName: `${fname} ${lname}`.trim(),
                address: document.getElementById('address').value.trim(),
                city: document.getElementById('city').value.trim(),
                state: document.getElementById('state').value,
                pincode: document.getElementById('pincode').value.trim(),
                notes: document.getElementById('notes')?.value?.trim() || '',
                createAccount: !!document.getElementById('create-account')?.checked,
            };
        }

        function buildOrderPayload(orderId, method, paymentResult = null) {
            const c = getCheckoutCustomer();
            const subtotal = parseInt(document.getElementById('subtotal').textContent.replace(/[₹,]/g, '')) || 0;
            const tax = parseInt(document.getElementById('tax').textContent.replace(/[₹,]/g, '')) || 0;

            return {
                orderId: orderId.replace(/^#/, ''),
                guestEmail: c.email,
                guestPhone: c.phone,
                guestName: c.fullName,
                createAccount: c.createAccount && !localStorage.getItem('southery_token'),
                orderItems: cart.map(item => {
                    const p = products.find(prod => prod.id == item.id);
                    if (!p) return null;
                    return {
                        name: p.name,
                        quantity: item.qty,
                        image: p.image,
                        price: p.price,
                        product: p.mongoId || String(p.id),
                    };
                }).filter(Boolean),
                shippingAddress: {
                    address: c.address,
                    city: c.city,
                    state: c.state,
                    postalCode: c.pincode,
                    country: 'India',
                    phone: c.phone,
                },
                paymentMethod: method === 'cod' ? 'COD' : 'Razorpay',
                itemsPrice: subtotal,
                shippingPrice: 0,
                totalPrice: checkoutTotal,
                paymentResult,
                notes: c.notes,
            };
        }

        async function submitOrderToServer(orderId, method, paymentResult = null) {
            const payload = buildOrderPayload(orderId, method, paymentResult);
            try {
                const data = await apiCall('/api/orders', 'POST', payload);
                if (data.token && data.user) {
                    localStorage.setItem('southery_token', data.token);
                    localStorage.setItem('southery_user', JSON.stringify(data.user));
                    window.currentUser = data.user;
                }
                return { ok: true, data };
            } catch (err) {
                console.error('Server order save failed:', err);
                return { ok: false, error: err.message };
            }
        }

        function redirectAfterOrder(orderId, method, paymentId, serverResult) {
            const c = getCheckoutCustomer();
            const params = new URLSearchParams({
                order: orderId.replace(/^#/, ''),
                method,
                email: c.email,
            });
            if (paymentId) params.set('payment_id', paymentId);
            if (c.createAccount) params.set('account', serverResult?.data?.accountCreated ? 'created' : 'requested');
            if (serverResult?.ok) params.set('saved', 'server');
            window.location.href = 'done.html?' + params.toString();
        }

        function showCheckoutError(msg, fieldId) {
            document.querySelectorAll('.inline-error-msg').forEach(el => el.remove());
            if (fieldId) {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.focus();
                    field.classList.add('border-red-400', 'bg-red-50/30');
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const errorText = document.createElement('p');
                    errorText.className = 'inline-error-msg text-xs font-bold text-red-500 mt-1';
                    errorText.textContent = msg.includes(':') ? msg.split(':').slice(1).join(':').trim() : msg;
                    field.parentElement.appendChild(errorText);
                    field.addEventListener('input', () => {
                        field.classList.remove('border-red-400', 'bg-red-50/30');
                        if (errorText.parentNode) errorText.remove();
                    }, { once: true });
                    return;
                }
            }
            document.querySelectorAll('.checkout-error-banner').forEach(el => el.remove());
            const banner = document.createElement('div');
            banner.className = 'checkout-error-banner fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 bg-white border-l-4 border-red-500 px-6 py-4 rounded-2xl shadow-2xl max-w-sm w-[90vw] transition-all duration-500 opacity-0 -translate-y-4';
            banner.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 4a8 8 0 100 16A8 8 0 0012 4z"/>
                    </svg>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-bold text-sm text-charcoal">${msg.split(':')[0]}</p>
                    <p class="text-xs text-muted mt-0.5">${msg.includes(':') ? msg.split(':').slice(1).join(':').trim() : ''}</p>
                </div>
                <button onclick="this.parentElement.remove()" class="text-gray-300 hover:text-gray-500 flex-shrink-0 text-xl leading-none">&times;</button>`;
            document.body.appendChild(banner);
            setTimeout(() => { banner.classList.remove('opacity-0', '-translate-y-4'); }, 10);
            setTimeout(() => { banner.classList.add('opacity-0', '-translate-y-4'); setTimeout(() => banner.remove(), 500); }, 5000);
        }

        async function handleSubmit() {
            if (cart.length === 0) {
                showCheckoutError('Empty Cart: Please add items before checking out.', null);
                return;
            }

            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const fname = document.getElementById('fname').value.trim();
            const lname = document.getElementById('lname').value.trim();
            const address = document.getElementById('address').value.trim();
            const city = document.getElementById('city').value.trim();
            const state = document.getElementById('state').value;
            const pincode = document.getElementById('pincode').value.trim();
            const termsBox = document.getElementById('terms');

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showCheckoutError('Invalid Email: Please enter a valid email address.', 'email');
                return;
            }
            if (phone.length !== 10) {
                showCheckoutError('Invalid Phone: Please enter a valid 10-digit mobile number.', 'phone');
                return;
            }
            if (!fname || !lname) {
                showCheckoutError('Missing Name: Please provide both your first and last name.', fname ? 'lname' : 'fname');
                return;
            }
            if (!address || address.length < 5) {
                showCheckoutError('Missing Address: Please provide a complete delivery address.', 'address');
                return;
            }
            if (!city) {
                showCheckoutError('Missing City: Please enter your city name.', 'city');
                return;
            }
            if (!state) {
                showCheckoutError('State Not Selected: Please select your state.', 'state');
                return;
            }
            if (pincode.length !== 6) {
                showCheckoutError('Invalid Pincode: Please enter a valid 6-digit area pincode.', 'pincode');
                return;
            }
            if (termsBox && !termsBox.checked) {
                showCheckoutError('Terms & Conditions: You must agree to the terms to place an order.', null);
                return;
            }

            const btn = document.querySelector('button[onclick="handleSubmit()"]');
            btn.disabled = true;
            btn.classList.add('opacity-70', 'cursor-not-allowed');
            const originalBtnHtml = btn.innerHTML;
            btn.innerHTML = `<span class="flex items-center justify-center gap-2"><svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Validating Pincode...</span>`;

            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await response.json();

                if (!data || data.length === 0 || data[0].Status !== 'Success') {
                    showCheckoutError("Invalid Pincode: Sorry, we don't deliver to this pincode yet.", 'pincode');
                    btn.disabled = false;
                    btn.classList.remove('opacity-70', 'cursor-not-allowed');
                    btn.innerHTML = originalBtnHtml;
                    return;
                }

                const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value || 'online';

                if (selectedPayment === 'cod') {
                    btn.innerHTML = `<span class="flex items-center justify-center gap-2"><svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Placing Order...</span>`;
                    setTimeout(async () => {
                        const orderId = 'SS-' + Math.floor(100000 + Math.random() * 900000);
                        saveOrderToLocal(orderId, 'cod');
                        const serverResult = await submitOrderToServer(orderId, 'cod');
                        if (serverResult && serverResult.ok) {
                            localStorage.removeItem('southery_cart'); window.cart = []; if (typeof updateAllCounts === 'function') updateAllCounts();
                            if (localStorage.getItem('southery_token')) apiCall('/api/cart/clear', 'DELETE').catch(e => console.warn('Cart clear failed:', e.message));
                            redirectAfterOrder(orderId, 'cod', null, serverResult);
                        } else {
                            showCheckoutError('Order could not be confirmed. Please try again or contact support.', null);
                            btn.disabled = false;
                            btn.classList.remove('opacity-70', 'cursor-not-allowed');
                            btn.innerHTML = originalBtnHtml;
                        }
                    }, 1200);

                } else {
                    btn.disabled = false;
                    btn.classList.remove('opacity-70', 'cursor-not-allowed');
                    btn.innerHTML = originalBtnHtml;

                    if (typeof Razorpay === 'undefined') {
                        showCheckoutError('Payment Error: Razorpay could not load. Please check your internet or disable ad-blockers.', null);
                        return;
                    }

                    if (!RAZORPAY_KEY) {
                        showCheckoutError('Payment Error: Security Key missing. Please ensure your backend is running and providing the Razorpay Key.', null);
                        return;
                    }

                    if (checkoutTotal <= 0) {
                        showCheckoutError('Order Error: The cart total must be greater than 0 to proceed with payment.', null);
                        return;
                    }

                    const options = {
                        key: RAZORPAY_KEY,
                        amount: checkoutTotal * 100,
                        currency: 'INR',
                        name: 'Southery Sentie',
                        description: 'Handcrafted Jewelry Order',
                        handler: async function (response) {
                            showToast('Payment Successful! Order Confirmed.');
                            const orderRef = 'SS-' + response.razorpay_payment_id.slice(-6).toUpperCase();
                            saveOrderToLocal(orderRef, 'online');
                            const serverResult = await submitOrderToServer(orderRef, 'online', {
                                id: response.razorpay_payment_id,
                                status: 'paid',
                                update_time: new Date().toISOString()
                            });
                            if (serverResult && serverResult.ok) {
                                localStorage.removeItem('southery_cart'); window.cart = []; if (typeof updateAllCounts === 'function') updateAllCounts();
                                if (localStorage.getItem('southery_token')) apiCall('/api/cart/clear', 'DELETE').catch(e => console.warn('Cart clear failed:', e.message));
                                redirectAfterOrder(orderRef, 'online', response.razorpay_payment_id, serverResult);
                            } else {
                                showCheckoutError('Order could not be confirmed on our server, but payment was captured. Please contact support.', null);
                                btn.disabled = false;
                                btn.classList.remove('opacity-70', 'cursor-not-allowed');
                                btn.innerHTML = originalBtnHtml;
                            }
                        },
                        prefill: {
                            name: fname + ' ' + lname,
                            email: email,
                            contact: '+91' + phone
                        },
                        notes: {
                            address: address + ', ' + city + ', ' + state + ' - ' + pincode,
                            order_notes: document.getElementById('notes').value || ''
                        },
                        theme: { color: '#C45C26' },
                        modal: {
                            backdropclose: false,
                            ondismiss: function () {
                                showToast('Payment cancelled. Your cart is saved.');
                            }
                        }
                    };

                    const rzp = new Razorpay(options);
                    rzp.on('payment.failed', function (response) {
                        showCheckoutError('Payment Failed: ' + (response.error.description || 'Please try again.'), null);
                    });
                    rzp.open();
                }

            } catch (err) {
                console.error("Pincode validation failed:", err);
                const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
                if (selectedPayment === 'cod') {
                    setTimeout(async () => {
                        const orderId = 'SS-' + Math.floor(100000 + Math.random() * 900000);
                        saveOrderToLocal(orderId, 'cod');
                        const serverResult = await submitOrderToServer(orderId, 'cod');
                        if (serverResult && serverResult.ok) {
                            localStorage.removeItem('southery_cart'); window.cart = []; if (typeof updateAllCounts === 'function') updateAllCounts();
                            if (localStorage.getItem('southery_token')) apiCall('/api/cart/clear', 'DELETE').catch(e => console.warn('Cart clear failed:', e.message));
                            redirectAfterOrder(orderId, 'cod', null, serverResult);
                        } else {
                            showCheckoutError('Order could not be confirmed. Please try again or contact support.', null);
                            btn.disabled = false;
                            btn.classList.remove('opacity-70', 'cursor-not-allowed');
                            btn.innerHTML = originalBtnHtml;
                        }
                    }, 1000);
                } else {
                    btn.disabled = false;
                    btn.classList.remove('opacity-70', 'cursor-not-allowed');
                    btn.innerHTML = originalBtnHtml;
                    showCheckoutError('Pincode Error: Unable to verify pincode. Please check your connection and try again.', 'pincode');
                }
            }
        }

        document.querySelectorAll('input[name="payment"]').forEach(input => {
            input.addEventListener('change', (e) => {
                document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
                e.target.closest('.payment-option').classList.add('active');
            });
        });

        let cart = JSON.parse(localStorage.getItem('southery_cart')) || [];
        async function fetchSecureConfig() {
            try {
                const data = await apiCall('/api/config/razorpay');
                if (data && data.keyId) {
                    RAZORPAY_KEY = data.keyId;
                }
            } catch (err) {
                console.error("Failed to fetch Razorpay config:", err);
            }
        }

        document.addEventListener('DOMContentLoaded', async () => {
            await fetchSecureConfig();

            const sessionUser = localStorage.getItem('southery_user');
            if (sessionUser) {
                window.currentUser = JSON.parse(sessionUser);
            }
            prefillUser();

            window.addEventListener('cartUpdated', async function () {
                if (window.productsReady) {
                    await window.productsReady.catch(() => {});
                }
                cart = window.cart || [];
                renderSummary();
            });

            if (window.productsReady) {
                await window.productsReady.catch(() => {});
            }
            try { cart = window.cart || JSON.parse(localStorage.getItem('southery_cart')) || []; } catch (e) { cart = []; }
            renderSummary();
        });
    