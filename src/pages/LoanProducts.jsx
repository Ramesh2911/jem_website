import { Link } from 'react-router-dom'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { Card, Button } from '../components/ui'
import { useApi } from '../lib/content'
import { normalizeProduct } from '../lib/loans'
import { errorMessage } from '../lib/api'

export default function LoanProducts() {
  const { data, loading, error, refetch } = useApi('/loans/products')
  const products = (Array.isArray(data) ? data : []).map(normalizeProduct).filter(Boolean)

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
          {loading && products.length === 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl ring-1 ring-navy-900/8 p-6 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-navy-50 mb-5" />
                  <div className="h-4 w-2/3 bg-navy-50 rounded" />
                  <div className="h-3 w-full bg-navy-50 rounded mt-3" />
                  <div className="h-3 w-1/2 bg-navy-50 rounded mt-3" />
                  <div className="h-3 w-3/5 bg-navy-50 rounded mt-3" />
                </div>
              ))}
            </div>
          )}

          {error && products.length === 0 && (
            <div className="rounded-2xl ring-1 ring-navy-900/10 bg-navy-50 p-8 sm:p-10 text-center">
              <p className="font-display font-semibold text-navy-900 text-[17px]">Unable to load loan products</p>
              <p className="text-[14px] text-ink-500 mt-1.5">{errorMessage(error)}</p>
              <Button className="mt-5" onClick={refetch}>
                <RefreshCw size={16} /> Retry
              </Button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="rounded-2xl ring-1 ring-navy-900/10 bg-navy-50 p-8 sm:p-10 text-center">
              <p className="font-display font-semibold text-navy-900 text-[17px]">No loan products available right now</p>
              <p className="text-[14px] text-ink-500 mt-1.5">Please check back shortly or talk to our experts.</p>
              <Button variant="outline" className="mt-5" onClick={refetch}>
                <RefreshCw size={16} /> Refresh
              </Button>
            </div>
          )}

          {products.length > 0 && (
            <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ${loading ? 'opacity-60 transition-opacity' : ''}`}>
              {products.map(({ slug, icon: Icon, name, tagline, color, rate, amount }) => (
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
          )}

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
