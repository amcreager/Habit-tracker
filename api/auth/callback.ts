import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code, code_verifier, redirect_uri } = req.body as {
    code?: string
    code_verifier?: string
    redirect_uri?: string
  }

  if (!code || !code_verifier || !redirect_uri) {
    return res.status(400).json({ error: 'Missing code, code_verifier, or redirect_uri' })
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const redirectUri = redirect_uri

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    code,
    code_verifier,
  })

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    return res.status(tokenRes.status).json({ error: text })
  }

  const data = (await tokenRes.json()) as {
    access_token: string
    refresh_token: string
    expires_in: number
  }

  return res.status(200).json({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  })
}
