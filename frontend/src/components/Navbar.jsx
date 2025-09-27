import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {t('navbar.title')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <NavLink 
                to="/" 
                className={({isActive}) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`
                }
              >
                🏠 {t('navbar.dashboard')}
              </NavLink>
              <NavLink 
                to="/quiz" 
                className={({isActive}) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`
                }
              >
                🧠 {t('navbar.quiz')}
              </NavLink>
              <NavLink 
                to="/career-recommendations" 
                className={({isActive}) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`
                }
              >
                💼 {t('navbar.careers')}
              </NavLink>
              <NavLink 
                to="/college-directory" 
                className={({isActive}) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`
                }
              >
                🏫 {t('navbar.colleges')}
              </NavLink>
              <NavLink 
                to="/timeline" 
                className={({isActive}) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`
                }
              >
                📅 {t('navbar.timeline')}
              </NavLink>
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle language"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NavLink 
                  to="/profile" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user?.name || t('navbar.profile')}</span>
                </NavLink>
                <button 
                  onClick={logout} 
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  {t('navbar.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t('navbar.login')}
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  {t('navbar.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink 
                to="/" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 {t('navbar.dashboard')}
              </NavLink>
              <NavLink 
                to="/quiz" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🧠 {t('navbar.quiz')}
              </NavLink>
              <NavLink 
                to="/career-recommendations" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                💼 {t('navbar.careers')}
              </NavLink>
              <NavLink 
                to="/college-directory" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏫 {t('navbar.colleges')}
              </NavLink>
              <NavLink 
                to="/timeline" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📅 {t('navbar.timeline')}
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}