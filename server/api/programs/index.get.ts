import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDrizzle()

  const programs = await db.query.programs.findMany({
    where: eq(tables.programs.active, true),
    orderBy: (programs, { desc }) => [desc(programs.highlight), desc(programs.createdAt)]
  })

  return programs
})
