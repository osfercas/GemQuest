import { StyleSheet } from 'react-native'
import type { Theme } from '../../theme'

export const createStyles = (theme: Theme) => StyleSheet.create({
  glow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  root: {
    flex: 1,
    backgroundColor: theme.bgRoot,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 36,
  },
  titleBlock: {
    alignItems: 'center',
    gap: 6,
  },
  titleEyebrow: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: theme.accentPrimary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  titleBig: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 36,
    color: theme.accentPrimary,
    letterSpacing: 2,
    textShadowColor: theme.shadowTextColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  gameName: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: theme.textPrimary,
    letterSpacing: 1,
    marginTop: 4,
  },
  gemGrid: {
    gap: 18,
    alignItems: 'center',
  },
  gemRow: {
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'center',
  },
  gemSlot: {
    alignItems: 'center',
    gap: 5,
    width: 60,
  },
  gemLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 9,
    color: theme.textTertiary,
    letterSpacing: 0.3,
    textAlign: 'center',
    opacity: 0.7,
  },
  statsText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: theme.textSecondary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  btnWrap: {
    width: '100%',
  },
  btn: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 15,
    color: theme.textOnAccent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
})
