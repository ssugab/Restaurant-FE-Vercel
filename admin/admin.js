// API Configuration - Support both development and production
const API_BASE_URL = 'https://graceful-benevolence-production.up.railway.app/api';

// Check authentication and admin role
function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('role');
    
    // Check if user is logged in
    if (!token || !userEmail) {
        window.location.href = '../login/login.html';
        return false;
    }
    
    // Check if user has admin role
    if (role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = '../menu/menu.html';
        return false;
    }
    
    return true;
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication first
    if (!checkAdminAuth()) {
        return; // Will redirect if not admin
    }
    
    // Continue with admin functionality
    initializeAdminPanel();
});

// Initialize admin panel functionality
function initializeAdminPanel() {
    // Initial load of data
    getMenus();
    getOrders();
    getPayments();
    getUsers();
    updateDashboardStats();
}

// Menu Management
async function getMenus() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`,{
            headers: {
                'x-api-key': 'fe9955e426b64dee80f51bc39ba7076d',
                'Content-Type': 'application/json'
            }
        });
        const menus = await response.json();
        const tbody = document.querySelector('#menu .table tbody');
        tbody.innerHTML = ''; // Clear previous rows

        menus.forEach(menu => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${menu.gambar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vPC90ZXh0Pjwvc3ZnPg=='}" class="rounded" alt="${menu.nama}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${menu.nama}</td>
                <td>${menu.kategori ? menu.kategori.nama_kategori : '-'}</td>
                <td>Rp ${menu.harga.toLocaleString('id-ID')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editMenu(${menu.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMenu(${menu.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching menus:', error);
        alert('Failed to load menus. Please try again later.');
    }
}

async function fetchOrdersData() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

async function fetchUsersData() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

async function fetchMenusData() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching menus:', error);
        return [];
    }
}

async function fetchPaymentsData() {
    try {
        const response = await fetch(`${API_BASE_URL}/payment`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching payments:', error);
        return [];
    }
}

// Navigation functionality
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Hide all sections
            document.querySelectorAll('.main-content > div').forEach(div => {
                div.classList.add('d-none');
            });
            // Show selected section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.remove('d-none');
            
            // Load data when switching to specific sections
            if (targetId === 'menu') {
                getMenus();
            } else if (targetId === 'orders') {
                getOrders();
            } else if (targetId === 'payments') {
                getPayments();
            } else if (targetId === 'users') {
                getUsers();
            } else if (targetId === 'dashboard') {
                updateDashboardStats();
            }
        }
    });
});

// Form submission
document.getElementById('addItemForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get data directly from input elements
    const nama = document.getElementById('nama').value;
    const id_kategori = parseInt(document.getElementById('id_kategori').value);
    const harga = parseInt(document.getElementById('harga').value);
    const gambar = document.getElementById('gambar').value;

    const id_menu = this.dataset.editing;
    const jsonData = { nama, id_kategori, harga, gambar };

    let url = `${API_BASE_URL}/menu`;
    let method = 'POST';
    if (id_menu) {
        url += `/${id_menu}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        });
        if (response.ok) {
            alert(id_menu ? 'Item updated successfully!' : 'Item added successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
            modal.hide();
            getMenus();
            this.reset();
            delete this.dataset.editing;
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save item');
        }
    } catch (error) {
        alert(error.message || 'Failed to save item. Please try again later.');
    }
});

// Orders management
async function getOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`);
    const orders = await response.json();
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';

    // Urutkan order dari terbaru ke terlama (opsional, agar histori paling baru di atas)
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    orders.forEach(order => {
        order.order_items.forEach((item, idx) => {
            const tr = document.createElement('tr');
            const totalHarga = item.harga_satuan * item.jumlah;
            // Ambil nama customer dari order.user.username, fallback ke email atau '-'
            const customerName = order.user && order.user.username ? order.user.username : (order.user && order.user.email ? order.user.email : '-');
            tr.innerHTML = `
                ${idx === 0 ? `<td rowspan="${order.order_items.length}">${order.id_order}</td>` : ''}
                <td>${customerName}</td>
                <td>${item.menu ? item.menu.nama : '-'}</td>
                <td>Rp ${item.harga_satuan.toLocaleString('id-ID')}</td>
                <td>${item.jumlah}</td>
                <td>Rp ${item.subtotal}</td>
                <td>Rp ${order.total}</td>
                ${idx === 0 ? `<td rowspan="${order.order_items.length}">${order.status}</td>` : ''}
                ${idx === 0 ? `
                <td rowspan="${order.order_items.length}">
                    <button class="btn btn-success order-complete" ${order.status === 'Completed' ? 'disabled' : ''}>Complete</button>
                    <button class="btn btn-danger order-cancel" ${order.status === 'Cancelled' ? 'disabled' : ''}>Cancel</button>
                </td>
                ` : ''}
            `;
            tbody.appendChild(tr);
        });
    });

    // Re-attach event listeners after rendering
    attachOrderEventListeners();
}

// Payment Management
async function getPayments() {
    try {
        const response = await fetch(`${API_BASE_URL}/payment`);
        const payments = await response.json();
        const tbody = document.getElementById('paymentsTableBody');
        tbody.innerHTML = ''; // Clear previous rows

        payments.forEach(payment => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#P${payment.id_payment}</td>
                <td>#${payment.id_order}</td>
                <td>${payment.customer}</td>
                <td>Rp ${payment.total.toLocaleString('id-ID')}</td>
                <td>${payment.metode}</td>
                <td><span class="badge ${payment.status === 'paid' ? 'bg-success' : 'bg-warning'}">${payment.status === 'paid' ? 'Paid' : 'Pending'}</span></td>
                <td>
                    <button class="btn btn-sm btn-success payment-complete" ${payment.status === 'paid' ? 'disabled' : ''} data-payment-id="${payment.id_payment}">
                        ${payment.status === 'paid' ? 'Paid' : 'Mark as Paid'}
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Attach event listeners to payment buttons
        attachPaymentEventListeners();
    } catch (error) {
        console.error('Error fetching payments:', error);
        alert('Failed to load payments. Please try again later.');
    }
}

// User Management
async function getUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const users = await response.json();
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = ''; // Clear previous rows

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#U${user.id_user}</td>
                <td>${user.username}</td>
                <td>${user.email || '-'}</td>
                <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'kasir' ? 'bg-primary' : 'bg-success'}">${user.role}</span></td>
                <td><span class="badge bg-success">Active</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editUser(${user.id_user})">Edit</button>
                    <button class="btn btn-sm btn-danger user-delete" data-user-id="${user.id_user}">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Attach event listeners to delete buttons
        attachUserEventListeners();
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please try again later.');
    }
}

// Function to attach payment event listeners
function attachPaymentEventListeners() {
    document.querySelectorAll('.payment-complete').forEach(btn => {
        btn.addEventListener('click', async function() {
            const paymentId = this.dataset.paymentId;
            try {
                const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'paid' })
                });

                if (response.ok) {
                    const row = this.closest('tr');
                    row.querySelector('.badge').className = 'badge bg-success';
                    row.querySelector('.badge').textContent = 'Paid';
                    this.textContent = 'Paid';
                    this.classList.remove('btn-success');
                    this.classList.add('btn-secondary');
                    this.disabled = true;
                } else {
                    throw new Error('Failed to update payment status');
                }
            } catch (error) {
                console.error('Error updating payment:', error);
                alert('Failed to update payment status. Please try again later.');
            }
        });
    });
}

// Function to attach user event listeners
function attachUserEventListeners() {
    document.querySelectorAll('.user-delete').forEach(btn => {
        btn.addEventListener('click', async function() {
            const userId = this.dataset.userId;
            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        const row = this.closest('tr');
                        row.remove();
                        alert('User deleted successfully');
                    } else {
                        throw new Error('Failed to delete user');
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Failed to delete user. Please try again later.');
                }
            }
        });
    });
}

// Function to attach order event listeners
function attachOrderEventListeners() {
    document.querySelectorAll('.order-complete').forEach(btn => {
        btn.addEventListener('click', async function() {
            const orderId = this.closest('tr').querySelector('td').textContent;
            try {
                const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'selesai' })
                });

                if (response.ok) {
                    const row = this.closest('tr');
                    const statusCell = row.querySelector('td:nth-last-child(2)');
                    statusCell.textContent = 'selesai';
                    this.disabled = true;
                    this.closest('td').querySelector('.order-cancel').disabled = true;
                } else {
                    throw new Error('Failed to update order status');
                }
            } catch (error) {
                console.error('Error updating order:', error);
                alert('Failed to update order status. Please try again later.');
            }
        });
    });

    document.querySelectorAll('.order-cancel').forEach(btn => {
        btn.addEventListener('click', async function() {
            const orderId = this.closest('tr').querySelector('td').textContent;
            try {
                const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'Cancelled' })
                });

                if (response.ok) {
                    const row = this.closest('tr');
                    const statusCell = row.querySelector('td:nth-last-child(2)');
                    statusCell.textContent = 'Cancelled';
                    this.disabled = true;
                    this.closest('td').querySelector('.order-complete').disabled = true;
                } else {
                    throw new Error('Failed to update order status');
                }
            } catch (error) {
                console.error('Error updating order:', error);
                alert('Failed to update order status. Please try again later.');
            }
        });
    });
}

// Function to update dashboard statistics
async function updateDashboardStats() {
    const orders = await fetchOrdersData();
    const users = await fetchUsersData();

    const totalOrders = orders.length;
    const activeUsers = users.length; // Assuming all fetched users are active
    
    let todayRevenue = 0;
    let pendingOrders = 0;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    orders.forEach(order => {
        // Hanya hitung revenue dari order yang statusnya 'selesai' (Completed) dan tanggal hari ini
        if (order.created_at && order.created_at.startsWith(today) && (order.status === 'selesai' || order.status === 'Completed')) {
            todayRevenue += parseFloat(order.total);
        }
        // Count pending orders
        if (order.status === 'pending') {
            pendingOrders++;
        }
    });

    // Update the dashboard elements
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('todayRevenue').textContent = `Rp ${todayRevenue.toLocaleString('id-ID')}`;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('pendingOrders').textContent = pendingOrders;
}

async function deleteMenu(id_menu) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/${id_menu}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Menu item deleted successfully!');
                getMenus(); // Refresh the menu list
            } else {
                throw new Error('Failed to delete menu item');
            }
        } catch (error) {
            alert(error.message || 'Failed to delete menu item. Please try again later.');
        }
    }
}

document.querySelectorAll('.delete-menu').forEach(btn => {
    btn.addEventListener('click', function() {
        const id_menu = this.dataset.id;
        deleteMenu(id_menu);
    });
});

function editMenu(id_menu) {
    // Fetch menu data by id_menu (or use data already available)
    fetch(`${API_BASE_URL}/menu/${id_menu}`)
        .then(res => res.json())
        .then(menu => {
            document.getElementById('nama').value = menu.nama;
            document.getElementById('id_kategori').value = menu.id_kategori;
            document.getElementById('harga').value = menu.harga;
            document.getElementById('gambar').value = menu.gambar;
            // Store the id_menu somewhere, e.g., a hidden input or a variable
            document.getElementById('addItemForm').dataset.editing = id_menu;
            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('addItemModal'));
            modal.show();
        });
} 