import { Link } from 'react-router-dom'
import { ShieldCheck, TrendingUp, Lock, LineChart } from 'lucide-react'
import { Button, SectionHeading, Card } from '../components/ui'
import { useSiteContent, useApi } from '../lib/content'
import { formatCurrency } from '../lib/loans'
import { errorMessage } from '../lib/api'

const POINT_ICONS = [TrendingUp, ShieldCheck, Lock, LineChart]

export default function Investor() {
  const { content, loading, error, refetch } = useSiteContent()
  const {
    data: plans,
    loading: plansLoading,
    error: plansError,
    refetch: refetchPlans,
  } = useApi('/investors/plans')

  const invest = (content && content.invest_page) || {}
  const points = Array.isArray(invest.points) ? invest.points.filter(Boolean) : []
  const rows = Array.isArray(plans) ? plans.filter(Boolean) : []
  const rates = rows
    .map((p) => Number(p.return_rate))
    .filter((n) => Number.isFinite(n) && n > 0)
  const topRate = rates.length ? Math.max(...rates) : null
  const minInvestment = Number(invest.minInvestment) > 0 ? Number(invest.minInvestment) : 10000
  const maxReturnRate = Number(invest.maxReturnRate) > 0 ? Number(invest.maxReturnRate) : (topRate || 14)
  const growthRate = topRate || 12
  const startAmount = 100000
  const grownAmount = Math.round(startAmount * Math.pow(1 + growthRate / 100, 3))

  if (!content && (loading || error)) {
    return (
      <section className="bg-navy-900 py-24">
        <div className="container-page text-center">
          <p className="text-white/60 text-[15.5px]">
            {loading ? 'Loading content...' : errorMessage(error)}
          </p>
          {!loading && (
            <button
              type="button"
              onClick={refetch}
              className="mt-5 px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[14.5px] font-semibold transition-colors focus-ring"
            >
              Retry
            </button>
          )}
        </div>
      </section>
    )
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-navy-800 to-navy-900 py-16 lg:py-24 overflow-hidden">
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-green-600/15 blur-3xl" />
        <div className="container-page relative max-w-2xl">
          {invest.eyebrow && (
            <p className="text-green-400 font-semibold text-[14px] mb-3">{invest.eyebrow}</p>
          )}
          <h1 className="font-display font-bold text-white text-[36px] sm:text-[46px] leading-tight">
            {invest.title}
          </h1>
          <p className="text-white/60 mt-4 text-[16px] leading-relaxed">
            {invest.subtitle}
          </p>
          <Button as={Link} to="/register" size="lg" className="mt-8">Start Investing</Button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Why Invest with JEM Finance?" title="A disciplined way to grow your capital" center />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {points.map((p, i) => {
              const Icon = POINT_ICONS[i % POINT_ICONS.length]
              return (
                <Card key={p.title || i} hover className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-green-600" />
                  </div>
                  <h3 className="font-display font-semibold text-navy-900 text-[15.5px]">{p.title}</h3>
                  <p className="text-[13.5px] text-ink-500 mt-2 leading-relaxed">{p.body}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy-50">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl bg-white ring-1 ring-navy-900/8 p-8">
            <p className="text-[13.5px] text-ink-500">Illustrative Growth</p>
            <p className="font-display font-bold text-navy-900 text-[26px] mt-1">
              {formatCurrency(startAmount)} grows to {formatCurrency(grownAmount)}
            </p>
            <p className="text-[13px] text-ink-400 mt-1">Over 3 years at an average {growthRate}% p.a. return</p>
            <div className="mt-6 h-2 rounded-full bg-navy-100 overflow-hidden">
              <div className="h-full w-[71%] rounded-full bg-gradient-to-r from-green-500 to-green-600" />
            </div>
            <div className="flex justify-between text-[12.5px] text-ink-400 mt-2">
              <span>Year 1</span><span>Year 2</span><span>Year 3</span>
            </div>
          </div>
          <div>
            <SectionHeading
              title={`Start with as little as ${formatCurrency(minInvestment)}`}
              subtitle={`Choose a lock-in period that suits your goals, monitor performance in real time, and earn up to ${maxReturnRate}% p.a. on your balance.`}
            />
            <Button as={Link} to="/contact" variant="outline" className="mt-6">Speak to an Investment Advisor</Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Investment Plans"
            title="Choose a plan that matches your goals"
            subtitle={`Start with ${formatCurrency(minInvestment)} and earn up to ${maxReturnRate}% p.a.`}
            center
          />
          {plansLoading ? (
            <p className="text-center text-[14.5px] text-ink-500 mt-12">Loading investment plans...</p>
          ) : plansError ? (
            <div className="text-center mt-12">
              <p className="text-[14.5px] text-red-500">{errorMessage(plansError)}</p>
              <Button variant="outline" className="mt-4" onClick={refetchPlans}>
                Retry
              </Button>
            </div>
          ) : rows.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
              {rows.map((p) => (
                <Card key={p.id || p.slug} hover className="p-6">
                  <h3 className="font-display font-semibold text-navy-900 text-[16px]">{p.name}</h3>
                  <p className="text-[13.5px] text-ink-500 mt-1.5 leading-relaxed">{p.description}</p>
                  <p className="font-display font-bold text-navy-900 text-[17px] mt-4">
                    {formatCurrency(p.min_amount)} &ndash; {formatCurrency(p.max_amount)}
                  </p>
                  <div className="flex items-center gap-3 mt-2.5 text-[13px] text-ink-500">
                    <span className="font-semibold text-green-700">{p.return_rate ?? '—'}% p.a.</span>
                    <span>{p.duration_months ?? '—'} months</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-[14.5px] text-ink-500 mt-12">No investment plans available right now.</p>
          )}
        </div>
      </section>
    </div>
  )
}
