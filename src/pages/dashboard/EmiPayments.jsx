import { useState } from 'react'
import { ChevronDown, ChevronUp, History, Wallet } from 'lucide-react'
import {
  Card, Button, ErrorCard, LoadingRows, EmptyState, StatusPill,
} from '../../components/ui'
import { Hero, GlassStat, IconHeading, Notice } from '../../components/dashui'
import { api, errorMessage } from '../../lib/api'
import { useApi } from '../../lib/content'
import { loadRazorpay } from '../../lib/razorpay'
import { formatCurrency } from '../../lib/loans'

const inr = (v) => formatCurrency(Number(v) || 0)

const fmtDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const isPayable = (s) => s === 'pending' || s === 'overdue' || s === 'partial'

export default function EmiPayments() {
  const [tab, setTab] = useState('loans')
  const loans = useApi('/loans/active')
  const history = useApi('/payments/history', null, { enabled: tab === 'history' })

  const [openLoan, setOpenLoan] = useState(null)
  const [schedules, setSchedules] = useState({})
  const [paying, setPaying] = useState(null)
  const [notice, setNotice] = useState({ message: '', error: false })

  const list = (loans.data && Array.isArray(loans.data) && loans.data) || []
  const payments = (history.data && Array.isArray(history.data) && history.data) || []
  const outstanding = list.reduce((sum, l) => sum + (Number(l.outstanding_amount) || 0), 0)
  const overdueCount = list.reduce((sum, l) => sum + (Number(l.overdue_count) || 0), 0)

  const loadSchedule = async (loanId) => {
    if (schedules[loanId]) return schedules[loanId]
    try {
      const res = await api.get(`/loans/${loanId}/emi-schedule`)
      const data = (res && res.data) || {}
      setSchedules((s) => ({ ...s, [loanId]: data }))
      return data
    } catch (err) {
      setNotice({ message: errorMessage(err), error: true })
      return null
    }
  }

  const toggleLoan = (loanId) => {
    if (openLoan === loanId) {
      setOpenLoan(null)
      return
    }
    setOpenLoan(loanId)
    loadSchedule(loanId)
  }

  const refreshAll = () => {
    loans.refetch()
    if (tab === 'history') history.refetch()
    setSchedules({})
    setOpenLoan(null)
  }

  const afterPayment = (message) => {
    setNotice({ message, error: false })
    loans.refetch()
    if (tab === 'history') history.refetch()
    setSchedules((s) => {
      const next = { ...s }
      delete next[openLoan]
      return next
    })
    if (openLoan) loadSchedule(openLoan)
  }

  const pay = async (emi) => {
    setPaying(emi.id)
    setNotice({ message: '', error: false })
    try {
      const amount = Number(emi.emi_amount) + Number(emi.penalty_amount || 0)
      const res = await api.post('/payments/create-order', {
        amount,
        emiScheduleId: emi.id,
        paymentType: isPayable(emi.status) && Number(emi.penalty_amount) > 0 ? 'overdue' : 'emi',
      })
      const order = (res && res.data) || {}

      if (order.mode === 'local') {
        // no Razorpay keys configured - the server accepts a direct verification
        await api.post('/payments/verify', { paymentId: order.paymentId })
        afterPayment(`Payment of ${inr(amount)} recorded successfully`)
        return
      }

      const Razorpay = await loadRazorpay()
      const checkout = new Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'JEM Finance',
        description: order.description || 'EMI payment',
        theme: { color: '#178A4C' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              paymentId: order.paymentId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            })
            afterPayment(`Payment of ${inr(amount)} successful`)
          } catch (err) {
            setNotice({ message: errorMessage(err), error: true })
          } finally {
            setPaying(null)
          }
        },
        modal: {
          ondismiss: () => setPaying(null),
        },
      })
      checkout.on('payment.failed', (resp) => {
        setNotice({
          message: (resp && resp.error && resp.error.description) || 'Payment failed. Please try again.',
          error: true,
        })
        setPaying(null)
      })
      checkout.open()
    } catch (err) {
      setNotice({ message: errorMessage(err), error: true })
      setPaying(null)
    }
  }

  const tabs = [
    { id: 'loans', label: 'My Loans' },
    { id: 'history', label: 'Payment History' },
  ]

  return (
    <>
      <Hero
        eyebrow="Repayments"
        title="EMI & Payments"
        subtitle="View your loans, repayment schedule and pay your EMI online."
        chips={[
          { icon: Wallet, label: `${list.length} active loan${list.length === 1 ? '' : 's'}` },
          outstanding > 0 ? { label: `Outstanding ${inr(outstanding)}` } : null,
          overdueCount > 0 ? { label: `${overdueCount} overdue` } : null,
        ]}
        action={
          list.length ? (
            <Button variant="outlineWhite" size="sm" onClick={refreshAll}>Refresh</Button>
          ) : null
        }
        right={
          list.length ? (
            <GlassStat label="Total outstanding" value={inr(outstanding)} hint="across all active loans" />
          ) : null
        }
      />

      <div className="flex gap-1.5 mt-6 rounded-2xl bg-navy-50 p-1.5 ring-1 ring-navy-900/5 overflow-x-auto w-fit max-w-full">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setNotice({ message: '', error: false }) }}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-[13.5px] font-bold whitespace-nowrap transition-all focus-ring ${
              tab === id
                ? 'bg-white text-navy-900 shadow-[0_2px_10px_-3px_rgba(11,31,58,0.22)] ring-1 ring-navy-900/5'
                : 'text-ink-500 hover:text-navy-900 hover:bg-white/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Notice state={notice} />

      {tab === 'loans' && (
        <div className="mt-6 space-y-4">
          {loans.loading && !list.length && <LoadingRows rows={3} />}
          {loans.error && !list.length && <ErrorCard error={loans.error} onRetry={loans.refetch} />}
          {!loans.loading && !loans.error && !list.length && (
            <EmptyState title="No loans yet" hint="Once your loan is disbursed it will appear here." />
          )}

          {list.map((loan) => {
            const open = openLoan === loan.id
            const schedule = schedules[loan.id]
            const rows = (schedule && schedule.schedule) || []
            return (
              <Card key={loan.id} className="overflow-hidden">
                <button
                  onClick={() => toggleLoan(loan.id)}
                  className="w-full flex flex-wrap items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-navy-50/70 focus-ring"
                >
                  <span className="w-10 h-10 rounded-xl bg-green-50 text-green-600 ring-1 ring-green-600/10 grid place-items-center shrink-0">
                    <Wallet size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-navy-900 truncate">
                      {loan.loan_number} - {loan.product_name || 'Loan'}
                    </p>
                    <p className="text-[12.5px] text-ink-500">
                      EMI {inr(loan.emi_amount)}
                      {loan.next_due && loan.next_due.due_date ? ` - Next due ${fmtDate(loan.next_due.due_date)}` : ''}
                      {Number(loan.overdue_count) > 0 ? ` - ${loan.overdue_count} overdue` : ''}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right shrink-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Outstanding</p>
                    <p className="font-display font-bold text-navy-900 text-[15px] tabular-nums mt-0.5">
                      {inr(loan.outstanding_amount)}
                    </p>
                  </div>
                  <StatusPill status={loan.status} />
                  {open ? <ChevronUp size={17} className="text-ink-400" /> : <ChevronDown size={17} className="text-ink-400" />}
                </button>

                {open && (
                  <div className="border-t border-navy-900/10 px-5 py-4">
                    {(!schedule || !schedule.schedule) && <LoadingRows rows={3} />}
                    {schedule && rows.length === 0 && (
                      <p className="text-[13.5px] text-ink-500">No repayment schedule found.</p>
                    )}
                    {rows.length > 0 && (
                      <div className="overflow-x-auto -mx-1">
                        <table className="w-full text-[13.5px] min-w-[620px]">
                          <thead>
                            <tr className="text-left bg-navy-50/80 text-ink-600">
                              <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider rounded-l-lg">#</th>
                              <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider">Due date</th>
                              <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider">EMI</th>
                              <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider">Penalty</th>
                              <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider">Status</th>
                              <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider text-right rounded-r-lg">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-navy-900/8">
                            {rows.map((row) => (
                              <tr key={row.id} className="transition-colors hover:bg-navy-50/60">
                                <td className="py-3 px-3 text-ink-600">{row.installment_number}</td>
                                <td className="py-3 px-3 text-navy-900">{fmtDate(row.due_date)}</td>
                                <td className="py-3 px-3 text-navy-900 font-medium">{inr(row.emi_amount)}</td>
                                <td className="py-3 px-3 text-red-600">{Number(row.penalty_amount) > 0 ? inr(row.penalty_amount) : '-'}</td>
                                <td className="py-3 px-3"><StatusPill status={row.status} /></td>
                                <td className="py-3 px-3 text-right">
                                  {isPayable(row.status) ? (
                                    <Button
                                      size="sm"
                                      onClick={() => pay(row)}
                                      disabled={paying === row.id}
                                    >
                                      {paying === row.id ? 'Processing...' : 'Pay Now'}
                                    </Button>
                                  ) : (
                                    <span className="text-ink-400">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'history' && (
        <Card className="p-6 mt-6">
          <IconHeading
            icon={History}
            title="Payment history"
            hint={`${payments.length} transaction${payments.length === 1 ? '' : 's'} recorded`}
          />
          {history.loading && !payments.length && <LoadingRows rows={4} />}
          {history.error && !payments.length && <ErrorCard error={history.error} onRetry={history.refetch} />}
          {!history.loading && !history.error && !payments.length && (
            <EmptyState title="No payments yet" hint="Your EMI payment history will show up here." />
          )}
          {payments.length > 0 && (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-[13.5px] min-w-[680px]">
                <thead>
                  <tr className="text-left bg-navy-50/80 text-ink-600">
                    <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider rounded-l-lg">Date</th>
                    <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider">Transaction ID</th>
                    <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider">Loan</th>
                    <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider">Type</th>
                    <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider">Amount</th>
                    <th className="py-2.5 px-3 font-bold text-[12px] uppercase tracking-wider rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-900/8">
                  {payments.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-navy-50/60">
                      <td className="py-3 px-3 text-navy-900">{fmtDate(p.paid_at || p.created_at)}</td>
                      <td className="py-3 px-3 text-ink-600">{p.transaction_id}</td>
                      <td className="py-3 px-3 text-ink-600">{p.loan_number || '-'}</td>
                      <td className="py-3 px-3 text-ink-600 capitalize">{String(p.payment_type || '').replace(/_/g, ' ')}</td>
                      <td className="py-3 px-3 text-navy-900 font-medium">{inr(p.amount)}</td>
                      <td className="py-3 px-3"><StatusPill status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </>
  )
}
