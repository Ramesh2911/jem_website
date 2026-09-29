import LegalLayout from '../components/LegalLayout'
import { useSiteContent } from '../lib/content'
import { errorMessage } from '../lib/api'

const today = () =>
  new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })

export default function Terms() {
  const { content, loading, error, refetch } = useSiteContent()
  const block = (content && content.terms_conditions) || null
  const sections = Array.isArray(block) ? block.filter(Boolean) : []
  const updated = (block && block.updated) || today()

  if (!content && (loading || error)) {
    return (
      <section className="bg-navy-900 py-24">
        <div className="container-page text-center">
          <p className="text-white/60 text-[15.5px]">
            {loading ? 'Loading content...' : errorMessage(error)}
          </p>
          {!loading && (
            <button
              type="button"
              onClick={refetch}
              className="mt-5 px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[14.5px] font-semibold transition-colors focus-ring"
            >
              Retry
            </button>
          )}
        </div>
      </section>
    )
  }

  return <LegalLayout title="Terms & Conditions" updated={updated} sections={sections} />
}
