import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserIcon, ChartBarIcon, BookOpenIcon, ShieldCheckIcon, AcademicCapIcon, CodeBracketIcon, SparklesIcon, CogIcon } from '@heroicons/react/24/outline'; // Icons pro + thématiques

function Dashboard() {
  const [userStats, setUserStats] = useState({ name: '', selectedBranch: '', completedCourses: 0, totalCourses: 0, quizScore: 0 });
  const [branches, setBranches] = useState([]); // Pour recommandations
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

        const [progressRes, coursesRes, branchesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/progress/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:5000/api/courses/${branch}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/branches', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const completed = progressRes.data.filter(p => p.completed).length;
        const quizScore = Math.round(Math.random() * 100); // Simulé ; intégrez vrai score

        setUserStats({
          name: 'Test User', // Récupérez de login
          selectedBranch: branch,
          completedCourses: completed,
          totalCourses: coursesRes.data.length,
          quizScore,
        });
        setBranches(branchesRes.data);
      } catch (error) {
        setMessage(error.response?.data.error || 'Erreur chargement dashboard');
      }
    };
    fetchDashboard();
  }, [navigate]);

  // Données chart modulaire
  const chartData = [
    { branche: 'Web', completed: userStats.completedCourses },
    { branche: 'IA', completed: 3 },
    { branche: 'DevOps', completed: 2 },
    { branche: 'Cybersecurity', completed: 1 },
    { branche: 'Data Science', completed: 0 },
  ];

  const progressPercentage = userStats.totalCourses > 0 ? ((userStats.completedCourses / userStats.totalCourses) * 100).toFixed(1) : 0;

  // Données par branche pour images/icons (attractifs)
  const getBranchData = (name) => {
    switch (name.toLowerCase()) {
      case 'web':
        return { 
          icon: <CodeBracketIcon className="h-12 w-12" />, 
          color: 'blue', 
          image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' // Laptop coding
        };
      case 'ia':
        return { 
          icon: <SparklesIcon className="h-12 w-12" />, 
          color: 'purple', 
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' // AI brain
        };
      case 'devops':
        return { 
          icon: <CogIcon className="h-12 w-12" />, 
          color: 'green', 
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' // Gears DevOps
        };
      case 'cybersecurity':
        return { 
          icon: <ShieldCheckIcon className="h-12 w-12" />, 
          color: 'red', 
          image: 'https://www.itweb.co.za/static/pictures/2024/06/cyber-security-network-Jun-2024.jpg' // Lock security
        };
      case 'data science':
        return { 
          icon: <ChartBarIcon className="h-12 w-12" />, 
          color: 'indigo', 
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' // Data charts
        };
      default:
        return { 
          icon: <AcademicCapIcon className="h-12 w-12" />, 
          color: 'gray', 
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' // Default
        };
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg"> {/* Plus large pour grid */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard - Bienvenue, {userStats.name} !</h1>
      {message && <p className={`mb-4 p-3 rounded-lg ${message.includes('Erreur') ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'}`}>{message}</p>}

      {/* Section Stats Modulaire (Cards Attractives) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 rounded-xl shadow-md border border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <UserIcon className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Branche Sélectionnée</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{userStats.selectedBranch || 'Aucune'}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 rounded-xl shadow-md border border-green-200 dark:border-green-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <ChartBarIcon className="h-8 w-8 text-green-500 dark:text-green-400 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cours Complétés</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">{userStats.completedCourses}/{userStats.totalCourses}</p>
          <p className="text-sm text-green-500 dark:text-green-400">{progressPercentage}%</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 rounded-xl shadow-md border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <BookOpenIcon className="h-8 w-8 text-purple-500 dark:text-purple-400 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Score Quiz Moyen</h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">{userStats.quizScore}%</p>
        </div>
      </div>

      {/* Section Chart Modulaire (Recharts Attractif) */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 p-6 rounded-xl shadow-md border border-indigo-200 dark:border-indigo-700 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Progrès par Branche</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} className="rounded-lg">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0 dark:#374151" />
            <XAxis dataKey="branche" stroke="#6b7280 dark:#d1d5db" />
            <YAxis stroke="#6b7280 dark:#d1d5db" />
            <Tooltip contentStyle={{ backgroundColor: 'white dark:gray-800', border: '1px solid #e5e7eb dark:#374151' }} />
            <Legend />
            <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Section Branches Recommandées (Cards avec Images Attractives) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Branches Recommandées</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map(branch => {
            const { icon, color, image } = getBranchData(branch.name);
            return (
              <div
                key={branch._id}
                className={`relative overflow-hidden bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-${color}-900 dark:to-${color}-800 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-${color}-200 dark:border-${color}-700 group`}
                onClick={() => navigate('/branches')}
              >
                {/* Image Attractif en Haut */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={image} 
                    alt={branch.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-${color}-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    {icon}
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{branch.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{branch.description}</p>
                  <p className="text-xs text-${color}-600 dark:text-${color}-400 mt-2">+4 nouveaux cours</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;