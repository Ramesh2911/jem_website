import { useState } from 'react'
import {
  Activity, BadgeCheck, Check, CheckCircle2, Clock, ExternalLink, FileText, Send, ShieldCheck,
  Smartphone, Trash2, XCircle,
} from 'lucide-react'
import {
  Card, Button, Field, PageHeader, ErrorCard, LoadingRows, EmptyState,
  StatusPill, inputClass, statusLabel,
} from '../../components/ui'
import { Hero, Ring, IconHeading, StatTile, Notice } from '../../components/dashui'
import { api, API_URL, errorMessage } from '../../lib/api'
import { useApi } from '../../lib/content'

const FILE_BASE = API_URL.replace(/\/api\/?$/, '')
const fileUrl = (path) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${FILE_BASE}${path}`
}

const DOC_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar card (OTP verify)' },
  { value: 'pan', label: 'PAN card (instant verify)' },
]

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/

function VerifiedResult({ kind, result }) {
  if (!result) return null
  const name = kind === 'pan' ? result.fullName : result.name
  const address = kind === 'pan'
    ? [result.address && result.address.line1, result.address && result.address.city, result.address && result.address.state, result.address && result.address.pincode].filter(Boolean).join(', ')
    : result.address
  return (
    <div className="rounded-xl bg-green-50 ring-1 ring-green-600/20 px-4 py-3.5">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-green-600 text-white grid place-items-center">
          <Check size={12} strokeWidth={3.5} />
        </span>
        <p className="text-[13.5px] font-bold text-green-700">Verified successfully</p>
        <span className="ml-auto rounded-full bg-white ring-1 ring-green-600/25 px-2.5 py-0.5 text-[11.5px] font-bold text-green-700">
          {kind === 'pan' ? 'PAN API' : 'Aadhaar e-KYC'}
        </span>
      </div>
      {(name || result.dob || result.gender) && (
        <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1 text-[13px]">
          {name && (
            <div className="col-span-2">
              <dt className="text-ink-500 inline">Name: </dt>
              <dd className="inline font-semibold text-navy-900">{name}</dd>
            </div>
          )}
          {result.dob && (
            <div>
              <dt className="text-ink-500 inline">DOB: </dt>
              <dd className="inline font-semibold text-navy-900">{result.dob}</dd>
            </div>
          )}
          {result.gender && (
            <div>
              <dt className="text-ink-500 inline">Gender: </dt>
              <dd className="inline font-semibold text-navy-900">{result.gender}</dd>
            </div>
          )}
          {address && (
            <div className="col-span-2">
              <dt className="text-ink-500 inline">Address: </dt>
              <dd className="inline text-navy-900">{address}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}

function AadhaarPanel({ state, setState, onSend, onVerify, pending }) {
  const step = state.step
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-5">
        {[
          { id: 'number', n: 1, label: 'Aadhaar number' },
          { id: 'otp', n: 2, label: 'Verify OTP' },
        ].map(({ id, n, label }, i) => {
          const active = step === id
          const done = (step === 'otp' && i === 0)
          return (
            <span key={id} className="flex items-center gap-2.5">
              {i > 0 && <span className="w-6 h-px bg-navy-900/15" />}
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-bold transition-colors ${
                  active
                    ? 'bg-navy-900 text-white shadow-md'
                    : done
                      ? 'bg-green-100 text-green-700 ring-1 ring-green-600/15'
                      : 'bg-white text-ink-400 ring-1 ring-navy-900/10'
                }`}
              >
                <span
                  className={`w-4.5 h-4.5 rounded-full grid place-items-center text-[10.5px] ${
                    active ? 'bg-green-400 text-navy-900' : done ? 'bg-green-600 text-white' : 'bg-navy-900/10 text-ink-500'
                  }`}
                >
                  {done ? <Check size={10} strokeWidth={3.5} /> : n}
                </span>
                {label}
              </span>
            </span>
          )
        })}
      </div>

      {step === 'number' ? (
        <form onSubmit={onSend} className="space-y-4">
          <Field label="Aadhaar number">
            <input
              className={`${inputClass('font-semibold tracking-[0.15em]')} h-11`}
              type="text"
              inputMode="numeric"
              maxLength={12}
              placeholder="12-digit Aadhaar number"
              value={state.number}
              onChange={(e) => setState((s) => ({ ...s, number: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
              required
            />
          </Field>
          <Button type="submit" disabled={pending || state.number.length !== 12}>
            <Send size={15} /> {pending ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={onVerify} className="space-y-4">
          <p className="text-[13.5px] text-ink-500 leading-relaxed">
            Enter the 6-digit OTP sent to the mobile linked with{' '}
            <span className="font-bold text-navy-900">{state.number}</span>
          </p>
          <Field label="OTP">
            <input
              className={inputClass('tracking-[0.4em] font-bold text-center text-[17px] h-11')}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="––––––"
              value={state.otp}
              onChange={(e) => setState((s) => ({ ...s, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
              required
              autoFocus
            />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending || state.otp.length !== 6}>
              {pending ? 'Verifying...' : 'Verify Aadhaar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setState((s) => ({ ...s, step: 'number', otp: '', message: '', error: false }))}
            >
              Change number
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default function Kyc({ role = 'customer' }) {
  const isCustomer = role === 'customer'
  const { data, loading, error, refetch } = useApi('/kyc/status')
  const [form, setForm] = useState({ documentType: 'aadhaar' })
  const [state, setState] = useState({ message: '', error: false })
  const [pending, setPending] = useState(false)
  const [credit, setCredit] = useState({ step: 'send', otp: '', message: '', error: false, pending: false, reportPdf: null })
  const [pan, setPan] = useState({ number: '', message: '', error: false, result: null })
  const [aadhaar, setAadhaar] = useState({ step: 'number', number: '', otp: '', referenceId: '', message: '', error: false, result: null })

  if (loading && !data) {
    return (
      <>
        <PageHeader title="KYC & Documents" subtitle="Verify your KYC documents and track verification status." />
        <LoadingRows rows={4} />
      </>
    )
  }

  if (error && !data) {
    return (
      <>
        <PageHeader title="KYC & Documents" subtitle="Verify your KYC documents and track verification status." />
        <ErrorCard error={error} onRetry={refetch} />
      </>
    )
  }

  const status = (data && data.status) || 'pending'
  const progress = (data && data.progress) || { total: 0, verified: 0, pending: 0, rejected: 0 }
  const documents = (data && data.documents) || []
  const pct = progress.total ? Math.round((progress.verified / progress.total) * 100) : 0
  const creditScore = data && data.creditScore
  const type = form.documentType

  const removeDoc = async (id) => {
    if (!window.confirm('Delete this document?')) return
    try {
      await api.del(`/customers/documents/${id}`)
      refetch()
    } catch (err) {
      setState({ message: errorMessage(err), error: true })
    }
  }

  const verifyPan = async (e) => {
    e.preventDefault()
    const panNumber = pan.number.toUpperCase()
    if (!PAN_RE.test(panNumber)) {
      setPan((s) => ({ ...s, message: 'Enter a valid PAN, e.g. ABCDE1234F', error: true }))
      return
    }
    setPan((s) => ({ ...s, message: '', error: false }))
    setPending(true)
    try {
      const res = await api.post('/kyc/verify/pan', { panNumber })
      setPan({ number: panNumber, message: '', error: false, result: (res && res.data) || {} })
      refetch()
    } catch (err) {
      setPan((s) => ({ ...s, message: errorMessage(err), error: true }))
    } finally {
      setPending(false)
    }
  }

  const sendAadhaarOtp = async (e) => {
    e.preventDefault()
    if (aadhaar.number.length !== 12) {
      setAadhaar((s) => ({ ...s, message: 'Enter a valid 12-digit Aadhaar number', error: true }))
      return
    }
    setAadhaar((s) => ({ ...s, message: '', error: false }))
    setPending(true)
    try {
      const res = await api.post('/kyc/verify/aadhaar/send-otp', { aadhaarNumber: aadhaar.number })
      setAadhaar((s) => ({
        ...s, step: 'otp', otp: '', referenceId: (res && res.data && res.data.referenceId) || '',
        message: 'OTP sent to the Aadhaar-linked mobile number', error: false,
      }))
    } catch (err) {
      setAadhaar((s) => ({ ...s, message: errorMessage(err), error: true }))
    } finally {
      setPending(false)
    }
  }

  const verifyAadhaarOtp = async (e) => {
    e.preventDefault()
    if (aadhaar.otp.length !== 6) {
      setAadhaar((s) => ({ ...s, message: 'Enter the 6-digit OTP', error: true }))
      return
    }
    setPending(true)
    setAadhaar((s) => ({ ...s, message: '', error: false }))
    try {
      const res = await api.post('/kyc/verify/aadhaar/verify-otp', {
        otp: aadhaar.otp,
        referenceId: aadhaar.referenceId,
      })
      setAadhaar((s) => ({
        ...s, step: 'number', otp: '', referenceId: '',
        message: '', error: false, result: (res && res.data) || {},
      }))
      refetch()
    } catch (err) {
      setAadhaar((s) => ({ ...s, message: errorMessage(err), error: true }))
    } finally {
      setPending(false)
    }
  }

  const sendCibilOtp = async (e) => {
    e.preventDefault()
    setCredit((s) => ({ ...s, pending: true, message: '', error: false }))
    try {
      const res = await api.post('/customers/credit-score/cibil/send-otp', {})
      setCredit((s) => ({
        ...s, step: 'otp', otp: '', pending: false,
        message: (res && res.message) || 'Consent OTP sent to your registered mobile',
        error: false,
      }))
    } catch (err) {
      setCredit((s) => ({ ...s, pending: false, message: errorMessage(err), error: true }))
    }
  }

  const checkCibil = async (e) => {
    e.preventDefault()
    if (credit.otp.length !== 6) {
      setCredit((s) => ({ ...s, message: 'Enter the 6-digit OTP', error: true }))
      return
    }
    setCredit((s) => ({ ...s, pending: true, message: '', error: false }))
    try {
      const res = await api.post('/customers/credit-score/cibil/check', { otp: credit.otp })
      const d = (res && res.data) || {}
      setCredit({ step: 'send', otp: '', message: 'Credit score verified', error: false, pending: false, reportPdf: d.reportPdf || null })
      refetch()
    } catch (err) {
      setCredit((s) => ({ ...s, pending: false, message: errorMessage(err), error: true }))
    }
  }

  return (
    <>
      <Hero
        eyebrow="KYC & Documents"
        title={statusLabel(status)}
        subtitle="Verify your Aadhaar and PAN instantly with OTP/API."
        chips={[
          { icon: ShieldCheck, label: `${progress.verified} of ${progress.total} verified` },
          creditScore ? { icon: Activity, label: `Credit score ${creditScore}` } : null,
        ]}
        right={
          <Ring
            pct={pct}
            label="Documents verified"
            hint={progress.total ? `${progress.verified} of ${progress.total} cleared` : 'No documents yet'}
          />
        }
      />

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <StatTile icon={CheckCircle2} tone="green" value={progress.verified} label="Verified" />
        <StatTile icon={Clock} tone="gold" value={progress.pending} label="Pending review" />
        <StatTile icon={XCircle} tone="red" value={progress.rejected} label="Rejected" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6 items-start">
        <Card className="p-6 min-w-0">
          <IconHeading
            icon={type === 'pan' ? BadgeCheck : Smartphone}
            title={type === 'pan' ? 'PAN verification' : 'Aadhaar verification'}
            hint={
              type === 'pan'
                ? 'Instant API match — no file needed'
                : 'OTP e-KYC — verified instantly, no file needed'
            }
          />

          <div className="space-y-4">
            <Field label="Document type">
              <select
                className={inputClass()}
                value={type}
                onChange={(e) => {
                  setForm((s) => ({ ...s, documentType: e.target.value }))
                  setState({ message: '', error: false })
                }}
              >
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </Field>

            {type === 'pan' && (
              <form onSubmit={verifyPan} className="space-y-4">
                <Field label="PAN number">
                  <input
                    className={`${inputClass('uppercase tracking-wider font-semibold')} h-11`}
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={pan.number}
                    onChange={(e) => setPan((s) => ({ ...s, number: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) }))}
                  />
                </Field>
                <Button type="submit" disabled={pending || pan.number.length !== 10} className="w-full">
                  {pending ? 'Verifying...' : 'Verify PAN'}
                </Button>
                <Notice state={{ message: pan.message, error: pan.error }} />
                <VerifiedResult kind="pan" result={pan.result} />
              </form>
            )}

            {type === 'aadhaar' && (
              <AadhaarPanel
                state={aadhaar}
                setState={setAadhaar}
                onSend={sendAadhaarOtp}
                onVerify={verifyAadhaarOtp}
                pending={pending}
              />
            )}

            {type === 'aadhaar' && (
              <>
                <Notice state={{ message: aadhaar.message, error: aadhaar.error }} />
                <VerifiedResult kind="aadhaar" result={aadhaar.result} />
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <IconHeading
            icon={Activity}
            title="Credit score"
            hint="A healthy score unlocks faster approvals"
          />
          <div className="rounded-2xl bg-navy-50 ring-1 ring-navy-900/8 px-5 py-4">
            <p className="text-[11.5px] font-bold uppercase tracking-wider text-ink-400">Your score</p>
            <p className="font-display font-bold text-navy-900 text-[30px] leading-tight mt-1 tabular-nums">
              {creditScore || <span className="text-ink-400 text-[19px]">Not available</span>}
            </p>
            {creditScore ? (
              <div className="mt-1 h-1.5 rounded-full bg-navy-100 overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, ((Number(creditScore) - 300) / 600) * 100))}%` }}
                />
              </div>
            ) : null}
          </div>

          {isCustomer && (
            <div className="mt-4 space-y-4">
              {credit.step === 'send' ? (
                <form onSubmit={sendCibilOtp}>
                  <p className="text-[13.5px] text-ink-500 leading-relaxed mb-3">
                    Pull your CIBIL score instantly from CRIF with a consent OTP sent to your
                    registered mobile number.
                  </p>
                  <Button type="submit" size="sm" disabled={credit.pending}>
                    <Send size={14} /> {credit.pending ? 'Sending OTP...' : 'Check my CIBIL score'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={checkCibil} className="space-y-3">
                  <p className="text-[13.5px] text-ink-500 leading-relaxed">
                    Enter the consent OTP to authorize your credit report pull.
                  </p>
                  <Field label="Consent OTP">
                    <input
                      className={inputClass('tracking-[0.4em] font-bold text-center text-[17px] h-11')}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="––––––"
                      value={credit.otp}
                      onChange={(e) => setCredit((s) => ({ ...s, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                      required
                      autoFocus
                    />
                  </Field>
                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" size="sm" disabled={credit.pending || credit.otp.length !== 6}>
                      {credit.pending ? 'Checking (may take 10s)...' : 'Verify & Check Score'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={credit.pending}
                      onClick={() => setCredit((s) => ({ ...s, step: 'send', otp: '', message: '', error: false }))}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
              {credit.message && (
                <p className={`text-[13px] font-semibold ${credit.error ? 'text-red-600' : 'text-green-700'}`}>
                  {credit.message}
                </p>
              )}
              {credit.reportPdf && (
                <a
                  href={credit.reportPdf}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-green-700 hover:underline focus-ring"
                >
                  <ExternalLink size={14} /> View full credit report (PDF)
                </a>
              )}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <IconHeading
          icon={FileText}
          title="My Documents"
          hint="Everything you have submitted so far"
          right={
            <span className="shrink-0 rounded-full bg-navy-100 text-navy-800 px-3 py-1 text-[12.5px] font-bold tabular-nums">
              {documents.length} file{documents.length === 1 ? '' : 's'}
            </span>
          }
        />
        <Notice state={state} />
        {documents.length ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-wrap items-center gap-3 rounded-xl ring-1 ring-navy-900/8 px-4 py-3 transition-all hover:ring-green-600/25"
              >
                <span className="w-9 h-9 rounded-lg bg-green-50 text-green-600 ring-1 ring-green-600/10 grid place-items-center shrink-0">
                  {doc.document_type === 'aadhaar' ? <Smartphone size={16} />
                    : doc.document_type === 'pan' ? <BadgeCheck size={16} />
                      : <FileText size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-navy-900 capitalize">
                    {String(doc.document_type || '').replace(/_/g, ' ')}
                  </p>
                  <p className="text-[12.5px] text-ink-500 truncate">
                    {doc.document_number || 'No number provided'}
                    {doc.rejection_reason ? ` - ${doc.rejection_reason}` : ''}
                  </p>
                </div>
                {doc.verification_status === 'verified' && (doc.document_type === 'aadhaar' || doc.document_type === 'pan') && (
                  <span className="hidden sm:inline rounded-full bg-green-50 text-green-700 ring-1 ring-green-600/20 px-2.5 py-0.5 text-[11.5px] font-bold">
                    API verified
                  </span>
                )}
                <StatusPill status={doc.verification_status} />
                {doc.file_path && (
                  <a
                    href={fileUrl(doc.file_path)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] font-semibold text-green-700 hover:underline flex items-center gap-1 focus-ring"
                  >
                    <ExternalLink size={14} /> View
                  </a>
                )}
                <button
                  onClick={() => removeDoc(doc.id)}
                  aria-label="Delete document"
                  className="text-ink-400 hover:text-red-600 transition-colors focus-ring"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No documents yet" hint="Verify your Aadhaar/PAN using the panel above." />
        )}
      </Card>
    </>
  )
}
