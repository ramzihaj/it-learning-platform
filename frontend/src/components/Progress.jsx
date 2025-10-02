import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, BookOpenIcon } from '@heroicons/react/24/outline'; // Corrigé : Import BookOpenIcon

function Progress() {
  const [progress, setProgress] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Veuillez vous connecter d\'abord');
          setLoading(false);
          setTimeout(() => navigate('/login'), 1000);
          return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('userId manquant dans localStorage'); // Debug
          setMessage('Utilisateur non identifié');
          setLoading(false);
          return;
        }

        console.log('Fetching progress pour userId:', userId); // Debug
        const response = await axios.get(`http://localhost:5000/api/progress/${userId}`, {
          headers: { 
            Authorization: `Bearer ${token}` // Assuré Bearer prefix
          },
        });
        console.log('Progress data:', response.data); // Debug
        setProgress(response.data || []);
        if (response.data.length === 0) {
          setMessage('Aucun progrès enregistré pour le moment. Commencez par un cours !');
        }
      } catch (error) {
        console.error('Erreur fetch progress:', error); // Debug
        if (error.response?.status === 401) {
          setMessage('Session expirée – reconnectez-vous');
          localStorage.removeItem('token'); // Clear token expiré
          localStorage.removeItem('userId');
          setTimeout(() => navigate('/login'), 1000);
        } else {
          setMessage(error.response?.data?.error || 'Erreur lors du chargement du progrès');
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
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Votre Progrès</h2>
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Erreur') || message.includes('expirée') ? 'bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300' : 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'}`}>
          {message}
        </div>
      )}
      {progress.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
          <BookOpenIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" /> {/* Corrigé : Importé maintenant */}
          <p className="text-xl text-gray-600 dark:text-gray-300">Aucun progrès enregistré.</p>
          <button onClick={() => navigate('/courses')} className="mt-4 bg-blue-500 dark:bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300">
            Commencer un cours
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progress.map((item) => (
            <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.courseId?.title || 'Titre manquant'}</h3>
                <div className={`p-2 rounded-full ${item.completed ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
                  {item.completed ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Branche : {item.courseId?.branch || 'N/A'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Statut : <span className={`font-medium ${item.completed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {item.completed ? 'Complété' : 'En cours'}
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dernière visualisation : {new Date(item.lastWatched).toLocaleDateString('fr-FR', { 
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>
              {!item.completed && (
                <button 
                  onClick={() => navigate('/courses')} 
                  className="mt-4 w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
                >
                  Continuer le cours
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