// API Configuration - Support both development and production
const API_BASE_URL = 'https://graceful-benevolence-production.up.railway.app/api';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email, // Backend expects username field
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            // Store token and user data
            if (rememberMe) {
                localStorage.setItem("role", data.user.role)
                localStorage.setItem("token", data.token);
                localStorage.setItem("userEmail", data.user.email);
                localStorage.setItem("id_user", data.user.id);
            } else {
                localStorage.setItem("role", data.user.role)
                localStorage.setItem("token", data.token);
                localStorage.setItem("userEmail", data.user.email);
                localStorage.setItem("id_user", data.user.id);
            }
            
            // Redirect based on user role
            if (data.user.role === 'admin') {
                window.location.href = '../admin/admin.html';
            } else {
                window.location.href = '../menu/menu.html';
            }
        } else {
            // Show error message
            showError(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Network error. Please check your connection.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

function showError(message) {
    // Remove existing error message
    const existingError = document.querySelector('.alert-danger');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error alert
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger mt-3';
    errorDiv.textContent = message;
    
    // Insert error message after the form
    const form = document.getElementById('loginForm');
    form.appendChild(errorDiv);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    
    if (token && user.username) {
        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = '../admin/admin.html';
        } else {
            window.location.href = '../index/index.html';
        }
    }
}

// Check auth status when page loads
document.addEventListener('DOMContentLoaded', checkAuthStatus);
