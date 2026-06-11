import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainStack from './MainStack';

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return user ? <MainStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#080B14',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
