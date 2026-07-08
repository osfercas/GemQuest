import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';
import { sendPasswordReset } from '../../services/auth';
import { useTheme } from '../../theme/ThemeContext';
import type { Theme } from '../../theme';
import { ScreenBackground } from '../../components/ScreenBackground';

const { width: SW } = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const feedbackOpacity = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function showFeedback(msg: string, error: boolean) {
    setFeedbackMsg(msg);
    setIsError(error);
    feedbackOpacity.setValue(0);
    Animated.timing(feedbackOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }

  async function handleReset() {
    if (!email.trim()) {
      showFeedback('Escribe tu correo electrónico.', true);
      return;
    }
    setSubmitting(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
      showFeedback('Revisa tu correo para restablecer la contraseña.', false);
    } catch (e: any) {
      const code = e?.code ?? '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        showFeedback('No existe una cuenta con ese correo.', true);
      } else if (code === 'auth/network-request-failed') {
        showFeedback('Sin conexión a internet.', true);
      } else {
        showFeedback('Algo salió mal. Inténtalo de nuevo.', true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenBackground style={[styles.root, { paddingBottom: 48 + bottom }]}>
      <StatusBar style={theme.id === 'mainQuest' ? 'light' : 'dark'} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Recuperar acceso</Text>
        <Text style={styles.subtitle}>Te enviaremos un enlace al correo</Text>
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
            value={email}
            onChangeText={setEmail}
            editable={!submitting && !sent}
            onSubmitEditing={handleReset}
            returnKeyType="send"
          />
        </View>

        {feedbackMsg ? (
          <Animated.Text style={[styles.feedbackText, { opacity: feedbackOpacity, color: isError ? theme.colorError : theme.colorSuccess }]}>
            {feedbackMsg}
          </Animated.Text>
        ) : null}

        <TouchableOpacity activeOpacity={0.82} onPress={sent ? () => navigation.goBack() : handleReset} disabled={submitting}>
          <LinearGradient
            colors={theme.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.primaryBtn, submitting && styles.btnDisabled]}
          >
            {submitting
              ? <ActivityIndicator color={theme.textOnAccent} />
              : <Text style={styles.primaryBtnText}>{sent ? 'Volver al inicio' : 'Enviar enlace'}</Text>
            }
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24, paddingTop: 64 },
  header: { marginBottom: 40 },
  backBtn: { marginBottom: 24 },
  title: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 26,
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
  feedbackText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
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
});
