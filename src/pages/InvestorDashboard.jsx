import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Landmark, TrendingUp, Wallet, HandCoins, ArrowRight } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { Card, Button } from '../components/ui'

const stats = [
  { icon: Landmark, label: 'Total Investment', value: '₹1,00,000', tone: 'navy' },
  { icon: TrendingUp, label: 'Total Earnings', value: '₹12,500', tone: 'green' },
  { icon: Wallet, label: 'Available Balance', value: '₹5,000', tone: 'gold' },
  { icon: HandCoins, label: 'Active Investments', value: '2', tone: 'navy' },
]

const growth = [
  { month: 'Jan', value: 100000 },
  { month: 'Feb', value: 103200 },
  { month: 'Mar', value: 106800 },
  { month: 'Apr', value: 109500 },
  { month: 'May', value: 111200 },
  { month: 'Jun', value: 112500 },
]

export default function InvestorDashboard() {
  return (
    <DashboardLayout role="investor" name="Priya">
      <h1 className="font-display font-bold text-navy-900 text-[24px]">Welcome, Priya</h1>
      <p className="text-ink-500 text-[14px] mt-1">Here's your investment overview.</p>

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
          <h2 className="font-display font-semibold text-navy-900 text-[16px] mb-5">Investment Growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7EDF6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7C8B9B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#7C8B9B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                <Line type="monotone" dataKey="value" stroke="#178A4C" strokeWidth={3} dot={{ r: 4, fill: '#178A4C' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-navy-800 to-navy-900 text-white flex flex-col">
          <h2 className="font-display font-semibold text-[16px]">Make a New Investment</h2>
          <p className="text-white/60 text-[13.5px] mt-2 leading-relaxed flex-1">
            Diversify your portfolio further and earn attractive returns with
            our newest investment pools.
          </p>
          <Button as={Link} to="/invest" variant="white" className="mt-5 self-start">
            Explore Plans <ArrowRight size={16} />
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  )
}
