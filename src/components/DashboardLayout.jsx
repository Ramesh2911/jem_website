import { useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, FileText, HandCoins, Wallet, Bell, LogOut, Menu, X,
  TrendingUp, ArrowUpFromLine, History, ShieldCheck,
} from 'lucide-react'
import Logo from './Logo'
import { api, clearSession, getUser, isAuthenticated, setUser } from '../lib/api'
import { resetCaches } from '../lib/content'

const customerNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/customer', end: true },
  { label: 'My Profile', icon: User, to: '/dashboard/customer/profile' },
  { label: 'KYC & Documents', icon: FileText, to: '/dashboard/customer/kyc' },
  { label: 'Apply for Loan', icon: HandCoins, to: '/dashboard/customer/apply' },
  { label: 'EMI & Payments', icon: Wallet, to: '/dashboard/customer/emi' },
  { label: 'Auto Pay', icon: ShieldCheck, to: '/dashboard/customer/auto-pay' },
  { label: 'Notifications', icon: Bell, to: '/dashboard/customer/notifications' },
]

const investorNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/investor', end: true },
  { label: 'My Profile', icon: User, to: '/dashboard/investor/profile' },
  { label: 'Investments', icon: TrendingUp, to: '/dashboard/investor/investments' },
  { label: 'Withdraw', icon: ArrowUpFromLine, to: '/dashboard/investor/withdraw' },
  { label: 'Transaction History', icon: History, to: '/dashboard/investor/transactions' },
  { label: 'KYC & Documents', icon: FileText, to: '/dashboard/investor/kyc' },
  { label: 'Notifications', icon: Bell, to: '/dashboard/investor/notifications' },
]

const HOME = { customer: '/dashboard/customer', investor: '/dashboard/investor' }

function Sidebar({ nav, onNavigate, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/10">
        <Logo dark />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ label, icon: Icon, to, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-colors focus-ring ${
                isActive ? 'bg-green-600 text-white' : 'text-white/65 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium text-white/65 hover:bg-white/8 hover:text-white w-full transition-colors focus-ring"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout({ role = 'customer', name = '', children }) {
  const [open, setOpen] = useState(false)
  const [me, setMe] = useState(null)
  const [unread, setUnread] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const nav = role === 'customer' ? customerNav : investorNav

  useEffect(() => {
    if (!isAuthenticated()) return undefined
    let alive = true
    api
      .get('/auth/me')
      .then((res) => {
        if (alive && res && res.data) {
          setMe(res.data)
          setUser(res.data)
        }
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // unread badge, refreshed on every route change
  useEffect(() => {
    if (!isAuthenticated()) return undefined
    let alive = true
    api
      .get('/notifications', { limit: 50 })
      .then((res) => {
        if (alive) setUnread(Number(res && res.data && res.data.unreadCount) || 0)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [location.pathname])

  const sessionUser = getUser()
  const profile = (me && me.profile) || (sessionUser && sessionUser.profile) || null
  const displayName =
    (profile && profile.first_name) ||
    (me && me.mobile) ||
    (sessionUser && sessionUser.mobile) ||
    name ||
    'User'

  const logout = async () => {
    try {
      await api.post('/auth/logout', {})
    } catch {
      /* ignore */
    }
    resetCaches()
    clearSession()
    navigate('/login', { replace: true })
  }

  const knownType = (me && me.userType) || (sessionUser && sessionUser.userType) || null

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (knownType && knownType !== role) {
    // signed in as a different portal (or staff) - send them to their own home
    return <Navigate to={HOME[knownType] || '/login'} replace />
  }

  return (
    <div className="min-h-screen bg-navy-50 flex">
      <aside className="hidden lg:block w-64 bg-navy-900 shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar nav={nav} onLogout={logout} />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-navy-900">
            <button onClick={() => setOpen(false)} className="absolute top-5 right-3 text-white/60">
              <X size={20} />
            </button>
            <Sidebar nav={nav} onNavigate={() => setOpen(false)} onLogout={logout} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-navy-900/8 flex items-center justify-between px-5 lg:px-8 sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="lg:hidden text-navy-900 focus-ring">
            <Menu size={22} />
          </button>
          <p className="font-display font-semibold text-navy-900 text-[16px] hidden lg:block">
            {role === 'customer' ? 'Customer Portal' : 'Investor Portal'}
          </p>
          <div className="flex items-center gap-3">
            <Link
              to={`${HOME[role]}/notifications`}
              aria-label="Notifications"
              className="relative text-ink-500 hover:text-navy-900 transition-colors focus-ring"
            >
              <Bell size={19} />
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-green-600 text-white text-[10px] font-bold grid place-items-center">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </Link>
            <span className="hidden sm:block text-[14px] font-semibold text-navy-900 max-w-[160px] truncate">
              {displayName}
            </span>
            <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-semibold text-[13px] shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  )
}
