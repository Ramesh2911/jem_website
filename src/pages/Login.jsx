import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, AlertCircle, Lock } from 'lucide-react'
import AuthShell from '../components/AuthShell'
import { Field, Button, MobileInput } from '../components/ui'
import { api, errorMessage, setSession } from '../lib/api'
import { openOtpWidget } from '../lib/msg91'

export default function Login() {
  const location = useLocation()
  const registered = (location.state && location.state.registered) || ''
  const [role, setRole] = useState('customer')
  const [mobile, setMobile] = useState('')
  const [mobileErr, setMobileErr] = useState('')
  const [formError, setFormError] = useState('')
  const [noAccount, setNoAccount] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const afterLogin = (session) => {
    navigate(session && session.user && session.user.userType === 'investor' ? '/dashboard/investor' : '/dashboard/customer', {
      replace: true,
    })
  }

  const validMobile = () => {
    if (mobile.length !== 10) {
      setMobileErr('Enter a valid 10-digit mobile number')
      return false
    }
    return true
  }

  const loginWithWidget = async () => {
    if (!validMobile()) return
    setLoading(true)
    setFormError('')
    setNoAccount(false)
    try {
      const token = await openOtpWidget({ identifier: `91${mobile}` })
      const res = await api.post('/auth/login/widget', { token, userType: role })
      setSession(res && res.data)
      afterLogin(res && res.data)
    } catch (err) {
      if (err && err.status === 404) setNoAccount(true)
      setFormError(errorMessage(err))
    } finally {
      setLoading(false)
    }
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

          {registered && (
            <div className="rounded-xl bg-green-50 ring-1 ring-green-600/20 px-4 py-3 mt-5 text-[13px] font-medium text-green-700">
              Account created for +91 {registered}. Please login with an OTP.
            </div>
          )}

          <div className="mt-6 space-y-4">
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

            <div className="rounded-xl bg-green-50 ring-1 ring-green-600/15 px-4 py-3.5 text-[13px] text-ink-600 leading-relaxed">
              Tap the button below - an OTP window will open. Enter the OTP sent to your number to login instantly.
            </div>

            {formError && inlineError(formError)}

            <Button type="button" size="lg" className="w-full" onClick={loginWithWidget} disabled={loading}>
              {loading ? 'Verifying...' : 'Send OTP & Login'}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </div>

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
