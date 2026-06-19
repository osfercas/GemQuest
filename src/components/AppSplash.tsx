import React from 'react'
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native'
import type { Theme } from '../theme'

interface Props {
  theme: Theme
}

export default function AppSplash({ theme }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={theme.splashImage} style={styles.logo} resizeMode="contain" />
      </View>
      <ActivityIndicator size="large" color={theme.accentPrimary} style={styles.indicator} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#000000',
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  indicator: {
    marginTop: 24,
  },
})
