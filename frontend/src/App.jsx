import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import Quiz from './components/Quiz.jsx'
import CareerPaths from './components/CareerPaths.jsx'
import Colleges from './components/Colleges.jsx'
import Timeline from './components/Timeline.jsx'
import Profile from './components/Profile.jsx'
import Login from './components/auth/Login.jsx'
import Register from './components/auth/Register.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/careers" element={<PrivateRoute><CareerPaths /></PrivateRoute>} />
          <Route path="/colleges" element={<PrivateRoute><Colleges /></PrivateRoute>} />
          <Route path="/timeline" element={<PrivateRoute><Timeline /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}


