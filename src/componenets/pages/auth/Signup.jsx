import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

export default function Signup({ defaultRole }) {
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

  // Candidate specific state
  const [workStatus, setWorkStatus] = useState('experienced') // 'experienced' or 'fresher'
  const [resumeFile, setResumeFile] = useState(null)

  // Shared, Candidate & Employer form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    city: '',
    // Candidate Job Search & Matching fields
    skills: '',
    totalExperienceYears: '1',
    currentJobTitle: '',
    // Employer fields
    companyName: '',
    designation: '',
    companySize: '11-50',
  })

  const [sendWhatsApp, setSendWhatsApp] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Build FormData for multipart upload
      const data = new FormData()
      data.append('name', formData.name)
      data.append('email', formData.email)
      data.append('password', formData.password)
      data.append('mobile', formData.mobile)
      data.append('city', formData.city)
      data.append('role', role)
      data.append('sendWhatsApp', sendWhatsApp)

      if (role === 'employer') {
        data.append('companyName', formData.companyName)
        data.append('designation', formData.designation)
        data.append('companySize', formData.companySize)
      } else {
        data.append('workStatus', workStatus)
        data.append('skills', formData.skills)
        data.append('totalExperienceYears', workStatus === 'fresher' ? '0' : formData.totalExperienceYears)
        data.append('currentJobTitle', formData.currentJobTitle)
        if (resumeFile) {
          data.append('resume', resumeFile)
        }
      }

      // Smart API endpoint resolver: tries '/api' proxy, 127.0.0.1:5000, and localhost:5000
      const candidateEndpoints = [
        import.meta.env.VITE_API_URL,
        '/api',
        'http://127.0.0.1:5000/api',
        'http://localhost:5000/api',
      ].filter(Boolean)

      let res = null
      let lastNetworkErr = null

      for (const base of candidateEndpoints) {
        try {
          const attempt = await fetch(`${base}/auth/register`, {
            method: 'POST',
            body: data,
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
        throw new Error(result.message || 'Registration failed')
      }

      // Store auth session
      if (result.token) {
        localStorage.setItem('hirehub_token', result.token)
        localStorage.setItem('hirehub_user', JSON.stringify(result.user))
        localStorage.setItem('hirehub_role', result.user?.role || role)
      }

      const roleDisplay = role === 'employer' ? 'Employer' : 'Candidate'
      setSuccessMessage(`${roleDisplay} account created successfully! Redirecting...`)

      setTimeout(() => {
        navigate('/')
      }, 1200)
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        setErrorMessage(
          'Cannot connect to backend server at http://localhost:5000. Please ensure the backend is running (cd backend; npm run dev).'
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
            <span>Jobseeker / Candidate Register</span>
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
            <span>Employer / Recruiter Register</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* ============================================================ */}
          {/* LEFT FORM SECTION                                            */}
          {/* ============================================================ */}
          <div className="p-8 sm:p-10 md:col-span-8">
            <div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  role === 'employer'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                {role === 'employer' ? '🏢 Recruiter Registration' : '👤 Candidate Registration'}
              </span>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {role === 'employer' ? 'Register as an Employer' : 'Register for Free'}
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                {role === 'employer'
                  ? 'Start hiring top talent, post job vacancies, and manage applicants easily'
                  : "Build your profile to be discovered by India's top tech recruiters"}
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

            {/* Candidate Work Status selector cards */}
            {role === 'candidate' && (
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
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {role === 'employer' ? 'Recruiter / Contact Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={role === 'employer' ? 'e.g. Rohit Sharma' : 'What is your name?'}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {role === 'employer' ? 'Official Work Email ID' : 'Email ID'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={role === 'employer' ? 'e.g. hr@company.com' : 'Tell us your Email ID'}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {/* EMPLOYER EXCLUSIVE: Company Name & Designation */}
              {role === 'employer' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="e.g. Paytm Technologies Pvt Ltd"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Your Designation</label>
                    <input
                      type="text"
                      name="designation"
                      required
                      placeholder="e.g. HR Manager / Talent Lead / Founder"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Password & Mobile */}
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

              {/* City and Company Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {role === 'employer' ? 'Company Headquarters / City' : 'Current City'}
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Bangalore, Noida, Delhi NCR, Mumbai, Hyderabad"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                {role === 'employer' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Company Size</label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                    >
                      <option value="1-10">1-10 Employees (Startup)</option>
                      <option value="11-50">11-50 Employees</option>
                      <option value="51-200">51-200 Employees</option>
                      <option value="201-500">201-500 Employees</option>
                      <option value="500+">500+ Enterprise</option>
                    </select>
                  </div>
                ) : null}
              </div>

              {/* CANDIDATE EXCLUSIVE: Skills & Experience (For Job Search & Filtering) */}
              {role === 'candidate' && (
                <div className="space-y-4 rounded-2xl bg-blue-50/40 p-4 border border-blue-100">
                  <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">
                    Job Search & Matching Preferences
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        Target Role / Current Designation
                      </label>
                      <input
                        type="text"
                        name="currentJobTitle"
                        placeholder="e.g. Frontend Developer, Full Stack, Fresher"
                        value={formData.currentJobTitle}
                        onChange={handleInputChange}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    {workStatus === 'experienced' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700">
                          Total Experience (Years)
                        </label>
                        <select
                          name="totalExperienceYears"
                          value={formData.totalExperienceYears}
                          onChange={handleInputChange}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                        >
                          <option value="1">1 Year</option>
                          <option value="2">2 Years</option>
                          <option value="3">3 Years</option>
                          <option value="4">4 Years</option>
                          <option value="5">5 Years</option>
                          <option value="6">6+ Years</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Key Skills <span className="text-slate-400 font-normal">(Comma separated)</span>
                    </label>
                    <input
                      type="text"
                      name="skills"
                      placeholder="e.g. React, JavaScript, Node.js, MongoDB, Tailwind"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      Recruiters filter candidates by these skills and experience.
                    </p>
                  </div>
                </div>
              )}

              {/* Resume Upload (Candidate only) */}
              {role === 'candidate' && (
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
                          className="text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
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
              )}

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
                  Send me important {role === 'employer' ? 'candidate applications' : 'job updates'} on <span className="font-semibold text-emerald-600">WhatsApp</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-4 w-full rounded-xl py-3 text-xs font-bold text-white shadow-md transition-all active:scale-98 disabled:opacity-70 cursor-pointer ${
                  role === 'employer'
                    ? 'bg-indigo-700 hover:bg-indigo-800 shadow-indigo-600/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                }`}
              >
                {isLoading
                  ? 'Creating Account...'
                  : role === 'employer'
                  ? 'Register as Employer'
                  : 'Register as Candidate'}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                By clicking Register, you agree to HireHub's{' '}
                <a href="#terms" className="text-blue-600 hover:underline">Terms & Conditions</a> and{' '}
                <a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
              </p>
            </form>

            {/* Already registered */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
              Already registered?{' '}
              <Link
                to={role === 'employer' ? '/login?role=employer' : '/login?role=candidate'}
                className={`font-bold hover:underline ${
                  role === 'employer' ? 'text-indigo-700' : 'text-blue-600'
                }`}
              >
                Log in here
              </Link>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDE: BENEFITS PANEL                                  */}
          {/* ============================================================ */}
          <div
            className={`hidden md:flex md:col-span-4 p-8 flex-col justify-between text-white ${
              role === 'employer'
                ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950'
                : 'bg-gradient-to-b from-slate-900 to-slate-800'
            }`}
          >
            <div>
              <h3 className="text-lg font-bold">
                {role === 'employer' ? 'Why hire on HireHub?' : 'Why register on HireHub?'}
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                {role === 'employer'
                  ? 'Trusted by 30,000+ top enterprises & high-growth startups.'
                  : 'Over 500,000+ candidates hired last year.'}
              </p>

              {role === 'employer' ? (
                /* EMPLOYER BENEFITS */
                <div className="mt-8 space-y-5 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <span>⚡</span> Fast 24-Hour Hiring
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Access pre-screened developers, engineers, and sales professionals ready to join.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span>🎯</span> AI Candidate Matching
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Save 80% screening time with automatic skills & experience scoring.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <span>🛡️</span> Verified Contact Info
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Verified mobile numbers and emails to connect directly with active candidates.
                    </p>
                  </div>
                </div>
              ) : (
                /* CANDIDATE BENEFITS */
                <div className="mt-8 space-y-5 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <span>★</span> 30,000+ Verified Companies
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Direct reach to tech recruiters and start-up founders.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span>⚡</span> 1-Click Fast Applications
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Apply to multiple openings instantly with your stored profile.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <span>📊</span> Free ATS Resume Score
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Compare your profile against top candidates and get noticed.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-white/10 p-4 border border-white/10 text-xs">
              <span className="font-bold text-white">
                {role === 'employer' ? 'Looking for a Job?' : 'Need Recruiter Account?'}
              </span>
              <p className="mt-1 text-[11px] text-slate-300">
                {role === 'employer'
                  ? 'Switch to Candidate mode to find your dream job.'
                  : 'Are you looking to hire? Post jobs free on HireHub.'}
              </p>
              <button
                type="button"
                onClick={() => setRole(role === 'employer' ? 'candidate' : 'employer')}
                className="mt-2 inline-block font-semibold text-blue-300 hover:underline cursor-pointer"
              >
                {role === 'employer' ? '← Switch to Candidate Portal' : 'Register as Employer →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
