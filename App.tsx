import React, { useEffect, useRef } from 'react';
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
import { useFonts } from 'expo-font';
import { CinzelDecorative_900Black } from '@expo-google-fonts/cinzel-decorative';
import { Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { Nunito_400Regular, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

const { width: SW, height: SH } = Dimensions.get('window');

const GEMS = [
  { color: '#FF6B6B', light: '#FF9999', dark: '#AA1100', size: 34, left: 60,  top: 22,  delay: 0    }, // Ruby
  { color: '#FFD93D', light: '#FFF0A0', dark: '#C8860A', size: 30, left: 158, top: 10,  delay: 400  }, // Diamond
  { color: '#6BCB77', light: '#A8E6B0', dark: '#1E6B2E', size: 28, left: 255, top: 25,  delay: 800  }, // Emerald
  { color: '#4D96FF', light: '#90C0FF', dark: '#1040CC', size: 32, left: 100, top: 62,  delay: 200  }, // Sapphire
  { color: '#C77DFF', light: '#E0AAFF', dark: '#6B10CC', size: 35, left: 208, top: 52,  delay: 600  }, // Amethyst
  { color: '#FF9F1C', light: '#FFC870', dark: '#BB5500', size: 26, left: 276, top: 70,  delay: 1000 }, // Amber
  { color: '#00D2FF', light: '#80E9FF', dark: '#0088CC', size: 29, left: 140, top: 93,  delay: 300  }, // Aquamarine
];

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: ((i * 131 + 41) % 97) / 97 * SW,
  y: ((i * 107 + 23) % 97) / 97 * SH,
  size: 1 + (i % 3) * 0.6,
  opacity: 0.12 + ((i * 59) % 55) / 100,
}));

function GemShape({ color, light, dark, size }: {
  color: string; light: string; dark: string; size: number;
}) {
  return (
    <View style={{ width: size + 12, height: size + 12 }}>
      <LinearGradient
        colors={[light, color, dark]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: 5,
          position: 'absolute',
          top: 6,
          left: 6,
          transform: [{ rotate: '45deg' }],
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: 10,
          elevation: 8,
        }}
      />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    CinzelDecorative_900Black,
    Cinzel_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
  });

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

  if (!fontsLoaded) return null;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Static starfield */}
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
            backgroundColor: '#FFFFFF',
            opacity: s.opacity,
          }}
        />
      ))}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Gem cluster */}
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

        {/* Logo */}
        <View style={styles.logoSection}>
          <Text style={styles.title}>GemQuest</Text>
          <View style={styles.taglineRow}>
            <Text style={styles.tagline}>7 Gemas · 1 Mapa</Text>
          </View>
          <Text style={styles.taglineSub}>Tu leyenda empieza aquí</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <Feather name="mail" size={18} color="rgba(232,221,181,0.45)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="rgba(232,221,181,0.35)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color="rgba(232,221,181,0.45)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="rgba(232,221,181,0.35)"
              secureTextEntry
            />
          </View>

          <TouchableOpacity activeOpacity={0.82}>
            <LinearGradient
              colors={['#FFD700', '#D4900A']}
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
            <GoogleG />
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

function GoogleG() {
  return (
    <View style={styles.googleGWrap}>
      <Text style={[styles.googleGLetter, { color: '#4285F4' }]}>G</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#080B14',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 48,
  },

  // Gems
  gemsContainer: {
    width: SW,
    height: 160,
    position: 'relative',
  },

  // Logo
  logoSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 44,
  },
  title: {
    fontFamily: 'CinzelDecorative_900Black',
    fontSize: 34,
    color: '#FFD700',
    letterSpacing: 3,
    textShadowColor: 'rgba(255, 215, 0, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  taglineRow: {
    marginTop: 10,
  },
  tagline: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: '#E8DDB5',
    letterSpacing: 3.5,
    opacity: 0.85,
  },
  taglineSub: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: '#C8860A',
    letterSpacing: 3.5,
    marginTop: 5,
    textTransform: 'uppercase',
  },

  // Form
  form: {
    width: SW - 48,
    gap: 14,
  },
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: '#E8DDB5',
  },

  // Primary button
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
  primaryBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: '#0A0D1A',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(232,221,181,0.18)',
  },
  dividerLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: 'rgba(232,221,181,0.45)',
    marginHorizontal: 12,
  },

  // Google button
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    height: 54,
    borderWidth: 1,
    borderColor: 'rgba(232,221,181,0.14)',
    gap: 10,
  },
  googleGWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleGLetter: {
    fontSize: 17,
    fontWeight: '700',
  },
  googleBtnText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#E8DDB5',
    letterSpacing: 0.4,
  },

  // Sign-up link
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  signupText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: 'rgba(232,221,181,0.55)',
  },
  signupLink: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#FFD700',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(255,215,0,0.5)',
  },
});
