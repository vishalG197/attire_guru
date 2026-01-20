/**
 * API Configuration
 * Centralized API endpoint configuration using environment variables
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000');
const DEBUG_MODE = process.env.REACT_APP_DEBUG_MODE === 'true';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // User endpoints
  USERS: `${API_URL}/users`,
  LOGIN: `${API_URL}/users`,
  SIGNUP: `${API_URL}/users`,
  
  // Product endpoints
  PRODUCTS: `${API_URL}/products`,
  PRODUCT_DETAIL: (id: string) => `${API_URL}/products/${id}`,
  
  // Order endpoints
  ORDERS: `${API_URL}/orders`,
  ORDER_DETAIL: (id: string) => `${API_URL}/orders/${id}`,
  
  // Cart endpoints
  CART: `${API_URL}/cart`,
};

/**
 * API Configuration Object
 */
export const API_CONFIG = {
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  debugMode: DEBUG_MODE,
};

/**
 * Get API URL
 * @returns {string} The API base URL
 */
export const getApiUrl = (): string => {
  return API_URL;
};

/**
 * Log API call details (only in debug mode)
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @param {any} data - Request data
 */
export const logApiCall = (method: string, endpoint: string, data?: any): void => {
  if (DEBUG_MODE) {
    console.log(`[API] ${method.toUpperCase()} ${endpoint}`, data || '');
  }
};

/**
 * Log API response (only in debug mode)
 * @param {string} endpoint - API endpoint
 * @param {any} response - Response data
 */
export const logApiResponse = (endpoint: string, response: any): void => {
  if (DEBUG_MODE) {
    console.log(`[API RESPONSE] ${endpoint}`, response);
  }
};

/**
 * Log API error (only in debug mode)
 * @param {string} endpoint - API endpoint
 * @param {any} error - Error data
 */
export const logApiError = (endpoint: string, error: any): void => {
  if (DEBUG_MODE) {
    console.error(`[API ERROR] ${endpoint}`, error);
  }
};

export default API_ENDPOINTS;
