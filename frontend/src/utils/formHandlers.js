/**
 * Form Handler Utilities
 * 
 * This module provides helper functions for form submissions across the application.
 * Centralizes form handling logic and API interactions.
 * 
 * Note: This appears to be legacy code. The main API service (`services/api.js`) 
 * is used for most form submissions in the application.
 * 
 * @module utils/formHandlers
 */

import axios from 'axios';

/**
 * Generic form submission handler.
 * 
 * @param {Object} formData - The form data to submit
 * @param {string} type - The endpoint type (e.g., 'newsletter', 'contact')
 * @returns {Promise<{success: boolean, data?: any, error?: string}>} Submission result
 * 
 * @private
 * @deprecated Consider using methods from `services/api.js` instead
 */
export const submitForm = async (formData, type) => {
  try {
    // In production, use the actual API endpoint
    const endpoint = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

    const response = await axios.post(`${endpoint}/${type}`, formData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    // Return error object instead of throwing
    return {
      success: false,
      error: error.message || `Failed to submit ${type}. Please try again.`
    };
  }
};

/**
 * Subscribes an email to the newsletter.
 * @param {string} email - Email address to subscribe
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const subscribeToNewsletter = async (email) => {
  return submitForm({ email }, 'newsletter');
};

/**
 * Submits a prayer request.
 * @param {Object} prayerData - Prayer request data (name, email, request text)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const submitPrayerRequest = async (prayerData) => {
  return submitForm(prayerData, 'prayer-requests');
};

/**
 * Submits a contact form.
 * @param {Object} contactData - Contact form data (name, email, subject, message)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const submitContactForm = async (contactData) => {
  return submitForm(contactData, 'contact');
};

/**
 * Processes a donation/giving transaction.
 * @param {Object} donationData - Donation data (amount, method, etc.)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const processDonation = async (donationData) => {
  return submitForm(donationData, 'donations');
};

/**
 * Registers a user for an event.
 * @param {Object} eventData - Event registration data (name, email, event ID)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const registerForEvent = async (eventData) => {
  return submitForm(eventData, 'event-registration');
};

/**
 * Sets a reminder for live stream services.
 * @param {Object} reminderData - Reminder data (email, service time)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const setStreamReminder = async (reminderData) => {
  return submitForm(reminderData, 'stream-reminders');
};

/**
 * Signs up a user for a ministry.
 * @param {Object} ministryData - Ministry signup data (name, email, ministry ID)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const signUpForMinistry = async (ministryData) => {
  return submitForm(ministryData, 'ministry-signup');
};

/**
 * Saves user preferences.
 * @param {Object} preferences - User preference settings
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const saveUserPreferences = async (preferences) => {
  return submitForm(preferences, 'user-preferences');
};
