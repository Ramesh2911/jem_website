import { Target, Eye, Heart, Play } from 'lucide-react'
import { SectionHeading, Card } from '../components/ui'

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '₹500Cr+', label: 'Loans Disbursed' },
  { value: '95%', label: 'Approval Rate' },
  { value: '5+', label: 'Years of Trust' },
]

const pillars = [
  { icon: Target, title: 'Our Mission', desc: 'Make credit and investment access simple, fast and fair for every Indian household and business.' },
  { icon: Eye, title: 'Our Vision', desc: 'To become the most trusted financial partner for a billion aspirations, one milestone at a time.' },
  { icon: Heart, title: 'Our Values', desc: 'Transparency, integrity and genuine care guide every rate we quote and every decision we make.' },
]

export default function About() {
  return (
    <div>
      <section className="bg-navy-900 py-16 lg:py-20">
        <div className="container-page">
          <p className="text-green-400 font-semibold text-[14px] mb-3">About Us</p>
          <h1 className="font-display font-bold text-white text-[36px] sm:text-[44px] leading-tight max-w-2xl">
            Building a better financial future for everyone
          </h1>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container-page grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <h2 className="font-display font-bold text-navy-900 text-[26px]">Our Story</h2>
            <p className="mt-4 text-[15.5px] text-ink-600 leading-relaxed">
              JEM Finance Private Limited was founded with one conviction: that credit and
              investment opportunity should not depend on who you know or how much paperwork
              you can survive. We began as a small home-loan desk in Kolkata and have since
              grown into a full-spectrum lending and investment platform trusted across the
              country.
            </p>
            <p className="mt-4 text-[15.5px] text-ink-600 leading-relaxed">
              We believe in providing simple, transparent and reliable financial solutions,
              helping individuals and businesses achieve their dreams through accessible
              credit and investment opportunities \u2014 without the jargon or the wait.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-8 border-t border-navy-900/8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display font-bold text-[26px] text-navy-900">{s.value}</p>
                  <p className="text-[13px] text-ink-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-6 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-navy-900 text-[16px]">{title}</h3>
                  <p className="text-[13.5px] text-ink-500 mt-1.5 leading-relaxed">{desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="container-page">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy-800 to-navy-900 aspect-[21/9] flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 70% 30%, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <Play size={22} className="text-white fill-white ml-1" />
              </div>
              <p className="font-display font-semibold text-white text-[22px] sm:text-[28px]">
                "Together for a Stronger Tomorrow"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
