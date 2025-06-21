// Global API Configuration
const API_CONFIG = {
    // Railway backend URL
    PRODUCTION_URL: 'https://graceful-benevolence-production.up.railway.app/api',
    // Local development URL
    DEVELOPMENT_URL: 'http://localhost:3000/api',
    
    // Auto-detect environment
    getBaseURL: function() {
        // Check if running on localhost for development
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '') {
            return this.DEVELOPMENT_URL;
        }
        // Use production URL for deployed versions
        return this.PRODUCTION_URL;
    }
};

// Export the current API base URL
const API_BASE_URL = API_CONFIG.getBaseURL();

console.log('🌐 API Configuration loaded:', API_BASE_URL); 