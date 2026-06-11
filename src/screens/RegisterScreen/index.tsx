import React, { useRef, useState } from 'react';
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
  const errorOpacity = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
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
      // AuthContext detecta el nuevo usuario y muestra MainStack
    } catch (e: any) {
      showError(mapFirebaseError(e?.code ?? ''));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 48 + bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
            <Feather name="arrow-left" size={22} color="#E8DDB5" />
          </TouchableOpacity>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a la aventura</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <Feather name="user" size={18} color="rgba(232,221,181,0.45)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre de aventurero"
              placeholderTextColor="rgba(232,221,181,0.35)"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              editable={!submitting}
            />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="mail" size={18} color="rgba(232,221,181,0.45)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="rgba(232,221,181,0.35)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!submitting}
            />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color="rgba(232,221,181,0.45)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña (mín. 8 caracteres)"
              placeholderTextColor="rgba(232,221,181,0.35)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!submitting}
            />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color="rgba(232,221,181,0.45)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="rgba(232,221,181,0.35)"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              editable={!submitting}
              onSubmitEditing={handleRegister}
              returnKeyType="go"
            />
          </View>

          {errorMsg ? (
            <Animated.Text style={[styles.errorText, { opacity: errorOpacity }]}>
              {errorMsg}
            </Animated.Text>
          ) : null}

          <TouchableOpacity activeOpacity={0.82} onPress={handleRegister} disabled={submitting}>
            <LinearGradient
              colors={['#FFD700', '#D4900A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.primaryBtn, submitting && styles.btnDisabled]}
            >
              {submitting
                ? <ActivityIndicator color="#0A0D1A" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080B14' },
  scroll: { flexGrow: 1, alignItems: 'center', paddingTop: 64 },
  header: { width: SW - 48, marginBottom: 40 },
  backBtn: { marginBottom: 24 },
  title: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 28,
    color: '#FFD700',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 215, 0, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: '#C8860A',
    letterSpacing: 3,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  form: { width: SW - 48, gap: 14 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.18)',
    height: 54,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontFamily: 'Nunito_400Regular', fontSize: 15, color: '#E8DDB5' },
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
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: '#0A0D1A',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  loginText: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: 'rgba(232,221,181,0.55)' },
  loginLink: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#FFD700',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(255,215,0,0.5)',
  },
});
