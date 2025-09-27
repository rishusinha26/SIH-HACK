import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import Quiz from './components/Quiz.jsx'
import CareerPaths from './components/CareerPaths.jsx'
import CareerRecommendations from './components/CareerRecommendations.jsx'
import Colleges from './components/Colleges.jsx'
import CollegeDirectory from './components/CollegeDirectory.jsx'
import Timeline from './components/Timeline.jsx'
import Profile from './components/Profile.jsx'
import Login from './components/auth/Login.jsx'
import Register from './components/auth/Register.jsx'
import ForgotPassword from './components/auth/ForgotPassword.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { VoiceProvider } from './context/VoiceContext.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import VoiceAssistant from './components/VoiceAssistant.jsx'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <VoiceProvider>
            <ToastProvider>
              <AuthProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                  <Navbar />
                  <Routes>
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
                    <Route path="/careers" element={<PrivateRoute><CareerPaths /></PrivateRoute>} />
                    <Route path="/career-recommendations" element={<PrivateRoute><CareerRecommendations /></PrivateRoute>} />
                    <Route path="/colleges" element={<PrivateRoute><Colleges /></PrivateRoute>} />
                    <Route path="/college-directory" element={<PrivateRoute><CollegeDirectory /></PrivateRoute>} />
                    <Route path="/timeline" element={<PrivateRoute><Timeline /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  </Routes>
                  <VoiceAssistant />
                </div>
              </AuthProvider>
            </ToastProvider>
          </VoiceProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}


