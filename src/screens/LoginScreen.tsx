import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GemShape, GEM_COLORS } from '../components/GemShape';
import type { RootStackParamList } from '../../App';
import { useTheme } from '../theme/ThemeContext';
import type { Theme } from '../theme';

const { width: SW, height: SH } = Dimensions.get('window');

const GEMS = [
  { ...GEM_COLORS.Ruby,       size: 34, left: 60,  top: 22,  delay: 0    },
  { ...GEM_COLORS.Diamond,    size: 30, left: 158, top: 10,  delay: 400  },
  { ...GEM_COLORS.Emerald,    size: 28, left: 255, top: 25,  delay: 800  },
  { ...GEM_COLORS.Sapphire,   size: 32, left: 100, top: 62,  delay: 200  },
  { ...GEM_COLORS.Amethyst,   size: 35, left: 208, top: 52,  delay: 600  },
  { ...GEM_COLORS.Amber,      size: 26, left: 276, top: 70,  delay: 1000 },
  { ...GEM_COLORS.Aquamarine, size: 29, left: 140, top: 93,  delay: 300  },
];

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: ((i * 131 + 41) % 97) / 97 * SW,
  y: ((i * 107 + 23) % 97) / 97 * SH,
  size: 1 + (i % 3) * 0.6,
  opacity: 0.12 + ((i * 59) % 55) / 100,
}));

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const gemAnims = useRef(GEMS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    GEMS.forEach((gem, i) => {
      const duration = 2400 + i * 180;
      const start = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(gemAnims[i], { toValue: 1, duration, useNativeDriver: true }),
            Animated.timing(gemAnims[i], { toValue: 0, duration, useNativeDriver: true }),
          ])
        ).start();
      };
      setTimeout(start, gem.delay);
    });
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style={theme.id === 'darkGold' ? 'light' : 'dark'} />

      {STARS.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            borderRadius: s.size / 2,
            backgroundColor: theme.textPrimary,
            opacity: s.opacity * 0.5,
          }}
        />
      ))}

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 48 + bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gemsContainer}>
          {GEMS.map((gem, i) => {
            const translateY = gemAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: [0, -11],
            });
            return (
              <Animated.View
                key={i}
                style={{ position: 'absolute', left: gem.left, top: gem.top, transform: [{ translateY }] }}
              >
                <GemShape color={gem.color} light={gem.light} dark={gem.dark} size={gem.size} />
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.logoSection}>
          <Text style={styles.title}>GemQuest</Text>
          <View style={styles.taglineRow}>
            <Text style={styles.tagline}>7 Gemas · 1 Mapa</Text>
          </View>
          <Text style={styles.taglineSub}>Tu leyenda empieza aquí</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <Feather name="mail" size={18} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={theme.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={theme.textTertiary}
              secureTextEntry
            />
          </View>

          <TouchableOpacity activeOpacity={0.82} onPress={() => navigation.replace('Home')}>
            <LinearGradient
              colors={theme.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>Iniciar la aventura</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.82}>
            <View style={styles.googleGWrap}>
              <Text style={[styles.googleGLetter, { color: '#4285F4' }]}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupRow} activeOpacity={0.75}>
            <Text style={styles.signupText}>¿Primera vez? </Text>
            <Text style={styles.signupLink}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bgRoot },
  scroll: { flexGrow: 1, alignItems: 'center', paddingTop: 56 },
  gemsContainer: { width: SW, height: 160, position: 'relative' },
  logoSection: { alignItems: 'center', marginTop: 16, marginBottom: 44 },
  title: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 34,
    color: theme.accentPrimary,
    letterSpacing: 3,
    textShadowColor: theme.shadowTextColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  taglineRow: { marginTop: 10 },
  tagline: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: theme.textPrimary,
    letterSpacing: 3.5,
    opacity: 0.85,
  },
  taglineSub: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: theme.accentSecondary,
    letterSpacing: 3.5,
    marginTop: 5,
    textTransform: 'uppercase',
  },
  form: { width: SW - 48, gap: 14 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.bgInput,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.borderPrimary,
    height: 54,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontFamily: 'Nunito_400Regular', fontSize: 15, color: theme.textPrimary },
  primaryBtn: {
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: theme.textOnAccent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: theme.borderSubtle },
  dividerLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: theme.textSecondary,
    marginHorizontal: 12,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.bgInput,
    borderRadius: 12,
    height: 54,
    borderWidth: 1,
    borderColor: theme.borderSubtle,
    gap: 10,
  },
  googleGWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  googleGLetter: { fontSize: 17, fontWeight: '700' },
  googleBtnText: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: theme.textPrimary, letterSpacing: 0.4 },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  signupText: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: theme.textSecondary },
  signupLink: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: theme.accentPrimary,
    textDecorationLine: 'underline',
    textDecorationColor: `${theme.accentPrimary}80`,
  },
});
