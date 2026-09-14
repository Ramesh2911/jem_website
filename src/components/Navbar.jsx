import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import Logo from './Logo'

const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Loans',
    to: '/loans',
    children: [
      { label: 'All Loan Products', to: '/loans' },
      { label: 'Home Loan', to: '/loans/home-loan' },
      { label: 'Check Eligibility', to: '/eligibility' },
      { label: 'EMI Calculator', to: '/emi-calculator' },
    ],
  },
  { label: 'Invest', to: '/invest' },
  { label: 'Resources', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loansOpen, setLoansOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow ${
        scrolled ? 'shadow-[0_1px_0_0_rgba(11,31,58,0.08)]' : ''
      } bg-white/90 backdrop-blur-md`}
    >
      <div className="container-page flex items-center justify-between h-[68px]">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setLoansOpen(true)}
                onMouseLeave={() => setLoansOpen(false)}
              >
                <button className="flex items-center gap-1 px-3.5 py-2 text-[15px] font-medium text-ink-900/80 hover:text-navy-900 rounded-lg transition-colors focus-ring">
                  {item.label}
                  <ChevronDown size={15} className={`transition-transform ${loansOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`absolute left-0 top-full pt-2 w-56 transition-all duration-150 ${
                    loansOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-xl ring-1 ring-navy-900/5 p-2">
                    {item.children.map((c) => (
                      <Link
                        key={c.to}
                        to={c.to}
                        className="block px-3 py-2.5 rounded-lg text-[14px] text-ink-900/80 hover:bg-navy-50 hover:text-navy-900 transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-[15px] font-medium rounded-lg transition-colors focus-ring ${
                    isActive ? 'text-navy-900' : 'text-ink-900/80 hover:text-navy-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-[15px] font-medium text-navy-900 hover:text-green-700 transition-colors focus-ring"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-[15px] font-semibold hover:bg-green-700 transition-colors shadow-[0_6px_16px_-6px_rgba(23,138,76,0.6)] focus-ring"
          >
            Apply Now
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 -mr-2 text-navy-900 focus-ring rounded-lg"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-navy-900/8 bg-white">
          <div className="container-page py-3 flex flex-col">
            {nav.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[15px] font-medium text-ink-900/85 border-b border-navy-900/5"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 flex flex-col">
                    {item.children.slice(1).map((c) => (
                      <Link
                        key={c.to}
                        to={c.to}
                        onClick={() => setOpen(false)}
                        className="py-2.5 text-[14px] text-ink-600 border-b border-navy-900/5"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-3 mt-4">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center px-4 py-2.5 rounded-lg border border-navy-900/15 text-navy-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="flex-1 text-center px-4 py-2.5 rounded-lg bg-green-600 text-white font-semibold"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
