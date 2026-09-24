import axios from 'axios';

let sessionId = localStorage.getItem('url_shortener_session_id');
if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    localStorage.setItem('url_shortener_session_id', sessionId);
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'x-session-id': sessionId
    }
});

// Request interceptor to add JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        if (error.response?.status === 401) {
            // Optional: Handle auto-logout on token expiration
            localStorage.removeItem('token');
            // window.location.href = '/login'; // Or handle via state
        }
        return Promise.reject(new Error(message));
    }
);

export default api;
