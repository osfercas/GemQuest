import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GemShape, GEM_COLORS } from '../../components/GemShape';
import { createFinishedRowStyles } from './styles';
import { Game } from './types';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  game: Game;
}

function formatRadius(radius: number) {
  return radius < 1 ? `${radius * 1000} m` : `${radius} km`;
}

export default function FinishedGameRow({ game }: Props) {
  const { theme } = useTheme();
  const s = useMemo(() => createFinishedRowStyles(theme), [theme]);
  const perfect = game.gemsFound === game.gemsTotal;

  return (
    <TouchableOpacity style={s.row} activeOpacity={0.75}>
      <View style={[s.icon, perfect && s.iconPerfect]}>
        <Feather
          name={perfect ? 'award' : 'check'}
          size={16}
          color={perfect ? theme.accentPrimary : theme.textSecondary}
        />
      </View>

      <View style={s.info}>
        <Text style={s.name}>{game.name}</Text>
        <Text style={s.meta}>
          {game.gemsFound}/{game.gemsTotal} gemas · {formatRadius(game.radius)} · {game.date}
        </Text>
      </View>

      <View style={s.gems}>
        {game.gems.slice(0, 3).map(name => {
          const g = GEM_COLORS[name];
          return <GemShape key={name} color={g.color} light={g.light} dark={g.dark} size={10} />;
        })}
      </View>
    </TouchableOpacity>
  );
}
