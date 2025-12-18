import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';
import { getBranchImage } from '@/assets/images';
import { api, getYouTubeId } from '@/utils/helpers';
import { BRANCH_STYLES } from '@/utils/branchStyles';

/**
 * Composant affichant la liste des cours pour la branche sélectionnée
 * Permet de regarder les vidéos, marquer les cours comme complétés,
 * et générer des résumés et quiz IA
 * 
 * @component
 * @param {string} searchQuery - Terme de recherche pour filtrer les cours
 * @returns {JSX.Element} Le composant de liste de cours
 */
function CourseList({ searchQuery = '' }) {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [showSummary, setShowSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Charger les cours de la branche sélectionnée
   */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setMessage('Veuillez vous connecter d\'abord');
          setTimeout(() => navigate('/login'), 1000);
          return;
        }

        const selectedBranch = localStorage.getItem('selectedBranch') || 'Web';
        const response = await axios.get(
          `${api.baseURL}/api/courses/${selectedBranch}`,
          { headers: api.getAuthHeader() }
        );
        
        setCourses(response.data);
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Erreur lors du chargement des cours';
        setMessage(errorMsg);
        console.error('Erreur chargement cours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  /**
   * Filtrer les cours selon la recherche
   */
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    
    return courses.filter(course => 
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  /**
   * Marquer un cours comme complété
   * @param {string} courseId - L'ID du cours
   */
  const handleMarkCompleted = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${api.baseURL}/api/progress`,
        { courseId },
        { headers: api.getAuthHeader() }
      );

      setMessage(response.data.message);
      
      // Rafraîchir la liste des cours
      const selectedBranch = localStorage.getItem('selectedBranch') || 'Web';
      const updatedResponse = await axios.get(
        `${api.baseURL}/api/courses/${selectedBranch}`,
        { headers: api.getAuthHeader() }
      );
      
      setCourses(updatedResponse.data);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erreur lors de la mise à jour du progrès';
      setMessage(errorMsg);
      console.error('Erreur marquer complété:', error);
    }
  };

  /**
   * Générer un résumé IA pour un cours
   * @param {string} courseId - L'ID du cours
   */
  const handleGenerateSummary = async (courseId) => {
    try {
      const response = await axios.post(
        `${api.baseURL}/api/summary/generate/${courseId}`,
        {},
        { headers: api.getAuthHeader() }
      );

      setShowSummary({
        id: courseId,
        summary: response.data.summary,
        title: response.data.courseTitle
      });
      setMessage('✓ Résumé généré avec succès !');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erreur lors de la génération du résumé';
      setMessage(errorMsg);
      console.error('Erreur génération résumé:', error);
    }
  };



  /**
   * Obtenir les styles pour une branche
   * @param {string} branchName - Nom de la branche
   * @returns {Object} Objet contenant les styles
   */
  const getBranchData = (branchName) => {
    const normalizedName = branchName?.toLowerCase().trim() || 'web';
    return BRANCH_STYLES[normalizedName] || BRANCH_STYLES.default;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Cours Disponibles
      </h2>

      {/* Message d'état */}
      {message && (
        <p className={`mb-4 p-3 rounded-lg text-center font-medium ${
          message.includes('✓') || message.includes('succès') || message.includes('complété')
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
        }`}>
          {message}
        </p>
      )}

      {/* Grille de cours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // État de chargement
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">Chargement des cours...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          // Afficher les cours
          filteredCourses.map(course => {
            const styles = getBranchData(course.branch);
            const courseImage = getBranchImage(course.branch);
            const youtubeId = getYouTubeId(course.youtubeUrl);

            return (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* Image du cours */}
                <div className="mb-4 h-32 overflow-hidden rounded-lg">
                  <img
                    src={courseImage}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Titre du cours */}
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow line-clamp-3">
                  {course.description}
                </p>

                {/* Vidéo YouTube */}
                {youtubeId ? (
                  <YouTube
                    videoId={youtubeId}
                    className="w-full mb-4"
                    opts={{ width: '100%', height: '180px' }}
                    onError={(error) => console.error('Erreur YouTube:', error)}
                  />
                ) : (
                  <div className="w-full h-32 mb-4 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-600 dark:text-gray-300">
                    Vidéo non disponible
                  </div>
                )}

                {/* Résumé IA si affiché */}
                {showSummary && showSummary.id === course._id && (
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h4 className="font-bold mb-2 text-blue-900 dark:text-blue-100">
                      Résumé IA :
                    </h4>
                    <p className="whitespace-pre-wrap text-sm text-blue-800 dark:text-blue-200 max-h-40 overflow-y-auto">
                      {showSummary.summary}
                    </p>
                    <button
                      onClick={() => setShowSummary(null)}
                      className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                    >
                      Fermer
                    </button>
                  </div>
                )}



                {/* Boutons d'action */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                  <button
                    onClick={() => handleMarkCompleted(course._id)}
                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors duration-300 font-medium text-sm"
                    title="Marquer ce cours comme complété"
                  >
                    ✓ Complété
                  </button>
                  <button
                    onClick={() => handleGenerateSummary(course._id)}
                    className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors duration-300 font-medium text-sm"
                    title="Générer un résumé avec l'IA"
                  >
                    📝 Résumé
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          // Aucun cours trouvé
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400 font-semibold mb-2">
              Aucun cours trouvé
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Essayez un autre terme de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;
