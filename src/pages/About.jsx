import { Target, Eye, Heart, Play } from 'lucide-react'
import { Card } from '../components/ui'
import { useSiteContent } from '../lib/content'
import { errorMessage } from '../lib/api'

export default function About() {
  const { content, loading, error, refetch } = useSiteContent()
  const about = (content && content.about_page) || {}
  const stats = ((content && content.stats) || []).filter(Boolean)
  const values = Array.isArray(about.values) ? about.values.filter(Boolean) : []
  const story = String(about.story || '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  const pillars = [
    { icon: Target, title: 'Our Mission', desc: about.mission },
    {
      icon: Eye,
      title: 'Our Vision',
      desc: about.vision,
    },
    {
      icon: Heart,
      title: 'Our Values',
      desc: values.map((v) => [v.title, v.body].filter(Boolean).join(': ')).join(' '),
    },
  ]

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
      <section className="bg-navy-900 py-16 lg:py-20">
        <div className="container-page">
          {about.eyebrow && (
            <p className="text-green-400 font-semibold text-[14px] mb-3">{about.eyebrow}</p>
          )}
          <h1 className="font-display font-bold text-white text-[36px] sm:text-[44px] leading-tight max-w-2xl">
            {about.title}
          </h1>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container-page grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <h2 className="font-display font-bold text-navy-900 text-[26px]">Our Story</h2>
            {story.map((paragraph, i) => (
              <p key={i} className="mt-4 text-[15.5px] text-ink-600 leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-8 border-t border-navy-900/8">
              {stats.map((s) => (
                <div key={s.label || s.value}>
                  <p className="font-display font-bold text-[26px] text-navy-900">{s.value}</p>
                  <p className="text-[13px] text-ink-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-6 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-navy-900 text-[16px]">{title}</h3>
                  <p className="text-[13.5px] text-ink-500 mt-1.5 leading-relaxed">{desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="container-page">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy-800 to-navy-900 aspect-[21/9] flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 70% 30%, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <Play size={22} className="text-white fill-white ml-1" />
              </div>
              <p className="font-display font-semibold text-white text-[22px] sm:text-[28px]">
                "Together for a Stronger Tomorrow"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
