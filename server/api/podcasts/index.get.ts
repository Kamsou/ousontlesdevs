import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDrizzle()

  const podcasts = await db.query.podcasts.findMany({
    where: eq(tables.podcasts.active, true),
    orderBy: (podcasts, { desc }) => [desc(podcasts.highlight), desc(podcasts.createdAt)]
  })

  return podcasts
})
