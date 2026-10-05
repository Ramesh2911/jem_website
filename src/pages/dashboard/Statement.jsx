import {
  Card, PageHeader, ErrorCard, LoadingRows, EmptyState, StatusPill,
} from '../../components/ui'
import { useApi } from '../../lib/content'
import { formatCurrency } from '../../lib/loans'

const inr = (v) => formatCurrency(Number(v) || 0)

const fmtDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Section({ title, count, children }) {
  return (
    <Card className="p-6 mt-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="font-display font-semibold text-navy-900 text-[16px]">{title}</h2>
        <span className="text-[13px] text-ink-500">{count} record{count === 1 ? '' : 's'}</span>
      </div>
      {children}
    </Card>
  )
}

export default function Statement() {
  const { data, loading, error, refetch } = useApi('/investors/statement')

  if (loading && !data) {
    return (
      <>
        <PageHeader title="Transaction History" subtitle="Complete record of your investments, withdrawals and payments." />
        <LoadingRows rows={5} />
      </>
    )
  }

  if (error && !data) {
    return (
      <>
        <PageHeader title="Transaction History" subtitle="Complete record of your investments, withdrawals and payments." />
        <ErrorCard error={error} onRetry={refetch} />
      </>
    )
  }

  const d = data || {}
  const investments = (Array.isArray(d.investments) && d.investments) || []
  const withdrawalList = (Array.isArray(d.withdrawals) && d.withdrawals) || []
  const payments = (Array.isArray(d.payments) && d.payments) || []

  const cards = [
    { label: 'Total Investment', value: inr(d.totalInvestment) },
    { label: 'Total Earnings', value: inr(d.totalEarnings) },
    { label: 'Available Balance', value: inr(d.availableBalance) },
  ]

  return (
    <>
      <PageHeader title="Transaction History" subtitle="Complete record of your investments, withdrawals and payments." />

      <div className="grid sm:grid-cols-3 gap-5 mt-6">
        {cards.map(({ label, value }) => (
          <Card key={label} className="p-5">
            <p className="text-[12.5px] text-ink-500">{label}</p>
            <p className="font-display font-bold text-navy-900 text-[21px] mt-0.5">{value}</p>
          </Card>
        ))}
      </div>

      <Section title="Investments" count={investments.length}>
        {investments.length ? (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-[13.5px] min-w-[640px]">
              <thead>
                <tr className="text-left text-ink-500 border-b border-navy-900/10">
                  <th className="py-2.5 pr-3 font-semibold">Date</th>
                  <th className="py-2.5 pr-3 font-semibold">Reference</th>
                  <th className="py-2.5 pr-3 font-semibold">Plan</th>
                  <th className="py-2.5 pr-3 font-semibold">Amount</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/8">
                {investments.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-3 pr-3 text-ink-600">{fmtDate(inv.start_date || inv.created_at)}</td>
                    <td className="py-3 pr-3 text-navy-900 font-medium">{inv.investment_number}</td>
                    <td className="py-3 pr-3 text-ink-600">{inv.plan_name || '-'}</td>
                    <td className="py-3 pr-3 text-navy-900">{inr(inv.investment_amount)}</td>
                    <td className="py-3"><StatusPill status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No investments yet" />
        )}
      </Section>

      <Section title="Withdrawals" count={withdrawalList.length}>
        {withdrawalList.length ? (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-[13.5px] min-w-[640px]">
              <thead>
                <tr className="text-left text-ink-500 border-b border-navy-900/10">
                  <th className="py-2.5 pr-3 font-semibold">Date</th>
                  <th className="py-2.5 pr-3 font-semibold">Reference</th>
                  <th className="py-2.5 pr-3 font-semibold">Bank</th>
                  <th className="py-2.5 pr-3 font-semibold">Amount</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/8">
                {withdrawalList.map((w) => (
                  <tr key={w.id}>
                    <td className="py-3 pr-3 text-ink-600">{fmtDate(w.created_at)}</td>
                    <td className="py-3 pr-3 text-navy-900 font-medium">{w.withdrawal_number}</td>
                    <td className="py-3 pr-3 text-ink-600">{w.bank_name || '-'}</td>
                    <td className="py-3 pr-3 text-navy-900">{inr(w.amount)}</td>
                    <td className="py-3"><StatusPill status={w.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No withdrawals yet" />
        )}
      </Section>

      <Section title="Payments" count={payments.length}>
        {payments.length ? (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-[13.5px] min-w-[640px]">
              <thead>
                <tr className="text-left text-ink-500 border-b border-navy-900/10">
                  <th className="py-2.5 pr-3 font-semibold">Date</th>
                  <th className="py-2.5 pr-3 font-semibold">Transaction ID</th>
                  <th className="py-2.5 pr-3 font-semibold">Type</th>
                  <th className="py-2.5 pr-3 font-semibold">Amount</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/8">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-3 text-ink-600">{fmtDate(p.paid_at || p.created_at)}</td>
                    <td className="py-3 pr-3 text-navy-900 font-medium">{p.transaction_id}</td>
                    <td className="py-3 pr-3 text-ink-600 capitalize">{String(p.payment_type || '').replace(/_/g, ' ')}</td>
                    <td className="py-3 pr-3 text-navy-900">{inr(p.amount)}</td>
                    <td className="py-3"><StatusPill status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No payments yet" />
        )}
      </Section>
    </>
  )
}
