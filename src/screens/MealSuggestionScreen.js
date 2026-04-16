import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../theme/colors';
import { FOODS } from '../data/foods';
import { evaluateFood } from '../data/healthRules';
import { loadProfile } from '../utils/storage';

// Cấu trúc bữa ăn
const MEAL_TYPES = [
  { id: 'breakfast', name: 'Bữa sáng', icon: '🌅', time: '6:30 - 8:00' },
  { id: 'lunch', name: 'Bữa trưa', icon: '☀️', time: '11:30 - 13:00' },
  { id: 'dinner', name: 'Bữa tối', icon: '🌙', time: '18:00 - 19:30' },
];

const DAY_NAMES = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

// Cấu trúc dinh dưỡng cân bằng cho từng bữa
// Mỗi slot: [categories[], minCal, maxCal] — đảm bảo đa dạng + cân bằng calo
const MEAL_SLOTS = {
  breakfast: [
    { categories: ['grain'],          minCal: 100, maxCal: 400 },  // Tinh bột
    { categories: ['dairy', 'fruit'], minCal: 30,  maxCal: 200 },  // Sữa/trái cây
    { categories: ['fruit', 'drink'], minCal: 20,  maxCal: 150 },  // Trái cây/đồ uống
  ],
  lunch: [
    { categories: ['meat', 'seafood'], minCal: 90,  maxCal: 280 }, // Protein vừa
    { categories: ['vegetable'],       minCal: 10,  maxCal: 200 }, // Rau củ
    { categories: ['grain'],           minCal: 100, maxCal: 400 }, // Tinh bột
  ],
  dinner: [
    { categories: ['meat', 'seafood'], minCal: 80,  maxCal: 250 }, // Protein nhẹ
    { categories: ['vegetable'],       minCal: 10,  maxCal: 200 }, // Rau củ
    { categories: ['fruit', 'vegetable'], minCal: 10, maxCal: 150 }, // Rau/trái cây nhẹ
  ],
};

// Shuffle mảng (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Lọc thực phẩm an toàn (không đỏ) cho profile
function getSafeFoods(profile) {
  return FOODS.filter(food => {
    if (!profile) return true;
    return evaluateFood(food, profile).level !== 'red';
  });
}

// Chọn 1 món từ nhóm category, ưu tiên green + trong khoảng calo hợp lý
function pickFromSlot(slot, safeFoods, usedIds, profile) {
  const { categories, minCal, maxCal } = slot;

  const available = safeFoods.filter(
    f => categories.includes(f.category) && !usedIds.has(f.id)
  );
  if (available.length === 0) return null;

  // Ưu tiên green
  const greens = available.filter(f => {
    if (!profile) return true;
    return evaluateFood(f, profile).level === 'green';
  });

  const pool = greens.length > 0 ? greens : available;

  // Lọc theo khoảng calo hợp lý
  const inRange = pool.filter(f => f.calories >= minCal && f.calories <= maxCal);

  // Nếu có đủ trong khoảng → chọn từ đó, không thì lấy gần nhất
  const finalPool = inRange.length > 0 ? inRange : pool;
  const pick = shuffle(finalPool)[0];
  if (pick) usedIds.add(pick.id);
  return pick;
}

// Tạo gợi ý cho 1 bữa ăn — đảm bảo mỗi slot 1 nhóm khác nhau + calo cân bằng
function suggestMeal(mealType, profile, usedIds, safeFoods) {
  const slots = MEAL_SLOTS[mealType];
  const picked = [];

  for (const slot of slots) {
    const food = pickFromSlot(slot, safeFoods, usedIds, profile);
    if (food) picked.push(food);
  }

  return picked;
}

// Tạo gợi ý cho 1 ngày
function suggestDay(profile, usedIds, safeFoods) {
  return {
    breakfast: suggestMeal('breakfast', profile, usedIds, safeFoods),
    lunch: suggestMeal('lunch', profile, usedIds, safeFoods),
    dinner: suggestMeal('dinner', profile, usedIds, safeFoods),
  };
}

// Tạo gợi ý cho cả tuần — mỗi ngày reset usedIds để tránh hết thực phẩm
function suggestWeek(profile) {
  const safeFoods = getSafeFoods(profile);
  return DAY_NAMES.map(day => {
    const dailyUsedIds = new Set();
    return {
      day,
      meals: suggestDay(profile, dailyUsedIds, safeFoods),
    };
  });
}

// Tính tổng calo 1 ngày
function calcDayCalories(dayMeals) {
  let total = 0;
  ['breakfast', 'lunch', 'dinner'].forEach(meal => {
    dayMeals[meal]?.forEach(f => { total += f.calories; });
  });
  return total;
}

export default function MealSuggestionScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('today'); // 'today' | 'week'
  const [todayMeals, setTodayMeals] = useState(null);
  const [weekMeals, setWeekMeals] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const generateSuggestions = useCallback((p) => {
    const safeFoods = getSafeFoods(p);
    const usedIds = new Set();
    setTodayMeals(suggestDay(p, usedIds, safeFoods));
    setWeekMeals(suggestWeek(p));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(p => {
        setProfile(p);
        if (!p) {
          if (Platform.OS === 'web') {
            const go = window.confirm('Chưa có hồ sơ sức khỏe.\nBạn cần nhập hồ sơ để nhận gợi ý phù hợp.\n\nNhấn OK để nhập hồ sơ.');
            if (go) navigation.navigate('Profile');
          } else {
            Alert.alert(
              'Chưa có hồ sơ sức khỏe',
              'Bạn cần nhập hồ sơ sức khỏe để nhận gợi ý món ăn phù hợp.',
              [{ text: 'Nhập hồ sơ ngay', onPress: () => navigation.navigate('Profile') }]
            );
          }
        } else {
          generateSuggestions(p);
        }
      });
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, [navigation, generateSuggestions])
  );

  const handleRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    generateSuggestions(profile);
  };

  const getLevelColor = (food) => {
    if (!profile) return Colors.accentGreen;
    const eval_ = evaluateFood(food, profile);
    if (eval_.level === 'green') return Colors.accentGreen;
    if (eval_.level === 'yellow') return Colors.accentYellow;
    return Colors.accentRed;
  };

  const getLevelBg = (food) => {
    if (!profile) return 'rgba(0, 230, 118, 0.08)';
    const eval_ = evaluateFood(food, profile);
    if (eval_.level === 'green') return 'rgba(0, 230, 118, 0.08)';
    if (eval_.level === 'yellow') return 'rgba(255, 214, 0, 0.08)';
    return 'rgba(255, 23, 68, 0.08)';
  };

  // ===== Render bữa ăn =====
  const renderMealSection = (mealType, foods) => {
    const meal = MEAL_TYPES.find(m => m.id === mealType);
    if (!foods || foods.length === 0) return null;

    return (
      <View key={mealType} style={styles.mealSection}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealIcon}>{meal.icon}</Text>
          <View>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealTime}>{meal.time}</Text>
          </View>
        </View>
        <View style={styles.foodsList}>
          {foods.map(food => (
            <View
              key={food.id}
              style={[styles.foodItem, { backgroundColor: getLevelBg(food), borderColor: getLevelColor(food) + '33' }]}
            >
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodDesc}>{food.description}</Text>
              </View>
              <View style={styles.foodStats}>
                <Text style={[styles.foodCal, { color: getLevelColor(food) }]}>
                  {food.calories}
                </Text>
                <Text style={styles.foodCalLabel}>kcal</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // ===== Render ngày hôm nay =====
  const renderToday = () => {
    if (!todayMeals) return null;
    const totalCal = calcDayCalories(todayMeals);

    return (
      <View>
        {/* Tổng quan */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Tổng quan hôm nay</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalCal}</Text>
              <Text style={styles.summaryLabel}>kcal ước tính</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>3</Text>
              <Text style={styles.summaryLabel}>bữa ăn</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {todayMeals.breakfast.length + todayMeals.lunch.length + todayMeals.dinner.length}
              </Text>
              <Text style={styles.summaryLabel}>nguyên liệu</Text>
            </View>
          </View>
        </View>

        {renderMealSection('breakfast', todayMeals.breakfast)}
        {renderMealSection('lunch', todayMeals.lunch)}
        {renderMealSection('dinner', todayMeals.dinner)}
      </View>
    );
  };

  // ===== Render tuần =====
  const renderWeek = () => {
    if (!weekMeals) return null;

    return (
      <View>
        {weekMeals.map((dayData, idx) => {
          const totalCal = calcDayCalories(dayData.meals);
          return (
            <View key={idx} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{dayData.day}</Text>
                <Text style={styles.dayCal}>{totalCal} kcal</Text>
              </View>

              {MEAL_TYPES.map(meal => {
                const foods = dayData.meals[meal.id];
                if (!foods || foods.length === 0) return null;
                return (
                  <View key={meal.id} style={styles.dayMealRow}>
                    <Text style={styles.dayMealIcon}>{meal.icon}</Text>
                    <Text style={styles.dayMealName}>{meal.name}:</Text>
                    <Text style={styles.dayMealFoods} numberOfLines={1}>
                      {foods.map(f => f.name).join(', ')}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  if (!profile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.darkBg} />
        <Text style={styles.emptyEmoji}>🍽️</Text>
        <Text style={styles.emptyTitle}>Chưa có hồ sơ sức khỏe</Text>
        <Text style={styles.emptyDesc}>
          Hãy nhập hồ sơ sức khỏe{'\n'}để nhận gợi ý món ăn phù hợp
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkBg} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <Text style={styles.title}>🍽️ Gợi Ý Món Ăn</Text>
          <Text style={styles.subtitle}>
            Dành riêng cho {profile.name} • Phù hợp sức khỏe
          </Text>

          {/* Tab chọn ngày/tuần */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'today' && styles.tabActive]}
              onPress={() => { setTab('today'); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.tabText, tab === 'today' && styles.tabActiveText]}>
                📅 Hôm nay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'week' && styles.tabActive]}
              onPress={() => { setTab('week'); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.tabText, tab === 'week' && styles.tabActiveText]}>
                🗓️ Cả tuần
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nút đổi gợi ý */}
          <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
            <Text style={styles.refreshText}>🔄 Đổi gợi ý khác</Text>
          </TouchableOpacity>

          {/* Nội dung */}
          {tab === 'today' ? renderToday() : renderWeek()}

          {/* Ghi chú */}
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>💡 Lưu ý</Text>
            <Text style={styles.noteText}>
              • Gợi ý dựa trên hồ sơ sức khỏe và bệnh lý của bạn{'\n'}
              • Lượng calories tính trên 100g mỗi nguyên liệu{'\n'}
              • Thực đơn chỉ mang tính tham khảo, không thay thế tư vấn bác sĩ{'\n'}
              • Nhấn "Đổi gợi ý khác" để xem thực đơn mới
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20, fontWeight: '700', color: Colors.textPrimary,
    marginBottom: 8, textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 15, color: Colors.textMuted, textAlign: 'center', lineHeight: 22,
  },

  // ===== Tabs =====
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderColor: Colors.accentGreen,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  tabActiveText: {
    color: Colors.accentGreen,
  },

  // ===== Refresh =====
  refreshBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  refreshText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // ===== Summary =====
  summaryCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.accentGreen,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // ===== Meal Section =====
  mealSection: {
    marginBottom: 24,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  mealIcon: {
    fontSize: 28,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  mealTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  foodsList: {
    gap: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  foodDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  foodStats: {
    alignItems: 'center',
    marginLeft: 12,
  },
  foodCal: {
    fontSize: 18,
    fontWeight: '800',
  },
  foodCalLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // ===== Week View =====
  dayCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dayName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dayCal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accentGreen,
  },
  dayMealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    gap: 6,
  },
  dayMealIcon: {
    fontSize: 16,
  },
  dayMealName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    minWidth: 60,
  },
  dayMealFoods: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
  },

  // ===== Note =====
  noteCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
  },
});
