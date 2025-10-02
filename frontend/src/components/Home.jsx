import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, StarIcon, UserGroupIcon, AcademicCapIcon, PlayIcon, ChartBarIcon, CodeBracketIcon, CogIcon } from '@heroicons/react/24/outline'; // Corrigé : Ajout ChartBarIcon, CodeBracketIcon, CogIcon

function Home() {
  const navigate = useNavigate();

  // Données statiques inspirées Udemy/Coursera
  const featuredCourses = [
    { title: 'Développeur Python avec Microsoft', branch: 'Data Science', rating: 4.8, students: '10K+', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', icon: <ChartBarIcon className="h-12 w-12" />, color: 'indigo' },
    { title: 'React pour Débutants', branch: 'Web', rating: 4.7, students: '25K+', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', icon: <CodeBracketIcon className="h-12 w-12" />, color: 'blue' },
    { title: 'Introduction à l\'IA', branch: 'IA', rating: 4.9, students: '15K+', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', icon: <SparklesIcon className="h-12 w-12" />, color: 'purple' },
    { title: 'DevOps avec Docker', branch: 'DevOps', rating: 4.6, students: '8K+', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', icon: <CogIcon className="h-12 w-12" />, color: 'green' },
  ];

  const categories = [
    { name: 'Web Dev', icon: <AcademicCapIcon className="h-8 w-8" />, color: 'blue' },
    { name: 'IA & ML', icon: <SparklesIcon className="h-8 w-8" />, color: 'purple' },
    { name: 'DevOps', icon: <PlayIcon className="h-8 w-8" />, color: 'green' },
    { name: 'Cybersecurity', icon: <UserGroupIcon className="h-8 w-8" />, color: 'red' },
    { name: 'Data Science', icon: <StarIcon className="h-8 w-8" />, color: 'yellow' },
  ];

  const testimonials = [
    { name: 'Sarah W.', quote: 'Coursera m\'a aidée à changer de carrière en data analytics tout en gérant ma vie familiale. Flexible et puissant !', rating: 5 },
    { name: 'Noeris B.', quote: 'Les cours gratuits et les quizzes IA m\'ont donné confiance pour mon premier job en dev.', rating: 5 },
    { name: 'Abdullahi M.', quote: 'De zéro à expert en 3 mois. Les vidéos YouTube et le tracking de progrès sont parfaits.', rating: 4.9 },
  ];

  // Composant Modulaire : Hero Section
  const HeroSection = () => (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-500/30 dark:to-purple-500/30"></div>
      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <SparklesIcon className="h-16 w-16 text-yellow-400 dark:text-yellow-300 mx-auto mb-4 animate-pulse" />
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fadeInUp">
          Apprenez sans Limites
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-fadeInUp animation-delay-300">
          Démarrez, changez ou boostez votre carrière avec 10 000+ cours de top organisations. De Python à DevOps, devenez expert en IT – gratuit et flexible, comme Udemy et Coursera.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-400 dark:hover:to-purple-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Commencez à Apprendre <ArrowRightIcon className="h-5 w-5 inline ml-2" />
        </button>
      </div>
    </section>
  );

  // Composant Modulaire : Featured Courses
  const FeaturedCourses = () => (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 animate-fadeInUp">Cours Populaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course, index) => (
            <Link key={index} to="/courses" className="group">
              <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-600">
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <PlayIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="p-4 text-center">
                  <div className={`p-3 rounded-full mx-auto mb-4 bg-${course.color}-200 dark:bg-${course.color}-700 group-hover:scale-110 transition-transform`}>
                    {course.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{course.branch}</p>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`h-4 w-4 ${i < course.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.students} étudiants</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  // Composant Modulaire : Catégories
  const Categories = () => (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 animate-fadeInUp">Découvrez Nos Catégories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <Link key={index} to="/branches" className="group">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                <div className={`w-12 h-12 ${cat.color}-100 dark:${cat.color}-900 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">+20 cours</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  // Composant Modulaire : Témoignages
  const Testimonials = () => (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 animate-fadeInUp">Ce Que Disent Nos Étudiants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl shadow-md">
              <p className="text-gray-700 dark:text-gray-300 italic mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">S.</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Composant Modulaire : CTA Final
  const CTASection = () => (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-700 text-white">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Prêt à Booster Votre Carrière IT ?</h2>
        <p className="text-xl mb-8 opacity-90">Rejoignez 1M+ étudiants. Cours gratuits, IA intégrée, et progrès suivi – commencez aujourd'hui !</p>
        <button
          onClick={() => navigate('/signup')}
          className="bg-white text-blue-600 dark:bg-gray-200 dark:text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-300 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Commencez à Apprendre
        </button>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <HeroSection />
      <FeaturedCourses />
      <Categories />
      <Testimonials />
      <CTASection />
    </div>
  );
}

export default Home;