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

  const db = useDrizzle()
  const developer = await db.query.developers.findFirst({
    where: eq(tables.developers.id, Number(id))
  })

  if (!developer) {
    throw createError({ statusCode: 404, message: 'Developer not found' })
  }

  return developer
})
