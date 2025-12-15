import { sql } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDrizzle()

  // Count developers
  const developers = await db.query.developers.findMany()
  const developerCount = developers.length

  // Count companies
  const companies = await db.query.companies.findMany()
  const companyCount = companies.length

  // Count unique locations
  const locations = new Set(developers.map(d => d.location).filter(Boolean))
  const locationCount = locations.size

  // Count speakers (developers with 'conference' in openTo)
  const speakerDevs = await db.query.developerOpenTo.findMany({
    where: sql`${tables.developerOpenTo.type} = 'conference'`
  })
  const speakerCount = new Set(speakerDevs.map(s => s.developerId)).size

  return {
    developers: developerCount,
    companies: companyCount,
    locations: locationCount,
    speakers: speakerCount
  }
})
