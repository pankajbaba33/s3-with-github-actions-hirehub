import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function TopSearchOverlay({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [experience, setExperience] = useState('')
  const [location, setLocation] = useState('')

  // Active dropdown: 'keyword' | 'experience' | 'location' | null
  const [activeDropdown, setActiveDropdown] = useState(null)

  const overlayRef = useRef(null)

  // Dropdown Data
  const keywordSuggestions = [
    { title: 'Frontend Developer', category: 'Engineering' },
    { title: 'Backend Developer', category: 'Engineering' },
    { title: 'Full Stack Developer', category: 'Engineering' },
    { title: 'React.js Developer', category: 'Frontend' },
    { title: 'Node.js Developer', category: 'Backend' },
    { title: 'Python Backend Developer', category: 'Backend' },
    { title: 'Java Developer', category: 'Backend' },
    { title: 'DevOps Engineer', category: 'Cloud & Infrastructure' },
  ]

  const experienceOptions = [
    { label: 'Fresher (0 years)', value: '0', badge: 'Entry' },
    { label: '1 year', value: '1', badge: 'Junior' },
    { label: '2 years', value: '2', badge: 'Mid' },
    { label: '3 years', value: '3', badge: 'Mid' },
    { label: '4 years', value: '4', badge: 'Mid-Senior' },
    { label: '5 years', value: '5', badge: 'Senior' },
    { label: '6+ years', value: '6', badge: 'Lead' },
  ]

  const locationSuggestions = [
    { name: 'Noida', state: 'Uttar Pradesh (NCR)' },
    { name: 'Bengaluru', state: 'Karnataka' },
    { name: 'Delhi / NCR', state: 'National Capital Region' },
    { name: 'Gurugram', state: 'Haryana (NCR)' },
    { name: 'Hyderabad', state: 'Telangana' },
    { name: 'Pune', state: 'Maharashtra' },
    { name: 'Remote', state: 'Work from anywhere' },
  ]

  // Filter keyword list if typing
  const filteredKeywords = keyword.trim()
    ? keywordSuggestions.filter((item) =>
        item.title.toLowerCase().includes(keyword.trim().toLowerCase())
      )
    : keywordSuggestions

  // Filter location list if typing
  const filteredLocations = location.trim()
    ? locationSuggestions.filter((loc) =>
        loc.name.toLowerCase().includes(location.trim().toLowerCase())
      )
    : locationSuggestions

  // Close dropdown on outside click
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleDocumentClick)
    return () => document.removeEventListener('mousedown', handleDocumentClick)
  }, [])

  // Close overlay on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    setActiveDropdown(null)
    onClose()

    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    if (experience !== '') params.append('experience', experience)
    if (location) params.append('location', location)
    navigate(`/jobs?${params.toString()}`)
  }

  const selectedExpLabel =
    experienceOptions.find((opt) => opt.value === experience)?.label || 'Select experience'

  return (
    <div className="fixed inset-0 z-50">
      {/* Dimmed / Blurred Backdrop (Click to close) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
      />

      {/* Full-width Top Search Header (Exact Image Style) */}
      <div
        ref={overlayRef}
        className="relative z-50 w-full border-b border-slate-200 bg-white pt-4 pb-7 shadow-2xl animate-slideDown"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Top Row: Logo & Close Button */}
          <div className="flex items-center justify-between pb-3">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2.5 text-decoration-none"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-sm shadow-blue-200">
                H
              </span>
              <span className="text-[23px] font-extrabold tracking-tight text-slate-900">
                hire<span className="text-blue-600">hub</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Centered Floating Pill Search Bar (Exact Screenshot) */}
          <div className="mx-auto max-w-[880px] pt-1">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center rounded-full border border-slate-200/90 bg-white py-1.5 pl-4 sm:pl-6 pr-2 shadow-lg shadow-slate-200/50 transition-all hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
            >
              {/* ========================================================= */}
              {/* 1. KEYWORD INPUT & DROPDOWN (Opens on click) */}
              {/* ========================================================= */}
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value)
                    setActiveDropdown('keyword')
                  }}
                  onClick={() => setActiveDropdown('keyword')}
                  placeholder="Enter keyword / designation / companies"
                  className="w-full bg-transparent px-2 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none"
                />

                {/* Keyword Dropdown */}
                {activeDropdown === 'keyword' && (
                  <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-80 rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl animate-fadeIn">
                    <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Popular Designations & Skills
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                      {filteredKeywords.map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => {
                            setKeyword(item.title)
                            setActiveDropdown('experience') // automatically advance to experience!
                          }}
                          className="w-full px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-blue-50 flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 group-hover:text-blue-600">🔍</span>
                            <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                              {item.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{item.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider 1 */}
              <span className="mx-2 sm:mx-3 h-6 w-px bg-slate-200 shrink-0" />

              {/* ========================================================= */}
              {/* 2. EXPERIENCE BUTTON & DROPDOWN (Opens on click) */}
              {/* ========================================================= */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 'experience' ? null : 'experience')
                  }
                  className="flex items-center gap-2 px-2 py-2 text-left text-sm text-slate-400 hover:text-blue-600 transition-colors outline-none cursor-pointer"
                >
                  <span
                    className={`max-w-[130px] truncate ${
                      experience ? 'font-semibold text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {selectedExpLabel}
                  </span>
                  <svg
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                      activeDropdown === 'experience' ? 'rotate-180 text-blue-600' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Experience Dropdown */}
                {activeDropdown === 'experience' && (
                  <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-64 rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl animate-fadeIn">
                    <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Select Total Experience
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setExperience('')
                          setActiveDropdown('location')
                        }}
                        className={`w-full px-4 py-2 text-left text-xs transition-colors hover:bg-blue-50 flex items-center justify-between cursor-pointer ${
                          experience === '' ? 'bg-blue-50 font-bold text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        <span>Any Experience</span>
                        {experience === '' && <span className="text-blue-600 font-bold">✓</span>}
                      </button>

                      {experienceOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setExperience(opt.value)
                            setActiveDropdown('location') // advance to location!
                          }}
                          className={`w-full px-4 py-2 text-left text-xs transition-colors hover:bg-blue-50 flex items-center justify-between cursor-pointer ${
                            experience === opt.value
                              ? 'bg-blue-50 font-bold text-blue-600'
                              : 'text-slate-700'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 font-medium">
                            {opt.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider 2 */}
              <span className="mx-2 sm:mx-3 h-6 w-px bg-slate-200 shrink-0" />

              {/* ========================================================= */}
              {/* 3. LOCATION INPUT & DROPDOWN (Opens on click) */}
              {/* ========================================================= */}
              <div className="relative shrink-0 w-36 sm:w-48">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    setActiveDropdown('location')
                  }}
                  onClick={() => setActiveDropdown('location')}
                  placeholder="Enter location"
                  className="w-full bg-transparent px-2 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none"
                />

                {/* Location Dropdown */}
                {activeDropdown === 'location' && (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl animate-fadeIn">
                    <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Select Location
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                      {filteredLocations.map((loc) => (
                        <button
                          key={loc.name}
                          type="button"
                          onClick={() => {
                            setLocation(loc.name)
                            setActiveDropdown(null)
                          }}
                          className="w-full px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-blue-50 flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 group-hover:text-blue-600">📍</span>
                            <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                              {loc.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{loc.state}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 4. BLUE SEARCH BUTTON (Exact Screenshot) */}
              {/* ========================================================= */}
              <button
                type="submit"
                className="ml-2 sm:ml-3 inline-flex items-center gap-2 rounded-full bg-[#275df5] hover:bg-blue-600 active:bg-blue-700 px-6 sm:px-7 py-2.5 text-sm font-bold text-white shadow-xs transition-all cursor-pointer shrink-0"
              >
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

