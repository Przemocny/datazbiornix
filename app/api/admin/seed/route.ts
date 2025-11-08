import { NextRequest } from 'next/server'
import { validateApiKey, createUnauthorizedResponse } from '@/lib/auth/api-key'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { domain = 'all' } = body

    // TODO: Implement selective seeding per domain
    // For now, run full seed
    console.log(`Starting seed for domain: ${domain}`)
    
    const { stdout, stderr } = await execAsync('npm run seed')
    
    console.log('Seed stdout:', stdout)
    if (stderr) console.error('Seed stderr:', stderr)

    return Response.json({
      success: true,
      message: `Database seeded successfully for domain: ${domain}`,
      output: stdout,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return Response.json(
      {
        success: false,
        error: 'Seed failed',
        message: (error as Error).message,
      },
      { status: 500 }
    )
  }
}

