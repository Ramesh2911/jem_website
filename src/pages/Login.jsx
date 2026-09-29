import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, AlertCircle, Lock, Check, KeyRound, Smartphone } from 'lucide-react'
import AuthShell from '../components/AuthShell'
import { Field, Button, MobileInput, PasswordInput, authInputClass } from '../components/ui'
import { api, errorMessage, setSession } from '../lib/api'

const maskMobile = (m) => `${String(m || '').slice(0, 5)} ${'•'.repeat(5)}`

export default function Login() {
  const [role, setRole] = useState('customer')
  const [method, setMethod] = useState('password')
  const [mobile, setMobile] = useState('')
  const [pw, setPw] = useState('')
  const [mobileErr, setMobileErr] = useState('')
  const [formError, setFormError] = useState('')
  const [noAccount, setNoAccount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [devOtp, setDevOtp] = useState('')
  const [remember, setRemember] = useState(false)
  const navigate = useNavigate()

  const afterLogin = (session) => {
    navigate(session && session.user && session.user.userType === 'investor' ? '/dashboard/investor' : '/dashboard/customer', {
      replace: true,
    })
  }

  const switchMethod = (next) => {
    if (next === method) return
    setMethod(next)
    setFormError('')
    setOtpError('')
    setNoAccount(false)
    setOtpSent(false)
    setOtp('')
    setDevOtp('')
    setPw('')
  }

  const validMobile = () => {
    if (mobile.length !== 10) {
      setMobileErr('Enter a valid 10-digit mobile number')
      return false
    }
    return true
  }

  const submitPassword = (e) => {
    e.preventDefault()
    if (!validMobile()) return
    if (!pw) {
      setFormError('Please enter your password')
      return
    }
    setLoading(true)
    setFormError('')
    setNoAccount(false)
    api
      .post('/auth/admin/login', { mobile, password: pw })
      .then((res) => {
        setSession(res && res.data)
        afterLogin(res && res.data)
      })
      .catch((err) => setFormError(errorMessage(err)))
      .finally(() => setLoading(false))
  }

  const sendOtp = () => {
    if (!validMobile()) return
    setLoading(true)
    setFormError('')
    setOtpError('')
    setNoAccount(false)
    api
      .post('/auth/send-otp', { mobile, purpose: 'login' })
      .then((res) => {
        setOtpSent(true)
        setOtp('')
        setDevOtp((res && res.data && res.data.devOtp) || '')
      })
      .catch((err) => {
        if (err && err.status === 404) {
          setNoAccount(true)
          setFormError(errorMessage(err))
        } else {
          setFormError(errorMessage(err))
        }
      })
      .finally(() => setLoading(false))
  }

  const submitOtp = (e) => {
    e.preventDefault()
    if (!otpSent) {
      sendOtp()
      return
    }
    if (otp.length !== 6) {
      setOtpError('Enter the 6-digit OTP sent to your mobile')
      return
    }
    setLoading(true)
    setOtpError('')
    api
      .post('/auth/login', { mobile, otp })
      .then((res) => {
        setSession(res && res.data)
        afterLogin(res && res.data)
      })
      .catch((err) => setOtpError(errorMessage(err)))
      .finally(() => setLoading(false))
  }

  const inlineError = (message) =>
    message ? (
      <span className="flex flex-wrap items-center gap-1.5 text-[12.5px] font-medium text-red-500 mt-1.5">
        <AlertCircle size={13} />
        {message}
        {noAccount && (
          <Link to="/register" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
            Register now
          </Link>
        )}
      </span>
    ) : null

  return (
    <AuthShell>
      <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-navy-900/10 shadow-[0_30px_70px_-40px_rgba(11,31,58,0.45)]">
        <div className="h-1.5 w-full bg-gradient-to-r from-navy-900 via-green-600 to-green-500" />

        <div className="px-6 py-7 sm:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11.5px] font-bold uppercase tracking-wider text-green-700">
            <ShieldCheck size={13} />
            Secure Sign In
          </span>

          <h1 className="font-display font-bold text-navy-900 text-[27px] tracking-tight mt-4">
            Welcome back
          </h1>
          <p className="text-ink-600 text-[14.5px] mt-1.5">
            Log in to manage your loans &amp; investments.
          </p>

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

          <div className="flex items-center gap-2 mt-4">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-ink-400">
              Sign in with
            </span>
            <div className="flex gap-1.5">
              {[
                { key: 'password', label: 'Password', icon: KeyRound },
                { key: 'otp', label: 'OTP', icon: Smartphone },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchMethod(key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors focus-ring ${
                    method === key
                      ? 'bg-navy-900 text-white'
                      : 'bg-navy-50 text-ink-600 hover:text-navy-900 hover:bg-navy-100'
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {method === 'password' ? (
            <form onSubmit={submitPassword} className="mt-6 space-y-4">
              <Field label="Mobile Number">
                <MobileInput
                  required
                  value={mobile}
                  invalid={!!mobileErr}
                  onChange={(v) => {
                    setMobile(v)
                    if (mobileErr) setMobileErr('')
                    if (formError) setFormError('')
                    if (noAccount) setNoAccount(false)
                  }}
                  placeholder="98765 43210"
                />
                {inlineError(mobileErr)}
              </Field>

              <Field label="Password">
                <PasswordInput
                  required
                  value={pw}
                  invalid={!!formError && !noAccount}
                  onChange={(v) => {
                    setPw(v)
                    if (formError) setFormError('')
                  }}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                {inlineError(formError)}
              </Field>

              <div className="flex items-center justify-between text-[13.5px]">
                <label className="flex items-center gap-2 text-ink-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="sr-only peer"
                  />
                  <span
                    className={`w-4 h-4 rounded-[5px] border grid place-items-center transition-all ${
                      remember
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-white border-navy-900/25 text-transparent'
                    }`}
                  >
                    <Check size={11} strokeWidth={3.5} />
                  </span>
                  Remember me
                </label>
                <Link to="#" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : 'Login'}
                {!loading && <ArrowRight size={18} />}
              </Button>
            </form>
          ) : (
            <form onSubmit={submitOtp} className="mt-6 space-y-4">
              <Field label="Mobile Number">
                <MobileInput
                  required
                  value={mobile}
                  invalid={!!mobileErr}
                  onChange={(v) => {
                    setMobile(v)
                    if (mobileErr) setMobileErr('')
                    if (formError) setFormError('')
                    if (noAccount) setNoAccount(false)
                    if (otpSent) {
                      setOtpSent(false)
                      setOtp('')
                      setOtpError('')
                      setDevOtp('')
                    }
                  }}
                  placeholder="98765 43210"
                />
                {inlineError(mobileErr)}
              </Field>

              {!otpSent && formError && inlineError(formError)}

              {otpSent && (
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
              )}

              {devOtp && (
                <div className="rounded-lg bg-gold-100 px-3.5 py-2.5 text-[12.5px] font-semibold text-gold-600 ring-1 ring-gold-600/25">
                  Dev OTP: {devOtp}
                </div>
              )}

              {!otpSent ? (
                <Button type="button" size="lg" className="w-full" onClick={sendOtp} disabled={loading}>
                  {loading ? 'Please wait...' : 'Send OTP'}
                  {!loading && <ArrowRight size={18} />}
                </Button>
              ) : (
                <>
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Please wait...' : 'Login'}
                    {!loading && <ArrowRight size={18} />}
                  </Button>

                  <div className="flex items-center justify-between text-[13px]">
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={loading}
                      className="text-green-600 font-semibold hover:text-green-700 hover:underline disabled:opacity-60 focus-ring"
                    >
                      {loading ? 'Sending...' : `Resend OTP to +91 ${maskMobile(mobile)}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false)
                        setOtp('')
                        setOtpError('')
                        setDevOtp('')
                      }}
                      className="text-ink-600 font-semibold hover:text-navy-900 transition-colors focus-ring"
                    >
                      Change number
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          <p className="flex items-center justify-center gap-1.5 text-[12.5px] text-ink-400 mt-5">
            <Lock size={13} />
            Protected with 256-bit encryption
          </p>
        </div>
      </div>

      <p className="text-center text-[14px] text-ink-600 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
          Register Now
        </Link>
      </p>
    </AuthShell>
  )
}
