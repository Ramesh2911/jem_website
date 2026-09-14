export function Button({ as: As = 'button', className = '', variant = 'primary', size = 'md', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus-ring disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 shadow-[0_8px_20px_-8px_rgba(23,138,76,0.55)] hover:-translate-y-0.5',
    outline: 'border border-navy-900/15 text-navy-900 hover:bg-navy-50',
    ghost: 'text-navy-900 hover:bg-navy-50',
    white: 'bg-white text-navy-900 hover:bg-navy-50',
    outlineWhite: 'border border-white/30 text-white hover:bg-white/10',
  }
  const sizes = {
    sm: 'text-sm px-3.5 py-2',
    md: 'text-[15px] px-5 py-2.5',
    lg: 'text-base px-7 py-3.5',
  }
  return (
    <As className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </As>
  )
}

export function Card({ className = '', children, hover = false }) {
  return (
    <div
      className={`bg-white rounded-2xl ring-1 ring-navy-900/8 ${
        hover ? 'transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-green-600/25' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, center = false, dark = false }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className={`text-[14px] font-semibold mb-3 ${dark ? 'text-green-400' : 'text-green-600'}`}>{eyebrow}</p>
      )}
      <h2 className={`font-display font-bold text-[32px] sm:text-[38px] leading-[1.15] tracking-tight ${dark ? 'text-white' : 'text-navy-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-[16px] leading-relaxed ${dark ? 'text-white/65' : 'text-ink-600'}`}>{subtitle}</p>
      )}
    </div>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-[13.5px] font-semibold text-navy-900 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[12.5px] text-ink-400 mt-1.5">{hint}</span>}
    </label>
  )
}

export function inputClass(extra = '') {
  return `w-full h-11 px-3.5 rounded-lg border border-navy-900/15 text-[14.5px] text-ink-900 placeholder:text-ink-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/15 outline-none transition-all bg-white ${extra}`
}

export function Badge({ children, tone = 'green' }) {
  const tones = {
    green: 'bg-green-100 text-green-700',
    navy: 'bg-navy-100 text-navy-800',
    gold: 'bg-gold-100 text-gold-600',
  }
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-semibold ${tones[tone]}`}>{children}</span>
}
