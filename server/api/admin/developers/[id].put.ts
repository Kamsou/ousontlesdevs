import { eq } from 'drizzle-orm'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const config = useRuntimeConfig()

  if (!session || session.user.id !== config.adminGithubId) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: 'Invalid id' })
  }

  const body = await readBody(event)

  const db = useDrizzle()
  const existing = await db.query.developers.findFirst({
    where: eq(tables.developers.id, Number(id))
  })

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Developer not found' })
  }

  const fullName = [body.firstName, body.lastName].filter(Boolean).join(' ').trim()

  const updateData: Partial<typeof tables.developers.$inferInsert> = {
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

  await db.update(tables.developers)
    .set(updateData)
    .where(eq(tables.developers.id, Number(id)))

  return { success: true }
})
