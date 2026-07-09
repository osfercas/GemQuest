import type { ImageSourcePropType } from 'react-native'

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
  titleColor: string
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
  // Root screen background image + legibility overlay (optional — falls back to bgRoot when absent)
  bgRootImage?: ImageSourcePropType
  bgRootOverlay?: readonly [string, string, string]
  bgRootOverlayLocations?: readonly [number, number, number]
}

export const mainQuestTheme: Theme = {
  id: 'mainQuest',
  name: 'Main Quest',
  bgRoot: '#0A2A16',
  bgCard: '#123A22',
  bgCardAlt: '#0D3019',
  bgInput: 'rgba(41,146,89,0.06)',
  bgOverlay: 'rgba(10,42,22,0.7)',
  textPrimary: '#DFF1B8',
  textSecondary: 'rgba(223,241,184,0.62)',
  textTertiary: 'rgba(223,241,184,0.35)',
  textOnAccent: '#FFFFFF',
  titleColor: '#DFF1B8',
  accentPrimary: '#299259',
  accentSecondary: '#66C068',
  accentDark: '#1e6b3f',
  borderPrimary: 'rgba(41,146,89,0.28)',
  borderSubtle: 'rgba(223,241,184,0.10)',
  colorError: '#FF6B6B',
  colorSuccess: '#66C068',
  gradientButton: ['#299259', '#1e6b3f'],
  gradientCard: ['#123A22', '#0D3019', '#0A2A16'],
  gradientHero: ['#0D3019', '#0A2A16', '#061A0E'],
  gradientGlow: ['rgba(254,121,20,0.22)', 'transparent'],
  termGem: 'Gem',
  termGems: 'Gems',
  numberedGems: false,
  shadowColor: '#299259',
  shadowTextColor: 'rgba(41,146,89,0.45)',
  circleStroke: 'rgba(41,146,89,0.6)',
  circleStrokeWidth: 1.5,
  circleFill: 'rgba(255,221,85,0.07)',
  // bgRootImage: require('../../assets/jungle_bkg.png'),
  bgRootOverlay: ['rgba(10,42,22,0.5)', 'rgba(10,42,22,0)', 'rgba(10,42,22,0.88)'],
  bgRootOverlayLocations: [0, 0.5, 1],
}

export const animeMagicoTheme: Theme = {
  id: 'animeMagico',
  name: 'Anime Mágico',
  bgRoot: '#E4CDBC',
  bgCard: '#F6ECE2',
  bgCardAlt: '#D9C2AE',
  bgInput: 'rgba(37, 37, 37, 0.06)',
  bgOverlay: 'rgba(37, 37, 37, 0.75)',
  bgRootImage: require('../../assets/dragonball_bkg.png'),
  textPrimary: '#252525',
  textSecondary: 'rgba(140, 45, 11, 0.75)',
  textTertiary: 'rgba(37, 37, 37, 0.35)',
  textOnAccent: '#F6ECE2',
  titleColor: '#FF6600',
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
  termGem: 'Ball',
  termGems: 'Balls',
  numberedGems: true,
  shadowColor: '#C60209',
  shadowTextColor: 'rgba(198, 2, 9, 0.4)',
  circleStroke: '#C60209',
  circleStrokeWidth: 2.5,
  circleFill: 'rgba(198, 2, 9, 0.094)',
}

export const THEMES: Record<string, Theme> = {
  mainQuest: mainQuestTheme,
  animeMagico: animeMagicoTheme,
}

export const DEFAULT_THEME_ID = 'mainQuest'
