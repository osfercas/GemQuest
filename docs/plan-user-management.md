# Plan: Gestión de Usuarios — GemQuest

## Contexto

La `LoginScreen` existe visualmente pero no tiene lógica real: el botón "Iniciar la aventura" hace un `navigation.replace('Home')` directo. No hay sesión, no hay estado de usuario, no hay perfil. El objetivo es:

1. Conectar autenticación real (email/contraseña + Google)
2. Persistir la sesión entre reinicios de la app
3. Proteger rutas (redirigir a Login si no hay sesión)
4. Añadir pantalla de Registro
5. Añadir pantalla de Perfil con estadísticas del jugador

---

## Decisión de backend: Firebase Auth

**Por qué Firebase y no Supabase:**
- `expo-auth-session` + `@react-native-google-signin/google-signin` tienen soporte maduro para Firebase
- Firebase Auth incluye persistencia de sesión automática
- El SDK de Firebase para React Native funciona con Expo managed workflow (SDK 56)
- Supabase requiere más boilerplate para Google Sign-In en mobile

**Paquetes a instalar:**
```bash
npx expo install @react-native-firebase/app @react-native-firebase/auth
npx expo install @react-native-google-signin/google-signin
```

> Nota: `@react-native-firebase` requiere development build (no Expo Go). Ya tenemos `android/` en el repo, así que aplica.

---

## Arquitectura

### Flujo de autenticación

```
Firebase Auth SDK
  → AuthProvider (escucha onAuthStateChanged, expone { user, loading, signIn, signOut... })
    → NavigationContainer envuelto en AuthProvider
      → RootNavigator decide qué stack mostrar
```

### Navegación nueva

```
AuthStack (sin sesión)        MainStack (con sesión)
  ├── Login                     ├── Home
  ├── Register                  ├── Map
  └── ForgotPassword            ├── Victory
                                ├── Profile
                                └── DevTools (solo __DEV__)
```

El `RootNavigator` observa `user` del contexto auth y cambia de stack sin animar la transición.

---

## Estructura de archivos

```
src/
  services/
    auth.ts          ← wrappea Firebase Auth (signIn, signUp, signOut, signInWithGoogle)
  context/
    AuthContext.tsx  ← Provider + useAuth hook
  screens/
    LoginScreen.tsx         (existente, conectar)
    RegisterScreen/
      index.tsx
    ForgotPasswordScreen/
      index.tsx
    ProfileScreen/
      index.tsx
      styles.ts
  navigation/
    RootNavigator.tsx  ← nuevo, reemplaza la lógica de App.tsx
    AuthStack.tsx
    MainStack.tsx
```

---

## Detalle por fase

### Fase 1 — Configuración Firebase

1. Crear proyecto en Firebase Console
2. Habilitar Email/Password y Google como proveedores
3. Descargar `google-services.json` → `android/app/`
4. Añadir el plugin de Firebase en `app.json`:
   ```json
   "plugins": [
     "@react-native-firebase/app",
     "@react-native-google-signin/google-signin"
   ]
   ```
5. Instalar dependencias y hacer `npx expo run:android`

### Fase 2 — Capa de servicios (`src/services/auth.ts`)

```ts
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export async function signInWithEmail(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const { user } = await auth().createUserWithEmailAndPassword(email, password);
  await user.updateProfile({ displayName });
  return user;
}

export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices();
  const { data } = await GoogleSignin.signIn();
  const credential = auth.GoogleAuthProvider.credential(data!.idToken);
  return auth().signInWithCredential(credential);
}

export async function sendPasswordReset(email: string) {
  return auth().sendPasswordResetEmail(email);
}

export function signOut() {
  return auth().signOut();
}
```

### Fase 3 — AuthContext (`src/context/AuthContext.tsx`)

```ts
interface AuthContextValue {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Mientras loading, mostrar SplashScreen o null
}
```

### Fase 4 — RootNavigator (`src/navigation/RootNavigator.tsx`)

```tsx
export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;   // componente simple con el logo

  return user ? <MainStack /> : <AuthStack />;
}
```

`App.tsx` queda limpio: solo providers + `NavigationContainer` + `RootNavigator`.

### Fase 5 — Conectar LoginScreen

Cambios en `LoginScreen.tsx`:
- Añadir estado local `email`, `password`, `errorMsg`, `submitting`
- Llamar `signInWithEmail` del servicio al pulsar el botón
- Llamar `signInWithGoogle` al pulsar el botón de Google
- Mostrar error inline con `Animated` (ya tiene la infraestructura de animaciones)
- El botón "Crear cuenta" navega a `Register`

No hay que cambiar la navegación post-login: el `onAuthStateChanged` en `AuthProvider` activa automáticamente el `MainStack`.

### Fase 6 — RegisterScreen (`src/screens/RegisterScreen/`)

Campos: Nombre · Email · Contraseña · Confirmar contraseña

Validaciones locales antes de llamar Firebase:
- Email válido (regex simple)
- Password ≥ 8 caracteres
- Passwords coinciden

Mismo diseño visual que `LoginScreen` (fondo oscuro, gems flotantes, inputs dorados).

### Fase 7 — ForgotPasswordScreen

Pantalla mínima: solo campo email + botón. Llama `sendPasswordReset`. Muestra confirmación.

### Fase 8 — ProfileScreen (`src/screens/ProfileScreen/`)

**Secciones:**

```
┌─────────────────────────────────┐
│  Avatar  NombreUsuario          │
│          oscarfercas@gmail.com  │
│  [Editar perfil]                │
├─────────────────────────────────┤
│  ESTADÍSTICAS                   │
│  Partidas completadas: 12       │
│  Gemas recolectadas: 84         │
│  Tiempo de juego: ~4h           │
├─────────────────────────────────┤
│  CONFIGURACIÓN                  │
│  [Tema / Skins]  →              │
│  [Notificaciones] →             │
├─────────────────────────────────┤
│  [Cerrar sesión]                │
└─────────────────────────────────┘
```

Las estadísticas se derivan de `gameStorage.loadGames()` — no requieren backend.

**Avatar:** usar la `photoURL` de Firebase si existe (Google), o un avatar generado con las iniciales del usuario sobre un fondo dorado.

**Acceso desde HomeScreen:** añadir un icono de perfil en el `Header` del Home que navega a `Profile`.

---

## Cambios en App.tsx

```tsx
// Antes: Stack.Navigator con todas las rutas
// Después:
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

`RootStackParamList` se divide en `AuthStackParamList` y `MainStackParamList`.

---

## AsyncStorage — clave de usuario

Añadir a `gameStorage.ts` o crear `userStorage.ts`:

```
gq:user:stats  →  { gamesCompleted, gemsCollected, totalPlayTimeMs }
```

Los stats se actualizan al completar una partida (en `VictoryScreen`).

---

## Orden de implementación recomendado

| # | Tarea | Dependencias |
|---|-------|-------------|
| 1 | Configurar Firebase + instalar paquetes | — |
| 2 | `auth.ts` service | Firebase instalado |
| 3 | `AuthContext.tsx` + `RootNavigator` | auth.ts |
| 4 | Refactor `App.tsx` | AuthContext |
| 5 | Conectar `LoginScreen` | AuthContext |
| 6 | `RegisterScreen` | auth.ts |
| 7 | `ForgotPasswordScreen` | auth.ts |
| 8 | `ProfileScreen` + acceso desde Home | gameStorage |
| 9 | Actualizar stats en `VictoryScreen` | ProfileScreen |

---

## Lo que NO cambia

- El diseño visual de `LoginScreen` (solo se conecta la lógica)
- `gameStorage.ts` (solo se añade `userStorage.ts`)
- Las pantallas `Map`, `Victory`, `Home` (solo se protegen con la sesión)
- El sistema de temas (ver `plan-skins.md`) es independiente y puede implementarse en paralelo
