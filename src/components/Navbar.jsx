import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, LogOut, ChevronDown, CreditCard, Home } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/'); setProfileOpen(false); };

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/loan-products', label: 'Loan Products' },
    { path: '/emi-calculator', label: 'EMI Calculator' },
  ];

  const customerLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4A843] to-[#B8922E] flex items-center justify-center shadow-lg shadow-[#D4A843]/20 group-hover:scale-105 transition-transform">
              <span className="text-[#0F172A] font-extrabold text-sm">JF</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 text-[15px] tracking-tight">JEM FINANCE</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-[#0F172A] text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && customerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-[#0F172A] text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Account menu"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A5F] to-[#0F172A] flex items-center justify-center text-white text-xs font-bold">
                    {user?.first_name?.[0] || user?.profile?.first_name?.[0] || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[13px] font-semibold text-slate-700 leading-tight">{user?.first_name || user?.profile?.first_name || 'User'}</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 animate-scaleIn z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{user?.first_name || user?.profile?.first_name}</p>
                        <p className="text-xs text-slate-400">{user?.mobile || user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"><CreditCard size={16} /> Dashboard</Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"><LogOut size={16} /> Sign Out</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all">Sign In</Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-[#0F172A] text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A843]/25 transition-all">Get Started</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="md:hidden p-2 hover:bg-slate-100 rounded-lg">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200/60 bg-white animate-fadeIn">
          <div className="px-4 py-3 space-y-1">
            {publicLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === link.path ? 'bg-[#0F172A] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >{link.label}</Link>
            ))}
            {isAuthenticated && customerLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === link.path ? 'bg-[#0F172A] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >{link.label}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
