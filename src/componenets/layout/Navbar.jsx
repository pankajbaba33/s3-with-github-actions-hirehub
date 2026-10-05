import { useState } from 'react'
import { Link } from 'react-router-dom'

function SearchIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
			<circle cx="10.8" cy="10.8" r="6.8" />
			<path d="m16 16 4.5 4.5" strokeLinecap="round" />
		</svg>
	)
}

function MenuIcon({ open }) {
	return open ? (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
			<path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
		</svg>
	) : (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
			<path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
		</svg>
	)
}

const links = [
	{ label: 'Find jobs', href: '#jobs' },
	{ label: 'Companies', href: '#companies' },
	{ label: 'Career advice', href: '#career-advice' },
]

function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<header className="relative z-20 border-b border-slate-200 bg-white">
			<div className="mx-auto flex min-h-[76px] max-w-7xl items-center gap-8 px-5 sm:px-8">
				<Link to="/" aria-label="HireHub home" className="flex shrink-0 items-center gap-2.5">
					<span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-sm shadow-blue-200">
						H
					</span>
					<span className="text-[25px] font-extrabold tracking-tight text-slate-900">
						hire<span className="text-blue-600">hub</span>
					</span>
				</Link>

				<nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
					{links.map((link) => (
						<Link key={link.label} to={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
							{link.label}
						</Link>
					))}
				</nav>

				<form action="/jobs" className="ml-auto hidden w-full max-w-[310px] items-center rounded-full border border-slate-200 bg-slate-50 p-1 focus-within:border-blue-400 focus-within:bg-white sm:flex">
					<label htmlFor="job-search" className="sr-only">Search jobs for india</label>
					<input
						id="job-search"
						name="q"
						type="search"
						placeholder="Job title, skill or company"
						className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
					/>
					<button type="submit" aria-label="Search jobs" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700">
						<SearchIcon />
					</button>
				</form>

				<div className="ml-auto hidden shrink-0 items-center gap-4 lg:flex">
					<Link to="#employers" className="whitespace-nowrap text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600">
						For employers
					</Link>
					<span aria-hidden="true" className="h-6 w-px bg-slate-200" />
					<Link to="/login" className="whitespace-nowrap text-sm font-semibold text-slate-700 hover:text-blue-600">
						Logs in
					</Link>
					<Link to="/signup" className="whitespace-nowrap rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
						Signs up
					</Link>
				</div>

				<button
					type="button"
					aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
					aria-expanded={menuOpen}
					onClick={() => setMenuOpen(!menuOpen)}
					className="ml-auto grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
				>
					<MenuIcon open={menuOpen} />
				</button>
			</div>

			{menuOpen && (
				<div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white px-5 py-5 shadow-lg sm:px-8 lg:hidden">
					<form action="/jobs" className="mb-4 flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 sm:hidden">
						<label htmlFor="mobile-job-search" className="sr-only">Search jobs</label>
						<input
							id="mobile-job-search"
							name="q"
							type="search"
							placeholder="Job title, skill or company"
							className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400"
						/>
						<button type="submit" aria-label="Search jobs" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
							<SearchIcon />
						</button>
					</form>
					<nav aria-label="Mobile navigation" className="grid gap-1">
						{links.map((link) => (
							<Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600">
								{link.label}
							</Link>
						))}
					</nav>
					<div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-4">
						<Link to="#employers" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm font-semibold text-slate-600">For pankaj employers</Link>
						<Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm font-semibold text-slate-700">Log in</Link>
						<Link to="/signup" onClick={() => setMenuOpen(false)} className="ml-auto rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Sign up</Link>
					</div>
				</div>
			)}
		</header>
	)
}

export default Navbar
