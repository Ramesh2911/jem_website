// Lazily loads the Razorpay checkout script (only needed for real payments -
// local/dev orders skip the checkout entirely).
let scriptPromise = null

export function loadRazorpay() {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve(window.Razorpay)
  }
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existing) {
        existing.addEventListener('load', () => resolve(window.Razorpay))
        existing.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout')))
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve(window.Razorpay)
      script.onerror = () => {
        scriptPromise = null
        reject(new Error('Unable to load Razorpay checkout'))
      }
      document.body.appendChild(script)
    })
  }
  return scriptPromise
}
