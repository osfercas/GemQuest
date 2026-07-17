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
  textOnCard: string
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
  // Map gem tooltip
  tooltipBg: string
  tooltipText: string
  // Root screen background image + legibility overlay (optional — falls back to bgRoot when absent)
  bgRootImage?: ImageSourcePropType
  bgRootOverlay?: readonly [string, string, string]
  bgRootOverlayLocations?: readonly [number, number, number]
}

// Applies opacity to a named palette color instead of hardcoding a parallel rgba(...) literal,
// so each hue has a single source of truth regardless of how many alpha variants it needs.
function withAlpha(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const mainQuestPalette = {
  white: '#FFFFFF',
  sand: '#d1c49e',
  gurkha: '#9C9773',
  spanishBistre: '#827B5C',
  mutedOlive: '#6C7656',
  deepOlive: '#58613C',
  boyGreen: '#567150',
  forestGreen: '#42593D',
  camouflageGreen: '#2E472B',
  darkMossGreen: '#102A0A',
  errorRed: '#FF6B6B',
}

export const mainQuestTheme: Theme = {
  id: 'mainQuest',
  name: 'Main Quest',
  accentDark: mainQuestPalette.forestGreen,
  accentPrimary: mainQuestPalette.boyGreen,
  accentSecondary: mainQuestPalette.camouflageGreen,
  bgCard: mainQuestPalette.gurkha,
  bgCardAlt: mainQuestPalette.mutedOlive,
  bgInput: withAlpha(mainQuestPalette.gurkha, 0.9),
  bgOverlay: withAlpha(mainQuestPalette.darkMossGreen, 0.7),
  bgRoot: mainQuestPalette.sand,
  bgRootImage: require('../../assets/jungle_bkg.png'),
  bgRootOverlay: [withAlpha(mainQuestPalette.darkMossGreen, 0.65), withAlpha(mainQuestPalette.darkMossGreen, 0.4), withAlpha(mainQuestPalette.darkMossGreen, 0.8)],
  bgRootOverlayLocations: [0, 0.5, 1],
  borderPrimary: withAlpha(mainQuestPalette.darkMossGreen, 0.5),
  borderSubtle: withAlpha(mainQuestPalette.darkMossGreen, 0.25),
  circleFill: withAlpha(mainQuestPalette.darkMossGreen, 0.08),
  circleStroke: withAlpha(mainQuestPalette.darkMossGreen, 0.7),
  circleStrokeWidth: 1.5,
  colorError: mainQuestPalette.errorRed,
  colorSuccess: mainQuestPalette.boyGreen,
  gradientButton: [mainQuestPalette.boyGreen, mainQuestPalette.forestGreen],
  gradientCard: [mainQuestPalette.gurkha, mainQuestPalette.spanishBistre, mainQuestPalette.mutedOlive],
  gradientGlow: [withAlpha(mainQuestPalette.boyGreen, 0.2), 'transparent'],
  gradientHero: [mainQuestPalette.deepOlive, mainQuestPalette.camouflageGreen, mainQuestPalette.darkMossGreen],
  numberedGems: false,
  shadowColor: mainQuestPalette.boyGreen,
  shadowTextColor: withAlpha(mainQuestPalette.boyGreen, 0.45),
  termGem: 'Gem',
  termGems: 'Gems',
  textOnAccent: mainQuestPalette.white,
  textOnCard: mainQuestPalette.darkMossGreen,
  textPrimary: mainQuestPalette.white,
  textSecondary: withAlpha(mainQuestPalette.white, 0.75),
  textTertiary: withAlpha(mainQuestPalette.white, 0.5),
  titleColor: mainQuestPalette.sand,
  tooltipBg: withAlpha(mainQuestPalette.darkMossGreen, 0.94),
  tooltipText: mainQuestPalette.white,
}

const animePalette = {
  sportRed: '#C60209',
  shockingGold: '#E4BF55',
  soccerGreen: '#076700',
  shinyBlack: '#252525',
  paleOliveSkin: '#E4CDBC',
  primitiveRed: '#8C2D0B',
  ecstasyOrange: '#FF6600',
  cream: '#F6ECE2',
  creamAlt: '#D9C2AE',
}

export const animeTheme: Theme = {
  id: 'animeMagico',
  name: 'Anime Mágico',
  accentDark: animePalette.primitiveRed,
  accentPrimary: animePalette.sportRed,
  accentSecondary: animePalette.shockingGold,
  bgCard: animePalette.cream,
  bgCardAlt: animePalette.creamAlt,
  bgInput: withAlpha(animePalette.cream, 0.9),
  bgOverlay: withAlpha(animePalette.shinyBlack, 0.75),
  bgRoot: animePalette.paleOliveSkin,
  bgRootImage: require('../../assets/dragonball_bkg.png'),
  bgRootOverlay: [withAlpha(animePalette.paleOliveSkin, 0.55), withAlpha(animePalette.paleOliveSkin, 0.1), withAlpha(animePalette.paleOliveSkin, 0.7)],
  bgRootOverlayLocations: [0, 0.75, 1],
  borderPrimary: withAlpha(animePalette.sportRed, 0.4),
  borderSubtle: withAlpha(animePalette.shinyBlack, 0.08),
  circleFill: withAlpha(animePalette.sportRed, 0.094),
  circleStroke: animePalette.sportRed,
  circleStrokeWidth: 2.5,
  colorError: animePalette.primitiveRed,
  colorSuccess: animePalette.soccerGreen,
  gradientButton: [animePalette.sportRed, animePalette.primitiveRed],
  gradientCard: [animePalette.cream, animePalette.paleOliveSkin, animePalette.creamAlt],
  gradientGlow: [withAlpha(animePalette.shockingGold, 0.3), 'transparent'],
  gradientHero: [animePalette.shinyBlack, animePalette.primitiveRed, animePalette.sportRed],
  numberedGems: true,
  shadowColor: animePalette.sportRed,
  shadowTextColor: withAlpha(animePalette.sportRed, 0.25),
  termGem: 'Ball',
  termGems: 'Balls',
  textOnAccent: animePalette.cream,
  textOnCard: animePalette.shinyBlack,
  textPrimary: animePalette.shinyBlack,
  textSecondary: withAlpha(animePalette.primitiveRed, 0.75),
  textTertiary: withAlpha(animePalette.shinyBlack, 0.35),
  titleColor: animePalette.ecstasyOrange,
  tooltipBg: withAlpha(animePalette.paleOliveSkin, 0.94),
  tooltipText: animePalette.shinyBlack,
}

export const THEMES: Record<string, Theme> = {
  mainQuest: mainQuestTheme,
  animeMagico: animeTheme,
}

export const DEFAULT_THEME_ID = 'mainQuest'
