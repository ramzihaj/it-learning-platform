// URLs d'API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Authentification
  AUTH_LOGIN: '/api/auth/login',
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',

  // Branches
  GET_BRANCHES: '/api/branches',
  GET_BRANCH: '/api/branches/:id',

  // Cours
  GET_COURSES: '/api/courses',
  GET_COURSE: '/api/courses/:id',
  SEARCH_COURSES: '/api/courses/search',

  // Profil utilisateur
  GET_PROFILE: '/api/profile',
  UPDATE_PROFILE: '/api/profile',

  // Progression
  GET_PROGRESS: '/api/progress',
  UPDATE_PROGRESS: '/api/progress/:courseId',

  // Admin
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_COURSES: '/api/admin/courses',

  // Paiement
  CREATE_PAYMENT: '/api/payment/create',
  VERIFY_PAYMENT: '/api/payment/verify',

  // Contact
  SEND_MESSAGE: '/api/contact/send',
};

// Codes HTTP courants
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
