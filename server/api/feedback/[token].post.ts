import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({ statusCode: 400, message: 'Token requis' })
  }

  const body = await readBody(event)

  if (typeof body.exchangeHappened !== 'boolean') {
    throw createError({ statusCode: 400, message: 'Réponse requise' })
  }

  if (body.usefulnessRating !== undefined) {
    const rating = Number(body.usefulnessRating)
    if (isNaN(rating) || rating < 1 || rating > 5) {
      throw createError({ statusCode: 400, message: 'Note entre 1 et 5' })
    }
  }

  const db = useDrizzle()

  const contactRequest = await db.query.contactRequests.findFirst({
    where: eq(tables.contactRequests.feedbackToken, token),
    with: { feedback: true }
  })

  if (!contactRequest) {
    throw createError({ statusCode: 404, message: 'Lien invalide ou expiré' })
  }

  if (contactRequest.feedback) {
    throw createError({ statusCode: 400, message: 'Feedback déjà soumis' })
  }

  await db.insert(tables.contactFeedbacks).values({
    contactRequestId: contactRequest.id,
    exchangeHappened: body.exchangeHappened,
    usefulnessRating: body.exchangeHappened ? body.usefulnessRating : null,
    comment: body.comment?.trim() || null
  })

  return { success: true, message: 'Merci pour ton retour !' }
})
