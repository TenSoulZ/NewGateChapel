/**
 * Simple in-memory cache utility for API requests
 * Implements stale-while-revalidate pattern
 */

class ApiCache {
    constructor() {
        this.cache = new Map();
        this.pendingRequests = new Map();
    }

    /**
     * Generate cache key from URL and params
     */
    generateKey(url, params = {}) {
        const paramString = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `${url}?${paramString}`;
    }

    /**
     * Get cached data if available and not expired
     */
    get(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const { data, timestamp, ttl } = cached;
        const now = Date.now();

        // Return stale data if within grace period
        if (now - timestamp < ttl) {
            return { data, isStale: false };
        }

        // Return stale data but mark it as stale for revalidation
        if (now - timestamp < ttl * 2) {
            return { data, isStale: true };
        }

        // Too old, remove from cache
        this.cache.delete(key);
        return null;
    }

    /**
     * Set data in cache with TTL
     */
    set(key, data, ttl = 60000) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl,
        });
    }

    /**
     * Clear specific cache entry
     */
    invalidate(key) {
        this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Get pending request promise if exists
     */
    getPendingRequest(key) {
        return this.pendingRequests.get(key);
    }

    /**
     * Set pending request promise
     */
    setPendingRequest(key, promise) {
        this.pendingRequests.set(key);
        promise.finally(() => {
            this.pendingRequests.delete(key);
        });
    }

    /**
     * Check if request is pending
     */
    hasPendingRequest(key) {
        return this.pendingRequests.has(key);
    }
}

export const apiCache = new ApiCache();

/**
 * Cache decorator for API functions
 */
export function withCache(fn, ttl = 60000) {
    return async function (...args) {
        const key = apiCache.generateKey(fn.name, args);

        // Check cache first
        const cached = apiCache.get(key);
        if (cached && !cached.isStale) {
            return cached.data;
        }

        // Check if request is already pending (deduplication)
        if (apiCache.hasPendingRequest(key)) {
            return apiCache.getPendingRequest(key);
        }

        // Make request
        const promise = fn.apply(this, args);
        apiCache.setPendingRequest(key, promise);

        try {
            const result = await promise;
            apiCache.set(key, result, ttl);
            return result;
        } catch (error) {
            // On error, return stale data if available
            if (cached) {
                return cached.data;
            }
            throw error;
        }
    };
}

/**
 * Invalidate cache by pattern
 */
export function invalidateCachePattern(pattern) {
    const keys = Array.from(apiCache.cache.keys());
    keys.forEach(key => {
        if (key.includes(pattern)) {
            apiCache.invalidate(key);
        }
    });
}

export default apiCache;
