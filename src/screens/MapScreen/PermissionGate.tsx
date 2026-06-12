import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { createPermissionStyles } from './styles';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  onRequest: () => void;
}

export default function PermissionGate({ onRequest }: Props) {
  const { theme } = useTheme();
  const s = useMemo(() => createPermissionStyles(theme), [theme]);

  return (
    <View style={s.root}>
      <Feather name="map-pin" size={48} color={`${theme.accentPrimary}66`} />
      <Text style={s.title}>Ubicación necesaria</Text>
      <Text style={s.sub}>
        GemQuest necesita acceder a tu ubicación para colocar las gemas en el mapa y detectar cuándo estás cerca.
      </Text>
      <TouchableOpacity style={s.btn} activeOpacity={0.82} onPress={onRequest}>
        <LinearGradient colors={theme.gradientButton} style={s.btnGradient}>
          <Text style={s.btnText}>Conceder permiso</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
