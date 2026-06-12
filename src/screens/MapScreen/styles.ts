import { StyleSheet } from 'react-native'
import type { Theme } from '../../theme'

export const createMapStyles = (theme: Theme) => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bgRoot },
  map:  { flex: 1 },
})

export const createHudStyles = (theme: Theme) => StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: `${theme.bgRoot}D9`,
    borderBottomWidth: 1,
    borderBottomColor: `${theme.accentPrimary}26`,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${theme.textPrimary}33`,
  },
  gameName: {
    flex: 1,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: theme.textPrimary,
    letterSpacing: 1,
  },
  counter: {
    alignItems: 'flex-end',
  },
  counterNum: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 18,
    color: theme.accentPrimary,
    textShadowColor: `${theme.accentPrimary}80`,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  counterLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: theme.textSecondary,
    letterSpacing: 1,
  },
  gemBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: `${theme.bgRoot}E0`,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: `${theme.accentPrimary}1F`,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  gemSlot: {
    alignItems: 'center',
    gap: 3,
  },
  gemSlotLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 9,
    color: theme.textTertiary,
    letterSpacing: 0.5,
  },
  gemSlotCollected: {
    color: theme.textPrimary,
  },
})

export const createCenterBtnStyles = (theme: Theme) => StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${theme.bgRoot}E0`,
    borderWidth: 1,
    borderColor: `${theme.accentPrimary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export const createPermissionStyles = (theme: Theme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bgRoot,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  title: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: theme.textPrimary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  sub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  btnGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 13,
    color: theme.textOnAccent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
})

export const createLoadingStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.bgRoot}BF`,
    gap: 14,
  },
  text: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 13,
    color: theme.textPrimary,
    letterSpacing: 1.5,
  },
})
