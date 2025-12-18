import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Page 404 - Page non trouvée
 */
export default function NotFoundPage() {
  useEffect(() => {
    document.title = '404 - Page non trouvée';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page non trouvée</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
