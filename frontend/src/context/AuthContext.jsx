import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token')
    } catch (error) {
      console.error('Error reading token from localStorage:', error)
      return null
    }
  })
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error reading user from localStorage:', error)
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Verify token is still valid
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (!response.ok) {
            // Token is invalid, clear it
            setToken(null)
            setUser(null)
          }
        } catch (error) {
          console.error('Token verification failed:', error)
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    
    initAuth()
  }, [])

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Error saving token to localStorage:', error)
    }
  }, [token])

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error)
    }
  }, [user])

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    login: (t, u) => { 
      setToken(t)
      setUser(u)
    },
    logout: () => { 
      setToken(null)
      setUser(null)
    }
  }), [token, user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}



