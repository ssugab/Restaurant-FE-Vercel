// API Configuration - Support both development and production
const API_BASE_URL = 'https://handsome-blessing-production.up.railway.app/api';

// Global variables
let orders = [];

// Currency formatter for IDR
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get status badge class
function getStatusBadgeClass(status) {
    switch (status) {
        case 'pending':
            return 'bg-warning text-dark';
        case 'diproses':
            return 'bg-info';
        case 'selesai':
            return 'bg-success';
        case 'dibatalkan':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Get status display text
function getStatusDisplayText(status) {
    switch (status) {
        case 'pending':
            return 'Pending';
        case 'diproses':
            return 'Processing';
        case 'selesai':
            return 'Completed';
        case 'dibatalkan':
            return 'Cancelled';
        default:
            return status;
    }
}

// Fetch orders from backend
async function fetchOrders() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        orders = data;
        displayOrders();
    } catch (error) {
        console.error('Error fetching orders:', error);
        showError('Failed to load order history. Please try again later.');
    }
}

// Display orders
function displayOrders() {
    const orderContainer = document.querySelector('.order-history-list');
    
    if (orders.length === 0) {
        orderContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No orders found</h4>
                <p class="text-muted">You haven't placed any orders yet.</p>
                <a href="../menu/menu.html" class="btn btn-primary">Browse Menu</a>
            </div>
        `;
        return;
    }

    orderContainer.innerHTML = orders.map(order => {
        const orderItems = order.order_items || [];
        const itemsList = orderItems.map(item => {
            const menuName = item.menu ? item.menu.nama : 'Unknown Item';
            return `<li>${menuName} x${item.jumlah} - ${formatCurrency(item.harga_satuan)}</li>`;
        }).join('');

        return `
            <div class="card mb-4 shadow-sm order-history-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <span class="fw-bold">Order #${order.id_order}</span>
                            <span class="text-muted ms-3">
                                <i class="fa fa-calendar-alt"></i> ${formatDate(order.created_at)}
                            </span>
                        </div>
                        <span class="badge ${getStatusBadgeClass(order.status)}">
                            ${getStatusDisplayText(order.status)}
                        </span>
                    </div>
                    <ul class="list-unstyled mb-2">
                        ${itemsList}
                    </ul>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-semibold">Total: ${formatCurrency(order.total)}</span>
                        <div class="btn-group">
                            ${order.status === 'pending' ? 
                                `<button class="btn btn-success btn-sm me-2" onclick="payOrder(${order.id_order})">
                                    <i class="fas fa-credit-card"></i> Pay Now
                                </button>` : ''}
                            <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetails(${order.id_order})">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// View order details
async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const order = await response.json();
        showOrderDetailsModal(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        alert('Failed to load order details. Please try again.');
    }
}

// Show order details modal
function showOrderDetailsModal(order) {
    const orderItems = order.order_items || [];
    const itemsList = orderItems.map(item => {
        const menuName = item.menu ? item.menu.nama : 'Unknown Item';
        return `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                    <h6 class="mb-0">${menuName}</h6>
                    <small class="text-muted">Quantity: ${item.jumlah}</small>
                </div>
                <div class="text-end">
                    <div>${formatCurrency(item.harga_satuan)} each</div>
                    <div class="fw-bold">${formatCurrency(item.subtotal)}</div>
                </div>
            </div>
        `;
    }).join('');

    const modalHTML = `
        <div class="modal fade" id="orderDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Order #${order.id_order} Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Order Date:</strong><br>
                                ${formatDate(order.created_at)}
                            </div>
                            <div class="col-md-6">
                                <strong>Status:</strong><br>
                                <span class="badge ${getStatusBadgeClass(order.status)}">
                                    ${getStatusDisplayText(order.status)}
                                </span>
                            </div>
                        </div>
                        <div class="mb-3">
                            <strong>Order Items:</strong>
                            <div class="mt-2">
                                ${itemsList}
                            </div>
                        </div>
                        <div class="text-end">
                            <h5>Total: ${formatCurrency(order.total)}</h5>
                        </div>
                    </div>
                    <div class="modal-footer">
                        ${order.status === 'pending' ? 
                            `<button type="button" class="btn btn-success" onclick="payOrder(${order.id_order})">
                                <i class="fas fa-credit-card"></i> Pay Now
                            </button>` : ''}
                        <button type="button" class="btn btn-danger" onclick="deleteOrder(${order.id_order})">Delete Order</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('orderDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
}

// Navigate to payment page
function payOrder(orderId) {
    // Close modal if open
    const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
    if (modal) {
        modal.hide();
    }
    
    // Navigate to payment page with order ID
    window.location.href = `../payment/payment.html?orderId=${orderId}`;
}

// Fungsi hapus order
async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            // Tutup modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
            modal.hide();
            // Refresh order list
            fetchOrders();
            alert('Order deleted successfully.');
        } else {
            throw new Error('Failed to delete order');
        }
    } catch (error) {
        alert('Failed to delete order. Please try again.');
    }
}

// Show loading state
function showLoading() {
    const orderContainer = document.querySelector('.order-history-list');
    orderContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading order history...</p>
        </div>
    `;
}

// Show error message
function showError(message) {
    const orderContainer = document.querySelector('.order-history-list');
    orderContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
            <button class="btn btn-primary" onclick="fetchOrders()">Try Again</button>
        </div>
    `;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    fetchOrders();
});

// Refresh orders when page becomes visible (user returns from payment page)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        fetchOrders();
    }
});

// Also refresh when page regains focus
window.addEventListener('focus', function() {
    fetchOrders();
}); 

