let cart = [];
let cartTotal = 0;
let menuItems = [];
let categories = [];

// API Configuration - Support both development and production
// Updated: Railway URL configured for production deployment
const API_BASE_URL = 'https://handsome-blessing-production.up.railway.app/api';

// Debug logging for URL verification
console.log('🔧 DEBUG: Current hostname:', window.location.hostname);
console.log('🔧 DEBUG: API_BASE_URL set to:', API_BASE_URL);

function order() {
    window.location.href = 'order.html';
}

// Fetch menu items from backend
async function fetchMenuItems() {
    try{
        const response = await fetch(`${API_BASE_URL}/menu`, {
            headers: {
                'x-api-key': 'fe9955e426b64dee80f51bc39ba7076d',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
           
                window.location.href = '../login/login.html';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        menuItems = data;
        displayMenuItems();
    } catch (error) {
        console.error('Error fetching menu items:', error);
        showToast('Failed to load menu items. Please try again later.', 'error');
    }
}

// Fetch categories from backend
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/kategori`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        categories = data;
        setupCategoryButtons();
    } catch (error) {
        console.error('Error fetching categories:', error);
        // Continue without categories if they fail to load
    }
}

// Display menu items dynamically
function displayMenuItems(filteredItems = null) {
    const menuContainer = document.querySelector('.row.g-4');
    const itemsToDisplay = filteredItems || menuItems;
    
    if (itemsToDisplay.length === 0) {
        menuContainer.innerHTML = '<div class="col-12 text-center"><p>No menu items available.</p></div>';
        return;
    }

    menuContainer.innerHTML = itemsToDisplay.map(item => `
        <div class="col-md-4">
            <div class="card menu-item">
                <img src="${item.gambar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}" 
                     class="card-img-top" 
                     alt="${item.nama}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='"
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${item.nama}</h5>
                    <p class="card-text">${item.kategori ? item.kategori.nama_kategori : 'No category'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 mb-0">${formatCurrency(item.harga)}</span>
                        <div class="input-group" style="max-width: 120px;">
                            <button class="btn btn-outline-danger btn-sm minus-btn" data-id="${item.id}" data-name="${item.nama}" data-price="${item.harga}" data-image="${item.gambar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}">-</button>
                            <input type="number" min="0" max="10" value="0" class="form-control qty-input text-center" style="width:40px;">
                            <button class="btn btn-outline-success btn-sm plus-btn" data-id="${item.id}" data-name="${item.nama}" data-price="${item.harga}" data-image="${item.gambar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}">+</button>
                        </div>
                        <button class="btn btn-success ms-2 add-btn" data-id="${item.id}" data-name="${item.nama}" data-price="${item.harga}" data-image="${item.gambar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}">Add</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Re-attach event listeners
    attachMenuEventListeners();
}

// Setup category filter buttons
function setupCategoryButtons() {
    const categoryContainer = document.querySelector('.btn-group');
    if (categories.length > 0) {
        const categoryButtons = categories.map(category => 
            `<button type="button" class="category-btn" data-category-id="${category.id_kategori}">${category.nama_kategori}</button>`
        ).join('');
        
        categoryContainer.innerHTML = `
            <button type="button" class="category-btn active" data-category-id="all">All</button>
            ${categoryButtons}
        `;
    }
    
    // Attach category filter event listeners
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const categoryId = this.dataset.categoryId;
            if (categoryId === 'all') {
                displayMenuItems();
            } else {
                const filteredItems = menuItems.filter(item => item.id_kategori == categoryId);
                displayMenuItems(filteredItems);
            }
        });
    });
}

// Attach event listeners to menu items
function attachMenuEventListeners() {
    document.querySelectorAll('.menu-item').forEach(card => {
        const minusBtn = card.querySelector('.minus-btn');
        const plusBtn = card.querySelector('.plus-btn');
        const qtyInput = card.querySelector('.qty-input');
        const addBtn = card.querySelector('.add-btn');

        minusBtn.addEventListener('click', () => {
            let qty = parseInt(qtyInput.value) || 0;
            if (qty > 0) {
                qtyInput.value = qty - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            let qty = parseInt(qtyInput.value) || 0;
            if (qty < 10) {
                qtyInput.value = qty + 1;
            } else {
                showToast('Maximum quantity is 10!', 'warning');
            }
        });

        addBtn.addEventListener('click', () => {
            const id = addBtn.dataset.id;
            const name = addBtn.dataset.name;
            const price = parseFloat(addBtn.dataset.price);
            const image = addBtn.dataset.image;
            const qty = parseInt(qtyInput.value) || 0;
            
            // Validasi quantity
            if (qty <= 0) {
                showToast('Please select quantity first!', 'warning');
                return;
            }
            
            addToCart(id, name, price, qty, image);
            
            // Reset quantity input setelah ditambahkan ke cart
            qtyInput.value = 0;
        });
        
        // Validasi input quantity langsung
        qtyInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            if (value < 0) {
                this.value = 0;
            } else if (value > 10) {
                this.value = 10;
                showToast('Maximum quantity is 10!', 'warning');
            }
        });
    });
}

// Show loading state
function showLoading() {
    const menuContainer = document.querySelector('.row.g-4');
    menuContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading menu items...</p></div>';
}

// Show error message
function showError(message) {
    const menuContainer = document.querySelector('.row.g-4');
    menuContainer.innerHTML = `<div class="col-12 text-center"><div class="alert alert-danger" role="alert">${message}</div></div>`;
}

// Attach event listeners after DOM is loaded
window.addEventListener('DOMContentLoaded', async () => {
    showLoading();
    await Promise.all([fetchMenuItems(), fetchCategories()]);
});

function addToCart(id, name, price, qty, image) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id, name, price, qty, image });
    }
    updateCartUI();
    
    // Show toast notification
    showToast(`${name} added to cart!`, 'success');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Currency formatter for IDR
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartBadge = document.querySelector('.cart-badge');
    const cartSubtotalElement = document.getElementById('cartSubtotal');
    const cartTaxElement = document.getElementById('cartTax');
    const cartTotalElement = document.getElementById('cartTotal');

    let subtotal = 0;
    cartItems.innerHTML = cart.map(item => {
        subtotal += item.price * item.qty;
        return `
            <div class="order-item" style="display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid #eee;">
                <div class="item-image" style="width:60px;height:60px;border-radius:8px;overflow:hidden;background:#eee;">
                    <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div class="item-details" style="flex:1;">
                    <h3 style="font-size:1rem;margin-bottom:4px;">${item.name}</h3>
                    <div class="item-price" style="font-weight:600;color:#548de2;">${formatCurrency(item.price)}</div>
                </div>
                <div class="item-quantity" style="display:flex;align-items:center;gap:6px;">
                    <button class="quantity-btn minus-cart" data-id="${item.id}">-</button>
                    <input type="number" value="${item.qty}" min="1" max="10" style="width:40px;text-align:center;" data-id="${item.id}">
                    <button class="quantity-btn plus-cart" data-id="${item.id}">+</button>
                </div>
                <button class="btn btn-sm btn-danger ms-2 remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
    }).join('');

    cartBadge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    cartSubtotalElement.textContent = formatCurrency(subtotal);
    cartTaxElement.textContent = formatCurrency(tax);
    cartTotalElement.textContent = formatCurrency(total);

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            removeFromCart(this.dataset.id);
        });
    });
    
    // Quantity controls
    document.querySelectorAll('.minus-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const item = cart.find(i => i.id === id);
            if (item && item.qty > 1) {
                item.qty--;
                updateCartUI();
            }
        });
    });
    
    document.querySelectorAll('.plus-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const item = cart.find(i => i.id === id);
            if (item && item.qty < 10) {
                item.qty++;
                updateCartUI();
            }
        });
    });
    
    document.querySelectorAll('.item-quantity input').forEach(input => {
        input.addEventListener('change', function() {
            const id = this.dataset.id;
            let value = parseInt(this.value);
            if (value < 1) value = 1;
            if (value > 10) value = 10;
            const item = cart.find(i => i.id === id);
            if (item) {
                item.qty = value;
                updateCartUI();
            }
        });
    });
}

async function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
    }

    try {
        // Ambil id_user dari localStorage
        const id_user = localStorage.getItem('id_user');
        console.log('Checkout id_user:', id_user);
        if (!id_user || isNaN(parseInt(id_user))) {
            showToast('User ID tidak valid. Silakan login ulang.', 'error');
            return;
        }

        const orderData = {
            id_user: parseInt(id_user),
            items: cart.map(item => ({
                id_menu: item.id,
                jumlah: item.qty,
                harga_satuan: item.price
            }))
        };

        // Send order to backend
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || errData.message || `HTTP error! status: ${response.status}`);
        }

        const createdOrder = await response.json();

        // Clear cart first
        cart = [];
        cartTotal = 0;
        updateCartUI();

        // Close cart modal
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (cartModal) cartModal.hide();

        // Show success message and redirect to payment
        showToast('Order berhasil dibuat! Mengarahkan ke halaman pembayaran...', 'success');

        // Redirect to payment page with order ID after a short delay
        setTimeout(() => {
            window.location.href = `../payment/payment.html?orderId=${createdOrder.id_order}`;
        }, 1500);

    } catch (error) {
        console.error('Error during checkout:', error);
        showToast(error.message || 'Failed to place order. Please try again.', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastElement = document.getElementById('addToCartToast');
    const toastBody = toastElement.querySelector('.toast-body');
    const toastIcon = toastElement.querySelector('.toast-header i');
    const toastTitle = toastElement.querySelector('.toast-header strong');
    
    // Update toast content
    toastBody.textContent = message;
    
    // Update icon and title based on type
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle text-success me-2';
        toastTitle.textContent = 'Success!';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle text-danger me-2';
        toastTitle.textContent = 'Error!';
    } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle text-warning me-2';
        toastTitle.textContent = 'Warning!';
    }
    
    // Show the toast
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });
    toast.show();
}