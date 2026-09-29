import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from './api'

// ---------------------------------------------------------------------------
// Site content blocks (hero, stats, faq, testimonials, legal, ...)
// ---------------------------------------------------------------------------
let contentCache = null
let contentPromise = null

export function loadSiteContent(force = false) {
  if (contentCache && !force) return Promise.resolve(contentCache)
  if (!contentPromise || force) {
    contentPromise = api.get('/site/content')
      .then((res) => {
        contentCache = (res && res.data) || {}
        return contentCache
      })
      .catch((err) => {
        contentPromise = null
        throw err
      })
  }
  return contentPromise
}

export function useSiteContent() {
  const [state, setState] = useState(() => ({
    content: contentCache,
    loading: !contentCache,
    error: null,
  }))

  useEffect(() => {
    let alive = true
    loadSiteContent()
      .then((content) => { if (alive) setState({ content, loading: false, error: null }) })
      .catch((error) => { if (alive) setState((s) => ({ ...s, loading: false, error })) })
    return () => { alive = false }
  }, [])

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    loadSiteContent(true)
      .then((content) => setState({ content, loading: false, error: null }))
      .catch((error) => setState((s) => ({ ...s, loading: false, error })))
  }, [])

  return { ...state, refetch }
}

// ---------------------------------------------------------------------------
// Public settings (company address, phone, email, stats group)
// ---------------------------------------------------------------------------
let settingsCache = null
let settingsPromise = null

export function loadSettings(force = false) {
  if (settingsCache && !force) return Promise.resolve(settingsCache)
  if (!settingsPromise || force) {
    settingsPromise = api.get('/site/settings')
      .then((res) => {
        settingsCache = {
          groups: (res && res.data) || {},
          flat: (res && res.flat) || {},
        }
        return settingsCache
      })
      .catch((err) => {
        settingsPromise = null
        throw err
      })
  }
  return settingsPromise
}

export function useSettings() {
  const [state, setState] = useState(() => ({
    settings: settingsCache,
    loading: !settingsCache,
    error: null,
  }))

  useEffect(() => {
    let alive = true
    loadSettings()
      .then((settings) => { if (alive) setState({ settings, loading: false, error: null }) })
      .catch((error) => { if (alive) setState((s) => ({ ...s, loading: false, error })) })
    return () => { alive = false }
  }, [])

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    loadSettings(true)
      .then((settings) => setState({ settings, loading: false, error: null }))
      .catch((error) => setState((s) => ({ ...s, loading: false, error })))
  }, [])

  return { ...state, refetch }
}

// ---------------------------------------------------------------------------
// Generic GET hook with a tiny in-memory cache (safe across route changes)
// ---------------------------------------------------------------------------
const responseCache = new Map()

export function cachedGet(path, params) {
  const key = `${path}?${JSON.stringify(params || {})}`
  return responseCache.get(key)
}

export function useApi(path, params = null, { enabled = true } = {}) {
  const key = path ? `${path}?${JSON.stringify(params || {})}` : null
  const mounted = useRef(true)

  const [state, setState] = useState(() => {
    const cached = key ? responseCache.get(key) : undefined
    return { data: cached === undefined ? null : cached, loading: !!key && enabled && cached === undefined, error: null }
  })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    if (!key || !enabled) return undefined
    const cached = responseCache.get(key)
    if (cached !== undefined && tick === 0) {
      setState({ data: cached, loading: false, error: null })
      return undefined
    }
    setState((s) => ({ ...s, loading: true, error: null }))
    api.get(path, params)
      .then((res) => {
        const data = res && 'data' in res ? res.data : res
        responseCache.set(key, data)
        if (mounted.current) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (mounted.current) setState((s) => ({ data: s.data, loading: false, error }))
      })
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, tick])

  const refetch = useCallback(() => {
    if (key) responseCache.delete(key)
    setTick((t) => t + 1)
  }, [key])

  const clearCache = useCallback(() => { responseCache.clear() }, [])

  return { ...state, refetch, clearCache }
}
