import { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Landmark, TrendingUp, Wallet, HandCoins, ArrowRight, AlertCircle, RefreshCw, PieChart } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { Card, Button } from '../components/ui'
import { isAuthenticated, clearSession, errorMessage, getUser } from '../lib/api'
import { useApi, cachedGet } from '../lib/content'
import { formatCurrency } from '../lib/loans'

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const toSeries = (source) => {
  if (!Array.isArray(source)) return []
  return source
    .map((s) => ({
      month: (s && (s.month || s.label || s.period || s.date)) || '',
      value: s && s.value !== undefined ? num(s.value) : num(s && s.amount),
    }))
    .filter((s) => s.month && s.value > 0)
}

function Skeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} className="p-5">
          <div className="w-10 h-10 rounded-xl bg-navy-100 animate-pulse" />
          <div className="h-3 w-24 rounded bg-navy-100 animate-pulse mt-4" />
          <div className="h-6 w-28 rounded bg-navy-100 animate-pulse mt-2" />
        </Card>
      ))}
    </div>
  )
}

export default function InvestorDashboard() {
  const navigate = useNavigate()
  const session = getUser()
  const { data, loading, error, refetch } = useApi('/investors/dashboard', null, {
    enabled: isAuthenticated(),
  })

  const unauthenticated = !!error && error.status === 401

  useEffect(() => {
    if (cachedGet('/investors/dashboard') !== undefined) refetch()
  }, [])

  useEffect(() => {
    if (unauthenticated) {
      clearSession()
      navigate('/login', { replace: true })
    }
  }, [unauthenticated, navigate])

  if (!isAuthenticated() || unauthenticated) return <Navigate to="/login" replace />

  const d = data || {}
  const firstName =
    (session && session.profile && session.profile.first_name) || (session && session.mobile) || 'there'

  const cards = [
    { icon: Landmark, label: 'Total Investment', value: formatCurrency(d.totalInvestment), tone: 'navy' },
    { icon: TrendingUp, label: 'Total Earnings', value: formatCurrency(d.totalEarnings), tone: 'green' },
    { icon: Wallet, label: 'Available Balance', value: formatCurrency(d.availableBalance), tone: 'gold' },
    { icon: HandCoins, label: 'Active Investments', value: String(num(d.activeInvestments)), tone: 'navy' },
  ]

  const growth = toSeries(d.growth || d.series || d.chart || d.timeline)

  return (
    <DashboardLayout role="investor">
      <h1 className="font-display font-bold text-navy-900 text-[24px]">Welcome, {firstName}</h1>
      <p className="text-ink-500 text-[14px] mt-1">Here's your investment overview.</p>

      {loading && (
        <>
          <Skeleton />
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-7">
            <Card className="p-6">
              <div className="h-4 w-44 rounded bg-navy-100 animate-pulse" />
              <div className="h-64 rounded-xl bg-navy-100 animate-pulse mt-5" />
            </Card>
            <Card className="p-6 bg-navy-100" />
          </div>
        </>
      )}

      {!loading && error && (
        <Card className="p-8 mt-7 text-center">
          <span className="w-11 h-11 rounded-full bg-red-50 text-red-500 grid place-items-center mx-auto">
            <AlertCircle size={20} />
          </span>
          <p className="text-[14.5px] text-ink-600 mt-4">{errorMessage(error)}</p>
          <Button className="mt-5" onClick={refetch}>
            <RefreshCw size={16} /> Retry
          </Button>
        </Card>
      )}

      {!loading && !error && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">
            {cards.map(({ icon: Icon, label, value, tone }) => (
              <Card key={label} className="p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tone === 'green' ? 'bg-green-100' : tone === 'gold' ? 'bg-gold-100' : 'bg-navy-100'
                }`}>
                  <Icon size={18} className={tone === 'green' ? 'text-green-700' : tone === 'gold' ? 'text-gold-600' : 'text-navy-800'} />
                </div>
                <p className="text-[12.5px] text-ink-500 mt-3">{label}</p>
                <p className="font-display font-bold text-navy-900 text-[21px] mt-0.5">{value}</p>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-7">
            <Card className="p-6">
              <h2 className="font-display font-semibold text-navy-900 text-[16px] mb-5">Investment Growth</h2>
              {growth.length > 1 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growth} margin={{ left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E7EDF6" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7C8B9B' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#7C8B9B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                      <Line type="monotone" dataKey="value" stroke="#178A4C" strokeWidth={3} dot={{ r: 4, fill: '#178A4C' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 rounded-xl bg-navy-50 ring-1 ring-navy-900/5 flex flex-col items-center justify-center text-center px-6">
                  <span className="w-11 h-11 rounded-full bg-white ring-1 ring-navy-900/10 grid place-items-center text-ink-400">
                    <PieChart size={20} />
                  </span>
                  <p className="text-[14.5px] font-semibold text-navy-900 mt-4">No growth data yet</p>
                  <p className="text-[13px] text-ink-500 mt-1">
                    Your investment growth chart will appear here once your portfolio starts performing.
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-gradient-to-br from-navy-800 to-navy-900 text-white flex flex-col">
              <h2 className="font-display font-semibold text-[16px]">Make a New Investment</h2>
              <p className="text-white/60 text-[13.5px] mt-2 leading-relaxed flex-1">
                Diversify your portfolio further and earn attractive returns with
                our newest investment pools.
              </p>
              <Button as={Link} to="/invest" variant="white" className="mt-5 self-start">
                Explore Plans <ArrowRight size={16} />
              </Button>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
