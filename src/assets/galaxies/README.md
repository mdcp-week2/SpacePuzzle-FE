# 은하(Galaxies) 애셋 폴더

이 폴더에는 은하 섹터의 천체 애니메이션과 이미지를 저장합니다.

## 📁 폴더 구조

각 은하별로 하위 폴더를 만들고, 애니메이션 파일들을 넣어주세요:

```
galaxies/
├── Andromeda Galaxy/
│   ├── Andromeda Galaxy.json      (애니메이션 데이터)
│   └── Andromeda Galaxy.png       (이미지 파일)
├── Milky Way/
│   ├── Milky Way.json
│   └── Milky Way.png
├── Whirlpool Galaxy/
│   ├── Whirlpool Galaxy.json
│   └── Whirlpool Galaxy.png
└── ...
```

## 📋 파일 명명 규칙

### 폴더명
- 백엔드 API의 `nameEn` 값과 정확히 일치
- 공백 포함 가능 (예: `Andromeda Galaxy`)

### 파일명
각 은하 폴더 안에 다음 파일들:
- **`[은하 이름].json`**: 애니메이션 데이터 (Aseprite 스프라이트시트)
- **`[은하 이름].png`**: 은하 이미지 또는 스프라이트시트
- 또는 **`[은하 이름]-sheet.png`**: 스프라이트시트 (자동 감지)

## 🎨 특징 (성운과 동일)

- **중심 별 없음**: 은하만 표시
- **무중력 효과**: 드래그하면 관성으로 떠다님
- **자유로운 움직임**: 천천히 자동으로 떠다님
- **경계 제한**: 화면 밖으로 나가지 않음
- **튕기는 효과**: 벽에 부딪히면 반사

## 💡 파일 형식

성운과 동일한 형식 지원:
- **Aseprite 스프라이트시트**: JSON + PNG
- **자동 파일명 감지**: `.png` 또는 `-sheet.png`

## 예시

안드로메다 은하 (Andromeda Galaxy):
- `Andromeda Galaxy/Andromeda Galaxy.json`
- `Andromeda Galaxy/Andromeda Galaxy.png`

또는

- `Andromeda Galaxy/Andromeda_Galaxy.json` (언더스코어도 가능)
- `Andromeda Galaxy/Andromeda_Galaxy.png`

## 주의사항

- 폴더명은 백엔드 `nameEn`과 정확히 일치해야 함
- JSON과 PNG 파일은 항상 쌍으로 존재
- 이미지는 투명 배경 권장
- 권장 크기: 스프라이트시트의 각 프레임 32x32px 이상

## 🚀 사용 방법

1. 이 폴더에 은하 이미지와 JSON 파일 배치
2. `GalaxyView` 컴포넌트가 자동으로 로드 (성운과 동일한 방식)
3. GamePlay.jsx에서 자동으로 은하 섹터 감지
