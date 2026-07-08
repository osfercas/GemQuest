import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import type { Theme } from '../../theme';
import type { MainStackParamList } from '../../navigation/MainStack';
import { ScreenBackground } from '../../components/ScreenBackground';

type Props = NativeStackScreenProps<MainStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const displayName = user?.displayName ?? 'Aventurero';
  const email = user?.email ?? '';
  const initial = displayName[0].toUpperCase();

  function handleSignOut() {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres salir de tu aventura?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: signOut,
        },
      ],
    );
  }

  return (
    <ScreenBackground style={[styles.root, { paddingTop: top, paddingBottom: bottom + 24 }]}>
      <StatusBar style={theme.id === 'mainQuest' ? 'light' : 'dark'} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} activeOpacity={0.7}>
          <Feather name="arrow-left" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.avatarSection}>
        <LinearGradient colors={theme.gradientButton} style={styles.avatar}>
          <Text style={styles.avatarLetter}>{initial}</Text>
        </LinearGradient>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.75} onPress={handleSignOut}>
        <Feather name="log-out" size={18} color={theme.colorError} />
        <Text style={styles.signOutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScreenBackground>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    color: theme.textPrimary,
    letterSpacing: 2,
  },
  avatarSection: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 32,
    color: theme.textOnAccent,
  },
  name: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 20,
    color: theme.textPrimary,
    letterSpacing: 1,
  },
  email: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: theme.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.borderSubtle,
    marginBottom: 8,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  signOutText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: theme.colorError,
  },
});
