/**
 * API Service Layer for New Gate Chapel Frontend
 * 
 * This module provides a centralized API client using Axios with:
 * - Automatic JWT token management (access + refresh tokens)
 * - Request/response interceptors for authentication
 * - Frontend caching layer for performance optimization
 * - Automatic token refresh on 401 errors
 * 
 * @module services/api
 */

import axios from 'axios';
import { apiCache } from '../utils/apiCache';

/** Base API URL from environment variables or defaults to localhost */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// =============================================================================
// AXIOS INSTANCE CONFIGURATION
// =============================================================================

/**
 * Create axios instance with performance optimizations.
 * 
 * Configuration:
 * - 15 second timeout for all requests
 * - Automatic compression support (gzip, brotli)
 * - JSON content type default
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// =============================================================================
// REQUEST INTERCEPTOR - Add JWT token to all requests
// =============================================================================

/**
 * Request interceptor adds Bearer token from localStorage to all requests.
 * Token is stored with key 'gate_access_token'.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('gate_access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =============================================================================
// RESPONSE INTERCEPTOR - Handle token refresh on 401 errors
// =============================================================================

/**
 * Response interceptor handles automatic token refresh.
 * 
 * On 401 Unauthorized:
 * 1. Attempts to refresh access token using refresh token
 * 2. Retries original request with new token
 * 3. On refresh failure, clears auth and redirects to login
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('gate_refresh_token');
                const response = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
                const { access } = response.data;
                localStorage.setItem('gate_access_token', access);
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token expired or invalid, logout user
                localStorage.removeItem('gate_access_token');
                localStorage.removeItem('gate_refresh_token');
                localStorage.removeItem('gate_admin_user');
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default {
    // Auth
    /**
     * Authenticates a user with the backend.
     * @param {string} identifier - The user's email or username.
     * @param {string} password - The user's password.
     * @returns {Promise<{success: boolean, user: object}>}
     */
    login: async (identifier, password) => {
        const response = await api.post('/token/', { username: identifier, password });
        const { access, refresh } = response.data;
        localStorage.setItem('gate_access_token', access);
        localStorage.setItem('gate_refresh_token', refresh);
        // We might want to fetch user details here or decode the token
        const userData = { email: identifier.includes('@') ? identifier : '', role: 'admin', name: identifier.split('@')[0] };
        localStorage.setItem('gate_admin_user', JSON.stringify(userData));
        return { success: true, user: userData };
    },
    /**
     * Registers a new admin user.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @returns {Promise<{success: boolean, user: object}>}
     */
    register: async (email, password) => {
        const response = await api.post('/register/', { username: email, password, email });
        const { access, refresh, user } = response.data;
        localStorage.setItem('gate_access_token', access);
        localStorage.setItem('gate_refresh_token', refresh);
        const userData = { email: user.email, role: 'admin', name: user.username };
        localStorage.setItem('gate_admin_user', JSON.stringify(userData));
        return { success: true, user: userData };
    },
    // Events
    /**
     * Fetches all events with caching.
     * @returns {Promise<Array>}
     */
    getEvents: async () => {
        const cacheKey = 'events_all';
        const cached = apiCache.get(cacheKey);

        if (cached && !cached.isStale) {
            return cached.data;
        }

        const response = await api.get('/events/');
        apiCache.set(cacheKey, response.data, 300000); // Cache for 5 minutes
        return response.data;
    },
    /**
     * Creates a new event.
     * @param {object} data - The event data.
     * @returns {Promise<object>}
     */
    createEvent: async (data) => {
        const response = await api.post('/events/', data);
        return response.data;
    },
    /**
     * Updates an existing event.
     * @param {number} id - The event ID.
     * @param {object} data - The updated event data.
     * @returns {Promise<object>}
     */
    updateEvent: async (id, data) => {
        const response = await api.put(`/events/${id}/`, data);
        return response.data;
    },
    /**
     * Creates an event with an image upload.
     * @param {FormData} formData - The multipart form data.
     * @returns {Promise<object>}
     */
    createEventWithImage: async (formData) => {
        const response = await api.post('/events/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    /**
     * Updates an event with an image upload.
     * @param {number} id - The event ID.
     * @param {FormData} formData - The multipart form data.
     * @returns {Promise<object>}
     */
    updateEventWithImage: async (id, formData) => {
        const response = await api.put(`/events/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    /**
     * Deletes an event.
     * @param {number} id - The event ID.
     * @returns {Promise<void>}
     */
    deleteEvent: async (id) => {
        await api.delete(`/events/${id}/`);
    },

    // =============================================================================
    // SERMON API METHODS
    // =============================================================================

    /**
     * Fetches all sermons with caching.
     * @returns {Promise<Array>} Array of sermon objects
     */
    getSermons: async () => {
        const cacheKey = 'sermons_all';
        const cached = apiCache.get(cacheKey);

        if (cached && !cached.isStale) {
            return cached.data;
        }

        const response = await api.get('/sermons/');
        apiCache.set(cacheKey, response.data, 300000); // Cache for 5 minutes
        return response.data;
    },

    /**
     * Creates a new sermon.
     * @param {object} data - The sermon data
     * @returns {Promise<object>} Created sermon object
     */
    createSermon: async (data) => {
        const response = await api.post('/sermons/', data);
        return response.data;
    },

    /**
     * Updates an existing sermon.
     * @param {number} id - The sermon ID
     * @param {object} data - The updated sermon data
     * @returns {Promise<object>} Updated sermon object
     */
    updateSermon: async (id, data) => {
        const response = await api.put(`/sermons/${id}/`, data);
        return response.data;
    },

    /**
     * Creates a sermon with image upload.
     * @param {FormData} formData - Multipart form data with image
     * @returns {Promise<object>} Created sermon object
     */
    createSermonWithImage: async (formData) => {
        const response = await api.post('/sermons/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Updates a sermon with image upload.
     * @param {number} id - The sermon ID
     * @param {FormData} formData - Multipart form data with image
     * @returns {Promise<object>} Updated sermon object
     */
    updateSermonWithImage: async (id, formData) => {
        const response = await api.put(`/sermons/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Deletes a sermon.
     * @param {number} id - The sermon ID
     * @returns {Promise<void>}
     */
    deleteSermon: async (id) => {
        await api.delete(`/sermons/${id}/`);
    },

    // Ministries
    /**
     * Fetches all ministries.
     * @returns {Promise<Array>}
     */
    getMinistries: async () => {
        const cacheKey = 'ministries_all';
        const cached = apiCache.get(cacheKey);

        if (cached && !cached.isStale) {
            return cached.data;
        }

        const response = await api.get('/ministries/');
        apiCache.set(cacheKey, response.data, 120000); // Cache for 2 minutes (reduced for faster updates)
        return response.data;
    },
    /**
     * Creates a new ministry.
     * @param {object} data - The ministry data.
     * @returns {Promise<object>}
     */
    createMinistry: async (data) => {
        const response = await api.post('/ministries/', data);
        return response.data;
    },
    /**
     * Updates an existing ministry.
     * @param {number} id - The ministry ID.
     * @param {object} data - The updated ministry data.
     * @returns {Promise<object>}
     */
    updateMinistry: async (id, data) => {
        const response = await api.put(`/ministries/${id}/`, data);
        return response.data;
    },
    /**
     * Creates a ministry with an image upload.
     * @param {FormData} formData - The multipart form data.
     * @returns {Promise<object>}
     */
    createMinistryWithImage: async (formData) => {
        const response = await api.post('/ministries/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    /**
     * Updates a ministry with an image upload.
     * @param {number} id - The ministry ID.
     * @param {FormData} formData - The multipart form data.
     * @returns {Promise<object>}
     */
    updateMinistryWithImage: async (id, formData) => {
        const response = await api.put(`/ministries/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    /**
     * Deletes a ministry.
     * @param {number} id - The ministry ID.
     * @returns {Promise<void>}
     */
    deleteMinistry: async (id) => {
        await api.delete(`/ministries/${id}/`);
    },

    // Live Stream
    /**
     * Fetches the current live stream configuration.
     * @returns {Promise<object>}
     */
    getLiveStream: async () => {
        const cacheKey = 'livestream_status';
        const cached = apiCache.get(cacheKey);

        if (cached && !cached.isStale) {
            return cached.data;
        }

        const response = await api.get('/livestream/');
        apiCache.set(cacheKey, response.data, 60000); // Cache for 1 minute (live status changes)
        return response.data;
    },
    /**
     * Creates/Updates live stream configuration.
     * @param {object} data - The stream data.
     * @returns {Promise<object>}
     */
    createLiveStream: async (data) => {
        const response = await api.post('/livestream/', data);
        return response.data;
    },
    /**
     * Updates an existing live stream.
     * @param {number} id - The stream ID.
     * @param {object} data - The updated stream data.
     * @returns {Promise<object>}
     */
    updateLiveStream: async (id, data) => {
        const response = await api.put(`/livestream/${id}/`, data);
        return response.data;
    },

    // Service Schedule
    getSchedule: async () => {
        const response = await api.get('/schedule/');
        return response.data;
    },
    createSchedule: async (data) => {
        const response = await api.post('/schedule/', data);
        return response.data;
    },
    updateSchedule: async (id, data) => {
        const response = await api.put(`/schedule/${id}/`, data);
        return response.data;
    },
    deleteSchedule: async (id) => {
        await api.delete(`/schedule/${id}/`);
    },

    // Values
    getValues: async () => {
        const response = await api.get('/values/');
        return response.data;
    },
    createValue: async (data) => {
        const response = await api.post('/values/', data);
        return response.data;
    },
    updateValue: async (id, data) => {
        const response = await api.put(`/values/${id}/`, data);
        return response.data;
    },
    deleteValue: async (id) => {
        await api.delete(`/values/${id}/`);
    },

    // Giving Options
    getGivingOptions: async () => {
        const response = await api.get('/giving-options/');
        return response.data;
    },
    createGivingOption: async (data) => {
        const response = await api.post('/giving-options/', data);
        return response.data;
    },
    updateGivingOption: async (id, data) => {
        const response = await api.put(`/giving-options/${id}/`, data);
        return response.data;
    },
    deleteGivingOption: async (id) => {
        await api.delete(`/giving-options/${id}/`);
    },

    // Leadership
    getLeadership: async () => {
        const response = await api.get('/leadership/');
        return response.data;
    },
    createLeadership: async (data) => {
        const response = await api.post('/leadership/', data);
        return response.data;
    },
    updateLeadership: async (id, data) => {
        const response = await api.put(`/leadership/${id}/`, data);
        return response.data;
    },
    deleteLeadership: async (id) => {
        await api.delete(`/leadership/${id}/`);
    },
    createLeadershipWithImage: async (formData) => {
        const response = await api.post('/leadership/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    updateLeadershipWithImage: async (id, formData) => {
        const response = await api.put(`/leadership/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Church Info
    getChurchInfo: async () => {
        const cacheKey = 'church_info';
        const cached = apiCache.get(cacheKey);

        if (cached && !cached.isStale) {
            return cached.data;
        }

        const response = await api.get('/church-info/');
        apiCache.set(cacheKey, response.data, 3600000); // Cache for 1 hour (rarely changes)
        return response.data;
    },
    updateChurchInfo: async (id, data) => {
        const response = await api.put(`/church-info/${id}/`, data);
        return response.data;
    },

    // Home Features
    getHomeFeatures: async () => {
        const response = await api.get('/home-features/');
        return response.data;
    },
    createHomeFeature: async (data) => {
        const response = await api.post('/home-features/', data);
        return response.data;
    },
    updateHomeFeature: async (id, data) => {
        const response = await api.put(`/home-features/${id}/`, data);
        return response.data;
    },
    deleteHomeFeature: async (id) => {
        await api.delete(`/home-features/${id}/`);
    },

    // Analytics
    getAnalytics: async () => {
        const response = await api.get('/analytics/');
        return response.data;
    },

    // Contact
    /**
     * Submits a contact form message.
     * @param {object} data - The message data {name, email, subject, message}.
     * @returns {Promise<object>}
     */
    submitContactForm: async (data) => {
        const response = await api.post('/contact-messages/', data);
        return response.data;
    },

    /**
     * Fetches all contact form messages (Admin only).
     * @returns {Promise<Array>}
     */
    getContactMessages: async () => {
        const response = await api.get('/contact-messages/');
        // Handle pagination response structure
        return response.data.results || response.data;
    },

    /**
     * Updates a contact message (e.g., mark as read, add reply).
     * @param {number} id - The message ID.
     * @param {object} data - The data to update.
     * @returns {Promise<object>}
     */
    updateContactMessage: async (id, data) => {
        const response = await api.patch(`/contact-messages/${id}/`, data);
        return response.data;
    },

    /**
     * Deletes a contact message.
     * @param {number} id - The message ID.
     * @returns {Promise<void>}
     */
    deleteContactMessage: async (id) => {
        await api.delete(`/contact-messages/${id}/`);
    },

    // Cache Management Utilities
    /**
     * Invalidates the ministries cache to force fresh data fetch
     */
    invalidateMinistriesCache: () => {
        apiCache.invalidate('ministries_all');
    },

    /**
     * Invalidates all caches to force fresh data fetch
     */
    clearAllCache: () => {
        apiCache.clear();
    },

    /**
     * Invalidates cache by pattern
     * @param {string} pattern - Pattern to match cache keys
     */
    invalidateCacheByPattern: (pattern) => {
        const keys = Array.from(apiCache.cache.keys());
        keys.forEach(key => {
            if (key.includes(pattern)) {
                apiCache.invalidate(key);
            }
        });
    },
};
