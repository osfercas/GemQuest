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
  shadowColor: '#FFD700',
  shadowTextColor: 'rgba(255,215,0,0.45)',
  circleStroke: 'rgba(255,215,0,0.5)',
  circleStrokeWidth: 1.5,
  circleFill: 'transparent',
}

export const animeMagicoTheme: Theme = {
  id: 'animeMagico',
  name: 'Anime Mágico',
  bgRoot: '#F4F6F7',
  bgCard: '#FFFFFF',
  bgCardAlt: '#E8EDF1',
  bgInput: 'rgba(0, 51, 153, 0.06)',
  bgOverlay: 'rgba(0, 15, 45, 0.7)',
  textPrimary: '#001A4D',
  textSecondary: 'rgb(243, 112, 42)',
  textTertiary: 'rgba(0, 26, 77, 0.35)',
  textOnAccent: '#FFFFFF',
  accentPrimary: '#FF6600',
  accentSecondary: '#003399',
  accentDark: '#B34700',
  borderPrimary: 'rgba(255, 102, 0, 0.3)',
  borderSubtle: 'rgba(0, 51, 153, 0.08)',
  colorError: '#D90429',
  colorSuccess: '#2ECC71',
  gradientButton: ['#FF6600', '#FF8533'],
  gradientCard: ['#FFFFFF', '#F0F4F8', '#E2E8F0'],
  gradientHero: ['#003399', '#0047D1', '#001A4D'],
  gradientGlow: ['rgba(255, 204, 0, 0.2)', 'transparent'],
  termGem: 'Bola',
  termGems: 'Bolas',
  shadowColor: '#FF6600',
  shadowTextColor: 'rgba(255, 102, 0, 0.4)',
  circleStroke: '#FF6600',
  circleStrokeWidth: 2.5,
  circleFill: 'rgba(255, 102, 0, 0.094)',
}

export const THEMES: Record<string, Theme> = {
  darkGold: darkGoldTheme,
  animeMagico: animeMagicoTheme,
}

export const DEFAULT_THEME_ID = 'darkGold'
