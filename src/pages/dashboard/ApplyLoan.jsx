import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, CircleCheck, FileText, HandCoins, Percent, Send } from 'lucide-react'
import {
  Card, Button, Field, ErrorCard, LoadingRows, EmptyState, StatusPill, inputClass,
} from '../../components/ui'
import { Hero, GlassStat, IconHeading } from '../../components/dashui'
import { api, errorMessage } from '../../lib/api'
import { useApi } from '../../lib/content'
import { formatCurrency, formatAmount } from '../../lib/loans'

const inr = (v) => formatCurrency(Number(v) || 0)

const fmtDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const calcEmi = (principal, annualRate, months) => {
  const p = Number(principal)
  const n = Number(months)
  const r = Number(annualRate) / 1200
  if (!p || !n || p <= 0 || n <= 0) return 0
  if (r === 0) return p / n
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

const tenureChoices = (product) => {
  if (!product) return []
  const opts = Array.isArray(product.tenure_options) ? product.tenure_options.filter(Boolean) : []
  const min = Number(product.min_tenure)
  const max = Number(product.max_tenure)
  const out = []
  for (let t = min; t <= max; t += 6) out.push(t)
  if (!out.includes(max)) out.push(max)
  return opts.length ? opts : out
}

const EMPLOYMENT = [
  { value: '', label: 'Select' },
  { value: 'salaried', label: 'Salaried' },
  { value: 'self_employed', label: 'Self employed' },
  { value: 'business', label: 'Business' },
]

const EMPTY = []

function StepHeader({ n, title, hint }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-7 h-7 shrink-0 rounded-full bg-navy-900 text-white grid place-items-center text-[13px] font-bold">
        {n}
      </span>
      <div className="min-w-0">
        <h2 className="font-display font-bold text-navy-900 text-[16px] leading-tight">{title}</h2>
        {hint && <p className="text-[12.5px] text-ink-400 leading-tight mt-0.5">{hint}</p>}
      </div>
    </div>
  )
}

export default function ApplyLoan() {
  const products = useApi('/loans/products')
  const applications = useApi('/loans/applications')

  const [slug, setSlug] = useState('')
  const [amount, setAmount] = useState('')
  const [tenure, setTenure] = useState('')
  const [purpose, setPurpose] = useState('')
  const [employment, setEmployment] = useState('')
  const [employer, setEmployer] = useState('')
  const [income, setIncome] = useState('')
  const [formError, setFormError] = useState('')
  const [reasons, setReasons] = useState([])
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(null)

  const list = (products.data && Array.isArray(products.data) && products.data) || EMPTY
  const product = useMemo(() => list.find((p) => p.slug === slug) || null, [list, slug])
  const tenures = useMemo(() => tenureChoices(product), [product])
  const emi = useMemo(
    () => calcEmi(amount, product ? product.interest_rate : 0, tenure),
    [amount, tenure, product]
  )
  const minRate = useMemo(
    () => (list.length ? Math.min(...list.map((p) => Number(p.interest_rate))) : null),
    [list]
  )

  const pick = (p) => {
    setSlug(p.slug)
    setAmount('')
    setTenure(tenureChoices(p)[0] ? String(tenureChoices(p)[0]) : '')
    setFormError('')
    setReasons([])
  }

  const submit = async (e) => {
    e.preventDefault()
    setFormError('')
    setReasons([])
    if (!product) {
      setFormError('Choose a loan product first')
      return
    }
    const amt = Number(amount)
    if (!amt || amt < Number(product.min_amount) || amt > Number(product.max_amount)) {
      setFormError(`Amount must be between ${formatAmount(product.min_amount)} and ${formatAmount(product.max_amount)}`)
      return
    }
    const months = Number(tenure)
    if (!months || months < Number(product.min_tenure) || months > Number(product.max_tenure)) {
      setFormError(`Tenure must be between ${product.min_tenure} and ${product.max_tenure} months`)
      return
    }

    setPending(true)
    try {
      const res = await api.post('/loans/apply', {
        loanProductSlug: product.slug,
        loanAmount: amt,
        tenureMonths: months,
        loanPurpose: purpose || undefined,
        employmentType: employment || undefined,
        employerName: employer || undefined,
        monthlyIncome: income ? Number(income) : undefined,
      })
      setDone(res && res.data)
      applications.refetch()
    } catch (err) {
      setFormError(errorMessage(err))
      const data = err && err.data
      setReasons(data && Array.isArray(data.reasons) ? data.reasons : [])
    } finally {
      setPending(false)
    }
  }

  const appList = (applications.data && Array.isArray(applications.data) && applications.data) || EMPTY
  const quoteReady = product && Number(amount) > 0 && Number(tenure) > 0

  return (
    <>
      <Hero
        eyebrow="Loan Application"
        title="Apply for a Loan"
        subtitle="Pick a product, fill in your details and submit in minutes — track every step below."
        chips={[
          { icon: HandCoins, label: `${list.length} product${list.length === 1 ? '' : 's'} available` },
          minRate !== null ? { icon: Percent, label: `From ${minRate}% p.a.` } : null,
        ]}
        right={
          minRate !== null ? (
            <GlassStat label="Lowest rate" value={`${minRate}%`} hint="per annum, reducing balance" />
          ) : null
        }
      />

      {done && (
        <Card className="p-6 mt-6 ring-green-600/30">
          <div className="flex items-start gap-3.5">
            <span className="w-10 h-10 rounded-full bg-green-100 text-green-700 grid place-items-center shrink-0">
              <CircleCheck size={20} />
            </span>
            <div>
              <p className="font-display font-semibold text-navy-900 text-[16px]">
                Application submitted - {done.applicationNumber}
              </p>
              <p className="text-[14px] text-ink-600 mt-1">
                Estimated monthly EMI {inr(done.emiAmount)}. Our team will review it shortly - track the status below.
              </p>
              <Button className="mt-4" variant="outline" onClick={() => setDone(null)}>
                Apply for another loan
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 mt-6 items-start">
        <Card className="p-6 min-w-0">
          <StepHeader n={1} title="Choose a product" hint="Tap a card to select your loan" />

          {products.loading && <LoadingRows rows={3} />}
          {products.error && !list.length && <ErrorCard error={products.error} onRetry={products.refetch} />}
          {list.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {list.map((p) => {
                const active = slug === p.slug
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pick(p)}
                    className={`relative text-left rounded-xl p-4 transition-all focus-ring ${
                      active
                        ? 'ring-2 ring-green-600 bg-green-50 shadow-[0_10px_25px_-15px_rgba(23,138,76,0.6)]'
                        : 'ring-1 ring-navy-900/10 hover:ring-navy-900/25 hover:-translate-y-0.5 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[14.5px] font-semibold text-navy-900">{p.name}</p>
                      {active && (
                        <span className="w-5 h-5 shrink-0 rounded-full bg-green-600 text-white grid place-items-center">
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6.2 5 8.7l4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="mt-2">
                      <span className="font-display font-bold text-[17px] text-navy-900">{Number(p.interest_rate)}%</span>
                      <span className="text-[12px] text-ink-400 font-semibold"> p.a.</span>
                    </p>
                    <p className="text-[12.5px] text-ink-500 mt-1">
                      {formatAmount(p.min_amount)} to {formatAmount(p.max_amount)}
                    </p>
                    <span className="inline-block mt-2 rounded-full bg-navy-50 text-ink-600 px-2.5 py-0.5 text-[11.5px] font-bold">
                      {p.min_tenure}-{p.max_tenure} months
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {product && (
            <form onSubmit={submit} className="mt-7 space-y-5">
              <StepHeader n={2} title="Loan details" hint={`Applying for ${product.name}`} />
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={`Loan amount (₹) - ${formatAmount(product.min_amount)} to ${formatAmount(product.max_amount)}`}>
                  <input
                    className={inputClass()}
                    type="number"
                    min={product.min_amount}
                    max={product.max_amount}
                    placeholder="e.g. 500000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </Field>
                <Field label={`Tenure (months) - ${product.min_tenure} to ${product.max_tenure}`}>
                  <select
                    className={inputClass()}
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    required
                  >
                    <option value="">Select tenure</option>
                    {tenures.map((t) => (
                      <option key={t} value={t}>{t} months</option>
                    ))}
                  </select>
                </Field>
                <Field label="Purpose of loan">
                  <input
                    className={inputClass()}
                    type="text"
                    placeholder="e.g. Home renovation"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                </Field>
                <Field label="Employment type">
                  <select
                    className={inputClass()}
                    value={employment}
                    onChange={(e) => setEmployment(e.target.value)}
                  >
                    {EMPLOYMENT.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Company / employer name">
                  <input
                    className={inputClass()}
                    type="text"
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                  />
                </Field>
                <Field label="Monthly income (₹)">
                  <input
                    className={inputClass()}
                    type="number"
                    min="0"
                    placeholder="e.g. 60000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </Field>
              </div>

              {formError && (
                <div className="rounded-xl bg-red-50 ring-1 ring-red-500/20 px-4 py-3">
                  <p className="text-[13.5px] font-semibold text-red-600">{formError}</p>
                  {reasons.length > 0 && (
                    <ul className="mt-2 space-y-1 text-[13px] text-red-600 list-disc list-inside">
                      {reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <Button type="submit" disabled={pending}>
                <Send size={16} /> {pending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          )}
        </Card>

        <div className="rounded-2xl overflow-hidden ring-1 ring-navy-900/8 lg:sticky lg:top-24">
          <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-[#0b2748] px-5 py-6 text-white">
            <span
              aria-hidden="true"
              className="absolute -top-20 -right-12 w-56 h-56 rounded-full bg-green-500/15 blur-3xl pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.18] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
            />

            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-400">Your quote</p>

              {quoteReady ? (
                <>
                  <p className="font-display font-bold text-[30px] text-green-400 leading-none mt-2">
                    {inr(Math.round(emi))}
                  </p>
                  <p className="text-[12.5px] text-white/55 mt-1.5">Monthly EMI</p>

                  <dl className="mt-5 space-y-2.5 text-[13.5px]">
                    {[
                      ['Product', product.name],
                      ['Amount', inr(amount)],
                      ['Tenure', `${tenure} months`],
                      ['Interest rate', `${Number(product.interest_rate)}% p.a.`],
                      ['Total payable', inr(Math.round(emi * Number(tenure)))],
                    ].map(([label, value], i, arr) => (
                      <div
                        key={label}
                        className={`flex items-center justify-between gap-3 ${
                          i === arr.length - 1 ? 'pt-3 mt-1 border-t border-white/15' : ''
                        }`}
                      >
                        <dt className="text-white/55">{label}</dt>
                        <dd className={`font-semibold ${i === arr.length - 1 ? 'text-white text-[15px]' : 'text-white'}`}>
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : (
                <p className="text-[13.5px] text-white/60 mt-3 leading-relaxed">
                  Select a product and enter the amount to see your estimated EMI, total payable and breakup.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Card className="p-6 mt-6">
        <IconHeading
          icon={FileText}
          title="My Applications"
          hint={`${appList.length} submitted — click a row to see its status timeline`}
          right={
            <Button variant="ghost" size="sm" onClick={applications.refetch}>Refresh</Button>
          }
        />

        {applications.loading && !appList.length && <LoadingRows rows={3} />}
        {applications.error && !appList.length && (
          <ErrorCard error={applications.error} onRetry={applications.refetch} />
        )}
        {!applications.loading && !applications.error && !appList.length && (
          <EmptyState title="No applications yet" hint="Submit the form above to apply for your first loan." />
        )}
        {appList.length > 0 && (
          <div className="space-y-3">
            {appList.map((a) => (
              <ApplicationRow key={a.id} app={a} />
            ))}
          </div>
        )}
      </Card>
    </>
  )
}

function ApplicationRow({ app }) {
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  const toggle = async () => {
    setOpen((v) => !v)
    if (detail || loading) return
    setLoading(true)
    setLoadError('')
    try {
      const res = await api.get(`/loans/applications/${app.id}`)
      setDetail(res && res.data)
    } catch (err) {
      setLoadError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const history = (detail && detail.history) || []

  return (
    <div className="rounded-xl ring-1 ring-navy-900/10 transition-all hover:ring-green-600/25">
      <button
        onClick={toggle}
        className="w-full flex flex-wrap items-center gap-3 px-4 py-3.5 text-left focus-ring"
      >
        <span className="w-9 h-9 rounded-lg bg-green-50 text-green-600 ring-1 ring-green-600/10 grid place-items-center shrink-0">
          <FileText size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-semibold text-navy-900 truncate">
            {app.product_name || 'Loan'} - {app.application_number}
          </p>
          <p className="text-[12.5px] text-ink-500">
            {inr(app.loan_amount)} - {app.tenure_months} months - EMI {inr(app.emi_amount)} - {fmtDate(app.created_at)}
          </p>
        </div>
        <StatusPill status={app.status} />
        {open ? <ChevronUp size={17} className="text-ink-400" /> : <ChevronDown size={17} className="text-ink-400" />}
      </button>

      {open && (
        <div className="border-t border-navy-900/10 px-4 py-4">
          {loading && <LoadingRows rows={2} />}
          {loadError && <p className="text-[13.5px] text-red-600">{loadError}</p>}
          {detail && (
            <>
              <div className="grid sm:grid-cols-3 gap-4 text-[13.5px]">
                <div className="rounded-xl bg-navy-50 px-3.5 py-3">
                  <p className="text-ink-500 text-[12.5px]">Interest rate</p>
                  <p className="font-semibold text-navy-900 mt-0.5">{Number(detail.interest_rate)}% p.a.</p>
                </div>
                <div className="rounded-xl bg-navy-50 px-3.5 py-3">
                  <p className="text-ink-500 text-[12.5px]">Processing fee</p>
                  <p className="font-semibold text-navy-900 mt-0.5">{inr(detail.processing_fee)}</p>
                </div>
                <div className="rounded-xl bg-navy-50 px-3.5 py-3">
                  <p className="text-ink-500 text-[12.5px]">Employment</p>
                  <p className="font-semibold text-navy-900 mt-0.5 capitalize">
                    {String(detail.employment_type || '-').replace(/_/g, ' ')}
                  </p>
                </div>
                {detail.admin_remarks && (
                  <div className="sm:col-span-3">
                    <p className="text-ink-500">Remarks</p>
                    <p className="text-navy-900">{detail.admin_remarks}</p>
                  </div>
                )}
              </div>

              <h3 className="text-[13.5px] font-semibold text-navy-900 mt-5 mb-3">Status timeline</h3>
              {history.length ? (
                <ol className="space-y-3">
                  {history.map((h, i) => (
                    <li key={h.id || i} className="flex gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ring-4 ${
                          i === 0 ? 'bg-green-600 ring-green-600/15' : 'bg-navy-900/30 ring-navy-900/5'
                        }`}
                      />
                      <div>
                        <p className="text-[13.5px] text-navy-900 font-medium">
                          {statusText(h.from_status)} to <span className="font-semibold">{statusText(h.to_status)}</span>
                        </p>
                        {h.remark && <p className="text-[12.5px] text-ink-500">{h.remark}</p>}
                        <p className="text-[12px] text-ink-400">{fmtDate(h.created_at)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-[13px] text-ink-500">No history yet.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function statusText(v) {
  if (!v) return 'Created'
  return String(v).split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
