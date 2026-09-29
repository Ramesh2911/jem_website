import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, AlertCircle, User, Check, Lock, ShieldCheck, ArrowLeft } from 'lucide-react'
import AuthShell from '../components/AuthShell'
import { Field, Button, MobileInput, PasswordInput, authInputClass } from '../components/ui'
import { api, errorMessage, setSession } from '../lib/api'

const maskMobile = (m) => `${String(m || '').slice(0, 5)} ${'•'.repeat(5)}`

export default function Register() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('customer')
  const [form, setForm] = useState({ name: '', mobile: '', pw: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [devOtp, setDevOtp] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const navigate = useNavigate()

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '', ...(key === 'mobile' ? { mobileLogin: false } : {}) }))
    if (key === 'mobile') setFormError('')
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your full name'
    if (form.mobile.length !== 10) next.mobile = 'Enter a valid 10-digit mobile number'
    if (form.pw.length < 8) next.pw = 'Password must be at least 8 characters'
    if (form.confirm !== form.pw) next.confirm = 'Passwords do not match'
    if (Object.keys(next).some((k) => next[k])) {
      setErrors(next)
      return
    }

    setLoading(true)
    setFormError('')
    api
      .post('/auth/register', {
        mobile: form.mobile,
        userType: role,
        firstName: form.name.trim(),
        password: form.pw,
      })
      .then((res) => {
        setDevOtp((res && res.data && res.data.devOtp) || '')
        setOtp('')
        setOtpError('')
        setStep(2)
      })
      .catch((err) => {
        if (err && err.status === 409) {
          setErrors((e) => ({ ...e, mobile: errorMessage(err), mobileLogin: true }))
        } else {
          setFormError(errorMessage(err))
        }
      })
      .finally(() => setLoading(false))
  }

  const verify = (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setOtpError('Enter the 6-digit OTP sent to your mobile')
      return
    }
    setOtpLoading(true)
    setOtpError('')
    api
      .post('/auth/verify-otp', { mobile: form.mobile, otp, purpose: 'register' })
      .then((res) => {
        const session = res && res.data
        setSession(session)
        navigate(session && session.user && session.user.userType === 'investor' ? '/dashboard/investor' : '/dashboard/customer', {
          replace: true,
        })
      })
      .catch((err) => setOtpError(errorMessage(err)))
      .finally(() => setOtpLoading(false))
  }

  const resend = () => {
    setResendLoading(true)
    setOtpError('')
    api
      .post('/auth/send-otp', { mobile: form.mobile, purpose: 'register' })
      .then((res) => {
        setDevOtp((res && res.data && res.data.devOtp) || '')
        setOtp('')
      })
      .catch((err) => setOtpError(errorMessage(err)))
      .finally(() => setResendLoading(false))
  }

  const error = (key) =>
    errors[key] ? (
      <span className="flex flex-wrap items-center gap-1.5 text-[12.5px] font-medium text-red-500 mt-1.5">
        <AlertCircle size={13} />
        {errors[key]}
        {key === 'mobile' && errors.mobileLogin && (
          <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
            Login
          </Link>
        )}
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
              : `We sent a 6-digit code to +91 ${maskMobile(form.mobile)}.`}
          </p>

          <div className="flex items-center gap-3 mt-5 text-[12.5px] font-semibold">
            <span className={step === 1 ? 'text-green-600' : 'text-ink-400'}>1 Details</span>
            <span className="h-px flex-1 bg-navy-900/10" />
            <span className={step === 2 ? 'text-green-600' : 'text-ink-400'}>2 Verify</span>
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

              <form onSubmit={submit} className="mt-6 space-y-4">
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

                <Field label="Password" hint={'Use 8+ characters with a number & symbol.'}>
                  <PasswordInput
                    required
                    value={form.pw}
                    invalid={!!errors.pw}
                    onChange={set('pw')}
                    autoComplete="new-password"
                    showStrength
                    placeholder="Create a strong password"
                  />
                  {error('pw')}
                </Field>

                <Field label="Confirm Password">
                  <PasswordInput
                    required
                    value={form.confirm}
                    invalid={!!errors.confirm}
                    onChange={set('confirm')}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                  />
                  {error('confirm')}
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

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Please wait...' : 'Create Account'}
                  {!loading && <ArrowRight size={18} />}
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <form onSubmit={verify} className="mt-6 space-y-4">
              <Field label="Enter 6-digit OTP">
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                    if (otpError) setOtpError('')
                  }}
                  className={authInputClass('text-center font-bold text-[19px]')}
                  style={{ letterSpacing: '0.4em' }}
                />
                {otpError && (
                  <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-red-500 mt-1.5">
                    <AlertCircle size={13} />
                    {otpError}
                  </span>
                )}
              </Field>

              {devOtp && (
                <div className="rounded-lg bg-gold-100 px-3.5 py-2.5 text-[12.5px] font-semibold text-gold-600 ring-1 ring-gold-600/25">
                  Dev OTP: {devOtp}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={otpLoading}>
                {otpLoading ? 'Please wait...' : 'Verify & Continue'}
                {!otpLoading && <ArrowRight size={18} />}
              </Button>

              <div className="flex items-center justify-between text-[13px]">
                <button
                  type="button"
                  onClick={resend}
                  disabled={resendLoading}
                  className="text-green-600 font-semibold hover:text-green-700 hover:underline disabled:opacity-60 focus-ring"
                >
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setOtp('')
                    setOtpError('')
                  }}
                  className="inline-flex items-center gap-1.5 text-ink-600 font-semibold hover:text-navy-900 transition-colors focus-ring"
                >
                  <ArrowLeft size={14} />
                  Change details
                </button>
              </div>
            </form>
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
