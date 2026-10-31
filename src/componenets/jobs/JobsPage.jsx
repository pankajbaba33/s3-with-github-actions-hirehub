import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { mockJobsData, filterClientJobs } from '../../data/mockJobsData'

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const experience = searchParams.get('experience') || ''
  const location = searchParams.get('location') || ''

  // Top search bar internal state (synced with URL)
  const [inputKeyword, setInputKeyword] = useState(keyword)
  const [inputExp, setInputExp] = useState(experience)
  const [inputLocation, setInputLocation] = useState(location)
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Local filter side-bar state
  const [selectedWorkModes, setSelectedWorkModes] = useState([])
  const [selectedSalaries, setSelectedSalaries] = useState([])
  const [sortBy, setSortBy] = useState('relevance')

  // Interactive bookmark and apply states
  const [appliedJobIds, setAppliedJobIds] = useState(new Set())
  const [savedJobIds, setSavedJobIds] = useState(new Set())

  // Sync inputs with URL changes during render (Standard React pattern)
  const [prevSearch, setPrevSearch] = useState({ keyword, experience, location })
  if (
    prevSearch.keyword !== keyword ||
    prevSearch.experience !== experience ||
    prevSearch.location !== location
  ) {
    setPrevSearch({ keyword, experience, location })
    setInputKeyword(keyword)
    setInputExp(experience)
    setInputLocation(location)
  }

  // 1. Instant 0ms synchronous computation from client mock data
  const baseLocalJobs = useMemo(() => {
    const list = filterClientJobs(mockJobsData, { keyword, experience, location })
    return list.length > 0 ? list : mockJobsData
  }, [keyword, experience, location])

  // 2. Fetch live jobs directly from MongoDB database
  const [backendJobs, setBackendJobs] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2000)

    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    if (experience !== '') params.append('experience', experience)
    if (location) params.append('location', location)

    const candidateEndpoints = [
      'http://13.60.249.122/api',
      import.meta.env.VITE_API_URL,
      '/api',
    ].filter(Boolean)

    const fetchLiveJobs = async () => {
      for (const base of candidateEndpoints) {
        try {
          const res = await fetch(`${base}/jobs/search?${params.toString()}`, {
            signal: controller.signal,
          })
          if (res.ok) {
            const data = await res.json()
            if (data.success && Array.isArray(data.jobs)) {
              setBackendJobs(data.jobs)
              clearTimeout(timer)
              return
            }
          }
        } catch {
          // try next endpoint
        }
      }
    }

    fetchLiveJobs().finally(() => clearTimeout(timer))

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [keyword, experience, location])

  // 3. Apply secondary sidebar filters (Work Mode, Salary, Sort)
  const displayedJobs = useMemo(() => {
    let list = (backendJobs && backendJobs.length > 0) ? backendJobs : baseLocalJobs

    // Filter by Work Mode
    if (selectedWorkModes.length > 0) {
      list = list.filter((job) =>
        selectedWorkModes.some((mode) =>
          (job.workMode || '').toLowerCase().includes(mode.toLowerCase())
        )
      )
    }

    // Filter by Salary
    if (selectedSalaries.length > 0) {
      list = list.filter((job) => {
        const minLakhs = job.salaryMinLakhs || 0
        return selectedSalaries.some((bracket) => {
          if (bracket === '0-6') return minLakhs < 6
          if (bracket === '6-10') return minLakhs >= 6 && minLakhs <= 10
          if (bracket === '10-15') return minLakhs >= 10 && minLakhs <= 15
          if (bracket === '15+') return minLakhs >= 15
          return true
        })
      })
    }

    // Sort
    const sorted = [...list]
    if (sortBy === 'salary') {
      sorted.sort((a, b) => (b.salaryMinLakhs || 0) - (a.salaryMinLakhs || 0))
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return sorted
  }, [backendJobs, baseLocalJobs, selectedWorkModes, selectedSalaries, sortBy])

  // Search submit handler
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    setActiveDropdown(null)

    const params = new URLSearchParams()
    if (inputKeyword.trim()) params.append('keyword', inputKeyword.trim())
    if (inputExp !== '') params.append('experience', inputExp)
    if (inputLocation.trim()) params.append('location', inputLocation.trim())

    setSearchParams(params)
  }

  const toggleWorkMode = (mode) => {
    setSelectedWorkModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    )
  }

  const toggleSalary = (bracket) => {
    setSelectedSalaries((prev) =>
      prev.includes(bracket) ? prev.filter((b) => b !== bracket) : [...prev, bracket]
    )
  }

  const clearAllFilters = () => {
    setSelectedWorkModes([])
    setSelectedSalaries([])
    setSortBy('relevance')
  }

  const handleApply = (id) => {
    setAppliedJobIds((prev) => new Set(prev).add(id))
  }

  const toggleSave = (id) => {
    setSavedJobIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expOptions = [
    { label: 'Any experience', value: '' },
    { label: 'Fresher (0 years)', value: '0' },
    { label: '1 year', value: '1' },
    { label: '2 years', value: '2' },
    { label: '3 years', value: '3' },
    { label: '4 years', value: '4' },
    { label: '5 years', value: '5' },
    { label: '6+ years', value: '6' },
  ]

  const selectedExpLabel =
    expOptions.find((opt) => opt.value === inputExp)?.label || 'Select experience'

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 antialiased pb-16">
      {/* ============================================================== */}
      {/* 1. TOP NAUKRI-STYLE SEARCH BAR                                 */}
      {/* ============================================================== */}
      <section className="border-b border-slate-200/90 bg-white py-4 shadow-xs sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl sm:rounded-full border border-slate-200/90 bg-white p-1.5 shadow-md shadow-slate-200/40 transition-all hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
          >
            {/* Field 1: Keyword */}
            <div className="relative flex-1 min-w-0 px-3 py-1.5 sm:py-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase sm:hidden">Designation / Skill</div>
              <input
                type="text"
                value={inputKeyword}
                onChange={(e) => {
                  setInputKeyword(e.target.value)
                  setActiveDropdown('keyword')
                }}
                onClick={() => setActiveDropdown('keyword')}
                placeholder="Enter keyword / designation / companies"
                className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
              />

              {activeDropdown === 'keyword' && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-72 sm:w-80 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl animate-fadeIn">
                  <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Popular Roles
                  </div>
                  {['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'React.js Developer', 'Node.js Developer', 'Java Developer'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setInputKeyword(item)
                        setActiveDropdown('experience')
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 cursor-pointer"
                    >
                      <span>🔍</span>
                      <span className="font-semibold">{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="hidden sm:block h-6 w-px bg-slate-200 shrink-0" />

            {/* Field 2: Experience */}
            <div className="relative shrink-0 px-3 py-1.5 sm:py-0 border-t sm:border-t-0 border-slate-100">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'experience' ? null : 'experience')}
                className="flex items-center justify-between sm:justify-start gap-2 text-left text-sm text-slate-700 hover:text-blue-600 transition-colors outline-none cursor-pointer w-full"
              >
                <span className={`truncate ${inputExp ? 'font-semibold text-slate-800' : 'text-slate-400'}`}>
                  {selectedExpLabel}
                </span>
                <span className="text-xs text-slate-400">⌄</span>
              </button>

              {activeDropdown === 'experience' && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-60 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl animate-fadeIn">
                  <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Select Experience
                  </div>
                  {expOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setInputExp(opt.value)
                        setActiveDropdown('location')
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs transition-colors hover:bg-blue-50 flex items-center justify-between cursor-pointer ${
                        inputExp === opt.value ? 'bg-blue-50 font-bold text-blue-600' : 'text-slate-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {inputExp === opt.value && <span className="font-bold text-blue-600">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="hidden sm:block h-6 w-px bg-slate-200 shrink-0" />

            {/* Field 3: Location */}
            <div className="relative shrink-0 w-full sm:w-44 px-3 py-1.5 sm:py-0 border-t sm:border-t-0 border-slate-100">
              <input
                type="text"
                value={inputLocation}
                onChange={(e) => {
                  setInputLocation(e.target.value)
                  setActiveDropdown('location')
                }}
                onClick={() => setActiveDropdown('location')}
                placeholder="Enter location"
                className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
              />

              {activeDropdown === 'location' && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl animate-fadeIn">
                  <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Popular Locations
                  </div>
                  {['Noida', 'Bengaluru', 'Delhi / NCR', 'Gurugram', 'Remote', 'Hyderabad', 'Pune'].map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setInputLocation(loc)
                        setActiveDropdown(null)
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 cursor-pointer"
                    >
                      <span>📍</span>
                      <span className="font-semibold">{loc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 sm:mt-0 ml-0 sm:ml-2 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-full bg-[#275df5] hover:bg-blue-600 active:bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition-all cursor-pointer shrink-0"
            >
              <span>🔍 Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. BREADCRUMB & HEADER STATS                                   */}
      {/* ============================================================== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-5 pb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>&gt;</span>
          <span>Jobs</span>
          <span>&gt;</span>
          <span className="font-semibold text-slate-800">
            {keyword || 'Software & Tech'} Jobs {location ? `in ${location}` : ''}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              1 - {displayedJobs.length} of {displayedJobs.length}
              {keyword ? ` ${keyword}` : ' Tech'} Jobs
              {location ? ` in ${location}` : ''}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified active jobs matching your criteria from top companies
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 cursor-pointer shadow-2xs"
            >
              <option value="relevance">Relevance</option>
              <option value="salary">Salary (High to Low)</option>
              <option value="rating">Top Rated Companies</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN CONTENT: SIDEBAR FILTERS + JOB LISTINGS               */}
      {/* ============================================================== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* ========================================================= */}
          {/* LEFT SIDEBAR: NAUKRI ALL FILTERS                          */}
          {/* ========================================================= */}
          <aside className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                All Filters
              </h2>
              {(selectedWorkModes.length > 0 || selectedSalaries.length > 0) && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Filter: Work Mode */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5">
                Work mode
              </h3>
              <div className="space-y-2">
                {['Work from office', 'Hybrid', 'Remote'].map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedWorkModes.includes(mode)}
                      onChange={() => toggleWorkMode(mode)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Experience */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5">
                Experience
              </h3>
              <div className="space-y-1.5 text-xs">
                {expOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams)
                      if (opt.value) params.set('experience', opt.value)
                      else params.delete('experience')
                      setSearchParams(params)
                    }}
                    className={`w-full text-left py-1 px-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      (experience === opt.value || (!experience && opt.value === ''))
                        ? 'bg-blue-50 font-bold text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {(experience === opt.value || (!experience && opt.value === '')) && (
                      <span className="text-blue-600 font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Salary Range */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5">
                Salary
              </h3>
              <div className="space-y-2">
                {[
                  { label: '0-6 Lakhs', value: '0-6' },
                  { label: '6-10 Lakhs', value: '6-10' },
                  { label: '10-15 Lakhs', value: '10-15' },
                  { label: '15+ Lakhs', value: '15+' },
                ].map((sal) => (
                  <label
                    key={sal.value}
                    className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSalaries.includes(sal.value)}
                      onChange={() => toggleSalary(sal.value)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>{sal.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Popular Locations */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5">
                Location
              </h3>
              <div className="space-y-1.5 text-xs">
                {['Noida', 'Bengaluru', 'Delhi / NCR', 'Gurugram', 'Remote'].map((locName) => (
                  <button
                    key={locName}
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams)
                      params.set('location', locName)
                      setSearchParams(params)
                    }}
                    className={`w-full text-left py-1 px-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      location.toLowerCase() === locName.toLowerCase()
                        ? 'bg-blue-50 font-bold text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{locName}</span>
                    {location.toLowerCase() === locName.toLowerCase() && (
                      <span className="text-blue-600 font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: JOB CARDS                                   */}
          {/* ========================================================= */}
          <main className="lg:col-span-3 space-y-4">
            {displayedJobs.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 p-8 shadow-2xs">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-base font-bold text-slate-800">No matching jobs found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Try clearing your filters or searching for popular roles like "Frontend Developer" or "Backend Developer".
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              displayedJobs.map((job) => {
                const isApplied = appliedJobIds.has(job.id || job._id)
                const isSaved = savedJobIds.has(job.id || job._id)

                return (
                  <article
                    key={job.id || job._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs transition-all hover:border-slate-300 hover:shadow-md"
                  >
                    {/* Header Row: Title & Company + Save Bookmark */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        {/* Company Logo Badge */}
                        <div
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-bold text-sm border ${
                            job.logoBg || 'bg-blue-50 text-blue-600 border-blue-200'
                          }`}
                        >
                          {job.logoText || job.company?.charAt(0) || 'H'}
                        </div>

                        <div>
                          <h2 className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 cursor-pointer leading-snug">
                            {job.title}
                          </h2>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span className="font-semibold text-slate-800">{job.company}</span>
                            {job.rating && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                                ★ {job.rating}
                              </span>
                            )}
                            {job.reviewsCount && (
                              <span className="text-slate-400">({job.reviewsCount.toLocaleString()} Reviews)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bookmark Save Button */}
                      <button
                        type="button"
                        onClick={() => toggleSave(job.id || job._id)}
                        title={isSaved ? 'Remove Bookmark' : 'Save Job'}
                        className="text-slate-300 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                      >
                        <svg
                          className={`h-5 w-5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'fill-none'}`}
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Highlights Row: Experience, Salary, Location */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-y-1.5 gap-x-5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span>💼</span>
                        <span className="font-medium text-slate-700">
                          {job.minExperience === 0 && job.maxExperience <= 1
                            ? 'Fresher (0-1 Yrs)'
                            : `${job.minExperience || 0}-${job.maxExperience || 5} Yrs`}
                        </span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <span>💰</span>
                        <span className="font-semibold text-slate-900">
                          {job.salary || 'Not Disclosed'}
                        </span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <span>📍</span>
                        <span className="font-medium text-slate-700">
                          {job.location} {job.workMode ? `(${job.workMode})` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Description Snippet */}
                    {job.description && (
                      <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    )}

                    {/* Skills Pills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {job.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-full bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Row: Posted Time & Apply Button */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>{job.postedTime || 'Just now'}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleApply(job.id || job._id)}
                        className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                          isApplied
                            ? 'bg-emerald-600 text-white shadow-emerald-200'
                            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-200'
                        }`}
                      >
                        {isApplied ? '✓ Applied' : 'Apply Now'}
                      </button>
                    </div>
                  </article>
                )
              })
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
