import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { CinzelDecorative_900Black } from '@expo-google-fonts/cinzel-decorative';
import { Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { Nunito_400Regular, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import VictoryScreen from './src/screens/VictoryScreen';
import DevToolsScreen from './src/screens/DevToolsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ThemeProvider } from './src/theme/ThemeContext';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Map: { gameId: string };
  Victory: { gameId: string };
  DevTools: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    CinzelDecorative_900Black,
    Cinzel_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Map" component={MapScreen} />
              <Stack.Screen name="Victory" component={VictoryScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              {__DEV__ && <Stack.Screen name="DevTools" component={DevToolsScreen} />}
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
