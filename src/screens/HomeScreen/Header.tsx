import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { headerStyles as s } from './styles';

interface Props {
  username?: string;
  onDevTools?: () => void;
}

export default function Header({ username = 'A', onDevTools }: Props) {
  return (
    <View style={s.container}>
      <View>
        <Text style={s.greeting}>Bienvenido de vuelta</Text>
        <Text style={s.title}>GemQuest</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {__DEV__ && onDevTools && (
          <TouchableOpacity onPress={onDevTools} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="terminal" size={16} color="rgba(232,221,181,0.35)" />
          </TouchableOpacity>
        )}
        <TouchableOpacity activeOpacity={0.75}>
          <LinearGradient colors={['#FFD700', '#C8860A']} style={s.avatar}>
            <Text style={s.avatarLetter}>{username[0].toUpperCase()}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
