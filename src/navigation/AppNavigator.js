import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import FlashlightScreen from '../screens/FlashlightScreen';
import FoodCheckerScreen from '../screens/FoodCheckerScreen';
import HealthProfileScreen from '../screens/HealthProfileScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import MealSuggestionScreen from '../screens/MealSuggestionScreen';

const Tab = createBottomTabNavigator();
const NutritionStack = createNativeStackNavigator();

function NutritionStackNavigator() {
  return (
    <NutritionStack.Navigator screenOptions={{ headerShown: false }}>
      <NutritionStack.Screen name="FoodChecker" component={FoodCheckerScreen} />
      <NutritionStack.Screen name="Recommendations" component={RecommendationsScreen} />
    </NutritionStack.Navigator>
  );
}

function TabIcon({ emoji, focused }) {
  return (
    <View style={styles.tabIconWrap}>
      <Text style={[styles.emoji, focused && styles.emojiFocused]}>{emoji}</Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: Colors.accentGreen,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: -2,
            marginBottom: Platform.OS === 'ios' ? 0 : 6,
          },
          tabBarStyle: {
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            height: Platform.OS === 'ios' ? 88 : 65,
            paddingTop: 8,
            position: 'absolute',
            elevation: 0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Trang chủ',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Flashlight"
          component={FlashlightScreen}
          options={{
            tabBarLabel: 'Đèn Pin',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🔦" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Nutrition"
          component={NutritionStackNavigator}
          options={{
            tabBarLabel: 'Dinh Dưỡng',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🥗" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="MealSuggestion"
          component={MealSuggestionScreen}
          options={{
            tabBarLabel: 'Thực Đơn',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🍽️" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={HealthProfileScreen}
          options={{
            tabBarLabel: 'Hồ Sơ',
            tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 30,
  },
  emoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  emojiFocused: {
    fontSize: 24,
    opacity: 1,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accentGreen,
    marginTop: 2,
  },
});
