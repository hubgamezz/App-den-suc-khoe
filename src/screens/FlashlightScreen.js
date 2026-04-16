import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../theme/colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const USE_NATIVE = Platform.OS !== 'web';

const YES_MESSAGE = 'BẠN KHÔNG ĐƯỢC ĂN THỊT GÀ! 🍗';
const NO_MESSAGE = 'BẠN ĂN ĐƯỢC THỊT GÀ! 😢';

// Đèn pin giống thật — đầu đèn ở trên, thân ở dưới
function FlashlightBody({ style }) {
  return (
    <Animated.View style={[styles.flashlightWrap, style]}>
      {/* Đầu đèn — mắt lens */}
      <View style={styles.flashHead}>
        <View style={styles.flashBezel}>
          <View style={styles.flashLens} />
        </View>
      </View>
      {/* Cổ đèn */}
      <View style={styles.flashNeck} />
      {/* Thân đèn — grip */}
      <View style={styles.flashBody}>
        <View style={styles.flashRidge} />
        <View style={styles.flashRidge} />
        <View style={styles.flashRidge} />
        <View style={styles.flashRidge} />
        <View style={styles.flashRidge} />
      </View>
      {/* Đuôi đèn */}
      <View style={styles.flashTail}>
        <View style={styles.flashTailBtn} />
      </View>
    </Animated.View>
  );
}

export default function FlashlightScreen() {
  const [phase, setPhase] = useState('idle');
  const [result, setResult] = useState(null);
  const [resultText, setResultText] = useState('');

  // Đèn pin: bắt đầu ngoài màn hình bên dưới, dọc đứng
  const flashY = useRef(new Animated.Value(SCREEN_H + 200)).current;
  const flashScale = useRef(new Animated.Value(1)).current;

  // Ánh sáng hình nón chiếu lên
  const beamOpacity = useRef(new Animated.Value(0)).current;
  const beamHeight = useRef(new Animated.Value(0)).current;
  const beamFlicker = useRef(new Animated.Value(0.85)).current;

  // Kết quả
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0.3)).current;

  // Nút glow
  const buttonGlow = useRef(new Animated.Value(0.3)).current;

  // Confetti
  const confettiAnims = useRef(
    Array.from({ length: 12 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  const flickerRef = useRef(null);

  // Idle glow loop
  React.useEffect(() => {
    if (phase === 'idle') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonGlow, {
            toValue: 0.8,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: USE_NATIVE,
          }),
          Animated.timing(buttonGlow, {
            toValue: 0.3,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: USE_NATIVE,
          }),
        ])
      ).start();
    }
  }, [phase]);

  const startFlashlight = useCallback(async () => {
    if (phase !== 'idle') return;
    setPhase('entering');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Reset
    flashY.setValue(SCREEN_H + 200);
    flashScale.setValue(1);
    beamOpacity.setValue(0);
    beamHeight.setValue(0);
    resultOpacity.setValue(0);
    resultScale.setValue(0.3);

    // STEP 1: Đèn trượt từ dưới lên — dọc đứng, đầu đèn hướng lên
    Animated.spring(flashY, {
      toValue: SCREEN_H * 0.52,
      friction: 7,
      tension: 40,
      useNativeDriver: USE_NATIVE,
    }).start(() => {
      setPhase('shining');

      // STEP 2: Bật đèn — ánh sáng hình nón chiếu lên trên
      Animated.parallel([
        Animated.timing(beamOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(beamHeight, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE,
        }),
      ]).start();

      // Nhấp nháy nhẹ
      flickerRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(beamFlicker, {
            toValue: 1,
            duration: 150,
            useNativeDriver: USE_NATIVE,
          }),
          Animated.timing(beamFlicker, {
            toValue: 0.75,
            duration: 150,
            useNativeDriver: USE_NATIVE,
          }),
          Animated.timing(beamFlicker, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: USE_NATIVE,
          }),
        ])
      );
      flickerRef.current.start();

      // STEP 3: Sau 1.5s hiện kết quả
      setTimeout(async () => {
        const isYes = Math.random() > 0.5;
        setResult(isYes);
        setResultText(isYes ? YES_MESSAGE : NO_MESSAGE);
        setPhase('reveal');

        await Haptics.notificationAsync(
          isYes
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Error
        );

        // Dừng nhấp nháy, giữ sáng
        if (flickerRef.current) flickerRef.current.stop();
        beamFlicker.setValue(0.6);

        Animated.parallel([
          Animated.spring(resultScale, {
            toValue: 1,
            friction: 4,
            tension: 50,
            useNativeDriver: USE_NATIVE,
          }),
          Animated.timing(resultOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: USE_NATIVE,
          }),
        ]).start();

        if (isYes) startConfetti();
      }, 1500);
    });
  }, [phase]);

  const startConfetti = () => {
    confettiAnims.forEach((anim, i) => {
      anim.x.setValue(0);
      anim.y.setValue(0);
      anim.opacity.setValue(1);
      anim.rotate.setValue(0);

      const angle = (i * 30) * (Math.PI / 180);
      const distance = 100 + Math.random() * 100;

      Animated.parallel([
        Animated.timing(anim.x, {
          toValue: Math.cos(angle) * distance,
          duration: 1000 + Math.random() * 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(anim.y, {
          toValue: Math.sin(angle) * distance + 60,
          duration: 1000 + Math.random() * 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 1200,
          delay: 400,
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(anim.rotate, {
          toValue: Math.random() * 4 - 2,
          duration: 1200,
          useNativeDriver: USE_NATIVE,
        }),
      ]).start();
    });
  };

  const resetGame = useCallback(() => {
    if (flickerRef.current) flickerRef.current.stop();
    setPhase('idle');
    setResult(null);
    setResultText('');
    flashY.setValue(SCREEN_H + 200);
    beamOpacity.setValue(0);
    beamHeight.setValue(0);
    beamFlicker.setValue(0.85);
    resultOpacity.setValue(0);
    resultScale.setValue(0.3);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const confettiEmojis = ['🎉', '🍗', '✨', '🐔', '⭐', '💛', '🔥', '👏', '💫', '🎊', '❤️', '🌟'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.darkOverlay} />

      {/* ===== Ánh sáng hình nón chiếu LÊN TRÊN từ đèn ===== */}
      {phase !== 'idle' && (
        <Animated.View
          style={[
            styles.beamContainer,
            {
              opacity: Animated.multiply(beamOpacity, beamFlicker),
              transform: [
                {
                  scaleY: beamHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Cone hẹp gần đèn */}
          <View style={styles.beamNarrow} />
          {/* Cone giữa */}
          <View style={styles.beamMid} />
          {/* Cone rộng xa đèn */}
          <View style={styles.beamWide} />
          {/* Glow lan tỏa */}
          <View style={styles.beamGlow} />
        </Animated.View>
      )}

      {/* ===== Đèn pin ở dưới, đầu hướng lên ===== */}
      {phase !== 'idle' && (
        <FlashlightBody
          style={{
            transform: [
              { translateY: flashY },
              { scale: flashScale },
            ],
          }}
        />
      )}

      {/* ===== Kết quả hiện giữa vùng sáng ===== */}
      {phase === 'reveal' && (
        <Animated.View
          style={[
            styles.resultContainer,
            {
              opacity: resultOpacity,
              transform: [{ scale: resultScale }],
            },
          ]}
        >
          <Text style={styles.resultEmoji}>{result ? '🍗' : '🚫'}</Text>
          <Text
            style={[
              styles.resultText,
              { color: result ? '#e0b0ff' : '#cf6679' },
            ]}
          >
            {resultText}
          </Text>

          {result &&
            confettiAnims.map((anim, i) => (
              <Animated.Text
                key={i}
                style={[
                  styles.confetti,
                  {
                    opacity: anim.opacity,
                    transform: [
                      { translateX: anim.x },
                      { translateY: anim.y },
                      {
                        rotate: anim.rotate.interpolate({
                          inputRange: [-2, 2],
                          outputRange: ['-360deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {confettiEmojis[i]}
              </Animated.Text>
            ))}
        </Animated.View>
      )}

      {/* ===== Controls ===== */}
      <View style={styles.controls}>
        {phase === 'idle' && (
          <>
            <Text style={styles.instructionText}>
              Nhấn để soi đèn tím 🔮
            </Text>
            <TouchableOpacity onPress={startFlashlight} activeOpacity={0.8}>
              <Animated.View
                style={[
                  styles.flashButton,
                  {
                    opacity: buttonGlow.interpolate({
                      inputRange: [0.3, 0.8],
                      outputRange: [0.7, 1],
                    }),
                  },
                ]}
              >
                <View style={styles.flashButtonInner}>
                  <Text style={styles.flashButtonIcon}>🔦</Text>
                  <Text style={styles.flashButtonText}>SOI ĐÈN</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </>
        )}

        {(phase === 'entering' || phase === 'shining') && (
          <Text style={styles.scanningText}>
            {phase === 'entering' ? 'Đèn đang tới... 🔦' : 'Đang chiếu sáng... 🔮'}
          </Text>
        )}

        {phase === 'reveal' && (
          <>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={resetGame}
              activeOpacity={0.7}
            >
              <Text style={styles.retryText}>🔄 SOI LẠI</Text>
            </TouchableOpacity>
            <Text style={styles.disclaimerText}>* Kết quả chỉ để giải trí</Text>
          </>
        )}
      </View>
    </View>
  );
}

const FLASH_CENTER_X = SCREEN_W / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050508',
  },

  // ===== Đèn pin (dọc đứng, đầu hướng lên) =====
  flashlightWrap: {
    position: 'absolute',
    left: FLASH_CENTER_X - 25,
    alignItems: 'center',
    zIndex: 10,
  },
  // Đầu đèn (phần lens — to hơn thân)
  flashHead: {
    width: 50,
    height: 28,
    backgroundColor: '#222',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#444',
  },
  flashBezel: {
    width: 38,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashLens: {
    width: 24,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ddd',
    borderWidth: 2,
    borderColor: '#777',
    shadowColor: '#b482ff',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  // Cổ đèn
  flashNeck: {
    width: 38,
    height: 10,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#3a3a3a',
  },
  // Thân đèn (grip)
  flashBody: {
    width: 34,
    height: 80,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  flashRidge: {
    width: 36,
    height: 4,
    backgroundColor: '#252525',
    borderRadius: 2,
  },
  // Đuôi đèn
  flashTail: {
    width: 30,
    height: 12,
    backgroundColor: '#181818',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashTailBtn: {
    width: 12,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
  },

  // ===== Ánh sáng hình nón — chiếu LÊN từ đèn =====
  beamContainer: {
    position: 'absolute',
    bottom: SCREEN_H * 0.48 + 130, // ngay trên đầu đèn
    left: 0,
    right: 0,
    height: SCREEN_H * 0.55,
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...(Platform.OS === 'web' ? { transformOrigin: 'bottom center' } : {}),
  },
  // Hẹp — gần đèn nhất
  beamNarrow: {
    position: 'absolute',
    bottom: 0,
    width: 50,
    height: '35%',
    backgroundColor: 'rgba(180, 140, 255, 0.25)',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  // Giữa
  beamMid: {
    position: 'absolute',
    bottom: 0,
    width: 140,
    height: '65%',
    backgroundColor: 'rgba(155, 110, 255, 0.12)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  // Rộng — xa đèn
  beamWide: {
    position: 'absolute',
    bottom: 0,
    width: 260,
    height: '90%',
    backgroundColor: 'rgba(130, 90, 230, 0.06)',
    borderTopLeftRadius: 160,
    borderTopRightRadius: 160,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  // Glow mờ lan tỏa
  beamGlow: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_W * 0.95,
    height: '100%',
    backgroundColor: 'rgba(110, 70, 200, 0.03)',
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
  },

  // ===== Kết quả =====
  resultContainer: {
    position: 'absolute',
    top: SCREEN_H * 0.15,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  resultEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
    paddingHorizontal: 30,
    textShadowColor: 'rgba(180, 130, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
  confetti: {
    position: 'absolute',
    fontSize: 24,
  },

  // ===== Controls =====
  controls: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 30,
  },
  instructionText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  flashButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 25,
    elevation: 12,
  },
  flashButtonInner: {
    alignItems: 'center',
  },
  flashButtonIcon: {
    fontSize: 36,
    marginBottom: 4,
  },
  flashButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  scanningText: {
    color: '#bb86fc',
    fontSize: 20,
    fontWeight: '600',
    textShadowColor: '#bb86fc',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  retryButton: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  retryText: {
    color: '#bb86fc',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  disclaimerText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
    marginTop: 16,
    fontStyle: 'italic',
  },
});
