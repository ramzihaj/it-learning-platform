import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, PencilIcon } from '@heroicons/react/24/outline';
import { api } from '@/utils/helpers';
import { profileService } from '@/services';

/**
 * Profile - Page de profil utilisateur
 * Affiche et permet de modifier les informations de l'utilisateur
 * @component
 * @returns {JSX.Element} Profil avec stats et formulaire de modification
 */
function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [userStats, setUserStats] = useState({ completedCourses: 0, selectedBranch: '' });
  const [progress, setProgress] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Charge les données du profil au montage
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile();
        setUser(response.user);
        setFormData({ name: response.user.name, email: response.user.email });
        setProgress(response.progress);
        setUserStats({ 
          completedCourses: response.stats?.completedCourses || 0,
          selectedBranch: response.user.selectedBranch || 'Aucune'
        });
      } catch (error) {
        console.error('Erreur chargement profil:', error);
        setMessage('❌ ' + (error.response?.data?.error || 'Erreur chargement profil'));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /**
   * Met à jour le profil utilisateur
   */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await profileService.updateProfile(formData);
      setUser(response.user);
      setEditing(false);
      setMessage('✅ Profil mis à jour avec succès !');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      setMessage('❌ ' + (error.response?.data?.error || 'Erreur mise à jour'));
    }
  };

  /**
   * Génère et télécharge un certificat
   */
  const handleCertificate = async () => {
    try {
      const response = await profileService.generateCertificate();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'certificat-it-learn.pdf';
      link.click();
      setMessage('✅ Certificat téléchargé !');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur génération certificat:', error);
      setMessage('❌ ' + (error.response?.data?.error || 'Erreur génération certificat'));
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-600 dark:text-gray-300">Chargement du profil...</p>
      </div>
    );
  }

  /**
   * Section Informations Personnelles
   */
  const InfoSection = () => (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">👤 Informations Personnelles</h3>
      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder="Votre nom" 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              placeholder="Votre email" 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
              ✅ Sauvegarder
            </button>
            <button type="button" onClick={() => setEditing(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
              ❌ Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center">
            <UserIcon className="h-5 w-5 inline mr-2 text-blue-500" /> <span className="font-medium">{user.name}</span>
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center">
            <PencilIcon className="h-5 w-5 inline mr-2 text-blue-500" /> <span className="font-medium">{user.email}</span>
          </p>
          <button onClick={() => setEditing(true)} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
            ✏️ Modifier Profil
          </button>
        </div>
      )}
    </div>
  );

  /**
   * Section Statistiques
   */
  const StatsSection = () => (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📊 Statistiques</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-gray-700 dark:text-gray-300">📚 Cours Complétés :</p>
          <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{userStats.completedCourses}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 dark:text-gray-300">🎯 Branche Sélectionnée :</p>
          <p className="font-bold text-purple-600 dark:text-purple-400 text-lg">{userStats.selectedBranch}</p>
        </div>
        <button 
          onClick={handleCertificate} 
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
        >
          🏆 Générer Certificat
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">👤 Votre Profil</h1>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg font-medium transition-all duration-300 ${
          message.includes('succès') || message.includes('mise à jour') || message.includes('téléchargé')
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700' 
            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoSection />
        <StatsSection />
      </div>

      {/* Section Progrès */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📈 Votre Progrès</h2>
        {progress.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl text-center border border-gray-200 dark:border-gray-600">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Aucun progrès enregistré pour le moment.</p>
            <a href="/courses" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
              🚀 Commencer un cours
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progress.map(item => (
              <div key={item._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.courseId?.title || 'Cours'}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Branche: <span className="font-medium">{item.courseId?.branch || 'N/A'}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Statut: <span className={`font-bold ${item.completed ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {item.completed ? '✅ Complété' : '⏳ En cours'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
