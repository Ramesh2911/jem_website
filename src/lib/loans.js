import { Home, User, Briefcase, Car, Bike, Smartphone, Battery, Wallet } from 'lucide-react'

export const loanProducts = [
  {
    slug: 'home-loan',
    icon: Home,
    color: '#178A4C',
    name: 'Home Loan',
    tagline: 'Build your dream home',
    rate: '8.35% p.a. onwards',
    amount: 'Up to ₹5 Crore',
    tenure: 'Up to 30 years',
    description:
      'Turn your dream home into reality with flexible tenures, competitive interest rates and minimal paperwork. Purchase, construct or renovate with a partner who moves at your pace.',
    features: ['Purchase a new home', 'Construct a house', 'Home renovation', 'Balance transfer', 'Extend your existing home'],
  },
  {
    slug: 'personal-loan',
    icon: User,
    color: '#1A4E86',
    name: 'Personal Loan',
    tagline: 'For your personal needs',
    rate: '10.5% p.a. onwards',
    amount: 'Up to ₹25 Lakh',
    tenure: 'Up to 5 years',
    description:
      'Cover a wedding, medical emergency, travel or education with a collateral-free personal loan disbursed as fast as 24 hours.',
    features: ['No collateral required', 'Fast 24-hour disbursal', 'Flexible repayment', 'Medical & wedding cover', 'Debt consolidation'],
  },
  {
    slug: 'business-loan',
    icon: Briefcase,
    color: '#C88A2A',
    name: 'Business Loan',
    tagline: 'Grow your business',
    rate: '11.25% p.a. onwards',
    amount: 'Up to ₹1 Crore',
    tenure: 'Up to 7 years',
    description:
      'Fund working capital, inventory or expansion with financing built around your business cash flow, not rigid bank cycles.',
    features: ['Working capital', 'Equipment financing', 'Inventory funding', 'Business expansion', 'Overdraft facility'],
  },
  {
    slug: 'car-loan',
    icon: Car,
    color: '#0B1F3A',
    name: 'Car Loan',
    tagline: 'Drive your dream car',
    rate: '9.1% p.a. onwards',
    amount: 'Up to 100% on-road',
    tenure: 'Up to 7 years',
    description:
      'Finance a new or pre-owned car with up to 100% on-road funding and same-day approval at your preferred dealership.',
    features: ['New & used cars', '100% on-road funding', 'Same-day approval', 'Doorstep documentation', 'Low EMI plans'],
  },
  {
    slug: 'bike-loan',
    icon: Bike,
    color: '#22A85B',
    name: 'Bike Loan',
    tagline: 'Ride your freedom',
    rate: '9.8% p.a. onwards',
    amount: 'Up to ₹3 Lakh',
    tenure: 'Up to 4 years',
    description:
      'Get on the road faster with a quick-approval two-wheeler loan covering scooters, motorcycles and electric bikes.',
    features: ['Scooters & motorcycles', 'Electric bikes covered', 'Minimal documentation', 'Instant approval', 'Zero prepayment fee'],
  },
  {
    slug: 'mobile-loan',
    icon: Smartphone,
    color: '#1A4E86',
    name: 'Mobile Loan',
    tagline: 'Get latest smartphones',
    rate: '0% - 14% p.a.',
    amount: 'Up to ₹2 Lakh',
    tenure: 'Up to 24 months',
    description:
      'Upgrade to the latest smartphone today and pay in easy monthly instalments, with no-cost EMI options on select devices.',
    features: ['No-cost EMI options', 'Instant checkout approval', 'All major brands', 'Minimal documentation', 'Quick disbursal'],
  },
  {
    slug: 'ev-battery-loan',
    icon: Battery,
    color: '#178A4C',
    name: 'EV Battery Loan',
    tagline: 'Power a greener tomorrow',
    rate: '8.9% p.a. onwards',
    amount: 'Up to ₹1.5 Lakh',
    tenure: 'Up to 3 years',
    description:
      'Finance EV battery purchase or replacement and keep your electric vehicle running further, for less.',
    features: ['New battery purchase', 'Battery replacement', 'Charging setup financing', 'Green energy discount', 'Fast approval'],
  },
  {
    slug: 'private-loan',
    icon: Wallet,
    color: '#C88A2A',
    name: 'Private Loan',
    tagline: 'Flexible finance options',
    rate: 'Custom pricing',
    amount: 'Up to ₹50 Lakh',
    tenure: 'Custom tenure',
    description:
      'A tailored lending arrangement for unique situations that don\u2019t fit a standard product \u2014 structured around your specific needs.',
    features: ['Custom loan structuring', 'Negotiable terms', 'Dedicated relationship manager', 'Confidential processing', 'Flexible collateral'],
  },
]

export function getLoanBySlug(slug) {
  return loanProducts.find((l) => l.slug === slug)
}
