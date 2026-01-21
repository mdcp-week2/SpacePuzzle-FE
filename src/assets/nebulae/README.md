# 성운(Nebulae) 애셋 폴더

이 폴더에는 성운 섹터의 천체 애니메이션과 이미지를 저장합니다.

## 📁 폴더 구조

각 성운별로 하위 폴더를 만들고, 애니메이션 파일들을 넣어주세요:

```
nebulae/
├── Orion Nebula/
│   ├── animation.json      (애니메이션 데이터)
│   ├── nebula.png          (이미지 파일)
├── Crab Nebula/
│   ├── animation.json
│   ├── nebula.png
├── Eagle Nebula/
│   ├── animation.json
│   ├── nebula.png
└── ...
```

## 📋 파일 명명 규칙

### 폴더명
- 백엔드 API의 `nameEn` 값과 정확히 일치
- 공백 포함 가능 (예: `Orion Nebula`)

### 파일명
각 성운 폴더 안에 다음 파일들:
- **`animation.json`**: 애니메이션 데이터 (Lottie 또는 스프라이트시트 정보)
- **`nebula.png`**: 성운 이미지 또는 스프라이트시트

## 🎨 특징

- **중심 별 없음**: 성운만 표시
- **무중력 효과**: 드래그하면 관성으로 떠다님
- **큰 크기**: 시각적 임팩트
- **경계 제한**: 화면 밖으로 나가지 않음

## 💡 파일 형식

지원하는 형식:
1. **Lottie 애니메이션**: `animation.json` + 에셋 이미지
2. **스프라이트시트**: `nebula.png` (모든 프레임 포함) + `animation.json` (프레임 정보)
3. **단순 PNG**: `nebula.png` (정적 이미지)

## 예시

오리온 성운 (Orion Nebula):
- `Orion Nebula/animation.json`
- `Orion Nebula/nebula.png`

## 주의사항

- 폴더명은 백엔드 `nameEn`과 정확히 일치해야 함
- JSON과 PNG 파일은 항상 쌍으로 존재
- 이미지는 투명 배경 권장
- 권장 크기: 800x800px 이상 (큰 크기)
