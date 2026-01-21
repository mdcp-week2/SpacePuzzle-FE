import { useState, useEffect } from 'react';

const PLANET_FRAMES = {
  // 태양계
  Sun: 30,
  Mercury: 8,
  Venus: 8,
  Earth: 8,
  Mars: 8,
  Jupiter: 8,
  Saturn: 8,
  Uranus: 8,
  Neptune: 8,
  
  // 외계행성 (백엔드 nasaId 값과 정확히 일치)
  'Proxima Centauri': 4,
  'Proxima b': 120,
  "Barnard's Star b": 60,
  'Kepler-186f': 60,
  'Ross 128b': 60,
  'TRAPPIST-1e': 60,
};

const RotatingPlanet = ({ 
  planetName, 
  size = 100, 
  speed = 200, 
  onClick, 
  isSelected = false, 
  isCleared = false, 
  folder = 'solar-system',
  frameOffset = 0,  // 시작 프레임 오프셋
  frameCount = null // 사용할 프레임 수 (null이면 PLANET_FRAMES 사용)
}) => {
  const totalFrames = frameCount || PLANET_FRAMES[planetName] || 8;
  const [currentFrame, setCurrentFrame] = useState(0);
  
  console.log('🪐 RotatingPlanet:', { planetName, folder, totalFrames });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, speed);

    return () => clearInterval(interval);
  }, [totalFrames, speed]);

  // 동적 import를 위해 프레임 이미지 배열 생성 (섹터별 폴더 지원)
  const getFramePath = () => {
    try {
      // frameOffset을 더해서 실제 파일 번호 계산 (1-based index)
      const actualFrame = frameOffset + currentFrame + 1;
      const path = `../../assets/${folder}/${planetName}/${actualFrame}.png`;
      console.log('🖼️ 이미지 경로:', path);
      return new URL(path, import.meta.url).href;
    } catch (error) {
      console.error('❌ 이미지 경로 생성 실패:', error);
      return '';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-110 drop-shadow-2xl' : 'hover:scale-105'
      }`}
      style={{
        width: size,
        height: size,
      }}
    >
      <img
        src={getFramePath()}
        alt={planetName}
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          filter: isCleared ? 'none' : 'grayscale(100%)',
          transition: 'filter 0.5s ease',
        }}
        className={`${isSelected ? 'animate-pulse' : ''}`}
      />
    </div>
  );
};

export default RotatingPlanet;
