import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

/**
 * Hook pour accéder au contexte du thème
 * @returns {Object} { isDark, toggleTheme }
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur de ThemeProvider');
  }
  return context;
};
