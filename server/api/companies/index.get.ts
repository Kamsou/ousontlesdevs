import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDrizzle()

  const companies = await db.query.companies.findMany({
    with: {
      reviews: true
    }
  })

  let results = companies.map(company => {
    const reviewCount = company.reviews.length
    const avgRating = reviewCount > 0
      ? company.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0
    const inclusiveCount = company.reviews.filter(r => r.isInclusive).length

    const isVerifiedInclusive = reviewCount >= 5 && avgRating >= 4

    return {
      id: company.id,
      name: company.name,
      logoUrl: company.logoUrl,
      website: company.website,
      description: company.description,
      location: company.location,
      reviewCount,
      avgRating: Math.round(avgRating * 10) / 10,
      inclusiveCount,
      isVerifiedInclusive
    }
  })

  if (query.location) {
    const locationFilter = (query.location as string).toLowerCase()
    results = results.filter(c =>
      c.location?.toLowerCase().includes(locationFilter)
    )
  }

  if (query.verified === 'true') {
    results = results.filter(c => c.isVerifiedInclusive)
  }

  results.sort((a, b) => b.avgRating - a.avgRating)

  return results
})
