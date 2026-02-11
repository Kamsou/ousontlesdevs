import { eq, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const helpRequestId = query.helpRequestId ? Number(query.helpRequestId) : null
  const sideProjectId = query.sideProjectId ? Number(query.sideProjectId) : null
  const offerId = query.offerId ? Number(query.offerId) : null

  if (!helpRequestId && !sideProjectId && !offerId) {
    throw createError({ statusCode: 400, message: 'helpRequestId, sideProjectId ou offerId requis' })
  }

  const db = useDrizzle()

  const comments = await db.query.comments.findMany({
    where: helpRequestId
      ? eq(tables.comments.helpRequestId, helpRequestId)
      : sideProjectId
      ? eq(tables.comments.sideProjectId, sideProjectId)
      : eq(tables.comments.offerId, offerId!),
    with: {
      developer: {
        columns: {
          id: true,
          slug: true,
          name: true,
          avatarUrl: true
        }
      }
    },
    orderBy: [asc(tables.comments.createdAt)]
  })

  return comments
})
