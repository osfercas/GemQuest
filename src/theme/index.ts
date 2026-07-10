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
  bgRoot: '#d1c49e',
  bgCard: '#9C9773',
  bgCardAlt: '#6C7656',
  bgInput: 'rgba(156,151,115,0.9)',
  bgOverlay: 'rgba(16,42,10,0.7)',
  textPrimary: '#102A0A',
  textSecondary: 'rgba(16,42,10,0.8)',
  textTertiary: 'rgba(16,42,10,0.55)',
  textOnAccent: '#FFFFFF',
  titleColor: '#102A0A',
  accentPrimary: '#567150',
  accentSecondary: '#2E472B',
  accentDark: '#42593D',
  borderPrimary: 'rgba(16,42,10,0.5)',
  borderSubtle: 'rgba(16,42,10,0.25)',
  colorError: '#FF6B6B',
  colorSuccess: '#567150',
  gradientButton: ['#567150', '#42593D'],
  gradientCard: ['#9C9773', '#827B5C', '#6C7656'],
  gradientHero: ['#58613C', '#2E472B', '#102A0A'],
  gradientGlow: ['rgba(86,113,80,0.2)', 'transparent'],
  termGem: 'Gem',
  termGems: 'Gems',
  numberedGems: false,
  shadowColor: '#567150',
  shadowTextColor: 'rgba(86,113,80,0.45)',
  circleStroke: 'rgba(16,42,10,0.7)',
  circleStrokeWidth: 1.5,
  circleFill: 'rgba(16,42,10,0.08)',
  // bgRootImage: require('../../assets/jungle_bkg.png'),
  bgRootOverlay: ['rgba(130,123,92,0.55)', 'rgba(130,123,92,0.15)', 'rgba(130,123,92,0.7)'],
  bgRootOverlayLocations: [0, 0.5, 1],
}

export const animeMagicoTheme: Theme = {
  id: 'animeMagico',
  name: 'Anime Mágico',
  bgRoot: '#E4CDBC',
  bgCard: '#F6ECE2',
  bgCardAlt: '#D9C2AE',
  bgInput: 'rgba(246,236,226,0.9)',
  bgOverlay: 'rgba(37, 37, 37, 0.75)',
  bgRootImage: require('../../assets/dragonball_bkg.png'),
  bgRootOverlay: ['rgba(228,205,188,0.55)', 'rgba(228,205,188,0.1)', 'rgba(228,205,188,0.7)'],
  bgRootOverlayLocations: [0, 0.75, 1],
  textPrimary: '#252525',
  textSecondary: 'rgba(140, 45, 11, 0.75)',
  textTertiary: 'rgba(37, 37, 37, 0.35)',
  textOnAccent: '#F6ECE2',
  titleColor: '#FF6600',
  accentPrimary: '#C60209',
  accentSecondary: '#E4BF55',
  accentDark: '#8C2D0B',
  borderPrimary: 'rgba(198, 2, 9, 0.4)',
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
