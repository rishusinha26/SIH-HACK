import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '../ui/Toast.jsx'
import api from '../../api/client.js'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const [step, setStep] = useState(1) // 1: select method, 2: email, 3: phone, 4: verify OTP, 5: reset password
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [otpSent, setOtpSent] = useState(false)
  const [resetToken, setResetToken] = useState('')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/auth/forgot-password', { email, method: 'email' })
      addToast('Password reset link sent to your email!', 'success')
      setStep(1)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email')
      addToast('Failed to send reset email', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data } = await api.post('/auth/forgot-password', { phone, method: 'phone' })
      setResetToken(data.resetToken)
      setOtpSent(true)
      addToast('OTP sent to your phone number!', 'success')
      setStep(4)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
      addToast('Failed to send OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data } = await api.post('/auth/verify-otp', { otp, resetToken })
      setResetToken(data.resetToken)
      setStep(5)
      addToast('OTP verified successfully!', 'success')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
      addToast('Invalid OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      await api.post('/auth/reset-password', { 
        resetToken, 
        newPassword,
        confirmPassword 
      })
      addToast('Password reset successfully!', 'success')
      // Redirect to login
      window.location.href = '/login'
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
      addToast('Failed to reset password', 'error')
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden dark-gradient px-4 py-10">
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-blue-500/30 blob" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-indigo-500/30 blob" />

      <div className="w-full max-w-md relative">
        <div className="bg-slate-900/70 backdrop-blur rounded-xl shadow-2xl border border-slate-700 p-8 text-slate-100">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {step === 1 && 'Reset Password'}
              {step === 2 && 'Reset via Email'}
              {step === 3 && 'Reset via Phone'}
              {step === 4 && 'Verify OTP'}
              {step === 5 && 'Set New Password'}
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              {step === 1 && 'Choose how you\'d like to reset your password'}
              {step === 2 && 'Enter your email address'}
              {step === 3 && 'Enter your phone number'}
              {step === 4 && 'Enter the OTP sent to your phone'}
              {step === 5 && 'Create a new password'}
            </p>
          </div>

          {error && (
            <div className="text-red-300 mb-4 text-sm bg-red-900/30 border border-red-800 rounded px-3 py-2 flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Step 1: Select Method */}
          {step === 1 && (
            <div className="space-y-4">
              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg transition transform hover:-translate-y-0.5 btn-glow flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Reset via Email
              </button>
              
              <button
                onClick={() => setStep(3)}
                className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg transition transform hover:-translate-y-0.5 btn-glow flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Reset via Phone (OTP)
              </button>
            </div>
          )}

          {/* Step 2: Email Form */}
          {step === 2 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm text-slate-300 font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError() }}
                  className="form-input"
                  placeholder="yourname@gmail.com"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition transform hover:-translate-y-0.5 btn-glow flex items-center justify-center font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          {/* Step 3: Phone Form */}
          {step === 3 && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="phone" className="text-sm text-slate-300 font-medium">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearError() }}
                  className="form-input"
                  placeholder="+91 9876543210"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !phone.trim()}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-400 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition transform hover:-translate-y-0.5 btn-glow flex items-center justify-center font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {/* Step 4: OTP Verification */}
          {step === 4 && (
            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="otp" className="text-sm text-slate-300 font-medium">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value); clearError() }}
                  className="form-input text-center text-2xl tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-slate-400 text-center">
                  OTP sent to {phone}
                </p>
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-400 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition transform hover:-translate-y-0.5 btn-glow flex items-center justify-center font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>
          )}

          {/* Step 5: New Password */}
          {step === 5 && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="newPassword" className="text-sm text-slate-300 font-medium">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); clearError() }}
                  className="form-input"
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm text-slate-300 font-medium">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError() }}
                  className="form-input"
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition transform hover:-translate-y-0.5 btn-glow flex items-center justify-center font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 space-y-2">
            <p className="text-sm text-center text-slate-300">
              Remember your password? <Link className="text-blue-300 hover:underline font-medium" to="/login">Sign in</Link>
            </p>
            {step > 1 && (
              <p className="text-sm text-center">
                <button 
                  type="button"
                  className="text-blue-300 hover:underline font-medium"
                  onClick={() => setStep(1)}
                >
                  ← Back to options
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
