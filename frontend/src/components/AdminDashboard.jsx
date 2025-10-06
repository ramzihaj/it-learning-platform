import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserIcon, BookOpenIcon, TrashIcon, PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', branch: '', youtubeUrl: '', description: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAdminData = async () => {
      try {
        // Vérifie rôle admin via profile
        const profileRes = await axios.get('http://localhost:5000/api/profile', { headers: { Authorization: `Bearer ${token}` } });
        if (profileRes.data.user.role !== 'admin') {
          setMessage('Accès refusé : Vous n\'êtes pas admin');
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }
        setUserRole(profileRes.data.user.role);

        // Fetch users et courses
        const [usersRes, coursesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/admin/courses', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersRes.data.users);
        setCourses(coursesRes.data.courses);
      } catch (error) {
        setMessage(error.response?.data.error || 'Erreur chargement admin');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/admin/courses', newCourse, { headers: { Authorization: `Bearer ${token}` } });
      setCourses([...courses, res.data.course]);
      setNewCourse({ title: '', branch: '', youtubeUrl: '', description: '' });
      setMessage('Cours ajouté !');
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur ajout cours');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.filter(u => u._id !== userId));
      setMessage('User supprimé !');
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur suppression user');
    }
  };

  const handleDeleteAllUsers = async () => {
    if (!window.confirm('Supprimer TOUS les users ? Action irréversible !')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/admin/users/all', { headers: { Authorization: `Bearer ${token}` } });
      setUsers([]);
      setMessage('Tous les users supprimés !');
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur suppression');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Supprimer ce cours ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
      setCourses(courses.filter(c => c._id !== courseId));
      setMessage('Cours supprimé !');
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur suppression cours');
    }
  };

  const handleDeleteAllCourses = async () => {
    if (!window.confirm('Supprimer TOUS les cours ? Action irréversible !')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/admin/courses/all', { headers: { Authorization: `Bearer ${token}` } });
      setCourses([]);
      setMessage('Tous les cours supprimés !');
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur suppression');
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (userRole !== 'admin') return <div className="p-4 text-red-500">{message}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard Admin</h1>
      {message && <p className={`mb-4 p-3 rounded-lg ${message.includes('supprimé') || message.includes('ajouté') ? 'bg-green-100 dark:bg-green-900 text-green-700' : 'bg-red-100 dark:bg-red-900 text-red-700'}`}>{message}</p>}

      {/* Section Users */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Gestion Users ({users.length})</h2>
        <button onClick={handleDeleteAllUsers} className="bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-red-600 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Supprimer Tous (Dangereux !)
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
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
      </section>

      {/* Section Cours */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Gestion Cours ({courses.length})</h2>
        <button onClick={handleDeleteAllCourses} className="bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-red-600 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Supprimer Tous (Dangereux !)
        </button>
        {/* Formulaire Ajout Cours */}
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
        {/* Liste Cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
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
      </section>
    </div>
  );
};

export default AdminDashboard;