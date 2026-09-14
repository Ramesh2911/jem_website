import { Link } from 'react-router-dom'
import { ShieldCheck, TrendingUp, Lock, LineChart } from 'lucide-react'
import { Button, SectionHeading, Card } from '../components/ui'

const pillars = [
  { icon: TrendingUp, title: 'Attractive Returns', desc: 'Earn steady returns of up to 14% p.a. by co-funding vetted retail lending pools.' },
  { icon: ShieldCheck, title: 'Low Risk', desc: 'Every borrower is credit-scored and every pool diversified across hundreds of loans.' },
  { icon: Lock, title: 'Transparent Process', desc: 'Track every rupee \u2014 disbursal, repayment and returns \u2014 from your investor dashboard.' },
  { icon: LineChart, title: 'Trusted Platform', desc: 'RBI-compliant, audited quarterly, and built on five years of lending discipline.' },
]

export default function Investor() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-navy-800 to-navy-900 py-16 lg:py-24 overflow-hidden">
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-green-600/15 blur-3xl" />
        <div className="container-page relative max-w-2xl">
          <p className="text-green-400 font-semibold text-[14px] mb-3">Invest with JEM Finance</p>
          <h1 className="font-display font-bold text-white text-[36px] sm:text-[46px] leading-tight">
            Invest for a Brighter Tomorrow
          </h1>
          <p className="text-white/60 mt-4 text-[16px] leading-relaxed">
            Safe, secure and rewarding investment opportunities designed for long-term
            wealth builders who want their money working as hard as they do.
          </p>
          <Button as={Link} to="/register" size="lg" className="mt-8">Start Investing</Button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Why Invest with JEM Finance?" title="A disciplined way to grow your capital" center />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <Card key={title} hover className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-green-600" />
                </div>
                <h3 className="font-display font-semibold text-navy-900 text-[15.5px]">{title}</h3>
                <p className="text-[13.5px] text-ink-500 mt-2 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy-50">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl bg-white ring-1 ring-navy-900/8 p-8">
            <p className="text-[13.5px] text-ink-500">Illustrative Growth</p>
            <p className="font-display font-bold text-navy-900 text-[26px] mt-1">₹1,00,000 grows to ₹1,40,255</p>
            <p className="text-[13px] text-ink-400 mt-1">Over 3 years at an average 12% p.a. return</p>
            <div className="mt-6 h-2 rounded-full bg-navy-100 overflow-hidden">
              <div className="h-full w-[71%] rounded-full bg-gradient-to-r from-green-500 to-green-600" />
            </div>
            <div className="flex justify-between text-[12.5px] text-ink-400 mt-2">
              <span>Year 1</span><span>Year 2</span><span>Year 3</span>
            </div>
          </div>
          <div>
            <SectionHeading title="Start with as little as ₹10,000" subtitle="Choose a lock-in period that suits your goals, monitor performance in real time, and withdraw returns on your schedule." />
            <Button as={Link} to="/contact" variant="outline" className="mt-6">Speak to an Investment Advisor</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
