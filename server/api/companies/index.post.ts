import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const body = await readBody(event)
  const db = useDrizzle()

  if (!body.name) {
    throw createError({ statusCode: 400, message: 'Nom requis' })
  }

  const result = await db.insert(tables.companies).values({
    name: body.name,
    logoUrl: body.logoUrl || null,
    website: body.website || null,
    description: body.description || null,
    location: body.location || null
  }).returning()

  return result[0]
})
