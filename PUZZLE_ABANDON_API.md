# 퍼즐 포기 API 명세서

## 개요
사용자가 퍼즐을 포기할 때 진행 상태(저장된 데이터)를 삭제하는 API

---

## 방법 1: 저장 상태 삭제 API (권장)

### **DELETE /celestial-objects/:nasaId/state**

퍼즐 진행 상태(저장 데이터)를 삭제합니다.

#### Request

**Headers**
```
Authorization: Bearer {accessToken}
```

**URL Parameters**
- `nasaId` (string, required): 천체 ID (예: 'earth', 'mars', 'apod')

#### Response

**Success (200 OK)**
```json
{
  "message": "저장 상태가 삭제되었습니다."
}
```

**Error (404 Not Found)**
```json
{
  "error": "저장된 상태를 찾을 수 없습니다."
}
```

**Error (401 Unauthorized)**
```json
{
  "error": "인증이 필요합니다."
}
```

#### 예시

**Request**
```bash
DELETE /celestial-objects/earth/state
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**
```json
{
  "message": "저장 상태가 삭제되었습니다."
}
```

---

## 방법 2: 포기 전용 API (선택)

### **POST /celestial-objects/:nasaId/abandon**

퍼즐을 포기하고 저장 상태를 삭제합니다.

#### Request

**Headers**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**URL Parameters**
- `nasaId` (string, required): 천체 ID

**Body (Optional)**
```json
{
  "playTime": 120,
  "reason": "too_difficult"
}
```

**Body Parameters**
- `playTime` (number, optional): 플레이 시간(초)
- `reason` (string, optional): 포기 이유
  - `"too_difficult"`: 너무 어려움
  - `"not_interested"`: 관심 없음
  - `"time_constraint"`: 시간 부족
  - `"other"`: 기타

#### Response

**Success (200 OK)**
```json
{
  "message": "퍼즐을 포기했습니다.",
  "deletedState": true
}
```

**Error (404 Not Found)**
```json
{
  "error": "천체를 찾을 수 없습니다."
}
```

**Error (401 Unauthorized)**
```json
{
  "error": "인증이 필요합니다."
}
```

#### 예시

**Request**
```bash
POST /celestial-objects/earth/abandon
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "playTime": 120,
  "reason": "too_difficult"
}
```

**Response**
```json
{
  "message": "퍼즐을 포기했습니다.",
  "deletedState": true
}
```

---

## 방법 3: 기존 save API 활용 (현재 구현)

### **POST /celestial-objects/:nasaId/save**

`saveState: null`을 전송하여 저장 상태 삭제

#### Request

**Headers**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**URL Parameters**
- `nasaId` (string, required): 천체 ID

**Body**
```json
{
  "saveState": null,
  "playTime": 0
}
```

#### Response

**Success (200 OK)**
```json
{
  "message": "퍼즐 상태가 저장되었습니다."
}
```

---

## 비교

| 방법 | 장점 | 단점 | 추천도 |
|------|------|------|--------|
| DELETE /state | RESTful, 의도 명확 | 새 엔드포인트 필요 | ⭐⭐⭐⭐⭐ |
| POST /abandon | 통계 수집 가능, 의도 명확 | 새 엔드포인트 필요 | ⭐⭐⭐⭐ |
| POST /save (null) | 기존 API 활용 | 의도가 불명확, RESTful 하지 않음 | ⭐⭐⭐ |

---

## 권장 사항

**방법 1 (DELETE /state)** 사용을 권장합니다.

**이유:**
1. ✅ RESTful한 설계
2. ✅ 의도가 명확 (삭제)
3. ✅ 코드 가독성 향상
4. ✅ 에러 처리 간편

**프론트엔드 수정 예시:**
```javascript
// 포기 시
const deleteUrl = `https://spacepuzzle.onrender.com/celestial-objects/${nasaId}/state`;
await fetch(deleteUrl, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

// 완료 시
const deleteUrl = `https://spacepuzzle.onrender.com/celestial-objects/${nasaId}/state`;
await fetch(deleteUrl, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});
```

---

## 구현 체크리스트

### 백엔드
- [ ] `DELETE /celestial-objects/:nasaId/state` 엔드포인트 생성
- [ ] 인증 미들웨어 적용
- [ ] 데이터베이스에서 저장 상태 삭제 로직
- [ ] 404 에러 처리 (저장 상태 없을 때)
- [ ] 성공 응답 반환

### 프론트엔드
- [ ] `savePuzzleState` 함수에서 DELETE API 사용
- [ ] `handleGiveUp`에서 DELETE API 호출
- [ ] `completePuzzle`에서 DELETE API 호출
- [ ] 에러 처리 및 로그 추가

---

## 데이터베이스 스키마 예시

```sql
-- 저장 상태 테이블
CREATE TABLE puzzle_save_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  nasa_id VARCHAR(255) NOT NULL,
  save_state JSONB NOT NULL,
  play_time INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, nasa_id)
);

-- 인덱스
CREATE INDEX idx_save_states_user_nasa ON puzzle_save_states(user_id, nasa_id);

-- 삭제 쿼리 예시
DELETE FROM puzzle_save_states 
WHERE user_id = $1 AND nasa_id = $2;
```

---

## 보안 고려사항

1. **인증 필수**: JWT 토큰으로 사용자 인증
2. **권한 확인**: 본인의 저장 상태만 삭제 가능
3. **SQL Injection 방지**: Prepared Statement 사용
4. **Rate Limiting**: 과도한 요청 방지

---

## 테스트 케이스

### 1. 정상 삭제
```
DELETE /celestial-objects/earth/state
Authorization: Bearer {valid_token}
→ 200 OK
```

### 2. 저장 상태 없음
```
DELETE /celestial-objects/mars/state
Authorization: Bearer {valid_token}
→ 404 Not Found
```

### 3. 인증 실패
```
DELETE /celestial-objects/earth/state
→ 401 Unauthorized
```

### 4. 다른 사용자의 저장 상태
```
DELETE /celestial-objects/earth/state
Authorization: Bearer {other_user_token}
→ 403 Forbidden (옵션)
```
