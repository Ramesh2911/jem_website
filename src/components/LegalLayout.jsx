export default function LegalLayout({ title, updated, sections }) {
  return (
    <div>
      <section className="bg-navy-900 py-14">
        <div className="container-page">
          <h1 className="font-display font-bold text-white text-[32px] sm:text-[38px]">{title}</h1>
          <p className="text-white/50 mt-2 text-[13.5px]">Last Updated: {updated}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page grid lg:grid-cols-[240px_1fr] gap-12">
          <nav className="hidden lg:block sticky top-24 self-start">
            <ul className="space-y-1 border-l border-navy-900/10">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#s${i + 1}`}
                    className="block pl-4 -ml-px py-1.5 text-[13.5px] text-ink-500 hover:text-navy-900 border-l-2 border-transparent hover:border-green-600 transition-colors"
                  >
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-2xl space-y-10">
            {sections.map((s, i) => (
              <div key={s.heading} id={`s${i + 1}`} className="scroll-mt-24">
                <h2 className="font-display font-semibold text-navy-900 text-[19px]">{i + 1}. {s.heading}</h2>
                <p className="mt-3 text-[14.5px] text-ink-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
