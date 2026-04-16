import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export default function BMIIndicator({ bmi, category }) {
  if (!bmi || !category) return null;

  const colorMap = {
    green: Colors.trafficGreen,
    yellow: Colors.trafficYellow,
    red: Colors.trafficRed,
  };

  const color = colorMap[category.color] || Colors.textSecondary;

  // BMI scale: 15 to 35
  const minBMI = 15;
  const maxBMI = 35;
  const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
  const percentage = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Chỉ số BMI</Text>
        <View style={styles.bmiValue}>
          <Text style={[styles.value, { color }]}>{bmi}</Text>
          <Text style={[styles.category, { color }]}>{category.icon} {category.label}</Text>
        </View>
      </View>

      <View style={styles.barContainer}>
        {/* Background gradient segments */}
        <View style={styles.barBg}>
          <View style={[styles.segment, { flex: 17.5, backgroundColor: Colors.trafficYellow, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }]} />
          <View style={[styles.segment, { flex: 22.5, backgroundColor: Colors.trafficGreen }]} />
          <View style={[styles.segment, { flex: 10, backgroundColor: Colors.trafficYellow }]} />
          <View style={[styles.segment, { flex: 50, backgroundColor: Colors.trafficRed, borderTopRightRadius: 6, borderBottomRightRadius: 6 }]} />
        </View>

        {/* Pointer */}
        <View style={[styles.pointer, { left: `${percentage}%` }]}>
          <View style={[styles.pointerDot, { backgroundColor: color }]} />
        </View>
      </View>

      <View style={styles.scaleLabels}>
        <Text style={styles.scaleText}>15</Text>
        <Text style={styles.scaleText}>18.5</Text>
        <Text style={styles.scaleText}>23</Text>
        <Text style={styles.scaleText}>25</Text>
        <Text style={styles.scaleText}>35</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bmiValue: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
  },
  category: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  barContainer: {
    height: 12,
    position: 'relative',
    marginBottom: 8,
  },
  barBg: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  pointer: {
    position: 'absolute',
    top: -4,
    marginLeft: -10,
  },
  pointerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
