import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { HomeIcon, Bars3Icon, XMarkIcon, ChartBarIcon, BookOpenIcon, UserGroupIcon, ClipboardDocumentCheckIcon, ArrowRightOnRectangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Ajout MagnifyingGlassIcon pour search
import Signup from './components/Signup';
import Login from './components/Login';
import BranchSelection from './components/BranchSelection';
import CourseList from './components/CourseList';
import Progress from './components/Progress';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Footer from './components/Footer';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // État global pour recherche

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Passez searchQuery aux composants enfants via props ou context si besoin
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex">
        {/* Sidebar (inchangée) */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex justify-between items-center border-b border-blue-800">
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-6 w-6" />
              <span className="text-lg font-bold">IT Learn Pro</span>
            </div>
            <button onClick={toggleSidebar} className="hover:bg-blue-500 p-1 rounded transition-colors duration-300">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" onClick={toggleSidebar}>
              <HomeIcon className="h-5 w-5" />
              <span>Accueil</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" onClick={toggleSidebar}>
              <ChartBarIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/branches" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" onClick={toggleSidebar}>
              <BookOpenIcon className="h-5 w-5" />
              <span>Branches</span>
            </Link>
            <Link to="/courses" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" onClick={toggleSidebar}>
              <UserGroupIcon className="h-5 w-5" />
              <span>Cours</span>
            </Link>
            <Link to="/progress" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" onClick={toggleSidebar}>
              <ClipboardDocumentCheckIcon className="h-5 w-5" />
              <span>Progrès</span>
            </Link>
            <Link to="/login" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" onClick={toggleSidebar}>
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Connexion</span>
            </Link>
          </nav>
        </div>

        {/* Overlay pour fermer sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleSidebar} />
        )}

        {/* Bouton Toggle Sidebar */}
        <button 
          onClick={toggleSidebar} 
          className="fixed left-4 top-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Contenu Principal avec Barre de Recherche Globale */}
        <div className="flex-1 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Barre de Recherche Globale (Comme Udemy/Coursera) */}
            <div className="mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des cours, branches ou compétences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} />} /> {/* Passez searchQuery si besoin */}
              <Route path="/dashboard" element={<Dashboard searchQuery={searchQuery} />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/branches" element={<BranchSelection searchQuery={searchQuery} />} />
              <Route path="/courses" element={<CourseList searchQuery={searchQuery} />} />
              <Route path="/progress" element={<Progress searchQuery={searchQuery} />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;