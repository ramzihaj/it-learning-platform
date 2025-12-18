import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserIcon, ChartBarIcon, BookOpenIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { getBranchImage } from '@/assets/images';
import { api } from '@/utils/helpers';
import { BRANCH_STYLES } from '@/utils/branchStyles';

/**
 * Composant Dashboard - Affiche les statistiques et progrès de l'utilisateur
 * Affiche les cours complétés, le score et les branches recommandées
 * 
 * @component
 * @param {string} searchQuery - Terme de recherche pour filtrer les branches
 * @returns {JSX.Element} Le composant tableau de bord
 */
function Dashboard({ searchQuery = '' }) {
  const [userStats, setUserStats] = useState({
    name: '',
    selectedBranch: '',
    completedCourses: 0,
    totalCourses: 0,
    quizScore: 0
  });
  const [branches, setBranches] = useState([]);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Charger les données du dashboard au montage du composant
   */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setMessage('Veuillez vous connecter');
          setTimeout(() => navigate('/login'), 1000);
          return;
        }

        const userId = localStorage.getItem('userId');
        const selectedBranch = localStorage.getItem('selectedBranch') || 'Web';

        // Effectuer les requêtes en parallèle
        const [profileRes, progressRes, coursesRes, branchesRes] = await Promise.all([
          axios.get(`${api.baseURL}/api/profile`, { headers: api.getAuthHeader() }),
          axios.get(`${api.baseURL}/api/progress/${userId}`, { headers: api.getAuthHeader() }),
          axios.get(`${api.baseURL}/api/courses/${selectedBranch}`, { headers: api.getAuthHeader() }),
          axios.get(`${api.baseURL}/api/branches`, { headers: api.getAuthHeader() }),
        ]);

        const completedCount = progressRes.data.filter(p => p.completed).length;
        const randomQuizScore = Math.round(Math.random() * 100);

        setUserStats({
          name: profileRes.data.user.name,
          selectedBranch,
          completedCourses: completedCount,
          totalCourses: coursesRes.data.length,
          quizScore: randomQuizScore,
        });

        setUserRole(profileRes.data.user.role);

        // Filtrer les branches selon la recherche
        const filtered = branchesRes.data.filter(b =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setBranches(filtered);
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Erreur lors du chargement du dashboard';
        setMessage(errorMsg);
        console.error('Erreur dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate, searchQuery]);

  /**
   * Données pour le graphique de progrès
   */
  const chartData = [
    { branche: 'Web', completed: userStats.completedCourses },
    { branche: 'IA', completed: 3 },
    { branche: 'DevOps', completed: 2 },
    { branche: 'Cybersecurity', completed: 1 },
    { branche: 'Data Science', completed: 0 },
  ];

  /**
   * Calculer le pourcentage de progression
   */
  const progressPercentage = userStats.totalCourses > 0
    ? ((userStats.completedCourses / userStats.totalCourses) * 100).toFixed(1)
    : 0;

  /**
   * Obtenir les styles pour une branche
   * @param {string} branchName - Nom de la branche
   * @returns {Object} Objet contenant les styles
   */
  const getBranchData = (branchName) => {
    const normalizedName = branchName?.toLowerCase().trim() || 'web';
    return BRANCH_STYLES[normalizedName] || BRANCH_STYLES.default;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Titre et salutation */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Dashboard
      </h1>
      {userStats.name && (
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Bienvenue, <strong>{userStats.name}</strong> ! 👋
        </p>
      )}

      {/* Message d'état */}
      {message && (
        <p className={`mb-6 p-4 rounded-lg font-medium ${
          message.includes('Erreur')
            ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
        }`}>
          {message}
        </p>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Branche sélectionnée */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 rounded-xl shadow-md border border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <UserIcon className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Branche Sélectionnée
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
            {userStats.selectedBranch || '—'}
          </p>
        </div>

        {/* Cours complétés */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 rounded-xl shadow-md border border-green-200 dark:border-green-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <ChartBarIcon className="h-8 w-8 text-green-500 dark:text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Cours Complétés
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-300">
            {userStats.completedCourses}/{userStats.totalCourses}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {progressPercentage}% complété
          </p>
        </div>

        {/* Score moyen */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 rounded-xl shadow-md border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <BookOpenIcon className="h-8 w-8 text-purple-500 dark:text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Score Quiz Moyen
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">
            {userStats.quizScore}%
          </p>
        </div>
      </div>

      {/* Lien Dashboard Admin */}
      {userRole === 'admin' && (
        <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg">
          <Link
            to="/admin"
            className="text-yellow-800 dark:text-yellow-200 font-semibold hover:underline inline-flex items-center gap-2"
          >
            <ShieldCheckIcon className="h-5 w-5" />
            Accéder au Dashboard Admin
          </Link>
        </div>
      )}

      {/* Graphique de progrès */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 p-6 rounded-xl shadow-md border border-indigo-200 dark:border-indigo-700 mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Progrès par Branche
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="branche" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar
              dataKey="completed"
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
              name="Cours Complétés"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Branches recommandées */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🎓 Branches Recommandées
          {searchQuery && <span className="text-gray-600 dark:text-gray-400 font-normal"> pour "{searchQuery}"</span>}
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-3">Chargement...</p>
          </div>
        ) : branches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map(branch => {
              const styles = getBranchData(branch.name);
              const branchImage = getBranchImage(branch.name);

              return (
                <div
                  key={branch._id}
                  className={`relative overflow-hidden bg-gradient-to-br ${styles.bgClasses} rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border ${styles.borderClasses} group`}
                  onClick={() => navigate('/branches')}
                >
                  {/* Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={branchImage}
                      alt={branch.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${styles.overlayClasses} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6 text-center">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {branch.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      {branch.description}
                    </p>
                    <p className={`text-xs font-semibold ${styles.textClasses}`}>
                      +4 nouveaux cours
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Aucun résultat trouvé
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Essayez un autre terme de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
