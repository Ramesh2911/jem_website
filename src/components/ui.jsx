import { useState } from 'react'
import { AlertCircle, Eye, EyeOff, Lock, Smartphone } from 'lucide-react'

export function Button({ as: As = 'button', className = '', variant = 'primary', size = 'md', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus-ring disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 shadow-[0_8px_20px_-8px_rgba(23,138,76,0.55)] hover:-translate-y-0.5',
    outline: 'border border-navy-900/15 text-navy-900 hover:bg-navy-50',
    ghost: 'text-navy-900 hover:bg-navy-50',
    white: 'bg-white text-navy-900 hover:bg-navy-50',
    outlineWhite: 'border border-white/30 text-white hover:bg-white/10',
  }
  const sizes = {
    sm: 'text-sm px-3.5 py-2',
    md: 'text-[15px] px-5 py-2.5',
    lg: 'text-base px-7 py-3.5',
  }
  return (
    <As className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </As>
  )
}

export function Card({ className = '', children, hover = false }) {
  return (
    <div
      className={`bg-white rounded-2xl ring-1 ring-navy-900/8 ${
        hover ? 'transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-green-600/25' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, center = false, dark = false }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className={`text-[14px] font-semibold mb-3 ${dark ? 'text-green-400' : 'text-green-600'}`}>{eyebrow}</p>
      )}
      <h2 className={`font-display font-bold text-[32px] sm:text-[38px] leading-[1.15] tracking-tight ${dark ? 'text-white' : 'text-navy-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-[16px] leading-relaxed ${dark ? 'text-white/65' : 'text-ink-600'}`}>{subtitle}</p>
      )}
    </div>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-[13.5px] font-semibold text-navy-900 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[12.5px] text-ink-400 mt-1.5">{hint}</span>}
    </label>
  )
}

export function inputClass(extra = '') {
  return `w-full h-11 px-3.5 rounded-lg border border-navy-900/15 text-[14.5px] text-ink-900 placeholder:text-ink-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/15 outline-none transition-all bg-white ${extra}`
}

const fieldShell =
  'rounded-xl border bg-white transition-all focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-600/12'
const fieldBorder = 'border-navy-900/15'
const fieldInvalid = 'border-red-500/70 ring-4 ring-red-500/10'

export function authInputClass(extra = '') {
  return `w-full h-12 ${fieldShell} ${fieldBorder} px-4 text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-green-600 ${extra}`
}

export function MobileInput({
  value,
  onChange,
  placeholder = '98765 43210',
  invalid = false,
  ...props
}) {
  const [inner, setInner] = useState('')
  const current = value === undefined ? inner : value

  const update = (raw) => {
    const digits = String(raw).replace(/\D/g, '').slice(0, 10)
    setInner(digits)
    onChange?.(digits)
  }

  return (
    <div className={`relative flex h-12 ${fieldShell} ${invalid ? fieldInvalid : fieldBorder}`}>
      <span className="flex items-center gap-2 pl-3.5 pr-3 border-r border-navy-900/10 text-[14.5px] font-semibold text-navy-900 select-none">
        <Smartphone size={15} className="text-ink-400" />
        +91
      </span>
      <input
        {...props}
        type="text"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        placeholder={placeholder}
        value={current}
        onChange={(e) => update(e.target.value)}
        className="flex-1 min-w-0 h-full px-3 bg-transparent outline-none text-[15px] font-semibold tracking-[0.05em] text-ink-900 placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-400"
      />
      <span
        className={`flex items-center pr-3.5 text-[11.5px] font-bold tabular-nums transition-colors ${
          current.length === 10 ? 'text-green-600' : 'text-ink-400'
        }`}
      >
        {current.length}/10
      </span>
    </div>
  )
}

function strengthScore(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s += 1
  if (/[A-Z]/.test(pw)) s += 1
  if (/[0-9]/.test(pw)) s += 1
  if (/[^A-Za-z0-9]/.test(pw)) s += 1
  return Math.max(s, 1)
}

const strengthLevels = [
  { label: 'Weak', bar: 'bg-red-500', text: 'text-red-500' },
  { label: 'Fair', bar: 'bg-amber-500', text: 'text-amber-500' },
  { label: 'Good', bar: 'bg-green-500', text: 'text-green-500' },
  { label: 'Strong', bar: 'bg-green-600', text: 'text-green-600' },
]

export function PasswordInput({
  value,
  onChange,
  placeholder = 'Enter your password',
  invalid = false,
  showStrength = false,
  autoComplete = 'current-password',
  ...props
}) {
  const [show, setShow] = useState(false)
  const [inner, setInner] = useState('')
  const current = value === undefined ? inner : value

  const update = (raw) => {
    setInner(raw)
    onChange?.(raw)
  }

  const score = strengthScore(current)
  const level = strengthLevels[Math.max(score - 1, 0)]

  return (
    <div>
      <div className={`relative flex h-12 ${fieldShell} ${invalid ? fieldInvalid : fieldBorder}`}>
        <span className="flex items-center pl-3.5 pr-3 border-r border-navy-900/10">
          <Lock size={15} className="text-ink-400" />
        </span>
        <input
          {...props}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={current}
          onChange={(e) => update(e.target.value)}
          className="flex-1 min-w-0 h-full px-3 bg-transparent outline-none text-[15px] text-ink-900 placeholder:text-ink-400 pr-11"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-ink-400 hover:text-navy-900 hover:bg-navy-50 transition-colors focus-ring"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      {showStrength && current.length > 0 && (
        <div className="mt-2.5">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < score ? level.bar : 'bg-navy-100'
                }`}
              />
            ))}
          </div>
          <p className={`mt-1.5 text-[12px] font-semibold ${level.text}`}>
            Password strength: {level.label}
          </p>
        </div>
      )}
    </div>
  )
}

export function Badge({ children, tone = 'green' }) {
  const tones = {
    green: 'bg-green-100 text-green-700',
    navy: 'bg-navy-100 text-navy-800',
    gold: 'bg-gold-100 text-gold-600',
  }
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-semibold ${tones[tone]}`}>{children}</span>
}

// ---------------------------------------------------------------------------
// Portal helpers (shared by the customer / investor dashboard pages)
// ---------------------------------------------------------------------------
export function PageHeader({ title, subtitle, action = null }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display font-bold text-navy-900 text-[24px]">{title}</h1>
        {subtitle && <p className="text-ink-500 text-[14px] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

const pillTones = {
  green: 'bg-green-100 text-green-700',
  navy: 'bg-navy-100 text-navy-800',
  gold: 'bg-gold-100 text-gold-600',
  red: 'bg-red-50 text-red-600',
  grey: 'bg-navy-50 text-ink-600',
}

const pillMap = {
  pending: 'gold',
  submitted: 'gold',
  under_review: 'navy',
  document_verification: 'navy',
  kyc_pending: 'gold',
  agreement_pending: 'gold',
  disbursement_pending: 'gold',
  draft: 'grey',
  approved: 'green',
  active: 'green',
  paid: 'green',
  verified: 'green',
  success: 'green',
  disbursed: 'green',
  closed: 'grey',
  completed: 'green',
  partial: 'gold',
  overdue: 'red',
  rejected: 'red',
  failed: 'red',
  cancelled: 'grey',
  refunded: 'grey',
}

export const statusTone = (status) => pillMap[String(status || '').toLowerCase()] || 'grey'

export const statusLabel = (status) =>
  String(status || '')
    .split('_')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ')

export function StatusPill({ status, label }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12.5px] font-semibold ${pillTones[statusTone(status)]}`}>
      {label || statusLabel(status)}
    </span>
  )
}

export function ErrorCard({ error, onRetry, message }) {
  return (
    <Card className="p-8 mt-6 text-center">
      <span className="w-11 h-11 rounded-full bg-red-50 text-red-500 grid place-items-center mx-auto">
        <AlertCircle size={20} />
      </span>
      <p className="text-[14.5px] text-ink-600 mt-4">{message || (error && error.message) || 'Something went wrong'}</p>
      {onRetry && (
        <Button className="mt-5" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Card>
  )
}

export function EmptyState({ title = 'Nothing here yet', hint }) {
  return (
    <div className="rounded-xl bg-navy-50 ring-1 ring-navy-900/5 px-6 py-10 text-center">
      <p className="text-[14.5px] font-semibold text-navy-900">{title}</p>
      {hint && <p className="text-[13px] text-ink-500 mt-1.5">{hint}</p>}
    </div>
  )
}

export function LoadingRows({ rows = 3 }) {
  return (
    <div className="space-y-3 mt-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-navy-100 animate-pulse" />
      ))}
    </div>
  )
}
