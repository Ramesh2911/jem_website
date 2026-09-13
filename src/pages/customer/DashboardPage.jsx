import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, FileText, Calculator, Shield, ArrowRight, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get('/loans/applications');
      setApplications(data.data || []);
    } catch (err) {
      console.error('Failed:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A843]/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Welcome, {user?.first_name || user?.profile?.first_name || 'Customer'}! 👋</h1>
          <p className="text-slate-400 mt-1">Here's your financial overview</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Apply Loan', icon: FileText, path: '/loan-products', gradient: 'from-blue-500 to-indigo-600' },
          { label: 'EMI Calculator', icon: Calculator, path: '/emi-calculator', gradient: 'from-emerald-500 to-green-600' },
          { label: 'KYC Status', icon: Shield, path: '/dashboard', gradient: 'from-amber-500 to-orange-500' },
          { label: 'Products', icon: CreditCard, path: '/loan-products', gradient: 'from-violet-500 to-purple-600' },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={i} to={action.path} className={`bg-white rounded-2xl p-5 border border-slate-100/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fadeIn stagger-${i + 1} group`}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-700">{action.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Loan Applications */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Loan Applications</h2>
            <p className="text-sm text-slate-500 mt-0.5">Track your loan application status</p>
          </div>
          <Link to="/loan-products" className="text-sm font-semibold text-[#D4A843] hover:text-[#B8922E] flex items-center gap-1">
            Apply New <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 skeleton" />)}</div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center"><AlertTriangle size={24} className="text-red-500" /></div>
              <p className="text-sm text-slate-600 font-medium">Couldn't load your applications</p>
              <button onClick={fetchData} className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4A843] hover:text-[#B8922E]">
                <RefreshCw size={14} /> Try again
              </button>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center"><FileText size={24} className="text-slate-400" /></div>
              <p className="text-sm text-slate-500 font-medium">No loan applications yet</p>
              <Link to="/loan-products" className="text-sm font-semibold text-[#D4A843]">Browse Loan Products →</Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Application</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">EMI</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{app.application_number}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{app.product_name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{formatCurrency(app.loan_amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(app.emi_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(app.status)}`}>
                        {app.status === 'disbursed' && <CheckCircle size={12} />}
                        {app.status === 'submitted' && <Clock size={12} />}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(app.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
