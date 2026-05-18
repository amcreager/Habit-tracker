const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI as string

const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/spreadsheets',
].join(' ')

function base64URLEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function buildAuthUrl(): Promise<string> {
  const verifier = base64URLEncode(crypto.getRandomValues(new Uint8Array(32)).buffer as ArrayBuffer)
  const challenge = base64URLEncode(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)),
  )

  sessionStorage.setItem('pkce_verifier', verifier)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export function getCodeVerifier(): string | null {
  return sessionStorage.getItem('pkce_verifier')
}

export function clearCodeVerifier(): void {
  sessionStorage.removeItem('pkce_verifier')
}
