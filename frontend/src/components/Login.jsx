import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId); // Store userId
      setMessage('Connexion réussie !');
      setTimeout(() => navigate('/dashboard'), 1000); // Redirect vers /dashboard
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur lors de la connexion');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Connexion</h2>
            <p className="text-gray-600 dark:text-gray-300">Accédez à votre compte IT Learn Pro</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                placeholder="votre@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-400 dark:hover:to-purple-400 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Se connecter
            </button>
          </form>
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${message.includes('réussie') ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
              {message}
            </div>
          )}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Pas encore de compte ? 
              <a href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline ml-1 font-semibold">
                Créer un compte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;