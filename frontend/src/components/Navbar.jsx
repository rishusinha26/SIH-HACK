import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  return (
    <nav className="navbar-slide bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 border-b border-blue-500/20 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-indigo-300 transition-all duration-300 bounce-animation">
          EduGuide
        </Link>
        {isAuthenticated && (
          <div className="flex items-center gap-6">
            <NavLink 
              to="/quiz" 
              className={({isActive}) => 
                `nav-link px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-blue-200 hover:text-white hover:bg-blue-500/20'
                }`
              }
            >
              🧠 Quiz
            </NavLink>
            <NavLink 
              to="/careers" 
              className={({isActive}) => 
                `nav-link px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/25' 
                    : 'text-green-200 hover:text-white hover:bg-green-500/20'
                }`
              }
            >
              💼 Careers
            </NavLink>
            <NavLink 
              to="/colleges" 
              className={({isActive}) => 
                `nav-link px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'text-purple-200 hover:text-white hover:bg-purple-500/20'
                }`
              }
            >
              🏫 Colleges
            </NavLink>
            <NavLink 
              to="/timeline" 
              className={({isActive}) => 
                `nav-link px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/25' 
                    : 'text-orange-200 hover:text-white hover:bg-orange-500/20'
                }`
              }
            >
              📅 Timeline
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({isActive}) => 
                `nav-link px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/25' 
                    : 'text-pink-200 hover:text-white hover:bg-pink-500/20'
                }`
              }
            >
              👤 {user?.name || 'Profile'}
            </NavLink>
            <button 
              onClick={logout} 
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25"
            >
              🚪 Logout
            </button>
          </div>
        )}
        {!isAuthenticated && (
          <div className="flex items-center gap-4">
            <NavLink 
              to="/login" 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              🔑 Login
            </NavLink>
            <NavLink 
              to="/register" 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25"
            >
              ✨ Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}



