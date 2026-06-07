import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GemShape, GEM_COLORS } from '../../components/GemShape';
import { finishedRowStyles as s } from './styles';
import { Game } from './types';

interface Props {
  game: Game;
}

function formatRadius(radius: number) {
  return radius < 1 ? `${radius * 1000} m` : `${radius} km`;
}

export default function FinishedGameRow({ game }: Props) {
  const perfect = game.gemsFound === game.gemsTotal;

  return (
    <TouchableOpacity style={s.row} activeOpacity={0.75}>
      <View style={[s.icon, perfect && s.iconPerfect]}>
        <Feather
          name={perfect ? 'award' : 'check'}
          size={16}
          color={perfect ? '#FFD700' : 'rgba(232,221,181,0.5)'}
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
