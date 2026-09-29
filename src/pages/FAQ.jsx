import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSiteContent } from '../lib/content'
import { errorMessage } from '../lib/api'

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)
  const { content, loading, error, refetch } = useSiteContent()
  const faqs = ((content && content.faq) || []).filter(Boolean)

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

  return (
    <div>
      <section className="bg-navy-900 py-16">
        <div className="container-page">
          <h1 className="font-display font-bold text-white text-[36px] sm:text-[42px]">Frequently Asked Questions</h1>
          <p className="text-white/60 mt-3 text-[15.5px]">Find answers to the most common questions.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page max-w-2xl">
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className="rounded-xl ring-1 ring-navy-900/8 overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus-ring"
                >
                  <span className="font-medium text-navy-900 text-[15px]">{f.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-ink-400 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-200 ${openIdx === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-[14px] text-ink-500 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
