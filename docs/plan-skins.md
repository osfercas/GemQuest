# Plan: Sistema de Skins/Temas — GemQuest

## Contexto

GemQuest tiene actualmente ~150+ valores de color hardcodeados distribuidos en 11+ archivos. Todos los estilos son independientes y usan los mismos colores oscuros/dorados sin ninguna centralización. El objetivo es:

1. Centralizar todos los tokens de estilo en un único sistema de temas
2. Crear 2 temas: **Oro Oscuro** (el actual) y **Anime Mágico** (claro, alegre, estilo anime)
3. Añadir una pantalla de Settings con selector visual de temas
4. Persistir la elección del usuario en AsyncStorage (`gq:settings`)

Solo colores y gradientes cambian; las fuentes (Cinzel/Nunito) se mantienen siempre iguales.

---

## Arquitectura

### Flujo de datos

```
AsyncStorage (gq:settings) 
  → ThemeProvider (carga al inicio, expone { theme, setTheme })
    → useTheme() hook (cualquier componente)
      → createStyles(theme) → StyleSheet.create(...)
```

### Estructura de tipos — `src/theme/index.ts`

```ts
interface Theme {
  id: string
  name: string
  // Backgrounds
  bgRoot: string          // fondo principal de pantallas
  bgCard: string          // fondo de tarjetas/paneles
  bgCardAlt: string       // fondo alternativo de tarjeta (variante más oscura/clara)
  bgInput: string         // fondo de inputs
  bgOverlay: string       // overlay de modales
  // Text
  textPrimary: string
  textSecondary: string   // texto con menor contraste
  textTertiary: string    // texto muy sutil
  textOnAccent: string    // texto sobre botones de acento
  // Accents
  accentPrimary: string   // color principal (era dorado)
  accentSecondary: string // acento degradado (era #C8860A)
  accentDark: string      // acento muy oscuro
  // Borders
  borderPrimary: string   // borde estándar
  borderSubtle: string    // borde muy sutil
  // Status
  colorError: string      // rojo/error/delete
  colorSuccess: string    // verde/éxito
  // Gradients (arrays para LinearGradient)
  gradientButton: readonly [string, string]
  gradientCard: readonly [string, string, string]
  gradientHero: readonly [string, string, string]
  gradientGlow: readonly [string, string]
  // Shadows
  shadowColor: string     // color de sombra en elementos
  shadowTextColor: string // color de sombra en texto (text shadow)
}
```

---

## Archivos a crear

### 1. `src/theme/index.ts`
- Define la interfaz `Theme`
- Define los dos temas: `mainQuestTheme` y `animeMagicoTheme`
- Exporta `THEMES: Record<string, Theme>` y `DEFAULT_THEME_ID = 'mainQuest'`

**Tema Oro Oscuro** — extrae valores actuales:
- `bgRoot: '#080B14'`, `accentPrimary: '#FFD700'`, `textPrimary: '#E8DDB5'`, etc.

**Tema Anime Mágico** — nuevo, claro y vibrante:
- `bgRoot: '#FEF3FF'` (lavanda muy claro)
- `bgCard: '#FFFFFF'`
- `accentPrimary: '#C850C0'` (magenta vibrante)
- `accentSecondary: '#4158D0'` (azul profundo)
- `textPrimary: '#2D0050'` (púrpura oscuro legible)
- `gradientButton: ['#C850C0', '#4158D0']`
- `colorError: '#FF5C8D'`, `colorSuccess: '#2ECC71'`

### 2. `src/theme/ThemeContext.tsx`
```tsx
const ThemeContext = createContext<{ theme: Theme; setTheme: (id: string) => Promise<void> }>
export function ThemeProvider({ children }) // carga tema de AsyncStorage al montar
export function useTheme(): { theme: Theme; setTheme }
```
- En el mount: llama `loadSettings()` para obtener el `themeId` persistido
- `setTheme(id)`: actualiza estado + llama `saveSettings({ themeId: id })`
- Muestra un splash/nada mientras carga (igual que font loading en App.tsx)

### 3. `src/storage/settingsStorage.ts`
```ts
const SETTINGS_KEY = 'gq:settings'
interface AppSettings { themeId: string }
export async function loadSettings(): Promise<AppSettings>
export async function saveSettings(s: AppSettings): Promise<void>
```
Patrón idéntico a `gameStorage.ts`.

### 4. `src/screens/SettingsScreen/index.tsx`
- Pantalla accesible desde el header de HomeScreen (icono ⚙️)
- Muestra tarjetas de tema con:
  - Preview visual: círculos de colores (bg + accent + text) 
  - Nombre del tema
  - Indicador de selección activa (borde resaltado o check)
- Al tocar un tema: `setTheme(id)` → cambio instantáneo, sin necesidad de guardar/confirmar
- Header con botón "Back" y título "Apariencia"

---

## Archivos a modificar

### 5. `App.tsx`
- Envolver toda la app en `<ThemeProvider>`
- Añadir `SettingsScreen` al stack navigator: `<Stack.Screen name="Settings" component={SettingsScreen} />`

### 6. `src/screens/HomeScreen/Header.tsx`
- Añadir un botón de icono ⚙️ (usando `Pressable`) en la esquina derecha del header
- `onPress` navega a la pantalla "Settings"

### 7. `src/screens/HomeScreen/styles.ts`
**Patrón de refactor** (aplica igual a TODOS los styles.ts):
```ts
// Antes
export const headerStyles = StyleSheet.create({ ... })

// Después
export const createHeaderStyles = (theme: Theme) => StyleSheet.create({ ... })
```
Cada función `createXxxStyles(theme)` reemplaza los valores hardcodeados por `theme.bgRoot`, `theme.accentPrimary`, etc.

### 8. `src/screens/HomeScreen/index.tsx` y sub-componentes
```tsx
const { theme } = useTheme()
const styles = useMemo(() => createStyles(theme), [theme])
```

### 9. `src/screens/MapScreen/styles.ts` y `index.tsx`
Mismo patrón. El mapa de Google Maps tiene su `customMapStyle` — añadir un array de estilos de mapa diferente para el tema anime (colores claros). El tema oscuro mantiene el `customMapStyle` existente.

### 10. `src/screens/VictoryScreen/styles.ts` y `index.tsx`
Mismo patrón.

### 11. `src/screens/LoginScreen.tsx`
Los estilos inline se extraen a un `createStyles(theme)` al final del archivo.

### 12. `src/screens/DevToolsScreen/index.tsx`
Mismo patrón (estilos inline al final → `createStyles(theme)`).

---

## Orden de implementación

1. `src/theme/index.ts` — tipos + dos temas completos
2. `src/storage/settingsStorage.ts` — persistencia
3. `src/theme/ThemeContext.tsx` — proveedor + hook
4. `App.tsx` — ThemeProvider + ruta SettingsScreen
5. Refactor de estilos en todos los screens (del más sencillo al más complejo):
   - VictoryScreen (más pequeño)
   - DevToolsScreen
   - LoginScreen
   - MapScreen
   - HomeScreen (más grande)
6. `SettingsScreen/index.tsx` — UI del selector
7. `HomeScreen/Header.tsx` — botón de acceso a Settings

---

## Verificación

- `expo start` → confirmar que el tema Oro Oscuro se ve igual al actual
- Ir a Settings → seleccionar "Anime Mágico" → todos los screens cambian al instante
- Cerrar y reabrir app → el tema elegido persiste
- Navegar a todas las pantallas (Login, Home, Map, Victory, DevTools) con cada tema
- Verificar que el mapa de Google Maps tiene estilos acordes al tema activo
