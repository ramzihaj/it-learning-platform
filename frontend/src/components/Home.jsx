import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, ChartBarIcon, BookOpenIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Hero Section Motivant */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-500/30 dark:to-purple-500/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <SparklesIcon className="h-16 w-16 text-yellow-400 dark:text-yellow-300 mx-auto mb-4 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fadeInUp">
            Devenez un Expert IT en 3 Mois !
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-fadeInUp animation-delay-300">
            Plongez dans le monde du Web, IA, DevOps et plus. Apprenez avec des vidéos gratuites, quizzes intelligents et suivi de progrès. Votre carrière IT commence ici – motivé et efficace !
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-400 dark:hover:to-purple-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce"
          >
            Commencez Maintenant <ArrowRightIcon className="h-5 w-5 inline ml-2" /> {/* Changé ici */}
          </button>
        </div>
      </section>

      {/* Section Stats Motivant */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 animate-fadeInUp">Pourquoi Choisir Notre Plateforme ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <ChartBarIcon className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Progrès Personnalisé</h3>
              <p className="text-gray-600 dark:text-gray-300">Suivez vos avancées avec quizzes IA et badges motivants.</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <BookOpenIcon className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cours Gratuits</h3>
              <p className="text-gray-600 dark:text-gray-300">Vidéos YouTube premium sur 5+ branches IT.</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <ShieldCheckIcon className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">IA Intégrée</h3>
              <p className="text-gray-600 dark:text-gray-300">Résumés et quizzes auto-générés pour booster l'apprentissage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Final Motivant */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Prêt à Transformer Votre Carrière IT ?</h2>
          <p className="text-xl mb-8 opacity-90">Rejoignez des milliers d'étudiants motivés. Gratuit, accessible, et efficace.</p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 dark:bg-gray-200 dark:text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-300 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Commencez Maintenant {/* Changé ici aussi pour cohérence */}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;