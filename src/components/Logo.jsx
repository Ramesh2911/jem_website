import { Link } from 'react-router-dom'

export default function Logo({ dark = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 2L30 9V25L17 32L4 25V9L17 2Z" fill={dark ? '#ffffff' : '#0B1F3A'} fillOpacity={dark ? '0.08' : '1'} />
        <path d="M17 7L11 20H15.5L14 27L23 15H18L19.5 7H17Z" fill="#22A85B" />
      </svg>
      <span className={`font-display font-bold text-lg leading-none tracking-tight ${dark ? 'text-white' : 'text-navy-900'}`}>
        JEM <span className="font-normal opacity-70">Finance</span>
      </span>
    </Link>
  )
}
