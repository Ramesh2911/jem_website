import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, FileText, HandCoins, Wallet, Bell, LogOut, Menu, X,
  TrendingUp, ArrowDownToLine, ArrowUpFromLine, History, ShieldCheck,
} from 'lucide-react'
import Logo from './Logo'

const customerNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/customer' },
  { label: 'My Profile', icon: User, to: '#' },
  { label: 'KYC & Documents', icon: FileText, to: '#' },
  { label: 'Apply for Loan', icon: HandCoins, to: '/eligibility' },
  { label: 'EMI & Payments', icon: Wallet, to: '/emi-calculator' },
  { label: 'Auto Pay', icon: ShieldCheck, to: '#' },
  { label: 'Notifications', icon: Bell, to: '#' },
]

const investorNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/investor' },
  { label: 'My Profile', icon: User, to: '#' },
  { label: 'Investments', icon: TrendingUp, to: '#' },
  { label: 'Deposit', icon: ArrowDownToLine, to: '#' },
  { label: 'Withdraw', icon: ArrowUpFromLine, to: '#' },
  { label: 'Transaction History', icon: History, to: '#' },
  { label: 'KYC & Documents', icon: FileText, to: '#' },
  { label: 'Notifications', icon: Bell, to: '#' },
]

export default function DashboardLayout({ role = 'customer', name = 'User', children }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const nav = role === 'customer' ? customerNav : investorNav

  const Sidebar = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/10">
        <Logo dark />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            onClick={() => mobile && setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-colors focus-ring ${
                isActive && to !== '#' ? 'bg-green-600 text-white' : 'text-white/65 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium text-white/65 hover:bg-white/8 hover:text-white w-full transition-colors focus-ring"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-navy-50 flex">
      <aside className="hidden lg:block w-64 bg-navy-900 shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-navy-900">
            <button onClick={() => setOpen(false)} className="absolute top-5 right-3 text-white/60">
              <X size={20} />
            </button>
            <Sidebar mobile />
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
          <div className="flex items-center gap-4">
            <button className="relative text-ink-500 focus-ring">
              <Bell size={19} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-600" />
            </button>
            <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-semibold text-[13px]">
              {name.charAt(0)}
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
