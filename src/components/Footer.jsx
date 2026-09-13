import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0B1221] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A843] to-[#B8922E] flex items-center justify-center shadow-lg">
                <span className="text-[#0F172A] font-extrabold text-sm">JF</span>
              </div>
              <div>
                <h3 className="font-bold text-base">JEM FINANCE</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Private Limited</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">Your trusted partner in financial solutions. Providing quality lending and investment services since establishment.</p>
          </div>

          {/* Loan Products */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Loan Products</h4>
            <ul className="space-y-2.5">
              {['Home Loan', 'Personal Loan', 'Business Loan', 'Car Loan', 'Bike Loan'].map(p => (
                <li key={p}><Link to="/loan-products" className="text-sm text-slate-400 hover:text-[#D4A843] transition-colors">{p}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', path: '/' },
                { label: 'EMI Calculator', path: '/emi-calculator' },
                { label: 'Loan Products', path: '/loan-products' },
                { label: 'Contact', path: '/' },
              ].map(link => (
                <li key={link.label}><Link to={link.path} className="text-sm text-slate-400 hover:text-[#D4A843] transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Grievance Redressal'].map(p => (
                <li key={p}><a href="#" className="text-sm text-slate-400 hover:text-[#D4A843] transition-colors">{p}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} JEM Finance Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['+91-9999999999', 'info@jemfinance.com'].map(c => (
              <span key={c} className="text-xs text-slate-500">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
