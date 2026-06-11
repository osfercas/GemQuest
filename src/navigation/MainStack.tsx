import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import VictoryScreen from '../screens/VictoryScreen';
import DevToolsScreen from '../screens/DevToolsScreen';

export type MainStackParamList = {
  Home: undefined;
  Map: { gameId: string };
  Victory: { gameId: string };
  DevTools: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Victory" component={VictoryScreen} />
      {__DEV__ && <Stack.Screen name="DevTools" component={DevToolsScreen} />}
    </Stack.Navigator>
  );
}
