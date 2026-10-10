import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, FileCheck2, Users, ArrowRight, Star } from 'lucide-react'
import { Button, Card, SectionHeading, Badge } from '../components/ui'
import { useSiteContent, useApi } from '../lib/content'
import { normalizeProduct } from '../lib/loans'
import { errorMessage } from '../lib/api'
import loanImg from '../assets/loan.jpeg'

const TRUST_ICONS = [ShieldCheck, Zap, FileCheck2, Users]

// "₹500Cr+" -> { prefix: '₹', target: 500, suffix: 'Cr+' } (used by the stat count-up)
function parseStat(raw) {
  const m = String(raw || '').match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!m) return null
  return { prefix: m[1], target: Number(m[2]), suffix: m[3], decimals: (m[2].split('.')[1] || '').length }
}

function StatValue({ value, started }) {
  const [text, setText] = useState(value)

  useEffect(() => {
    const p = parseStat(value)
    if (!p || !started) {
      setText(value)
      return undefined
    }
    const reduce = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fmt = (n) => `${p.prefix}${n.toLocaleString('en-IN', { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals })}${p.suffix}`
    if (reduce) {
      setText(fmt(p.target))
      return undefined
    }
    let raf
    const duration = 1800
    const t0 = performance.now()
    const step = (t) => {
      const progress = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setText(fmt(p.target * eased))
      if (progress < 1) raf = requestAnimationFrame(step)
      else setText(fmt(p.target))
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, started])

  return <>{text}</>
}

export default function Home() {
  const { content, loading, error, refetch } = useSiteContent()
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useApi('/loans/products')

  const statsRef = useRef(null)
  const [statsStarted, setStatsStarted] = useState(false)

  useEffect(() => {
    if (statsStarted) return undefined
    const el = statsRef.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      setStatsStarted(true)
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStatsStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [statsStarted])

  const hero = (content && content.hero) || {}
  const trust = ((content && content.trust_badges) || []).filter(Boolean)
  const stats = ((content && content.stats) || []).filter(Boolean)
  const why = ((content && content.why_choose_us) || []).filter(Boolean)
  const testimonials = ((content && content.testimonials) || []).filter(Boolean)
  const testimonial = testimonials[0]
  const rows = Array.isArray(products) ? products : []
  const loans = rows.map(normalizeProduct).filter(Boolean)

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
      <section className="relative overflow-hidden bg-navy-50">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
          <div>
            {hero.eyebrow && <Badge>{hero.eyebrow}</Badge>}
            <h1 className="font-display font-bold text-[40px] sm:text-[52px] leading-[1.08] tracking-tight text-navy-900 mt-5">
              {hero.title}
            </h1>
            <p className="mt-5 text-[17px] text-ink-600 leading-relaxed max-w-md">
              {hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {hero.primaryCta && hero.primaryCta.label && (
                <Button as={Link} to={hero.primaryCta.to || '/'} size="lg">
                  {hero.primaryCta.label} <ArrowRight size={18} />
                </Button>
              )}
              {hero.secondaryCta && hero.secondaryCta.label && (
                <Button as={Link} to={hero.secondaryCta.to || '/'} variant="outline" size="lg">
                  {hero.secondaryCta.label}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-12 pt-8 border-t border-navy-900/8">
              {trust.map((t, i) => {
                const Icon = TRUST_ICONS[i % TRUST_ICONS.length]
                return (
                  <div key={t.title || i} className="flex flex-col gap-2">
                    <Icon size={20} className="text-green-600" />
                    <span className="text-[13px] font-medium text-ink-600 leading-snug">{t.title}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-navy-800 to-navy-900 overflow-hidden relative shadow-2xl">
              <img
                src={loanImg}
                alt="Quick loans from JEM Finance"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/20 to-navy-900/10" />
              {testimonial && (
                <div className="absolute bottom-0 inset-x-0 p-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 ring-1 ring-white/15">
                    <div className="flex items-center gap-1 text-gold-400 mb-2">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <p className="text-white text-[14px] leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <p className="text-white/50 text-[12.5px] mt-3">
                      {[testimonial.name, testimonial.location].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 ring-1 ring-navy-900/8 hidden sm:block">
              <p className="text-[12px] text-ink-400 font-medium">Build Your Dream</p>
              <p className="font-display font-bold text-navy-900 text-[15px]">With JEM</p>
            </div>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section ref={statsRef} className="py-10 bg-white border-y border-navy-900/6">
          <div className="container-page grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {stats.map((s) => (
              <div
                key={s.label || s.value}
                className="text-center rounded-2xl bg-navy-50 ring-1 ring-navy-900/6 px-4 py-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-green-600/25"
              >
                <p className="font-display font-bold text-[30px] sm:text-[32px] text-navy-900 tabular-nums">
                  <StatValue value={s.value} started={statsStarted} />
                </p>
                <span className="mx-auto mt-3 block h-1 w-8 rounded-full bg-green-600/70" />
                <p className="text-[13.5px] text-ink-500 mt-2.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Loan Products"
            title="Choose the right loan for your needs"
            center
          />
          {productsLoading ? (
            <p className="text-center text-[14.5px] text-ink-500 mt-12">Loading loan products...</p>
          ) : productsError ? (
            <div className="text-center mt-12">
              <p className="text-[14.5px] text-red-500">{errorMessage(productsError)}</p>
              <Button variant="outline" className="mt-4" onClick={refetchProducts}>
                Retry
              </Button>
            </div>
          ) : loans.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
              {loans.map(({ slug, icon: Icon, name, tagline, color }) => (
                <Card key={slug} hover className="p-6">
                  <Link to={`/loans/${slug}`} className="block">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${color}1A` }}
                    >
                      <Icon size={22} style={{ color }} />
                    </div>
                    <h3 className="font-display font-semibold text-navy-900 text-[16px]">{name}</h3>
                    <p className="text-[13.5px] text-ink-500 mt-1">{tagline}</p>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-[14.5px] text-ink-500 mt-12">No loan products available right now.</p>
          )}
        </div>
      </section>

      <section className="py-20 bg-navy-50">
        <div className="container-page grid lg:grid-cols-2 gap-14 items-center">
          <div className="grid grid-cols-2 gap-5">
            {why.map((w) => (
              <div key={w.title} className="bg-white rounded-2xl p-5 ring-1 ring-navy-900/6">
                <h4 className="font-display font-semibold text-navy-900 text-[14.5px] leading-snug">{w.title}</h4>
                <p className="text-[13px] text-ink-500 mt-2 leading-relaxed">{w.description}</p>
              </div>
            ))}
          </div>
          <div>
            <SectionHeading
              eyebrow="Why Choose JEM Finance"
              title="A lending partner built around your goals"
              subtitle="From first application to final EMI, we keep the process transparent, the terms fair, and a real person on the other end of the line."
            />
            <Button as={Link} to="/about" variant="outline" className="mt-6">
              Learn Our Story
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-green-600/20 blur-3xl" />
        <div className="container-page relative flex flex-col lg:flex-row items-center justify-between gap-8">
          <SectionHeading
            dark
            title="Ready to take the next step?"
            subtitle="Check your eligibility in under two minutes, with zero impact on your credit score."
          />
          <div className="flex gap-4 shrink-0">
            <Button as={Link} to="/eligibility" size="lg">Check Eligibility</Button>
            <Button as={Link} to="/contact" variant="outlineWhite" size="lg">Talk to an Expert</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
