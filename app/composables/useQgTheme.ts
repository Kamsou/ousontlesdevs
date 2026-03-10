export type ThemePreference = 'light' | 'dark'

export function useQgTheme() {
  const preference = useState<ThemePreference>('qg-theme', () => 'dark')

  const isDark = computed(() => preference.value === 'dark')

  if (import.meta.client) {
    const saved = localStorage.getItem('qg-theme') as ThemePreference | null
    if (saved && ['light', 'dark'].includes(saved)) {
      preference.value = saved
    } else {
      preference.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  }

  function setTheme(theme: ThemePreference) {
    preference.value = theme
    if (import.meta.client) {
      localStorage.setItem('qg-theme', theme)
    }
  }

  function toggle() {
    setTheme(preference.value === 'dark' ? 'light' : 'dark')
  }

  return { preference, isDark, setTheme, toggle }
}
