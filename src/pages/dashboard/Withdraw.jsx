import { useEffect, useState } from 'react'
import { Banknote, ArrowUpFromLine } from 'lucide-react'
import {
  Card, Button, Field, PageHeader, ErrorCard, LoadingRows, EmptyState, StatusPill, inputClass,
} from '../../components/ui'
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

export default function Withdraw() {
  const profile = useApi('/investors/profile')
  const withdrawals = useApi('/investors/withdrawals')

  const [form, setForm] = useState({ amount: '', bankName: '', bankAccountNumber: '', bankIFSC: '' })
  const [state, setState] = useState({ message: '', error: false })
  const [pending, setPending] = useState(false)

  const p = profile.data || {}
  const balance = Number(p.available_balance) || 0
  const list = (withdrawals.data && Array.isArray(withdrawals.data) && withdrawals.data) || []

  useEffect(() => {
    if (!profile.data) return
    setForm((s) => ({
      ...s,
      bankName: s.bankName || p.bank_name || '',
      bankAccountNumber: s.bankAccountNumber || p.bank_account_number || '',
      bankIFSC: s.bankIFSC || p.bank_ifsc || '',
    }))
  }, [profile.data, p.bank_name, p.bank_account_number, p.bank_ifsc])

  const submit = async (e) => {
    e.preventDefault()
    setState({ message: '', error: false })
    const value = Number(form.amount)
    if (!value || value <= 0) {
      setState({ message: 'Enter a valid amount', error: true })
      return
    }
    if (value > balance) {
      setState({ message: 'Amount exceeds your available balance', error: true })
      return
    }
    setPending(true)
    try {
      const res = await api.post('/investors/withdraw', {
        amount: value,
        bankName: form.bankName || undefined,
        bankAccountNumber: form.bankAccountNumber || undefined,
        bankIFSC: form.bankIFSC || undefined,
      })
      setState({ message: (res && res.message) || 'Withdrawal request submitted', error: false })
      setForm((s) => ({ ...s, amount: '' }))
      profile.refetch()
      withdrawals.refetch()
    } catch (err) {
      setState({ message: errorMessage(err), error: true })
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <PageHeader title="Withdraw" subtitle="Move your available balance to your bank account." />

      {profile.loading && !profile.data && <LoadingRows rows={3} />}
      {profile.error && !profile.data && <ErrorCard error={profile.error} onRetry={profile.refetch} />}

      {profile.data && (
      <div className="grid lg:grid-cols-[340px_1fr] gap-6 mt-6 items-start">
        <Card className="p-6 min-w-0 lg:sticky lg:top-24">
            <div className="rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 text-white p-5">
              <div className="flex items-center gap-2 text-white/70 text-[13px]">
                <Banknote size={15} /> Available balance
              </div>
              <p className="font-display font-bold text-[26px] mt-1">{inr(balance)}</p>
            </div>

            <form onSubmit={submit} className="space-y-4 mt-5">
              <Field label="Amount (₹)">
                <input
                  className={inputClass()}
                  type="number"
                  min="1"
                  max={balance || undefined}
                  placeholder="e.g. 10000"
                  value={form.amount}
                  onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
                  required
                />
              </Field>
              <Field label="Bank name">
                <input
                  className={inputClass()}
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm((s) => ({ ...s, bankName: e.target.value }))}
                />
              </Field>
              <Field label="Account number">
                <input
                  className={inputClass()}
                  type="text"
                  value={form.bankAccountNumber}
                  onChange={(e) => setForm((s) => ({ ...s, bankAccountNumber: e.target.value }))}
                />
              </Field>
              <Field label="IFSC">
                <input
                  className={inputClass()}
                  type="text"
                  value={form.bankIFSC}
                  onChange={(e) => setForm((s) => ({ ...s, bankIFSC: e.target.value.toUpperCase() }))}
                />
              </Field>
              <Button type="submit" className="w-full" disabled={pending}>
                <ArrowUpFromLine size={16} /> {pending ? 'Submitting...' : 'Request Withdrawal'}
              </Button>
              {state.message && (
                <p className={`text-[13.5px] font-semibold ${state.error ? 'text-red-600' : 'text-green-700'}`}>
                  {state.message}
                </p>
              )}
              <p className="text-[12.5px] text-ink-400">
                Withdrawals are reviewed by our team and usually settled within 1-2 business days.
              </p>
            </form>
          </Card>

          <Card className="p-6 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display font-semibold text-navy-900 text-[16px]">Withdrawal Requests</h2>
              <Button variant="ghost" size="sm" onClick={withdrawals.refetch}>Refresh</Button>
            </div>

            {withdrawals.loading && !list.length && <LoadingRows rows={3} />}
            {withdrawals.error && !list.length && (
              <ErrorCard error={withdrawals.error} onRetry={withdrawals.refetch} />
            )}
            {!withdrawals.loading && !withdrawals.error && !list.length && (
              <div className="mt-4">
                <EmptyState title="No withdrawal requests yet" hint="Your requests and their status will appear here." />
              </div>
            )}

            {list.length > 0 && (
              <div className="overflow-x-auto -mx-1 mt-4">
                <table className="w-full text-[13.5px] min-w-[640px]">
                  <thead>
                    <tr className="text-left text-ink-500 border-b border-navy-900/10">
                      <th className="py-2.5 pr-3 font-semibold">Request</th>
                      <th className="py-2.5 pr-3 font-semibold">Date</th>
                      <th className="py-2.5 pr-3 font-semibold">Bank</th>
                      <th className="py-2.5 pr-3 font-semibold">Amount</th>
                      <th className="py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-900/8">
                    {list.map((w) => (
                      <tr key={w.id}>
                        <td className="py-3 pr-3 text-navy-900 font-medium">{w.withdrawal_number}</td>
                        <td className="py-3 pr-3 text-ink-600">{fmtDate(w.created_at)}</td>
                        <td className="py-3 pr-3 text-ink-600">
                          {w.bank_name || '-'}
                          {w.bank_account_number ? ` - ${String(w.bank_account_number).slice(-4).padStart(String(w.bank_account_number).length, '*')}` : ''}
                        </td>
                        <td className="py-3 pr-3 text-navy-900 font-medium">{inr(w.amount)}</td>
                        <td className="py-3"><StatusPill status={w.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
