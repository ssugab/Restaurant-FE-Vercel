// API Configuration - Support both development and production
const API_BASE_URL = 'https://graceful-benevolence-production.up.railway.app/api';

// Function to show error message
function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) {
        errorAlert.textContent = message;
        errorAlert.style.display = 'block';
        setTimeout(() => {
            errorAlert.style.display = 'none';
        }, 5000);
    } else {
        alert(message); // Fallback jika element tidak ada
    }
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate password strength
function isStrongPassword(password) {
    return password.length >= 8;
}

document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const menuGrid = document.getElementById('menu-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const contactForm = document.getElementById('contact-form');
    const registrationForm = document.getElementById('registrationForm');
    const errorAlert = document.getElementById('errorAlert');

    // Setup registration form if it exists
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form values
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate form
            if (!username || !email || !password || !confirmPassword) {
                showError('All fields are required');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            if (!isStrongPassword(password)) {
                showError('Password must be at least 8 characters long');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            try {
                console.log('Registration data:', { username, email, password });
                // Send registration request to backend
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                        role: 'pelanggan' // Default role for new registrations
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('id_user', data.user.id);

                // Show success message and redirect
                alert('Registration successful! Redirecting to login page...');
                window.location.href = '../login/login.html';

            } catch (error) {
                console.error('Registration error:', error);
                showError(error.message || 'Registration failed. Please try again.');
            }
        });
    }

    // Cart state
    let cart = [];
    let cartTotal = 0;
    let menuItems = [];

    // Fetch menu items from API
    async function fetchMenuItems() {
        try {
            const response = await fetch(`${API_BASE_URL}/menu`);
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            menuItems = await response.json();
            displayMenuItems();
        } catch (error) {
            console.error('Error fetching menu items:', error);
            alert('Failed to load menu items. Please try again later.');
        }
    }

    // Mobile Navigation Toggle
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        hamburger.classList.toggle('active');
    });

    // Cart Toggle
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Category Filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            displayMenuItems(category);
        });
    });

    // Display Menu Items
    function displayMenuItems(category = 'all') {
        menuGrid.innerHTML = '';
        
        const filteredItems = category === 'all' 
            ? menuItems 
            : menuItems.filter(item => item.category === category);

        filteredItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <p class="description">${item.description}</p>
                    <button class="add-to-cart" data-id="${item.id}">
                        Add to Cart
                    </button>
                </div>
            `;
            menuGrid.appendChild(menuItem);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                addToCart(itemId);
            });
        });
    }

    // Add to Cart
    function addToCart(itemId) {
        const item = menuItems.find(item => item.id === itemId);
        const existingItem = cart.find(cartItem => cartItem.id === itemId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }

        updateCart();
        cartSidebar.classList.add('active');
    }

    // Update Cart
    function updateCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const totalAmount = document.querySelector('.total-amount');

        cartItems.innerHTML = '';
        cartTotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        totalAmount.textContent = `$${cartTotal.toFixed(2)}`;

        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                if (e.target.classList.contains('increase')) {
                    updateQuantity(itemId, 1);
                } else if (e.target.classList.contains('decrease')) {
                    updateQuantity(itemId, -1);
                }
            });
        });
    }

    // Update Item Quantity
    function updateQuantity(itemId, change) {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(cartItem => cartItem.id !== itemId);
            }
            updateCart();
        }
    }

    // Submit Order
    async function submitOrder() {
        try {
            const orderData = {
                items: cart.map(item => ({
                    menuId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: cartTotal
            };

            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit order');
            }

            const result = await response.json();
            alert('Order submitted successfully!');
            cart = [];
            updateCart();
            cartSidebar.classList.remove('active');
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit order. Please try again later.');
        }
    }

    // Contact Form Submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to submit contact form');
            }

            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Failed to submit message. Please try again later.');
        }
    });

    // Initialize
    fetchMenuItems();
}); 