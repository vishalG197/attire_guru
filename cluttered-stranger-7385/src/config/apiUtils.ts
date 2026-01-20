/**
 * API Utility Module
 * Provides helper functions for making API requests with configured endpoints
 */

import axios from 'axios';
import { API_ENDPOINTS, logApiCall, logApiError, logApiResponse } from './api';

/**
 * Create axios instance with configured API URL
 */
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.USERS.replace('/users', ''),
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
});

/**
 * User API calls
 */
export const userAPI = {
  /**
   * Fetch all users
   * @returns Promise with user data
   */
  fetchAll: async () => {
    try {
      logApiCall('GET', API_ENDPOINTS.USERS);
      const response = await apiClient.get('/users');
      logApiResponse(API_ENDPOINTS.USERS, response.data);
      return response.data;
    } catch (error) {
      logApiError(API_ENDPOINTS.USERS, error);
      throw error;
    }
  },

  /**
   * Create a new user (signup)
   * @param userData - User information
   * @returns Promise with created user data
   */
  create: async (userData: any) => {
    try {
      logApiCall('POST', API_ENDPOINTS.SIGNUP, userData);
      const response = await apiClient.post('/users', userData);
      logApiResponse(API_ENDPOINTS.SIGNUP, response.data);
      return response.data;
    } catch (error) {
      logApiError(API_ENDPOINTS.SIGNUP, error);
      throw error;
    }
  },

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   * @returns Promise with user data if found
   */
  login: async (email: string, password: string) => {
    try {
      logApiCall('GET', API_ENDPOINTS.LOGIN);
      const response = await apiClient.get('/users');
      const user = response.data.find(
        (u: any) => u.email === email && u.password === password
      );
      logApiResponse(API_ENDPOINTS.LOGIN, user);
      return user;
    } catch (error) {
      logApiError(API_ENDPOINTS.LOGIN, error);
      throw error;
    }
  },
};

/**
 * Product API calls
 */
export const productAPI = {
  /**
   * Fetch all products
   * @returns Promise with products data
   */
  fetchAll: async () => {
    try {
      logApiCall('GET', API_ENDPOINTS.PRODUCTS);
      const response = await apiClient.get('/products');
      logApiResponse(API_ENDPOINTS.PRODUCTS, response.data);
      return response.data;
    } catch (error) {
      logApiError(API_ENDPOINTS.PRODUCTS, error);
      throw error;
    }
  },

  /**
   * Fetch single product by ID
   * @param id - Product ID
   * @returns Promise with product data
   */
  fetchById: async (id: string) => {
    try {
      const endpoint = API_ENDPOINTS.PRODUCT_DETAIL(id);
      logApiCall('GET', endpoint);
      const response = await apiClient.get(`/products/${id}`);
      logApiResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      logApiError(API_ENDPOINTS.PRODUCT_DETAIL(id), error);
      throw error;
    }
  },

  /**
   * Update product
   * @param id - Product ID
   * @param productData - Updated product data
   * @returns Promise with updated product
   */
  update: async (id: string, productData: any) => {
    try {
      const endpoint = API_ENDPOINTS.PRODUCT_DETAIL(id);
      logApiCall('PUT', endpoint, productData);
      const response = await apiClient.put(`/products/${id}`, productData);
      logApiResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      logApiError(API_ENDPOINTS.PRODUCT_DETAIL(id), error);
      throw error;
    }
  },

  /**
   * Delete product
   * @param id - Product ID
   * @returns Promise
   */
  delete: async (id: string) => {
    try {
      const endpoint = API_ENDPOINTS.PRODUCT_DETAIL(id);
      logApiCall('DELETE', endpoint);
      const response = await apiClient.delete(`/products/${id}`);
      logApiResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      logApiError(API_ENDPOINTS.PRODUCT_DETAIL(id), error);
      throw error;
    }
  },
};

/**
 * Order API calls
 */
export const orderAPI = {
  /**
   * Fetch all orders
   * @returns Promise with orders data
   */
  fetchAll: async () => {
    try {
      logApiCall('GET', API_ENDPOINTS.ORDERS);
      const response = await apiClient.get('/orders');
      logApiResponse(API_ENDPOINTS.ORDERS, response.data);
      return response.data;
    } catch (error) {
      logApiError(API_ENDPOINTS.ORDERS, error);
      throw error;
    }
  },

  /**
   * Create new order
   * @param orderData - Order information
   * @returns Promise with created order
   */
  create: async (orderData: any) => {
    try {
      logApiCall('POST', API_ENDPOINTS.ORDERS, orderData);
      const response = await apiClient.post('/orders', orderData);
      logApiResponse(API_ENDPOINTS.ORDERS, response.data);
      return response.data;
    } catch (error) {
      logApiError(API_ENDPOINTS.ORDERS, error);
      throw error;
    }
  },

  /**
   * Fetch single order by ID
   * @param id - Order ID
   * @returns Promise with order data
   */
  fetchById: async (id: string) => {
    try {
      const endpoint = API_ENDPOINTS.ORDER_DETAIL(id);
      logApiCall('GET', endpoint);
      const response = await apiClient.get(`/orders/${id}`);
      logApiResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      logApiError(API_ENDPOINTS.ORDER_DETAIL(id), error);
      throw error;
    }
  },

  /**
   * Update order
   * @param id - Order ID
   * @param orderData - Updated order data
   * @returns Promise with updated order
   */
  update: async (id: string, orderData: any) => {
    try {
      const endpoint = API_ENDPOINTS.ORDER_DETAIL(id);
      logApiCall('PUT', endpoint, orderData);
      const response = await apiClient.put(`/orders/${id}`, orderData);
      logApiResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      logApiError(API_ENDPOINTS.ORDER_DETAIL(id), error);
      throw error;
    }
  },
};

export default {
  userAPI,
  productAPI,
  orderAPI,
};
