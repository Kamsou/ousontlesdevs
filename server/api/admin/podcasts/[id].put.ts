import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const githubId = session.user.id
  if (!githubId) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const db = useDrizzle()
  const currentUser = await db.query.developers.findFirst({
    where: eq(tables.developers.githubId, githubId)
  })

  if (!currentUser?.isAdmin) {
    throw createError({ statusCode: 403, message: 'Accès refusé' })
  }

  const id = Number(getRouterParam(event, 'id'))
  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: 'ID invalide' })
  }

  const body = await readBody(event)

  if (!body.title?.trim()) {
    throw createError({ statusCode: 400, message: 'Le titre est requis' })
  }

  if (!body.podcastName?.trim()) {
    throw createError({ statusCode: 400, message: 'Le nom du podcast est requis' })
  }

  if (!body.url?.trim()) {
    throw createError({ statusCode: 400, message: 'L\'URL est requise' })
  }

  const [podcast] = await db.update(tables.podcasts)
    .set({
      title: body.title.trim(),
      podcastName: body.podcastName.trim(),
      description: body.description?.trim() || null,
      guestName: body.guestName?.trim() || null,
      url: body.url.trim(),
      imageUrl: body.imageUrl?.trim() || null,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      highlight: body.highlight || false,
      active: body.active !== false
    })
    .where(eq(tables.podcasts.id, id))
    .returning()

  if (!podcast) {
    throw createError({ statusCode: 404, message: 'Podcast non trouvé' })
  }

  return podcast
})
