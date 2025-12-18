import { useState, useCallback } from 'react';

/**
 * Hook pour gérer les requêtes API avec état de chargement et erreurs
 * @param {Function} apiCall - La fonction d'appel API
 * @returns {Object} { data, loading, error, execute }
 */
export const useFetch = (apiCall) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { data, loading, error, execute };
};
