import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = query.token as string

  if (!token) {
    throw createError({ statusCode: 400, message: 'Token requis' })
  }

  const db = useDrizzle()

  const developer = await db.query.developers.findFirst({
    where: eq(tables.developers.lookingForToken, token)
  })

  if (!developer) {
    throw createError({ statusCode: 404, message: 'Lien invalide ou expiré' })
  }

  await db.delete(tables.developerLookingFor)
    .where(eq(tables.developerLookingFor.developerId, developer.id))

  await db.update(tables.developers)
    .set({
      lookingForSince: null,
      lookingForReminderSentAt: null,
      lookingForToken: null
    })
    .where(eq(tables.developers.id, developer.id))

  return sendRedirect(event, '/qg?tab=profil&deactivated=1')
})
