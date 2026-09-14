import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { Field, inputClass, Button } from '../components/ui'

export default function Register() {
  const [role, setRole] = useState('customer')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(role === 'customer' ? '/dashboard/customer' : '/dashboard/investor')
  }

  return (
    <AuthShell>
      <h1 className="font-display font-bold text-navy-900 text-[26px]">Create Your Account</h1>
      <p className="text-ink-500 text-[14.5px] mt-1">Join JEM Finance today</p>

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
        <Field label="Full Name">
          <input required type="text" placeholder="Enter Your Name" className={inputClass()} />
        </Field>
        <Field label="Mobile Number">
          <input required type="tel" placeholder="Enter Mobile Number" className={inputClass()} />
        </Field>
        <Field label="Password">
          <input required type="password" placeholder="Create Password" className={inputClass()} />
        </Field>
        <Field label="Confirm Password">
          <input required type="password" placeholder="Confirm Password" className={inputClass()} />
        </Field>

        <label className="flex items-start gap-2 text-[13.5px] text-ink-600">
          <input required type="checkbox" className="accent-green-600 w-4 h-4 mt-0.5" />
          <span>I agree to the <Link to="/terms" className="text-green-600 hover:underline">Terms &amp; Conditions</Link></span>
        </label>

        <Button type="submit" className="w-full">Register</Button>
      </form>

      <p className="text-center text-[14px] text-ink-500 mt-6">
        Already have an account? <Link to="/login" className="text-green-600 font-semibold hover:underline">Login</Link>
      </p>
    </AuthShell>
  )
}
