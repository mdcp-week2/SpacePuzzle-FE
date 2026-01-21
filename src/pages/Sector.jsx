import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { getSectorColors } from '../utils/sectorColors';

const SECTOR_SLUGS = {
  'solar-system': 'solar-system',
  '태양계': 'solar-system',
  'exoplanet-systems': 'exoplanet-systems',
  'exo-systems': 'exoplanet-systems', // 이전 버전 호환
  '외계 행성계': 'exoplanet-systems',
  'nebulae': 'nebulae',
  '성운': 'nebulae',
  'galaxies': 'galaxies',
  '은하': 'galaxies',
  'deep-space-extremes': 'deep-space-extremes',
  '우주의 심연': 'deep-space-extremes',
};

const resolveSectorSlug = (value) => {
  if (!value || typeof value !== 'string') {
    return 'solar-system';
  }
  return SECTOR_SLUGS[value] || 'solar-system';
};

const Sector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sectorData, setSectorData] = useState(null);
  const [celestialBodies, setCelestialBodies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isWarping, setIsWarping] = useState(false);
  const [continuousStars, setContinuousStars] = useState([]); // 로딩/워프 중 계속 생성되는 별들

  const sectorSlug = resolveSectorSlug(location.state?.sectorSlug || location.state?.sector);
  const sectorColors = getSectorColors(sectorSlug);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchSectorData = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        const response = await fetch(
          `https://spacepuzzle.onrender.com/sectors/${sectorSlug}/celestial-objects`,
          { headers, signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`섹터 데이터를 불러오지 못했습니다. (${response.status})`);
        }

        const payload = await response.json();
        const normalizedBodies = (payload?.celestialObjects || []).map((body) => ({
          id: body.id,
          name: body.title || body.name || '',
          nameEn: body.nameEn || '',
          locked: Boolean(body.locked),
          imageUrl: body.imageUrl || body.image || null,
        }));

        if (isMounted) {
          setSectorData(payload?.sector || null);
          setCelestialBodies(normalizedBodies);
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        if (isMounted) {
          setLoadError(error.message || '섹터 데이터를 불러오는 중 오류가 발생했습니다.');
          setSectorData(null);
          setCelestialBodies([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSectorData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [sectorSlug]);

  const handleEnterGameplay = () => {
    if (isLoading || loadError || isWarping) return;
    
    // 워프 애니메이션 시작
    setIsWarping(true);
    
    // 1초 후 페이지 이동
    setTimeout(() => {
      navigate('/gameplay', { state: { sectorSlug } });
    }, 1000);
  };

  // 로딩/워프 중 별 계속 생성
  useEffect(() => {
    if (!isLoading && !isWarping) {
      setContinuousStars([]);
      return;
    }

    let starId = 0;
    const interval = setInterval(() => {
      // 매 50ms마다 새로운 별 30개 추가
      const newStars = [...Array(30)].map(() => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 3 + 1;
        const dx = (left - 50) * 30;
        const dy = (top - 50) * 30;
        
        return {
          id: starId++,
          left,
          top,
          size,
          dx,
          dy,
          opacity: Math.random() * 0.7 + 0.3,
        };
      });

      setContinuousStars(prev => {
        // 최대 300개까지만 유지 (성능 고려)
        const updated = [...prev, ...newStars];
        return updated.slice(-300);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isLoading, isWarping]);

  return (
    <div className={`relative w-screen h-screen overflow-hidden bg-gradient-to-b ${sectorColors.bg}`}>
      {/* 워프 효과 + 반짝임 효과용 스타일 */}
      <style>{`
        @keyframes warpStar {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(4);
            opacity: 0;
          }
        }
        .warp-star {
          animation: warpStar 0.6s ease-out forwards;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .star-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
      
      <div className="absolute inset-0">
        {/* 기본 별 배경 (300개 - 가시성 증가) */}
        {[...Array(300)].map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const isTwinkling = Math.random() > 0.5; // 50% 확률로 반짝임 (증가)
          const size = isTwinkling ? Math.random() * 4 + 2 : Math.random() * 3 + 1; // 1-6px
          const animationDelay = Math.random() * 3;
          
          const dx = (left - 50) * 30;
          const dy = (top - 50) * 30;
          
          return (
            <div
              key={i}
              className={`absolute bg-white rounded-full ${isWarping || isLoading ? 'warp-star' : isTwinkling ? 'star-twinkle' : ''}`}
              style={{
                width: size + 'px',
                height: size + 'px',
                top: top + '%',
                left: left + '%',
                opacity: isTwinkling && !isWarping && !isLoading ? 0.5 : Math.random() * 0.5 + 0.5, // 0.5-1.0 (밝기 증가)
                '--tx': `${dx}vw`,
                '--ty': `${dy}vh`,
                animationDelay: isTwinkling && !isWarping && !isLoading ? `${animationDelay}s` : undefined,
              }}
            />
          );
        })}
        
        {/* 로딩/워프 시 계속 생성되는 별들 */}
        {continuousStars.map((star) => (
          <div
            key={`continuous-${star.id}`}
            className="absolute bg-white rounded-full warp-star"
            style={{
              width: star.size + 'px',
              height: star.size + 'px',
              top: star.top + '%',
              left: star.left + '%',
              opacity: star.opacity,
              '--tx': `${star.dx}vw`,
              '--ty': `${star.dy}vh`,
            }}
          />
        ))}
      </div>

      <button
        onClick={() => navigate('/cockpit')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-gray-900 bg-opacity-90 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg transition-all border border-gray-700 hover:border-blue-500"
      >
        <span className="text-xl">←</span>
        <span className="korean-font">조종실로</span>
      </button>

      {/* 스크롤바 스타일 */}
      <style>{`
        .sector-card::-webkit-scrollbar {
          width: 12px;
        }
        .sector-card::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .sector-card::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.6);
          border-radius: 10px;
        }
        .sector-card::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.9);
        }
      `}</style>

      <div className="relative z-10 flex items-center justify-center h-full px-8">
        <div className="sector-card max-w-4xl w-full bg-gray-900 bg-opacity-90 rounded-2xl p-8 border-2 border-blue-500 shadow-2xl max-h-[85vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-gray-400 korean-font text-xl py-12">로딩 중...</div>
          ) : loadError ? (
            <div className="text-center text-red-400 py-12">
              <p className="korean-font text-xl mb-2">데이터를 불러오지 못했습니다</p>
              <p className="korean-font text-sm text-gray-400">{loadError}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="korean-font text-5xl text-white mb-2">{sectorData?.name || '섹터'}</h1>
                <p className="text-blue-400 text-xl mb-4">{sectorData?.nameEn || ''}</p>
                
                <div className="inline-flex items-center gap-2 bg-yellow-600 bg-opacity-30 border border-yellow-500 rounded-full px-4 py-2">
                  <span className="text-2xl">⭐</span>
                  <span className="korean-font text-white">필요한 별: {sectorData?.requiredStars ?? 0}개</span>
                </div>
              </div>

              <div className="bg-gray-800 bg-opacity-70 rounded-lg p-4 mb-6">
                <p className="korean-font text-gray-300 leading-relaxed">{sectorData?.description || '섹터 설명이 없습니다.'}</p>
              </div>

              <div className="mb-6">
                <h3 className="korean-font text-2xl text-white mb-4 flex items-center gap-2">
                  <span>🌍</span>
                  <span>탐험 가능한 천체</span>
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {celestialBodies.map((body) => (
                    <div
                      key={body.id}
                      className={`relative bg-gray-800 rounded-lg p-4 border-2 ${
                        body.locked ? 'border-gray-600 opacity-60' : 'border-blue-500 opacity-90'
                      }`}
                    >
                      {body.imageUrl ? (
                        <div className="w-20 h-20 mx-auto rounded-full mb-3 overflow-hidden bg-gray-700">
                          <img
                            src={body.imageUrl}
                            alt={body.name}
                            className="w-full h-full object-cover"
                            style={{
                              filter: 'grayscale(100%)',
                              imageRendering: 'auto',
                            }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="w-20 h-20 mx-auto rounded-full mb-3 bg-gray-700"
                          style={{
                            filter: 'grayscale(100%)',
                          }}
                        />
                      )}
                      
                      <p className="korean-font text-center text-white text-sm">{body.name}</p>
                      <p className="text-center text-gray-400 text-xs">{body.nameEn}</p>
                    </div>
                  ))}
                </div>
                <p className="korean-font text-gray-400 text-center text-sm mt-3">※ 섹터 진입 후 선택 가능</p>
              </div>
            </>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={handleEnterGameplay}
              disabled={isLoading || Boolean(loadError) || isWarping}
              className={`korean-font text-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-12 py-4 rounded-lg transition-all transform hover:scale-105 border-2 border-blue-400 shadow-lg ${
                isLoading || loadError || isWarping ? 'opacity-60 cursor-not-allowed hover:scale-100' : ''
              }`}
              style={{
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
              }}
            >
              {isWarping ? '워프 중...' : '▶ 섹터 진입하기'}
            </button>
            <p className="korean-font text-gray-400 text-sm mt-2">천체를 선택하여 퍼즐을 시작하세요</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sector;
