import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { GemName } from '../components/GemShape';
import { GemVisual } from '../components/GemVisual';
import { ScreenBackground } from '../components/ScreenBackground';
import type { AuthStackParamList } from '../navigation/AuthStack';
import { signInWithEmail, signInWithGoogle } from '../services/auth';
import { useTheme } from '../theme/ThemeContext';
import type { Theme } from '../theme';

const { width: SW, height: SH } = Dimensions.get('window');

const GEMS: Array<{ name: GemName; size: number; left: number; top: number; delay: number }> = [
  { name: 'Ruby', size: 34, left: 60, top: 22, delay: 0 },
  { name: 'Diamond', size: 30, left: 158, top: 10, delay: 400 },
  { name: 'Emerald', size: 28, left: 255, top: 25, delay: 800 },
  { name: 'Sapphire', size: 32, left: 100, top: 62, delay: 200 },
  { name: 'Amethyst', size: 35, left: 208, top: 52, delay: 600 },
  { name: 'Amber', size: 26, left: 276, top: 70, delay: 1000 },
  { name: 'Aquamarine', size: 29, left: 140, top: 93, delay: 300 },
];

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: ((i * 131 + 41) % 97) / 97 * SW,
  y: ((i * 107 + 23) % 97) / 97 * SH,
  size: 1 + (i % 3) * 0.6,
  opacity: 0.12 + ((i * 59) % 55) / 100,
}));

function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/invalid-email': return 'Correo electrónico inválido.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'Correo o contraseña incorrectos.';
    case 'auth/too-many-requests': return 'Demasiados intentos. Intenta más tarde.';
    case 'auth/network-request-failed': return 'Sin conexión a internet.';
    case 'auth/user-disabled': return 'Esta cuenta ha sido desactivada.';
    default: return 'Algo salió mal. Inténtalo de nuevo.';
  }
}

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const gemAnims = useRef(GEMS.map(() => new Animated.Value(0))).current;
  const errorOpacity = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  function showError(msg: string) {
    setErrorMsg(msg);
    errorOpacity.setValue(0);
    Animated.timing(errorOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }

  async function handleEmailLogin() {
    if (!email.trim() || !password) {
      showError('Completa el correo y la contraseña.');
      return;
    }
    setSubmitting(true);
    try {
      await signInWithEmail(email.trim(), password);
      // AuthContext detecta el cambio y muestra MainStack automáticamente
    } catch (e: any) {
      showError(mapFirebaseError(e?.code ?? ''));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setSubmitting(true);
    try {
      await signInWithGoogle(); // returns null if cancelled — no error to show
    } catch (e: any) {
      showError(mapFirebaseError(e?.code ?? ''));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenBackground style={styles.root}>
      <StatusBar style={theme.id === 'mainQuest' ? 'light' : 'dark'} />

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
        keyboardShouldPersistTaps="handled"
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
                <GemVisual name={gem.name} size={gem.size} />
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.logoSection}>
          <Text style={styles.title}>{theme.termGems}Quest</Text>
          <View style={styles.taglineRow}>
            <Text style={styles.tagline}>7 {theme.termGems} · 1 Mapa</Text>
          </View>
          <Text style={styles.taglineSub}>Tu leyenda empieza aquí</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <Feather name="mail" size={18} color={`${theme.textOnCard}99`} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={`${theme.textOnCard}66`}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!submitting}
            />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color={`${theme.textOnCard}99`} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={`${theme.textOnCard}66`}
              secureTextEntry={!showPw}
              value={password}
              onChangeText={setPassword}
              editable={!submitting}
              onSubmitEditing={handleEmailLogin}
              returnKeyType="go"
            />
            <TouchableOpacity onPress={() => setShowPw(v => !v)} hitSlop={8}>
              <Feather name={showPw ? 'eye-off' : 'eye'} size={18} color={`${theme.textOnCard}66`} />
            </TouchableOpacity>
          </View>

          {errorMsg ? (
            <Animated.Text style={[styles.errorText, { opacity: errorOpacity }]}>
              {errorMsg}
            </Animated.Text>
          ) : null}

          <TouchableOpacity activeOpacity={0.82} onPress={handleEmailLogin} disabled={submitting}>
            <LinearGradient
              colors={theme.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.primaryBtn, submitting && styles.btnDisabled]}
            >
              {submitting
                ? <ActivityIndicator color="#0A0D1A" />
                : <Text style={styles.primaryBtnText}>Iniciar la aventura</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotRow} activeOpacity={0.75} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotLink}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.82} onPress={handleGoogleLogin} disabled={submitting}>
            <View style={styles.googleGWrap}>
              <Text style={[styles.googleGLetter, { color: '#4285F4' }]}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupRow} activeOpacity={0.75} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupText}>¿Primera vez? </Text>
            <Text style={styles.signupLink}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', paddingTop: 56 },
  gemsContainer: { width: SW, height: 160, position: 'relative' },
  logoSection: { alignItems: 'center', marginTop: 16, marginBottom: 44 },
  title: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 34,
    color: theme.titleColor,
    letterSpacing: 3,
    // textShadowColor: theme.shadowTextColor,
    // textShadowOffset: { width: 0, height: 0 },
    // textShadowRadius: 10,
  },
  taglineRow: { marginTop: 10 },
  tagline: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: theme.textPrimary,
    letterSpacing: 3.5,
    opacity: 0.85,
    textShadowColor: theme.shadowTextColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  taglineSub: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: theme.textSecondary,
    letterSpacing: 3.5,
    marginTop: 5,
    textTransform: 'uppercase',
    textShadowColor: theme.shadowTextColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
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
  input: { flex: 1, fontFamily: 'Nunito_400Regular', fontSize: 15, color: theme.textOnCard },
  errorText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: -4,
  },
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
  btnDisabled: { opacity: 0.6 },
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
    textShadowColor: theme.shadowTextColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
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
  googleBtnText: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: theme.textOnCard, letterSpacing: 0.4 },
  forgotRow: { alignItems: 'flex-end', marginTop: -4 },
  forgotLink: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: theme.textSecondary,
    textShadowColor: theme.shadowTextColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  signupText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: theme.textSecondary,
    textShadowColor: theme.shadowTextColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  signupLink: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: theme.textSecondary,
    textDecorationLine: 'underline',
    textDecorationColor: `${theme.textSecondary}80`,
    textShadowColor: theme.shadowTextColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});
