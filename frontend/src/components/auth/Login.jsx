import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
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

          {error && <div className="text-red-300 mb-4 text-sm bg-red-900/30 border border-red-800 rounded px-3 py-2">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Email</label>
              <input className="w-full bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/40 outline-none p-2.5 rounded-lg transition" placeholder="you@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Password</label>
              <input className="w-full bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/40 outline-none p-2.5 rounded-lg transition" placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition transform hover:-translate-y-0.5 btn-glow">Sign in</button>
          </form>

          <p className="text-sm mt-4 text-center text-slate-300">No account? <Link className="text-blue-300 hover:underline" to="/register">Create one</Link></p>
        </div>
      </div>
    </div>
  )
}


