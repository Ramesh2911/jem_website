import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, FileCheck2, Users, ArrowRight, Star } from 'lucide-react'
import { Button, Card, SectionHeading, Badge } from '../components/ui'
import { loanProducts } from '../lib/loans'

const trust = [
  { icon: ShieldCheck, label: 'Low Interest Rates' },
  { icon: Zap, label: 'Fast Approval' },
  { icon: FileCheck2, label: 'Minimal Documentation' },
  { icon: Users, label: 'Trusted & Secure' },
]

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '₹500Cr+', label: 'Loans Disbursed' },
  { value: '95%', label: 'Approval Rate' },
  { value: '5+', label: 'Years of Trust' },
]

const why = [
  { title: '100% Transparent Process', desc: 'No hidden charges, no fine print surprises \u2014 every fee is disclosed upfront.' },
  { title: 'Quick Disbursal', desc: 'Approved funds reach your account in as little as 24 to 48 hours.' },
  { title: 'Expert Support', desc: 'A dedicated relationship manager guides you from application to closure.' },
  { title: 'Trusted by Thousands', desc: 'Over ten thousand families and businesses have grown with JEM Finance.' },
]

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy-50">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
          <div>
            <Badge>Loans &middot; Investments &middot; Financial Growth</Badge>
            <h1 className="font-display font-bold text-[40px] sm:text-[52px] leading-[1.08] tracking-tight text-navy-900 mt-5">
              Finance Today,<br />A Better Tomorrow
            </h1>
            <p className="mt-5 text-[17px] text-ink-600 leading-relaxed max-w-md">
              Quick apply, easy process, trusted by thousands of families and businesses
              across India to fund what matters most.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button as={Link} to="/register" size="lg">
                Apply for Loan <ArrowRight size={18} />
              </Button>
              <Button as={Link} to="/loans" variant="outline" size="lg">
                Explore Loans
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-12 pt-8 border-t border-navy-900/8">
              {trust.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col gap-2">
                  <Icon size={20} className="text-green-600" />
                  <span className="text-[13px] font-medium text-ink-600 leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-navy-800 to-navy-900 overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 opacity-[0.15]" style={{
                backgroundImage: 'radial-gradient(circle at 30% 20%, white 1px, transparent 1px)',
                backgroundSize: '22px 22px'
              }} />
              <div className="absolute bottom-0 inset-x-0 p-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 ring-1 ring-white/15">
                  <div className="flex items-center gap-1 text-gold-400 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-white text-[14px] leading-relaxed">
                    "JEM Finance helped us close our home loan in under two weeks &mdash; no surprises, just clarity."
                  </p>
                  <p className="text-white/50 text-[12.5px] mt-3">Rahul &amp; Priya Sen, Kolkata</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 ring-1 ring-navy-900/8 hidden sm:block">
              <p className="text-[12px] text-ink-400 font-medium">Build Your Dream</p>
              <p className="font-display font-bold text-navy-900 text-[15px]">With JEM</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-y border-navy-900/6">
        <div className="container-page grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-bold text-[30px] text-navy-900">{s.value}</p>
              <p className="text-[13.5px] text-ink-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Loan Products"
            title="Choose the right loan for your needs"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {loanProducts.map(({ slug, icon: Icon, name, tagline, color }) => (
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
        </div>
      </section>

      <section className="py-20 bg-navy-50">
        <div className="container-page grid lg:grid-cols-2 gap-14 items-center">
          <div className="grid grid-cols-2 gap-5">
            {why.map((w) => (
              <div key={w.title} className="bg-white rounded-2xl p-5 ring-1 ring-navy-900/6">
                <h4 className="font-display font-semibold text-navy-900 text-[14.5px] leading-snug">{w.title}</h4>
                <p className="text-[13px] text-ink-500 mt-2 leading-relaxed">{w.desc}</p>
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
