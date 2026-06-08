import { StyleSheet } from 'react-native';

export const s = StyleSheet.create({
  glow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  root: {
    flex: 1,
    backgroundColor: '#080B14',
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
    color: 'rgba(255,215,0,0.6)',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  titleBig: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 36,
    color: '#FFD700',
    letterSpacing: 2,
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  gameName: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: '#E8DDB5',
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
    color: 'rgba(232,221,181,0.25)',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  statsText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: 'rgba(232,221,181,0.4)',
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
    color: '#0A0D1A',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
