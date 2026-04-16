import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const card1Anim = React.useRef(new Animated.Value(0)).current;
  const card2Anim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(150, [
        Animated.spring(card1Anim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(card2Anim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkBg} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.greeting}>Xin chào! 👋</Text>
          <Text style={styles.heroTitle}>Đèn Sức Khỏe</Text>
          <Text style={styles.subtitle}>
            Khám phá sức khỏe dinh dưỡng của bạn
          </Text>
        </Animated.View>

        {/* Feature Card 1: Đèn Pin */}
        <Animated.View
          style={{
            opacity: card1Anim,
            transform: [
              {
                scale: card1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Flashlight')}
          >
            <LinearGradient
              colors={['#1a1a2e', '#2d1b4e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureCard}
            >
              <View style={styles.featureIconWrap}>
                <Text style={styles.featureIcon}>🔦</Text>
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Đèn Pin Vui Vẻ</Text>
                <Text style={styles.featureDesc}>
                  Soi đèn xem bạn có thích ăn thịt gà không! 🍗
                </Text>
              </View>
              <View style={styles.arrowWrap}>
                <Text style={styles.arrow}>▸</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Feature Card 2: Dinh Dưỡng */}
        <Animated.View
          style={{
            opacity: card2Anim,
            transform: [
              {
                scale: card2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Nutrition')}
          >
            <LinearGradient
              colors={['#1a2e1a', '#1b4e2d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureCard}
            >
              <View style={styles.featureIconWrap}>
                <Text style={styles.featureIcon}>🥗</Text>
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Tư Vấn Dinh Dưỡng</Text>
                <Text style={styles.featureDesc}>
                  Kiểm tra thực phẩm phù hợp sức khỏe của bạn
                </Text>
              </View>
              <View style={styles.arrowWrap}>
                <Text style={styles.arrow}>▸</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View
          style={[
            styles.quickStats,
            {
              opacity: card2Anim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Tính năng</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🚦</Text>
              <Text style={styles.statLabel}>Đèn tín hiệu</Text>
              <Text style={styles.statDesc}>Xanh / Vàng / Đỏ</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>📊</Text>
              <Text style={styles.statLabel}>60+ thực phẩm</Text>
              <Text style={styles.statDesc}>Database VN</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>💊</Text>
              <Text style={styles.statLabel}>7 bệnh lý</Text>
              <Text style={styles.statDesc}>Cá nhân hóa</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>📱</Text>
              <Text style={styles.statLabel}>BMI</Text>
              <Text style={styles.statDesc}>Tính tự động</Text>
            </View>
          </View>
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  featureIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  arrowWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  arrow: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  quickStats: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statDesc: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
