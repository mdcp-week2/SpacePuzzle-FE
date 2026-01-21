import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import earthImg from '../assets/celestial/earth.jpg';
import rocketImg from '../assets/tutorial/rocket.png';
import launchpadImg from '../assets/tutorial/launchpad.png';
import smokeParticleImg from '../assets/tutorial/smoke-particle.png';
import cloudImg from '../assets/tutorial/cloud.png';
import AnimatedEngineFire from '../components/AnimatedEngineFire';

const Tutorial = () => {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(1);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);

    // Scene 1 → Scene 2 (4초 후)
    const timer1 = setTimeout(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentScene(2);
        setFadeIn(true);
      }, 500);
    }, 4000);

    // Scene 2 → Scene 3 (8초 후)
    const timer2 = setTimeout(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentScene(3);
        setFadeIn(true);
      }, 500);
    }, 8000);

    // Scene 3 → 퍼즐 시작 (12초 후)
    const timer3 = setTimeout(() => {
      navigate('/puzzle', {
        state: {
          celestialBody: {
            id: 'earth',
            name: '지구',
            nameEn: 'Earth',
            difficulty: '쉬움',
            gridSize: 3,
            rewardStars: 3,
            image: earthImg,
          },
          sectorSlug: 'solar-system',
          isTutorial: true, // 튜토리얼 플래그
        }
      });
    }, 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigate]);

  const handleSkip = () => {
    navigate('/puzzle', {
      state: {
        celestialBody: {
          id: 'earth',
          name: '지구',
          nameEn: 'Earth',
          difficulty: '쉬움',
          gridSize: 3,
          rewardStars: 3,
          image: earthImg,
        },
        sectorSlug: 'solar-system',
        isTutorial: true, // 튜토리얼 플래그
      }
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black korean-font">
      {/* CSS 애니메이션 정의 */}
      <style>{`
        @keyframes rocketLaunch {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-200vh) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes engineFire {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1) translateY(0);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.2) translateY(10px);
          }
        }

        @keyframes smoke {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-150px) scale(2);
            opacity: 0;
          }
        }

        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2px, 2px); }
          20% { transform: translate(2px, -2px); }
          30% { transform: translate(-2px, -2px); }
          40% { transform: translate(2px, 2px); }
          50% { transform: translate(-2px, 2px); }
          60% { transform: translate(2px, -2px); }
          70% { transform: translate(-2px, -2px); }
          80% { transform: translate(2px, 2px); }
          90% { transform: translate(-2px, -2px); }
        }

        @keyframes skyTransition {
          0% { background: linear-gradient(to bottom, #ff6b35, #f7931e, #ffd700); }
          50% { background: linear-gradient(to bottom, #1e3a8a, #3b82f6, #60a5fa); }
          100% { background: linear-gradient(to bottom, #000000, #1a1a2e, #16213e); }
        }

        @keyframes speedLine {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes cloudPass {
          0% {
            transform: translateY(-20vh);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh);
            opacity: 0;
          }
        }

        @keyframes orbitFloat {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes earthPulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.2);
          }
        }

        @keyframes pixelShatter {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes textGlitch {
          0%, 100% { 
            transform: translate(0);
            opacity: 1;
          }
          20% { 
            transform: translate(-2px, 2px);
            opacity: 0.8;
          }
          40% { 
            transform: translate(2px, -2px);
            opacity: 0.9;
          }
          60% { 
            transform: translate(-2px, -2px);
            opacity: 0.7;
          }
          80% { 
            transform: translate(2px, 2px);
            opacity: 0.85;
          }
        }
      `}</style>

      {/* Skip 버튼 */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-50 korean-font bg-gray-700 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg transition-all border border-gray-500"
      >
        Skip →
      </button>

      {/* Scene 1: 발사 준비 */}
      {currentScene === 1 && (
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'linear-gradient(to bottom, #ff6b35, #f7931e, #ffd700)',
            animation: 'screenShake 0.3s infinite',
          }}
        >
          {/* 발사대 */}
          <img
            src={launchpadImg}
            alt="launchpad"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{
              height: '180px',
              imageRendering: 'pixelated',
            }}
          />

          {/* 로켓 */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
            <img
              src={rocketImg}
              alt="rocket"
              style={{
                height: '200px',
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
              }}
            />
            
            {/* 엔진 불꽃 애니메이션 */}
            <div 
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
            >
              <AnimatedEngineFire size={100} />
            </div>
          </div>

          {/* 연기 입자 */}
          {[...Array(20)].map((_, i) => (
            <img
              key={i}
              src={smokeParticleImg}
              alt="smoke"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                height: '40px',
                imageRendering: 'pixelated',
                animation: `smoke ${1.5 + Math.random() * 0.5}s ease-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                marginLeft: `${(Math.random() - 0.5) * 120}px`,
              }}
            />
          ))}

          {/* 시스템 체크 텍스트 */}
          <div className="absolute bottom-32 left-8 space-y-1">
            <p className="korean-font text-green-400 text-sm">✓ System Check: OK</p>
            <p className="korean-font text-green-400 text-sm">✓ Fuel Level: 100%</p>
            <p className="korean-font text-yellow-400 text-sm animate-pulse">⚡ Ignition Sequence Start</p>
          </div>

          {/* 중앙 텍스트 */}
          <div className="absolute top-20 left-0 right-0 text-center">
            <p className="korean-font text-white text-4xl mb-4 drop-shadow-lg">🛰️ 발사 준비</p>
            <p className="korean-font text-yellow-300 text-xl">지구 탐사 임무를 시작합니다</p>
          </div>
        </div>
      )}

      {/* Scene 2: 성층권 돌파 */}
      {currentScene === 2 && (
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
          style={{
            animation: 'skyTransition 4s ease-in-out forwards',
          }}
        >
          {/* 상승하는 로켓 */}
          <div 
            className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2"
            style={{ animation: 'rocketLaunch 4s ease-in forwards' }}
          >
            <img
              src={rocketImg}
              alt="rocket"
              style={{
                height: '150px',
                imageRendering: 'pixelated',
              }}
            />
            <div 
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <AnimatedEngineFire size={80} />
            </div>
          </div>

          {/* 속도선 (Speed lines) */}
          {[...Array(30)].map((_, i) => (
            <div
              key={`speed-${i}`}
              className="absolute w-1 bg-white rounded-full"
              style={{
                left: `${10 + (i % 10) * 10}%`,
                height: `${30 + Math.random() * 50}px`,
                animation: `speedLine ${0.5 + Math.random() * 0.5}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.6,
              }}
            />
          ))}

          {/* 구름들 */}
          {[...Array(12)].map((_, i) => (
            <img
              key={`cloud-${i}`}
              src={cloudImg}
              alt="cloud"
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                height: '60px',
                imageRendering: 'pixelated',
                animation: `cloudPass ${2 + Math.random()}s ease-in infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

          {/* 중앙 텍스트 */}
          <div className="absolute top-1/3 left-0 right-0 text-center">
            <p className="korean-font text-white text-4xl mb-4 drop-shadow-lg">🌌 성층권 돌파</p>
            <p className="korean-font text-blue-300 text-xl">우주로 향하는 중...</p>
          </div>

          {/* 고도 표시 */}
          <div className="absolute top-20 right-8">
            <p className="korean-font text-green-400 text-lg">고도: 상승 중</p>
            <p className="korean-font text-yellow-400 text-lg animate-pulse">속도: MAX</p>
          </div>
        </div>
      )}

      {/* Scene 3: 궤도 진입 및 지구 스캔 */}
      {currentScene === 3 && (
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* 별 배경 */}
          {[...Array(100)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}

          {/* 우주선 */}
          <div 
            className="absolute top-20 left-1/2 transform -translate-x-1/2"
            style={{ animation: 'orbitFloat 3s ease-in-out infinite' }}
          >
            <div className="text-7xl">🛸</div>
          </div>

          {/* 지구 (하단 곡선) */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div 
              className="relative"
              style={{ animation: 'earthPulse 2s ease-in-out infinite' }}
            >
              <img
                src={earthImg}
                alt="Earth"
                className="w-96 h-96 rounded-full object-cover"
                style={{
                  boxShadow: '0 0 80px rgba(59, 130, 246, 0.6)',
                  filter: 'brightness(0.9)',
                }}
              />
              
              {/* 스캔 라인 */}
              <div 
                className="absolute inset-0 border-4 border-blue-400 rounded-full"
                style={{
                  animation: 'pixelShatter 2s ease-out infinite',
                }}
              />
            </div>
          </div>

          {/* 중앙 텍스트 */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 text-center">
            <p 
              className="korean-font text-red-400 text-3xl mb-4"
              style={{ animation: 'textGlitch 0.5s ease-in-out infinite' }}
            >
              ⚠️ 데이터 송신 실패
            </p>
            <p className="korean-font text-yellow-300 text-xl mb-2">지구 위치 정보 손실</p>
            <p className="korean-font text-gray-300 text-lg">조각난 데이터를 복구하십시오...</p>
          </div>

          {/* 시스템 메시지 */}
          <div className="absolute top-8 left-8 space-y-1">
            <p className="korean-font text-green-400 text-sm">✓ 궤도 진입 성공</p>
            <p className="korean-font text-blue-400 text-sm">✓ 시스템 안정화</p>
            <p className="korean-font text-red-400 text-sm animate-pulse">✗ 데이터 동기화 실패</p>
          </div>

          {/* 카운트다운 */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="korean-font text-gray-400 text-sm">복구 시스템 초기화 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
