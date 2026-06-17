import AsyncStorage from '@react-native-async-storage/async-storage'
import { DEFAULT_THEME_ID } from '../theme'

const SETTINGS_KEY = 'gq:settings'

interface AppSettings {
  themeId: string
}

const DEFAULT_SETTINGS: AppSettings = { themeId: DEFAULT_THEME_ID }

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY)
  return raw ? (JSON.parse(raw) as AppSettings) : DEFAULT_SETTINGS
}

export async function saveSettings(s: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
}
