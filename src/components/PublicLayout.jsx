import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSiteContent } from '../lib/content'

export default function PublicLayout() {
  const { pathname } = useLocation()
  const { content } = useSiteContent()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Dynamic SEO meta from the site_meta content block
  useEffect(() => {
    const meta = content && content.site_meta
    if (!meta) return
    if (meta.title) document.title = meta.title
    if (meta.description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', meta.description)
    }
    if (meta.keywords) {
      let tag = document.querySelector('meta[name="keywords"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'keywords')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', meta.keywords)
    }
  }, [content])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
