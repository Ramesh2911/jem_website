import { Link } from 'react-router-dom'
import { HandCoins, Wallet, Landmark, ShieldCheck, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { Card, Button } from '../components/ui'

const stats = [
  { icon: HandCoins, label: 'Active Loans', value: '2', tone: 'navy' },
  { icon: Landmark, label: 'Total Investment', value: '₹50,000', tone: 'green' },
  { icon: Wallet, label: 'EMI Due', value: '₹8,682', tone: 'gold' },
  { icon: ShieldCheck, label: 'KYC Status', value: 'Verified', tone: 'green' },
]

const activity = [
  { text: 'Home Loan application submitted', date: '12 Jan 2026', icon: HandCoins },
  { text: 'EMI payment successful', date: '10 Jan 2026', icon: CheckCircle2 },
  { text: 'KYC verified', date: '08 Jan 2026', icon: ShieldCheck },
  { text: 'Investment of ₹50,000 completed', date: '02 Jan 2026', icon: Landmark },
]

export default function CustomerDashboard() {
  return (
    <DashboardLayout role="customer" name="Rahul">
      <h1 className="font-display font-bold text-navy-900 text-[24px]">Welcome, Rahul</h1>
      <p className="text-ink-500 text-[14px] mt-1">Here's your financial overview.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">
        {stats.map(({ icon: Icon, label, value, tone }) => (
          <Card key={label} className="p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              tone === 'green' ? 'bg-green-100' : tone === 'gold' ? 'bg-gold-100' : 'bg-navy-100'
            }`}>
              <Icon size={18} className={tone === 'green' ? 'text-green-700' : tone === 'gold' ? 'text-gold-600' : 'text-navy-800'} />
            </div>
            <p className="text-[12.5px] text-ink-500 mt-3">{label}</p>
            <p className="font-display font-bold text-navy-900 text-[21px] mt-0.5">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-7">
        <Card className="p-6">
          <h2 className="font-display font-semibold text-navy-900 text-[16px] mb-5">Recent Activities</h2>
          <div className="space-y-4">
            {activity.map((a) => (
              <div key={a.text} className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-full bg-navy-50 flex items-center justify-center shrink-0">
                  <a.icon size={16} className="text-navy-800" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-ink-800 truncate">{a.text}</p>
                </div>
                <span className="text-[12.5px] text-ink-400 flex items-center gap-1 shrink-0">
                  <Clock size={12} /> {a.date}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-navy-800 to-navy-900 text-white flex flex-col">
          <h2 className="font-display font-semibold text-[16px]">Grow Your Wealth</h2>
          <p className="text-white/60 text-[13.5px] mt-2 leading-relaxed flex-1">
            Start investing today and watch your money grow with JEM Finance's
            secure investment plans.
          </p>
          <Button as={Link} to="/invest" variant="white" className="mt-5 self-start">
            Start Investing <ArrowRight size={16} />
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  )
}
