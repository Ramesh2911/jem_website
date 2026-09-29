import { useMemo, useState } from 'react'
import { ShieldCheck, Gauge, Zap, Lock, CheckCircle2, XCircle, RefreshCw, Loader2 } from 'lucide-react'
import { Field, inputClass, Button, Card } from '../components/ui'
import { useApi } from '../lib/content'
import { normalizeProduct, employmentLabel, checkEligibility, formatCurrency, formatTenure } from '../lib/loans'
import { errorMessage } from '../lib/api'

const perks = [
  { icon: ShieldCheck, label: 'Know your loan amount' },
  { icon: Gauge, label: 'No impact on credit score' },
  { icon: Zap, label: 'Quick & easy process' },
  { icon: Lock, label: '100% secure' },
]

const fallbackEmployment = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'self_employed', label: 'Self-Employed' },
  { value: 'business', label: 'Business Owner' },
]

const emptyForm = {
  loanType: '', amount: '', tenure: '', creditScore: '', income: '', emis: '', employment: '',
}

export default function LoanEligibility() {
  const { data, loading, error, refetch } = useApi('/loans/products')
  const products = useMemo(
    () => (Array.isArray(data) ? data : []).map(normalizeProduct).filter(Boolean),
    [data],
  )

  const employmentOptions = useMemo(() => {
    const seen = new Map()
    products.forEach((p) => {
      (p.employmentTypes || []).forEach((t) => {
        if (t && t.value && !seen.has(t.value)) seen.set(t.value, t.label || employmentLabel(t.value))
      })
    })
    return seen.size ? [...seen].map(([value, label]) => ({ value, label })) : fallbackEmployment
  }, [products])

  const [form, setForm] = useState(emptyForm)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const selected = products.find((p) => p.slug === form.loanType) || null

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onLoanType = (e) => {
    const slug = e.target.value
    const prod = products.find((p) => p.slug === slug)
    setForm((f) => ({
      ...f,
      loanType: slug,
      amount: prod && prod.min_amount ? String(prod.min_amount) : '',
      tenure: prod && prod.tenureOptions && prod.tenureOptions.length ? String(prod.tenureOptions[0].value) : '',
    }))
    setResult(null)
    setSubmitError(null)
  }

  const check = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await checkEligibility({
        slug: form.loanType,
        loanAmount: Number(form.amount) || undefined,
        tenureMonths: Number(form.tenure) || undefined,
        employmentType: form.employment || undefined,
        monthlyIncome: Number(form.income) || undefined,
        creditScore: Number(form.creditScore) || undefined,
        existingEmis: Number(form.emis) || 0,
      })
      if (!res) throw new Error('No response received from the server')
      setResult(res)
    } catch (err) {
      setResult(null)
      setSubmitError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const checks = (result && result.checks) || []
  const reasons = (result && result.reasons) || []
  const limits = (result && result.limits) || null
  const quote = (result && result.quote) || null
  const eligibleTenure = (limits && limits.eligibleTenure) || null

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
                <select className={inputClass()} value={form.loanType} onChange={onLoanType} required disabled={loading && products.length === 0}>
                  <option value="" disabled>{loading && products.length === 0 ? 'Loading loan types…' : 'Select Loan Type'}</option>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Monthly Income">
                <input type="number" min="0" placeholder="Enter Monthly Income" className={inputClass()} value={form.income} onChange={update('income')} required />
              </Field>

              <Field label="Loan Amount" hint={selected && selected.min_amount && selected.max_amount ? `Between ${formatCurrency(selected.min_amount)} and ${formatCurrency(selected.max_amount)}` : 'Select a loan type'}>
                <input
                  type="number"
                  min={selected ? selected.min_amount : undefined}
                  max={selected ? selected.max_amount : undefined}
                  step="1000"
                  placeholder="Enter Loan Amount"
                  className={inputClass()}
                  value={form.amount}
                  onChange={update('amount')}
                  required
                />
              </Field>

              <Field label="Tenure (Months)">
                <select className={inputClass()} value={form.tenure} onChange={update('tenure')} required disabled={!(selected && selected.tenureOptions && selected.tenureOptions.length)}>
                  <option value="" disabled>Select Tenure</option>
                  {selected && (selected.tenureOptions || []).map((o) => (
                    <option key={o.value} value={o.value}>{o.label} ({o.value} months)</option>
                  ))}
                </select>
              </Field>

              <Field label="Existing EMIs">
                <input type="number" min="0" placeholder="Enter Existing EMIs" className={inputClass()} value={form.emis} onChange={update('emis')} />
              </Field>

              <Field label="Employment Type">
                <select className={inputClass()} value={form.employment} onChange={update('employment')} required>
                  <option value="" disabled>Select Employment Type</option>
                  {employmentOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Credit Score" hint="Between 300 and 900">
                <input
                  type="number"
                  min="300"
                  max="900"
                  placeholder="Enter Credit Score"
                  className={inputClass()}
                  value={form.creditScore}
                  onChange={update('creditScore')}
                  required
                />
              </Field>

              <div className="sm:col-span-2">
                <Button type="submit" className="w-full sm:w-auto" disabled={submitting || loading || !!error}>
                  {submitting ? (<><Loader2 size={16} className="animate-spin" /> Checking…</>) : 'Check Eligibility'}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 ring-1 ring-red-200 p-4 flex items-start justify-between gap-3">
                <p className="text-[13.5px] text-red-700">Unable to load loan types: {errorMessage(error)}</p>
                <button type="button" onClick={refetch} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-red-700 hover:underline shrink-0">
                  <RefreshCw size={14} /> Retry
                </button>
              </div>
            )}

            {submitError && (
              <div className="mt-5 rounded-xl bg-red-50 ring-1 ring-red-200 p-4 flex items-start gap-3">
                <XCircle size={17} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-[13.5px] text-red-700">{submitError}</p>
              </div>
            )}

            {result && (
              <div className="mt-6 space-y-5">
                <div className={`rounded-xl p-5 flex items-start gap-3 ${result.eligible ? 'bg-green-100' : 'bg-red-50 ring-1 ring-red-200'}`}>
                  {result.eligible
                    ? <CheckCircle2 size={22} className="text-green-700 shrink-0 mt-0.5" />
                    : <XCircle size={22} className="text-red-600 shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-display font-semibold text-navy-900 text-[17px]">
                      {result.eligible
                        ? `You may be eligible for up to ${formatCurrency(limits && limits.eligibleAmount)}`
                        : 'You are not eligible for this loan yet'}
                    </p>
                    <p className={`text-[13.5px] mt-1 ${result.eligible ? 'text-green-800/80' : 'text-red-700'}`}>
                      {result.summary || (result.eligible ? 'Final approval depends on document verification.' : 'Please review the reasons below and try again.')}
                    </p>
                  </div>
                </div>

                {checks.length > 0 && (
                  <div>
                    <p className="font-display font-semibold text-navy-900 text-[15px] mb-2.5">Eligibility Checks</p>
                    <ul className="space-y-2.5">
                      {checks.map((c, i) => (
                        <li key={`${c.label}-${i}`} className="flex items-start gap-2.5 text-[14px] bg-navy-50 rounded-lg px-4 py-3">
                          {c.ok
                            ? <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                            : <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />}
                          <span className="text-ink-700">
                            <span className="font-semibold text-navy-900">{c.label}</span>
                            {c.detail && <span className="text-ink-500"> — {c.detail}</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!result.eligible && reasons.length > 0 && (
                  <div className="rounded-xl bg-red-50 ring-1 ring-red-200 p-4">
                    <p className="font-display font-semibold text-red-700 text-[14.5px] mb-2">Why you don’t qualify</p>
                    <ul className="space-y-1.5">
                      {reasons.map((r, i) => (
                        <li key={`${r}-${i}`} className="flex items-start gap-2 text-[13.5px] text-red-700">
                          <XCircle size={14} className="shrink-0 mt-1" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {limits && (
                  <div>
                    <p className="font-display font-semibold text-navy-900 text-[15px] mb-2.5">Your Limits</p>
                    <div className="grid grid-cols-2 gap-3">
                      <MiniStat label="Max Affordable EMI" value={formatCurrency(limits.maxEmi)} />
                      <MiniStat label="Eligible Amount" value={formatCurrency(limits.eligibleAmount)} />
                      <MiniStat
                        label="Eligible Tenure"
                        value={eligibleTenure && eligibleTenure.length === 2
                          ? `${formatTenure(eligibleTenure[0])} – ${formatTenure(eligibleTenure[1])}`
                          : '—'}
                      />
                      <MiniStat label="Interest Rate" value={limits.interestRate ? `${limits.interestRate}% p.a.` : '—'} />
                    </div>
                  </div>
                )}

                {quote && (
                  <div>
                    <p className="font-display font-semibold text-navy-900 text-[15px] mb-2.5">Your Quote</p>
                    <div className="grid grid-cols-2 gap-3">
                      <MiniStat label="Amount" value={formatCurrency(quote.amount)} />
                      <MiniStat label="Tenure" value={formatTenure(quote.tenure) || `${quote.tenure} months`} />
                      <MiniStat label="Interest Rate" value={`${quote.rate}% p.a.`} />
                      <MiniStat label="Monthly EMI" value={formatCurrency(quote.emi)} />
                      <MiniStat label="Total Payable" value={formatCurrency(quote.totalPayable)} />
                      <MiniStat label="Total Interest" value={formatCurrency(quote.totalInterest)} />
                    </div>
                  </div>
                )}
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

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg bg-navy-50 px-4 py-3">
      <p className="text-[11.5px] text-ink-400">{label}</p>
      <p className="text-[14px] font-semibold text-navy-900 mt-0.5">{value}</p>
    </div>
  )
}
