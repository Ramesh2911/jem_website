const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '')

const KEYS = {
  access: 'jem_access_token',
  refresh: 'jem_refresh_token',
  user: 'jem_user',
}

const store = {
  get(key) {
    try { return window.localStorage.getItem(key) } catch { return null }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, value) } catch { /* ignore */ }
  },
  del(key) {
    try { window.localStorage.removeItem(key) } catch { /* ignore */ }
  },
}

export function getAccessToken() { return store.get(KEYS.access) }
export function getRefreshToken() { return store.get(KEYS.refresh) }

export function getUser() {
  try { return JSON.parse(store.get(KEYS.user) || 'null') } catch { return null }
}

export function setSession(data) {
  if (!data) return
  if (data.accessToken) store.set(KEYS.access, data.accessToken)
  if (data.refreshToken) store.set(KEYS.refresh, data.refreshToken)
  if (data.user) store.set(KEYS.user, JSON.stringify(data.user))
}

export function setUser(user) {
  if (user) store.set(KEYS.user, JSON.stringify(user))
}

export function clearSession() {
  store.del(KEYS.access)
  store.del(KEYS.refresh)
  store.del(KEYS.user)
}

export function isAuthenticated() {
  return !!getAccessToken()
}

export class ApiError extends Error {
  constructor(message, status = 0, errors = null, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
    this.data = data
  }
}

export function errorMessage(err) {
  if (!err) return 'Something went wrong'
  if (Array.isArray(err.errors) && err.errors.length) {
    return err.errors.map((e) => (e && e.message) || e).join(', ')
  }
  return err.message || 'Something went wrong'
}

function baseUrl() {
  const origin = typeof window !== 'undefined' && window.location ? window.location.origin : 'http://localhost'
  return new URL(API_URL, origin)
}

async function tryRefresh() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false
  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return false
    const json = await res.json()
    if (json && json.success && json.data) {
      setSession({ ...json.data, user: getUser() })
      return true
    }
  } catch { /* network failure */ }
  return false
}

async function request(path, { method = 'GET', body, params, auth = true, retry = true } = {}) {
  const url = new URL(API_URL + path, baseUrl().origin)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
    })
  }

  const headers = { Accept: 'application/json' }
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json'
  const token = getAccessToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Unable to reach the server. Please check your connection.', 0)
  }

  let json = null
  try { json = await res.json() } catch { json = null }

  if (res.status === 401 && auth && retry && getRefreshToken()) {
    const refreshed = await tryRefresh()
    if (refreshed) return request(path, { method, body, params, auth, retry: false })
    clearSession()
  }

  if (!res.ok) {
    const message = (json && json.message) || `Request failed (${res.status})`
    throw new ApiError(message, res.status, json ? json.errors : null, json ? json.data : null)
  }

  return json
}

export const api = {
  request,
  get: (path, params, opts = {}) => request(path, { ...opts, method: 'GET', params }),
  post: (path, body, opts = {}) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts = {}) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts = {}) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts = {}) => request(path, { ...opts, method: 'DELETE' }),
  // multipart upload (FormData) - browser sets the boundary header itself
  upload: (path, formData, opts = {}) => request(path, { ...opts, method: 'POST', body: formData }),
}

export { API_URL }
