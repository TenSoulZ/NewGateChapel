/**
 * Resolves the full URL for an image path.
 * 
 * Logic:
 * 1. If path is falsy, return placeholder or null.
 * 2. If path is already absolute (starts with http), return as is.
 * 3. If path is relative, prepend the backend host (derived from VITE_API_BASE_URL).
 * 
 * @param {string} path - The image path from API (e.g. "/media/photos/pastor.jpg")
 * @param {string} placeholder - Optional fallback image URL
 * @returns {string} Full URL
 */
export const getImageUrl = (path, placeholder = '/placeholder-profile.svg') => { // Default placeholder if needed, or handle in component
    if (!path) return placeholder;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    // Get API base URL (e.g., http://localhost:8000/api)
    // We want the root (http://localhost:8000)
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';

    // Remove '/api' suffix if present to get the root host
    const apiRoot = apiBase.endsWith('/api')
        ? apiBase.slice(0, -4)
        : apiBase.endsWith('/api/')
            ? apiBase.slice(0, -5)
            : apiBase;

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${apiRoot}${cleanPath}`;
};
