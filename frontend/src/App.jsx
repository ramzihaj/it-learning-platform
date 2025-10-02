import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { HomeIcon, Bars3Icon, XMarkIcon, ChartBarIcon, BookOpenIcon, UserGroupIcon, ClipboardDocumentCheckIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Signup from './components/Signup';
import Login from './components/Login';
import BranchSelection from './components/BranchSelection';
import CourseList from './components/CourseList';
import Progress from './components/Progress';
import Dashboard from './components/Dashboard';
import Home from './components/Home';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex overflow-hidden"> {/* Overflow hidden pour slide */}
        {/* Sidebar Verticale (Z-index élevé pour affichage) */}
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
            <Link 
              to="/" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" 
              onClick={toggleSidebar}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Accueil</span>
            </Link>
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" 
              onClick={toggleSidebar}
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/branches" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" 
              onClick={toggleSidebar}
            >
              <BookOpenIcon className="h-5 w-5" />
              <span>Branches</span>
            </Link>
            <Link 
              to="/courses" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" 
              onClick={toggleSidebar}
            >
              <UserGroupIcon className="h-5 w-5" />
              <span>Cours</span>
            </Link>
            <Link 
              to="/progress" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" 
              onClick={toggleSidebar}
            >
              <ClipboardDocumentCheckIcon className="h-5 w-5" />
              <span>Progrès</span>
            </Link>
            <Link 
              to="/login" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-105" 
              onClick={toggleSidebar}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Connexion</span>
            </Link>
          </nav>
        </div>

        {/* Overlay pour fermer sidebar (z-index 40, < sidebar 50) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40" 
            onClick={toggleSidebar}
          />
        )}

        {/* Bouton Toggle (Fixe à Gauche, z-index 40) */}
        <button 
          onClick={toggleSidebar} 
          className="fixed left-4 top-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Contenu Principal (Transition slide si sidebar ouverte) */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/branches" element={<BranchSelection />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/progress" element={<Progress />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;