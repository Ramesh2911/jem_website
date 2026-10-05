import { useEffect, useState } from 'react'
import {
  Briefcase, Check, Landmark, Mail, MapPin, ShieldCheck, Smartphone, User, Users,
} from 'lucide-react'
import { Card, Button, Field, PageHeader, ErrorCard, LoadingRows, inputClass } from '../../components/ui'
import { api, errorMessage } from '../../lib/api'
import { useApi } from '../../lib/content'

const PERSONAL_FIELDS = [
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'dateOfBirth', label: 'Date of birth', type: 'date' },
  {
    key: 'gender', label: 'Gender', type: 'select',
    options: [
      { value: '', label: 'Select' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ],
  },
  { key: 'addressLine1', label: 'Address line 1' },
  { key: 'addressLine2', label: 'Address line 2' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'pincode', label: 'Pincode' },
  {
    key: 'employmentType', label: 'Employment type', type: 'select',
    options: [
      { value: '', label: 'Select' },
      { value: 'salaried', label: 'Salaried' },
      { value: 'self_employed', label: 'Self employed' },
      { value: 'business', label: 'Business' },
    ],
  },
  { key: 'companyName', label: 'Company / employer name' },
  { key: 'monthlyIncome', label: 'Monthly income (₹)', type: 'number' },
  { key: 'nomineeName', label: 'Nominee name' },
  { key: 'nomineeRelationship', label: 'Nominee relationship' },
  { key: 'nomineeMobile', label: 'Nominee mobile' },
]

const BANK_FIELDS = [
  { key: 'bankName', label: 'Bank name' },
  { key: 'bankAccountNumber', label: 'Account number' },
  { key: 'bankIFSC', label: 'IFSC' },
  { key: 'bankBranch', label: 'Branch' },
]

const FIELD_MAP = Object.fromEntries(PERSONAL_FIELDS.map((f) => [f.key, f]))

const PERSONAL_SECTIONS = [
  { icon: User, title: 'Basic information', hint: 'Your legal name as per ID proof', fields: ['firstName', 'lastName', 'dateOfBirth', 'gender'] },
  { icon: MapPin, title: 'Address', hint: 'Used for communication and verification', fields: ['addressLine1', 'addressLine2', 'city', 'state', 'pincode'] },
  { icon: Briefcase, title: 'Employment & income', hint: 'Helps us assess loan eligibility faster', fields: ['employmentType', 'companyName', 'monthlyIncome'] },
  { icon: Users, title: 'Nominee', hint: 'Protects your loans and investments', fields: ['nomineeName', 'nomineeRelationship', 'nomineeMobile'] },
]

const snake = (key) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)

const buildForm = (profile, fields) => {
  const out = {}
  fields.forEach(({ key, type }) => {
    const raw = profile && profile[snake(key)]
    out[key] = raw === null || raw === undefined ? '' : type === 'number' ? String(raw) : String(raw)
  })
  return out
}

const filledCount = (profile, fields) => {
  if (!profile) return 0
  return fields.filter(({ key }) => {
    const raw = profile[snake(key)]
    return raw !== null && raw !== undefined && String(raw).trim() !== ''
  }).length
}

function SaveState({ state, className = '' }) {
  if (!state.message) return null
  return (
    <p
      className={`text-[13.5px] font-semibold flex items-center gap-1.5 ${className} ${
        state.error ? 'text-red-600' : 'text-green-700'
      }`}
    >
      {state.error ? null : <Check size={15} />} {state.message}
    </p>
  )
}

function CompletionRing({ pct }) {
  const r = 24
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-3.5">
      <svg width="58" height="58" viewBox="0 0 58 58" className="shrink-0">
        <circle cx="29" cy="29" r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="5" />
        <circle
          cx="29"
          cy="29"
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          transform="rotate(-90 29 29)"
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
        <text x="29" y="30" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize="13" fontWeight="700">
          {pct}%
        </text>
      </svg>
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-white">Profile completion</p>
        <p className="text-[12px] text-white/55 leading-snug">Complete your details for faster loan approvals</p>
      </div>
    </div>
  )
}

function SectionHeading({ icon: Icon, title, hint }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-9 h-9 shrink-0 rounded-xl bg-green-50 text-green-600 grid place-items-center ring-1 ring-green-600/10">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <h3 className="font-display font-bold text-navy-900 text-[15px] leading-tight">{title}</h3>
        {hint && <p className="text-[12.5px] text-ink-400 leading-tight mt-0.5">{hint}</p>}
      </div>
    </div>
  )
}

function Hero({ profile, pct }) {
  const name = `${(profile.first_name || '').trim()} ${(profile.last_name || '').trim()}`.trim() || 'My Account'
  const initials = (
    ((profile.first_name || '')[0] || '') + ((profile.last_name || '')[0] || '')
  ).toUpperCase() || (profile.mobile || 'U').slice(-2)

  const memberSince = (() => {
    const d = profile.created_at ? new Date(profile.created_at) : null
    if (!d || isNaN(d.getTime())) return null
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
  })()

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-[#0b2748] px-6 py-7 sm:px-8 sm:py-8 text-white ring-1 ring-white/10 shadow-[0_30px_60px_-45px_rgba(11,31,58,0.9)]">
      <span
        aria-hidden="true"
        className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-green-500/15 blur-3xl pointer-events-none"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-2xl bg-gradient-to-br from-green-400 to-green-600 grid place-items-center font-display font-bold text-[21px] text-white shadow-lg ring-2 ring-white/15">
              {initials}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white grid place-items-center shadow ring-1 ring-green-500/30">
              <Check size={13} className="text-green-600" strokeWidth={3.5} />
            </span>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-400">My Profile</p>
            <h1 className="font-display font-bold text-[23px] sm:text-[26px] tracking-tight truncate mt-0.5">{name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {profile.mobile && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-[12.5px] font-semibold text-white/85">
                  <Smartphone size={12.5} className="text-green-400" />
                  +91 {profile.mobile}
                </span>
              )}
              {profile.email && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-[12.5px] font-semibold text-white/85 max-w-[240px]">
                  <Mail size={12.5} className="text-green-400" />
                  <span className="truncate">{profile.email}</span>
                </span>
              )}
              {memberSince && (
                <span className="inline-flex items-center rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-[12.5px] font-semibold text-white/70">
                  Member since {memberSince}
                </span>
              )}
            </div>
          </div>
        </div>

        <CompletionRing pct={pct} />
      </div>
    </div>
  )
}

export default function Profile() {
  const { data: profile, loading, error, refetch } = useApi('/customers/profile')
  const [tab, setTab] = useState('personal')
  const [personal, setPersonal] = useState({})
  const [bank, setBank] = useState({})
  const [save, setSave] = useState({ message: '', error: false })
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!profile) return
    setPersonal(buildForm(profile, PERSONAL_FIELDS))
    setBank(buildForm(profile, BANK_FIELDS))
  }, [profile])

  if (loading && !profile) {
    return (
      <>
        <PageHeader title="My Profile" subtitle="Manage your personal and bank details." />
        <LoadingRows rows={4} />
      </>
    )
  }

  if (error && !profile) {
    return (
      <>
        <PageHeader title="My Profile" subtitle="Manage your personal and bank details." />
        <ErrorCard error={error} onRetry={refetch} />
      </>
    )
  }

  const submit = async (payload) => {
    setPending(true)
    setSave({ message: '', error: false })
    try {
      await api.put('/customers/profile', payload)
      setSave({ message: 'Profile updated successfully', error: false })
      refetch()
    } catch (err) {
      setSave({ message: errorMessage(err), error: true })
    } finally {
      setPending(false)
    }
  }

  const savePersonal = () => {
    const payload = {}
    PERSONAL_FIELDS.forEach(({ key, type }) => {
      const value = (personal[key] || '').trim()
      if (value === '') return
      payload[key] = type === 'number' ? Number(value) : value
    })
    if (payload.monthlyIncome && Number.isNaN(payload.monthlyIncome)) {
      setSave({ message: 'Monthly income must be a number', error: true })
      return
    }
    submit(payload)
  }

  const saveBank = () => {
    const payload = {}
    BANK_FIELDS.forEach(({ key }) => {
      const value = (bank[key] || '').trim()
      if (value === '') return
      payload[key] = value
    })
    submit(payload)
  }

  const pct = Math.round((filledCount(profile, PERSONAL_FIELDS) / PERSONAL_FIELDS.length) * 100)

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'bank', label: 'Bank Details', icon: Landmark },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ]

  const renderField = (key, values, onChange) => {
    const def = FIELD_MAP[key]
    if (!def) return null
    const { label, type, options } = def
    return (
      <Field key={key} label={label}>
        {type === 'select' ? (
          <select
            className={inputClass()}
            value={values[key] || ''}
            onChange={(e) => onChange(key, e.target.value)}
          >
            {(options || []).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <input
            className={inputClass()}
            type={type === 'date' ? 'date' : type === 'number' ? 'number' : 'text'}
            value={values[key] || ''}
            onChange={(e) => onChange(key, e.target.value)}
          />
        )}
      </Field>
    )
  }

  const setPersonalField = (key, value) => setPersonal((s) => ({ ...s, [key]: value }))
  const setBankField = (key, value) => setBank((s) => ({ ...s, [key]: value }))

  return (
    <>
      <Hero profile={profile} pct={pct} />

      <div className="flex gap-1.5 mt-6 rounded-2xl bg-navy-50 p-1.5 ring-1 ring-navy-900/5 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setTab(id); setSave({ message: '', error: false }) }}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-[13.5px] font-bold whitespace-nowrap transition-all focus-ring ${
              tab === id
                ? 'bg-white text-navy-900 shadow-[0_2px_10px_-3px_rgba(11,31,58,0.22)] ring-1 ring-navy-900/5'
                : 'text-ink-500 hover:text-navy-900 hover:bg-white/60'
            }`}
          >
            <Icon size={15} className={tab === id ? 'text-green-600' : 'text-ink-400'} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'personal' && (
        <Card className="p-0 mt-6">
          <section className="px-6 pt-6 pb-6">
            <SectionHeading
              icon={Smartphone}
              title="Login identity"
              hint="Verified via OTP at every login — change it from the Security tab"
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Mobile number">
                <input
                  className={`${inputClass()} bg-navy-50 text-ink-500 cursor-not-allowed`}
                  value={(profile && profile.mobile) || ''}
                  disabled
                />
              </Field>
              <Field label="Email">
                <input
                  className={`${inputClass()} bg-navy-50 text-ink-500 cursor-not-allowed`}
                  value={(profile && profile.email) || ''}
                  disabled
                />
              </Field>
            </div>
          </section>

          {PERSONAL_SECTIONS.map(({ icon, title, hint, fields }) => (
            <section key={title} className="px-6 py-6 border-t border-navy-900/8">
              <SectionHeading icon={icon} title={title} hint={hint} />
              <div className="grid sm:grid-cols-2 gap-5">
                {fields.map((key) => renderField(key, personal, setPersonalField))}
              </div>
            </section>
          ))}

          <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-white/95 backdrop-blur border-t border-navy-900/8 rounded-b-2xl">
            <SaveState state={save} />
            <Button className="sm:ml-auto" onClick={savePersonal} disabled={pending}>
              {pending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      )}

      {tab === 'bank' && (
        <Card className="p-0 mt-6">
          <section className="px-6 py-6">
            <SectionHeading
              icon={Landmark}
              title="Bank account details"
              hint="Used for loan disbursements, EMI debits and withdrawals"
            />
            <div className="grid sm:grid-cols-2 gap-5">
              {BANK_FIELDS.map(({ key, label }) => (
                <Field key={key} label={label}>
                  <input
                    className={`${inputClass()} ${key === 'bankIFSC' ? 'uppercase tracking-wider font-semibold' : ''}`}
                    type="text"
                    value={bank[key] || ''}
                    onChange={(e) => setBankField(key, key === 'bankIFSC' ? e.target.value.toUpperCase() : e.target.value)}
                  />
                </Field>
              ))}
            </div>
          </section>

          <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-white/95 backdrop-blur border-t border-navy-900/8 rounded-b-2xl">
            <SaveState state={save} />
            <Button className="sm:ml-auto" onClick={saveBank} disabled={pending}>
              {pending ? 'Saving...' : 'Save Bank Details'}
            </Button>
          </div>
        </Card>
      )}

      {tab === 'security' && (
        <Card className="p-0 mt-6">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 sm:p-8 bg-navy-50/70 border-b lg:border-b-0 lg:border-r border-navy-900/8">
              <span className="w-10 h-10 rounded-xl bg-navy-900 text-white grid place-items-center shadow-md">
                <Smartphone size={18} />
              </span>
              <h3 className="font-display font-bold text-navy-900 text-[17px] mt-4">Mobile number</h3>
              <p className="text-[13.5px] text-ink-500 mt-1 leading-relaxed">
                Your mobile is your identity on JEM Finance — every sign-in is verified with an OTP.
              </p>

              <div className="mt-5 rounded-2xl bg-white ring-1 ring-navy-900/8 px-4 py-3.5">
                <p className="text-[11.5px] font-bold uppercase tracking-wider text-ink-400">Current number</p>
                <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                  <span className="font-display font-bold text-navy-900 text-[21px] tracking-tight">
                    {profile.mobile ? `+91 ${profile.mobile}` : '—'}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 text-[11.5px] font-bold">
                    <Check size={12} strokeWidth={3.5} /> Verified
                  </span>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5">
                {[
                  'Changing your number requires an OTP on the new mobile.',
                  'Login continues to work with the new number instantly.',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-[13px] text-ink-600">
                    <span className="mt-0.5 w-4.5 h-4.5 shrink-0 rounded-full bg-green-100 text-green-700 grid place-items-center">
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 sm:p-8">
              <ChangeMobile currentMobile={profile && profile.mobile} />
            </div>
          </div>
        </Card>
      )}
    </>
  )
}

function ChangeMobile({ currentMobile }) {
  const [step, setStep] = useState('new')
  const [newMobile, setNewMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [state, setState] = useState({ message: '', error: false })
  const [pending, setPending] = useState(false)

  const sendOtp = async (e) => {
    e.preventDefault()
    if (!/^[6-9]\d{9}$/.test(newMobile)) {
      setState({ message: 'Enter a valid 10-digit mobile number', error: true })
      return
    }
    setPending(true)
    setState({ message: '', error: false })
    try {
      await api.post('/customers/change-mobile/send-otp', { newMobile })
      setStep('otp')
      setState({ message: 'OTP sent to the new mobile number', error: false })
    } catch (err) {
      setState({ message: errorMessage(err), error: true })
    } finally {
      setPending(false)
    }
  }

  const confirm = async (e) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(otp)) {
      setState({ message: 'Enter the 6-digit OTP', error: true })
      return
    }
    setPending(true)
    setState({ message: '', error: false })
    try {
      await api.put('/customers/change-mobile', { newMobile, otp })
      setStep('new')
      setNewMobile('')
      setOtp('')
      setState({ message: 'Mobile number updated successfully', error: false })
    } catch (err) {
      setState({ message: errorMessage(err), error: true })
    } finally {
      setPending(false)
    }
  }

  const steps = [
    { id: 'new', n: 1, label: 'New number' },
    { id: 'otp', n: 2, label: 'Verify OTP' },
  ]

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-6">
        {steps.map(({ id, n, label }, i) => {
          const active = step === id
          const done = steps.findIndex((s) => s.id === step) > i
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

      {step === 'new' ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <p className="text-[13.5px] text-ink-500 leading-relaxed">
            Enter your new mobile number — we will send a 6-digit OTP to confirm ownership.
          </p>
          <Field label="New mobile number">
            <input
              className={inputClass('font-semibold tracking-wider')}
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
            />
          </Field>
          <Button type="submit" disabled={pending}>
            {pending ? 'Sending OTP...' : 'Send OTP'}
          </Button>
          <SaveState state={state} />
        </form>
      ) : (
        <form onSubmit={confirm} className="space-y-4">
          <p className="text-[13.5px] text-ink-500 leading-relaxed">
            Enter the 6-digit OTP sent to{' '}
            <span className="font-bold text-navy-900">+91 {newMobile}</span>
          </p>
          <Field label="OTP">
            <input
              className={inputClass('tracking-[0.4em] font-bold text-center text-[17px]')}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="––––––"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? 'Verifying...' : 'Confirm'}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setStep('new'); setState({ message: '', error: false }) }}>
              Change number
            </Button>
          </div>
          <SaveState state={state} />
        </form>
      )}

      {currentMobile && step === 'new' && (
        <p className="mt-6 pt-5 border-t border-navy-900/8 text-[12.5px] text-ink-400">
          Currently signed in with <span className="font-semibold text-ink-600">+91 {currentMobile}</span>
        </p>
      )}
    </div>
  )
}
