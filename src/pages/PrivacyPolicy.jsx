import LegalLayout from '../components/LegalLayout'

const sections = [
  { heading: 'Introduction', body: 'JEM Finance Private Limited ("JEM Finance", "we", "us") respects your privacy. This policy explains what data we collect, how we use it, and the choices you have.' },
  { heading: 'Information We Collect', body: 'We collect personal details you provide during application (name, contact information, income, identification documents) and usage data such as device information and site interactions.' },
  { heading: 'How We Use Your Information', body: 'Your information is used to assess loan or investment eligibility, process applications, communicate updates, and comply with regulatory requirements.' },
  { heading: 'Data Security', body: 'We employ bank-grade encryption, access controls and regular audits to protect your information from unauthorized access, alteration or disclosure.' },
  { heading: 'Investment Terms', body: 'For investors, additional disclosures on fund allocation, risk and returns are provided separately in your investment agreement.' },
  { heading: 'Limitation of Liability', body: 'While we take every reasonable precaution, JEM Finance is not liable for damages arising from circumstances beyond our reasonable control.' },
  { heading: 'Contact Us', body: 'For questions about this policy or your data, reach us at support@jemfinance.com or write to our Kolkata office.' },
]

export default function PrivacyPolicy() {
  return <LegalLayout title="Privacy Policy" updated="01 January 2026" sections={sections} />
}
