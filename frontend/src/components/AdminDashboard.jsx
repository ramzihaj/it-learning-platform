import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { UserIcon, BookOpenIcon, TrashIcon, PlusIcon, ExclamationTriangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', branch: '', youtubeUrl: '', description: '' });
  const [message, setMessage] = useState('');
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

        const [usersRes, coursesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/admin/courses', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersRes.data.users);
        setCourses(coursesRes.data.courses);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Erreur chargement admin');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  // Filtrage Recherche
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

  // Pagination
  const offsetUser = currentUserPage * usersPerPage;
  const currentUsers = filteredUsers.slice(offsetUser, offsetUser + usersPerPage);
  const pageCountUser = Math.ceil(filteredUsers.length / usersPerPage);

  const offsetCourse = currentCoursePage * coursesPerPage;
  const currentCourses = filteredCourses.slice(offsetCourse, offsetCourse + coursesPerPage);
  const pageCountCourse = Math.ceil(filteredCourses.length / coursesPerPage);

  // Handlers
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

  // ✅ NOUVEAU : handleDeleteCourse (pour suppression individuelle cours)
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

  // ✅ NOUVEAU : handleDeleteAllCourses (pour suppression tous cours)
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

  if (loading) return <div className="p-4">Chargement...</div>;
  if (userRole !== 'admin') return <div className="p-4 text-red-500">Accès refusé</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard Admin</h1>

      {/* Section Users */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Gestion Users ({filteredUsers.length})</h2>
          <button onClick={handleDeleteAllUsers} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Supprimer Tous
          </button>
        </div>
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher users (nom, email, rôle)..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentUsers.map(user => (
            <div key={user._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="font-semibold">{user.name} ({user.role})</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <button onClick={() => handleDeleteUser(user._id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
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
      </section>

      {/* Section Cours */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Gestion Cours ({filteredCourses.length})</h2>
          <button onClick={handleDeleteAllCourses} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Supprimer Tous
          </button>
        </div>
        <form onSubmit={handleAddCourse} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Ajouter un Cours</h3>
          <input type="text" placeholder="Titre" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} className="w-full p-2 mb-2 border rounded" required />
          <input type="text" placeholder="Branche (ex. Web)" value={newCourse.branch} onChange={(e) => setNewCourse({...newCourse, branch: e.target.value})} className="w-full p-2 mb-2 border rounded" required />
          <input type="url" placeholder="URL YouTube" value={newCourse.youtubeUrl} onChange={(e) => setNewCourse({...newCourse, youtubeUrl: e.target.value})} className="w-full p-2 mb-2 border rounded" required />
          <textarea placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} className="w-full p-2 mb-2 border rounded" />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" /> Ajouter
          </button>
        </form>
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher cours (titre, branche, description)..."
              value={searchCourse}
              onChange={(e) => setSearchCourse(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCourses.map(course => (
            <div key={course._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-purple-500 mb-2" />
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.branch} - {course.description}</p>
              <button onClick={() => handleDeleteCourse(course._id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
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
      </section>
    </div>
  );
};

export default AdminDashboard;