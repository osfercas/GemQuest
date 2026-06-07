import { StyleSheet } from 'react-native';

export const mapStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080B14' },
  map:  { flex: 1 },
});

export const hudStyles = StyleSheet.create({
  // Barra superior
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(8,11,20,0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.15)',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232,221,181,0.2)',
  },
  gameName: {
    flex: 1,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: '#E8DDB5',
    letterSpacing: 1,
  },
  counter: {
    alignItems: 'flex-end',
  },
  counterNum: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 18,
    color: '#FFD700',
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  counterLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: 'rgba(232,221,181,0.45)',
    letterSpacing: 1,
  },

  // Fila de gemas — posición top se calcula dinámicamente en GameHUD
  gemBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(8,11,20,0.88)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(255,215,0,0.12)',
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
    color: 'rgba(232,221,181,0.4)',
    letterSpacing: 0.5,
  },
  gemSlotCollected: {
    color: '#E8DDB5',
  },
});



export const centerBtnStyles = StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(8,11,20,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const permissionStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#080B14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  title: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: '#E8DDB5',
    textAlign: 'center',
    letterSpacing: 1,
  },
  sub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: 'rgba(232,221,181,0.5)',
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
    color: '#0A0D1A',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
