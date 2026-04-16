// Database thực phẩm Việt Nam
// Thông tin dinh dưỡng tính per 100g
// warnings: green = nên ăn, yellow = ăn vừa phải, red = hạn chế

export const FOOD_CATEGORIES = [
  { id: 'meat', name: 'Thịt', icon: '🥩' },
  { id: 'seafood', name: 'Cá & Hải sản', icon: '🐟' },
  { id: 'vegetable', name: 'Rau củ', icon: '🥬' },
  { id: 'fruit', name: 'Trái cây', icon: '🍎' },
  { id: 'grain', name: 'Ngũ cốc & Tinh bột', icon: '🌾' },
  { id: 'dairy', name: 'Sữa & Trứng', icon: '🥛' },
  { id: 'drink', name: 'Đồ uống', icon: '🥤' },
  { id: 'other', name: 'Khác', icon: '🍜' },
];

export const FOODS = [
  // === THỊT ===
  {
    id: 1, name: 'Thịt gà', category: 'meat',
    calories: 239, protein: 27, carb: 0, fat: 14,
    description: 'Nguồn protein chất lượng cao, ít mỡ (ức gà)',
    warnings: {
      gout: 'yellow', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'yellow', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { gout: 'Chứa purine trung bình, ăn vừa phải', kidney: 'Protein cao, cần kiểm soát lượng' },
  },
  {
    id: 2, name: 'Thịt heo nạc', category: 'meat',
    calories: 143, protein: 26, carb: 0, fat: 3.5,
    description: 'Giàu protein, vitamin B1, kẽm',
    warnings: {
      gout: 'yellow', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { gout: 'Purine trung bình, giới hạn 100-150g/ngày' },
  },
  {
    id: 3, name: 'Thịt heo mỡ (ba chỉ)', category: 'meat',
    calories: 518, protein: 9, carb: 0, fat: 53,
    description: 'Nhiều mỡ bão hòa, calories cao',
    warnings: {
      gout: 'yellow', diabetes: 'red', hypertension: 'red',
      kidney: 'yellow', obesity: 'red', heartDisease: 'red',
      pregnancy: 'yellow',
    },
    tips: { obesity: 'Calories rất cao, nên tránh', heartDisease: 'Mỡ bão hòa cao, tăng cholesterol' },
  },
  {
    id: 4, name: 'Thịt bò', category: 'meat',
    calories: 250, protein: 26, carb: 0, fat: 15,
    description: 'Giàu sắt, kẽm, vitamin B12',
    warnings: {
      gout: 'red', diabetes: 'green', hypertension: 'yellow',
      kidney: 'yellow', obesity: 'yellow', heartDisease: 'yellow',
      pregnancy: 'green',
    },
    tips: { gout: 'Purine cao, nên hạn chế', pregnancy: 'Tốt cho bà bầu, bổ sung sắt' },
  },
  {
    id: 5, name: 'Thịt vịt', category: 'meat',
    calories: 337, protein: 19, carb: 0, fat: 28,
    description: 'Giàu sắt, nhiều mỡ hơn thịt gà',
    warnings: {
      gout: 'red', diabetes: 'yellow', hypertension: 'yellow',
      kidney: 'yellow', obesity: 'red', heartDisease: 'yellow',
      pregnancy: 'yellow',
    },
    tips: { gout: 'Purine cao, nên tránh' },
  },
  {
    id: 6, name: 'Nội tạng (lòng, gan)', category: 'meat',
    calories: 135, protein: 21, carb: 4, fat: 3.6,
    description: 'Giàu sắt, vitamin A, B12 nhưng cholesterol cao',
    warnings: {
      gout: 'red', diabetes: 'yellow', hypertension: 'red',
      kidney: 'red', obesity: 'yellow', heartDisease: 'red',
      pregnancy: 'yellow',
    },
    tips: { gout: 'Purine rất cao, TUYỆT ĐỐI tránh', heartDisease: 'Cholesterol rất cao' },
  },

  // === CÁ & HẢI SẢN ===
  {
    id: 7, name: 'Cá hồi', category: 'seafood',
    calories: 208, protein: 20, carb: 0, fat: 13,
    description: 'Giàu Omega-3, tốt cho tim mạch và trí não',
    warnings: {
      gout: 'yellow', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { heartDisease: 'Omega-3 tốt cho tim', pregnancy: 'Omega-3 tốt cho phát triển não thai nhi' },
  },
  {
    id: 8, name: 'Tôm', category: 'seafood',
    calories: 99, protein: 24, carb: 0.2, fat: 0.3,
    description: 'Ít calories, giàu protein, kẽm, selen',
    warnings: {
      gout: 'red', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { gout: 'Purine cao, nên hạn chế' },
  },
  {
    id: 9, name: 'Cua, ghẹ', category: 'seafood',
    calories: 97, protein: 19, carb: 0, fat: 1.5,
    description: 'Giàu protein, kẽm, nhưng cholesterol khá cao',
    warnings: {
      gout: 'red', diabetes: 'green', hypertension: 'yellow',
      kidney: 'yellow', obesity: 'green', heartDisease: 'yellow',
      pregnancy: 'yellow',
    },
    tips: { gout: 'Purine rất cao', pregnancy: 'Ăn ít, cẩn thận kí sinh trùng' },
  },
  {
    id: 10, name: 'Cá thu', category: 'seafood',
    calories: 205, protein: 19, carb: 0, fat: 14,
    description: 'Giàu Omega-3, vitamin D',
    warnings: {
      gout: 'yellow', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { heartDisease: 'Omega-3 giúp giảm triglyceride' },
  },
  {
    id: 11, name: 'Mực', category: 'seafood',
    calories: 92, protein: 18, carb: 3, fat: 1.4,
    description: 'Ít calo, giàu protein nhưng cholesterol cao',
    warnings: {
      gout: 'red', diabetes: 'green', hypertension: 'yellow',
      kidney: 'yellow', obesity: 'green', heartDisease: 'yellow',
      pregnancy: 'yellow',
    },
    tips: { gout: 'Purine cao' },
  },
  {
    id: 12, name: 'Cá basa', category: 'seafood',
    calories: 90, protein: 13, carb: 0, fat: 4,
    description: 'Cá nước ngọt phổ biến, ít calories',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: {},
  },

  // === RAU CỦ ===
  {
    id: 13, name: 'Rau muống', category: 'vegetable',
    calories: 19, protein: 2.6, carb: 3.1, fat: 0.2,
    description: 'Giàu sắt, canxi, vitamin A, C',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: {},
  },
  {
    id: 14, name: 'Rau cải xanh', category: 'vegetable',
    calories: 13, protein: 1.5, carb: 2.2, fat: 0.2,
    description: 'Giàu vitamin C, K, folate',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { pregnancy: 'Giàu folate, rất tốt cho bà bầu' },
  },
  {
    id: 15, name: 'Bí đỏ', category: 'vegetable',
    calories: 26, protein: 1, carb: 6.5, fat: 0.1,
    description: 'Giàu beta-carotene, vitamin A, chất xơ',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: {},
  },
  {
    id: 16, name: 'Cà chua', category: 'vegetable',
    calories: 18, protein: 0.9, carb: 3.9, fat: 0.2,
    description: 'Giàu lycopene, vitamin C, chống oxy hóa',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { kidney: 'Kali cao, cần hạn chế nếu thận yếu nặng' },
  },
  {
    id: 17, name: 'Đậu bắp', category: 'vegetable',
    calories: 33, protein: 1.9, carb: 7, fat: 0.2,
    description: 'Giàu chất xơ, vitamin C, folate',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'Chất xơ giúp kiểm soát đường huyết' },
  },
  {
    id: 18, name: 'Măng', category: 'vegetable',
    calories: 27, protein: 2.6, carb: 5.2, fat: 0.3,
    description: 'Giàu chất xơ, ít calo',
    warnings: {
      gout: 'yellow', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'red',
    },
    tips: { pregnancy: 'Có thể chứa cyanide, không nên ăn khi mang thai' },
  },
  {
    id: 19, name: 'Khoai lang', category: 'vegetable',
    calories: 86, protein: 1.6, carb: 20, fat: 0.1,
    description: 'Giàu chất xơ, beta-carotene, GI trung bình',
    warnings: {
      gout: 'green', diabetes: 'yellow', hypertension: 'green',
      kidney: 'yellow', obesity: 'yellow', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'Tinh bột, ăn vừa phải thay cơm' },
  },
  {
    id: 20, name: 'Rau mồng tơi', category: 'vegetable',
    calories: 19, protein: 1.8, carb: 3.4, fat: 0.3,
    description: 'Giàu sắt, canxi, vitamin A',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { kidney: 'Chứa oxalate, hạn chế nếu có sỏi thận' },
  },
  {
    id: 21, name: 'Bông cải xanh (broccoli)', category: 'vegetable',
    calories: 34, protein: 2.8, carb: 7, fat: 0.4,
    description: 'Siêu thực phẩm, giàu vitamin C, K, chất xơ',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: {},
  },

  // === TRÁI CÂY ===
  {
    id: 22, name: 'Chuối', category: 'fruit',
    calories: 89, protein: 1.1, carb: 23, fat: 0.3,
    description: 'Giàu kali, vitamin B6, chất xơ',
    warnings: {
      gout: 'green', diabetes: 'yellow', hypertension: 'green',
      kidney: 'red', obesity: 'yellow', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { kidney: 'Kali rất cao, nguy hiểm cho thận yếu', diabetes: 'Đường tự nhiên cao, ăn 1 quả/ngày' },
  },
  {
    id: 23, name: 'Cam', category: 'fruit',
    calories: 47, protein: 0.9, carb: 12, fat: 0.1,
    description: 'Giàu vitamin C, chất chống oxy hóa',
    warnings: {
      gout: 'green', diabetes: 'yellow', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'Ăn cả quả thay nước ép để có chất xơ' },
  },
  {
    id: 24, name: 'Xoài', category: 'fruit',
    calories: 60, protein: 0.8, carb: 15, fat: 0.4,
    description: 'Giàu vitamin A, C, chất xơ',
    warnings: {
      gout: 'green', diabetes: 'red', hypertension: 'green',
      kidney: 'yellow', obesity: 'yellow', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'Đường cao, GI cao, nên hạn chế' },
  },
  {
    id: 25, name: 'Dưa hấu', category: 'fruit',
    calories: 30, protein: 0.6, carb: 8, fat: 0.2,
    description: 'Nhiều nước, giàu lycopene',
    warnings: {
      gout: 'green', diabetes: 'yellow', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'GI cao dù ít calo, ăn hạn chế' },
  },
  {
    id: 26, name: 'Ổi', category: 'fruit',
    calories: 68, protein: 2.6, carb: 14, fat: 1,
    description: 'Giàu vitamin C (gấp 4 lần cam), chất xơ cao',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'GI thấp, giàu chất xơ, rất phù hợp' },
  },
  {
    id: 27, name: 'Sầu riêng', category: 'fruit',
    calories: 147, protein: 1.5, carb: 27, fat: 5,
    description: 'Calories rất cao, giàu kali, vitamin C',
    warnings: {
      gout: 'yellow', diabetes: 'red', hypertension: 'yellow',
      kidney: 'red', obesity: 'red', heartDisease: 'yellow',
      pregnancy: 'yellow',
    },
    tips: { diabetes: 'Đường và calo rất cao', obesity: 'Calo cực cao, nên tránh', kidney: 'Kali rất cao' },
  },
  {
    id: 28, name: 'Táo', category: 'fruit',
    calories: 52, protein: 0.3, carb: 14, fat: 0.2,
    description: 'Giàu chất xơ, quercetin, vitamin C',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'GI thấp, chất xơ cao, rất tốt' },
  },
  {
    id: 29, name: 'Thanh long', category: 'fruit',
    calories: 50, protein: 1.1, carb: 11, fat: 0.4,
    description: 'Giàu vitamin C, chất xơ, chất chống oxy hóa',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: {},
  },

  // === NGŨ CỐC & TINH BỘT ===
  {
    id: 30, name: 'Gạo trắng (cơm)', category: 'grain',
    calories: 130, protein: 2.7, carb: 28, fat: 0.3,
    description: 'Nguồn năng lượng chính, GI cao',
    warnings: {
      gout: 'green', diabetes: 'yellow', hypertension: 'green',
      kidney: 'green', obesity: 'yellow', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'GI cao, nên giảm lượng hoặc thay gạo lứt' },
  },
  {
    id: 31, name: 'Gạo lứt', category: 'grain',
    calories: 123, protein: 2.7, carb: 26, fat: 1,
    description: 'Giàu chất xơ, vitamin B, GI thấp hơn gạo trắng',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'Thay thế tốt cho gạo trắng', kidney: 'Phospho cao hơn gạo trắng' },
  },
  {
    id: 32, name: 'Phở', category: 'grain',
    calories: 215, protein: 8, carb: 35, fat: 4,
    description: 'Món truyền thống, tinh bột cao',
    warnings: {
      gout: 'yellow', diabetes: 'yellow', hypertension: 'yellow',
      kidney: 'yellow', obesity: 'yellow', heartDisease: 'yellow',
      pregnancy: 'green',
    },
    tips: { hypertension: 'Nước dùng nhiều sodium, nên ăn ít nước' },
  },
  {
    id: 33, name: 'Mì gói', category: 'grain',
    calories: 436, protein: 10, carb: 62, fat: 17,
    description: 'Nhiều sodium, chất béo bão hòa, ít dinh dưỡng',
    warnings: {
      gout: 'yellow', diabetes: 'red', hypertension: 'red',
      kidney: 'red', obesity: 'red', heartDisease: 'red',
      pregnancy: 'red',
    },
    tips: { hypertension: 'Sodium rất cao (~1500mg)', obesity: 'Calo cao, ít dinh dưỡng' },
  },
  {
    id: 34, name: 'Yến mạch (Oats)', category: 'grain',
    calories: 68, protein: 2.5, carb: 12, fat: 1.4,
    description: 'Giàu chất xơ hòa tan, giúp giảm cholesterol',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { heartDisease: 'Chất xơ hòa tan giúp giảm cholesterol LDL' },
  },
  {
    id: 35, name: 'Bánh mì', category: 'grain',
    calories: 265, protein: 9, carb: 49, fat: 3.2,
    description: 'Tinh bột, GI cao',
    warnings: {
      gout: 'green', diabetes: 'yellow', hypertension: 'green',
      kidney: 'green', obesity: 'yellow', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'Chọn bánh mì nguyên cám, ăn vừa phải' },
  },

  // === SỮA & TRỨNG ===
  {
    id: 36, name: 'Trứng gà', category: 'dairy',
    calories: 155, protein: 13, carb: 1.1, fat: 11,
    description: 'Nguồn protein hoàn chỉnh, giàu choline',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'yellow',
      pregnancy: 'green',
    },
    tips: { heartDisease: 'Cholesterol trong lòng đỏ, ăn 1 quả/ngày', pregnancy: 'Choline rất tốt cho thai nhi' },
  },
  {
    id: 37, name: 'Sữa tươi', category: 'dairy',
    calories: 61, protein: 3.2, carb: 4.8, fat: 3.3,
    description: 'Giàu canxi, vitamin D, protein',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { kidney: 'Phospho và kali có thể cần kiểm soát' },
  },
  {
    id: 38, name: 'Sữa chua', category: 'dairy',
    calories: 59, protein: 10, carb: 3.6, fat: 0.7,
    description: 'Probiotic tốt cho tiêu hóa, giàu canxi',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'Chọn loại không đường' },
  },
  {
    id: 39, name: 'Phô mai', category: 'dairy',
    calories: 402, protein: 25, carb: 1.3, fat: 33,
    description: 'Giàu canxi, protein, nhưng nhiều mỡ bão hòa',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'red',
      kidney: 'yellow', obesity: 'red', heartDisease: 'yellow',
      pregnancy: 'yellow',
    },
    tips: { hypertension: 'Sodium rất cao', obesity: 'Calo và chất béo rất cao' },
  },

  // === ĐỒ UỐNG ===
  {
    id: 40, name: 'Trà xanh', category: 'drink',
    calories: 1, protein: 0, carb: 0, fat: 0,
    description: 'Giàu catechin, chất chống oxy hóa',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'yellow',
    },
    tips: { pregnancy: 'Chứa caffeine, hạn chế 1-2 ly/ngày' },
  },
  {
    id: 41, name: 'Cà phê', category: 'drink',
    calories: 2, protein: 0.3, carb: 0, fat: 0,
    description: 'Chứa caffeine, chất chống oxy hóa',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'yellow',
      kidney: 'green', obesity: 'green', heartDisease: 'yellow',
      pregnancy: 'red',
    },
    tips: { hypertension: 'Caffeine có thể tăng huyết áp tạm thời', pregnancy: 'Caffeine ảnh hưởng thai nhi, nên tránh' },
  },
  {
    id: 42, name: 'Nước ngọt có ga', category: 'drink',
    calories: 41, protein: 0, carb: 10.6, fat: 0,
    description: 'Nhiều đường, không dinh dưỡng',
    warnings: {
      gout: 'red', diabetes: 'red', hypertension: 'yellow',
      kidney: 'yellow', obesity: 'red', heartDisease: 'yellow',
      pregnancy: 'red',
    },
    tips: { diabetes: 'Đường rất cao, tăng đường huyết nhanh', gout: 'Fructose làm tăng acid uric' },
  },
  {
    id: 43, name: 'Bia', category: 'drink',
    calories: 43, protein: 0.5, carb: 3.6, fat: 0,
    description: 'Đồ uống có cồn, calories rỗng',
    warnings: {
      gout: 'red', diabetes: 'red', hypertension: 'red',
      kidney: 'red', obesity: 'red', heartDisease: 'red',
      pregnancy: 'red',
    },
    tips: { gout: 'Tăng acid uric MẠNH, nguyên nhân hàng đầu', pregnancy: 'TUYỆT ĐỐI không uống rượu bia' },
  },
  {
    id: 44, name: 'Trà sữa', category: 'drink',
    calories: 120, protein: 1, carb: 28, fat: 2,
    description: 'Nhiều đường, topping thêm calories',
    warnings: {
      gout: 'yellow', diabetes: 'red', hypertension: 'yellow',
      kidney: 'yellow', obesity: 'red', heartDisease: 'yellow',
      pregnancy: 'yellow',
    },
    tips: { diabetes: 'Đường rất cao', obesity: '1 ly = 400-600 calo với topping' },
  },
  {
    id: 45, name: 'Nước dừa', category: 'drink',
    calories: 19, protein: 0.7, carb: 3.7, fat: 0.2,
    description: 'Giàu điện giải tự nhiên, kali',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { kidney: 'Kali cao, cần kiểm soát nếu thận yếu' },
  },

  // === KHÁC ===
  {
    id: 46, name: 'Đậu phụ (Tàu hũ)', category: 'other',
    calories: 76, protein: 8, carb: 1.9, fat: 4.8,
    description: 'Protein thực vật, isoflavone, canxi',
    warnings: {
      gout: 'yellow', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { gout: 'Purine từ đậu nành, ăn vừa phải' },
  },
  {
    id: 47, name: 'Đậu đen', category: 'other',
    calories: 132, protein: 8.9, carb: 24, fat: 0.5,
    description: 'Giàu chất xơ, protein thực vật, sắt',
    warnings: {
      gout: 'yellow', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'Chất xơ cao, GI thấp, tốt cho đường huyết' },
  },
  {
    id: 48, name: 'Nước mắm', category: 'other',
    calories: 35, protein: 5, carb: 4, fat: 0,
    description: 'Gia vị truyền thống, giàu sodium',
    warnings: {
      gout: 'yellow', diabetes: 'green', hypertension: 'red',
      kidney: 'red', obesity: 'green', heartDisease: 'yellow',
      pregnancy: 'yellow',
    },
    tips: { hypertension: 'Sodium rất cao, hạn chế tối đa', kidney: 'Sodium cao, gánh nặng cho thận' },
  },
  {
    id: 49, name: 'Hạt điều', category: 'other',
    calories: 553, protein: 18, carb: 30, fat: 44,
    description: 'Giàu chất béo tốt, magie, kẽm',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'yellow', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { obesity: 'Calo cao, ăn 30g/ngày', heartDisease: 'Chất béo tốt, giúp giảm cholesterol' },
  },
  {
    id: 50, name: 'Mật ong', category: 'other',
    calories: 304, protein: 0.3, carb: 82, fat: 0,
    description: 'Đường tự nhiên, kháng khuẩn nhẹ',
    warnings: {
      gout: 'yellow', diabetes: 'red', hypertension: 'green',
      kidney: 'green', obesity: 'red', heartDisease: 'green',
      pregnancy: 'yellow',
    },
    tips: { diabetes: 'Vẫn là đường, tăng đường huyết nhanh', obesity: 'Calo cao như đường' },
  },
  {
    id: 51, name: 'Chả lụa', category: 'other',
    calories: 198, protein: 15, carb: 6, fat: 13,
    description: 'Thịt heo xay, chất phụ gia',
    warnings: {
      gout: 'yellow', diabetes: 'yellow', hypertension: 'yellow',
      kidney: 'yellow', obesity: 'yellow', heartDisease: 'yellow',
      pregnancy: 'yellow',
    },
    tips: { hypertension: 'Thực phẩm chế biến, sodium cao' },
  },
  {
    id: 52, name: 'Bún', category: 'grain',
    calories: 109, protein: 3.4, carb: 24, fat: 0.2,
    description: 'Tinh bột, GI cao, ít dinh dưỡng',
    warnings: {
      gout: 'green', diabetes: 'yellow', hypertension: 'green',
      kidney: 'green', obesity: 'yellow', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'GI cao, ăn kèm rau và protein' },
  },
  {
    id: 53, name: 'Khoai tây', category: 'vegetable',
    calories: 77, protein: 2, carb: 17, fat: 0.1,
    description: 'Giàu kali, vitamin C, tinh bột',
    warnings: {
      gout: 'green', diabetes: 'yellow', hypertension: 'green',
      kidney: 'yellow', obesity: 'yellow', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { diabetes: 'GI cao khi nấu chín, ăn vừa phải', kidney: 'Kali cao' },
  },
  {
    id: 54, name: 'Đậu xanh', category: 'other',
    calories: 105, protein: 7, carb: 19, fat: 0.4,
    description: 'Thanh nhiệt, giàu chất xơ, protein thực vật',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: {},
  },
  {
    id: 55, name: 'Giá đỗ', category: 'vegetable',
    calories: 31, protein: 3, carb: 6, fat: 0.2,
    description: 'Ít calo, giàu vitamin C, chất xơ',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'yellow',
    },
    tips: { pregnancy: 'Ăn chín kỹ, tránh giá sống do vi khuẩn' },
  },
  {
    id: 56, name: 'Tỏi', category: 'vegetable',
    calories: 149, protein: 6.4, carb: 33, fat: 0.5,
    description: 'Kháng khuẩn, allicin, tốt cho miễn dịch',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { heartDisease: 'Giúp giảm cholesterol và huyết áp nhẹ' },
  },
  {
    id: 57, name: 'Gừng', category: 'vegetable',
    calories: 80, protein: 1.8, carb: 18, fat: 0.8,
    description: 'Chống viêm, giảm buồn nôn, ấm bụng',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { pregnancy: 'Giúp giảm ốm nghén, dùng vừa phải' },
  },
  {
    id: 58, name: 'Dầu ô liu', category: 'other',
    calories: 884, protein: 0, carb: 0, fat: 100,
    description: 'Chất béo không bão hòa đơn, tốt cho tim mạch',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'green', obesity: 'yellow', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { heartDisease: 'Chất béo tốt, thay thế mỡ động vật', obesity: 'Calo cao, dùng 1-2 muỗng/bữa' },
  },
  {
    id: 59, name: 'Cá ngừ', category: 'seafood',
    calories: 132, protein: 28, carb: 0, fat: 1.3,
    description: 'Giàu protein, omega-3, vitamin D',
    warnings: {
      gout: 'yellow', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'yellow',
    },
    tips: { pregnancy: 'Chứa thủy ngân, hạn chế 2 lần/tuần' },
  },
  {
    id: 60, name: 'Rau dền', category: 'vegetable',
    calories: 23, protein: 2.5, carb: 4, fat: 0.3,
    description: 'Giàu sắt, canxi, vitamin A, K',
    warnings: {
      gout: 'green', diabetes: 'green', hypertension: 'green',
      kidney: 'yellow', obesity: 'green', heartDisease: 'green',
      pregnancy: 'green',
    },
    tips: { kidney: 'Oxalate cao, hạn chế nếu sỏi thận' },
  },
];
