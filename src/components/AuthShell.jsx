import { ShieldCheck, Zap, Sparkles, TrendingUp } from 'lucide-react'
import Logo from './Logo'

const perks = [
  { icon: Zap, label: 'Easy Login' },
  { icon: ShieldCheck, label: 'Secure & Safe' },
  { icon: Sparkles, label: 'Access Anytime' },
  { icon: TrendingUp, label: 'Manage Loans & Investments' },
]

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <Logo />
          </div>
          {children}
        </div>
      </div>

      <div className="hidden lg:flex relative bg-gradient-to-br from-navy-800 to-navy-950 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
          backgroundSize: '26px 26px'
        }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-green-600/20 blur-3xl" />
        <div className="relative text-center px-10 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
              <path d="M17 7L11 20H15.5L14 27L23 15H18L19.5 7H17Z" fill="#22A85B" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-white text-[26px]">JEM Finance</h2>
          <p className="text-white/50 text-[14.5px] mt-1">Your Financial Partner</p>

          <div className="grid grid-cols-2 gap-4 mt-10">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white/8 backdrop-blur rounded-xl p-4 text-left">
                <Icon size={18} className="text-green-400" />
                <p className="text-white/80 text-[12.5px] mt-2.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
