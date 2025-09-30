import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BranchSelection() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/branches')
      .then(response => setBranches(response.data))
      .catch(error => setMessage('Erreur lors du chargement des branches'));
  }, []);

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
    } catch (error) {
      setMessage(error.response?.data.error || 'Erreur lors de la sélection');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Choisir une branche</h2>
      {message && <p className={`mb-4 ${message.includes('sélectionnée') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
      {selectedBranch && (
        <p className="text-green-500 mb-4">Branche sélectionnée : {selectedBranch}</p>
      )}
      <div className="grid grid-cols-1 gap-4">
        {branches.map(branch => (
          <button
            key={branch._id}
            onClick={() => handleSelect(branch._id)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600"
          >
            {branch.name} - {branch.description}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BranchSelection;