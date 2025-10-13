import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';
import Quiz from './Quiz';
import { CodeBracketIcon, SparklesIcon, CogIcon, ShieldCheckIcon, ChartBarIcon, PlayIcon } from '@heroicons/react/24/outline';

function CourseList({ searchQuery = '' }) {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [showSummary, setShowSummary] = useState(null);
  const [showQuiz, setShowQuiz] = useState(null); // Corrigé : setShowQuiz
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Veuillez vous connecter d’abord');
          setTimeout(() => navigate('/login'), 1000);
          return;
        }

        const branch = localStorage.getItem('selectedBranch') || 'Web';
        const response = await axios.get(`http://localhost:5000/api/courses/${branch}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        setMessage(error.response?.data.error || 'Erreur lors du chargement des cours');
      }
    };
    fetchCourses();
  }, [navigate]);

  // Filtre réactif avec useMemo
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    return courses.filter(course => 
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const handleMarkCompleted = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/progress',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      // Refresh courses
      const branch = localStorage.getItem('selectedBranch') || 'Web';
      const updatedCourses = await axios.get(`http://localhost:5000/api/courses/${branch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(updatedCourses.data);
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur lors de la mise à jour du progrès');
    }
  };

  const handleGenerateSummary = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/summary/generate/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowSummary({ id: courseId, summary: response.data.summary, title: response.data.courseTitle });
      setMessage('Résumé généré avec succès !');
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur lors de la génération du résumé');
    }
  };

  const handleGenerateQuiz = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/summary/quiz/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowQuiz({ id: courseId, quiz: response.data.quiz, title: response.data.courseTitle });
      setMessage('Quiz généré avec succès !');
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur lors de la génération du quiz');
    }
  };

  const getYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Données par branche pour images/icons avec classes statiques (fix pour JIT compiler)
  const getCourseData = (branch) => {
    const safeBranch = branch || 'web'; // Fallback si branch undefined
    console.log('getCourseData branch:', safeBranch); // Debug pour tracer
    switch (safeBranch.toLowerCase()) {
      case 'web':
        return { 
          icon: <CodeBracketIcon className="h-12 w-12" />, 
          image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
      case 'ia':
        return { 
          icon: <SparklesIcon className="h-12 w-12" />, 
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
      case 'devops':
        return { 
          icon: <CogIcon className="h-12 w-12" />, 
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
      case 'cybersecurity':
        return { 
          icon: <ShieldCheckIcon className="h-12 w-12" />, 
          image: 'https://images.unsplash.com/photo-1632221326803-5f0d0a0ef706?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
      case 'data science':
        return { 
          icon: <ChartBarIcon className="h-12 w-12" />, 
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
      default:
        return { 
          icon: <PlayIcon className="h-12 w-12" />, 
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Cours Disponibles</h2>
      {message && <p className={`mb-4 p-3 rounded-lg text-center ${message.includes('succès') || message.includes('complété') ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>{message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => {
            const { icon, image } = getCourseData(course.branch);
            return (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
                <YouTube
                  videoId={getYouTubeId(course.youtubeUrl)}
                  className="w-full"
                  opts={{ width: '100%', height: '200px' }}
                />
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => handleMarkCompleted(course._id)}
                    className="bg-green-500 dark:bg-green-600 text-white p-2 rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-300 flex-1"
                  >
                    Marquer comme complété
                  </button>
                  <button
                    onClick={() => handleGenerateSummary(course._id)}
                    className="bg-purple-500 dark:bg-purple-600 text-white p-2 rounded hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300 flex-1"
                  >
                    Résumé IA
                  </button>
                  <button
                    onClick={() => handleGenerateQuiz(course._id)}
                    className="bg-orange-500 dark:bg-orange-600 text-white p-2 rounded hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 flex-1"
                  >
                    Quiz IA
                  </button>
                </div>

                {/* Affichage du résumé IA */}
                {showSummary && showSummary.id === course._id && (
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                    <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Résumé IA pour {showSummary.title} :</h4>
                    <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{showSummary.summary}</p>
                    <button onClick={() => setShowSummary(null)} className="mt-2 text-blue-500 dark:text-blue-400 underline">
                      Fermer
                    </button>
                  </div>
                )}

                {/* Affichage du quiz IA */}
                {showQuiz && showQuiz.id === course._id && (
                  <div className="mt-4">
                    <Quiz quiz={showQuiz.quiz} onClose={() => setShowQuiz(null)} />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-full">Aucun cours trouvé – essayez un autre terme de recherche.</p>
        )}
      </div>
    </div>
  );
}

export default CourseList;
