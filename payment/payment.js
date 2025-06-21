// API Configuration - Support both development and production
const API_BASE_URL = 'https://handsome-blessing-production.up.railway.app/api';

// Global variables
let currentOrder = null;
let orderTotal = 0;

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

// Get order ID from URL parameters
function getOrderIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('orderId');
}

// Fetch order details
async function fetchOrderDetails(orderId) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const order = await response.json();
        currentOrder = order;
        orderTotal = order.total;
        displayOrderSummary(order);
        updateTotalAmount();
    } catch (error) {
        console.error('Error fetching order details:', error);
        showError('Gagal memuat detail order. Silakan coba lagi.');
    }
}

// Display order summary
function displayOrderSummary(order) {
    const orderSummaryContainer = document.getElementById('orderSummary');
    const orderItems = order.order_items || [];
    
    if (orderItems.length === 0) {
        orderSummaryContainer.innerHTML = `
            <div class="text-center py-3">
                <i class="fas fa-exclamation-triangle text-warning fa-2x mb-2"></i>
                <p class="text-muted">Tidak ada item dalam order ini.</p>
            </div>
        `;
        return;
    }

    const itemsList = orderItems.map(item => {
        const menuName = item.menu ? item.menu.nama : 'Item Tidak Dikenal';
        const menuHarga = item.harga_satuan;
        const subtotal = item.subtotal;
        
        return `
            <div class="order-item d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    <div class="order-item-name">${menuName}</div>
                    <div class="order-item-details">
                        ${item.jumlah} x ${formatCurrency(menuHarga)}
                    </div>
                </div>
                <div class="order-item-price">
                    ${formatCurrency(subtotal)}
                </div>
            </div>
        `;
    }).join('');

    orderSummaryContainer.innerHTML = `
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span><strong>Order #${order.id_order}</strong></span>
                <span class="text-muted">${formatDate(order.created_at)}</span>
            </div>
        </div>
        <div class="order-items mb-3">
            ${itemsList}
        </div>
        <hr>
        <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Total Order:</h6>
            <h6 class="mb-0 text-primary">${formatCurrency(order.total)}</h6>
        </div>
    `;
}

// Update total amount display
function updateTotalAmount() {
    const totalAmountElement = document.getElementById('totalAmount');
    totalAmountElement.textContent = formatCurrency(orderTotal);
}

// Handle payment form submission
async function handlePaymentSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const customerName = document.getElementById('customerName').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    // Validation
    if (!customerName) {
        showAlert('Nama customer harus diisi!', 'danger');
        return;
    }
    
    if (!paymentMethod) {
        showAlert('Pilih metode pembayaran!', 'danger');
        return;
    }
    
    if (!currentOrder) {
        showAlert('Data order tidak valid!', 'danger');
        return;
    }
    
    try {
        // Show loading state
        const submitButton = document.getElementById('submitPayment');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        submitButton.disabled = true;
        form.classList.add('submitting');
        
        // Create payment data
        const paymentData = {
            id_order: currentOrder.id_order,
            total: orderTotal,
            metode: paymentMethod.value,
            customer: customerName
        };
        
        // Submit payment to backend
        const response = await fetch(`${API_BASE_URL}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal memproses pembayaran');
        }
        
        const result = await response.json();
        console.log('Payment created:', result);
        
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update payment status to paid (in real app, this would be done by payment gateway)
        await updatePaymentStatus(result.id_payment, 'paid');
        
        // Show success modal
        showSuccessModal();
        
    } catch (error) {
        console.error('Error processing payment:', error);
        showAlert(`Gagal memproses pembayaran: ${error.message}`, 'danger');
    } finally {
        // Reset form state
        const submitButton = document.getElementById('submitPayment');
        submitButton.innerHTML = '<i class="fas fa-credit-card"></i> Bayar Sekarang';
        submitButton.disabled = false;
        form.classList.remove('submitting');
    }
}

// Update payment status
async function updatePaymentStatus(paymentId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/${paymentId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status })
        });
        
        if (!response.ok) {
            throw new Error('Gagal mengupdate status pembayaran');
        }
        
        console.log('Payment status updated to:', status);
    } catch (error) {
        console.error('Error updating payment status:', error);
        // Don't throw error here as payment was already created successfully
    }
}

// Show success modal
function showSuccessModal() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

// Navigate to order history
function goToOrderHistory() {
    window.location.href = '../order/order.html';
}

// Navigate to menu
function goToMenu() {
    window.location.href = '../menu/menu.html';
}

// Show loading state
function showLoading() {
    const orderSummaryContainer = document.getElementById('orderSummary');
    orderSummaryContainer.innerHTML = `
        <div class="text-center py-3">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Memuat data order...</p>
        </div>
    `;
}

// Show error message
function showError(message) {
    const orderSummaryContainer = document.getElementById('orderSummary');
    orderSummaryContainer.innerHTML = `
        <div class="text-center py-3">
            <i class="fas fa-exclamation-triangle text-danger fa-2x mb-2"></i>
            <p class="text-danger">${message}</p>
            <button class="btn btn-outline-primary btn-sm" onclick="window.location.reload()">
                Coba Lagi
            </button>
        </div>
    `;
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert alert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Get order ID from URL
    const orderId = getOrderIdFromUrl();
    
    if (!orderId) {
        showError('ID Order tidak ditemukan. Silakan kembali ke halaman order.');
        return;
    }
    
    // Fetch order details
    fetchOrderDetails(orderId);
    
    // Set up form submission handler
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.addEventListener('submit', handlePaymentSubmission);
    
    // Set up payment method change handlers for visual feedback
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Remove selected class from all cards
            const allCards = document.querySelectorAll('.payment-method-card');
            allCards.forEach(card => card.classList.remove('selected'));
            
            // Add selected class to current card
            const selectedCard = this.closest('.payment-method-card');
            selectedCard.classList.add('selected');
        });
    });
    
    // Auto-fill customer name from localStorage if available
    const savedCustomerName = localStorage.getItem('customerName');
    if (savedCustomerName) {
        document.getElementById('customerName').value = savedCustomerName;
    }
    
    // Save customer name to localStorage when form is submitted
    document.getElementById('customerName').addEventListener('change', function() {
        localStorage.setItem('customerName', this.value);
    });
}); 