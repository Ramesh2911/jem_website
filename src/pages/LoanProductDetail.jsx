import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { CheckCircle2, Percent, Clock } from 'lucide-react'
import { Button, Field, inputClass } from '../components/ui'
import { getLoanBySlug } from '../lib/loans'

const tabs = ['Overview', 'Interest Rates', 'Eligibility', 'Required Documents', 'FAQ']

const rateTable = [
  { tier: 'Salaried \u2014 CIBIL 750+', rate: '8.35% p.a.' },
  { tier: 'Salaried \u2014 CIBIL 700\u2013749', rate: '8.75% p.a.' },
  { tier: 'Self-employed', rate: '9.10% p.a.' },
  { tier: 'Balance transfer', rate: '8.25% p.a.' },
]

const documents = [
  'PAN card & Aadhaar card', 'Last 3 months\u2019 salary slips', 'Last 6 months\u2019 bank statements',
  'Address proof', 'Passport-size photographs', 'Property documents (if applicable)',
]

const faqs = [
  { q: 'How long does approval take?', a: 'Most applications are approved within 48\u201372 hours of document submission.' },
  { q: 'Can I prepay the loan?', a: 'Yes, with zero penalty after the first 12 EMIs on floating-rate loans.' },
]

export default function LoanProductDetail() {
  const { slug } = useParams()
  const loan = getLoanBySlug(slug)
  const [tab, setTab] = useState('Overview')

  if (!loan) return <Navigate to="/loans" replace />
  const Icon = loan.icon

  return (
    <div>
      <section className="relative bg-gradient-to-br from-navy-800 to-navy-900 py-16 lg:py-20 overflow-hidden">
        <div className="absolute -right-16 -bottom-20 w-72 h-72 rounded-full bg-green-600/15 blur-3xl" />
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
                <input type="text" defaultValue="10,00,000" className={inputClass()} />
              </Field>
              <Field label="Tenure">
                <select className={inputClass()} defaultValue="">
                  <option value="" disabled>Select Tenure</option>
                  <option>5 years</option>
                  <option>10 years</option>
                  <option>15 years</option>
                  <option>20 years</option>
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
                  {loan.features.map((f) => (
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
                {rateTable.map((r, i) => (
                  <div key={r.tier} className={`flex justify-between px-5 py-4 text-[14.5px] ${i % 2 ? 'bg-navy-50' : 'bg-white'}`}>
                    <span className="text-ink-600">{r.tier}</span>
                    <span className="font-semibold text-navy-900">{r.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Eligibility' && (
            <div className="max-w-2xl">
              <h2 className="font-display font-bold text-navy-900 text-[24px] mb-6">Eligibility Criteria</h2>
              <ul className="space-y-3">
                {['Age between 21 and 60 years', 'Minimum monthly income of ₹25,000', 'Stable employment of 2+ years or business vintage of 3+ years', 'CIBIL score of 700 or above'].map((e) => (
                  <li key={e} className="flex items-center gap-2.5 text-[14.5px] text-ink-700">
                    <CheckCircle2 size={17} className="text-green-600 shrink-0" /> {e}
                  </li>
                ))}
              </ul>
              <Button as={Link} to="/eligibility" variant="outline" className="mt-6">Check Your Eligibility</Button>
            </div>
          )}

          {tab === 'Required Documents' && (
            <div className="max-w-2xl">
              <h2 className="font-display font-bold text-navy-900 text-[24px] mb-6">Required Documents</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {documents.map((d) => (
                  <div key={d} className="flex items-center gap-2.5 text-[14.5px] text-ink-700 bg-navy-50 rounded-lg px-4 py-3">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" /> {d}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'FAQ' && (
            <div className="max-w-2xl space-y-4">
              <h2 className="font-display font-bold text-navy-900 text-[24px] mb-2">Frequently Asked Questions</h2>
              {faqs.map((f) => (
                <div key={f.q} className="rounded-xl ring-1 ring-navy-900/8 p-5">
                  <p className="font-semibold text-navy-900 text-[15px]">{f.q}</p>
                  <p className="text-[14px] text-ink-500 mt-2 leading-relaxed">{f.a}</p>
                </div>
              ))}
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
