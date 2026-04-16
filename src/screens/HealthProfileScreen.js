import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../theme/colors';
import BMIIndicator from '../components/BMIIndicator';
import { HEALTH_CONDITIONS, HEALTH_GOALS, ALLERGIES, calculateBMI, getBMICategory } from '../data/healthRules';
import { saveProfile, loadProfile } from '../utils/storage';

export default function HealthProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [conditions, setConditions] = useState([]);
  const [goal, setGoal] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [saved, setSaved] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadExistingProfile();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadExistingProfile = async () => {
    const profile = await loadProfile();
    if (profile) {
      setName(profile.name || '');
      setAge(profile.age?.toString() || '');
      setGender(profile.gender || '');
      setHeight(profile.height?.toString() || '');
      setWeight(profile.weight?.toString() || '');
      setConditions(profile.conditions || []);
      setGoal(profile.goal || '');
      setAllergies(profile.allergies || []);
      setSaved(true);
    }
  };

  const bmi = calculateBMI(parseFloat(height), parseFloat(weight));
  const bmiCategory = getBMICategory(bmi);

  const toggleCondition = (id) => {
    setConditions(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
    Haptics.selectionAsync();
  };

  const toggleAllergy = (id) => {
    setAllergies(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
    Haptics.selectionAsync();
  };

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên của bạn');
      return;
    }
    if (!height || !weight) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập chiều cao và cân nặng');
      return;
    }

    const profile = {
      name: name.trim(),
      age: parseInt(age) || null,
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      bmi,
      conditions,
      goal,
      allergies,
      updatedAt: new Date().toISOString(),
    };

    const success = await saveProfile(profile);
    if (success) {
      setSaved(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Đã lưu! ✅', 'Hồ sơ sức khỏe của bạn đã được cập nhật', [
        { text: 'OK' },
        { text: 'Tra cứu thực phẩm', onPress: () => navigation.navigate('Nutrition') },
      ]);
    } else {
      Alert.alert('Lỗi', 'Không thể lưu hồ sơ. Vui lòng thử lại.');
    }
  }, [name, age, gender, height, weight, bmi, conditions, goal, allergies, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkBg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Header */}
            <Text style={styles.title}>👤 Hồ Sơ Sức Khỏe</Text>
            <Text style={styles.subtitle}>
              Nhập thông tin để nhận tư vấn dinh dưỡng cá nhân hóa
            </Text>

            {/* Basic Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

              <Text style={styles.label}>Tên</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên của bạn"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Tuổi</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="VD: 25"
                    placeholderTextColor={Colors.textMuted}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Giới tính</Text>
                  <View style={styles.genderRow}>
                    <TouchableOpacity
                      style={[styles.genderBtn, gender === 'male' && styles.genderActive]}
                      onPress={() => { setGender('male'); Haptics.selectionAsync(); }}
                    >
                      <Text style={[styles.genderText, gender === 'male' && styles.genderActiveText]}>
                        👨 Nam
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderBtn, gender === 'female' && styles.genderActive]}
                      onPress={() => { setGender('female'); Haptics.selectionAsync(); }}
                    >
                      <Text style={[styles.genderText, gender === 'female' && styles.genderActiveText]}>
                        👩 Nữ
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Chiều cao (cm)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="VD: 170"
                    placeholderTextColor={Colors.textMuted}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Cân nặng (kg)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="VD: 65"
                    placeholderTextColor={Colors.textMuted}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* BMI */}
              {bmi && bmiCategory && (
                <View style={styles.bmiWrap}>
                  <BMIIndicator bmi={bmi} category={bmiCategory} />
                </View>
              )}
            </View>

            {/* Health Conditions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tình trạng sức khỏe</Text>
              <Text style={styles.sectionDesc}>Chọn các vấn đề sức khỏe bạn đang gặp</Text>

              <View style={styles.chipGrid}>
                {HEALTH_CONDITIONS.map(condition => (
                  <TouchableOpacity
                    key={condition.id}
                    style={[
                      styles.chip,
                      conditions.includes(condition.id) && styles.chipActive,
                    ]}
                    onPress={() => toggleCondition(condition.id)}
                  >
                    <Text style={styles.chipIcon}>{condition.icon}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        conditions.includes(condition.id) && styles.chipActiveText,
                      ]}
                    >
                      {condition.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Goal */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mục tiêu dinh dưỡng</Text>

              <View style={styles.chipGrid}>
                {HEALTH_GOALS.map(g => (
                  <TouchableOpacity
                    key={g.id}
                    style={[
                      styles.chip,
                      goal === g.id && styles.chipActiveGoal,
                    ]}
                    onPress={() => { setGoal(g.id); Haptics.selectionAsync(); }}
                  >
                    <Text style={styles.chipIcon}>{g.icon}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        goal === g.id && styles.chipActiveGoalText,
                      ]}
                    >
                      {g.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Allergies */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dị ứng thực phẩm</Text>

              <View style={styles.chipGrid}>
                {ALLERGIES.map(allergy => (
                  <TouchableOpacity
                    key={allergy.id}
                    style={[
                      styles.chip,
                      allergies.includes(allergy.id) && styles.chipActiveRed,
                    ]}
                    onPress={() => toggleAllergy(allergy.id)}
                  >
                    <Text style={styles.chipIcon}>{allergy.icon}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        allergies.includes(allergy.id) && styles.chipActiveRedText,
                      ]}
                    >
                      {allergy.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {saved ? '✅ Cập nhật hồ sơ' : '💾 Lưu hồ sơ'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingTop: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  genderActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderColor: Colors.accentGreen,
  },
  genderText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  genderActiveText: {
    color: Colors.accentGreen,
  },
  bmiWrap: {
    marginTop: 16,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  chipActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderColor: Colors.accentGreen,
  },
  chipActiveGoal: {
    backgroundColor: 'rgba(41, 182, 246, 0.12)',
    borderColor: Colors.info,
  },
  chipActiveRed: {
    backgroundColor: 'rgba(255, 23, 68, 0.12)',
    borderColor: Colors.accentRed,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipActiveText: {
    color: Colors.accentGreen,
  },
  chipActiveGoalText: {
    color: Colors.info,
  },
  chipActiveRedText: {
    color: Colors.accentRed,
  },
  saveButton: {
    backgroundColor: Colors.accentGreen,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.accentGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.darkBg,
    letterSpacing: 0.5,
  },
});
