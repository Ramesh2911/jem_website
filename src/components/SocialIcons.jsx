export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} fill="currentColor" {...props}>
      <path d="M13.5 21v-8.1h2.72l.4-3.15h-3.12V7.75c0-.91.25-1.53 1.56-1.53h1.66V3.4A22 22 0 0 0 14.2 3.2c-2.4 0-4.05 1.47-4.05 4.16v2.39H7.42v3.15h2.73V21h3.35Z" />
    </svg>
  )
}

export function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} fill="currentColor" {...props}>
      <path d="M18.9 3H21l-6.65 7.6L22.2 21h-6.16l-4.83-6.32L5.66 21H3.53l7.1-8.12L2.9 3h6.32l4.37 5.78L18.9 3Zm-1.08 16.2h1.17L7.86 4.72H6.6L17.82 19.2Z" />
    </svg>
  )
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3.25a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM21 21v-6.98c0-3.74-2-5.48-4.66-5.48-2.15 0-3.11 1.18-3.65 2.01V8.5h-3.38S9.36 8.5 9.36 21h3.38v-6.5c0-.34.02-.68.12-.92.27-.68.9-1.38 1.94-1.38 1.37 0 1.92 1.04 1.92 2.57V21H21Z" />
    </svg>
  )
}
