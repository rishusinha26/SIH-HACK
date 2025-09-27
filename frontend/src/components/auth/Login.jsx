import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    } else {
      setCheckingAuth(false)
    }
  }, [isAuthenticated, navigate])

  // Clear error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) setError(null)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (error) setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    // Enhanced validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }
    
    // Better email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }
    
    // Check for Gmail requirement
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Please use a Gmail address (@gmail.com)')
      setLoading(false)
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }
    
    try {
      const { data } = await api.post('/auth/login', { email: email.trim(), password })
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else if (err.response?.status === 404) {
        setError('User not found. Please check your email or register.')
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.')
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Show loading spinner while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden dark-gradient px-4 py-10">
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-blue-500/30 blob" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-indigo-500/30 blob" />

      <div className="w-full max-w-md relative">
        <div className="bg-slate-900/70 backdrop-blur rounded-xl shadow-2xl border border-slate-700 p-8 text-slate-100">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-slate-300 text-sm mt-1">Sign in to continue to EduGuide</p>
          </div>

          {error && (
            <div className="text-red-300 mb-4 text-sm bg-red-900/30 border border-red-800 rounded px-3 py-2 flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-slate-300 font-medium">
                Email Address
              </label>
              <input 
                id="email"
                name="email"
                className="w-full bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/40 outline-none p-2.5 rounded-lg transition form-input" 
                placeholder="yourname@gmail.com" 
                type="email" 
                value={email} 
                onChange={handleEmailChange}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm text-slate-300 font-medium">
                Password
              </label>
              <input 
                id="password"
                name="password"
                className="w-full bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/40 outline-none p-2.5 rounded-lg transition form-input" 
                placeholder="••••••••" 
                type="password" 
                value={password} 
                onChange={handlePasswordChange}
                required
                autoComplete="current-password"
                disabled={loading}
                minLength={6}
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition transform hover:-translate-y-0.5 btn-glow flex items-center justify-center font-medium"
              aria-label={loading ? 'Signing in...' : 'Sign in'}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-center text-slate-300">
              No account? <Link className="text-blue-300 hover:underline font-medium" to="/register">Create one</Link>
            </p>
            <p className="text-sm text-center">
              <Link 
                to="/forgot-password"
                className="text-blue-300 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


