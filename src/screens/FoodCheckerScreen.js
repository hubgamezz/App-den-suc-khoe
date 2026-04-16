import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  Modal,
  ScrollView,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../theme/colors';
import FoodCard from '../components/FoodCard';
import TrafficLight from '../components/TrafficLight';
import { FOODS, FOOD_CATEGORIES } from '../data/foods';
import { evaluateFood } from '../data/healthRules';
import { loadProfile } from '../utils/storage';
import { addSearchHistory } from '../utils/storage';

export default function FoodCheckerScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(p => {
        setProfile(p);
        if (!p) {
          if (Platform.OS === 'web') {
            const go = window.confirm('Chưa có hồ sơ sức khỏe.\nBạn cần nhập hồ sơ sức khỏe trước để nhận tư vấn dinh dưỡng cá nhân hóa.\n\nNhấn OK để nhập hồ sơ ngay.');
            if (go) navigation.navigate('Profile');
          } else {
            Alert.alert(
              'Chưa có hồ sơ sức khỏe',
              'Bạn cần nhập hồ sơ sức khỏe trước để nhận tư vấn dinh dưỡng cá nhân hóa.',
              [
                {
                  text: 'Nhập hồ sơ ngay',
                  onPress: () => navigation.navigate('Profile'),
                },
              ]
            );
          }
        }
      });
    }, [navigation])
  );

  const filteredFoods = useMemo(() => {
    let result = FOODS;

    if (selectedCategory) {
      result = result.filter(f => f.category === selectedCategory);
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase().trim();
      result = result.filter(f =>
        f.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchText, selectedCategory]);

  const openFoodDetail = async (food) => {
    setSelectedFood(food);
    setModalVisible(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await addSearchHistory(food.id);
  };

  const getEvaluation = (food) => {
    if (!profile) return { level: 'green', reasons: ['Chưa có hồ sơ sức khỏe'] };
    return evaluateFood(food, profile);
  };

  const renderFoodItem = ({ item }) => {
    const evaluation = getEvaluation(item);
    return (
      <FoodCard
        food={item}
        trafficLevel={evaluation.level}
        onPress={() => openFoodDetail(item)}
      />
    );
  };

  const renderFoodDetail = () => {
    if (!selectedFood) return null;
    const evaluation = getEvaluation(selectedFood);

    const bgColor = {
      green: 'rgba(0, 230, 118, 0.08)',
      yellow: 'rgba(255, 214, 0, 0.08)',
      red: 'rgba(255, 23, 68, 0.08)',
    };

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={[styles.modalHeader, { backgroundColor: bgColor[evaluation.level] }]}>
                <Text style={styles.modalFoodName}>{selectedFood.name}</Text>
                <TrafficLight level={evaluation.level} size="large" />
              </View>

              {/* Description */}
              <Text style={styles.modalDesc}>{selectedFood.description}</Text>

              {/* Nutrition */}
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{selectedFood.calories}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, { color: '#64b5f6' }]}>
                    {selectedFood.protein}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, { color: '#ffb74d' }]}>
                    {selectedFood.carb}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Carb</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, { color: '#ef5350' }]}>
                    {selectedFood.fat}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>

              {/* Evaluation reasons */}
              <View style={styles.reasonsSection}>
                <Text style={styles.reasonsTitle}>
                  {profile ? '📋 Đánh giá cho bạn' : '⚠️ Chưa có hồ sơ'}
                </Text>
                {!profile && (
                  <Text style={styles.noProfileText}>
                    Hãy nhập hồ sơ sức khỏe để nhận đánh giá cá nhân hóa
                  </Text>
                )}
                {evaluation.reasons.map((reason, idx) => (
                  <View key={idx} style={styles.reasonItem}>
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>

              {/* Per 100g note */}
              <Text style={styles.perNote}>* Thông tin dinh dưỡng tính trên 100g</Text>
            </ScrollView>

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkBg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🥗 Tra Cứu Thực Phẩm</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm thực phẩm..."
            placeholderTextColor={Colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* No profile warning */}
        {!profile && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              ⚠️ Chưa có hồ sơ sức khỏe. Kết quả mặc định là xanh.
            </Text>
          </View>
        )}

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity
            style={[styles.categoryChip, !selectedCategory && styles.categoryActive]}
            onPress={() => { setSelectedCategory(null); Haptics.selectionAsync(); }}
          >
            <Text style={[styles.categoryText, !selectedCategory && styles.categoryActiveText]}>
              Tất cả
            </Text>
          </TouchableOpacity>
          {FOOD_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryActive]}
              onPress={() => {
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                Haptics.selectionAsync();
              }}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryActiveText]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Food List */}
      <FlatList
        data={filteredFoods}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>Không tìm thấy thực phẩm</Text>
          </View>
        }
      />

      {/* Food Detail Modal */}
      {renderFoodDetail()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  clearBtn: {
    fontSize: 16,
    color: Colors.textMuted,
    padding: 4,
  },
  warningBanner: {
    backgroundColor: 'rgba(255, 214, 0, 0.1)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 0, 0.2)',
  },
  warningText: {
    color: Colors.accentYellow,
    fontSize: 12,
    textAlign: 'center',
  },
  categoryScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  categoryActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderColor: Colors.accentGreen,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryActiveText: {
    color: Colors.accentGreen,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalFoodName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  modalDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  nutritionItem: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  nutritionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  reasonsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  reasonsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  noProfileText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  reasonItem: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  reasonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  perNote: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  closeButton: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
