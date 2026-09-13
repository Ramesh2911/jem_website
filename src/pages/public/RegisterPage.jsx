import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Smartphone, Lock, User, Mail, ArrowRight, Eye, EyeOff, Users } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', mobile: '', email: '', password: '', confirmPassword: '', userType: 'customer' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    try {
      await register(form);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOTP(form.mobile, otp);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]">
      <div className="w-full max-w-lg animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4A843] to-[#B8922E] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#D4A843]/20">
              <span className="text-[#0F172A] font-extrabold text-xl">JF</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
            <p className="text-slate-500 text-sm mt-1">Join JEM Finance today</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm animate-scaleIn">{error}</div>}

          {!otpSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4A843]/30 outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Last Name</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4A843]/30 outline-none" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="Enter mobile" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4A843]/30 outline-none" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Email (Optional)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4A843]/30 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: 'customer', label: 'Customer', icon: User }, { value: 'investor', label: 'Investor', icon: Users }].map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.value} type="button" onClick={() => setForm({ ...form, userType: opt.value })}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${form.userType === opt.value ? 'border-[#D4A843] bg-[#D4A843]/5 text-[#B8922E]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                        <Icon size={16} /> {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4A843]/30 outline-none" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Confirm</label>
                  <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4A843]/30 outline-none" required />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-[#0F172A] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A843]/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                {loading ? <div className="w-5 h-5 border-2 border-[#0F172A]/30 border-t-[#0F172A] rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="text-center bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600">OTP sent to <span className="font-semibold">{form.mobile}</span></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Enter 6-digit OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="000000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-[#D4A843]/30 outline-none" required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-[#0F172A] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A843]/25 transition-all disabled:opacity-50 text-sm">
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <button type="button" onClick={() => setOtpSent(false)} className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors">← Change Details</button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account? <Link to="/login" className="text-[#D4A843] font-semibold hover:text-[#B8922E]">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
