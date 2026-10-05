import { api } from './api'

const PROVIDER_URLS = [
  'https://verify.msg91.com/otp-provider.js',
  'https://verify.phone91.com/otp-provider.js',
]

let loadPromise = null

function loadProvider() {
  if (typeof window === 'undefined') return Promise.reject(new Error('OTP service is only available in the browser.'))
  if (typeof window.initSendOTP === 'function') return Promise.resolve()
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    let i = 0
    const attempt = () => {
      const s = document.createElement('script')
      s.src = PROVIDER_URLS[i]
      s.async = true
      s.onload = () => {
        if (typeof window.initSendOTP === 'function') resolve()
        else { loadPromise = null; reject(new Error('OTP service failed to initialise. Please try again.')) }
      }
      s.onerror = () => {
        i += 1
        if (i < PROVIDER_URLS.length) attempt()
        else { loadPromise = null; reject(new Error('Could not load the OTP verification service. Please check your connection.')) }
      }
      document.head.appendChild(s)
    }
    attempt()
  })
  return loadPromise
}

let configPromise = null

export function getWidgetConfig() {
  if (!configPromise) {
    configPromise = api
      .get('/auth/msg91/config', undefined, { auth: false })
      .then((res) => res && res.data)
      .catch((err) => {
        configPromise = null
        throw err
      })
  }
  return configPromise
}

const TOKEN_KEYS = [
  'token', 'tokenAuth', 'jwt', 'accessToken', 'access_token', 'access-token', 'jwtToken',
  'widgetToken', 'authToken', 'verificationToken', 'verifiedToken', 'idToken',
  'otpToken', 'verifyToken', 'response',
]

const HIGH_CONFIDENCE_KEYS = new Set([
  'token', 'tokenAuth', 'jwt', 'accessToken', 'access_token', 'access-token',
  'jwtToken', 'otpToken', 'verifyToken', 'idToken', 'widgetToken', 'authToken',
  'verificationToken', 'verifiedToken',
])

function isTokenLike(value) {
  return (
    typeof value === 'string' &&
    value.length >= 40 &&
    /^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)+$/.test(value)
  )
}

function searchObject(node, depth, knownKeyPass) {
  if (!node || depth > 6) return null
  if (typeof node === 'string') {
    return knownKeyPass ? null : isTokenLike(node) ? node : null
  }
  if (typeof node !== 'object') return null
  if (knownKeyPass) {
    for (const key of TOKEN_KEYS) {
      const value = node[key]
      if (typeof value === 'string' && value.length >= 16) {
        if (HIGH_CONFIDENCE_KEYS.has(key) || isTokenLike(value)) return value
      }
      const nested = searchObject(value, depth + 1, true)
      if (nested) return nested
    }
  }
  for (const value of Object.values(node)) {
    const found = searchObject(value, depth + 1, knownKeyPass)
    if (found) return found
  }
  return null
}

function pickToken(data) {
  if (typeof data === 'string') return data.length >= 40 ? data : null
  if (!data || typeof data !== 'object') return null
  return searchObject(data, 0, true) || searchObject(data, 0, false)
}

function failureMessage(error) {
  if (!error) return 'Phone verification failed. Please try again.'
  if (typeof error === 'string') return error
  const msg = error.message || error.errorMessage || error.msg || error.description
  return typeof msg === 'string' && msg ? msg : 'Phone verification failed. Please try again.'
}

/**
 * Opens the MSG91 OTP widget and resolves with the verified access token (JWT).
 * `identifier` prefills the number/email field inside the widget.
 */
export function openOtpWidget({ identifier } = {}) {
  return loadProvider()
    .then(() => getWidgetConfig())
    .then(
      (config) =>
        new Promise((resolve, reject) => {
          if (typeof window.initSendOTP !== 'function') {
            reject(new Error('OTP service is not available. Please try again.'))
            return
          }
          let settled = false
          const configuration = {
            widgetId: config.widgetId,
            tokenAuth: config.tokenAuth,
            identifier: identifier || undefined,
            success: (data) => {
              if (settled) return
              settled = true
              // eslint-disable-next-line no-console
              console.warn('[msg91] success payload:', data)
              const token = pickToken(data)
              if (token) resolve(token)
              else {
                const shape =
                  data && typeof data === 'object'
                    ? Object.keys(data).join(', ')
                    : typeof data
                reject(new Error(`Verification finished but no token was returned (received: ${shape}). Please try again.`))
              }
            },
            failure: (error) => {
              if (settled) return
              settled = true
              reject(new Error(failureMessage(error)))
            },
          }
          try {
            window.initSendOTP(configuration)
          } catch (err) {
            if (!settled) {
              settled = true
              reject(err instanceof Error ? err : new Error('Could not open the OTP window.'))
            }
          }
        })
    )
}
