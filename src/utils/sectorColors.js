// 섹터별 배경 색상 설정 (보라색 → 빨간색 그라데이션)
export const SECTOR_COLORS = {
  'solar-system': {
    bg: 'from-indigo-950 via-purple-950 to-black',
    bgSolid: '#1a1a2e',
    accent: '#6366f1',
    name: '태양계',
  },
  'exoplanet-systems': {
    bg: 'from-purple-950 via-fuchsia-950 to-black',
    bgSolid: '#2d1b4e',
    accent: '#a855f7',
    name: '외계행성계',
  },
  'nebulae': {
    bg: 'from-fuchsia-950 via-pink-950 to-black',
    bgSolid: '#4a1942',
    accent: '#ec4899',
    name: '성운',
  },
  'galaxies': {
    bg: 'from-pink-950 via-red-950 to-black',
    bgSolid: '#5c1a1a',
    accent: '#ef4444',
    name: '은하',
  },
  'deep-space-extremes': {
    bg: 'from-red-950 via-red-900 to-black',
    bgSolid: '#7a1515',
    accent: '#dc2626',
    name: '우주의 심연',
  },
};

// 기본 색상 (섹터를 찾을 수 없을 때)
export const DEFAULT_SECTOR = 'solar-system';

// 섹터 슬러그를 정규화하는 함수
export const normalizeSectorSlug = (slug) => {
  const slugMap = {
    '태양계': 'solar-system',
    'exo-systems': 'exoplanet-systems',
    '외계 행성계': 'exoplanet-systems',
    '성운': 'nebulae',
    '은하': 'galaxies',
    '우주의 심연': 'deep-space-extremes',
  };
  
  return slugMap[slug] || slug || DEFAULT_SECTOR;
};

// 섹터 색상 가져오기
export const getSectorColors = (sectorSlug) => {
  const normalized = normalizeSectorSlug(sectorSlug);
  return SECTOR_COLORS[normalized] || SECTOR_COLORS[DEFAULT_SECTOR];
};
