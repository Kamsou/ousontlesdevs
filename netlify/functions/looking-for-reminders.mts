import type { Config } from '@netlify/functions'

export default async () => {
  const baseUrl = process.env.URL || 'https://ousontlesdeveloppeuses.fr'
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error('CRON_SECRET not configured')
    return new Response('CRON_SECRET missing', { status: 500 })
  }

  try {
    const response = await fetch(`${baseUrl}/api/cron/looking-for-reminders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`
      }
    })

    const result = await response.json()
    console.log('Looking-for reminders sent:', result)

    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error sending looking-for reminders:', error)
    return new Response('Error', { status: 500 })
  }
}

export const config: Config = {
  schedule: '@daily'
}
