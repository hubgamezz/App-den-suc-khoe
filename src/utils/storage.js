import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  HEALTH_PROFILE: '@health_profile',
  SEARCH_HISTORY: '@search_history',
};

/**
 * Lưu health profile
 */
export async function saveProfile(profile) {
  try {
    const jsonValue = JSON.stringify(profile);
    await AsyncStorage.setItem(KEYS.HEALTH_PROFILE, jsonValue);
    return true;
  } catch (e) {
    console.error('Error saving profile:', e);
    return false;
  }
}

/**
 * Đọc health profile
 */
export async function loadProfile() {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.HEALTH_PROFILE);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading profile:', e);
    return null;
  }
}

/**
 * Xóa profile
 */
export async function clearProfile() {
  try {
    await AsyncStorage.removeItem(KEYS.HEALTH_PROFILE);
    return true;
  } catch (e) {
    console.error('Error clearing profile:', e);
    return false;
  }
}

/**
 * Thêm vào lịch sử tra cứu
 */
export async function addSearchHistory(foodId) {
  try {
    const history = await getSearchHistory();
    // Thêm vào đầu, loại bỏ trùng lặp, giữ tối đa 20
    const filtered = history.filter(id => id !== foodId);
    filtered.unshift(foodId);
    const trimmed = filtered.slice(0, 20);
    await AsyncStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(trimmed));
    return true;
  } catch (e) {
    console.error('Error adding search history:', e);
    return false;
  }
}

/**
 * Đọc lịch sử tra cứu
 */
export async function getSearchHistory() {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.SEARCH_HISTORY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading search history:', e);
    return [];
  }
}
