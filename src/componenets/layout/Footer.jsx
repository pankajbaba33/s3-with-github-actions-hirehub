import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      {/* Top Links Section */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-sm shadow-blue-200">
                H
              </span>
              <span className="text-[25px] font-extrabold tracking-tight text-slate-900">
                hire<span className="text-blue-600">hub</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              India's leading career platform connecting passionate job seekers with top tech companies, startups, and global enterprises.
            </p>

            {/* Social Icons */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Connect with us</h4>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href="#linkedin"
                  aria-label="LinkedIn"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                  </svg>
                </a>
                <a
                  href="#twitter"
                  aria-label="Twitter / X"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#facebook"
                  aria-label="Facebook"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </a>
                <a
                  href="#instagram"
                  aria-label="Instagram"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 1: Job Seekers */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-slate-900">Job Seekers</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="#jobs" className="transition-colors hover:text-blue-600">Search Jobs</Link>
              </li>
              <li>
                <Link to="#alerts" className="transition-colors hover:text-blue-600">Create Free Job Alert</Link>
              </li>
              <li>
                <Link to="#recommended" className="transition-colors hover:text-blue-600">Recommended Jobs</Link>
              </li>
              <li>
                <Link to="#fastforward" className="transition-colors hover:text-blue-600">
                  FastForward Services <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Popular</span>
                </Link>
              </li>
              <li>
                <Link to="#salary-calculator" className="transition-colors hover:text-blue-600">Salary Insights</Link>
              </li>
              <li>
                <Link to="#career-advice" className="transition-colors hover:text-blue-600">Career Advice Articles</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Employers */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-slate-900">Employers</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="#post-job" className="transition-colors hover:text-blue-600">
                  Post a Job <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">Free</span>
                </Link>
              </li>
              <li>
                <Link to="#resume-database" className="transition-colors hover:text-blue-600">Resume Database Search</Link>
              </li>
              <li>
                <Link to="#branding" className="transition-colors hover:text-blue-600">Employer Branding</Link>
              </li>
              <li>
                <Link to="#recruitment-solutions" className="transition-colors hover:text-blue-600">Enterprise Solutions</Link>
              </li>
              <li>
                <Link to="#employer-login" className="transition-colors hover:text-blue-600">Employer Login</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Trust */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-slate-900">Company & Trust</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="#about" className="transition-colors hover:text-blue-600">About Us</Link>
              </li>
              <li>
                <Link to="#careers" className="transition-colors hover:text-blue-600">Careers at HireHub</Link>
              </li>
              <li>
                <Link to="#fraud-alert" className="transition-colors hover:text-rose-600 font-medium">Fraud Alert & Security</Link>
              </li>
              <li>
                <Link to="#privacy" className="transition-colors hover:text-blue-600">Privacy Policy</Link>
              </li>
              <li>
                <Link to="#terms" className="transition-colors hover:text-blue-600">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="#contact" className="transition-colors hover:text-blue-600">Contact & Support</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Download App & Trust Strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl bg-slate-50 p-6 sm:flex-row sm:px-8 border border-slate-200">
          <div>
            <h4 className="text-base font-bold text-slate-900">Never miss an interview call!</h4>
            <p className="text-xs text-slate-500 mt-1">Download the HireHub mobile app for instant interview invites & updates.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#play-store"
              className="flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-2 text-white transition-all hover:bg-slate-800 shadow-sm"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186A2.29 2.29 0 0 1 3 20.61V3.39c0-.616.22-1.192.609-1.576zm11.605 11.608l2.25 2.25-11.83 6.76 9.58-9.01zm0-2.844L5.634 1.568l11.83 6.76-2.25 2.25zm1.422 1.422l3.473-1.985a1.73 1.73 0 0 0 0-3.003L16.636 9l2.42 2.42-2.42 2.58z" />
              </svg>
              <div className="text-left leading-none">
                <span className="block text-[10px] text-slate-300">GET IT ON</span>
                <span className="text-xs font-semibold">Google Play</span>
              </div>
            </a>
            <a
              href="#app-store"
              className="flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-2 text-white transition-all hover:bg-slate-800 shadow-sm"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 1.01-2.88-1.01.05-2.23.68-2.95 1.52-.64.73-1.2 1.79-1.05 2.83 1.13.09 2.37-.72 2.99-1.47" />
              </svg>
              <div className="text-left leading-none">
                <span className="block text-[10px] text-slate-300">Download on the</span>
                <span className="text-xs font-semibold">App Store</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="border-t border-slate-100 bg-slate-50 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-xs text-slate-500 sm:flex-row sm:px-8">
          <p>© 2026 HireHub Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link to="#security" className="hover:text-slate-800">Security Center</Link>
            <span>•</span>
            <Link to="#sitemap" className="hover:text-slate-800">Sitemap</Link>
            <span>•</span>
            <Link to="#grievance" className="hover:text-slate-800">Grievances</Link>
            <span>•</span>
            <span>All trademarks are properties of their respective owners.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
