import { eq, and, isNull, lt, sql } from 'drizzle-orm'
import { sendFeedbackRequestEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'authorization')

  if (authHeader !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, message: 'Non autorisé' })
  }

  const db = useDrizzle()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const contactsToNotify = await db.query.contactRequests.findMany({
    where: and(
      lt(tables.contactRequests.createdAt, sevenDaysAgo),
      isNull(tables.contactRequests.feedbackRequestedAt),
      isNull(tables.contactRequests.feedbackToken)
    ),
    with: {
      sender: {
        columns: { id: true, name: true, email: true }
      },
      recipient: {
        columns: { name: true }
      },
      feedback: true
    },
    limit: 50
  })

  const results = {
    processed: 0,
    sent: 0,
    skipped: 0,
    errors: 0
  }

  for (const contact of contactsToNotify) {
    results.processed++

    if (contact.feedback || !contact.sender.email) {
      results.skipped++
      continue
    }

    const token = crypto.randomUUID()

    try {
      await db.update(tables.contactRequests)
        .set({
          feedbackToken: token,
          feedbackRequestedAt: new Date()
        })
        .where(eq(tables.contactRequests.id, contact.id))

      await sendFeedbackRequestEmail(
        contact.sender.email,
        contact.sender.name,
        contact.recipient.name,
        token
      )

      results.sent++
    } catch (error) {
      console.error(`Erreur envoi feedback request ${contact.id}:`, error)
      results.errors++
    }
  }

  return results
})
