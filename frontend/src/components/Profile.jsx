import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserIcon, PencilIcon } from '@heroicons/react/24/outline'; // Corrigé : Ajout PencilIcon

function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [userStats, setUserStats] = useState({ completedCourses: 0, selectedBranch: '' }); // Corrigé : Ajout état userStats
  const [progress, setProgress] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:5000/api/profile`, { headers: { Authorization: `Bearer ${token}` } });
        setUser(response.data.user);
        setFormData({ name: response.data.user.name, email: response.data.user.email });
        setProgress(response.data.progress);
        setUserStats({ 
          completedCourses: response.data.stats.completedCourses, 
          selectedBranch: response.data.user.selectedBranch 
        }); // Corrigé : Fetch stats depuis API
      } catch (error) {
        setMessage(error.response?.data.error || 'Erreur chargement profil');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/profile', formData, { headers: { Authorization: `Bearer ${token}` } });
      setUser(response.data.user);
      setEditing(false);
      setMessage('Profil mis à jour !');
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur mise à jour');
    }
  };

  const handleCertificate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/profile/certificate', {}, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'certificat-it-learn.pdf';
      link.click();
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur génération certificat');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Votre Profil</h1>
      {message && <p className={`mb-4 p-3 rounded-lg ${message.includes('mis à jour') ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informations Personnelles</h3>
          {editing ? (
            <form onSubmit={handleUpdate}>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom" className="w-full p-2 mb-2 border rounded dark:bg-gray-600 dark:text-white" required />
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="w-full p-2 mb-4 border rounded dark:bg-gray-600 dark:text-white" required />
              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Sauvegarder</button>
                <button type="button" onClick={() => setEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Annuler</button>
              </div>
            </form>
          ) : (
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-2"><UserIcon className="h-5 w-5 inline mr-2" /> {user.name}</p>
              <p className="text-lg text-gray-700 dark:text-gray-300"><PencilIcon className="h-5 w-5 inline mr-2 text-blue-500" /> {user.email}</p> {/* Corrigé : PencilIcon maintenant importé */}
              <button onClick={() => setEditing(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Modifier Profil</button>
            </div>
          )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Statistiques</h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">Cours Complétés : {userStats.completedCourses}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">Branche : {userStats.selectedBranch}</p>
          <button onClick={handleCertificate} className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Générer Certificat</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;