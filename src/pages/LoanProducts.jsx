import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, Button } from '../components/ui'
import { loanProducts } from '../lib/loans'

export default function LoanProducts() {
  return (
    <div>
      <section className="bg-navy-900 py-16">
        <div className="container-page">
          <h1 className="font-display font-bold text-white text-[36px] sm:text-[42px]">Our Loan Products</h1>
          <p className="text-white/60 mt-3 text-[16px] max-w-lg">Tailored financial solutions for every need.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loanProducts.map(({ slug, icon: Icon, name, tagline, color, rate, amount }) => (
              <Card key={slug} hover className="p-6 flex flex-col">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${color}1A` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-display font-semibold text-navy-900 text-[18px]">{name}</h3>
                <p className="text-[13.5px] text-ink-500 mt-1">{tagline}</p>
                <div className="mt-4 space-y-1.5 text-[13px] text-ink-600">
                  <p><span className="text-ink-400">Rate:</span> {rate}</p>
                  <p><span className="text-ink-400">Amount:</span> {amount}</p>
                </div>
                <Link
                  to={`/loans/${slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-green-600 font-semibold text-[14px] hover:gap-2.5 transition-all"
                >
                  Know More <ArrowRight size={15} />
                </Link>
              </Card>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-navy-900 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-white text-[22px]">Not sure which loan is right for you?</h3>
              <p className="text-white/60 mt-1.5 text-[14.5px]">Our experts are here to help.</p>
            </div>
            <Button as={Link} to="/contact" variant="white" size="lg" className="shrink-0">
              Talk to an Expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
