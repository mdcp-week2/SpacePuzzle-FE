import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AnimatedCockpitBackground from '../components/AnimatedCockpitBackground';
import { getGuestStats, getGuestCustomization, setGuestStats } from '../utils/guestStorage';

// 조종석 이미지 import
const COCKPIT_IMAGES = {
  cockpit_wooden_basic: () => import('../assets/cockpit/cockpit_wooden_basic.png'),
  cockpit_seat_pink_jelly_cat: () => import('../assets/cockpit/cockpit_seat_pink_jelly_cat.png'),
  cockpit_seat_nasa_ergonomic: () => import('../assets/cockpit/cockpit_seat_nasa_ergonomic.png'),
  cockpit_dash_space_whale: () => import('../assets/cockpit/cockpit_dash_space_whale.png'),
  cockpit_stealth_ship: () => import('../assets/cockpit/cockpit_stealth_ship.png'),
  cockpit_nest_space_bear: () => import('../assets/cockpit/cockpit_nest_space_bear.png'),
  cockpit_bio_organic_alien: () => import('../assets/cockpit/cockpit_bio_organic_alien.png'),
  cockpit_antigravity_command: () => import('../assets/cockpit/cockpit_antigravity_command.png'),
  cockpit_item_star_wand: () => import('../assets/cockpit/cockpit_item_star_wand.png'),
};

/**
 * 조종실 페이지
 * 우주 배경 + 하단 조종칸
 */

// 섹터 데이터
const SECTORS = [
  {
    id: 1,
    slug: 'solar-system',
    name: '태양계',
    nameEn: 'Solar System',
    requiredStars: 0,
    color: 'from-orange-500 via-yellow-400 to-orange-600',
    glowColor: 'rgba(251, 146, 60, 0.8)',
  },
  {
    id: 2,
    slug: 'exoplanet-systems',
    name: '외계 행성',
    nameEn: 'Exoplanet Systems',
    requiredStars: 15,
    color: 'from-purple-500 via-pink-400 to-purple-600',
    glowColor: 'rgba(168, 85, 247, 0.8)',
  },
  {
    id: 3,
    slug: 'nebulae',
    name: '성운',
    nameEn: 'Nebulae',
    requiredStars: 28,
    color: 'from-cyan-500 via-blue-400 to-cyan-600',
    glowColor: 'rgba(6, 182, 212, 0.8)',
  },
  {
    id: 4,
    slug: 'galaxies',
    name: '은하',
    nameEn: 'Galaxies',
    requiredStars: 45,
    color: 'from-violet-500 via-purple-400 to-violet-600',
    glowColor: 'rgba(139, 92, 246, 0.8)',
  },
  {
    id: 5,
    slug: 'deep-space-extremes',
    name: '심연',
    nameEn: 'Deep Space',
    requiredStars: 65,
    color: 'from-red-500 via-pink-400 to-red-600',
    glowColor: 'rgba(239, 68, 68, 0.8)',
  },
];

const Cockpit = () => {
  const navigate = useNavigate();
  
  // ⭐ 별 개수 초기값을 localStorage에서 읽어오기 (즉시 표시)
  const [userStars, setUserStars] = useState(() => {
    try {
      const guestStats = getGuestStats();
      return guestStats.stars || 0;
    } catch {
      return 0;
    }
  });
  
  const [isWarping, setIsWarping] = useState(false);
  const [warpDirection, setWarpDirection] = useState('center'); // left, left-center, center, right-center, right
  const [clickedSectorIndex, setClickedSectorIndex] = useState(null);
  const [customization, setCustomization] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.isGuest) {
        // 게스트 모드: 고유 ID별 데이터 읽기
        return getGuestCustomization();
      } else {
        // 로그인 모드: 캐시된 값이 있으면 사용
        const cachedCustomization = localStorage.getItem('cachedCustomization');
        if (cachedCustomization) {
          return JSON.parse(cachedCustomization);
        }
      }
    } catch (error) {
      console.error('초기 customization 로드 실패:', error);
    }
    // 기본값
    return {
      background: 'wall_gray_iron_plate',
      cockpit: 'cockpit_wooden_basic',
      items: [],
    };
  });
  const [cockpitImage, setCockpitImage] = useState(null);

  useEffect(() => {
    // 🎯 첫 로드 시에만 customization 가져오기 (캐시 사용)
    loadCustomization();
  }, []);
  
  // 조종석 이미지 로드
  useEffect(() => {
    const loadCockpitImage = async () => {
      // 조종석이 설정되어 있으면 해당 이미지, 없으면 기본 조종석 사용
      const cockpitKey = customization.cockpit || 'cockpit_wooden_basic';
      
      if (COCKPIT_IMAGES[cockpitKey]) {
        try {
          const imageModule = await COCKPIT_IMAGES[cockpitKey]();
          setCockpitImage(imageModule.default);
        } catch (error) {
          console.error('조종석 이미지 로드 실패:', error);
          // 실패 시 기본 조종석 시도
          try {
            const defaultModule = await COCKPIT_IMAGES['cockpit_wooden_basic']();
            setCockpitImage(defaultModule.default);
          } catch (err) {
            console.error('기본 조종석 로드 실패:', err);
            setCockpitImage(null);
          }
        }
      }
    };
    
    loadCockpitImage();
  }, [customization.cockpit]);

  const loadCustomization = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.isGuest) {
        const guestCustomization = getGuestCustomization();
        setCustomization(guestCustomization);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        
        if (accessToken) {
          const response = await fetch(
            'https://spacepuzzle.onrender.com/user/customization',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            // 백엔드는 { wall, cockpit, items } 형식으로 반환 (wall === background)
            const customizationData = {
              background: data.wall || 'wall_gray_iron_plate',
              cockpit: data.cockpit || 'cockpit_wooden_basic',
              items: data.items || [],
            };
            setCustomization(customizationData);
            // localStorage에 캐시 (다음 로딩 시 깜빡임 방지)
            localStorage.setItem('cachedCustomization', JSON.stringify(customizationData));
          }
        }
      }
    } catch (error) {
      console.error('커스터마이제이션 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    // ⭐ 첫 로드 시에만 별 개수 가져오기 (캐시된 값은 이미 표시 중)
    const loadUserStars = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        
        if (accessToken) {
          // 로그인 상태: 백엔드에서 최신 별 개수 가져오기
          console.log('🔐 백엔드에서 최신 별 개수 업데이트');
          const response = await fetch('https://spacepuzzle.onrender.com/user/resources', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ 백엔드 별 개수:', data.stars);
            setUserStars(data.stars || 0);
            
            // localStorage에도 캐싱 (게스트 ID별로 저장)
            const guestStats = getGuestStats();
            guestStats.stars = data.stars || 0;
            guestStats.credits = data.credits || 20;
            guestStats.spaceParts = data.spaceParts || 0;
            setGuestStats(guestStats);
          } else {
            console.log('⚠️ 백엔드 연결 실패 - 캐시 데이터 사용');
          }
        } else {
          // 게스트 모드: 캐시된 값 사용 (이미 초기값으로 설정됨)
          console.log('👤 게스트 모드 - 캐시 데이터 사용');
        }
      } catch (error) {
        console.log('⚠️ 별 개수 업데이트 실패 - 캐시 데이터 사용:', error.message);
      }
    };
    
    loadUserStars();
  }, []);

  const goBackToLobby = () => {
    navigate('/lobby');
  };

  const handleSectorClick = (sector, index) => {
    if (userStars >= sector.requiredStars) {
      // 워프 방향 설정
      const directions = ['left', 'left-center', 'center', 'right-center', 'right'];
      setWarpDirection(directions[index]);
      setClickedSectorIndex(index);
      setIsWarping(true);
      
      // 워프 애니메이션 후 이동
      setTimeout(() => {
        navigate('/sector', { state: { sectorSlug: sector.slug } });
      }, 2500);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 반짝이는 별 효과용 + 워프 애니메이션 스타일 */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .star-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.2); }
          50% { box-shadow: inset 0 0 60px rgba(255, 255, 255, 0.4); }
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        
        @keyframes sectorColorFade {
          to { opacity: 0.8; }
        }
        
        @keyframes darkenToSpace {
          to { opacity: 1; }
        }
        
        @keyframes starTwinkle {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0.8; transform: scale(1); }
        }
        
        @keyframes sector-warp-left {
          0% { 
            transform: scale(1) rotateY(0deg) translateZ(0);
            z-index: 10;
          }
          50% {
            transform: scale(3) rotateY(25deg) translateZ(200px);
            z-index: 100;
          }
          100% { 
            transform: scale(15) rotateY(45deg) translateZ(500px);
            opacity: 1;
            z-index: 100;
          }
        }
        
        @keyframes sector-warp-left-center {
          0% { 
            transform: scale(1) rotateY(0deg) translateZ(0);
            z-index: 10;
          }
          50% {
            transform: scale(3) rotateY(15deg) translateZ(200px);
            z-index: 100;
          }
          100% { 
            transform: scale(15) rotateY(25deg) translateZ(500px);
            opacity: 1;
            z-index: 100;
          }
        }
        
        @keyframes sector-warp-center {
          0% { 
            transform: scale(1) translateZ(0);
            z-index: 10;
          }
          50% {
            transform: scale(3) translateZ(200px);
            z-index: 100;
          }
          100% { 
            transform: scale(15) translateZ(500px);
            opacity: 1;
            z-index: 100;
          }
        }
        
        @keyframes sector-warp-right-center {
          0% { 
            transform: scale(1) rotateY(0deg) translateZ(0);
            z-index: 10;
          }
          50% {
            transform: scale(3) rotateY(-15deg) translateZ(200px);
            z-index: 100;
          }
          100% { 
            transform: scale(15) rotateY(-25deg) translateZ(500px);
            opacity: 1;
            z-index: 100;
          }
        }
        
        @keyframes sector-warp-right {
          0% { 
            transform: scale(1) rotateY(0deg) translateZ(0);
            z-index: 10;
          }
          50% {
            transform: scale(3) rotateY(-25deg) translateZ(200px);
            z-index: 100;
          }
          100% { 
            transform: scale(15) rotateY(-45deg) translateZ(500px);
            opacity: 1;
            z-index: 100;
          }
        }
        
        .sector-warp-active {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 100 !important;
        }
        
        .sector-warp-left { animation: sector-warp-left 1.3s ease-out forwards; }
        .sector-warp-left-center { animation: sector-warp-left-center 1.3s ease-out forwards; }
        .sector-warp-center { animation: sector-warp-center 1.3s ease-out forwards; }
        .sector-warp-right-center { animation: sector-warp-right-center 1.3s ease-out forwards; }
        .sector-warp-right { animation: sector-warp-right 1.3s ease-out forwards; }
        
      `}</style>
      
      {/* 워프 효과 오버레이 */}
      {isWarping && clickedSectorIndex !== null && (
        <>
          {/* 1단계: 섹터 색상 페이드 (짧게) */}
          <div 
            className="absolute inset-0 z-40 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, ${SECTORS[clickedSectorIndex].color.replace('from-', '').replace('via-', '').replace('to-', '').split(' ')[0]})`,
              animation: 'sectorColorFade 0.2s ease-out 0.3s forwards',
              opacity: 0,
            }}
          />
          
          {/* 2단계: 서서히 어두워짐 (우주 배경) - 매우 길게 */}
          <div 
            className="absolute inset-0 z-45 pointer-events-none bg-black"
            style={{
              animation: 'darkenToSpace 1.2s ease-in 0.5s forwards',
              opacity: 0,
            }}
          />
          
          {/* 3단계: 별 반짝임 효과 (우주 느낌) - 오래 유지 */}
          <div className="absolute inset-0 z-45 pointer-events-none">
            {[...Array(500)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute bg-white rounded-full star-twinkle"
                style={{
                  width: Math.random() * 3 + 1 + 'px',
                  height: Math.random() * 3 + 1 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animation: `starTwinkle ${0.4 + Math.random() * 0.3}s ease-in ${1.2 + Math.random() * 0.8}s forwards`,
                  opacity: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* 우주 배경 (전체 화면) */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black"
      >
        {/* 별들 효과 */}
        <div className="absolute inset-0">
          {[...Array(300)].map((_, i) => {
            const isTwinkling = Math.random() > 0.7; // 30% 확률로 반짝임
            const size = isTwinkling ? Math.random() * 3 + 2 : Math.random() * 2 + 1;
            const animationDelay = Math.random() * 3;
            
            return (
              <div
                key={i}
                className={`absolute bg-white rounded-full ${isTwinkling ? 'star-twinkle' : ''}`}
                style={{
                  width: size + 'px',
                  height: size + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  opacity: isTwinkling ? 0.3 : Math.random() * 0.7 + 0.3,
                  animationDelay: isTwinkling ? `${animationDelay}s` : undefined,
                }}
              />
            );
          })}
        </div>

        {/* 섹터 선택 영역 - 5개 수직 영역 */}
        <div className="relative z-10 flex h-full">
          {SECTORS.map((sector, index) => {
            const isLocked = userStars < sector.requiredStars;
            const isClicked = clickedSectorIndex === index;
            const warpAnimationClass = isClicked ? `sector-warp-${warpDirection}` : '';
            
            return (
              <div
                key={sector.id}
                className={`flex-1 relative group ${
                  isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                } ${isWarping && !isClicked ? 'opacity-0' : ''} ${isClicked ? 'sector-warp-active' : ''} transition-all duration-300 hover:z-30`}
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => handleSectorClick(sector, index)}
              >
                <div className={warpAnimationClass} style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
                {/* 배경 그라데이션 */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-b ${sector.color} opacity-0 group-hover:opacity-70 transition-all duration-300`}
                  style={{
                    filter: isLocked ? 'grayscale(100%)' : 'none'
                  }}
                />
                
                {/* 강한 테두리 효과 */}
                {!isLocked && (
                  <>
                    <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/50 transition-all duration-300" />
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pulse-glow"
                      style={{
                        boxShadow: `inset 0 0 100px ${sector.glowColor}, 0 0 50px ${sector.glowColor}`,
                      }}
                    />
                  </>
                )}
                
                {/* 스케일 효과 (살짝 확대) */}
                <div className="absolute inset-0 transform group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                
                {/* 섹터 정보 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* 잠금 오버레이 */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🔒</div>
                        <p className="korean-font text-yellow-500 text-sm">⭐ {sector.requiredStars}개 필요</p>
                        <p className="text-gray-400 text-xs mt-1">({userStars}/{sector.requiredStars})</p>
                      </div>
                    </div>
                  )}
                  
                  
                  {/* 섹터 이름 */}
                  <h3 className={`korean-font text-2xl mb-2 ${
                    isLocked ? 'text-gray-500' : 'text-white group-hover:text-yellow-300'
                  } group-hover:text-4xl transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]`}>
                    {sector.name}
                  </h3>
                  
                  <p className={`text-sm ${
                    isLocked ? 'text-gray-600' : 'text-gray-300 group-hover:text-white'
                  } group-hover:text-lg transition-all duration-300`}>
                    {sector.nameEn}
                  </p>
                  
                  {/* 해금됨 표시 */}
                  {!isLocked && (
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                      <p className="korean-font text-yellow-400 text-lg font-bold animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
                        ▶ 클릭하여 진입
                      </p>
                    </div>
                  )}
                </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 조종석 이미지 (하단 고정 - 배경 레이어) */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none"
        style={{ height: '900px' }}
      >
        {/* 배경 레이어 (애니메이션 배경) */}
        <div className="absolute inset-0">
          <AnimatedCockpitBackground 
            className="opacity-80"
          />
        </div>
        
        {/* 조종석 오버레이 */}
        {cockpitImage ? (
          <img
            src={cockpitImage}
            alt="Cockpit"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-gray-900/80 via-gray-800/60 to-transparent flex items-center justify-center border-t-4 border-yellow-600 shadow-2xl">
            <div className="text-center px-4">
              <p className="korean-font text-3xl text-white mb-3">COCKPIT</p>
              <p className="korean-font text-yellow-400 text-xl mb-2">조종석</p>
            </div>
          </div>
        )}
      </div>

      {/* 왼쪽 상단 - 돌아가기 버튼 */}
      <button
        onClick={goBackToLobby}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-gray-900 bg-opacity-90 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg transition-all border border-gray-700 hover:border-blue-500"
      >
        <span className="text-xl">←</span>
        <span className="korean-font">우주선으로</span>
      </button>

      {/* 오른쪽 상단 - 별 개수 표시 */}
      <div className="absolute top-6 right-6 z-20 bg-gray-900 bg-opacity-90 text-white px-6 py-3 rounded-lg border border-yellow-500">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="pixel-font text-xl text-yellow-400">{userStars}</p>
            <p className="text-gray-400 text-xs">보유 별</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cockpit;
