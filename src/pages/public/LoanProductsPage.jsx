import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Shield, CheckCircle, ArrowRight, X, AlertTriangle, PackageSearch, RefreshCw } from 'lucide-react';

export default function LoanProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get('/loans/products');
      setProducts(data.data || []);
    } catch (err) {
      console.error('Failed:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0B1221] to-[#0F1A2E] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-bold text-[#D4A843] uppercase tracking-widest">Our Products</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3">Loan Products</h1>
          <p className="text-slate-400 mt-3 max-w-xl">Choose from our range of financial products designed to meet your specific needs.</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-64 skeleton" />)}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 px-6 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center"><AlertTriangle size={24} className="text-red-500" /></div>
            <div>
              <p className="text-slate-800 font-semibold">Couldn't load loan products</p>
              <p className="text-sm text-slate-500 mt-1">Something went wrong while fetching the latest rates. Please try again.</p>
            </div>
            <button onClick={fetchProducts} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm font-semibold hover:bg-[#1E293B] transition-colors">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 px-6 flex flex-col items-center text-center gap-3 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center"><PackageSearch size={24} className="text-slate-400" /></div>
            <p className="text-slate-600 font-medium">No loan products available right now</p>
            <p className="text-sm text-slate-400">Please check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <div key={product.id} className={`bg-white rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fadeIn stagger-${(i % 6) + 1} overflow-hidden`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#0F172A] flex items-center justify-center text-white mb-4">
                    <Shield size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Interest Rate</span>
                      <span className="font-bold text-[#D4A843]">{product.interest_rate}% p.a.</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Loan Amount</span>
                      <span className="font-semibold text-slate-700">₹{Number(product.min_amount).toLocaleString('en-IN')} - ₹{Number(product.max_amount).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tenure</span>
                      <span className="font-semibold text-slate-700">{product.min_tenure} - {product.max_tenure} months</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <button onClick={() => setSelected(product)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm font-semibold hover:bg-[#1E293B] transition-colors">
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-scaleIn max-h-[80vh] overflow-y-auto">
            <button onClick={() => setSelected(null)} aria-label="Close" className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={18} /></button>
            <h2 className="text-xl font-bold text-slate-900 pr-10">{selected.name}</h2>
            <p className="text-sm text-slate-500 mt-2">{selected.description}</p>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Interest Rate', value: `${selected.interest_rate}% p.a.` },
                  { label: 'Processing Fee', value: `${selected.processing_fee}%` },
                  { label: 'Min Amount', value: `₹${Number(selected.min_amount).toLocaleString('en-IN')}` },
                  { label: 'Max Amount', value: `₹${Number(selected.max_amount).toLocaleString('en-IN')}` },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-lg font-bold text-slate-800 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Eligibility</h4>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4">{selected.eligibility}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Required Documents</h4>
                <div className="space-y-2">
                  {selected.required_documents?.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" /> {doc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
