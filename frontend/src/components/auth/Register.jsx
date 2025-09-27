import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../ui/Toast.jsx'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useTranslation()
  const { addToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(null)
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  function validatePassword(pwd) {
    if (pwd.length < 8) return 'Password must be at least 8 characters long'
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(pwd)) {
      return 'Password must contain uppercase, lowercase, number, and special character'
    }
    return ''
  }

  function validateEmail(em) {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(em)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setPasswordError('')
    setLoading(true)
    
    // Basic validation
    if (!name || !email || !password) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }
    
    if (!validateEmail(email)) {
      setError('Email must be a valid Gmail address (@gmail.com)')
      setLoading(false)
      return
    }
    
    const pwdError = validatePassword(password)
    if (pwdError) {
      setPasswordError(pwdError)
      setLoading(false)
      return
    }
    
    try {
      const { data } = await api.post('/auth/register', { name, email, password, gradeLevel, recoveryEmail, phone })
      login(data.token, data.user)
      addToast('Registration successful!', 'success')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      addToast('Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden dark-gradient px-4 py-10">
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-indigo-500/30 blob" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-blue-500/30 blob" />

      <div className="w-full max-w-md relative">
        <div className="bg-slate-900/70 backdrop-blur rounded-xl shadow-2xl border border-slate-700 p-8 text-slate-100">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-slate-300 text-sm mt-1">Start your journey with EduGuide</p>
          </div>

          {error && <div className="text-red-300 mb-4 text-sm bg-red-900/30 border border-red-800 rounded px-3 py-2">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Full name</label>
              <input className="w-full bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/40 outline-none p-2.5 rounded-lg transition" placeholder="Jane Doe" value={name} onChange={e=>setName(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Email (Gmail only)</label>
              <input className="w-full bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/40 outline-none p-2.5 rounded-lg transition" placeholder="you@gmail.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Password</label>
              <input className="w-full bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/40 outline-none p-2.5 rounded-lg transition" placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
              {passwordError && <div className="text-red-300 text-xs">{passwordError}</div>}
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Grade/Class</label>
              <input className="w-full bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/40 outline-none p-2.5 rounded-lg transition" placeholder="e.g., 10, 11, 12" value={gradeLevel} onChange={e=>setGradeLevel(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Recovery Email (optional)</label>
              <input className="w-full bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/40 outline-none p-2.5 rounded-lg transition" placeholder="recovery@example.com" type="email" value={recoveryEmail} onChange={e=>setRecoveryEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Phone (optional)</label>
              <input className="w-full bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/40 outline-none p-2.5 rounded-lg transition" placeholder="+1234567890" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition transform hover:-translate-y-0.5 btn-glow">Create account</button>
          </form>

          <p className="text-sm mt-4 text-center text-slate-300">Already have an account? <Link className="text-blue-300 hover:underline" to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  )
}


