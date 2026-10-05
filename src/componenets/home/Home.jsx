import React, { useState } from 'react'

export default function Home() {
  // Navigation active tab in sidebar
  const [activeMenu, setActiveMenu] = useState('home')

  // Recommended Jobs active tab
  const [recTab, setRecTab] = useState('profile') // profile, applies, preferences, you_might_like

  // Recommended Jobs Carousel page
  const [recIndex, setRecIndex] = useState(0)

  // Early access roles carousel page
  const [earlyIndex, setEarlyIndex] = useState(0)

  // Track early access interest clicked states
  const [sharedInterests, setSharedInterests] = useState(new Set())

  // Modal states
  const [showProModal, setShowProModal] = useState(false)
  const [showMiniModal, setShowMiniModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileName, setProfileName] = useState('Pankaj Yadav')
  const [profileRole, setProfileRole] = useState('Fullstack Software Developer @ uffirm technologies pvt ltd')

  // Data: Recommended Jobs by Tab
  const recommendedJobsData = {
    profile: [
      {
        id: 'rec-1',
        title: 'Frontend Developer',
        company: 'ARM World...',
        rating: 3.7,
        location: 'Gurugram',
        posted: '2d ago',
        logoText: '#',
        logoBg: 'bg-rose-50 text-rose-600 border-rose-200',
      },
      {
        id: 'rec-2',
        title: 'Senior Software En...',
        company: 'Jayceetech Softwares',
        rating: null,
        location: 'New Delhi(Shankar V...',
        posted: '3d ago',
        logoText: 'J',
        logoBg: 'bg-blue-50 text-blue-600 border-blue-200',
      },
      {
        id: 'rec-3',
        title: 'Frontend Develo...',
        company: 'Onesoft Tec...',
        rating: 3.9,
        location: 'Remote',
        posted: '4d ago',
        logoText: 'O',
        logoBg: 'bg-red-50 text-red-600 border-red-200',
      },
      {
        id: 'rec-4',
        title: 'React.js Engineer',
        company: 'Cognizant Tech',
        rating: 4.1,
        location: 'Noida / Hybrid',
        posted: '1d ago',
        logoText: 'C',
        logoBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      },
      {
        id: 'rec-5',
        title: 'Full Stack MERN Lead',
        company: 'Wipro Digital',
        rating: 4.0,
        location: 'Bangalore',
        posted: 'Just now',
        logoText: 'W',
        logoBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      },
    ],
    applies: [
      {
        id: 'app-1',
        title: 'Lead UI Developer',
        company: 'Paytm Payments',
        rating: 3.8,
        location: 'Noida',
        posted: 'Applied 1d ago',
        logoText: 'P',
        logoBg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      },
      {
        id: 'app-2',
        title: 'Senior Javascript Eng.',
        company: 'InfoEdge India',
        rating: 4.3,
        location: 'Gurugram',
        posted: 'Applied 3d ago',
        logoText: 'IE',
        logoBg: 'bg-amber-50 text-amber-600 border-amber-200',
      },
    ],
    preferences: [
      {
        id: 'pref-1',
        title: 'Remote React Developer',
        company: 'Zomato Tech',
        rating: 4.2,
        location: 'Remote (India)',
        posted: '1d ago',
        logoText: 'Z',
        logoBg: 'bg-red-50 text-red-600 border-red-200',
      },
      {
        id: 'pref-2',
        title: 'Staff Software Architect',
        company: 'Flipkart Labs',
        rating: 4.4,
        location: 'Bangalore',
        posted: '2d ago',
        logoText: 'FK',
        logoBg: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      },
    ],
    you_might_like: [
      {
        id: 'yml-1',
        title: 'Next.js / TypeScript Dev',
        company: 'Blinkit Commerce',
        rating: 4.1,
        location: 'Gurugram',
        posted: 'Today',
        logoText: 'B',
        logoBg: 'bg-green-50 text-green-600 border-green-200',
      },
      {
        id: 'yml-2',
        title: 'Senior Frontend Specialist',
        company: 'Amazon Web Services',
        rating: 4.5,
        location: 'Hyderabad',
        posted: '3d ago',
        logoText: 'A',
        logoBg: 'bg-orange-50 text-orange-600 border-orange-200',
      },
    ],
  }

  // Data: Early Access Roles
  const earlyAccessRoles = [
    {
      id: 'early-1',
      title: 'Java Full Stack Developer',
      companyType: 'Foreign IT Consulting MNC',
      rating: '3.5+',
      badges: ['Foreign MNC', 'Service'],
      experience: '3-5 Yrs',
      salary: '₹ 4-9 Lacs P.A.',
      location: 'Hyderabad, Pun...',
      posted: '1d ago',
      companies: ['RBS', 'Sonata', 'BofA', 'HSBC', 'AXA'],
    },
    {
      id: 'early-2',
      title: 'React Js Developer',
      companyType: 'Large IT Services & Con...',
      rating: '3.0+',
      badges: ['Corporate'],
      experience: '4-9 Yrs',
      salary: '₹ 6-11 Lacs P.A.',
      location: 'Bangalore, Pune, Delhi NCR',
      posted: 'Today',
      companies: ['TCS', 'Infosys', 'Capgemini', 'AXA'],
    },
    {
      id: 'early-3',
      title: 'Senior MERN Stack Lead',
      companyType: 'Product Engineering Enterprise',
      rating: '4.2+',
      badges: ['Product Tech', 'Unicorn'],
      experience: '4-8 Yrs',
      salary: '₹ 15-24 Lacs P.A.',
      location: 'Gurugram / Remote',
      posted: '2d ago',
      companies: ['Swiggy', 'Paytm', 'Razorpay'],
    },
  ]

  const activeRecList = recommendedJobsData[recTab] || []

  const toggleInterest = (id) => {
    setSharedInterests((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] py-6 text-slate-800 antialiased">
      <div className="mx-auto max-w-[1260px] px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Candidate Profile & Performance Card */}
          {/* ========================================================= */}
          <div className="space-y-4 lg:col-span-3">
            {/* Profile Overview Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm text-center">
              {/* Profile Avatar with 92% circular completion ring */}
              <div className="relative mx-auto h-24 w-24">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                  {/* Track circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                  />
                  {/* Progress stroke: 92% of perimeter ~276.4 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeDasharray="276.4"
                    strokeDashoffset="22"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Inner Avatar photo */}
                <div className="absolute inset-[7px] overflow-hidden rounded-full bg-slate-100 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt={profileName}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Percentage pill at bottom center of avatar */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-green-200 bg-white px-2 py-0.5 text-[11px] font-bold text-green-600 shadow-sm">
                  92%
                </span>
              </div>

              {/* Name & Title */}
              <h2 className="mt-4 text-base font-bold text-slate-900">{profileName}</h2>
              <p className="mt-1 text-xs text-slate-600 leading-snug">
                {profileRole}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Last updated today</p>

              {/* Complete Profile Button */}
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#185adb] px-6 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
              >
                Complete profile
              </button>

              {/* Profile Performance Box */}
              <div className="mt-6 rounded-xl border border-slate-100 bg-[#f8fafc] p-3 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    Profile performance
                    <button
                      type="button"
                      title="Profile search stats calculated over last 90 days"
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ⓘ
                    </button>
                  </span>
                </div>

                {/* Performance numbers */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 leading-none">Search appearances</span>
                    <p className="mt-1 font-bold text-blue-600 hover:underline cursor-pointer">
                      3150 <span className="text-slate-400 font-normal">&gt;</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 leading-none">Recruiter actions</span>
                    <p className="mt-1 font-bold text-blue-600 hover:underline cursor-pointer">
                      118 <span className="text-slate-400 font-normal">&gt;</span>
                    </p>
                  </div>
                </div>

                {/* 3X Boost Banner Callout */}
                <div
                  onClick={() => setShowProModal(true)}
                  className="mt-3 flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2.5 text-xs text-slate-700 hover:bg-blue-50/50 hover:border-blue-200 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">⚡</span>
                    <span className="text-[11px] font-medium leading-tight text-slate-700">
                      Upto 3X boost to your profile performance
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs font-bold">&gt;</span>
                </div>
              </div>

              {/* Navigation Menu List */}
              <nav className="mt-5 space-y-1 text-left text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveMenu('home')}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 transition-colors ${
                    activeMenu === 'home'
                      ? 'bg-slate-100 font-bold text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  My home
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMenu('jobs')}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 transition-colors ${
                    activeMenu === 'jobs'
                      ? 'bg-slate-100 font-bold text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Jobs
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMenu('companies')}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 transition-colors ${
                    activeMenu === 'companies'
                      ? 'bg-slate-100 font-bold text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Companies
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMenu('blogs')}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 transition-colors ${
                    activeMenu === 'blogs'
                      ? 'bg-slate-100 font-bold text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Blogs
                </button>
              </nav>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CENTER COLUMN: Main Feed (PRO, Recommended, Early Access) */}
          {/* ========================================================= */}
          <div className="space-y-5 lg:col-span-6">
            {/* 1. "With PRO you get hired faster" Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-r from-[#fff9f2] via-[#fffbf6] to-[#fef6ea] p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                {/* Left Promo text & CTA */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-600">With</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black tracking-tight text-[#b85a0c]">PRO</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fdecdb] text-sm text-[#b85a0c]">
                      👑
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">you get hired faster</p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowProModal(true)}
                      className="rounded-full bg-gradient-to-r from-[#ea580c] to-[#c2410c] px-5 py-2 text-xs font-bold text-white shadow-sm shadow-orange-500/20 hover:from-[#d94e08] hover:to-[#9a3412] active:scale-95 transition-all"
                    >
                      Become a Pro
                    </button>
                  </div>
                </div>

                {/* Right comparison mini table */}
                <div className="w-full sm:w-auto min-w-[270px] rounded-xl bg-white/70 p-3 backdrop-blur-sm border border-amber-200/50 text-[11px]">
                  <div className="grid grid-cols-12 pb-2 text-[10px] font-bold text-slate-500 border-b border-amber-100">
                    <div className="col-span-8">What you will get</div>
                    <div className="col-span-2 text-center text-slate-400">You</div>
                    <div className="col-span-2 text-center">
                      <span className="rounded bg-amber-100 px-1 py-0.5 text-[#b85a0c] font-black">PRO</span>
                    </div>
                  </div>

                  <div className="divide-y divide-amber-50">
                    <div className="grid grid-cols-12 py-2 items-center text-slate-700">
                      <div className="col-span-8 flex items-center gap-1.5 font-medium">
                        <span className="text-amber-500">✦</span> Hidden job invitations
                      </div>
                      <div className="col-span-2 text-center text-slate-300 font-bold">—</div>
                      <div className="col-span-2 text-center text-[#ea580c] font-bold">✓</div>
                    </div>

                    <div className="grid grid-cols-12 py-2 items-center text-slate-700">
                      <div className="col-span-8 flex items-center gap-1.5 font-medium">
                        <span className="text-amber-500">✦</span> AI-enhanced profile
                      </div>
                      <div className="col-span-2 text-center text-slate-300 font-bold">—</div>
                      <div className="col-span-2 text-center text-[#ea580c] font-bold">✓</div>
                    </div>

                    <div className="grid grid-cols-12 py-2 items-center text-slate-700">
                      <div className="col-span-8 flex items-center gap-1.5 font-medium">
                        <span className="text-amber-500">✦</span> Auto-Apply on Naukri
                      </div>
                      <div className="col-span-2 text-center text-slate-300 font-bold">—</div>
                      <div className="col-span-2 text-center text-[#ea580c] font-bold">✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. "Recommended jobs for you" Card with horizontal cards */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Recommended jobs for you</h3>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#185adb] hover:underline"
                >
                  View all
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-3 flex items-center gap-6 border-b border-slate-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setRecTab('profile')
                    setRecIndex(0)
                  }}
                  className={`pb-2.5 transition-colors ${
                    recTab === 'profile'
                      ? 'border-b-2 border-slate-900 font-bold text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Profile (60)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecTab('applies')
                    setRecIndex(0)
                  }}
                  className={`pb-2.5 transition-colors ${
                    recTab === 'applies'
                      ? 'border-b-2 border-slate-900 font-bold text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Applies (61)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecTab('preferences')
                    setRecIndex(0)
                  }}
                  className={`pb-2.5 transition-colors ${
                    recTab === 'preferences'
                      ? 'border-b-2 border-slate-900 font-bold text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Preferences (60)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecTab('you_might_like')
                    setRecIndex(0)
                  }}
                  className={`pb-2.5 transition-colors ${
                    recTab === 'you_might_like'
                      ? 'border-b-2 border-slate-900 font-bold text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  You might like (74)
                </button>
              </div>

              {/* Carousel container */}
              <div className="relative mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeRecList.slice(recIndex, recIndex + 3).map((job) => (
                    <div
                      key={job.id}
                      className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md cursor-pointer"
                    >
                      <div>
                        {/* Logo & Posted time */}
                        <div className="flex items-center justify-between">
                          <div className={`grid h-8 w-8 place-items-center rounded-lg border text-xs font-bold ${job.logoBg}`}>
                            {job.logoText}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">{job.posted}</span>
                        </div>

                        {/* Title */}
                        <h4 className="mt-2.5 text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                          {job.title}
                        </h4>

                        {/* Company & Rating */}
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="truncate max-w-[90px]">{job.company}</span>
                          {job.rating && (
                            <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                              ★ {job.rating}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400 truncate">
                        <span>📍</span>
                        <span className="truncate">{job.location}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Arrow Carousel Button */}
                {activeRecList.length > 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      setRecIndex((prev) => (prev + 1 >= activeRecList.length - 2 ? 0 : prev + 1))
                    }}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-slate-50 hover:text-blue-600"
                  >
                    &gt;
                  </button>
                )}
              </div>
            </div>

            {/* 3. "75 Early access roles from top companies" Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="text-xl">✈️</div>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                      75 Early access roles from top companies
                      <button type="button" title="Confidential recruiter listings" className="text-slate-400">
                        ⓘ
                      </button>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      See what recruiters are searching for, even before they post a job
                    </p>
                  </div>
                </div>

                <button type="button" className="text-xs font-semibold text-[#185adb] hover:underline shrink-0">
                  View all
                </button>
              </div>

              {/* Early Access Cards Row */}
              <div className="relative mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {earlyAccessRoles.slice(earlyIndex, earlyIndex + 2).map((role) => {
                    const isShared = sharedInterests.has(role.id)
                    return (
                      <div
                        key={role.id}
                        className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{role.title}</h4>
                            <span className="text-[10px] text-slate-400 shrink-0">{role.posted}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{role.companyType}</p>

                          {/* Badges */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                            <span className="rounded bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-600 border border-amber-200">
                              ★ {role.rating}
                            </span>
                            {role.badges.map((b) => (
                              <span key={b} className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                                {b}
                              </span>
                            ))}
                          </div>

                          {/* Meta details */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-600 font-medium">
                            <span className="flex items-center gap-1">💼 {role.experience}</span>
                            <span>•</span>
                            <span>{role.salary}</span>
                            <span>•</span>
                            <span className="truncate max-w-[100px]">📍 {role.location}</span>
                          </div>
                        </div>

                        {/* Bottom Hiring For logos & Share Interest CTA */}
                        <div className="mt-3.5 pt-3 border-t border-slate-100">
                          <p className="text-[10px] text-slate-400">Hiring for one of these companies</p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            {/* Dummy brand initials / logos */}
                            <div className="flex items-center -space-x-1.5">
                              {role.companies.map((c, i) => (
                                <div
                                  key={c + i}
                                  className="grid h-6 w-6 place-items-center rounded-full bg-slate-800 text-[8px] font-bold text-white border-2 border-white shadow-xs"
                                  title={c}
                                >
                                  {c.substring(0, 2)}
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleInterest(role.id)}
                              className={`rounded-full px-3.5 py-1 text-[11px] font-semibold transition-all ${
                                isShared
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-300'
                                  : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                              }`}
                            >
                              {isShared ? 'Interest Shared ✓' : 'Share interest'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Right Arrow Carousel Button */}
                {earlyAccessRoles.length > 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      setEarlyIndex((prev) => (prev + 1 >= earlyAccessRoles.length - 1 ? 0 : prev + 1))
                    }}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-slate-50 hover:text-blue-600"
                  >
                    &gt;
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: minis (Career Shorts) & Job Offers Guide */}
          {/* ========================================================= */}
          <div className="space-y-4 lg:col-span-3">
            {/* 1. minis Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm text-center">
              {/* minis Logo and Header */}
              <div className="flex items-center justify-center gap-1 text-lg font-black tracking-tight">
                <span className="text-purple-600">m</span>
                <span className="text-pink-500">i</span>
                <span className="text-amber-500">n</span>
                <span className="text-blue-600">i</span>
                <span className="text-emerald-500">s</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">Explore top career content</p>

              {/* Stacked Reels / Stories preview mockup */}
              <div className="relative mx-auto mt-4 h-52 w-40">
                {/* Background tilted card left */}
                <div className="absolute inset-0 -rotate-6 rounded-2xl bg-slate-200 opacity-60 shadow-sm" />
                {/* Background tilted card right */}
                <div className="absolute inset-0 rotate-6 rounded-2xl bg-slate-300 opacity-60 shadow-sm" />

                {/* Main front video reel card */}
                <div
                  onClick={() => setShowMiniModal(true)}
                  className="group relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-900 via-purple-900 to-black p-3 text-white shadow-xl cursor-pointer"
                >
                  {/* Subtle video reel content simulation */}
                  <div className="flex flex-col justify-between h-full text-center">
                    <span className="rounded bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs self-center">
                      THE PEPSI STORY
                    </span>

                    <div className="space-y-1">
                      <p className="text-[10px] font-extrabold tracking-wide uppercase text-amber-300">
                        A GENERATION
                      </p>
                      <span className="inline-block rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-slate-200">
                        PART 5 / 7
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-white/30 backdrop-blur-md group-hover:scale-110 transition-transform">
                        ▶
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explore MINIs Button */}
              <button
                type="button"
                onClick={() => setShowMiniModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#185adb] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
              >
                <span>▷</span> Explore MINIs
              </button>
            </div>

            {/* 2. Free Job Posting Guide Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
              {/* Header Image simulation (Notepad / Job offers desk) */}
              <div className="relative h-28 w-full bg-gradient-to-r from-amber-100 to-slate-200 overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80"
                  alt="Job description posting guide"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                  <span className="rounded-lg bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs">
                    Job Description
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  Free Job Posting: Step-by-Step Guide to Hiring Effectively on Naukri
                </h4>
                <a
                  href="#know-more"
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#185adb] hover:underline"
                >
                  Know more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: Become a PRO Details */}
      {/* ========================================================= */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowProModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ✕
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#b85a0c]">HireHub PRO</span>
              <span className="text-xl">👑</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Get hired 3x faster with priority profile visibility and automated recruiter reach.
            </p>

            <div className="mt-5 space-y-3 text-xs">
              <div className="flex items-start gap-3 rounded-xl bg-amber-50/60 p-3 border border-amber-200">
                <span className="text-amber-600 font-bold text-base">✦</span>
                <div>
                  <h5 className="font-bold text-slate-900">Direct Recruiter Messages</h5>
                  <p className="text-slate-500">Access unlisted confidential jobs before they are publicly published.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-blue-50/60 p-3 border border-blue-200">
                <span className="text-blue-600 font-bold text-base">✦</span>
                <div>
                  <h5 className="font-bold text-slate-900">AI Resume Optimizer</h5>
                  <p className="text-slate-500">Automated ATS keyword injection matching job descriptions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-emerald-50/60 p-3 border border-emerald-200">
                <span className="text-emerald-600 font-bold text-base">✦</span>
                <div>
                  <h5 className="font-bold text-slate-900">Auto-Apply on Relevant Matches</h5>
                  <p className="text-slate-500">Let HireHub apply to verified openings matching your exact skills.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <span className="text-xs text-slate-400">Special Early Access</span>
                <p className="text-base font-bold text-slate-900">₹899 <span className="text-xs font-normal text-slate-500">/ 3 months</span></p>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert('Thank you for choosing PRO! Upgrading profile...')
                  setShowProModal(false)
                }}
                className="rounded-full bg-gradient-to-r from-[#ea580c] to-[#c2410c] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:from-[#d94e08]"
              >
                Activate PRO Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: MINIs Reel Player */}
      {/* ========================================================= */}
      {showMiniModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800">
            <button
              onClick={() => setShowMiniModal(false)}
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white hover:bg-black/80"
            >
              ✕
            </button>

            {/* Video Simulator */}
            <div className="relative aspect-[9/16] w-full bg-gradient-to-b from-indigo-950 via-purple-950 to-black p-6 flex flex-col justify-between">
              <div className="mt-8 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-amber-400 grid place-items-center font-black text-slate-900 text-xs">
                  BW
                </div>
                <div>
                  <h5 className="text-xs font-bold">BrandWars Career Stories</h5>
                  <p className="text-[10px] text-slate-400">3 days ago • Episode 5</p>
                </div>
              </div>

              <div className="my-auto text-center space-y-2">
                <h3 className="text-xl font-extrabold text-amber-300">The Pepsi Story</h3>
                <p className="text-xs text-slate-200">How marketing disruption redefined an entire generation.</p>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/20 backdrop-blur-md cursor-pointer hover:scale-105 transition-transform">
                  ▶
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-blue-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Part 5 of 7</span>
                  <span className="text-blue-400 font-semibold cursor-pointer">Next Episode →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: Complete Profile Editor */}
      {/* ========================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-slate-900">Update Profile Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">Keep your details up to date to get 3x more recruiter visits.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setShowProfileModal(false)
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Headline / Current Role & Company</label>
                <input
                  type="text"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}
