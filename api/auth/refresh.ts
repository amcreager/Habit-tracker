import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { refresh_token } = req.body as { refresh_token?: string }

  if (!refresh_token) {
    return res.status(400).json({ error: 'Missing refresh_token' })
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token,
  })

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    // 401 signals expired refresh token (7-day testing mode limit)
    return res.status(401).json({ error: text })
  }

  const data = (await tokenRes.json()) as {
    access_token: string
    expires_in: number
  }

  return res.status(200).json({
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  })
}
