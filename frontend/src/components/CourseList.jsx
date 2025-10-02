import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';
import Quiz from './Quiz'; // Import du composant Quiz

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [showSummary, setShowSummary] = useState(null); // État pour résumé IA
  const [showQuiz, setShowQuiz] = useState(null); // État pour quiz IA
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

  const handleMarkCompleted = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/progress',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      // Refresh courses to reflect progress (optional)
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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cours disponibles</h2>
      {message && <p className={`mb-4 ${message.includes('succès') || message.includes('complété') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <YouTube
              videoId={getYouTubeId(course.youtubeUrl)}
              className="w-full"
              opts={{ width: '100%', height: '200px' }}
            />
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleMarkCompleted(course._id)}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Marquer comme complété
              </button>
              <button
                onClick={() => handleGenerateSummary(course._id)}
                className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
              >
                Résumé IA
              </button>
              <button
                onClick={() => handleGenerateQuiz(course._id)}
                className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
              >
                Quiz IA
              </button>
            </div>

            {/* Affichage du résumé IA */}
            {showSummary && showSummary.id === course._id && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h4 className="font-bold mb-2">Résumé IA pour {showSummary.title} :</h4>
                <p className="whitespace-pre-wrap text-sm">{showSummary.summary}</p>
                <button onClick={() => setShowSummary(null)} className="mt-2 text-blue-500 underline">
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
        ))}
      </div>
    </div>
  );
}

export default CourseList;