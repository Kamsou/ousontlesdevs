export type ThemePreference = 'system' | 'light' | 'dark'

export function useQgTheme() {
  const preference = useState<ThemePreference>('qg-theme', () => 'system')

  const systemDark = ref(true)

  if (import.meta.client) {
    const saved = localStorage.getItem('qg-theme') as ThemePreference | null
    if (saved && ['system', 'light', 'dark'].includes(saved)) {
      preference.value = saved
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = mq.matches
    mq.addEventListener('change', (e) => { systemDark.value = e.matches })
  }

  const isDark = computed(() => {
    if (preference.value === 'system') return systemDark.value
    return preference.value === 'dark'
  })

  function setTheme(theme: ThemePreference) {
    preference.value = theme
    if (import.meta.client) {
      localStorage.setItem('qg-theme', theme)
    }
  }

  function cycle() {
    const order: ThemePreference[] = ['system', 'light', 'dark']
    const idx = order.indexOf(preference.value)
    setTheme(order[(idx + 1) % order.length] ?? 'system')
  }

  return { preference, isDark, setTheme, cycle }
}
