import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import AuthShell from '../components/AuthShell'
import { Field, inputClass, Button } from '../components/ui'

export default function Login() {
  const [role, setRole] = useState('customer')
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(role === 'customer' ? '/dashboard/customer' : '/dashboard/investor')
  }

  return (
    <AuthShell>
      <h1 className="font-display font-bold text-navy-900 text-[26px]">Welcome Back</h1>
      <p className="text-ink-500 text-[14.5px] mt-1">Log in to your account</p>

      <div className="flex bg-navy-50 rounded-lg p-1 mt-6">
        {['customer', 'investor'].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`flex-1 py-2 rounded-md text-[13.5px] font-semibold capitalize transition-colors focus-ring ${
              role === r ? 'bg-white text-navy-900 shadow-sm' : 'text-ink-500'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <Field label="Mobile Number">
          <div className="flex gap-2">
            <span className={`${inputClass()} w-16 flex items-center justify-center px-0 shrink-0`}>+91</span>
            <input required type="tel" placeholder="Enter Mobile Number" className={inputClass()} />
          </div>
        </Field>
        <Field label="Password">
          <div className="relative">
            <input required type={showPw ? 'text' : 'password'} placeholder="Enter your password" className={inputClass('pr-10')} />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 focus-ring">
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between text-[13.5px]">
          <label className="flex items-center gap-2 text-ink-600">
            <input type="checkbox" className="accent-green-600 w-4 h-4" /> Remember me
          </label>
          <Link to="#" className="text-green-600 font-medium hover:underline">Forgot Password?</Link>
        </div>

        <Button type="submit" className="w-full">Login</Button>
      </form>

      <p className="text-center text-[14px] text-ink-500 mt-6">
        Don't have an account? <Link to="/register" className="text-green-600 font-semibold hover:underline">Register Now</Link>
      </p>
    </AuthShell>
  )
}
