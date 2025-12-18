import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  CodeBracketIcon,
  PaperAirplaneIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

/**
 * Footer - Pied de page
 * Affiche les liens de navigation, les réseaux sociaux et les informations légales
 * @component
 * @returns {JSX.Element} Footer avec navigation et informations
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-800 to-indigo-900 dark:from-gray-900 dark:to-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Colonne Logo/Quick Links */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">🎓 IT Learn Pro</span>
            </div>
            <p className="text-gray-300 dark:text-gray-400">
              Plateforme d'apprentissage IT gratuite et motivante pour développer vos compétences.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#twitter" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-all duration-300 hover:scale-110" title="Twitter" aria-label="Twitter">
                <PaperAirplaneIcon className="h-6 w-6" />
              </a>
              <a href="#github" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-all duration-300 hover:scale-110" title="GitHub" aria-label="GitHub">
                <CodeBracketIcon className="h-6 w-6" />
              </a>
              <a href="#linkedin" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-all duration-300 hover:scale-110" title="LinkedIn" aria-label="LinkedIn">
                <UsersIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Colonne Liens Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">🗺️ Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 flex items-center">
                  → Accueil
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 flex items-center">
                  → Dashboard
                </Link>
              </li>
              <li>
                <Link to="/branches" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 flex items-center">
                  → Branches
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 flex items-center">
                  → Cours
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">💬 Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/progress" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 flex items-center">
                  → Votre Progrès
                </Link>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 flex items-center">
                  → FAQ
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 flex items-center">
                  → Contact
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 flex items-center">
                  → À propos
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">📧 Newsletter</h3>
            <p className="text-gray-300 dark:text-gray-400 mb-4 text-sm">
              Restez motivé avec nos tips IT hebdomadaires et les dernières actualités tech.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200" 
                aria-label="Email pour newsletter"
              />
              <button className="bg-blue-600 dark:bg-blue-700 px-4 py-2 rounded-r-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 font-semibold" aria-label="S'abonner à la newsletter">
                ✓
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-700 dark:border-gray-700 my-8"></div>

        {/* Footer Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left text-gray-300 dark:text-gray-400 text-sm">
          <div>
            <p>&copy; {currentYear} IT Learn Pro. Tous droits réservés.</p>
          </div>
          <div className="flex justify-center space-x-4">
            <a href="#privacy" className="hover:text-white transition-colors duration-300">Confidentialité</a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition-colors duration-300">Conditions</a>
            <span>•</span>
            <a href="#cookies" className="hover:text-white transition-colors duration-300">Cookies</a>
          </div>
          <div className="text-right">
            <p>Développé avec ❤️ pour les apprenants IT | v1.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
