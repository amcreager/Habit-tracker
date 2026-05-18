const CLIENT_ID = '282107699004-c0tj01bup6kfep89al9hhjqf33m3canm.apps.googleusercontent.com'

const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/spreadsheets',
].join(' ')

function getRedirectUri(): string {
  return `${window.location.origin}/auth/callback`
}

function base64URLEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function buildAuthUrl(): Promise<string> {
  const verifierBytes = new Uint8Array(32)
  crypto.getRandomValues(verifierBytes)
  const verifier = base64URLEncode(verifierBytes.buffer as ArrayBuffer)
  const challenge = base64URLEncode(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)),
  )

  sessionStorage.setItem('pkce_verifier', verifier)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: getRedirectUri(),
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

export function getRedirectUriForServer(): string {
  return getRedirectUri()
}
