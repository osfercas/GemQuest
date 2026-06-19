import React, { createContext, useContext, useEffect, useState } from 'react'
import { type Theme, THEMES, DEFAULT_THEME_ID } from './index'
import { loadSettings, saveSettings } from '../storage/settingsStorage'

interface ThemeContextValue {
  theme: Theme
  themeReady: boolean
  setTheme: (id: string) => Promise<void>
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES[DEFAULT_THEME_ID],
  themeReady: false,
  setTheme: async () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(THEMES[DEFAULT_THEME_ID])
  const [themeReady, setThemeReady] = useState(false)

  useEffect(() => {
    loadSettings().then(settings => {
      setThemeState(THEMES[settings.themeId] ?? THEMES[DEFAULT_THEME_ID])
      setThemeReady(true)
    })
  }, [])

  const setTheme = async (id: string) => {
    const next = THEMES[id] ?? THEMES[DEFAULT_THEME_ID]
    setThemeState(next)
    await saveSettings({ themeId: next.id })
  }

  return (
    <ThemeContext.Provider value={{ theme, themeReady, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
