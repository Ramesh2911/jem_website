import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import Logo from './Logo'
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from './SocialIcons'
import { useApi, useSettings, useSiteContent } from '../lib/content'

const badgeLabel = (b) => {
  if (!b) return ''
  if (typeof b === 'string') return b
  return b.label || b.text || b.title || b.name || ''
}

export default function Footer() {
  const { settings } = useSettings()
  const flat = (settings && settings.flat) || {}
  const { content } = useSiteContent()
  const badgeSource = (content && content.badges) || []
  const badges = (Array.isArray(badgeSource) ? badgeSource : badgeSource.items || [])
    .map(badgeLabel)
    .filter(Boolean)
  const { data: products } = useApi('/loans/products')
  const productLinks = (Array.isArray(products) ? products : [])
    .filter((p) => p && p.slug && p.name)
    .slice(0, 5)

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-page py-16 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12">
        <div>
          <Logo dark />
          <p className="mt-4 text-[15px] text-white/60 leading-relaxed max-w-xs">
            Simple, transparent and reliable financial solutions &mdash; helping thousands
            build the life they want, one milestone at a time.
          </p>
          <div className="flex gap-3 mt-6">
            {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center hover:bg-green-600 transition-colors focus-ring"
                aria-label="Social link"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-[15px] mb-4">Loan Products</h4>
          <ul className="space-y-2.5 text-[14px] text-white/60">
            {productLinks.map((p) => (
              <li key={p.slug}>
                <Link to={`/loans/${p.slug}`} className="hover:text-green-400 transition-colors">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-[15px] mb-4">Company</h4>
          <ul className="space-y-2.5 text-[14px] text-white/60">
            <li><Link to="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
            <li><Link to="/invest" className="hover:text-green-400 transition-colors">Investors</Link></li>
            <li><Link to="/faq" className="hover:text-green-400 transition-colors">FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-green-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-green-400 transition-colors">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-[15px] mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-[14px] text-white/60">
            {flat.company_address && (
              <li className="flex gap-2.5">
                <MapPin size={17} className="shrink-0 mt-0.5 text-green-400" /> {flat.company_address}
              </li>
            )}
            {flat.company_phone && (
              <li className="flex gap-2.5">
                <Phone size={17} className="shrink-0 mt-0.5 text-green-400" /> {flat.company_phone}
              </li>
            )}
            {flat.company_email && (
              <li className="flex gap-2.5">
                <Mail size={17} className="shrink-0 mt-0.5 text-green-400" /> {flat.company_email}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/45">
          <p>&copy; {new Date().getFullYear()} JEM Finance Private Limited. All rights reserved.</p>
          {badges.length > 0 && <p>{badges.join(' · ')}</p>}
        </div>
      </div>
    </footer>
  )
}
