/**
 * URL Utility Functions
 * 
 * This module provides URL manipulation functions for video embedding.
 * Handles conversion of various video URL formats to standardized embed URLs.
 * 
 * @module utils/urlUtils
 */

/**
 * Converts various video links and embed codes into clean embed URLs.
 * 
 * Supports:
 * - Full `<iframe>` tags (extracts src attribute)
 * - YouTube watch links (https://www.youtube.com/watch?v=VIDEO_ID)
 * - YouTube short links (https://youtu.be/VIDEO_ID)
 * - Direct embed URLs
 * - URLs starting with 'www.' (adds https://)
 * 
 * @param {string} url - The URL or iframe code to convert
 * @returns {string} Standardized embed URL or empty string if invalid
 * 
 * @example
 * convertToEmbedUrl('<iframe src="https://youtube.com/embed/abc123"></iframe>')
 * // Returns: 'https://youtube.com/embed/abc123'
 * 
 * @example
 * convertToEmbedUrl('https://www.youtube.com/watch?v=abc123')
 * // Returns: 'https://www.youtube.com/embed/abc123'
 */
export const convertToEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return '';

    let cleanUrl = url.trim();

    // 1. If it's a full iframe tag, extract the src attribute
    if (cleanUrl.includes('<iframe')) {
        const match = cleanUrl.match(/src=["']([^"']+)["']/);
        if (match && match[1]) {
            cleanUrl = match[1];
        }
    }

    // 2. Handle YouTube watch links (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
    if (cleanUrl.includes('youtube.com/watch?v=')) {
        try {
            const urlObj = new URL(cleanUrl);
            const videoId = urlObj.searchParams.get('v');
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        } catch (e) {
            // Invalid URL format - return original
            return cleanUrl;
        }
    }

    // 3. Handle YouTube short links (e.g., https://youtu.be/VIDEO_ID)
    if (cleanUrl.includes('youtu.be/')) {
        const parts = cleanUrl.split('/');
        const lastPart = parts[parts.length - 1];
        const videoId = lastPart.split('?')[0];
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    }

    // 4. Ensure URL starts with https (if it's not a relative path)
    if (cleanUrl.startsWith('www.')) {
        cleanUrl = 'https://' + cleanUrl;
    }

    return cleanUrl;
};
