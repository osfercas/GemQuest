import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
  Animated,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { wizardStyles as s } from './styles';
import { RADIUS_OPTIONS, WIZARD_STEPS } from './types';
import { generateId, upsertGame } from '../../storage/gameStorage';
import { GEM_NAMES } from '../MapScreen/types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onStart: (gameId: string) => void;
  bottomInset?: number;
}

export default function NewGameWizard({ visible, onClose, onStart, bottomInset = 0 }: Props) {
  const [step, setStep] = useState(0);
  const [gameName, setGameName] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(0.5);
  const slideAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setStep(0);
      setGameName('');
      setSelectedRadius(0.5);
      Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, tension: 65, friction: 11 }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start(onClose);
  };

  const canAdvance = step === 0 ? gameName.trim().length > 0 : true;

  const sheetTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Pressable style={s.overlay} onPress={handleClose}>
        <Animated.View style={[s.sheet, { transform: [{ translateY: sheetTranslateY }], paddingBottom: 36 + bottomInset }]}>
          <Pressable onPress={() => {}}>
            <View style={s.handle} />

            <View style={s.stepRow}>
              {Array.from({ length: WIZARD_STEPS }).map((_, i) => (
                <View key={i} style={[s.stepDot, i <= step && s.stepDotActive]} />
              ))}
            </View>

            {/* Paso 1 — Nombre */}
            {step === 0 && (
              <View style={s.stepContent}>
                <Text style={s.stepTitle}>Nombre de la partida</Text>
                <Text style={s.stepSub}>Dale un nombre épico a tu aventura</Text>
                <View style={s.inputWrap}>
                  <Feather name="edit-3" size={18} color="rgba(232,221,181,0.45)" style={{ marginRight: 12 }} />
                  <TextInput
                    style={s.input}
                    placeholder="Ej: Bosque encantado..."
                    placeholderTextColor="rgba(232,221,181,0.3)"
                    value={gameName}
                    onChangeText={setGameName}
                    autoFocus
                    maxLength={40}
                  />
                </View>
              </View>
            )}

            {/* Paso 2 — Radio */}
            {step === 1 && (
              <View style={s.stepContent}>
                <Text style={s.stepTitle}>Radio de búsqueda</Text>
                <Text style={s.stepSub}>Las gemas se distribuirán en este área</Text>
                <View style={s.radiusGrid}>
                  {RADIUS_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[s.radiusBtn, selectedRadius === opt.value && s.radiusBtnActive]}
                      activeOpacity={0.75}
                      onPress={() => setSelectedRadius(opt.value)}
                    >
                      {selectedRadius === opt.value && (
                        <LinearGradient
                          colors={['#FFD700', '#C8860A']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                      )}
                      <Feather
                        name="map-pin"
                        size={18}
                        color={selectedRadius === opt.value ? '#0A0D1A' : 'rgba(232,221,181,0.5)'}
                      />
                      <Text style={[s.radiusLabel, selectedRadius === opt.value && s.radiusLabelActive]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={s.footer}>
              {step > 0 && (
                <TouchableOpacity style={s.backBtn} activeOpacity={0.75} onPress={() => setStep(p => p - 1)}>
                  <Feather name="arrow-left" size={18} color="rgba(232,221,181,0.6)" />
                  <Text style={s.backBtnText}>Atrás</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[s.nextBtnWrap, step === 0 && { marginLeft: 'auto' }]}
                activeOpacity={canAdvance ? 0.82 : 1}
                onPress={() => {
                  if (!canAdvance) return;
                  if (step < WIZARD_STEPS - 1) setStep(p => p + 1);
                  else {
                    const id = generateId();
                    const game = {
                      id,
                      name: gameName.trim(),
                      radius: selectedRadius,
                      status: 'active' as const,
                      gemsFound: 0,
                      gemsTotal: GEM_NAMES.length,
                      date: new Date().toISOString().slice(0, 10),
                      gems: GEM_NAMES,
                    };
                    upsertGame(game).then(() => {
                      handleClose();
                      onStart(id);
                    });
                  }
                }}
              >
                <LinearGradient
                  colors={['#FFD700', '#D4900A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[s.nextBtn, !canAdvance && { opacity: 0.4, elevation: 0, shadowOpacity: 0 }]}
                >
                  <Text style={s.nextBtnText}>
                    {step < WIZARD_STEPS - 1 ? 'Siguiente' : '¡Empezar!'}
                  </Text>
                  <Feather name={step < WIZARD_STEPS - 1 ? 'arrow-right' : 'map'} size={16} color="#0A0D1A" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
