import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Sparkles, AlertCircle, User, Check, Lock, ShieldCheck, ArrowLeft, Mail, Smartphone,
} from 'lucide-react'
import AuthShell from '../components/AuthShell'
import { Field, Button, MobileInput, authInputClass } from '../components/ui'
import { api, errorMessage } from '../lib/api'
import { openOtpWidget } from '../lib/msg91'

const maskMobile = (m) => `${String(m || '').slice(0, 5)} ${'•'.repeat(5)}`

export default function Register() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('customer')
  const [form, setForm] = useState({ name: '', mobile: '', email: '' })
  const [errors, setErrors] = useState({})
  const [agreed, setAgreed] = useState(false)
  const [formError, setFormError] = useState('')
  const [verifyError, setVerifyError] = useState('')
  const [loginLink, setLoginLink] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const navigate = useNavigate()

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
    setFormError('')
    setVerifyError('')
    setLoginLink(false)
  }

  const goStep2 = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim() || form.name.trim().length < 2) next.name = 'Please enter your full name'
    if (form.mobile.length !== 10) next.mobile = 'Enter a valid 10-digit mobile number'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (Object.keys(next).some((k) => next[k])) {
      setErrors(next)
      return
    }
    if (!agreed) {
      setFormError('Please accept the Terms & Conditions and Privacy Policy')
      return
    }
    setErrors({})
    setVerifyError('')
    setLoginLink(false)
    setStep(2)
  }

  const verify = async () => {
    setVerifying(true)
    setVerifyError('')
    setLoginLink(false)
    try {
      const token = await openOtpWidget({ identifier: `91${form.mobile}` })
      await api.post('/auth/register/widget', {
        token,
        mobile: form.mobile,
        firstName: form.name.trim(),
        email: form.email.trim() || undefined,
        userType: role,
      })
      navigate('/login', { replace: true, state: { registered: form.mobile } })
    } catch (err) {
      if (err && err.status === 409) {
        setVerifyError(errorMessage(err))
        setLoginLink(true)
      } else {
        setVerifyError(errorMessage(err))
      }
    } finally {
      setVerifying(false)
    }
  }

  const error = (key) =>
    errors[key] ? (
      <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-red-500 mt-1.5">
        <AlertCircle size={13} />
        {errors[key]}
      </span>
    ) : null

  return (
    <AuthShell>
      <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-navy-900/10 shadow-[0_30px_70px_-40px_rgba(11,31,58,0.45)]">
        <div className="h-1.5 w-full bg-gradient-to-r from-navy-900 via-green-600 to-green-500" />

        <div className="px-6 py-7 sm:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-[11.5px] font-bold uppercase tracking-wider text-gold-600">
            {step === 1 ? <Sparkles size={13} /> : <ShieldCheck size={13} />}
            {step === 1 ? '100% Free' : 'Secure Verification'}
          </span>

          <h1 className="font-display font-bold text-navy-900 text-[27px] tracking-tight mt-4">
            {step === 1 ? 'Create your account' : 'Verify your number'}
          </h1>
          <p className="text-ink-600 text-[14.5px] mt-1.5">
            {step === 1
              ? 'Join JEM Finance & unlock loans and investments.'
              : `We will send an OTP to +91 ${maskMobile(form.mobile)} to verify your number.`}
          </p>

          <div className="flex items-center gap-3 mt-5 text-[12.5px] font-semibold">
            <span className={step >= 1 ? 'text-green-600' : 'text-ink-400'}>1 Details</span>
            <span className="h-px flex-1 bg-navy-900/10" />
            <span className={step >= 2 ? 'text-green-600' : 'text-ink-400'}>2 Verify</span>
          </div>

          {step === 1 && (
            <>
              <div className="relative grid grid-cols-2 gap-1 rounded-xl bg-navy-50 p-1 mt-6 ring-1 ring-navy-900/5">
                <span
                  aria-hidden="true"
                  className={`absolute left-1 top-1 bottom-1 w-[calc(50%-6px)] rounded-lg bg-white shadow-[0_2px_8px_-2px_rgba(11,31,58,0.25)] transition-transform duration-200 ease-out ${
                    role === 'investor' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                  }`}
                />
                {['customer', 'investor'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`relative z-10 py-2 rounded-lg text-[13.5px] font-semibold capitalize transition-colors focus-ring ${
                      role === r ? 'text-navy-900' : 'text-ink-600 hover:text-navy-900/70'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <form onSubmit={goStep2} className="mt-6 space-y-4">
                <Field label="Full Name">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
                      <User size={16} />
                    </span>
                    <input
                      required
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) => set('name')(e.target.value)}
                      className={authInputClass('pl-11')}
                    />
                  </div>
                  {error('name')}
                </Field>

                <Field label="Mobile Number">
                  <MobileInput
                    required
                    value={form.mobile}
                    invalid={!!errors.mobile}
                    onChange={set('mobile')}
                    placeholder="98765 43210"
                  />
                  {error('mobile')}
                </Field>

                <Field label="Email" hint="Optional - used for account notifications.">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => set('email')(e.target.value)}
                      className={authInputClass('pl-11')}
                    />
                  </div>
                  {error('email')}
                </Field>

                <label className="flex items-start gap-2.5 text-[13.5px] text-ink-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`mt-0.5 w-4 h-4 shrink-0 rounded-[5px] border grid place-items-center transition-all ${
                      agreed
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-white border-navy-900/25 text-transparent'
                    }`}
                  >
                    <Check size={11} strokeWidth={3.5} />
                  </span>
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
                      Terms &amp; Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {formError && (
                  <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-red-500">
                    <AlertCircle size={13} />
                    {formError}
                  </span>
                )}

                <Button type="submit" size="lg" className="w-full">
                  Continue <ArrowRight size={18} />
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-navy-50 ring-1 ring-navy-900/5 px-4 py-3.5 space-y-1.5 text-[13.5px]">
                <div className="flex justify-between gap-3">
                  <span className="text-ink-500">Name</span>
                  <span className="font-semibold text-navy-900 truncate">{form.name}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-ink-500">Mobile</span>
                  <span className="font-semibold text-navy-900">+91 {form.mobile}</span>
                </div>
                {form.email.trim() && (
                  <div className="flex justify-between gap-3">
                    <span className="text-ink-500">Email</span>
                    <span className="font-semibold text-navy-900 truncate">{form.email}</span>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-green-50 ring-1 ring-green-600/15 px-4 py-3.5 text-[13px] text-ink-600 leading-relaxed">
                Tap the button below - an OTP window will open. Enter the OTP sent to your number to verify it.
              </div>

              {verifyError && (
                <span className="flex flex-wrap items-center gap-1.5 text-[12.5px] font-medium text-red-500">
                  <AlertCircle size={13} />
                  {verifyError}
                  {loginLink && (
                    <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
                      Login
                    </Link>
                  )}
                </span>
              )}

              <Button type="button" size="lg" className="w-full" onClick={verify} disabled={verifying}>
                {verifying ? 'Please wait...' : 'Verify phone number'}
                {!verifying && <Smartphone size={17} />}
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full inline-flex items-center justify-center gap-1.5 text-[13px] text-ink-600 font-semibold hover:text-navy-900 transition-colors focus-ring"
              >
                <ArrowLeft size={14} />
                Change details
              </button>
            </div>
          )}

          <p className="flex items-center justify-center gap-1.5 text-[12.5px] text-ink-400 mt-5">
            <Lock size={13} />
            Your data is encrypted &amp; never shared
          </p>
        </div>
      </div>

      <p className="text-center text-[14px] text-ink-600 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
          Login
        </Link>
      </p>
    </AuthShell>
  )
}
