import { useState } from 'react';
import { IndianRupee, Clock, TrendingUp } from 'lucide-react';

export default function EMICalculatorPage() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(24);

  const r = rate / 12 / 100;
  const emi = r > 0 ? (amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1) : amount / tenure;
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - amount;

  return (
    <div className="min-h-[80vh] bg-[#F8FAFC]">
      <div className="bg-gradient-to-br from-[#0B1221] to-[#0F1A2E] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-bold text-[#D4A843] uppercase tracking-widest">Calculator</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3">EMI Calculator</h1>
          <p className="text-slate-400 mt-3 max-w-xl">Calculate your monthly EMI payments before you apply.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100/80 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Loan Details</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="text-slate-600 font-medium">Loan Amount</label>
                  <span className="font-bold text-slate-900">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <input type="range" min={10000} max={5000000} step={10000} value={amount} onChange={(e) => setAmount(+e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#D4A843]" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹10,000</span><span>₹50,00,000</span></div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="text-slate-600 font-medium">Interest Rate (% p.a.)</label>
                  <span className="font-bold text-slate-900">{rate}%</span>
                </div>
                <input type="range" min={1} max={30} step={0.25} value={rate} onChange={(e) => setRate(+e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#D4A843]" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1%</span><span>30%</span></div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="text-slate-600 font-medium">Tenure (Months)</label>
                  <span className="font-bold text-slate-900">{tenure} months ({(tenure / 12).toFixed(1)} years)</span>
                </div>
                <input type="range" min={6} max={360} step={1} value={tenure} onChange={(e) => setTenure(+e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#D4A843]" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>6 months</span><span>30 years</span></div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white shadow-xl">
              <p className="text-sm text-slate-400 mb-1">Monthly EMI</p>
              <p className="text-4xl font-bold tracking-tight">₹{Math.round(emi).toLocaleString('en-IN')}</p>
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#D4A843] to-[#E8C876] rounded-full" style={{ width: `${(amount / totalPayable) * 100}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-2">Principal: {((amount / totalPayable) * 100).toFixed(0)}% | Interest: {((totalInterest / totalPayable) * 100).toFixed(0)}%</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3"><IndianRupee size={16} className="text-blue-600" /></div>
                <p className="text-xs text-slate-400">Principal</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">₹{amount.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center mb-3"><TrendingUp size={16} className="text-rose-600" /></div>
                <p className="text-xs text-slate-400">Total Interest</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">₹{Math.round(totalInterest).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center mb-3"><Clock size={16} className="text-emerald-600" /></div>
              <p className="text-xs text-slate-400">Total Payable Amount</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">₹{Math.round(totalPayable).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
