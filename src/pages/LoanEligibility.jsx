import { useState } from 'react'
import { ShieldCheck, Gauge, Zap, Lock, CheckCircle2 } from 'lucide-react'
import { Field, inputClass, Button, Card } from '../components/ui'

const perks = [
  { icon: ShieldCheck, label: 'Know your loan amount' },
  { icon: Gauge, label: 'No impact on credit score' },
  { icon: Zap, label: 'Quick & easy process' },
  { icon: Lock, label: '100% secure' },
]

export default function LoanEligibility() {
  const [form, setForm] = useState({ loanType: '', income: '', emis: '', employment: '' })
  const [result, setResult] = useState(null)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const check = (e) => {
    e.preventDefault()
    const income = parseFloat(form.income) || 0
    const emis = parseFloat(form.emis) || 0
    const disposable = Math.max(income - emis, 0)
    const eligible = Math.round(disposable * 60)
    setResult(eligible)
  }

  return (
    <div className="bg-navy-50 py-16 lg:py-20">
      <div className="container-page">
        <div className="max-w-xl mb-12">
          <h1 className="font-display font-bold text-navy-900 text-[34px] sm:text-[40px]">Check Your Loan Eligibility</h1>
          <p className="text-ink-600 mt-3 text-[15.5px]">Find out how much you can borrow in just a few steps.</p>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
          <Card className="p-7 sm:p-8">
            <form onSubmit={check} className="grid sm:grid-cols-2 gap-5">
              <Field label="Loan Type">
                <select className={inputClass()} value={form.loanType} onChange={update('loanType')} required>
                  <option value="" disabled>Select Loan Type</option>
                  <option>Home Loan</option>
                  <option>Personal Loan</option>
                  <option>Business Loan</option>
                  <option>Car Loan</option>
                  <option>Bike Loan</option>
                </select>
              </Field>
              <Field label="Monthly Income">
                <input type="number" placeholder="Enter Monthly Income" className={inputClass()} value={form.income} onChange={update('income')} required />
              </Field>
              <Field label="Existing EMIs">
                <input type="number" placeholder="Enter Existing EMIs" className={inputClass()} value={form.emis} onChange={update('emis')} />
              </Field>
              <Field label="Employment Type">
                <select className={inputClass()} value={form.employment} onChange={update('employment')} required>
                  <option value="" disabled>Select Employment Type</option>
                  <option>Salaried</option>
                  <option>Self-Employed</option>
                  <option>Business Owner</option>
                </select>
              </Field>
              <Button type="submit" className="sm:col-span-2 mt-1">Check Eligibility</Button>
            </form>

            {result !== null && (
              <div className="mt-6 rounded-xl bg-green-100 p-5 flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-display font-semibold text-navy-900 text-[16px]">
                    You may be eligible for up to ₹{result.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[13.5px] text-green-800/80 mt-1">
                    This is an estimate. Final approval depends on credit history and document verification.
                  </p>
                </div>
              </div>
            )}
          </Card>

          <div className="relative">
            <Card className="p-7 sm:p-8">
              <p className="font-display font-semibold text-navy-900 text-[17px] mb-5">Why Check Eligibility</p>
              <ul className="space-y-4">
                {perks.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-[14.5px] text-ink-700">
                    <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-green-700" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
