import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { UserIcon, BookOpenIcon, TrashIcon, PlusIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { api } from '@/utils/helpers';
import { adminService } from '@/services';

/**
 * AdminDashboard - Tableau de bord administrateur
 * Gère les utilisateurs, les cours et les statistiques
 * @component
 * @returns {JSX.Element} Tableau de bord admin avec gestion utilisateurs et cours
 */
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totals: { totalUsers: 0, totalCourses: 0 }, avgCompletion: 0, usersByRole: [], coursesByBranch: [] });
  const [newCourse, setNewCourse] = useState({ title: '', branch: '', youtubeUrl: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
  const [currentUserPage, setCurrentUserPage] = useState(0);
  const [currentCoursePage, setCurrentCoursePage] = useState(0);
  const [usersPerPage] = useState(5);
  const [coursesPerPage] = useState(5);
  const navigate = useNavigate();

  /**
   * Charge les données administrateur au montage
   */
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const profileRes = await adminService.getUserProfile();
        if (profileRes.user.role !== 'admin') {
          toast.error('Accès refusé : Vous n\'êtes pas admin');
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }
        setUserRole(profileRes.user.role);

        const [usersRes, coursesRes, statsRes] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getAllCourses(),
          adminService.getStats()
        ]);
        setUsers(usersRes.users);
        setCourses(coursesRes.courses);
        setStats(statsRes);
      } catch (error) {
        console.error('Erreur chargement admin:', error);
        toast.error(error.response?.data?.error || 'Erreur chargement admin');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  /**
   * Filtre les utilisateurs en fonction de la recherche
   */
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.role.toLowerCase().includes(searchUser.toLowerCase())
    );
  }, [users, searchUser]);

  /**
   * Filtre les cours en fonction de la recherche
   */
  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.title.toLowerCase().includes(searchCourse.toLowerCase()) ||
      course.branch.toLowerCase().includes(searchCourse.toLowerCase()) ||
      course.description.toLowerCase().includes(searchCourse.toLowerCase())
    );
  }, [courses, searchCourse]);

  const offsetUser = currentUserPage * usersPerPage;
  const currentUsers = filteredUsers.slice(offsetUser, offsetUser + usersPerPage);
  const pageCountUser = Math.ceil(filteredUsers.length / usersPerPage);

  const offsetCourse = currentCoursePage * coursesPerPage;
  const currentCourses = filteredCourses.slice(offsetCourse, offsetCourse + coursesPerPage);
  const pageCountCourse = Math.ceil(filteredCourses.length / coursesPerPage);

  /**
   * Ajoute un nouveau cours
   */
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await adminService.createCourse(newCourse);
      const updated = await adminService.getAllCourses();
      setCourses(updated.courses);
      setNewCourse({ title: '', branch: '', youtubeUrl: '', description: '' });
      toast.success('Cours ajouté avec succès !');
    } catch (error) {
      console.error('Erreur ajout cours:', error);
      toast.error(error.response?.data?.error || 'Erreur ajout cours');
    }
  };

  /**
   * Supprime un utilisateur spécifique
   */
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await adminService.deleteUser(userId);
      const updated = await adminService.getAllUsers();
      setUsers(updated.users);
      toast.success('User supprimé !');
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      toast.error(error.response?.data?.error || 'Erreur suppression');
    }
  };

  /**
   * Supprime tous les utilisateurs
   */
  const handleDeleteAllUsers = async () => {
    if (!window.confirm('Supprimer TOUS les users ? Irreversible !')) return;
    try {
      await adminService.deleteAllUsers();
      setUsers([]);
      toast.success('Tous les users supprimés !');
    } catch (error) {
      console.error('Erreur suppression utilisateurs:', error);
      toast.error(error.response?.data?.error || 'Erreur');
    }
  };

  /**
   * Supprime un cours spécifique
   */
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Supprimer ce cours ?')) return;
    try {
      await adminService.deleteCourse(courseId);
      const updated = await adminService.getAllCourses();
      setCourses(updated.courses);
      toast.success('Cours supprimé !');
    } catch (error) {
      console.error('Erreur suppression cours:', error);
      toast.error(error.response?.data?.error || 'Erreur suppression');
    }
  };

  /**
   * Supprime tous les cours
   */
  const handleDeleteAllCourses = async () => {
    if (!window.confirm('Supprimer TOUS les cours ? Irreversible !')) return;
    try {
      await adminService.deleteAllCourses();
      setCourses([]);
      toast.success('Tous les cours supprimés !');
    } catch (error) {
      console.error('Erreur suppression cours:', error);
      toast.error(error.response?.data?.error || 'Erreur');
    }
  };

  const handleUserPageChange = ({ selected }) => setCurrentUserPage(selected);
  const handleCoursePageChange = ({ selected }) => setCurrentCoursePage(selected);

  if (loading) return <div className="p-4 flex justify-center items-center min-h-screen"><ChartBarIcon className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" /> Chargement...</div>;
  if (userRole !== 'admin') return <div className="p-4 text-center text-red-500 dark:text-red-400 min-h-screen flex items-center">Accès refusé</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">📊 Dashboard Admin</h1>

      {/* Section Users */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">👥 Gestion Users ({filteredUsers.length})</h2>
          <button onClick={handleDeleteAllUsers} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" disabled={filteredUsers.length === 0}>
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Supprimer Tous
          </button>
        </div>
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="🔍 Rechercher users (nom, email, rôle)..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
          </div>
        </div>
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-full">Aucun user trouvé (essayez une recherche)</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUsers.map(user => (
                <div key={user._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200">
                  <UserIcon className="h-6 w-6 text-blue-500 dark:text-blue-400 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.name} ({user.role})</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                  <button onClick={() => handleDeleteUser(user._id)} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 transition-colors duration-200" disabled={!user._id}>
                    <TrashIcon className="h-4 w-4 inline mr-1" /> Supprimer
                  </button>
                </div>
              ))}
            </div>
            {pageCountUser > 1 && (
              <ReactPaginate
                previousLabel={'Précédent'}
                nextLabel={'Suivant'}
                breakLabel={'...'}
                pageCount={pageCountUser}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handleUserPageChange}
                className="flex justify-center mt-4 space-x-2 text-sm"
              />
            )}
          </>
        )}
      </section>

      {/* Section Cours */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">📚 Gestion Cours ({filteredCourses.length})</h2>
          <button onClick={handleDeleteAllCourses} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" disabled={filteredCourses.length === 0}>
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Supprimer Tous
          </button>
        </div>
        <form onSubmit={handleAddCourse} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">✨ Ajouter un Cours</h3>
          <input type="text" placeholder="Titre" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="text" placeholder="Branche (ex. Web)" value={newCourse.branch} onChange={(e) => setNewCourse({...newCourse, branch: e.target.value})} className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="url" placeholder="URL YouTube" value={newCourse.youtubeUrl} onChange={(e) => setNewCourse({...newCourse, youtubeUrl: e.target.value})} className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <textarea placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center transition-colors duration-200">
            <PlusIcon className="h-5 w-5 mr-2" /> Ajouter
          </button>
        </form>
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="🔍 Rechercher cours (titre, branche, description)..."
              value={searchCourse}
              onChange={(e) => setSearchCourse(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
          </div>
        </div>
        {filteredCourses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-full">Aucun cours trouvé (essayez une recherche)</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCourses.map(course => (
                <div key={course._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200">
                  <BookOpenIcon className="h-6 w-6 text-purple-500 dark:text-purple-400 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{course.branch} - {course.description}</p>
                  <button onClick={() => handleDeleteCourse(course._id)} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 transition-colors duration-200" disabled={!course._id}>
                    <TrashIcon className="h-4 w-4 inline mr-1" /> Supprimer
                  </button>
                </div>
              ))}
            </div>
            {pageCountCourse > 1 && (
              <ReactPaginate
                previousLabel={'Précédent'}
                nextLabel={'Suivant'}
                breakLabel={'...'}
                pageCount={pageCountCourse}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handleCoursePageChange}
                className="flex justify-center mt-4 space-x-2 text-sm"
              />
            )}
          </>
        )}
      </section>

      {/* Section Analytics */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">📊 Analytics Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-blue-600 dark:text-blue-300">👥 Total Users</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totals?.totalUsers || 0}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center border border-green-200 dark:border-green-700 hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-green-600 dark:text-green-300">📚 Total Cours</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totals?.totalCourses || 0}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center border border-purple-200 dark:border-purple-700 hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-purple-600 dark:text-purple-300">📈 Completion</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgCompletion?.toFixed(1) || 0}%</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg text-center border border-orange-200 dark:border-orange-700 hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-orange-600 dark:text-orange-300">⭐ Satisfaction</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">4.5/5</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
