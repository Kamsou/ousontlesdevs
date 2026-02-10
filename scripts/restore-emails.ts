import { createClient } from '@libsql/client'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

// Load .env
config()

// CSV Brevo path
const CSV_PATH = process.argv[2]

if (!CSV_PATH) {
  console.error('Usage: tsx scripts/restore-emails.ts <path-to-brevo.csv>')
  process.exit(1)
}

const TURSO_URL = process.env.TURSO_DATABASE_URL
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('❌ TURSO_DATABASE_URL et TURSO_AUTH_TOKEN doivent être définis dans .env')
  process.exit(1)
}

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN
})

interface BrevoContact {
  EMAIL: string
  LASTNAME?: string
  FIRSTNAME?: string
}

async function main() {
  // Parse CSV
  const csvContent = readFileSync(CSV_PATH, 'utf-8')
  const records = parse(csvContent, {
    columns: true,
    delimiter: ';',
    skip_empty_lines: true
  }) as BrevoContact[]

  console.log(`📧 ${records.length} emails trouvés dans le CSV Brevo\n`)

  // Get all developers with NULL email (skip Clémence who already has the right one)
  const result = await client.execute(
    "SELECT id, name, slug FROM developers WHERE email IS NULL"
  )

  console.log(`👤 ${result.rows.length} profils à restaurer\n`)

  let matched = 0
  let notMatched = 0

  for (const dev of result.rows) {
    const devName = String(dev.name).toLowerCase().trim()
    const devId = dev.id as number
    const devSlug = dev.slug as string

    // Try to match by email domain containing name parts
    let matchedEmail: string | null = null

    for (const contact of records) {
      const email = contact.EMAIL.toLowerCase()
      const emailPrefix = email.split('@')[0]

      // Split developer name into parts
      const nameParts = devName
        .split(/[\s-]+/)
        .filter(p => p.length > 2)
        .map(p => p.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) // remove accents

      // Check if email contains name parts
      const emailMatches = nameParts.some(part =>
        emailPrefix.includes(part) || email.includes(part)
      )

      if (emailMatches) {
        matchedEmail = contact.EMAIL
        break
      }
    }

    if (matchedEmail) {
      await client.execute({
        sql: 'UPDATE developers SET email = ? WHERE id = ?',
        args: [matchedEmail, devId]
      })
      console.log(`✅ ${devName} → ${matchedEmail}`)
      matched++
    } else {
      console.log(`❌ ${devName} (${devSlug}) → pas de match`)
      notMatched++
    }
  }

  console.log(`\n📊 Résumé:`)
  console.log(`   ✅ ${matched} emails restaurés`)
  console.log(`   ❌ ${notMatched} profils sans match`)
  console.log(`\n💡 Pour les profils sans match, ils devront se reconnecter via GitHub OAuth`)
}

main().catch(console.error)
