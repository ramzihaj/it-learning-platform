import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserIcon, ChartBarIcon, BookOpenIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'; // Icons pro

function Dashboard() {
  const [userStats, setUserStats] = useState({ name: '', selectedBranch: '', completedCourses: 0, totalCourses: 0, quizScore: 0 });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Veuillez vous connecter');
          setTimeout(() => navigate('/login'), 1000);
          return;
        }

        const userId = localStorage.getItem('userId');
        const branch = localStorage.getItem('selectedBranch') || 'Web';

        // Fetch user info (simulé ; ajoutez endpoint /api/dashboard si besoin)
        const [progressRes, coursesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/progress/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:5000/api/courses/${branch}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const completed = progressRes.data.filter(p => p.completed).length;
        const quizScore = Math.round(Math.random() * 100); // Simulé ; intégrez vrai score

        setUserStats({
          name: 'Test User', // De localStorage ou API
          selectedBranch: branch,
          completedCourses: completed,
          totalCourses: coursesRes.data.length,
          quizScore,
        });
      } catch (error) {
        setMessage(error.response?.data.error || 'Erreur chargement dashboard');
      }
    };
    fetchDashboard();
  }, [navigate]);

  // Données chart modulaire (progrès par branche)
  const chartData = [
    { branche: 'Web', completed: userStats.completedCourses },
    { branche: 'IA', completed: 2 }, // Exemple
    { branche: 'DevOps', completed: 1 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard - Bienvenue, {userStats.name} !</h1>
      {message && <p className={`mb-4 p-3 rounded ${message.includes('Erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</p>}

      {/* Section Stats Modulaire (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <UserIcon className="h-8 w-8 text-blue-500 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Branche Sélectionnée</h3>
          <p className="text-2xl font-bold text-blue-600">{userStats.selectedBranch || 'Aucune'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <ChartBarIcon className="h-8 w-8 text-green-500 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Cours Complétés</h3>
          <p className="text-2xl font-bold text-green-600">{userStats.completedCourses}/{userStats.totalCourses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <BookOpenIcon className="h-8 w-8 text-purple-500 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Score Quiz Moyen</h3>
          <p className="text-2xl font-bold text-purple-600">{userStats.quizScore}%</p>
        </div>
      </div>

      {/* Section Chart Modulaire (Tremor) */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Progrès par Branche</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="branche" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Section Branches Recommandées (Modulaire, avec + branches) */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Branches Recommandées</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Web', 'IA', 'DevOps', 'Cybersecurity', 'Data Science'].map((branch) => (
            <div key={branch} className="p-4 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition">
              <ShieldCheckIcon className="h-6 w-6 text-gray-500 mb-2" />
              <h4 className="font-medium">{branch}</h4>
              <p className="text-sm text-gray-600">Nouveaux cours disponibles</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;