/**
 * 게스트 모드 localStorage 관리 유틸리티
 * 각 게스트 세션마다 독립적인 데이터 저장
 */

// 현재 게스트 ID 가져오기
export const getGuestId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.guestId || null;
  } catch {
    return null;
  }
};

// 게스트 ID별 localStorage 키 생성
const getKey = (baseKey) => {
  const guestId = getGuestId();
  if (!guestId) {
    // 게스트 ID가 없으면 기본 키 사용 (하위 호환성)
    return baseKey;
  }
  return `${baseKey}_${guestId}`;
};

// 게스트 통계 (별, 크레딧, 우주 부품)
export const getGuestStats = () => {
  try {
    const key = getKey('guestStats');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : { stars: 0, credits: 20, spaceParts: 0 };
  } catch {
    return { stars: 0, credits: 20, spaceParts: 0 };
  }
};

export const setGuestStats = (stats) => {
  const key = getKey('guestStats');
  localStorage.setItem(key, JSON.stringify(stats));
};

// 게스트 커스터마이제이션
export const getGuestCustomization = () => {
  try {
    const key = getKey('guestCustomization');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {
      background: 'wall_gray_iron_plate',
      cockpit: 'cockpit_wooden_basic',
      items: [],
    };
  } catch {
    return {
      background: 'wall_gray_iron_plate',
      cockpit: 'cockpit_wooden_basic',
      items: [],
    };
  }
};

export const setGuestCustomization = (customization) => {
  const key = getKey('guestCustomization');
  localStorage.setItem(key, JSON.stringify(customization));
};

// 게스트 구매 아이템
export const getGuestPurchasedItems = () => {
  try {
    const key = getKey('guestPurchasedItems');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setGuestPurchasedItems = (items) => {
  const key = getKey('guestPurchasedItems');
  localStorage.setItem(key, JSON.stringify(items));
};

// 게스트 클리어한 천체
export const getGuestClearedCelestials = () => {
  try {
    const key = getKey('guestClearedCelestials');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setGuestClearedCelestials = (celestials) => {
  const key = getKey('guestClearedCelestials');
  localStorage.setItem(key, JSON.stringify(celestials));
};

// 게스트 해금 섹터
export const getGuestUnlockedSectors = () => {
  try {
    const key = getKey('guestUnlockedSectors');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [1];
  } catch {
    return [1];
  }
};

export const setGuestUnlockedSectors = (sectors) => {
  const key = getKey('guestUnlockedSectors');
  localStorage.setItem(key, JSON.stringify(sectors));
};

// 퍼즐 저장 상태 (nasaId별)
export const getPuzzleSave = (nasaId) => {
  try {
    const key = getKey(`puzzle_save_${nasaId}`);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setPuzzleSave = (nasaId, saveData) => {
  const key = getKey(`puzzle_save_${nasaId}`);
  if (saveData === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(saveData));
  }
};
