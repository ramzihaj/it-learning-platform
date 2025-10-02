import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CodeBracketIcon, SparklesIcon, CogIcon, ShieldCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline';

function BranchSelection({ searchQuery = '' }) {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/branches')
      .then(response => setBranches(response.data))
      .catch(() => setMessage('Erreur lors du chargement des branches'));
  }, []);

  // Filtre réactif
  const filteredBranches = useMemo(() => {
    if (!searchQuery.trim()) return branches;
    return branches.filter(branch => 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      branch.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [branches, searchQuery]);

  const handleSelect = async (branchId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Veuillez vous connecter d’abord');
        return;
      }
      const response = await axios.post(
        'http://localhost:5000/api/branches/select',
        { branchId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setSelectedBranch(response.data.user.selectedBranch);
      localStorage.setItem('selectedBranch', response.data.user.selectedBranch);
      setTimeout(() => navigate('/courses'), 1000);
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur lors de la sélection');
    }
  };

  // Données par branche (icon, couleur, image attractive Unsplash)
  const getBranchData = (name) => {
    switch (name.toLowerCase()) {
      case 'web':
        return { 
          icon: <CodeBracketIcon className="h-12 w-12" />, 
          color: 'blue', 
          image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' // Web dev laptop
        };
      case 'ia':
        return { 
          icon: <SparklesIcon className="h-12 w-12" />, 
          color: 'purple', 
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' // AI brain
        };
      case 'devops':
        return { 
          icon: <CogIcon className="h-12 w-12" />, 
          color: 'green', 
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' // DevOps gears
        };
      case 'cybersecurity':
        return { 
          icon: <ShieldCheckIcon className="h-12 w-12" />, 
          color: 'red', 
          image: 'https://tse4.mm.bing.net/th/id/OIP.iLoSgDQwC4WQ_09-dYXx8gHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3' // Security lock
        };
      case 'data science':
        return { 
          icon: <ChartBarIcon className="h-12 w-12" />, 
          color: 'indigo', 
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' // Data charts
        };
      default:
        return { 
          icon: <CodeBracketIcon className="h-12 w-12" />, 
          color: 'gray', 
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' // Default tech
        };
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Choisir une Branche</h2>
      {message && <p className={`mb-4 p-3 rounded-lg text-center ${message.includes('sélectionnée') ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>{message}</p>}
      {selectedBranch && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
          <p className="text-green-700 dark:text-green-300 font-semibold">Branche sélectionnée : {selectedBranch}</p>
        </div>
      )}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${filteredBranches.length > 0 ? '' : 'grid-cols-1'}`}>
        {filteredBranches.length > 0 ? (
          filteredBranches.map(branch => {
            const { icon, color, image } = getBranchData(branch.name);
            return (
              <div
                key={branch._id}
                className={`relative overflow-hidden bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-${color}-900 dark:to-${color}-800 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-${color}-200 dark:border-${color}-700 group`}
                onClick={() => handleSelect(branch._id)}
              >
                {/* Image Attractif en Haut */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={image} 
                    alt={branch.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-${color}-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> {/* Overlay gradient sur hover */}
                </div>
                <div className="p-6 text-center">
                  <div className={`p-3 rounded-full mx-auto mb-4 bg-${color}-200 dark:bg-${color}-700 group-hover:scale-110 transition-transform`}> {/* Icon coloré */}
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{branch.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{branch.description}</p>
                  <button className="mt-4 w-full bg-gradient-to-r from-${color}-600 to-${color}-700 dark:from-${color}-500 dark:to-${color}-600 text-white py-2 rounded-lg hover:from-${color}-700 hover:to-${color}-800 dark:hover:from-${color}-400 dark:hover:to-${color}-500 transition-all duration-300 font-semibold group-hover:scale-105">
                    Sélectionner cette Branche
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <SparklesIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400 font-semibold">Aucun résultat trouvé</p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Essayez un autre terme de recherche pour voir plus de branches.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BranchSelection;