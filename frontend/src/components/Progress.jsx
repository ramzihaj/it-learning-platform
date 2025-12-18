import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { api } from '@/utils/helpers';
import { progressService } from '@/services';

/**
 * Progress - Page de progression utilisateur
 * Affiche tous les cours suivis et leur statut de complétion
 * @component
 * @returns {JSX.Element} Liste du progrès avec statuts
 */
function Progress() {
  const [progress, setProgress] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Charge le progrès de l'utilisateur au montage
   */
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('⚠️ Veuillez vous connecter d\'abord');
          setLoading(false);
          setTimeout(() => navigate('/login'), 1500);
          return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('userId manquant dans localStorage');
          setMessage('❌ Utilisateur non identifié');
          setLoading(false);
          return;
        }

        const data = await progressService.getUserProgress(userId);
        setProgress(data || []);
        if (data.length === 0) {
          setMessage('📚 Aucun progrès enregistré pour le moment. Commencez par un cours !');
        }
      } catch (error) {
        console.error('Erreur fetch progress:', error);
        if (error.response?.status === 401) {
          setMessage('⚠️ Session expirée – reconnectez-vous');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setTimeout(() => navigate('/login'), 1500);
        } else {
          setMessage('❌ ' + (error.response?.data?.error || 'Erreur lors du chargement du progrès'));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-600 dark:text-gray-300">Chargement de vos progrès...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">📊 Votre Progrès</h1>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg font-medium transition-all duration-300 border ${
          message.includes('Erreur') || message.includes('expirée') 
            ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700' 
            : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
        }`}>
          {message}
        </div>
      )}

      {progress.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-600">
          <BookOpenIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">Aucun progrès enregistré.</p>
          <button 
            onClick={() => navigate('/courses')} 
            className="inline-block bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 font-semibold"
          >
            🚀 Commencer un cours
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progress.map((item) => (
            <div 
              key={item._id} 
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                  {item.courseId?.title || 'Titre manquant'}
                </h3>
                <div className={`p-2 rounded-full ml-2 flex-shrink-0 ${
                  item.completed 
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                    : 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
                }`}>
                  {item.completed ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    <XCircleIcon className="h-5 w-5" />
                  )}
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                🎯 Branche: <span className="font-medium">{item.courseId?.branch || 'N/A'}</span>
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Statut: <span className={`font-bold ${
                  item.completed 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {item.completed ? '✅ Complété' : '⏳ En cours'}
                </span>
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                📅 Dernière visualisation: {new Date(item.lastWatched).toLocaleDateString('fr-FR', { 
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>

              {!item.completed && (
                <button 
                  onClick={() => navigate('/courses')} 
                  className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 font-semibold text-sm"
                >
                  ▶️ Continuer le cours
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Progress;
