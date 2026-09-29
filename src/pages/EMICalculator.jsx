import { useEffect, useRef, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { RefreshCw } from 'lucide-react'
import { Card } from '../components/ui'
import { calculateEMI } from '../lib/loans'
import { errorMessage } from '../lib/api'

function formatINR(n) {
  return Math.round(Number(n) || 0).toLocaleString('en-IN')
}

export default function EMICalculator() {
  const [amount, setAmount] = useState(1000000)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(20)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nonce, setNonce] = useState(0)
  const requestId = useRef(0)

  useEffect(() => {
    const id = ++requestId.current
    setLoading(true)
    const timer = setTimeout(() => {
      calculateEMI({ amount, rate, tenure: years * 12 })
        .then((res) => {
          if (requestId.current !== id) return
          if (res) setResult(res)
          setError(null)
        })
        .catch((err) => {
          if (requestId.current !== id) return
          setError(errorMessage(err))
        })
        .finally(() => {
          if (requestId.current === id) setLoading(false)
        })
    }, 300)
    return () => clearTimeout(timer)
  }, [amount, rate, years, nonce])

  const principal = Number((result && result.principal) || 0)
  const totalInterest = Number((result && result.totalInterest) || 0)
  const totalPayment = Number((result && result.totalPayable) || 0)
  const emi = Number((result && result.emi) || 0)

  const data = [
    { name: 'Principal Amount', value: principal, color: '#123C6B' },
    { name: 'Total Interest', value: totalInterest, color: '#22A85B' },
  ]

  return (
    <div className="bg-navy-50 py-16 lg:py-20">
      <div className="container-page">
        <div className="max-w-xl mb-12">
          <h1 className="font-display font-bold text-navy-900 text-[34px] sm:text-[40px]">EMI Calculator</h1>
          <p className="text-ink-600 mt-3 text-[15.5px]">Plan your finances better before you apply.</p>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
          <Card className="p-7 sm:p-8">
            <Slider label="Loan Amount" prefix="₹" value={amount} min={50000} max={10000000} step={10000} onChange={setAmount} />
            <Slider label="Interest Rate (%)" value={rate} min={5} max={20} step={0.1} onChange={setRate} suffix="%" />
            <Slider label="Tenure (Years)" value={years} min={1} max={30} step={1} onChange={setYears} suffix=" yrs" />
          </Card>

          <Card className={`p-7 sm:p-8 ${loading ? 'opacity-70 transition-opacity' : 'transition-opacity'}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13.5px] text-ink-500">Your Estimated EMI</p>
              {loading && <span className="text-[11.5px] font-semibold text-ink-400 animate-pulse">Updating…</span>}
            </div>
            <p className="font-display font-bold text-green-600 text-[36px] mt-1">
              ₹{formatINR(emi)}<span className="text-[15px] text-ink-400 font-normal"> per month</span>
            </p>

            <div className="h-44 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" innerRadius={48} outerRadius={68} paddingAngle={3}>
                    {data.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `₹${formatINR(v)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mt-2 border-t border-navy-900/8 pt-5">
              <Row label="Principal Amount" value={`₹${formatINR(principal)}`} dot="#123C6B" />
              <Row label="Total Interest" value={`₹${formatINR(totalInterest)}`} dot="#22A85B" />
              <Row label="Total Payment" value={`₹${formatINR(totalPayment)}`} bold />
            </div>

            {error && (
              <div className="mt-5 rounded-lg bg-amber-50 ring-1 ring-amber-200 px-3.5 py-2.5 flex items-center justify-between gap-3">
                <p className="text-[12.5px] text-amber-700 leading-snug">
                  {error}{result ? ' — showing your last result.' : ''}
                </p>
                <button
                  type="button"
                  onClick={() => setNonce((n) => n + 1)}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-amber-700 hover:underline shrink-0"
                >
                  <RefreshCw size={13} /> Retry
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange, prefix = '', suffix = '' }) {
  return (
    <div className="mb-7 last:mb-0">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[13.5px] font-semibold text-navy-900">{label}</span>
        <span className="text-[14px] font-semibold text-green-600">{prefix}{typeof value === 'number' && value >= 1000 ? value.toLocaleString('en-IN') : value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-green-600"
      />
    </div>
  )
}

function Row({ label, value, dot, bold }) {
  return (
    <div className="flex items-center justify-between text-[14px]">
      <span className="flex items-center gap-2 text-ink-600">
        {dot && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dot }} />}
        {label}
      </span>
      <span className={bold ? 'font-bold text-navy-900' : 'font-semibold text-navy-900'}>{value}</span>
    </div>
  )
}
