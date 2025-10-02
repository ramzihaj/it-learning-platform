import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        name,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur lors de l’inscription');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white p-2 rounded hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-400 dark:hover:to-purple-400 transition-all duration-300">
          Commencez Maintenant {/* Changé ici */}
        </button>
      </form>
      {message && <p className={`mt-4 ${message.includes('succès') ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{message}</p>}
    </div>
  );
}

export default Signup;