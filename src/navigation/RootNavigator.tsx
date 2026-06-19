import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import AppSplash from '../components/AppSplash';
import AuthStack from './AuthStack';
import MainStack from './MainStack';

// Firebase's auth check often resolves from cache in a handful of
// milliseconds, which would otherwise make the themed AppSplash flash by
// too fast to notice. Hold it for at least this long once the theme is known.
const MIN_SPLASH_MS = 1500;

export default function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { theme, themeReady } = useTheme();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Hide the native splash as soon as the theme is known, so the themed
  // AppSplash below (not the theme-agnostic native one) is what's visible
  // while we wait on the (potentially slower) Firebase auth check.
  useEffect(() => {
    if (!themeReady) return;
    SplashScreen.hideAsync();
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, [themeReady]);

  if (authLoading || !themeReady || !minTimeElapsed) {
    return <AppSplash theme={theme} />;
  }

  return user ? <MainStack /> : <AuthStack />;
}
