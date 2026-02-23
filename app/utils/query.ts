type QueryValue = string | null | (string | null)[] | undefined

export function queryString(value: QueryValue, fallback = ''): string {
  if (Array.isArray(value)) return value[0] ?? fallback
  return value ?? fallback
}

export function queryArray(value: QueryValue): string[] {
  if (!value) return []
  const str = Array.isArray(value) ? value[0] ?? '' : value
  return str.split(',').filter(Boolean)
}
