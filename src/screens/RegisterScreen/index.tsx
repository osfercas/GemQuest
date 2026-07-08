import React, { useMemo, useRef, useState } from 'react';
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
import type { AuthStackParamList } from '../../navigation/AuthStack';
import { signUpWithEmail } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import type { Theme } from '../../theme';
import { ScreenBackground } from '../../components/ScreenBackground';

const { width: SW } = Dimensions.get('window');

function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':   return 'Ya existe una cuenta con ese correo.';
    case 'auth/invalid-email':           return 'Correo electrónico inválido.';
    case 'auth/weak-password':           return 'La contraseña es demasiado débil.';
    case 'auth/network-request-failed':  return 'Sin conexión a internet.';
    default:                             return 'Algo salió mal. Inténtalo de nuevo.';
  }
}

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();
  const { refreshUser } = useAuth();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const errorOpacity = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function showError(msg: string) {
    setErrorMsg(msg);
    errorOpacity.setValue(0);
    Animated.timing(errorOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      showError('Completa todos los campos.');
      return;
    }
    if (password.length < 8) {
      showError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      showError('Las contraseñas no coinciden.');
      return;
    }
    setSubmitting(true);
    try {
      await signUpWithEmail(email.trim(), password, name.trim());
      refreshUser();
    } catch (e: any) {
      showError(mapFirebaseError(e?.code ?? ''));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenBackground style={styles.root}>
      <StatusBar style={theme.id === 'mainQuest' ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 48 + bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
            <Feather name="arrow-left" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a la aventura</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <Feather name="user" size={18} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre de aventurero"
              placeholderTextColor={theme.textTertiary}
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              editable={!submitting}
            />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="mail" size={18} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={theme.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!submitting}
            />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña (mín. 8 caracteres)"
              placeholderTextColor={theme.textTertiary}
              secureTextEntry={!showPw}
              value={password}
              onChangeText={setPassword}
              editable={!submitting}
            />
            <TouchableOpacity onPress={() => setShowPw(v => !v)} hitSlop={8}>
              <Feather name={showPw ? 'eye-off' : 'eye'} size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor={theme.textTertiary}
              secureTextEntry={!showConfirm}
              value={confirm}
              onChangeText={setConfirm}
              editable={!submitting}
              onSubmitEditing={handleRegister}
              returnKeyType="go"
            />
            <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={8}>
              <Feather name={showConfirm ? 'eye-off' : 'eye'} size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>

          {errorMsg ? (
            <Animated.Text style={[styles.errorText, { opacity: errorOpacity }]}>
              {errorMsg}
            </Animated.Text>
          ) : null}

          <TouchableOpacity activeOpacity={0.82} onPress={handleRegister} disabled={submitting}>
            <LinearGradient
              colors={theme.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.primaryBtn, submitting && styles.btnDisabled]}
            >
              {submitting
                ? <ActivityIndicator color={theme.textOnAccent} />
                : <Text style={styles.primaryBtnText}>Comenzar aventura</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginRow} activeOpacity={0.75} onPress={() => navigation.goBack()}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <Text style={styles.loginLink}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', paddingTop: 64 },
  header: { width: SW - 48, marginBottom: 40 },
  backBtn: { marginBottom: 24 },
  title: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 28,
    color: theme.accentPrimary,
    letterSpacing: 2,
    textShadowColor: theme.shadowTextColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: theme.accentSecondary,
    letterSpacing: 3,
    marginTop: 6,
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
  errorText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: theme.colorError,
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
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  loginText: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: theme.textSecondary },
  loginLink: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: theme.accentPrimary,
    textDecorationLine: 'underline',
    textDecorationColor: `${theme.accentPrimary}80`,
  },
});
