import { Link } from 'react-router-dom'
import logoImg from '../assets/loan.jpeg'

export default function Logo({ dark = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
      <img
        src={logoImg}
        alt="JEM Finance"
        width="40"
        height="40"
        className="h-10 w-10 rounded-xl object-cover"
      />
      <span className={`font-display font-bold text-lg leading-none tracking-tight ${dark ? 'text-white' : 'text-navy-900'}`}>
        JEM <span className="font-normal opacity-70">Finance</span>
      </span>
    </Link>
  )
}
