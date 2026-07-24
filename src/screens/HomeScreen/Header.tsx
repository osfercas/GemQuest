import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { createHeaderStyles } from './styles';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  username?: string;
  onDevTools?: () => void;
  onSettings?: () => void;
  onProfile?: () => void;
}

export default function Header({ username = 'A', onDevTools, onSettings, onProfile }: Props) {
  const { theme } = useTheme();
  const s = useMemo(() => createHeaderStyles(theme), [theme]);

  return (
    <View style={s.container}>
      <View>
        <Text style={s.greeting}>Bienvenido a tu aventura</Text>
        <Text style={s.title}>{theme.termGems}Quest</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {onDevTools && (
          <TouchableOpacity onPress={onDevTools} activeOpacity={1} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="terminal" size={18} color={`${theme.textPrimary}80`} />
          </TouchableOpacity>
        )}
        <Pressable onPress={onSettings} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="settings" size={18} color={`${theme.textPrimary}80`} />
        </Pressable>
        <TouchableOpacity activeOpacity={0.75} onPress={onProfile}>
          <LinearGradient colors={theme.gradientButton} style={s.avatar}>
            <Text style={s.avatarLetter}>{username[0].toUpperCase()}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
