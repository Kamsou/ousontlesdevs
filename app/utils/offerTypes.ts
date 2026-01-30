export type OfferType = 'alternance' | 'stage' | 'cdi' | 'freelance' | 'other'

export const typeLabels: Record<string, string> = {
  alternance: 'Alternance',
  stage: 'Stage',
  cdi: 'CDI',
  freelance: 'Freelance',
  other: 'Autre'
}

export const typeColors: Record<string, string> = {
  alternance: 'border-foreground-muted/20 text-foreground-muted',
  stage: 'border-foreground-muted/20 text-foreground-muted',
  cdi: 'border-foreground-muted/20 text-foreground-muted',
  freelance: 'border-foreground-muted/20 text-foreground-muted',
  other: 'border-foreground-muted/20 text-foreground-muted'
}
