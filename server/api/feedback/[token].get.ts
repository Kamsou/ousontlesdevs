import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({ statusCode: 400, message: 'Token requis' })
  }

  const db = useDrizzle()

  const contactRequest = await db.query.contactRequests.findFirst({
    where: eq(tables.contactRequests.feedbackToken, token),
    with: {
      sender: {
        columns: { name: true }
      },
      recipient: {
        columns: { name: true }
      },
      feedback: true
    }
  })

  if (!contactRequest) {
    throw createError({ statusCode: 404, message: 'Lien invalide ou expiré' })
  }

  if (contactRequest.feedback) {
    return {
      alreadySubmitted: true,
      senderName: contactRequest.sender.name,
      recipientName: contactRequest.recipient.name
    }
  }

  return {
    alreadySubmitted: false,
    senderName: contactRequest.sender.name,
    recipientName: contactRequest.recipient.name,
    createdAt: contactRequest.createdAt
  }
})
