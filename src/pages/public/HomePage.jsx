import { Link } from 'react-router-dom';
import { Shield, Clock, Headphones, TrendingUp, ArrowRight, Star, ChevronRight } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Secure & Trusted', desc: 'RBI compliant processes with bank-grade security for all transactions.', gradient: 'from-blue-500 to-indigo-600' },
  { icon: Clock, title: 'Quick Disbursal', desc: 'Get your loan approved and disbursed within 48 hours of verification.', gradient: 'from-emerald-500 to-green-600' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated relationship manager and round-the-clock customer support.', gradient: 'from-violet-500 to-purple-600' },
  { icon: TrendingUp, title: 'Best Returns', desc: 'Industry-leading returns on investment plans with flexible tenure options.', gradient: 'from-amber-500 to-orange-500' },
];

const products = [
  { name: 'Home Loan', rate: '8.5%', icon: '🏠', desc: 'Finance your dream home', gradient: 'from-blue-500/10 to-indigo-500/10' },
  { name: 'Personal Loan', rate: '14%', icon: '👤', desc: 'Quick personal financing', gradient: 'from-violet-500/10 to-purple-500/10' },
  { name: 'Business Loan', rate: '11%', icon: '💼', desc: 'Grow your business', gradient: 'from-emerald-500/10 to-green-500/10' },
  { name: 'Car Loan', rate: '8.75%', icon: '🚗', desc: 'Drive your dream car', gradient: 'from-amber-500/10 to-orange-500/10' },
  { name: 'Bike Loan', rate: '9.5%', icon: '🏍️', desc: 'Two-wheeler financing', gradient: 'from-rose-500/10 to-pink-500/10' },
  { name: 'EV Battery Loan', rate: '10%', icon: '⚡', desc: 'Go electric today', gradient: 'from-cyan-500/10 to-blue-500/10' },
];

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Business Owner', text: 'JEM Finance helped me expand my business with a hassle-free loan process. Highly recommended!', rating: 5 },
  { name: 'Priya Sharma', role: 'Software Engineer', text: 'Got my home loan approved in just 3 days. The team was very professional and helpful.', rating: 5 },
  { name: 'Amit Patel', role: 'Entrepreneur', text: 'Best investment plans with excellent returns. My portfolio has grown significantly.', rating: 5 },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1221] via-[#0F1A2E] to-[#0B1221] text-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4A843]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-full text-sm text-slate-300 mb-8 animate-fadeIn">
              <div className="w-2 h-2 rounded-full bg-[#D4A843] animate-pulse" />
              Trusted by 10,000+ customers across India
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 animate-fadeIn stagger-1">
              Financial Solutions
              <span className="block mt-2 bg-gradient-to-r from-[#D4A843] to-[#E8C876] bg-clip-text text-transparent">
                Tailored for You
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed animate-fadeIn stagger-2">
              From quick personal loans to high-yield investment plans — experience seamless financial services designed around your needs.
            </p>

            <div className="flex flex-wrap gap-4 animate-fadeIn stagger-3">
              <Link to="/register" className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-[#0F172A] font-semibold rounded-xl hover:shadow-xl hover:shadow-[#D4A843]/25 transition-all duration-300">
                Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/loan-products" className="flex items-center gap-2 px-7 py-3.5 bg-white/[0.06] border border-white/[0.1] text-white font-semibold rounded-xl hover:bg-white/[0.1] transition-all duration-300">
                Explore Products
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/[0.06] animate-fadeIn stagger-4">
              {[
                { value: '₹500Cr+', label: 'Loans Disbursed' },
                { value: '10,000+', label: 'Happy Customers' },
                { value: '4.8/5', label: 'Customer Rating' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-[#D4A843] uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Built for Your Financial Success</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className={`group p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fadeIn stagger-${i + 1}`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Loan Products */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-sm font-bold text-[#D4A843] uppercase tracking-widest">Our Products</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Loan Products</h2>
            </div>
            <Link to="/loan-products" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#D4A843] hover:text-[#B8922E] transition-colors">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <Link key={i} to="/loan-products" className={`group bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fadeIn stagger-${(i % 6) + 1}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>{p.icon}</div>
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#D4A843]">Starting {p.rate}% p.a.</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#D4A843] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-[#D4A843] uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className={`bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow animate-fadeIn stagger-${i + 1}`}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} className="text-[#D4A843] fill-[#D4A843]" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#0F172A] flex items-center justify-center text-white text-sm font-bold">{t.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0B1221] to-[#0F1A2E] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">Join thousands of satisfied customers who trust JEM Finance for their financial needs.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-[#0F172A] font-bold rounded-xl hover:shadow-xl hover:shadow-[#D4A843]/25 transition-all text-lg">
            Create Account <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
