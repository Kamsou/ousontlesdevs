export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname

  const redirects: Record<string, string> = {
    '/annuaire': '/directory',
    '/profil': '/profile',
  }

  for (const [from, to] of Object.entries(redirects)) {
    if (path.startsWith(from + '/') || path === from) {
      const newPath = path.replace(from, to)
      return sendRedirect(event, newPath, 301)
    }
  }
})
