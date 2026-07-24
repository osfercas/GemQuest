import React from 'react'
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native'
import type { Theme } from '../theme'

interface Props {
  theme: Theme
}

export default function AppSplash({ theme }: Readonly<Props>) {
  return (
    <View style={styles.container}>
      <Image source={theme.splashImage} style={styles.background} resizeMode="cover" />
      <ActivityIndicator size="large" color={theme.accentPrimary} style={styles.indicator} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 64,
  },
})
