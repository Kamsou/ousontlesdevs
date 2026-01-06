import { sql } from 'drizzle-orm'

export default defineCachedEventHandler(async () => {
  const db = useDrizzle()

  const developers = await db.query.developers.findMany()
  const developerCount = developers.length

  const companies = await db.query.companies.findMany()
  const companyCount = companies.length

  const locations = new Set(developers.map(d => d.location).filter(Boolean))
  const locationCount = locations.size

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
}, {
  maxAge: 60 * 60,
  staleMaxAge: 60 * 60 * 24
})
