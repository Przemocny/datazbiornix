export function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get('X-API-Key')
  const expectedKey = process.env.ADMIN_API_KEY

  if (!expectedKey) {
    console.warn('ADMIN_API_KEY not configured')
    return false
  }

  return apiKey === expectedKey
}

export function createUnauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({ error: 'Unauthorized', message: 'Valid API key required' }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

