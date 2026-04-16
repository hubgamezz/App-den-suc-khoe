import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import TrafficLight from './TrafficLight';

export default function FoodCard({ food, trafficLevel, onPress }) {
  const categoryIcons = {
    meat: '🥩',
    seafood: '🐟',
    vegetable: '🥬',
    fruit: '🍎',
    grain: '🌾',
    dairy: '🥛',
    drink: '🥤',
    other: '🍜',
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{categoryIcons[food.category] || '🍽️'}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{food.name}</Text>
        <Text style={styles.calories}>{food.calories} kcal / 100g</Text>
        <View style={styles.macros}>
          <Text style={styles.macro}>P: {food.protein}g</Text>
          <Text style={[styles.macro, styles.macroDivider]}>C: {food.carb}g</Text>
          <Text style={styles.macro}>F: {food.fat}g</Text>
        </View>
      </View>

      <View style={styles.trafficWrap}>
        <TrafficLight level={trafficLevel || 'green'} size="medium" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  calories: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  macros: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macro: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  macroDivider: {
    marginHorizontal: 6,
  },
  trafficWrap: {
    marginLeft: 8,
  },
});
