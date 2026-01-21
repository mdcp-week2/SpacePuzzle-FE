import { useState, useEffect } from 'react';
import RotatingPlanet from './RotatingPlanet';

// 행성별 궤도 설정
const PLANET_ORBITS = {
  // 태양계
  'mercury': { radius: 100, speed: 0.8, size: 40, frameSpeed: 300 },
  'venus': { radius: 140, speed: 0.6, size: 50, frameSpeed: 350 },
  'earth': { radius: 180, speed: 0.5, size: 55, frameSpeed: 300 },
  'mars': { radius: 220, speed: 0.4, size: 45, frameSpeed: 320 },
  'jupiter': { radius: 280, speed: 0.25, size: 80, frameSpeed: 250 },
  'saturn': { radius: 340, speed: 0.2, size: 75, frameSpeed: 280 },
  'uranus': { radius: 390, speed: 0.15, size: 60, frameSpeed: 300 },
  'neptune': { radius: 440, speed: 0.12, size: 60, frameSpeed: 320 },
  
  // 외계행성계 (백엔드 nasaId 값과 정확히 일치, 소문자)
  'proxima b': { radius: 150, speed: 0.6, size: 55, frameSpeed: 300 },
  "barnard's star b": { radius: 200, speed: 0.5, size: 50, frameSpeed: 350 },
  'kepler-186f': { radius: 250, speed: 0.4, size: 60, frameSpeed: 320 },
  'ross 128b': { radius: 300, speed: 0.35, size: 52, frameSpeed: 340 },
  'trappist-1e': { radius: 350, speed: 0.3, size: 58, frameSpeed: 310 },
};

const PLANET_FOLDER_NAMES = {
  sun: 'Sun',
  mercury: 'Mercury',
  venus: 'Venus',
  earth: 'Earth',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune',
  'proxima centauri': 'Proxima Centauri',
  'proxima b': 'Proxima b',
  "barnard's star b": "Barnard's Star b",
  'kepler-186f': 'Kepler-186f',
  'ross 128b': 'Ross 128b',
  'trappist-1e': 'TRAPPIST-1e',
};

const getPlanetFolderName = (nasaId) => {
  const key = nasaId?.toLowerCase();
  if (!key) return '';
  return PLANET_FOLDER_NAMES[key] || `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
};

const SolarSystemView = ({ celestialBodies, selectedBody, onBodyClick, folder = 'solar-system' }) => {
  const [angles, setAngles] = useState({});
  const [draggedPlanet, setDraggedPlanet] = useState(null);
  const [planetOffsets, setPlanetOffsets] = useState({});
  const [planetVelocities, setPlanetVelocities] = useState({});
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [sunOffset, setSunOffset] = useState({ x: 0, y: 0 });
  const [sunVelocity, setSunVelocity] = useState({ x: 0, y: 0 });

  // 각 행성의 초기 각도 설정
  useEffect(() => {
    const initialAngles = {};
    const initialOffsets = {};
    const initialVelocities = {};
    celestialBodies.forEach((body) => {
      const planetKey = body.nasaId?.toLowerCase();
      if (PLANET_ORBITS[planetKey]) {
        initialAngles[body.id] = Math.random() * 360;
        initialOffsets[body.id] = { x: 0, y: 0 };
        initialVelocities[body.id] = { x: 0, y: 0 };
      }
    });
    setAngles(initialAngles);
    setPlanetOffsets(initialOffsets);
    setPlanetVelocities(initialVelocities);
  }, [celestialBodies]);

  // 공전 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setAngles((prevAngles) => {
        const newAngles = { ...prevAngles };
        celestialBodies.forEach((body) => {
          const planetKey = body.nasaId?.toLowerCase();
          const orbit = PLANET_ORBITS[planetKey];
          if (orbit && prevAngles[body.id] !== undefined) {
            newAngles[body.id] = (prevAngles[body.id] + orbit.speed) % 360;
          }
        });
        return newAngles;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [celestialBodies]);

  // 무중력 관성 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      const BOUNDARY_X = 280; // 화면 경계 (중심에서 거리)
      const BOUNDARY_Y = 300;

      setPlanetOffsets((prevOffsets) => {
        const newOffsets = { ...prevOffsets };
        Object.keys(prevOffsets).forEach((id) => {
          if (draggedPlanet !== id) {
            const velocity = planetVelocities[id] || { x: 0, y: 0 };
            if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
              let newX = prevOffsets[id].x + velocity.x;
              let newY = prevOffsets[id].y + velocity.y;

              // 경계 체크
              const body = celestialBodies.find((b) => b.id === id);
              const planetKey = body?.nasaId?.toLowerCase();
              const orbit = PLANET_ORBITS[planetKey];
              if (orbit) {
                const angle = angles[id] || 0;
                const radian = (angle * Math.PI) / 180;
                const baseX = Math.cos(radian) * orbit.radius;
                const baseY = Math.sin(radian) * orbit.radius;
                const finalX = baseX + newX;
                const finalY = baseY + newY;

                if (Math.abs(finalX) > BOUNDARY_X) {
                  newX = prevOffsets[id].x;
                }
                if (Math.abs(finalY) > BOUNDARY_Y) {
                  newY = prevOffsets[id].y;
                }
              }

              newOffsets[id] = { x: newX, y: newY };
            }
          }
        });
        return newOffsets;
      });

      // 태양 관성
      if (draggedPlanet !== 'sun') {
        if (Math.abs(sunVelocity.x) > 0.1 || Math.abs(sunVelocity.y) > 0.1) {
          setSunOffset((prev) => {
            let newX = prev.x + sunVelocity.x;
            let newY = prev.y + sunVelocity.y;

            // 태양 경계 체크
            if (Math.abs(newX) > BOUNDARY_X) newX = prev.x;
            if (Math.abs(newY) > BOUNDARY_Y) newY = prev.y;

            return { x: newX, y: newY };
          });
          setSunVelocity((prev) => ({
            x: prev.x * 0.97,
            y: prev.y * 0.97,
          }));
        }
      }

      setPlanetVelocities((prevVelocities) => {
        const newVelocities = { ...prevVelocities };
        Object.keys(prevVelocities).forEach((id) => {
          if (draggedPlanet !== id) {
            const velocity = prevVelocities[id];
            newVelocities[id] = {
              x: velocity.x * 0.97, // 감속
              y: velocity.y * 0.97,
            };
          }
        });
        return newVelocities;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [draggedPlanet, planetVelocities, sunVelocity, celestialBodies, angles]);

  const handleMouseDown = (e, bodyId) => {
    setDraggedPlanet(bodyId);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    if (bodyId === 'sun') {
      setSunVelocity({ x: 0, y: 0 });
    } else {
      setPlanetVelocities((prev) => ({ ...prev, [bodyId]: { x: 0, y: 0 } }));
    }
  };

  const handleMouseMove = (e) => {
    if (draggedPlanet) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      if (draggedPlanet === 'sun') {
        setSunOffset((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));
        setSunVelocity({ x: deltaX * 0.3, y: deltaY * 0.3 });
      } else {
        setPlanetOffsets((prev) => ({
          ...prev,
          [draggedPlanet]: {
            x: prev[draggedPlanet].x + deltaX,
            y: prev[draggedPlanet].y + deltaY,
          },
        }));
        setPlanetVelocities((prev) => ({
          ...prev,
          [draggedPlanet]: { x: deltaX * 0.3, y: deltaY * 0.3 },
        }));
      }

      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggedPlanet(null);
  };

  useEffect(() => {
    if (draggedPlanet) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedPlanet, lastMousePos]);

  // 중심 별 찾기 (태양계: sun, 외계행성계: proxima centauri 등)
  const centralStar = celestialBodies.find((body) => {
    const id = body.nasaId?.toLowerCase();
    return id === 'sun' || id === 'proxima centauri' || !PLANET_ORBITS[id];
  });
  const planets = celestialBodies.filter((body) => body !== centralStar);

  return (
    <div className="relative w-full h-[700px] flex items-center justify-center">
      {/* 궤도 원 (매우 투명하게) */}
      {Object.values(PLANET_ORBITS).map((orbit, index) => (
        <div
          key={index}
          className="absolute border border-gray-500 rounded-full"
          style={{
            width: orbit.radius * 2,
            height: orbit.radius * 2,
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* 중심 별 (태양 또는 외계 항성, 드래그 가능) */}
      {centralStar && (
        <div
          className="absolute z-10"
          style={{
            transform: `translate(${sunOffset.x}px, ${sunOffset.y}px)`,
            transition: draggedPlanet === 'sun' ? 'none' : 'transform 0.05s linear',
            cursor: centralStar.locked ? 'not-allowed' : 'grab',
          }}
          onMouseDown={(e) => {
            if (!centralStar.locked) {
              e.preventDefault();
              handleMouseDown(e, 'sun');
            }
          }}
          onClick={(e) => {
            if (!centralStar.locked && draggedPlanet !== 'sun') {
              onBodyClick(centralStar);
            }
          }}
        >
          <div
            className={`relative ${centralStar.locked ? 'opacity-40' : ''}`}
            style={{
              cursor: draggedPlanet === 'sun' ? 'grabbing' : centralStar.locked ? 'not-allowed' : 'grab',
            }}
          >
            {centralStar.locked && (
              <div className="absolute inset-0 flex items-center justify-center text-6xl z-10">
                🔒
              </div>
            )}
            
            {/* Proxima Centauri 쌍성 시스템 */}
            {centralStar.nasaId?.toLowerCase() === 'proxima centauri' ? (
              <div className="flex items-center gap-2">
                {/* Proxima Centauri A (프레임 1-2) */}
                <RotatingPlanet
                  planetName={centralStar.nasaId}
                  size={60}
                  speed={300}
                  isSelected={selectedBody?.id === centralStar.id}
                  isCleared={centralStar.isCleared}
                  folder={folder}
                  frameOffset={0}
                  frameCount={2}
                />
                {/* Proxima Centauri B (프레임 3-4) */}
                <RotatingPlanet
                  planetName={centralStar.nasaId}
                  size={60}
                  speed={350}
                  isSelected={selectedBody?.id === centralStar.id}
                  isCleared={centralStar.isCleared}
                  folder={folder}
                  frameOffset={2}
                  frameCount={2}
                />
              </div>
            ) : (
              <RotatingPlanet
                planetName={getPlanetFolderName(centralStar.nasaId) || 'Sun'}
                size={120}
                speed={200}
                isSelected={selectedBody?.id === centralStar.id}
                isCleared={centralStar.isCleared}
                folder={folder}
              />
            )}
            
            {centralStar.isCleared && !centralStar.locked && (
              <div className="absolute -top-2 -right-2 text-4xl z-10">✅</div>
            )}
          </div>
          <p className="korean-font text-white text-sm mt-2 text-center">{centralStar.name}</p>
          {centralStar.locked && (
            <p className="korean-font text-yellow-500 text-xs text-center">⭐ {centralStar.requiredStars}</p>
          )}
        </div>
      )}


      {/* 행성들 (공전 + 드래그) */}
      {planets.map((body) => {
        const planetKey = body.nasaId?.toLowerCase();
        const orbit = PLANET_ORBITS[planetKey];
        if (!orbit || angles[body.id] === undefined) return null;
        const planetFolderName = getPlanetFolderName(body.nasaId);

        const angle = angles[body.id];
        const radian = (angle * Math.PI) / 180;
        const baseX = Math.cos(radian) * orbit.radius;
        const baseY = Math.sin(radian) * orbit.radius;
        
        const offset = planetOffsets[body.id] || { x: 0, y: 0 };
        const finalX = baseX + offset.x;
        const finalY = baseY + offset.y;

        return (
          <div
            key={body.id}
            className="absolute"
            style={{
              transform: `translate(${finalX}px, ${finalY}px)`,
              transition: draggedPlanet === body.id ? 'none' : 'transform 0.05s linear',
              cursor: body.locked ? 'not-allowed' : 'grab',
            }}
            onMouseDown={(e) => {
              if (!body.locked) {
                e.preventDefault();
                handleMouseDown(e, body.id);
              }
            }}
            onClick={(e) => {
              if (!body.locked && draggedPlanet !== body.id) {
                onBodyClick(body);
              }
            }}
          >
            <div
              className={`relative ${body.locked ? 'opacity-40' : ''}`}
              style={{
                cursor: draggedPlanet === body.id ? 'grabbing' : body.locked ? 'not-allowed' : 'grab',
              }}
            >
              {body.locked && (
                <div className="absolute inset-0 flex items-center justify-center text-4xl z-10">
                  🔒
                </div>
              )}
              <RotatingPlanet
                planetName={planetFolderName}
                size={orbit.size}
                speed={orbit.frameSpeed}
                isSelected={selectedBody?.id === body.id}
                isCleared={body.isCleared}
                folder={folder}
              />
              {body.isCleared && !body.locked && (
                <div className="absolute -top-2 -right-2 text-3xl z-10">✅</div>
              )}
            </div>
            <p className="pixel-font text-white text-xs mt-1 text-center whitespace-nowrap">
              {body.name}
            </p>
            {body.locked && (
              <p className="text-yellow-500 text-xs text-center">⭐ {body.requiredStars}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SolarSystemView;
