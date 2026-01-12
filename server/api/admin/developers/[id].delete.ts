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

  // Vérifier si l'utilisateur est admin
  const admin = await db.query.developers.findFirst({
    where: eq(tables.developers.githubId, githubId)
  })

  if (!admin?.isAdmin) {
    throw createError({ statusCode: 403, message: 'Accès refusé' })
  }

  const id = Number(getRouterParam(event, 'id'))

  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, message: 'ID invalide' })
  }

  // Empêcher l'admin de se supprimer lui-même
  if (admin.id === id) {
    throw createError({ statusCode: 400, message: 'Vous ne pouvez pas supprimer votre propre compte' })
  }

  // Supprimer les données liées (foreign keys)
  await db.delete(tables.developerSkills).where(eq(tables.developerSkills.developerId, id))
  await db.delete(tables.developerOpenTo).where(eq(tables.developerOpenTo.developerId, id))
  await db.delete(tables.speakerProfiles).where(eq(tables.speakerProfiles.developerId, id))

  // Supprimer le développeur
  await db.delete(tables.developers).where(eq(tables.developers.id, id))

  return { success: true }
})
