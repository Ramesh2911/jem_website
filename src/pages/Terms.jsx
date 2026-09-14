import LegalLayout from '../components/LegalLayout'

const sections = [
  { heading: 'Acceptance of Terms', body: 'By accessing or using JEM Finance\u2019s website and services, you agree to be bound by these Terms & Conditions and all applicable laws.' },
  { heading: 'Use of Services', body: 'Our loan and investment services are available to eligible individuals and businesses who meet our verification and underwriting criteria.' },
  { heading: 'Eligibility', body: 'Applicants must be at least 21 years old, a resident of India, and provide accurate documentation. JEM Finance reserves the right to decline any application.' },
  { heading: 'Data Security', body: 'JEM Finance implements industry-standard security measures to protect user data submitted during the application and account management process.' },
  { heading: 'Investment Terms', body: 'Investment returns are indicative and subject to market and credit risk. Past performance does not guarantee future returns.' },
  { heading: 'Limitation of Liability', body: 'JEM Finance shall not be liable for any indirect, incidental or consequential damages arising from use of our services.' },
  { heading: 'Contact Us', body: 'Questions about these Terms can be directed to support@jemfinance.com.' },
]

export default function Terms() {
  return <LegalLayout title="Terms & Conditions" updated="01 January 2026" sections={sections} />
}
