import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token')
  }, [token])
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user')
  }, [user])

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    login: (t, u) => { setToken(t); setUser(u) },
    logout: () => { setToken(null); setUser(null) }
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}



