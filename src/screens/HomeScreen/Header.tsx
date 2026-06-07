import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { headerStyles as s } from './styles';

interface Props {
  username?: string;
}

export default function Header({ username = 'A' }: Props) {
  return (
    <View style={s.container}>
      <View>
        <Text style={s.greeting}>Bienvenido de vuelta</Text>
        <Text style={s.title}>GemQuest</Text>
      </View>
      <TouchableOpacity activeOpacity={0.75}>
        <LinearGradient colors={['#FFD700', '#C8860A']} style={s.avatar}>
          <Text style={s.avatarLetter}>{username[0].toUpperCase()}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
