import { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GemVisual } from '../../components/GemVisual';
import { createFinishedRowStyles } from './styles';
import { Game } from './types';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  game: Game;
  onDelete: () => void;
}

function formatRadius(radius: number) {
  return radius < 1 ? `${radius * 1000} m` : `${radius} km`;
}

export default function FinishedGameRow({ game, onDelete }: Props) {
  const { theme } = useTheme();
  const s = useMemo(() => createFinishedRowStyles(theme), [theme]);
  const perfect = game.gemsFound === game.gemsTotal;

  return (
    <View style={s.row}>
      <View style={s.topRow}>
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
            {game.gemsFound}/{game.gemsTotal} {theme.termGems.toLowerCase()} · {formatRadius(game.radius)} · {game.date}
          </Text>
        </View>

        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }} activeOpacity={0.7}>
          <Feather name="trash-2" size={14} color={`${theme.colorError}ac`} />
        </TouchableOpacity>
      </View>

      <View style={s.gems}>
        {game.gems.map(name => (
          <GemVisual key={name} name={name} size={26} collected />
        ))}
      </View>
    </View>
  );
}
