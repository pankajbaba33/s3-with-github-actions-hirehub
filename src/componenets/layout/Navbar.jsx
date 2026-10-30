import { useState } from 'react'
import { Link } from 'react-router-dom'
import TopSearchOverlay from '../search/TopSearchOverlay'

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
	{ label: 'Find jobs', href: '/jobs' },
	{ label: 'Companies', href: '#companies' },
	{ label: 'Career advice', href: '#career-advice' },
]

function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false)
	const [isTopSearchOpen, setIsTopSearchOpen] = useState(false)
	const [currentUser, setCurrentUser] = useState(() => {
		try {
			const saved = localStorage.getItem('hirehub_user')
			return saved ? JSON.parse(saved) : null
		} catch {
			return null
		}
	})

	const handleLogout = () => {
		localStorage.removeItem('hirehub_token')
		localStorage.removeItem('hirehub_user')
		localStorage.removeItem('hirehub_role')
		setCurrentUser(null)
		window.location.href = '/'
	}

	return (
		<>
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
							<Link
								key={link.label}
								to={link.href}
								className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Header Search Box: When clicked, opens the full-width TopSearchOverlay from the top! */}
					<div
						onClick={() => setIsTopSearchOpen(true)}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => e.key === 'Enter' && setIsTopSearchOpen(true)}
						className="ml-auto hidden w-full max-w-[310px] items-center rounded-full border border-slate-200 bg-slate-50 p-1 hover:border-blue-400 hover:bg-white sm:flex transition-all cursor-pointer shadow-2xs group"
					>
						<span className="min-w-0 flex-1 px-3 py-1.5 text-sm text-slate-400 group-hover:text-slate-600 select-none">
							Search jobs here
						</span>
						<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-white transition-colors group-hover:bg-blue-700 shadow-xs">
							<SearchIcon />
						</span>
					</div>

					{currentUser ? (
						<div className="ml-auto hidden shrink-0 items-center gap-3 lg:flex">
							<div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 px-3 shadow-2xs">
								<span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 font-bold text-xs text-white">
									{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
								</span>
								<span className="text-xs font-bold text-slate-800 max-w-[130px] truncate">
									{currentUser.name}
								</span>
								<span
									className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
										currentUser.role === 'employer'
											? 'bg-indigo-100 text-indigo-700'
											: 'bg-blue-100 text-blue-700'
									}`}
								>
									{currentUser.role === 'employer' ? '🏢 Employer' : '👤 Candidate'}
								</span>
							</div>

							<button
								type="button"
								onClick={handleLogout}
								className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors cursor-pointer"
							>
								Log out
							</button>
						</div>
					) : (
						<div className="ml-auto hidden shrink-0 items-center gap-4 lg:flex">
							<Link
								to="/login?role=employer"
								className="whitespace-nowrap text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600 flex items-center gap-1.5"
							>
								<span>🏢</span>
								<span>For employers</span>
							</Link>
							<span aria-hidden="true" className="h-6 w-px bg-slate-200" />
							<Link
								to="/login"
								className="whitespace-nowrap text-sm font-semibold text-slate-700 hover:text-blue-600"
							>
								Log in
							</Link>
							<Link
								to="/signup"
								className="whitespace-nowrap rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-xs"
							>
								Sign up
							</Link>
						</div>
					)}

					<button
						type="button"
						aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
						aria-expanded={menuOpen}
						onClick={() => setMenuOpen(!menuOpen)}
						className="ml-auto grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
					>
						<MenuIcon open={menuOpen} />
					</button>
				</div>

				{/* Mobile Search & Menu */}
				{menuOpen && (
					<div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white px-5 py-5 shadow-lg sm:px-8 lg:hidden">
						<div
							onClick={() => {
								setMenuOpen(false)
								setIsTopSearchOpen(true)
							}}
							className="mb-4 flex items-center justify-between rounded-full border border-slate-200 bg-slate-50 p-1 sm:hidden cursor-pointer"
						>
							<span className="min-w-0 flex-1 px-3 py-2 text-sm text-slate-400">
								Search jobs here
							</span>
							<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
								<SearchIcon />
							</span>
						</div>
						<nav aria-label="Mobile navigation" className="grid gap-1">
							{links.map((link) => (
								<Link
									key={link.label}
									to={link.href}
									onClick={() => setMenuOpen(false)}
									className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
								>
									{link.label}
								</Link>
							))}
						</nav>
						<div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-4">
							{currentUser ? (
								<div className="flex w-full items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 font-bold text-xs text-white">
											{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
										</span>
										<div>
											<p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
											<span className="text-[10px] text-slate-500 font-medium">
												{currentUser.role === 'employer' ? '🏢 Employer' : '👤 Candidate'}
											</span>
										</div>
									</div>
									<button
										type="button"
										onClick={handleLogout}
										className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
									>
										Log out
									</button>
								</div>
							) : (
								<>
									<Link
										to="/login?role=employer"
										onClick={() => setMenuOpen(false)}
										className="px-3 py-2 text-xs font-semibold text-indigo-700"
									>
										🏢 For employers
									</Link>
									<Link
										to="/login"
										onClick={() => setMenuOpen(false)}
										className="px-3 py-2 text-sm font-semibold text-slate-700"
									>
										Log in
									</Link>
									<Link
										to="/signup"
										onClick={() => setMenuOpen(false)}
										className="ml-auto rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
									>
										Sign up
									</Link>
								</>
							)}
						</div>
					</div>
				)}
			</header>

			{/* Full-width Top Search Header Overlay (Opens from the top, exact screenshot!) */}
			<TopSearchOverlay
				isOpen={isTopSearchOpen}
				onClose={() => setIsTopSearchOpen(false)}
			/>
		</>
	)
}

export default Navbar
