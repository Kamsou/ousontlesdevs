import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const githubId = session.user.id
  if (!githubId) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const db = useDrizzle()
  const currentUser = await db.query.developers.findFirst({
    where: eq(tables.developers.githubId, githubId)
  })

  if (!currentUser?.isAdmin) {
    throw createError({ statusCode: 403, message: 'Accès refusé' })
  }

  const allSkills = await db.select({
    id: tables.developerSkills.id,
    skillName: tables.developerSkills.skillName
  }).from(tables.developerSkills)

  let updated = 0
  for (const skill of allSkills) {
    const normalized = normalizeSkillName(skill.skillName)
    if (normalized !== skill.skillName) {
      await db.update(tables.developerSkills)
        .set({ skillName: normalized })
        .where(eq(tables.developerSkills.id, skill.id))
      updated++
    }
  }

  return { updated, total: allSkills.length }
})
