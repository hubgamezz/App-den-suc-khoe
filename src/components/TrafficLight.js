import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';

export default function TrafficLight({ level, size = 'medium', animated = true }) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated]);

  const sizes = {
    small: { dot: 12, glow: 20, fontSize: 11 },
    medium: { dot: 20, glow: 32, fontSize: 13 },
    large: { dot: 32, glow: 48, fontSize: 16 },
  };

  const s = sizes[size] || sizes.medium;

  const colorMap = {
    green: Colors.trafficGreen,
    yellow: Colors.trafficYellow,
    red: Colors.trafficRed,
  };

  const labelMap = {
    green: 'Nên ăn',
    yellow: 'Vừa phải',
    red: 'Hạn chế',
  };

  const color = colorMap[level] || colorMap.green;
  const label = labelMap[level] || '';

  return (
    <View style={styles.container}>
      <View style={[styles.glowWrap, { width: s.glow, height: s.glow }]}>
        <View
          style={[
            styles.glow,
            {
              width: s.glow,
              height: s.glow,
              borderRadius: s.glow / 2,
              backgroundColor: color,
              opacity: 0.2,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: s.dot,
              height: s.dot,
              borderRadius: s.dot / 2,
              backgroundColor: color,
              transform: [{ scale: animated ? pulseAnim : 1 }],
            },
          ]}
        />
      </View>
      {size !== 'small' && (
        <Text style={[styles.label, { fontSize: s.fontSize, color }]}>{label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  glowWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
  },
  dot: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
