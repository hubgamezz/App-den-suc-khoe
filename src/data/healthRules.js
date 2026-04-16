// Health conditions và rules phân loại đèn xanh/vàng/đỏ

export const HEALTH_CONDITIONS = [
  { id: 'gout', name: 'Gout (Gút)', icon: '🦴', description: 'Bệnh gút, acid uric cao' },
  { id: 'diabetes', name: 'Tiểu đường', icon: '🩸', description: 'Đường huyết cao, type 1 hoặc 2' },
  { id: 'hypertension', name: 'Huyết áp cao', icon: '❤️‍🩹', description: 'Tăng huyết áp' },
  { id: 'kidney', name: 'Thận yếu', icon: '🫘', description: 'Bệnh thận, suy thận' },
  { id: 'obesity', name: 'Béo phì / Thừa cân', icon: '⚖️', description: 'BMI > 25' },
  { id: 'heartDisease', name: 'Tim mạch', icon: '🫀', description: 'Bệnh tim, cholesterol cao' },
  { id: 'pregnancy', name: 'Mang thai', icon: '🤰', description: 'Phụ nữ mang thai' },
];

export const HEALTH_GOALS = [
  { id: 'lose', name: 'Giảm cân', icon: '📉' },
  { id: 'gain', name: 'Tăng cân', icon: '📈' },
  { id: 'maintain', name: 'Duy trì', icon: '⚖️' },
  { id: 'muscle', name: 'Tăng cơ', icon: '💪' },
];

export const ALLERGIES = [
  { id: 'seafoodAllergy', name: 'Hải sản', icon: '🦐' },
  { id: 'peanutAllergy', name: 'Đậu phộng', icon: '🥜' },
  { id: 'milkAllergy', name: 'Sữa', icon: '🥛' },
  { id: 'eggAllergy', name: 'Trứng', icon: '🥚' },
  { id: 'glutenAllergy', name: 'Gluten', icon: '🌾' },
];

// Allergy mapping: allergy ID → food categories/IDs to mark red
export const ALLERGY_FOOD_MAP = {
  seafoodAllergy: {
    categories: ['seafood'],
    foodIds: [],
  },
  peanutAllergy: {
    categories: [],
    foodIds: [49], // Hạt điều và tương tự
  },
  milkAllergy: {
    categories: [],
    foodIds: [37, 38, 39], // Sữa, sữa chua, phô mai
  },
  eggAllergy: {
    categories: [],
    foodIds: [36], // Trứng
  },
  glutenAllergy: {
    categories: [],
    foodIds: [33, 35], // Mì gói, bánh mì
  },
};

/**
 * Tính toán mức đèn tổng hợp cho 1 thực phẩm dựa trên profile sức khỏe
 * Logic: Nếu có bất kỳ RED → RED. Nếu có YELLOW → YELLOW. Còn lại → GREEN
 * @param {Object} food - Thực phẩm từ database
 * @param {Object} profile - Health profile của người dùng
 * @returns {{ level: 'green'|'yellow'|'red', reasons: string[] }}
 */
export function evaluateFood(food, profile) {
  const reasons = [];
  let hasRed = false;
  let hasYellow = false;

  // Kiểm tra dị ứng
  if (profile.allergies && profile.allergies.length > 0) {
    for (const allergyId of profile.allergies) {
      const mapping = ALLERGY_FOOD_MAP[allergyId];
      if (mapping) {
        if (mapping.categories.includes(food.category)) {
          hasRed = true;
          const allergy = ALLERGIES.find(a => a.id === allergyId);
          reasons.push(`⚠️ Dị ứng ${allergy?.name || allergyId}`);
        }
        if (mapping.foodIds.includes(food.id)) {
          hasRed = true;
          const allergy = ALLERGIES.find(a => a.id === allergyId);
          reasons.push(`⚠️ Dị ứng ${allergy?.name || allergyId}`);
        }
      }
    }
  }

  // Kiểm tra theo tình trạng sức khỏe
  if (profile.conditions && profile.conditions.length > 0) {
    for (const conditionId of profile.conditions) {
      const warningLevel = food.warnings?.[conditionId];
      const condition = HEALTH_CONDITIONS.find(c => c.id === conditionId);
      const conditionName = condition?.name || conditionId;

      if (warningLevel === 'red') {
        hasRed = true;
        const tip = food.tips?.[conditionId] || `Không phù hợp cho người ${conditionName}`;
        reasons.push(`🔴 ${conditionName}: ${tip}`);
      } else if (warningLevel === 'yellow') {
        hasYellow = true;
        const tip = food.tips?.[conditionId] || `Cần kiểm soát lượng cho người ${conditionName}`;
        reasons.push(`🟡 ${conditionName}: ${tip}`);
      }
    }
  }

  // Kiểm tra BMI nếu có mục tiêu giảm cân
  if (profile.goal === 'lose' && food.calories > 300) {
    hasYellow = true;
    reasons.push(`🟡 Giảm cân: Calories cao (${food.calories} kcal/100g)`);
  }

  // Kiểm tra auto-obesity nếu BMI > 25
  if (profile.bmi && profile.bmi > 25 && !profile.conditions?.includes('obesity')) {
    const warningLevel = food.warnings?.obesity;
    if (warningLevel === 'red') {
      hasRed = true;
      const tip = food.tips?.obesity || 'Calories cao, không phù hợp';
      reasons.push(`🔴 Thừa cân: ${tip}`);
    } else if (warningLevel === 'yellow') {
      hasYellow = true;
      const tip = food.tips?.obesity || 'Cần kiểm soát lượng ăn';
      reasons.push(`🟡 Thừa cân: ${tip}`);
    }
  }

  let level = 'green';
  if (hasRed) level = 'red';
  else if (hasYellow) level = 'yellow';

  if (level === 'green') {
    reasons.push('✅ Phù hợp với tình trạng sức khỏe của bạn');
  }

  return { level, reasons };
}

/**
 * Tính BMI
 */
export function calculateBMI(heightCm, weightKg) {
  if (!heightCm || !weightKg) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * Đánh giá BMI
 */
export function getBMICategory(bmi) {
  if (!bmi) return null;
  if (bmi < 18.5) return { label: 'Thiếu cân', color: 'yellow', icon: '⚠️' };
  if (bmi < 23) return { label: 'Bình thường', color: 'green', icon: '✅' };
  if (bmi < 25) return { label: 'Thừa cân', color: 'yellow', icon: '⚠️' };
  return { label: 'Béo phì', color: 'red', icon: '🔴' };
}

/**
 * Lấy gợi ý dinh dưỡng theo tình trạng sức khỏe
 */
export function getHealthTips(conditions) {
  const tips = [];

  if (conditions.includes('gout')) {
    tips.push({
      title: 'Gout (Gút)',
      icon: '🦴',
      dos: [
        'Uống nhiều nước (2-3 lít/ngày)',
        'Ăn nhiều rau xanh, trái cây ít đường',
        'Sử dụng sữa ít béo',
        'Ăn cherry, dâu tây giảm acid uric',
      ],
      donts: [
        'Tránh nội tạng, hải sản có vỏ',
        'Không uống bia, rượu',
        'Hạn chế thịt đỏ (bò, cừu)',
        'Tránh nước ngọt có đường',
      ],
    });
  }

  if (conditions.includes('diabetes')) {
    tips.push({
      title: 'Tiểu đường',
      icon: '🩸',
      dos: [
        'Ăn nhiều rau xanh, chất xơ',
        'Chọn khóa có GI thấp (gạo lứt, yến mạch)',
        'Ăn protein nạc (cá, ức gà)',
        'Chia nhỏ bữa ăn, ăn đúng giờ',
      ],
      donts: [
        'Tránh đồ ngọt, nước ngọt, trà sữa',
        'Hạn chế gạo trắng, bánh mì trắng',
        'Không ăn trái cây quá ngọt (xoài chín, sầu riêng)',
        'Tránh thực phẩm chiên, đồ ăn nhanh',
      ],
    });
  }

  if (conditions.includes('hypertension')) {
    tips.push({
      title: 'Huyết áp cao',
      icon: '❤️‍🩹',
      dos: [
        'Ăn nhiều rau xanh, trái cây giàu kali',
        'Sử dụng dầu ô liu thay mỡ',
        'Ăn cá béo (cá hồi, cá thu)',
        'Uống nước đủ 2 lít/ngày',
      ],
      donts: [
        'Giảm muối, nước mắm, gia vị mặn',
        'Tránh mì gói, thực phẩm chế biến',
        'Hạn chế bia, rượu, caffeine',
        'Không ăn phô mai, thịt xông khói',
      ],
    });
  }

  if (conditions.includes('kidney')) {
    tips.push({
      title: 'Thận yếu',
      icon: '🫘',
      dos: [
        'Kiểm soát protein (0.6-0.8g/kg/ngày)',
        'Ăn rau luộc (giảm kali)',
        'Dùng gạo trắng (phospho thấp)',
        'Uống nước theo chỉ dẫn bác sĩ',
      ],
      donts: [
        'Hạn chế thực phẩm giàu kali (chuối, cam, nước dừa)',
        'Giảm muối, nước mắm',
        'Tránh thực phẩm giàu phospho (sữa, phô mai, hạt)',
        'Không ăn quá nhiều protein',
      ],
    });
  }

  if (conditions.includes('obesity')) {
    tips.push({
      title: 'Béo phì / Thừa cân',
      icon: '⚖️',
      dos: [
        'Ăn nhiều rau xanh, chất xơ',
        'Chọn protein nạc (cá, ức gà, đậu phụ)',
        'Uống nước trước bữa ăn 30 phút',
        'Chia nhỏ bữa ăn, nhai kỹ',
      ],
      donts: [
        'Tránh chiên, xào nhiều dầu',
        'Không uống trà sữa, nước ngọt',
        'Hạn chế sầu riêng, xoài, nho',
        'Tránh mì gói, snack, bánh kẹo',
      ],
    });
  }

  if (conditions.includes('heartDisease')) {
    tips.push({
      title: 'Tim mạch',
      icon: '🫀',
      dos: [
        'Ăn cá béo 2-3 lần/tuần (omega-3)',
        'Dùng dầu ô liu, hạt điều, hạnh nhân',
        'Ăn nhiều rau xanh, trái cây',
        'Ăn yến mạch giảm cholesterol',
      ],
      donts: [
        'Tránh mỡ bão hòa (thịt mỡ, nội tạng)',
        'Hạn chế muối, thực phẩm chế biến',
        'Không hút thuốc, hạn chế rượu',
        'Tránh đồ chiên, đồ ăn nhanh',
      ],
    });
  }

  if (conditions.includes('pregnancy')) {
    tips.push({
      title: 'Mang thai',
      icon: '🤰',
      dos: [
        'Bổ sung folate (rau xanh, đậu)',
        'Ăn đủ protein (thịt, cá, trứng)',
        'Uống sữa bầu, bổ sung canxi',
        'Ăn cá hồi (DHA cho não thai nhi)',
      ],
      donts: [
        'TUYỆT ĐỐI không rượu bia',
        'Hạn chế caffeine (cà phê, trà đặc)',
        'Tránh cá có thủy ngân cao (cá kiếm, cá ngừ lớn)',
        'Không ăn đồ sống, tái (sushi, gỏi)',
      ],
    });
  }

  return tips;
}
