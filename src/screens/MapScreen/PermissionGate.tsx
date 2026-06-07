import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { permissionStyles as s } from './styles';

interface Props {
  onRequest: () => void;
}

export default function PermissionGate({ onRequest }: Props) {
  return (
    <View style={s.root}>
      <Feather name="map-pin" size={48} color="rgba(255,215,0,0.4)" />
      <Text style={s.title}>Ubicación necesaria</Text>
      <Text style={s.sub}>
        GemQuest necesita acceder a tu ubicación para colocar las gemas en el mapa y detectar cuándo estás cerca.
      </Text>
      <TouchableOpacity style={s.btn} activeOpacity={0.82} onPress={onRequest}>
        <LinearGradient colors={['#FFD700', '#D4900A']} style={s.btnGradient}>
          <Text style={s.btnText}>Conceder permiso</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
