import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { loadProfile } from '../utils/storage';
import { getHealthTips, HEALTH_CONDITIONS } from '../data/healthRules';
import { FOODS } from '../data/foods';
import { evaluateFood } from '../data/healthRules';

export default function RecommendationsScreen() {
  const [profile, setProfile] = useState(null);
  const [tips, setTips] = useState([]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(p => {
        setProfile(p);
        if (p?.conditions) {
          setTips(getHealthTips(p.conditions));
        }
      });
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  const getTopFoods = (level) => {
    if (!profile) return [];
    return FOODS
      .map(food => ({
        ...food,
        evaluation: evaluateFood(food, profile),
      }))
      .filter(f => f.evaluation.level === level)
      .slice(0, 8);
  };

  const greenFoods = getTopFoods('green');
  const redFoods = getTopFoods('red');

  if (!profile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.darkBg} />
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>Chưa có hồ sơ sức khỏe</Text>
        <Text style={styles.emptyDesc}>
          Hãy nhập hồ sơ sức khỏe của bạn {'\n'}để nhận gợi ý dinh dưỡng cá nhân hóa
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkBg} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <Text style={styles.title}>📊 Gợi Ý Cho Bạn</Text>
          <Text style={styles.subtitle}>
            Dựa trên hồ sơ sức khỏe của {profile.name}
          </Text>

          {/* Profile summary */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>BMI:</Text>
              <Text style={styles.profileValue}>{profile.bmi || 'N/A'}</Text>
            </View>
            {profile.conditions?.length > 0 && (
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Bệnh lý:</Text>
                <Text style={styles.profileValue}>
                  {profile.conditions.map(c => {
                    const cond = HEALTH_CONDITIONS.find(h => h.id === c);
                    return cond ? `${cond.icon} ${cond.name}` : c;
                  }).join(', ')}
                </Text>
              </View>
            )}
          </View>

          {/* Green foods */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🟢</Text>
              <View>
                <Text style={styles.sectionTitle}>Nên ăn</Text>
                <Text style={styles.sectionDesc}>Thực phẩm phù hợp với bạn</Text>
              </View>
            </View>
            <View style={styles.foodGrid}>
              {greenFoods.map(food => (
                <View key={food.id} style={[styles.miniCard, styles.miniCardGreen]}>
                  <Text style={styles.miniCardName}>{food.name}</Text>
                  <Text style={styles.miniCardCal}>{food.calories} kcal</Text>
                </View>
              ))}
              {greenFoods.length === 0 && (
                <Text style={styles.noData}>Không có dữ liệu</Text>
              )}
            </View>
          </View>

          {/* Red foods */}
          {redFoods.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🔴</Text>
                <View>
                  <Text style={styles.sectionTitle}>Nên tránh</Text>
                  <Text style={styles.sectionDesc}>Không phù hợp với sức khỏe của bạn</Text>
                </View>
              </View>
              <View style={styles.foodGrid}>
                {redFoods.map(food => (
                  <View key={food.id} style={[styles.miniCard, styles.miniCardRed]}>
                    <Text style={styles.miniCardName}>{food.name}</Text>
                    <Text style={styles.miniCardCal}>{food.calories} kcal</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Health tips */}
          {tips.map((tip, idx) => (
            <View key={idx} style={styles.tipCard}>
              <Text style={styles.tipTitle}>{tip.icon} {tip.title}</Text>

              <View style={styles.tipSection}>
                <Text style={styles.tipSectionTitle}>✅ Nên làm</Text>
                {tip.dos.map((d, i) => (
                  <View key={i} style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>{d}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.tipSection, { marginTop: 12 }]}>
                <Text style={[styles.tipSectionTitle, { color: Colors.accentRed }]}>❌ Nên tránh</Text>
                {tip.donts.map((d, i) => (
                  <View key={i} style={styles.tipItem}>
                    <Text style={[styles.tipBullet, { color: Colors.accentRed }]}>•</Text>
                    <Text style={styles.tipText}>{d}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {tips.length === 0 && profile.conditions?.length === 0 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>💡 Mẹo chung</Text>
              <View style={styles.tipSection}>
                <Text style={styles.tipSectionTitle}>✅ Nên làm</Text>
                {[
                  'Ăn đa dạng thực phẩm mỗi ngày',
                  'Uống đủ 2 lít nước mỗi ngày',
                  'Ăn nhiều rau xanh và trái cây',
                  'Hạn chế đồ chiên, đồ ăn nhanh',
                  'Chia nhỏ bữa ăn, ăn chậm nhai kỹ',
                ].map((d, i) => (
                  <View key={i} style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>{d}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

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
    marginBottom: 20,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  profileCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    marginRight: 8,
    minWidth: 60,
  },
  profileValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionDesc: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  miniCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  miniCardGreen: {
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderColor: 'rgba(0, 230, 118, 0.2)',
  },
  miniCardRed: {
    backgroundColor: 'rgba(255, 23, 68, 0.08)',
    borderColor: 'rgba(255, 23, 68, 0.2)',
  },
  miniCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  miniCardCal: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  noData: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  tipCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  tipSection: {},
  tipSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accentGreen,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 8,
  },
  tipBullet: {
    color: Colors.accentGreen,
    fontSize: 14,
    marginRight: 8,
    fontWeight: '700',
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
});
