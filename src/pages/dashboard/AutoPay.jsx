import { useState } from 'react'
import { Info, Plus, ShieldCheck, Wallet, XCircle } from 'lucide-react'
import {
  Card, Button, Field, ErrorCard, LoadingRows, EmptyState, StatusPill, inputClass,
} from '../../components/ui'
import { Hero, Ring, IconHeading, Notice } from '../../components/dashui'
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

export default function AutoPay() {
  const mandates = useApi('/payments/auto-pay/mandates')
  const loans = useApi('/loans/active')

  const [loanId, setLoanId] = useState('')
  const [vpa, setVpa] = useState('')
  const [state, setState] = useState({ message: '', error: false })
  const [pending, setPending] = useState(false)
  const [cancelling, setCancelling] = useState(null)

  const list = (mandates.data && Array.isArray(mandates.data) && mandates.data) || []
  const loanList = (loans.data && Array.isArray(loans.data) && loans.data) || []
  const activeCount = list.filter((m) => m.status === 'active' || m.status === 'pending').length
  const coverage = loanList.length ? Math.min(100, Math.round((activeCount / loanList.length) * 100)) : 0

  const setup = async (e) => {
    e.preventDefault()
    setState({ message: '', error: false })
    if (!loanId) {
      setState({ message: 'Select the loan you want to automate', error: true })
      return
    }
    if (!/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(vpa.trim())) {
      setState({ message: 'Enter a valid UPI ID, e.g. name@upi', error: true })
      return
    }
    setPending(true)
    try {
      const res = await api.post('/payments/auto-pay/setup', {
        loanId: Number(loanId),
        vpa: vpa.trim(),
        mandateType: 'upi',
      })
      setState({
        message: (res && res.message) || 'Auto-pay activated',
        error: false,
      })
      setLoanId('')
      setVpa('')
      mandates.refetch()
    } catch (err) {
      setState({ message: errorMessage(err), error: true })
    } finally {
      setPending(false)
    }
  }

  const cancel = async (m) => {
    if (!window.confirm('Cancel this auto-pay mandate? Your EMIs will need to be paid manually.')) return
    setCancelling(m.id)
    setState({ message: '', error: false })
    try {
      const res = await api.del(`/payments/auto-pay/${m.id}`)
      setState({ message: (res && res.message) || 'Auto-pay cancelled', error: false })
      mandates.refetch()
    } catch (err) {
      setState({ message: errorMessage(err), error: true })
    } finally {
      setCancelling(null)
    }
  }

  return (
    <>
      <Hero
        eyebrow="Auto Pay"
        title="Never miss an EMI"
        subtitle="Automate your EMI payments with a one-time UPI mandate — debits run automatically on every due date."
        chips={[
          { icon: ShieldCheck, label: `${activeCount} active mandate${activeCount === 1 ? '' : 's'}` },
          { icon: Wallet, label: `${loanList.length} active loan${loanList.length === 1 ? '' : 's'}` },
        ]}
        right={
          <Ring
            pct={coverage}
            label="Loans covered"
            hint={loanList.length ? `${activeCount} of ${loanList.length} on auto pay` : 'No active loans'}
          />
        }
      />

      <Notice state={state} />

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 mt-6 items-start">
        <Card className="p-6 min-w-0">
          <IconHeading
            icon={ShieldCheck}
            title="Mandates"
            hint="Your UPI e-mandates for automatic EMI debits"
            right={
              <span className="shrink-0 rounded-full bg-navy-100 text-navy-800 px-3 py-1 text-[12.5px] font-bold tabular-nums">
                {list.length}
              </span>
            }
          />

          {mandates.loading && !list.length && <LoadingRows rows={3} />}
          {mandates.error && !list.length && <ErrorCard error={mandates.error} onRetry={mandates.refetch} />}
          {!mandates.loading && !mandates.error && !list.length && (
            <EmptyState
              title="No auto-pay mandates yet"
              hint="Set up a mandate from the setup panel to automate your EMI payments."
            />
          )}

          {list.length > 0 && (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-[13.5px] min-w-[500px]">
                <thead>
                  <tr className="text-left bg-navy-50/80 text-ink-600">
                    <th className="py-2.5 px-2 font-bold text-[12px] uppercase tracking-wider rounded-l-lg">Mandate</th>
                    <th className="py-2.5 px-2 font-bold text-[12px] uppercase tracking-wider">Loan / UPI</th>
                    <th className="py-2.5 px-2 font-bold text-[12px] uppercase tracking-wider">Max amount</th>
                    <th className="py-2.5 px-2 font-bold text-[12px] uppercase tracking-wider">Status</th>
                    <th className="py-2.5 px-2 font-bold text-[12px] uppercase tracking-wider text-right rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-900/8">
                  {list.map((m) => (
                    <tr key={m.id} className="transition-colors hover:bg-navy-50/60">
                      <td className="py-3 px-2 text-ink-600">
                        <span className="block max-w-[130px] truncate" title={m.mandate_id}>{m.mandate_id}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="block text-navy-900 font-medium">{m.loan_number || '-'}</span>
                        <span className="block text-[12px] text-ink-500">{m.vpa || '-'}</span>
                      </td>
                      <td className="py-3 px-2 text-navy-900 whitespace-nowrap">{inr(m.max_amount)}</td>
                      <td className="py-3 px-2"><StatusPill status={m.status} /></td>
                      <td className="py-3 px-2 text-right">
                        {m.status === 'active' || m.status === 'pending' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancel(m)}
                            disabled={cancelling === m.id}
                          >
                            <XCircle size={15} />
                            {cancelling === m.id ? 'Cancelling...' : 'Cancel'}
                          </Button>
                        ) : (
                          <span className="text-ink-400">{fmtDate(m.cancelled_at) ? 'Cancelled' : '-'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-6 min-w-0 lg:sticky lg:top-24">
          <IconHeading icon={Plus} title="Setup auto pay" hint="Takes under a minute" />
          <form onSubmit={setup} className="space-y-4">
            <Field label="Loan">
              <select className={inputClass()} value={loanId} onChange={(e) => setLoanId(e.target.value)} required>
                <option value="">Select loan</option>
                {loanList.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.loan_number} - EMI {inr(l.emi_amount)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="UPI ID">
              <input
                className={inputClass('font-semibold tracking-wide')}
                type="text"
                placeholder="name@bank"
                value={vpa}
                onChange={(e) => setVpa(e.target.value)}
                required
              />
            </Field>
            <Button type="submit" className="w-full" disabled={pending || !loanList.length}>
              <Plus size={16} /> {pending ? 'Activating...' : 'Activate Auto Pay'}
            </Button>
            {!loanList.length && !loans.loading && (
              <p className="text-[13px] text-ink-500">You need an active loan to set up auto pay.</p>
            )}
            <div className="flex items-start gap-2.5 rounded-xl bg-navy-50 ring-1 ring-navy-900/8 px-3.5 py-3">
              <Info size={15} className="text-ink-400 shrink-0 mt-0.5" />
              <p className="text-[12.5px] text-ink-500 leading-relaxed">
                By activating, you authorise JEM Finance to debit your EMI on every due date via UPI.
                You can cancel anytime from this page.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
