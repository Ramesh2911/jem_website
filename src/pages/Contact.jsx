import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react'
import { Field, inputClass, Button, Card } from '../components/ui'
import { FacebookIcon, TwitterIcon, InstagramIcon } from '../components/SocialIcons'

export default function Contact() {
  const [sent, setSent] = useState(false)

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
            <InfoRow icon={MapPin} title="Our Office" text="121 Finance Street, Kolkata, West Bengal, India" />
            <InfoRow icon={Phone} title="Call Us" text="+91 98765 43210" />
            <InfoRow icon={Mail} title="Email Us" text="support@jemfinance.com" />
            <InfoRow icon={Clock} title="Working Hours" text="Mon \u2013 Sat, 9:00 AM to 6:00 PM" />
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
              <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="grid sm:grid-cols-2 gap-5">
                <Field label="Your Name">
                  <input required type="text" placeholder="Your Name" className={inputClass()} />
                </Field>
                <Field label="Your Email">
                  <input required type="email" placeholder="Your Email" className={inputClass()} />
                </Field>
                <Field label="Your Mobile Number">
                  <input required type="tel" placeholder="Your Mobile Number" className={inputClass()} />
                </Field>
                <Field label="Subject">
                  <input required type="text" placeholder="Subject" className={inputClass()} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Your Message">
                    <textarea required rows={5} placeholder="Your Message" className={inputClass('h-auto py-2.5 resize-none')} />
                  </Field>
                </div>
                <Button type="submit" className="sm:col-span-2">Send Message</Button>
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
