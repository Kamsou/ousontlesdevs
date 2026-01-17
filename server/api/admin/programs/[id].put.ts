import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const githubId = (session.user as any).id
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

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, message: 'Le nom est requis' })
  }

  if (!body.description?.trim()) {
    throw createError({ statusCode: 400, message: 'La description est requise' })
  }

  if (!body.url?.trim()) {
    throw createError({ statusCode: 400, message: 'L\'URL est requise' })
  }

  const validCategories = ['community', 'mentoring', 'conference', 'funding']
  if (!validCategories.includes(body.category)) {
    throw createError({ statusCode: 400, message: 'Catégorie invalide' })
  }

  const [program] = await db.update(tables.programs)
    .set({
      name: body.name.trim(),
      description: body.description.trim(),
      category: body.category,
      url: body.url.trim(),
      highlight: body.highlight || false,
      active: body.active !== false
    })
    .where(eq(tables.programs.id, id))
    .returning()

  if (!program) {
    throw createError({ statusCode: 404, message: 'Programme non trouvé' })
  }

  return program
})
