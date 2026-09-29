import {
  ArrowLeftRight, Bike, Briefcase, BriefcaseBusiness, Building, Calculator,
  CalendarRange, Car, CirclePlus, FilePlus, GraduationCap, HardHat, Headphones,
  HeartPulse, Home, Landmark, RefreshCw, Shield, Smartphone, Store, Timer,
  User, Wallet, Zap, HelpCircle,
} from 'lucide-react'
import { api } from './api'

// ---------------------------------------------------------------------------
// Icon name (as stored in loan_products.icon) -> lucide component
// ---------------------------------------------------------------------------
const ICONS = {
  'arrow-left-right': ArrowLeftRight,
  bike: Bike,
  briefcase: Briefcase,
  'briefcase-business': BriefcaseBusiness,
  building: Building,
  calculator: Calculator,
  'calendar-range': CalendarRange,
  car: Car,
  'circle-plus': CirclePlus,
  'file-plus': FilePlus,
  'graduation-cap': GraduationCap,
  'hard-hat': HardHat,
  headphones: Headphones,
  'heart-pulse': HeartPulse,
  home: Home,
  landmark: Landmark,
  'refresh-cw': RefreshCw,
  shield: Shield,
  smartphone: Smartphone,
  store: Store,
  timer: Timer,
  user: User,
  wallet: Wallet,
  zap: Zap,
}

export function iconFor(name, Fallback = HelpCircle) {
  return ICONS[name] || Fallback
}

// ---------------------------------------------------------------------------
// Formatting helpers (Indian numbering)
// ---------------------------------------------------------------------------
export function formatAmount(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return '0'
  if (n >= 1e7) return `${trimNum(n / 1e7)} Crore`
  if (n >= 1e5) return `${trimNum(n / 1e5)} Lakh`
  return n.toLocaleString('en-IN')
}

function trimNum(v) {
  return String(Math.round(v * 100) / 100)
}

export function formatCurrency(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '₹0'
  return `₹${n.toLocaleString('en-IN')}`
}

export function formatTenure(months) {
  const m = Number(months)
  if (!Number.isFinite(m) || m <= 0) return ''
  if (m >= 12 && m % 12 === 0) {
    const y = m / 12
    return `${y} year${y > 1 ? 's' : ''}`
  }
  return `${m} months`
}

const EMPLOYMENT_LABELS = {
  salaried: 'Salaried',
  self_employed: 'Self-Employed',
  business: 'Business Owner',
}

export function employmentLabel(type) {
  return EMPLOYMENT_LABELS[type] || String(type || '').replace(/_/g, ' ')
}

// ---------------------------------------------------------------------------
// API row -> UI product shape
// ---------------------------------------------------------------------------
export function normalizeProduct(p) {
  if (!p) return null

  const eligibilityPoints = []
  if (p.min_age && p.max_age) eligibilityPoints.push(`Age between ${p.min_age} and ${p.max_age} years`)
  if (p.min_income) eligibilityPoints.push(`Minimum monthly income of ${formatCurrency(p.min_income)}`)
  if (p.min_credit_score) eligibilityPoints.push(`CIBIL score of ${p.min_credit_score} or above`)
  if (Array.isArray(p.employment_types) && p.employment_types.length) {
    eligibilityPoints.push(`Employment type: ${p.employment_types.map(employmentLabel).join(', ')}`)
  }

  return {
    ...p,
    icon: iconFor(p.icon),
    iconName: p.icon,
    color: p.color || '#178A4C',
    rate: p.interest_rate ? `${p.interest_rate}% p.a. onwards` : 'Competitive rates',
    amount: p.max_amount ? `Up to ₹${formatAmount(p.max_amount)}` : 'Flexible amounts',
    minAmount: p.min_amount ? `From ₹${formatAmount(p.min_amount)}` : '',
    tenure: p.max_tenure ? `Up to ${formatTenure(p.max_tenure)}` : '',
    processingFee: p.processing_fee !== undefined && p.processing_fee !== null
      ? `${p.processing_fee}% of loan amount` : '',
    rateSlabs: (p.rate_slabs || []).map((s) => ({
      tier: s.label,
      condition: s.condition,
      rate: `${s.rate}% p.a.`,
      rateValue: s.rate,
    })),
    documents: p.required_documents || [],
    faqs: p.faqs || [],
    features: p.features || [],
    eligibilityText: p.eligibility || '',
    eligibilityPoints,
    tenureOptions: (p.tenure_options || []).map((m) => ({ value: Number(m), label: formatTenure(m) })),
    employmentTypes: (p.employment_types || []).map((t) => ({ value: t, label: employmentLabel(t) })),
  }
}

// ---------------------------------------------------------------------------
// Public loan endpoints
// ---------------------------------------------------------------------------
export async function fetchLoanProducts(params = {}) {
  const res = await api.get('/loans/products', params)
  return ((res && res.data) || []).map(normalizeProduct)
}

export async function fetchLoanProduct(slug) {
  const res = await api.get(`/loans/products/${encodeURIComponent(slug)}`)
  return normalizeProduct(res && res.data)
}

export async function fetchLoanCategories() {
  const res = await api.get('/loans/products/categories')
  return (res && res.data) || []
}

// POST /loans/eligibility -> { eligible, checks, reasons, limits, quote, summary }
export async function checkEligibility(payload) {
  const res = await api.post('/loans/eligibility', payload)
  return (res && res.data) || null
}

// GET /loans/emi-calculator?amount=&rate=&tenure= -> { emi, totalPayable, totalInterest, ... }
export async function calculateEMI({ amount, rate, tenure }) {
  const res = await api.get('/loans/emi-calculator', { amount, rate, tenure })
  return (res && res.data) || null
}
