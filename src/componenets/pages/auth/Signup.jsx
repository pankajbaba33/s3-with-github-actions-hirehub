import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()
  const [workStatus, setWorkStatus] = useState('experienced') // 'experienced' or 'fresher'
  const [resumeFile, setResumeFile] = useState(null)
  const [sendWhatsApp, setSendWhatsApp] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    city: '',
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  // Calculate password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', color: 'bg-slate-200', width: 'w-0' }
    if (pwd.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' }
    if (pwd.length < 10) return { label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' }
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' }
  }

  const strength = getPasswordStrength(formData.password)

  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Build FormData for multipart upload (Text fields + Resume file)
      const data = new FormData()
      data.append('name', formData.name)
      data.append('email', formData.email)
      data.append('password', formData.password)
      data.append('mobile', formData.mobile)
      data.append('workStatus', workStatus)
      data.append('city', formData.city)
      data.append('sendWhatsApp', sendWhatsApp)

      if (resumeFile) {
        data.append('resume', resumeFile)
      }

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      // Store auth session
      if (result.token) {
        localStorage.setItem('hirehub_token', result.token)
        localStorage.setItem('hirehub_user', JSON.stringify(result.user))
      }

      setSuccessMessage('Registration successful! Redirecting to dashboard...')
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] bg-[#f8fafc] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Left Side: Signup Form */}
        <div className="p-8 sm:p-10 md:col-span-8">
          <div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Create Candidate Profile
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Register for Free
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Build your profile to be discovered by India's top tech recruiters
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

          {/* Work Status Selector Cards (Naukri style) */}
          <div className="mt-6">
            <label className="block text-xs font-bold text-slate-700 mb-2">Work Status</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setWorkStatus('experienced')}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  workStatus === 'experienced'
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm shadow-blue-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💼</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">I'm Experienced</h4>
                    <p className="text-[11px] text-slate-500">I have work experience</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setWorkStatus('fresher')}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  workStatus === 'fresher'
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm shadow-blue-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">I'm a Fresher</h4>
                    <p className="text-[11px] text-slate-500">Student or first job seeker</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="What is your name?"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Email ID</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Tell us your Email ID"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Create a password (min 6 chars)"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {formData.password && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all`} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">{strength.label}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Mobile Number</label>
                <div className="mt-1.5 flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-500 border-r border-slate-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    placeholder="Enter mobile number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">Current City</label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Bangalore, Delhi NCR, Mumbai, Hyderabad, Pune"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Resume Upload Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Upload Resume <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="mt-1.5 rounded-2xl border-2 border-dashed border-slate-200 p-4 text-center hover:bg-slate-50 transition-colors relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {resumeFile ? (
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span className="font-semibold truncate max-w-[200px]">📄 {resumeFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setResumeFile(null)
                      }}
                      className="text-rose-500 hover:text-rose-700 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-1 text-xs font-semibold text-slate-600">
                      Click or drag & drop your resume here
                    </p>
                    <p className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 5 MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp updates checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="whatsapp-alert"
                type="checkbox"
                checked={sendWhatsApp}
                onChange={(e) => setSendWhatsApp(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="whatsapp-alert" className="text-xs text-slate-600 cursor-pointer">
                Send me important job updates & interview calls on <span className="font-semibold text-emerald-600">WhatsApp</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-70"
            >
              {isLoading ? 'Creating Account...' : 'Register Now'}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              By clicking Register now, you agree to HireHub's{' '}
              <a href="#terms" className="text-blue-600 hover:underline">Terms & Conditions</a> and{' '}
              <a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>
          </form>

          {/* Already registered */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Log in here
            </Link>
          </div>
        </div>

        {/* Right Side: Benefits Panel */}
        <div className="hidden md:flex md:col-span-4 bg-gradient-to-b from-slate-900 to-slate-800 p-8 flex-col justify-between text-white">
          <div>
            <h3 className="text-lg font-bold">Why register on HireHub?</h3>
            <p className="mt-1 text-xs text-slate-300">Over 500,000+ candidates hired last year.</p>

            <div className="mt-8 space-y-5 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span>★</span> 30,000+ Verified Companies
                </div>
                <p className="text-slate-300 text-[11px]">Direct reach to tech recruiters and start-up founders.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span>⚡</span> 1-Click Fast Applications
                </div>
                <p className="text-slate-300 text-[11px]">Apply to multiple openings instantly with your stored profile.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <span>📊</span> Free ATS Resume Score
                </div>
                <p className="text-slate-300 text-[11px]">Compare your profile against top candidates and get noticed.</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-4 border border-white/10 text-xs">
            <span className="font-bold text-white">Need Recruiter Account?</span>
            <p className="mt-1 text-[11px] text-slate-300">Are you looking to hire? Post jobs free on HireHub.</p>
            <a href="#post-job" className="mt-2 inline-block font-semibold text-blue-300 hover:underline">
              Register as Employer →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
