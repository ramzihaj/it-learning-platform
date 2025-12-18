import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants';

/**
 * Service d'authentification
 */
export const authService = {
  login: (email, password) =>
    apiClient.post(API_ENDPOINTS.AUTH_LOGIN, { email, password }),

  signup: (userData) =>
    apiClient.post(API_ENDPOINTS.AUTH_SIGNUP, userData),

  logout: () =>
    apiClient.post(API_ENDPOINTS.AUTH_LOGOUT),

  refreshToken: () =>
    apiClient.post(API_ENDPOINTS.AUTH_REFRESH),
};

/**
 * Service des branches
 */
export const branchService = {
  getAllBranches: () =>
    apiClient.get(API_ENDPOINTS.GET_BRANCHES),

  getBranchById: (id) =>
    apiClient.get(API_ENDPOINTS.GET_BRANCH.replace(':id', id)),
};

/**
 * Service des cours
 */
export const courseService = {
  getAllCourses: () =>
    apiClient.get(API_ENDPOINTS.GET_COURSES),

  getCourseById: (id) =>
    apiClient.get(API_ENDPOINTS.GET_COURSE.replace(':id', id)),

  searchCourses: (query) =>
    apiClient.get(API_ENDPOINTS.SEARCH_COURSES, { params: { q: query } }),
};

/**
 * Service du profil utilisateur
 */
export const profileService = {
  getProfile: () =>
    apiClient.get(API_ENDPOINTS.GET_PROFILE),

  updateProfile: (userData) =>
    apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, userData),
};

/**
 * Service de progression
 */
export const progressService = {
  getProgress: () =>
    apiClient.get(API_ENDPOINTS.GET_PROGRESS),

  updateProgress: (courseId, data) =>
    apiClient.put(API_ENDPOINTS.UPDATE_PROGRESS.replace(':courseId', courseId), data),
};

/**
 * Service de paiement
 */
export const paymentService = {
  createPayment: (paymentData) =>
    apiClient.post(API_ENDPOINTS.CREATE_PAYMENT, paymentData),

  verifyPayment: (transactionId) =>
    apiClient.post(API_ENDPOINTS.VERIFY_PAYMENT, { transactionId }),
};

/**
 * Service de contact
 */
export const contactService = {
  sendMessage: (messageData) =>
    apiClient.post(API_ENDPOINTS.SEND_MESSAGE, messageData),
};

/**
 * Service admin
 */
export const adminService = {
  getDashboard: () =>
    apiClient.get(API_ENDPOINTS.ADMIN_DASHBOARD),

  getUsers: () =>
    apiClient.get(API_ENDPOINTS.ADMIN_USERS),

  getCourses: () =>
    apiClient.get(API_ENDPOINTS.ADMIN_COURSES),
};
