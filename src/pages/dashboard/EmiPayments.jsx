import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, History, Wallet, X } from 'lucide-react'
import {
  Card, Button, ErrorCard, LoadingRows, EmptyState, StatusPill, Field, inputClass,
} from '../../components/ui'
import { Hero, GlassStat, IconHeading, Notice } from '../../components/dashui'
import { api, errorMessage } from '../../lib/api'
import { useApi } from '../../lib/content'
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
  const [qrOrder, setQrOrder] = useState(null)
  const [utr, setUtr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
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
      setUtr('')
      setCopied(false)
      setQrOrder({ ...order, emi })
    } catch (err) {
      setNotice({ message: errorMessage(err), error: true })
      setPaying(null)
    }
  }

  const closeQr = () => {
    setQrOrder(null)
    setPaying(null)
    setUtr('')
    setCopied(false)
  }

  const copyUpi = async () => {
    if (!qrOrder || !qrOrder.upiId) return
    try {
      await navigator.clipboard.writeText(qrOrder.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard unavailable */ }
  }

  const submitUtr = async () => {
    if (!qrOrder || submitting) return
    const clean = utr.trim()
    if (!/^[A-Za-z0-9]{6,30}$/.test(clean)) {
      setNotice({ message: 'Enter a valid UTR / transaction ID from your payment app (6-30 characters).', error: true })
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/payments/qr-confirm', { paymentId: qrOrder.paymentId, utr: clean })
      const msg = (res && res.message) || `Payment of ${inr(qrOrder.amount)} reported`
      closeQr()
      afterPayment(msg)
    } catch (err) {
      setNotice({ message: errorMessage(err), error: true })
    } finally {
      setSubmitting(false)
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

      {qrOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="UPI QR payment">
          <div
            className="absolute inset-0 bg-navy-900/60 backdrop-blur-[2px]"
            onClick={closeQr}
          />
          <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-navy-900/10">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600">UPI QR payment</p>
                <h3 className="font-display text-lg font-bold text-navy-900 mt-1 truncate">{qrOrder.description}</h3>
              </div>
              <button
                type="button"
                onClick={closeQr}
                aria-label="Close"
                className="shrink-0 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-navy-50 hover:text-navy-900 focus-ring"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-navy-50 px-4 py-3">
              <span className="text-[13px] font-medium text-ink-500">Amount to pay</span>
              <span className="font-display text-xl font-bold tabular-nums text-navy-900">{inr(qrOrder.amount)}</span>
            </div>
            <p className="mt-1.5 text-[12.5px] text-ink-500">
              EMI {inr(qrOrder.emiAmount)}
              {Number(qrOrder.emi && qrOrder.emi.penalty_amount) > 0 ? ` + penalty ${inr(qrOrder.emi.penalty_amount)}` : ''}
              {' — '}pay the exact amount
            </p>

            <div className="mx-auto mt-4 w-fit rounded-2xl border border-navy-900/10 bg-white p-3">
              <img
                src={qrOrder.qrImage || '/loan.qr.jpeg'}
                alt="UPI QR code"
                className="h-52 w-52 object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 ring-1 ring-navy-900/10">
              <div className="min-w-0">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-400">UPI ID</p>
                <p className="truncate font-mono text-[13.5px] font-semibold text-navy-900">{qrOrder.upiId}</p>
              </div>
              <button
                type="button"
                onClick={copyUpi}
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-[12.5px] font-bold text-green-600 transition-colors hover:bg-green-50 hover:text-green-700 focus-ring"
              >
                <Copy size={13} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <ol className="mt-4 list-inside list-decimal space-y-1.5 text-[13px] text-ink-600 marker:font-bold marker:text-green-600">
              <li>Open any UPI app &amp; scan the QR (or use the UPI ID)</li>
              <li>Pay exactly <span className="font-semibold text-navy-900">{inr(qrOrder.amount)}</span></li>
              <li>Copy the UTR / transaction ID from your payment app</li>
            </ol>

            <div className="mt-4">
              <Field label="UTR / Transaction ID" hint="Found in your UPI app after payment">
                <input
                  className={inputClass('w-full')}
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g. 402915876321"
                  maxLength={30}
                  autoComplete="off"
                />
              </Field>
            </div>

            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={closeQr} disabled={submitting}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={submitUtr} disabled={submitting || !utr.trim()}>
                {submitting ? 'Submitting...' : 'I have paid'}
              </Button>
            </div>
            <p className="mt-3 text-center text-[12px] text-ink-400">
              The instalment is marked paid after our team verifies your payment.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
