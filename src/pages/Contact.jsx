import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Field, inputClass, Button, Card } from '../components/ui'
import { FacebookIcon, TwitterIcon, InstagramIcon } from '../components/SocialIcons'
import { useSettings } from '../lib/content'
import { api, errorMessage } from '../lib/api'

export default function Contact() {
  const { settings, loading, error, refetch } = useSettings()
  const flat = (settings && settings.flat) || {}

  const [form, setForm] = useState({ name: '', email: '', mobile: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState('')

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const submit = async (e) => {
    e.preventDefault()
    if (sending) return
    if (form.mobile.length !== 10) {
      setFormError('Enter a valid 10-digit mobile number')
      return
    }
    setSending(true)
    setFormError('')
    try {
      await api.post('/site/contact', {
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        subject: form.subject,
        message: form.message,
      })
      setSent(true)
    } catch (err) {
      setFormError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <section className="bg-navy-900 py-16">
        <div className="container-page">
          <h1 className="font-display font-bold text-white text-[36px] sm:text-[42px]">Get in Touch</h1>
          <p className="text-white/60 mt-3 text-[15.5px]">We're here to help.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page grid lg:grid-cols-[1fr_1.3fr] gap-10">
          <div className="space-y-5">
            {!settings && loading && (
              <p className="text-[14.5px] text-ink-500">Loading contact details...</p>
            )}
            {!settings && !loading && error && (
              <div>
                <p className="text-[14.5px] text-red-500">{errorMessage(error)}</p>
                <button
                  type="button"
                  onClick={refetch}
                  className="mt-3 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[13.5px] font-semibold transition-colors focus-ring"
                >
                  Retry
                </button>
              </div>
            )}
            {settings && (
              <>
                <InfoRow icon={MapPin} title="Our Office" text={flat.company_address || '—'} />
                <InfoRow icon={Phone} title="Call Us" text={flat.company_phone || '—'} />
                <InfoRow icon={Mail} title="Email Us" text={flat.company_email || '—'} />
                <InfoRow icon={Clock} title="Working Hours" text={flat.support_hours || '—'} />
              </>
            )}
            <div className="flex gap-3 pt-2">
              {[FacebookIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-navy-50 flex items-center justify-center text-navy-900 hover:bg-green-600 hover:text-white transition-colors focus-ring">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <Card className="p-7 sm:p-8">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <CheckCircle2 size={40} className="text-green-600" />
                <p className="font-display font-semibold text-navy-900 text-[18px] mt-4">Message sent</p>
                <p className="text-[14px] text-ink-500 mt-1.5">We'll get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid sm:grid-cols-2 gap-5">
                <Field label="Your Name">
                  <input
                    required
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => set('name')(e.target.value)}
                    className={inputClass()}
                  />
                </Field>
                <Field label="Your Email">
                  <input
                    required
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) => set('email')(e.target.value)}
                    className={inputClass()}
                  />
                </Field>
                <Field label="Your Mobile Number">
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Your Mobile Number"
                    value={form.mobile}
                    onChange={(e) => set('mobile')(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={inputClass()}
                  />
                </Field>
                <Field label="Subject">
                  <input
                    required
                    type="text"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e) => set('subject')(e.target.value)}
                    className={inputClass()}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Your Message">
                    <textarea
                      required
                      rows={5}
                      placeholder="Your Message"
                      value={form.message}
                      onChange={(e) => set('message')(e.target.value)}
                      className={inputClass('h-auto py-2.5 resize-none')}
                    />
                  </Field>
                </div>
                {formError && (
                  <p className="sm:col-span-2 flex items-center gap-1.5 text-[13px] font-medium text-red-500">
                    <AlertCircle size={14} />
                    {formError}
                  </p>
                )}
                <Button type="submit" disabled={sending} className="sm:col-span-2">
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </div>
  )
}

function InfoRow({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-3.5 items-start">
      <span className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-green-700" />
      </span>
      <div>
        <p className="font-semibold text-navy-900 text-[14.5px]">{title}</p>
        <p className="text-[13.5px] text-ink-500 mt-0.5">{text}</p>
      </div>
    </div>
  )
}
