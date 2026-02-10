import { eq } from 'drizzle-orm'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session || session.user.id !== '16612054') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing id' })
  }

  const body = await readBody(event)

  const fullName = [body.firstName, body.lastName].filter(Boolean).join(' ').trim()

  const updateData: any = {
    email: body.email || null,
    bio: body.bio || null,
    title: body.title || null,
    location: body.location || null,
    linkedinUrl: body.linkedinUrl || null,
    githubUrl: body.githubUrl || null,
    twitterUrl: body.twitterUrl || null,
    website: body.website || null
  }

  if (fullName) {
    updateData.name = fullName
  }

  const db = useDrizzle()
  await db.update(tables.developers)
    .set(updateData)
    .where(eq(tables.developers.id, Number(id)))

  return { success: true }
})
