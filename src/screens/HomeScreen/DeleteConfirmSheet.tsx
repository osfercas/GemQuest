import React, { useMemo, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createDeleteSheetStyles } from './styles';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  gameName: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  bottomInset?: number;
}

export default function DeleteConfirmSheet({ gameName, onConfirm, onCancel, bottomInset = 0 }: Props) {
  const { theme } = useTheme();
  const s = useMemo(() => createDeleteSheetStyles(theme), [theme]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const visible = gameName !== null;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, tension: 65, friction: 11 }).start();
    }
  }, [visible]);

  const handleCancel = () => {
    Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(onCancel);
  };

  const handleConfirm = () => {
    Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(onConfirm);
  };

  const sheetTranslateY = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleCancel}>
      <Pressable style={s.overlay} onPress={handleCancel}>
        <Animated.View style={[s.sheet, { transform: [{ translateY: sheetTranslateY }], paddingBottom: 32 + bottomInset }]}>
          <Pressable onPress={() => {}}>
            <View style={s.handle} />
            <View style={s.iconWrap}>
              <Feather name="trash-2" size={24} color={theme.colorError} />
            </View>
            <Text style={s.title}>Eliminar partida</Text>
            <Text style={s.gameName}>{gameName}</Text>
            <Text style={s.sub}>Se perderá todo el progreso.{'\n'}Esta acción no se puede deshacer.</Text>
            <View style={s.footer}>
              <TouchableOpacity style={s.cancelBtn} activeOpacity={0.75} onPress={handleCancel}>
                <Text style={s.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.deleteBtn} activeOpacity={0.75} onPress={handleConfirm}>
                <Feather name="trash-2" size={14} color={theme.colorError} />
                <Text style={s.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
