import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { UserIcon, BookOpenIcon, TrashIcon, PlusIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, ChartBarIcon } from '@heroicons/react/24/outline';

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

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const profileRes = await axios.get('http://localhost:5000/api/profile', { headers: { Authorization: `Bearer ${token}` } });
        if (profileRes.data.user.role !== 'admin') {
          toast.error('Accès refusé : Vous n\'êtes pas admin');
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }
        setUserRole(profileRes.data.user.role);

        const [usersRes, coursesRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/admin/courses', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersRes.data.users);
        setCourses(coursesRes.data.courses);
        setStats(statsRes.data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Erreur chargement admin');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.role.toLowerCase().includes(searchUser.toLowerCase())
    );
  }, [users, searchUser]);

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

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/admin/courses', newCourse, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const updated = await axios.get('http://localhost:5000/api/admin/courses', { headers: { Authorization: `Bearer ${token}` } });
      setCourses(updated.data.courses);
      setNewCourse({ title: '', branch: '', youtubeUrl: '', description: '' });
      toast.success('Cours ajouté avec succès !');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur ajout cours');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const updated = await axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(updated.data.users);
      toast.success('User supprimé !');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur suppression');
    }
  };

  const handleDeleteAllUsers = async () => {
    if (!window.confirm('Supprimer TOUS les users ? Irreversible !')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/admin/users/all', { headers: { Authorization: `Bearer ${token}` } });
      setUsers([]);
      toast.success('Tous les users supprimés !');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Supprimer ce cours ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
      const updated = await axios.get('http://localhost:5000/api/admin/courses', { headers: { Authorization: `Bearer ${token}` } });
      setCourses(updated.data.courses);
      toast.success('Cours supprimé !');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur suppression');
    }
  };

  const handleDeleteAllCourses = async () => {
    if (!window.confirm('Supprimer TOUS les cours ? Irreversible !')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/admin/courses/all', { headers: { Authorization: `Bearer ${token}` } });
      setCourses([]);
      toast.success('Tous les cours supprimés !');
    } catch (error) {
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
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard Admin</h1>

      {/* Section Users */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestion Users ({filteredUsers.length})</h2>
          <button onClick={handleDeleteAllUsers} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={filteredUsers.length === 0}>
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Supprimer Tous
          </button>
        </div>
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher users (nom, email, rôle)..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-full">Aucun user trouvé (essayez une recherche)</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUsers.map(user => (
                <div key={user._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <UserIcon className="h-6 w-6 text-blue-500 dark:text-blue-400 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.name} ({user.role})</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                  <button onClick={() => handleDeleteUser(user._id)} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50" disabled={!user._id}>
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
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                nextClassName={'page-item'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                className="flex justify-center mt-4 space-x-2 text-sm"
              />
            )}
          </>
        )}
      </section>

      {/* Section Cours (similaire, avec dark classes) */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestion Cours ({filteredCourses.length})</h2>
          <button onClick={handleDeleteAllCourses} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={filteredCourses.length === 0}>
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Supprimer Tous
          </button>
        </div>
        <form onSubmit={handleAddCourse} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Ajouter un Cours</h3>
          <input type="text" placeholder="Titre" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" required />
          <input type="text" placeholder="Branche (ex. Web)" value={newCourse.branch} onChange={(e) => setNewCourse({...newCourse, branch: e.target.value})} className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" required />
          <input type="url" placeholder="URL YouTube" value={newCourse.youtubeUrl} onChange={(e) => setNewCourse({...newCourse, youtubeUrl: e.target.value})} className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" required />
          <textarea placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" /> Ajouter
          </button>
        </form>
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher cours (titre, branche, description)..."
              value={searchCourse}
              onChange={(e) => setSearchCourse(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        {filteredCourses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-full">Aucun cours trouvé (essayez une recherche)</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCourses.map(course => (
                <div key={course._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <BookOpenIcon className="h-6 w-6 text-purple-500 dark:text-purple-400 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{course.branch} - {course.description}</p>
                  <button onClick={() => handleDeleteCourse(course._id)} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50" disabled={!course._id}>
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
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                nextClassName={'page-item'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                className="flex justify-center mt-4 space-x-2 text-sm"
              />
            )}
          </>
        )}
      </section>

      {/* Section Analytics */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Analytics Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center border border-blue-200 dark:border-blue-700">
            <h3 className="font-semibold text-blue-600 dark:text-blue-300">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totals?.totalUsers || 0}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center border border-green-200 dark:border-green-700">
            <h3 className="font-semibold text-green-600 dark:text-green-300">Total Cours</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totals?.totalCourses || 0}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center border border-purple-200 dark:border-purple-700">
            <h3 className="font-semibold text-purple-600 dark:text-purple-300">Taux Complétion Moy.</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgCompletion || 0}%</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg text-center border border-indigo-200 dark:border-indigo-700">
            <h3 className="font-semibold text-indigo-600 dark:text-indigo-300">Users Actifs</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.usersByRole?.find(r => r._id === 'admin')?.count || 0}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Users par Rôle</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.usersByRole || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0 dark:#374151" />
                <XAxis dataKey="_id" stroke="#6b7280 dark:#d1d5db" />
                <YAxis stroke="#6b7280 dark:#d1d5db" />
                <Tooltip contentStyle={{ backgroundColor: 'white dark:gray-800', border: '1px solid #e5e7eb dark:#374151' }} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cours par Branche</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.coursesByBranch || []}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {stats.coursesByBranch?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  )) || null}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;