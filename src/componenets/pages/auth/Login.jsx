import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [authMethod, setAuthMethod] = useState('password') // 'password' or 'otp'
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    otp: '',
  })
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSendOtp = () => {
    if (!formData.identifier) {
      alert('Please enter your mobile number or email ID to receive OTP.')
      return
    }
    setOtpSent(true)
  }

  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Login failed. Please check your credentials.')
      }

      if (result.token) {
        localStorage.setItem('hirehub_token', result.token)
        localStorage.setItem('hirehub_user', JSON.stringify(result.user))
      }

      setSuccessMessage('Logged in successfully! Redirecting to dashboard...')
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] bg-[#f8fafc] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Left Side: Naukri-style Benefit Highlights */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-8 flex-col justify-between text-white">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-base font-black text-blue-700 shadow-sm">
                H
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                hire<span className="text-blue-300">hub</span>
              </span>
            </Link>

            <div className="mt-10">
              <span className="rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-200">
                Candidate Portal
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-tight">
                Find your next career breakthrough
              </h2>
              <p className="mt-2 text-xs text-blue-100/90 leading-relaxed">
                Connect with 30,000+ top companies and startups hiring actively on HireHub.
              </p>
            </div>

            <div className="mt-8 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-500/40 text-blue-200 font-bold">
                  ✓
                </span>
                <span className="text-blue-100">
                  Direct job invitations from top verified tech recruiters
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-500/40 text-blue-200 font-bold">
                  ✓
                </span>
                <span className="text-blue-100">
                  Real-time application status tracking & interview alerts
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-500/40 text-blue-200 font-bold">
                  ✓
                </span>
                <span className="text-blue-100">
                  Personalized job recommendations tailored to your skills
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-blue-600/50 text-[11px] text-blue-200">
            Over 500,000+ verified professionals trust HireHub
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 md:col-span-7 flex flex-col justify-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Login</h1>
            <p className="mt-1 text-xs text-slate-500">
              Enter your registered Email ID / Username to access your dashboard
            </p>
          </div>

          {successMessage && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <span>✓</span> {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <span>✕</span> {errorMessage}
            </div>
          )}

          {/* Toggle between Password and OTP Login */}
          <div className="mt-6 flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`flex-1 rounded-lg py-2 transition-all ${
                authMethod === 'password'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Use Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('otp')}
              className={`flex-1 rounded-lg py-2 transition-all ${
                authMethod === 'otp'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Use OTP
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Email ID / Username / Mobile
              </label>
              <input
                type="text"
                name="identifier"
                required
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder="e.g. pankaj.yadav@example.com or 9876543210"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {authMethod === 'password' ? (
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Password reset link has been sent to your email.')
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700">Enter 6-Digit OTP</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    name="otp"
                    maxLength={6}
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="shrink-0 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    {otpSent ? 'Resend OTP' : 'Get OTP'}
                  </button>
                </div>
                {otpSent && (
                  <p className="mt-1 text-[11px] text-emerald-600">
                    OTP sent successfully to your registered device.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Google Sign-in */}
          <div className="relative mt-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => {
                setIsLoading(false)
                setSuccessMessage('Google Authentication successful!')
                setTimeout(() => navigate('/'), 800)
              }, 600)
            }}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.28v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.32 14.27c-.24-.73-.38-1.5-.38-2.27s.14-1.54.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.28 6.58l4.04 3.15c.94-2.83 3.58-4.98 6.68-4.98z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* New to HireHub Register CTA */}
          <div className="mt-8 text-center text-xs text-slate-500">
            New to HireHub?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:underline">
              Register for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
