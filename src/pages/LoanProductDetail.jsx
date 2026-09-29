import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { CheckCircle2, Percent, Clock, RefreshCw, XCircle } from 'lucide-react'
import { Button, Field, inputClass } from '../components/ui'
import { useApi } from '../lib/content'
import { normalizeProduct } from '../lib/loans'
import { errorMessage } from '../lib/api'

const tabs = ['Overview', 'Interest Rates', 'Eligibility', 'Required Documents', 'FAQ']

export default function LoanProductDetail() {
  const { slug } = useParams()
  const { data, loading, error, refetch } = useApi(slug ? `/loans/products/${slug}` : null)
  const [tab, setTab] = useState('Overview')

  const loan = normalizeProduct(data)

  if (error && error.status === 404) return <Navigate to="/loans" replace />

  if (loading) {
    return (
      <div>
        <section className="bg-gradient-to-br from-navy-800 to-navy-900 py-16 lg:py-20">
          <div className="container-page animate-pulse">
            <div className="h-3.5 w-52 bg-white/10 rounded" />
            <div className="flex items-center gap-4 mt-5">
              <div className="w-14 h-14 rounded-2xl bg-white/10" />
              <div className="space-y-2.5">
                <div className="h-7 w-64 bg-white/10 rounded" />
                <div className="h-3.5 w-44 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-10 bg-white">
          <div className="container-page space-y-4 animate-pulse">
            <div className="h-5 w-40 bg-navy-50 rounded" />
            <div className="h-40 w-full bg-navy-50 rounded-2xl" />
            <div className="h-4 w-3/4 bg-navy-50 rounded" />
            <div className="h-4 w-2/3 bg-navy-50 rounded" />
          </div>
        </section>
      </div>
    )
  }

  if (!loan) {
    if (error) {
      return (
        <div className="bg-navy-50 py-16 lg:py-20">
          <div className="container-page max-w-xl rounded-2xl bg-white ring-1 ring-navy-900/8 p-8 sm:p-10 text-center">
            <XCircle size={26} className="text-red-500 mx-auto" />
            <p className="font-display font-semibold text-navy-900 text-[18px] mt-3">Unable to load this loan</p>
            <p className="text-[14px] text-ink-500 mt-1.5">{errorMessage(error)}</p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <Button onClick={refetch}>
                <RefreshCw size={16} /> Retry
              </Button>
              <Button as={Link} to="/loans" variant="outline">
                Back to Loans
              </Button>
            </div>
          </div>
        </div>
      )
    }
    return <Navigate to="/loans" replace />
  }

  const Icon = loan.icon

  return (
    <div>
      <section
        className="relative py-16 lg:py-20 overflow-hidden"
        style={{ backgroundImage: `linear-gradient(135deg, ${loan.color}33 0%, #123C6B 45%, #0B1F3A 100%)` }}
      >
        <div className="absolute -right-16 -bottom-20 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: `${loan.color}40` }} />
        <div className="container-page relative">
          <p className="text-white/50 text-[13.5px]">
            <Link to="/loans" className="hover:text-white">Loan Products</Link> &rsaquo; {loan.name}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Icon size={26} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-[32px] sm:text-[40px] leading-tight">{loan.name}</h1>
              <p className="text-white/60 text-[15px] mt-0.5">{loan.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 border-b border-navy-900/8 bg-white">
        <div className="container-page grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <div className="bg-navy-50 rounded-2xl p-6 sm:p-7">
            <p className="text-[13px] font-semibold text-navy-900 mb-4">Apply for {loan.name}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Loan Amount">
                <input
                  type="text"
                  defaultValue={Number(loan.min_amount || 1000000).toLocaleString('en-IN')}
                  className={inputClass()}
                />
              </Field>
              <Field label="Tenure">
                <select className={inputClass()} defaultValue="">
                  <option value="" disabled>Select Tenure</option>
                  {(loan.tenureOptions || []).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Button as={Link} to="/eligibility" className="mt-5 w-full sm:w-auto">Apply Now</Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Stat icon={Percent} label="Interest Rate" value={loan.rate} />
            <Stat icon={CheckCircle2} label="Loan Amount" value={loan.amount} />
            <Stat icon={Clock} label="Tenure" value={loan.tenure} />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page border-b border-navy-900/8 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-4 text-[14.5px] font-medium whitespace-nowrap border-b-2 transition-colors focus-ring ${
                tab === t ? 'border-green-600 text-navy-900' : 'border-transparent text-ink-500 hover:text-navy-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="container-page py-12">
          {tab === 'Overview' && (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-display font-bold text-navy-900 text-[24px]">Overview</h2>
                <p className="mt-4 text-[15px] text-ink-600 leading-relaxed">{loan.description}</p>
                <ul className="mt-6 space-y-3">
                  {(loan.features || []).map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[14.5px] text-ink-700">
                      <CheckCircle2 size={17} className="text-green-600 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-navy-50 aspect-[4/3] flex items-center justify-center">
                <Icon size={64} style={{ color: loan.color }} strokeWidth={1.25} />
              </div>
            </div>
          )}

          {tab === 'Interest Rates' && (
            <div className="max-w-2xl">
              <h2 className="font-display font-bold text-navy-900 text-[24px] mb-6">Interest Rate Slabs</h2>
              <div className="rounded-xl ring-1 ring-navy-900/8 overflow-hidden">
                {(loan.rateSlabs || []).map((r, i) => (
                  <div key={`${r.tier}-${i}`} className={`flex justify-between px-5 py-4 text-[14.5px] ${i % 2 ? 'bg-navy-50' : 'bg-white'}`}>
                    <span className="text-ink-600">{r.tier}</span>
                    <span className="font-semibold text-navy-900">{r.rate}</span>
                  </div>
                ))}
                {(loan.rateSlabs || []).length === 0 && (
                  <div className="px-5 py-4 text-[14.5px] text-ink-500 bg-white">Rate details will be updated shortly.</div>
                )}
              </div>
            </div>
          )}

          {tab === 'Eligibility' && (
            <div className="max-w-2xl">
              <h2 className="font-display font-bold text-navy-900 text-[24px] mb-6">Eligibility Criteria</h2>
              {loan.eligibilityText && (
                <p className="text-[15px] text-ink-600 leading-relaxed mb-5">{loan.eligibilityText}</p>
              )}
              <ul className="space-y-3">
                {(loan.eligibilityPoints || []).map((e) => (
                  <li key={e} className="flex items-center gap-2.5 text-[14.5px] text-ink-700">
                    <CheckCircle2 size={17} className="text-green-600 shrink-0" /> {e}
                  </li>
                ))}
                {(loan.eligibilityPoints || []).length === 0 && (
                  <li className="text-[14.5px] text-ink-500">Speak with our team for detailed eligibility.</li>
                )}
              </ul>
              <Button as={Link} to="/eligibility" variant="outline" className="mt-6">Check Your Eligibility</Button>
            </div>
          )}

          {tab === 'Required Documents' && (
            <div className="max-w-2xl">
              <h2 className="font-display font-bold text-navy-900 text-[24px] mb-6">Required Documents</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {(loan.documents || []).map((d) => (
                  <div key={d} className="flex items-center gap-2.5 text-[14.5px] text-ink-700 bg-navy-50 rounded-lg px-4 py-3">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" /> {d}
                  </div>
                ))}
                {(loan.documents || []).length === 0 && (
                  <p className="text-[14.5px] text-ink-500">Document list will be updated shortly.</p>
                )}
              </div>
            </div>
          )}

          {tab === 'FAQ' && (
            <div className="max-w-2xl space-y-4">
              <h2 className="font-display font-bold text-navy-900 text-[24px] mb-2">Frequently Asked Questions</h2>
              {(loan.faqs || []).map((f, i) => (
                <div key={f.q || i} className="rounded-xl ring-1 ring-navy-900/8 p-5">
                  <p className="font-semibold text-navy-900 text-[15px]">{f.q}</p>
                  <p className="text-[14px] text-ink-500 mt-2 leading-relaxed">{f.a}</p>
                </div>
              ))}
              {(loan.faqs || []).length === 0 && (
                <p className="text-[14.5px] text-ink-500">No FAQs yet for this product.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-white ring-1 ring-navy-900/8 p-4 text-center">
      <Icon size={18} className="text-green-600 mx-auto" />
      <p className="text-[11.5px] text-ink-400 mt-2">{label}</p>
      <p className="text-[13.5px] font-semibold text-navy-900 mt-0.5 leading-tight">{value}</p>
    </div>
  )
}
