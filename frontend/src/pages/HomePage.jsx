import { useEffect } from 'react';
import Home from '@/components/Home';

/**
 * Page d'accueil
 */
export default function HomePage() {
  useEffect(() => {
    document.title = 'Accueil - IT Learning Platform';
  }, []);

  return <Home />;
}
