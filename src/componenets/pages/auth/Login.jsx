import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

export default function Login({ defaultRole }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Role: 'candidate' (Jobseeker) or 'employer' (Recruiter)
  const targetRole =
    defaultRole ||
    (searchParams.get('role') === 'employer' ? 'employer' : 'candidate')

  const [role, setRole] = useState(targetRole)
  const [prevTargetRole, setPrevTargetRole] = useState(targetRole)

  if (prevTargetRole !== targetRole) {
    setPrevTargetRole(targetRole)
    setRole(targetRole)
  }

  const [authMethod, setAuthMethod] = useState('password') // 'password' or 'otp'
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    otp: '',
  })
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    const candidateEndpoints = [
      'http://13.60.249.122/api',
      import.meta.env.VITE_API_URL,
      '/api',
    ].filter(Boolean)

    try {
      const payload = JSON.stringify({
        identifier: formData.identifier,
        password: formData.password,
        role: role,
      })

      let res = null
      let lastNetworkErr = null

      for (const base of candidateEndpoints) {
        try {
          const attempt = await fetch(`${base}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
          })
          res = attempt
          break
        } catch (e) {
          lastNetworkErr = e
        }
      }

      if (!res) {
        throw (
          lastNetworkErr ||
          new Error('Cannot reach backend server. Please ensure backend is running (cd backend; npm run dev).')
        )
      }

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Login failed. Please check your credentials.')
      }

      if (result.token) {
        localStorage.setItem('hirehub_token', result.token)
        localStorage.setItem('hirehub_user', JSON.stringify(result.user))
        localStorage.setItem('hirehub_role', result.user.role || role)
      }

      const roleDisplay = (result.user?.role || role) === 'employer' ? 'Employer' : 'Candidate'
      setSuccessMessage(`Logged in successfully as ${roleDisplay}! Redirecting...`)

      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      // If backend network error, provide helpful guidance
      if (err.message && err.message.includes('Failed to fetch')) {
        setErrorMessage(
          'Cannot connect to backend server at http://13.60.249.122/api. Please ensure the backend is running.'
        )
      } else {
        setErrorMessage(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] bg-[#f8fafc] py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* ============================================================== */}
        {/* ROLE SWITCHER TABS: CANDIDATE VS EMPLOYER                      */}
        {/* ============================================================== */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 sm:p-2.5 gap-2">
          <button
            type="button"
            onClick={() => {
              setRole('candidate')
              setErrorMessage('')
            }}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'candidate'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base">👤</span>
            <span>Jobseeker / Candidate Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('employer')
              setErrorMessage('')
            }}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'employer'
                ? 'bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base">🏢</span>
            <span>Employer / Recruiter Login</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* ============================================================ */}
          {/* LEFT SIDE: DYNAMIC BENEFITS BANNER BASED ON ROLE            */}
          {/* ============================================================ */}
          <div
            className={`hidden md:flex md:col-span-5 p-8 flex-col justify-between text-white ${
              role === 'employer'
                ? 'bg-gradient-to-br from-indigo-800 via-indigo-900 to-slate-900'
                : 'bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900'
            }`}
          >
            <div>
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-base font-black text-blue-700 shadow-sm">
                  H
                </span>
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  hire<span className="text-blue-300">hub</span>
                </span>
              </Link>

              {role === 'employer' ? (
                /* EMPLOYER HIGHLIGHTS */
                <div className="mt-8">
                  <span className="rounded-full bg-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-200">
                    🏢 Employer & Recruiter Zone
                  </span>
                  <h2 className="mt-3 text-2xl font-bold leading-tight">
                    Hire India's Top Tech & Business Talent
                  </h2>
                  <p className="mt-2 text-xs text-indigo-100/90 leading-relaxed">
                    Access over 500,000+ pre-vetted active jobseekers and manage your hiring pipeline.
                  </p>

                  <div className="mt-8 space-y-4 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-500/40 text-indigo-200 font-bold">
                        ⚡
                      </span>
                      <span className="text-indigo-100">
                        Post jobs for free and reach 500k+ candidates instantly
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-500/40 text-indigo-200 font-bold">
                        🎯
                      </span>
                      <span className="text-indigo-100">
                        AI-driven smart resume matching & direct recruiter messaging
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-500/40 text-indigo-200 font-bold">
                        📊
                      </span>
                      <span className="text-indigo-100">
                        Full ATS application tracking & interview scheduler
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* CANDIDATE HIGHLIGHTS */
                <div className="mt-8">
                  <span className="rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-200">
                    👤 Candidate Portal
                  </span>
                  <h2 className="mt-3 text-2xl font-bold leading-tight">
                    Find your next career breakthrough
                  </h2>
                  <p className="mt-2 text-xs text-blue-100/90 leading-relaxed">
                    Connect with 30,000+ top companies and startups hiring actively on HireHub.
                  </p>

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
              )}
            </div>

            <div className="pt-6 border-t border-white/10 text-[11px] text-slate-300">
              {role === 'employer'
                ? 'Trusted by 30,000+ companies across India'
                : 'Over 500,000+ verified professionals trust HireHub'}
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDE: LOGIN FORM                                       */}
          {/* ============================================================ */}
          <div className="p-8 sm:p-10 md:col-span-7 flex flex-col justify-center">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    role === 'employer'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {role === 'employer' ? '🏢 Employer Login' : '👤 Candidate Login'}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {role === 'employer' ? 'Log in to Recruiter Portal' : 'Log in to HireHub'}
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                {role === 'employer'
                  ? 'Enter your registered work email / username to access hiring dashboard'
                  : 'Enter your registered Email ID / Username to access your jobs dashboard'}
              </p>
            </div>

            {successMessage && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700 flex items-center gap-2 animate-fadeIn">
                <span>✓</span> {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 flex items-center gap-2 animate-fadeIn">
                <span>✕</span> {errorMessage}
              </div>
            )}

            {/* Toggle between Password and OTP Login */}
            <div className="mt-6 flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`flex-1 rounded-lg py-2 transition-all cursor-pointer ${
                  authMethod === 'password'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Use Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 rounded-lg py-2 transition-all cursor-pointer ${
                  authMethod === 'otp'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
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
                  {role === 'employer' ? 'Work Email ID / Mobile' : 'Email ID / Username / Mobile'}
                </label>
                <input
                  type="text"
                  name="identifier"
                  required
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder={
                    role === 'employer'
                      ? 'e.g. hr@company.com or 9876543210'
                      : 'e.g. pankaj.yadav@example.com or 9876543210'
                  }
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Enter 6-Digit OTP
                  </label>
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
                      className="shrink-0 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
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
                className={`mt-2 w-full rounded-xl py-3 text-xs font-bold text-white shadow-md transition-all active:scale-98 disabled:opacity-70 cursor-pointer ${
                  role === 'employer'
                    ? 'bg-indigo-700 hover:bg-indigo-800 shadow-indigo-600/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                }`}
              >
                {isLoading
                  ? 'Signing in...'
                  : role === 'employer'
                  ? 'Login as Employer'
                  : 'Login as Candidate'}
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
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
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

            {/* Signup CTA link */}
            <div className="mt-8 text-center text-xs text-slate-500">
              {role === 'employer' ? (
                <>
                  New to HireHub for Employers?{' '}
                  <Link
                    to="/signup?role=employer"
                    className="font-bold text-indigo-700 hover:underline"
                  >
                    Register company for free
                  </Link>
                </>
              ) : (
                <>
                  New to HireHub?{' '}
                  <Link
                    to="/signup?role=candidate"
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Register for free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
