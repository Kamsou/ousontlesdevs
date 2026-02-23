import { eq, and, isNotNull, isNull, lte, gte } from 'drizzle-orm'
import { sendLookingForReminderEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'authorization')

  if (authHeader !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, message: 'Non autorisé' })
  }

  const db = useDrizzle()

  const twentyFiveDaysAgo = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const devsToRemind = await db.query.developers.findMany({
    where: and(
      isNotNull(tables.developers.lookingForSince),
      lte(tables.developers.lookingForSince, twentyFiveDaysAgo),
      gte(tables.developers.lookingForSince, thirtyDaysAgo),
      isNull(tables.developers.lookingForReminderSentAt),
      isNotNull(tables.developers.email)
    ),
    with: {
      lookingFor: true
    },
    limit: 50
  })

  const results = {
    processed: 0,
    sent: 0,
    skipped: 0,
    errors: 0
  }

  for (const dev of devsToRemind) {
    results.processed++

    if (!dev.lookingFor.length || !dev.email) {
      results.skipped++
      continue
    }

    const token = crypto.randomUUID()

    try {
      await db.update(tables.developers)
        .set({
          lookingForToken: token,
          lookingForReminderSentAt: new Date()
        })
        .where(eq(tables.developers.id, dev.id))

      await sendLookingForReminderEmail({
        recipientEmail: dev.email,
        recipientName: dev.name,
        lookingForTypes: dev.lookingFor.map(l => l.type),
        renewToken: token,
        deactivateToken: token
      })

      results.sent++
    } catch (error) {
      console.error(`Erreur envoi looking-for reminder ${dev.id}:`, error)
      results.errors++
    }
  }

  return results
})
