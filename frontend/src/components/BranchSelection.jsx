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

  // Données par branche avec classes Tailwind statiques (fix pour JIT compiler)
  const getBranchData = (name) => {
    switch (name.toLowerCase()) {
      case 'web':
        return { 
          icon: <CodeBracketIcon className="h-12 w-12" />, 
          bgClasses: 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800',
          borderClasses: 'border-blue-200 dark:border-blue-700',
          iconBgClasses: 'bg-blue-200 dark:bg-blue-700',
          buttonClasses: 'from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-400 dark:hover:to-blue-500',
          overlayClasses: 'from-blue-600/80',
          image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        };
      case 'ia':
        return { 
          icon: <SparklesIcon className="h-12 w-12" />, 
          bgClasses: 'from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800',
          borderClasses: 'border-purple-200 dark:border-purple-700',
          iconBgClasses: 'bg-purple-200 dark:bg-purple-700',
          buttonClasses: 'from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-400 dark:hover:to-purple-500',
          overlayClasses: 'from-purple-600/80',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        };
      case 'devops':
        return { 
          icon: <CogIcon className="h-12 w-12" />, 
          bgClasses: 'from-green-50 to-green-100 dark:from-green-900 dark:to-green-800',
          borderClasses: 'border-green-200 dark:border-green-700',
          iconBgClasses: 'bg-green-200 dark:bg-green-700',
          buttonClasses: 'from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 hover:from-green-700 hover:to-green-800 dark:hover:from-green-400 dark:hover:to-green-500',
          overlayClasses: 'from-green-600/80',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        };
      case 'cybersecurity':
        return { 
          icon: <ShieldCheckIcon className="h-12 w-12" />, 
          bgClasses: 'from-red-50 to-red-100 dark:from-red-900 dark:to-red-800',
          borderClasses: 'border-red-200 dark:border-red-700',
          iconBgClasses: 'bg-red-200 dark:bg-red-700',
          buttonClasses: 'from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 hover:from-red-700 hover:to-red-800 dark:hover:from-red-400 dark:hover:to-red-500',
          overlayClasses: 'from-red-600/80',
          image: 'https://images.unsplash.com/photo-1632221326803-5f0d0a0ef706?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
      case 'data science':
        return { 
          icon: <ChartBarIcon className="h-12 w-12" />, 
          bgClasses: 'from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800',
          borderClasses: 'border-indigo-200 dark:border-indigo-700',
          iconBgClasses: 'bg-indigo-200 dark:bg-indigo-700',
          buttonClasses: 'from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-400 dark:hover:to-indigo-500',
          overlayClasses: 'from-indigo-600/80',
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        };
      default:
        return { 
          icon: <CodeBracketIcon className="h-12 w-12" />, 
          bgClasses: 'from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
          borderClasses: 'border-gray-200 dark:border-gray-700',
          iconBgClasses: 'bg-gray-200 dark:bg-gray-700',
          buttonClasses: 'from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 hover:from-gray-700 hover:to-gray-800 dark:hover:from-gray-400 dark:hover:to-gray-500',
          overlayClasses: 'from-gray-600/80',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
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
            const { icon, bgClasses, borderClasses, iconBgClasses, buttonClasses, overlayClasses, image } = getBranchData(branch.name);
            return (
              <div
                key={branch._id}
                className={`relative overflow-hidden bg-gradient-to-br ${bgClasses} rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border ${borderClasses} group`}
                onClick={() => handleSelect(branch._id)}
              >
                {/* Image Attractif en Haut */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={image} 
                    alt={branch.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${overlayClasses} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
                <div className="p-6 text-center">
                  <div className={`p-3 rounded-full mx-auto mb-4 ${iconBgClasses} group-hover:scale-110 transition-transform`}>
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{branch.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{branch.description}</p>
                  <button className={`mt-4 w-full bg-gradient-to-r ${buttonClasses} text-white py-2 rounded-lg transition-all duration-300 font-semibold group-hover:scale-105`}>
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