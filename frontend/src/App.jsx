import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import BranchSelection from './components/BranchSelection';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Accueil</Link></li>
            <li><Link to="/signup" className="hover:underline">Inscription</Link></li>
            <li><Link to="/login" className="hover:underline">Connexion</Link></li>
            <li><Link to="/branches" className="hover:underline">Branches</Link></li>
          </ul>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<h2 className="text-xl">Bienvenue sur la plateforme d'apprentissage IT !</h2>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/branches" element={<BranchSelection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;