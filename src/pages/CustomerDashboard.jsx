import { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  HandCoins, Wallet, Landmark, ShieldCheck, ArrowRight, Bell, FileText,
  AlertCircle, RefreshCw, Clock,
} from 'lucide-react'
import { Card, Button } from '../components/ui'
import { isAuthenticated, clearSession, errorMessage, getUser } from '../lib/api'
import { useApi, cachedGet } from '../lib/content'
import { formatCurrency } from '../lib/loans'

const fmtDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const capitalize = (v) => (v ? String(v).charAt(0).toUpperCase() + String(v).slice(1) : '')

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
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

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const session = getUser()
  const { data, loading, error, refetch } = useApi('/customers/dashboard', null, {
    enabled: isAuthenticated(),
  })

  const unauthenticated = !!error && error.status === 401

  useEffect(() => {
    if (cachedGet('/customers/dashboard') !== undefined) refetch()
  }, [])

  useEffect(() => {
    if (unauthenticated) {
      clearSession()
      navigate('/login', { replace: true })
    }
  }, [unauthenticated, navigate])

  if (!isAuthenticated() || unauthenticated) return <Navigate to="/login" replace />

  const d = data || {}
  const stats = d.stats || {}
  const profile = d.profile || {}
  const firstName =
    profile.first_name || (session && session.profile && session.profile.first_name) ||
    (session && session.mobile) || 'there'

  const kyc = (d.kyc && d.kyc.status) || profile.kyc_status || 'pending'

  const cards = [
    { icon: HandCoins, label: 'Active Loans', value: String(num(stats.activeLoans)), tone: 'navy' },
    { icon: Landmark, label: 'Total Outstanding', value: formatCurrency(stats.totalOutstanding), tone: 'green' },
    { icon: Wallet, label: 'Next EMI', value: formatCurrency(stats.nextDueEmi), tone: 'gold' },
    { icon: ShieldCheck, label: 'KYC Status', value: capitalize(kyc) || 'Pending', tone: 'green' },
  ]

  const notifications = Array.isArray(d.notifications) ? d.notifications : []
  const applications = Array.isArray(d.applications) ? d.applications : []

  const activity = notifications.length
    ? notifications.map((n) => ({
        key: `n-${n.id}`,
        text: n.title || n.message || 'Notification',
        date: fmtDate(n.created_at),
        icon: Bell,
      }))
    : applications.map((a) => ({
        key: `a-${a.id}`,
        text: `${a.product_name || 'Loan'} application ${a.status ? a.status.replace(/_/g, ' ') : 'submitted'}`,
        date: fmtDate(a.created_at),
        icon: FileText,
      }))

  return (
    <>
      <h1 className="font-display font-bold text-navy-900 text-[24px]">Welcome, {firstName}</h1>
      <p className="text-ink-500 text-[14px] mt-1">Here's your financial overview.</p>

      {loading && (
        <>
          <Skeleton />
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-7">
            <Card className="p-6">
              <div className="h-4 w-40 rounded bg-navy-100 animate-pulse" />
              <div className="mt-5 space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-9 rounded-lg bg-navy-100 animate-pulse" />
                ))}
              </div>
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
              <h2 className="font-display font-semibold text-navy-900 text-[16px] mb-5">Recent Activities</h2>
              {activity.length ? (
                <div className="space-y-4">
                  {activity.map((a) => (
                    <div key={a.key} className="flex items-center gap-3.5">
                      <span className="w-9 h-9 rounded-full bg-navy-50 flex items-center justify-center shrink-0">
                        <a.icon size={16} className="text-navy-800" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] text-ink-800 truncate">{a.text}</p>
                      </div>
                      {a.date && (
                        <span className="text-[12.5px] text-ink-400 flex items-center gap-1 shrink-0">
                          <Clock size={12} /> {a.date}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-ink-400">No activity yet</p>
              )}
            </Card>

            <Card className="p-6 bg-gradient-to-br from-navy-800 to-navy-900 text-white flex flex-col">
              <h2 className="font-display font-semibold text-[16px]">Grow Your Wealth</h2>
              <p className="text-white/60 text-[13.5px] mt-2 leading-relaxed flex-1">
                Start investing today and watch your money grow with JEM Finance's
                secure investment plans.
              </p>
              <Button as={Link} to="/invest" variant="white" className="mt-5 self-start">
                Start Investing <ArrowRight size={16} />
              </Button>
            </Card>
          </div>
        </>
      )}
    </>
  )
}
