import { eq } from 'drizzle-orm'

interface SendCommentNotificationsParams {
  commentAuthorId: number
  commentAuthorName: string
  commentContent: string
  helpRequestId?: number
  sideProjectId?: number
  offerId?: number
}

export async function sendCommentNotifications({
  commentAuthorId,
  commentAuthorName,
  commentContent,
  helpRequestId,
  sideProjectId,
  offerId
}: SendCommentNotificationsParams) {
  const db = useDrizzle()

  let opportunityType: 'help_request' | 'side_project' | 'offer'
  let opportunityTitle: string
  let opportunityCreatorId: number
  let opportunityUrl: string

  if (helpRequestId) {
    const helpRequest = await db.query.helpRequests.findFirst({
      where: eq(tables.helpRequests.id, helpRequestId),
      with: { developer: true }
    })
    if (!helpRequest) return

    opportunityType = 'help_request'
    opportunityTitle = helpRequest.title
    opportunityCreatorId = helpRequest.developerId
    opportunityUrl = `https://ousontlesdeveloppeuses.fr/qg/requests/${helpRequestId}`
  } else if (sideProjectId) {
    const sideProject = await db.query.sideProjects.findFirst({
      where: eq(tables.sideProjects.id, sideProjectId),
      with: { developer: true }
    })
    if (!sideProject) return

    opportunityType = 'side_project'
    opportunityTitle = sideProject.title
    opportunityCreatorId = sideProject.developerId
    opportunityUrl = `https://ousontlesdeveloppeuses.fr/qg/projects/${sideProjectId}`
  } else if (offerId) {
    const offer = await db.query.offers.findFirst({
      where: eq(tables.offers.id, offerId),
      with: { developer: true }
    })
    if (!offer) return

    opportunityType = 'offer'
    opportunityTitle = offer.title
    opportunityCreatorId = offer.developerId
    opportunityUrl = `https://ousontlesdeveloppeuses.fr/qg?tab=opportunites#offer-${offerId}`
  } else {
    return
  }

  const whereClause = helpRequestId
    ? eq(tables.comments.helpRequestId, helpRequestId)
    : sideProjectId
    ? eq(tables.comments.sideProjectId, sideProjectId)
    : eq(tables.comments.offerId, offerId!)

  const previousComments = await db.query.comments.findMany({
    where: whereClause,
    with: { developer: true }
  })

  const recipientIds = new Set<number>()
  recipientIds.add(opportunityCreatorId)

  for (const comment of previousComments) {
    recipientIds.add(comment.developerId)
  }

  recipientIds.delete(commentAuthorId)

  const recipients = await Promise.all(
    Array.from(recipientIds).map(id =>
      db.query.developers.findFirst({
        where: eq(tables.developers.id, id)
      })
    )
  )

  const commentSnippet = commentContent.length > 150
    ? commentContent.substring(0, 150)
    : commentContent

  for (const recipient of recipients) {
    if (!recipient) continue

    if (recipient.commentsNotificationsEnabled === false) continue

    if (!recipient.email) continue

    const isCreator = recipient.id === opportunityCreatorId

    try {
      await sendCommentNotificationEmail({
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        commenterName: commentAuthorName,
        opportunityTitle,
        commentSnippet,
        opportunityType,
        opportunityUrl,
        isCreator
      })
    } catch (error) {
      console.error(`Failed to send comment notification to ${recipient.email}:`, error)
    }
  }
}
