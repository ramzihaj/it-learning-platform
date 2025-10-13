import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  CodeBracketIcon, // Corrigé : Pour GitHub (code bracket)
  PaperAirplaneIcon, // Pour Twitter (paper airplane)
  UsersIcon // Pour LinkedIn (users network)
} from '@heroicons/react/24/outline';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-indigo-900 dark:from-gray-900 dark:to-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Colonne Logo/Quick Links */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-8 w-8" />
              <span className="text-xl font-bold">IT Learn Pro</span>
            </div>
            <p className="text-gray-300 dark:text-gray-400">Plateforme d'apprentissage IT gratuite et motivante.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 hover:scale-110">
                <PaperAirplaneIcon className="h-6 w-6" title="Twitter" />
              </a>
              <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 hover:scale-110">
                <CodeBracketIcon className="h-6 w-6" title="GitHub" />
              </a>
              <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 hover:scale-110">
                <UsersIcon className="h-6 w-6" title="LinkedIn" />
              </a>
            </div>
          </div>

          {/* Colonne Liens Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">Accueil</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">Dashboard</Link></li>
              <li><Link to="/branches" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">Branches</Link></li>
              <li><Link to="/courses" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">Cours</Link></li>
            </ul>
          </div>

          {/* Colonne Progrès et Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/progress" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">Progrès</Link></li>
              <li><a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">FAQ</a></li>
              <li><Link to="/contact" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">Contact</Link></li>
              <li><a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">À propos</a></li>
            </ul>
          </div>

          {/* Colonne Newsletter (Optionnel) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 dark:text-gray-400 mb-4">Restez motivé avec nos tips IT hebdomadaires.</p>
            <div className="flex">
              <input type="email" placeholder="Votre email" className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" />
              <button className="bg-blue-600 dark:bg-blue-700 px-4 py-2 rounded-r-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300">
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 dark:border-gray-700 pt-6 text-center text-gray-300 dark:text-gray-400">
          <p>&copy; 2025 IT Learn Pro. Tous droits réservés. | Développé avec ❤️ pour les apprenants IT.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;