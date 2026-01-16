import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'
import { sendWelcomeEmail } from '../../utils/email'

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
  const developer = await db.query.developers.findFirst({
    where: eq(tables.developers.githubId, githubId)
  })

  if (!developer?.isAdmin) {
    throw createError({ statusCode: 403, message: 'Non autorisé' })
  }

  const body = await readBody(event)
  const email = body.email || session.user.email
  const name = body.name || session.user.name || 'Test'

  const result = await sendWelcomeEmail(email, name)

  return { success: true, result }
})
