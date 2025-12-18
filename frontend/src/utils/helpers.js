import { API_BASE_URL } from '@/constants';

/**
 * Configuration centralisée de axios
 */
export const api = {
  baseURL: API_BASE_URL,
  
  /**
   * Obtenir le header d'autorisation avec le token JWT
   */
  getAuthHeader: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  /**
   * URL complète de l'API
   */
  getFullUrl: (endpoint) => `${API_BASE_URL}${endpoint}`,
};

/**
 * Validation de l'authentification
 */
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Extraire l'ID YouTube d'une URL
 */
export const getYouTubeId = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
