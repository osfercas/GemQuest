import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import VictoryScreen from '../screens/VictoryScreen';
import DevToolsScreen from '../screens/DevToolsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GemsScreen from '../screens/GemsScreen';

export type MainStackParamList = {
  Home: undefined;
  Map: { gameId: string };
  Victory: { gameId: string };
  DevTools: undefined;
  Profile: undefined;
  Settings: undefined;
  Gems: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Victory" component={VictoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Gems" component={GemsScreen} />
      <Stack.Screen name="DevTools" component={DevToolsScreen} />
    </Stack.Navigator>
  );
}
