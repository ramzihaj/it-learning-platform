import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { getBranchImage } from '@/assets/images';
import { api } from '@/utils/helpers';
import { BRANCH_STYLES } from '@/utils/branchStyles';

/**
 * Composant de sélection de branche d'études
 * Affiche les branches disponibles et permet à l'utilisateur d'en sélectionner une
 * 
 * @component
 * @param {string} searchQuery - Terme de recherche pour filtrer les branches
 * @returns {JSX.Element} Le composant de sélection de branche
 */
function BranchSelection({ searchQuery = '' }) {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Charger les branches depuis l'API au montage du composant
   */
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api.baseURL}/api/branches`);
        setBranches(response.data);
      } catch (error) {
        setMessage('Erreur lors du chargement des branches');
        console.error('Erreur chargement branches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  /**
   * Filtrer les branches selon la recherche
   */
  const filteredBranches = useMemo(() => {
    if (!searchQuery.trim()) return branches;
    
    return branches.filter(branch => 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      branch.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [branches, searchQuery]);

  /**
   * Gérer la sélection d'une branche
   * @param {string} branchId - L'ID de la branche sélectionnée
   */
  const handleSelect = async (branchId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Veuillez vous connecter d\'abord');
        return;
      }

      const response = await axios.post(
        `${api.baseURL}/api/branches/select`,
        { branchId },
        { headers: api.getAuthHeader() }
      );

      setMessage(response.data.message);
      setSelectedBranch(response.data.user.selectedBranch);
      localStorage.setItem('selectedBranch', response.data.user.selectedBranch);
      
      // Rediriger vers les cours après un délai
      setTimeout(() => navigate('/courses'), 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erreur lors de la sélection';
      setMessage(errorMsg);
      console.error('Erreur sélection branche:', error);
    }
  };

  /**
   * Obtenir les styles (couleurs, icons, etc.) pour une branche
   * @param {string} branchName - Nom de la branche
   * @returns {Object} Objet contenant les styles et l'icon
   */
  const getBranchData = (branchName) => {
    const normalizedName = branchName?.toLowerCase().trim() || 'web';
    return BRANCH_STYLES[normalizedName] || BRANCH_STYLES.default;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Choisir une Branche
      </h2>

      {/* Message d'état */}
      {message && (
        <p className={`mb-4 p-3 rounded-lg text-center font-medium ${
          message.includes('sélectionnée') 
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
        }`}>
          {message}
        </p>
      )}

      {/* Indication de branche sélectionnée */}
      {selectedBranch && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center border border-green-300 dark:border-green-700">
          <p className="text-green-700 dark:text-green-300 font-semibold">
            ✓ Branche sélectionnée : <strong>{selectedBranch}</strong>
          </p>
        </div>
      )}

      {/* Grille de branches */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
        filteredBranches.length > 0 ? '' : 'grid-cols-1'
      }`}>
        {loading ? (
          // État de chargement
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">Chargement des branches...</p>
          </div>
        ) : filteredBranches.length > 0 ? (
          // Afficher les branches
          filteredBranches.map(branch => {
            const styles = getBranchData(branch.name);
            const branchImage = getBranchImage(branch.name);
            
            return (
              <div
                key={branch._id}
                className={`relative overflow-hidden bg-gradient-to-br ${styles.bgClasses} rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border ${styles.borderClasses} group`}
                onClick={() => handleSelect(branch._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelect(branch._id)}
              >
                {/* Image de la branche */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={branchImage} 
                    alt={branch.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${styles.overlayClasses} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>

                {/* Contenu de la branche */}
                <div className="p-6 text-center">
                  {/* Icon de la branche */}
                  <div className={`p-3 rounded-full mx-auto mb-4 ${styles.iconBgClasses} group-hover:scale-110 transition-transform`}>
                    {React.createElement(styles.iconComponent, { className: 'h-12 w-12 text-gray-700 dark:text-gray-300 mx-auto' })}
                  </div>

                  {/* Titre */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {branch.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {branch.description}
                  </p>

                  {/* Bouton de sélection */}
                  <button 
                    className={`w-full bg-gradient-to-r ${styles.buttonClasses} text-white py-2 rounded-lg transition-all duration-300 font-semibold group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    aria-label={`Sélectionner la branche ${branch.name}`}
                  >
                    Sélectionner
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          // Aucun résultat trouvé
          <div className="col-span-full text-center py-12">
            <SparklesIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400 font-semibold">
              Aucun résultat trouvé
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Essayez un autre terme de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BranchSelection;
