export interface Theme {
  id: string
  name: string
  // Backgrounds
  bgRoot: string
  bgCard: string
  bgCardAlt: string
  bgInput: string
  bgOverlay: string
  // Text
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textOnAccent: string
  // Accents
  accentPrimary: string
  accentSecondary: string
  accentDark: string
  // Borders
  borderPrimary: string
  borderSubtle: string
  // Status
  colorError: string
  colorSuccess: string
  // Gradients
  gradientButton: readonly [string, string]
  gradientCard: readonly [string, string, string]
  gradientHero: readonly [string, string, string]
  gradientGlow: readonly [string, string]
  // Terminology
  termGem: string
  termGems: string
  numberedGems: boolean
  // Shadows
  shadowColor: string
  shadowTextColor: string
  // Game limit circle
  circleStroke: string
  circleStrokeWidth: number
  circleFill: string
}

export const darkGoldTheme: Theme = {
  id: 'darkGold',
  name: 'Oro Oscuro',
  bgRoot: '#080B14',
  bgCard: '#0E1220',
  bgCardAlt: '#0A0D1A',
  bgInput: 'rgba(255,255,255,0.04)',
  bgOverlay: 'rgba(0,0,0,0.65)',
  textPrimary: '#E8DDB5',
  textSecondary: 'rgba(232,221,181,0.55)',
  textTertiary: 'rgba(232,221,181,0.35)',
  textOnAccent: '#0A0D1A',
  accentPrimary: '#FFD700',
  accentSecondary: '#C8860A',
  accentDark: '#D4900A',
  borderPrimary: 'rgba(255,215,0,0.18)',
  borderSubtle: 'rgba(232,221,181,0.08)',
  colorError: '#FF6B6B',
  colorSuccess: '#6BCB77',
  gradientButton: ['#FFD700', '#D4900A'],
  gradientCard: ['#0E1220', '#0A0D1A', '#080B14'],
  gradientHero: ['#1A1400', '#0E0B00', '#080B14'],
  gradientGlow: ['rgba(255,215,0,0.12)', 'transparent'],
  termGem: 'Gema',
  termGems: 'Gemas',
  numberedGems: false,
  shadowColor: '#FFD700',
  shadowTextColor: 'rgba(255,215,0,0.45)',
  circleStroke: 'rgba(255,215,0,0.5)',
  circleStrokeWidth: 1.5,
  circleFill: 'transparent',
}

export const animeMagicoTheme: Theme = {
  id: 'animeMagico',
  name: 'Anime Mágico',
  bgRoot: '#E4CDBC',
  bgCard: '#F6ECE2',
  bgCardAlt: '#D9C2AE',
  bgInput: 'rgba(37, 37, 37, 0.06)',
  bgOverlay: 'rgba(37, 37, 37, 0.75)',
  textPrimary: '#252525',
  textSecondary: 'rgba(140, 45, 11, 0.75)',
  textTertiary: 'rgba(37, 37, 37, 0.35)',
  textOnAccent: '#F6ECE2',
  accentPrimary: '#C60209',
  accentSecondary: '#E4BF55',
  accentDark: '#8C2D0B',
  borderPrimary: 'rgba(198, 2, 9, 0.3)',
  borderSubtle: 'rgba(37, 37, 37, 0.08)',
  colorError: '#8C2D0B',
  colorSuccess: '#076700',
  gradientButton: ['#C60209', '#8C2D0B'],
  gradientCard: ['#F6ECE2', '#E4CDBC', '#D9C2AE'],
  gradientHero: ['#252525', '#8C2D0B', '#C60209'],
  gradientGlow: ['rgba(228, 191, 85, 0.3)', 'transparent'],
  termGem: 'Bola',
  termGems: 'Bolas',
  numberedGems: true,
  shadowColor: '#C60209',
  shadowTextColor: 'rgba(198, 2, 9, 0.4)',
  circleStroke: '#C60209',
  circleStrokeWidth: 2.5,
  circleFill: 'rgba(198, 2, 9, 0.094)',
}

export const THEMES: Record<string, Theme> = {
  darkGold: darkGoldTheme,
  animeMagico: animeMagicoTheme,
}

export const DEFAULT_THEME_ID = 'darkGold'
