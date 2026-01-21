# 조종석 동적 배경 폴더

이 폴더에 조종석의 동적 배경 이미지/애니메이션을 넣어주세요.

## 📁 파일 위치
```
src/assets/cockpit/backgrounds/
```

## 🎨 지원 형식
- **GIF**: 애니메이션 GIF (별똥별, 우주 먼지 등)
- **PNG**: 투명 배경 PNG (레이어링용)
- **WebP**: 애니메이션 WebP
- **MP4/WebM**: 비디오 배경 (선택사항)

## 💡 추천 파일명
- `stars-moving.gif` - 움직이는 별들
- `space-particles.gif` - 우주 먼지 효과
- `nebula-flow.gif` - 흐르는 성운
- `warp-effect.gif` - 워프 효과
- `cockpit-ambient.gif` - 조종석 주변 효과

## 📐 권장 크기
- **가로**: 1920px 이상
- **세로**: 900px 이상 (조종석 높이에 맞춤)
- **파일 크기**: 5MB 이하 (성능 최적화)

## 🚀 사용 예시
```javascript
// Cockpit.jsx에서 사용
import cockpitBg from '../assets/cockpit/backgrounds/stars-moving.gif';

<div style={{ backgroundImage: `url(${cockpitBg})` }}>
  ...
</div>
```

## 🎯 효과 아이디어
1. **움직이는 별들**: 좌→우 or 우→좌로 흐르는 별
2. **우주 먼지**: 천천히 떠다니는 파티클
3. **에너지 흐름**: 조종석 주변 에너지선
4. **워프 준비**: 워프 직전 효과
5. **행성 이동**: 배경에서 천천히 지나가는 행성

---
파일을 이 폴더에 넣으시면 바로 적용해드리겠습니다! 🌌
