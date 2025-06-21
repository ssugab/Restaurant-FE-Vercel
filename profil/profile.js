// API Configuration - Support both development and production
const API_BASE_URL = 'https://graceful-benevolence-production.up.railway.app/api';

document.addEventListener('DOMContentLoaded', function() {
    // Get all profile elements
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    const roleElement = document.getElementById('role');
    const createdAtElement = document.getElementById('createdAt');
    const userIdElement = document.getElementById('userId');

    // Fetch user data using JWT token
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`${API_BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(userData => {
            // Set all user data from API response
            usernameElement.textContent = userData.username || 'N/A';
            emailElement.textContent = userData.email || 'N/A';
            roleElement.textContent = userData.role || 'N/A';
            userIdElement.textContent = userData.id_user || 'N/A';
            
            // Format the date
            if (userData.created_at) {
                const date = new Date(userData.created_at);
                createdAtElement.textContent = date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            } else {
                createdAtElement.textContent = 'N/A';
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            // Show error state
            usernameElement.textContent = 'Error loading profile';
            emailElement.textContent = 'Please try again later';
            roleElement.textContent = '';
            createdAtElement.textContent = '';
            userIdElement.textContent = '';
        });
    } else {
        // No token found, redirect to login
        window.location.href = '../login/login.html';
    }
}); 