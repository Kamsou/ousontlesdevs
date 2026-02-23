export const skillGroups = [
  { label: 'Frontend', skills: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt', 'Svelte', 'HTML', 'CSS', 'Tailwind CSS', 'Sass'] },
  { label: 'Backend', skills: ['Node.js', 'Python', 'Java', 'PHP', 'Ruby', 'Go', 'Rust', 'C#', '.NET'] },
  { label: 'Mobile', skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'] },
  { label: 'Data / DevOps', skills: ['SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD'] },
  { label: 'Autres', skills: ['Git', 'GraphQL', 'REST API', 'Linux'] },
]

export const suggestedSkills = skillGroups.flatMap(g => g.skills)

export const openToOptions = [
  { value: 'conference', label: 'Conférence' },
  { value: 'mentoring', label: 'Mentoring' },
  { value: 'coffee_chat', label: 'Coffee chat' },
  { value: 'pair_programming', label: 'Pair programming' },
  { value: 'cv_review', label: 'Relecture CV' }
] as const

export type OpenToValue = typeof openToOptions[number]['value']

export const openToLabels: Record<string, string> = {
  ...Object.fromEntries(openToOptions.map(o => [o.value, o.label])),
  freelance: 'Freelance',
  cdi: 'CDI',
}

export const lookingForOptions = [
  { value: 'freelance', label: 'Mission freelance' },
  { value: 'cdi', label: 'CDI' },
  { value: 'stage', label: 'Stage' },
  { value: 'alternance', label: 'Alternance' },
] as const

export type LookingForValue = typeof lookingForOptions[number]['value']

export const lookingForLabels: Record<string, string> = Object.fromEntries(
  lookingForOptions.map(o => [o.value, o.label])
)

export const experienceOptions = [
  { value: 0, label: 'En formation' },
  { value: 1, label: '< 1 an' },
  { value: 2, label: '1-3 ans' },
  { value: 3, label: '3-5 ans' },
  { value: 5, label: '5-10 ans' },
  { value: 10, label: '10+ ans' },
] as const

export function getExperienceLabel(value: number | null): string | null {
  if (value === null) return null
  const exact = experienceOptions.find(o => o.value === value)
  if (exact) return exact.label
  if (value < 1) return '< 1 an'
  if (value <= 3) return '1-3 ans'
  if (value <= 5) return '3-5 ans'
  if (value <= 10) return '5-10 ans'
  return '10+ ans'
}
