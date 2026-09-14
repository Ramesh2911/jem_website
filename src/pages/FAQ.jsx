import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'What types of loans does JEM Finance offer?', a: 'We offer home, personal, business, car, bike, mobile, EV battery and custom private loans \u2014 each tailored with flexible tenures and competitive rates.' },
  { q: 'What is the eligibility criteria for a loan?', a: 'Generally, applicants must be 21\u201360 years old, earn a minimum monthly income of ₹25,000, and hold a CIBIL score of 700 or above. Criteria vary slightly by product.' },
  { q: 'How long does the approval process take?', a: 'Most loans are approved within 48\u201372 hours once all documents are submitted, with some products like mobile loans approved instantly.' },
  { q: 'What documents are required?', a: 'Typically PAN and Aadhaar, income proof, bank statements and address proof. Specific documents depend on the loan type \u2014 see the Required Documents tab on any loan page.' },
  { q: 'Can I make prepayments?', a: 'Yes. Most floating-rate loans allow free prepayment after the first 12 EMIs. Fixed-rate loans may carry a small prepayment charge.' },
  { q: 'Is there a prepayment or foreclosure charge?', a: 'Foreclosure charges, if any, are disclosed upfront in your loan agreement and typically range from 0% to 2% of the outstanding principal.' },
  { q: 'How does the investor program work?', a: 'Investors co-fund diversified pools of vetted retail loans and earn returns as borrowers repay. Track everything from your investor dashboard.' },
  { q: 'Is my data and information secure?', a: 'Yes. We are ISO 27001 certified and use bank-grade encryption to protect all personal and financial data you share with us.' },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)

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
