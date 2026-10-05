import { AlertCircle, Check } from 'lucide-react'

const DOTS = {
  backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
}

export function Hero({ eyebrow, title, subtitle, chips = [], action = null, right = null }) {
  const items = chips.filter(Boolean)
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-[#0b2748] px-6 py-7 sm:px-8 sm:py-8 text-white ring-1 ring-white/10 shadow-[0_30px_60px_-45px_rgba(11,31,58,0.9)]">
      <span
        aria-hidden="true"
        className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-green-500/15 blur-3xl pointer-events-none"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={DOTS}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-400">{eyebrow}</p>
          <h1 className="font-display font-bold text-[23px] sm:text-[26px] tracking-tight mt-0.5">{title}</h1>
          {subtitle && <p className="text-[13.5px] text-white/60 mt-1.5 leading-relaxed max-w-xl">{subtitle}</p>}
          {(items.length > 0 || action) && (
            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              {items.map((c, i) => {
                const Icon = c.icon
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-[12.5px] font-semibold text-white/85"
                  >
                    {Icon ? <Icon size={12.5} className="text-green-400" /> : null}
                    {c.label}
                  </span>
                )
              })}
              {action}
            </div>
          )}
        </div>
        {right}
      </div>
    </div>
  )
}

export function Ring({ pct, label, hint }) {
  const value = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)))
  const r = 24
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-3.5 shrink-0">
      <svg width="58" height="58" viewBox="0 0 58 58" className="shrink-0">
        <circle cx="29" cy="29" r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="5" />
        <circle
          cx="29"
          cy="29"
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          transform="rotate(-90 29 29)"
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
        <text x="29" y="30" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize="13" fontWeight="700">
          {value}%
        </text>
      </svg>
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-white">{label}</p>
        {hint && <p className="text-[12px] text-white/55 leading-snug">{hint}</p>}
      </div>
    </div>
  )
}

export function GlassStat({ label, value, hint }) {
  return (
    <div className="shrink-0 rounded-2xl bg-white/10 ring-1 ring-white/15 px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-400">{label}</p>
      <p className="font-display font-bold text-[24px] text-white mt-1 leading-tight">{value}</p>
      {hint && <p className="text-[12px] text-white/55 mt-1">{hint}</p>}
    </div>
  )
}

export function IconHeading({ icon: Icon, title, hint, right = null }) {
  return (
    <div className="flex items-center gap-3 mb-5 flex-wrap">
      <span className="w-9 h-9 shrink-0 rounded-xl bg-green-50 text-green-600 grid place-items-center ring-1 ring-green-600/10">
        <Icon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-display font-bold text-navy-900 text-[15px] leading-tight">{title}</h3>
        {hint && <p className="text-[12.5px] text-ink-400 leading-tight mt-0.5">{hint}</p>}
      </div>
      {right}
    </div>
  )
}

const tileTones = {
  green: 'bg-green-50 text-green-600 ring-green-600/10',
  gold: 'bg-gold-100 text-gold-600 ring-gold-600/15',
  red: 'bg-red-50 text-red-500 ring-red-500/10',
  navy: 'bg-navy-100 text-navy-800 ring-navy-900/10',
}

export function StatTile({ icon: Icon, label, value, tone = 'green' }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl bg-white ring-1 ring-navy-900/8 px-4 py-3.5">
      <span className={`w-10 h-10 shrink-0 rounded-xl grid place-items-center ring-1 ${tileTones[tone] || tileTones.green}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="font-display font-bold text-navy-900 text-[19px] leading-tight tabular-nums">{value}</p>
        <p className="text-[12.5px] text-ink-500 leading-tight mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export function Notice({ state }) {
  if (!state || !state.message) return null
  const bad = Boolean(state.error)
  return (
    <div
      className={`mt-5 flex items-start gap-2.5 rounded-xl px-4 py-3 ring-1 ${
        bad ? 'bg-red-50 ring-red-500/15' : 'bg-green-50 ring-green-600/15'
      }`}
    >
      <span className={`mt-0.5 shrink-0 ${bad ? 'text-red-500' : 'text-green-600'}`}>
        {bad ? <AlertCircle size={16} /> : <Check size={16} />}
      </span>
      <p className={`text-[13.5px] font-semibold ${bad ? 'text-red-600' : 'text-green-700'}`}>{state.message}</p>
    </div>
  )
}
