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
  // Shadows
  shadowColor: string
  shadowTextColor: string
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
  shadowColor: '#FFD700',
  shadowTextColor: 'rgba(255,215,0,0.45)',
}

export const animeMagicoTheme: Theme = {
  id: 'animeMagico',
  name: 'Anime Mágico',
  bgRoot: '#FEF3FF',
  bgCard: '#FFFFFF',
  bgCardAlt: '#F5E6FF',
  bgInput: 'rgba(200,80,192,0.06)',
  bgOverlay: 'rgba(45,0,80,0.55)',
  textPrimary: '#2D0050',
  textSecondary: 'rgba(45,0,80,0.6)',
  textTertiary: 'rgba(45,0,80,0.35)',
  textOnAccent: '#FFFFFF',
  accentPrimary: '#C850C0',
  accentSecondary: '#4158D0',
  accentDark: '#9B1DB0',
  borderPrimary: 'rgba(200,80,192,0.3)',
  borderSubtle: 'rgba(45,0,80,0.08)',
  colorError: '#FF5C8D',
  colorSuccess: '#2ECC71',
  gradientButton: ['#C850C0', '#4158D0'],
  gradientCard: ['#FFFFFF', '#F5E6FF', '#EDD6FF'],
  gradientHero: ['#F5E6FF', '#EDD6FF', '#E0C3FF'],
  gradientGlow: ['rgba(200,80,192,0.15)', 'transparent'],
  shadowColor: '#C850C0',
  shadowTextColor: 'rgba(200,80,192,0.4)',
}

export const THEMES: Record<string, Theme> = {
  darkGold: darkGoldTheme,
  animeMagico: animeMagicoTheme,
}

export const DEFAULT_THEME_ID = 'darkGold'
