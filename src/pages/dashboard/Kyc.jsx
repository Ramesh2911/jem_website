import { useState } from 'react'
import {
  Activity, CheckCircle2, Clock, ExternalLink, FileText, ShieldCheck, Trash2, Upload, XCircle,
} from 'lucide-react'
import {
  Card, Button, Field, PageHeader, ErrorCard, LoadingRows, EmptyState,
  StatusPill, inputClass, statusLabel,
} from '../../components/ui'
import { Hero, Ring, IconHeading, StatTile, Notice } from '../../components/dashui'
import { api, API_URL, errorMessage } from '../../lib/api'
import { useApi } from '../../lib/content'

const FILE_BASE = API_URL.replace(/\/api\/?$/, '')
const fileUrl = (path) => (path ? `${FILE_BASE}${path}` : '')

const DOC_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar card' },
  { value: 'pan', label: 'PAN card' },
  { value: 'address_proof', label: 'Address proof' },
  { value: 'bank_proof', label: 'Bank proof' },
  { value: 'income_proof', label: 'Income proof' },
  { value: 'profile_photo', label: 'Profile photo' },
  { value: 'other', label: 'Other document' },
]

export default function Kyc({ role = 'customer' }) {
  const isCustomer = role === 'customer'
  const { data, loading, error, refetch } = useApi('/kyc/status')
  const [form, setForm] = useState({ documentType: 'aadhaar', documentNumber: '' })
  const [file, setFile] = useState(null)
  const [state, setState] = useState({ message: '', error: false })
  const [pending, setPending] = useState(false)
  const [credit, setCredit] = useState({ score: '', message: '', error: false, pending: false })

  if (loading && !data) {
    return (
      <>
        <PageHeader title="KYC & Documents" subtitle="Upload documents and track verification status." />
        <LoadingRows rows={4} />
      </>
    )
  }

  if (error && !data) {
    return (
      <>
        <PageHeader title="KYC & Documents" subtitle="Upload documents and track verification status." />
        <ErrorCard error={error} onRetry={refetch} />
      </>
    )
  }

  const status = (data && data.status) || 'pending'
  const progress = (data && data.progress) || { total: 0, verified: 0, pending: 0, rejected: 0 }
  const documents = (data && data.documents) || []
  const pct = progress.total ? Math.round((progress.verified / progress.total) * 100) : 0
  const creditScore = data && data.creditScore

  const upload = async (e) => {
    e.preventDefault()
    if (!file) {
      setState({ message: 'Please choose a file to upload', error: true })
      return
    }
    setPending(true)
    setState({ message: '', error: false })
    try {
      const fd = new FormData()
      fd.append('documentType', form.documentType)
      if (form.documentNumber.trim()) fd.append('documentNumber', form.documentNumber.trim())
      fd.append('file', file)
      const res = await api.upload('/customers/documents', fd)
      setState({ message: (res && res.message) || 'Document uploaded', error: false })
      setFile(null)
      setForm((s) => ({ ...s, documentNumber: '' }))
      e.target.reset?.()
      refetch()
    } catch (err) {
      setState({ message: errorMessage(err), error: true })
    } finally {
      setPending(false)
    }
  }

  const removeDoc = async (id) => {
    if (!window.confirm('Delete this document?')) return
    try {
      await api.del(`/customers/documents/${id}`)
      refetch()
    } catch (err) {
      setState({ message: errorMessage(err), error: true })
    }
  }

  return (
    <>
      <Hero
        eyebrow="KYC & Documents"
        title={statusLabel(status)}
        subtitle="Upload your identity and income documents — our team verifies them within 24 hours."
        chips={[
          { icon: ShieldCheck, label: `${progress.verified} of ${progress.total} verified` },
          creditScore ? { icon: Activity, label: `Credit score ${creditScore}` } : null,
        ]}
        right={
          <Ring
            pct={pct}
            label="Documents verified"
            hint={progress.total ? `${progress.verified} of ${progress.total} cleared` : 'Nothing uploaded yet'}
          />
        }
      />

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <StatTile icon={CheckCircle2} tone="green" value={progress.verified} label="Verified" />
        <StatTile icon={Clock} tone="gold" value={progress.pending} label="Pending review" />
        <StatTile icon={XCircle} tone="red" value={progress.rejected} label="Rejected" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6 items-start">
        <Card className="p-6">
          <IconHeading
            icon={Upload}
            title="Upload a document"
            hint="Accepted: images and PDFs up to 5 MB"
          />
          <form onSubmit={upload} className="space-y-4">
            <Field label="Document type">
              <select
                className={inputClass()}
                value={form.documentType}
                onChange={(e) => setForm((s) => ({ ...s, documentType: e.target.value }))}
              >
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Document number (optional)">
              <input
                className={inputClass()}
                type="text"
                placeholder="e.g. ABCDE1234F"
                value={form.documentNumber}
                onChange={(e) => setForm((s) => ({ ...s, documentNumber: e.target.value }))}
              />
            </Field>
            <Field label="File">
              <input
                className="block w-full text-[14px] text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-600 file:px-4 file:py-2 file:text-[13.5px] file:font-semibold file:text-white hover:file:bg-green-700 file:cursor-pointer"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
            </Field>
            <Button type="submit" disabled={pending} className="w-full">
              <Upload size={16} /> {pending ? 'Uploading...' : 'Upload Document'}
            </Button>
            <Notice state={state} />
          </form>
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
            <form
              className="flex flex-wrap items-end gap-3 mt-4"
              onSubmit={async (e) => {
                e.preventDefault()
                const score = Number(credit.score)
                if (!score || score < 300 || score > 900) {
                  setCredit((s) => ({ ...s, message: 'Score must be between 300 and 900', error: true }))
                  return
                }
                setCredit((s) => ({ ...s, pending: true, message: '', error: false }))
                try {
                  await api.post('/customers/credit-score', { score })
                  setCredit({ score: '', message: 'Credit score submitted for verification', error: false, pending: false })
                  refetch()
                } catch (err) {
                  setCredit((s) => ({ ...s, pending: false, message: errorMessage(err), error: true }))
                }
              }}
            >
              <input
                className={`${inputClass('w-40')} h-10`}
                type="number"
                min={300}
                max={900}
                placeholder="300 - 900"
                value={credit.score}
                onChange={(e) => setCredit((s) => ({ ...s, score: e.target.value }))}
              />
              <Button type="submit" size="sm" disabled={credit.pending}>
                {credit.pending ? 'Submitting...' : 'Submit Score'}
              </Button>
              {credit.message && (
                <p className={`w-full text-[13px] font-semibold ${credit.error ? 'text-red-600' : 'text-green-700'}`}>
                  {credit.message}
                </p>
              )}
            </form>
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
        {documents.length ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-wrap items-center gap-3 rounded-xl ring-1 ring-navy-900/8 px-4 py-3 transition-all hover:ring-green-600/25"
              >
                <span className="w-9 h-9 rounded-lg bg-green-50 text-green-600 ring-1 ring-green-600/10 grid place-items-center shrink-0">
                  <FileText size={16} />
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
          <EmptyState title="No documents uploaded yet" hint="Upload your KYC documents using the form above." />
        )}
      </Card>
    </>
  )
}
