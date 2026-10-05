import { useMemo, useState } from 'react'
import { HandCoins, TrendingUp, Wallet } from 'lucide-react'
import {
  Card, Button, Field, PageHeader, ErrorCard, LoadingRows, EmptyState, StatusPill, inputClass,
} from '../../components/ui'
import { api, errorMessage } from '../../lib/api'
import { useApi } from '../../lib/content'
import { formatCurrency, formatAmount } from '../../lib/loans'

const inr = (v) => formatCurrency(Number(v) || 0)

const fmtDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const EMPTY = []

export default function Investments() {
  const dashboard = useApi('/investors/dashboard')
  const plans = useApi('/investors/plans')
  const earnings = useApi('/investors/earnings')

  const [slug, setSlug] = useState('')
  const [amount, setAmount] = useState('')
  const [state, setState] = useState({ message: '', error: false })
  const [pending, setPending] = useState(false)

  const d = dashboard.data || {}
  const planList = (plans.data && Array.isArray(plans.data) && plans.data) || EMPTY
  const investments = (Array.isArray(d.investments) && d.investments) || EMPTY
  const earningList = (earnings.data && Array.isArray(earnings.data) && earnings.data) || EMPTY
  const plan = useMemo(() => planList.find((p) => p.slug === slug) || null, [planList, slug])

  const invest = async (e) => {
    e.preventDefault()
    setState({ message: '', error: false })
    if (!plan) {
      setState({ message: 'Choose an investment plan', error: true })
      return
    }
    const value = Number(amount)
    if (!value || value < Number(plan.min_amount) || value > Number(plan.max_amount)) {
      setState({
        message: `Amount must be between ${formatAmount(plan.min_amount)} and ${formatAmount(plan.max_amount)}`,
        error: true,
      })
      return
    }
    setPending(true)
    try {
      const res = await api.post('/investors/invest', { planSlug: plan.slug, amount: value })
      setState({ message: (res && res.message) || 'Investment successful', error: false })
      setAmount('')
      dashboard.refetch()
      earnings.refetch()
    } catch (err) {
      setState({ message: errorMessage(err), error: true })
    } finally {
      setPending(false)
    }
  }

  const stats = [
    { icon: Wallet, label: 'Available Balance', value: inr(d.availableBalance), tone: 'gold' },
    { icon: TrendingUp, label: 'Total Earnings', value: inr(d.totalEarnings), tone: 'green' },
    { icon: HandCoins, label: 'Active Investments', value: String(d.activeInvestments || 0), tone: 'navy' },
  ]

  return (
    <>
      <PageHeader title="Investments" subtitle="Invest your wallet balance and track your portfolio." />

      {dashboard.loading && !dashboard.data && <LoadingRows rows={3} />}
      {dashboard.error && !dashboard.data && <ErrorCard error={dashboard.error} onRetry={dashboard.refetch} />}

      {dashboard.data && (
        <>
          <div className="grid sm:grid-cols-3 gap-5 mt-6">
            {stats.map(({ icon: Icon, label, value, tone }) => (
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

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 mt-6 items-start">
        <Card className="p-6 min-w-0">
              <h2 className="font-display font-semibold text-navy-900 text-[16px] mb-4">My Investments</h2>
              {investments.length ? (
                <div className="overflow-x-auto -mx-1">
                  <table className="w-full text-[13.5px] min-w-[680px]">
                    <thead>
                      <tr className="text-left text-ink-500 border-b border-navy-900/10">
                        <th className="py-2.5 pr-3 font-semibold">Investment</th>
                        <th className="py-2.5 pr-3 font-semibold">Plan</th>
                        <th className="py-2.5 pr-3 font-semibold">Amount</th>
                        <th className="py-2.5 pr-3 font-semibold">Expected return</th>
                        <th className="py-2.5 pr-3 font-semibold">Maturity</th>
                        <th className="py-2.5 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-900/8">
                      {investments.map((inv) => (
                        <tr key={inv.id}>
                          <td className="py-3 pr-3 text-navy-900 font-medium">{inv.investment_number}</td>
                          <td className="py-3 pr-3 text-ink-600">{inv.plan_name || '-'}</td>
                          <td className="py-3 pr-3 text-navy-900">{inr(inv.investment_amount)}</td>
                          <td className="py-3 pr-3 text-green-700 font-medium">{inr(inv.expected_return)}</td>
                          <td className="py-3 pr-3 text-ink-600">{fmtDate(inv.maturity_date)}</td>
                          <td className="py-3"><StatusPill status={inv.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No investments yet" hint="Pick a plan on the right to get started." />
              )}
            </Card>

            <Card className="p-6 min-w-0 lg:sticky lg:top-24">
              <h2 className="font-display font-semibold text-navy-900 text-[16px] mb-4">Invest Now</h2>
              <form onSubmit={invest} className="space-y-4">
                <Field label="Plan">
                  <select className={inputClass()} value={slug} onChange={(e) => setSlug(e.target.value)} required>
                    <option value="">Select plan</option>
                    {planList.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name} - {Number(p.return_rate)}% for {p.duration_months} mo
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Amount (₹)"
                  hint={plan ? `${formatAmount(plan.min_amount)} - ${formatAmount(plan.max_amount)}` : 'Select a plan to see limits'}
                >
                  <input
                    className={inputClass()}
                    type="number"
                    min={plan ? plan.min_amount : 0}
                    max={plan ? plan.max_amount : undefined}
                    placeholder="e.g. 50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </Field>

                {plan && Number(amount) > 0 && (
                  <div className="rounded-xl bg-navy-50 ring-1 ring-navy-900/5 p-4 text-[13.5px] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-ink-500">Available balance</span>
                      <span className="font-semibold text-navy-900">{inr(d.availableBalance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-500">Expected return</span>
                      <span className="font-semibold text-green-700">
                        {inr(
                          Math.round(
                            (Number(amount) * Number(plan.return_rate) * Number(plan.duration_months)) / 1200
                          )
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-500">Maturity</span>
                      <span className="font-semibold text-navy-900">
                        {fmtDate(
                          (() => {
                            const dt = new Date()
                            dt.setMonth(dt.getMonth() + Number(plan.duration_months))
                            return dt
                          })()
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={pending || !planList.length}>
                  {pending ? 'Investing...' : 'Invest Now'}
                </Button>
                {state.message && (
                  <p className={`text-[13.5px] font-semibold ${state.error ? 'text-red-600' : 'text-green-700'}`}>
                    {state.message}
                  </p>
                )}
                <p className="text-[12.5px] text-ink-400">
                  Invested amount is debited from your wallet balance.
                </p>
              </form>
            </Card>
          </div>

          <Card className="p-6 mt-6">
            <h2 className="font-display font-semibold text-navy-900 text-[16px] mb-4">Recent Earnings</h2>
            {earnings.loading && !earningList.length && <LoadingRows rows={2} />}
            {earningList.length ? (
              <div className="divide-y divide-navy-900/8">
                {earningList.slice(0, 10).map((e, i) => (
                  <div key={e.id || i} className="flex items-center justify-between py-3 text-[13.5px]">
                    <div>
                      <p className="text-navy-900 font-medium capitalize">{String(e.earning_type || 'earning').replace(/_/g, ' ')}</p>
                      <p className="text-ink-500">{fmtDate(e.earning_date || e.created_at)}</p>
                    </div>
                    <span className="font-semibold text-green-700">+{inr(e.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              !earnings.loading && <EmptyState title="No earnings yet" hint="Earnings appear here as your investments generate returns." />
            )}
          </Card>
        </>
      )}
    </>
  )
}
