# AI 레시피 추천 서비스 API 규격서 (v1.0)

본 문서는 냉장고 식재료 인식 및 레시피 추천에 사용되는 백엔드 API 명세서입니다.

---

## 1. 식재료 비전 인식 API

- **Endpoint**: `POST /api/vision/recognize`
- **Description**: 사용자가 첨부한 냉장고 사진을 분석하여 식별된 식재료 목록을 반환합니다.

### Request Body
```json
{
  "image": "data:image/jpeg;base64,... 또는 Base64 문자열",
  "mimeType": "image/jpeg",
  "simulateFailure": false
}
```

### Response Body

#### 1) 정상 인식 성공 (HTTP 200)
```json
{
  "success": true,
  "isRecognized": true,
  "ingredients": ["두부", "계란", "대파", "애호박", "버섯", "당근", "양파", "치즈"],
  "message": "식재료 8개 인식 완료"
}
```

#### 2) 인식 실패 / 재촬영 필요 (HTTP 200, PRD 5-1 대응)
```json
{
  "success": false,
  "isRecognized": false,
  "ingredients": [],
  "errorCode": "RECOGNITION_FAILED",
  "message": "사진에서 식재료를 식별할 수 없습니다. 재촬영 후 다시 시도해주세요."
}
```

#### 3) 잘못된 요청 (HTTP 400)
```json
{
  "success": false,
  "isRecognized": false,
  "ingredients": [],
  "errorCode": "INVALID_IMAGE",
  "message": "유효한 이미지 데이터가 전달되지 않았습니다."
}
```

---

## 2. AI 레시피 추천 API (Sprint 2 예정)

- **Endpoint**: `POST /api/recipe/recommend`
- **Description**: 인식된 식재료와 선택된 조미료를 기반으로 1~3개의 맞춤형 레시피를 생성하고 부족한 재료를 식별합니다.

### Request Body
```json
{
  "ingredients": ["두부", "계란", "대파"],
  "seasonings": ["간장", "소금", "참기름"]
}
```

### Response Body (HTTP 200)
```json
{
  "success": true,
  "recipes": [
    {
      "id": "recipe-1",
      "title": "자취생 두부 계란탕",
      "tagline": "냉장고 문 한 번만 열면 끝나는 국물 요리",
      "difficulty": "쉬움",
      "minutes": 15,
      "kcal": 320,
      "ingredients": [
        { "name": "두부 1/2모", "missing": false },
        { "name": "계란 2개", "missing": false },
        { "name": "대파 1/2대", "missing": false },
        { "name": "간장 1큰술", "missing": false },
        { "name": "멸치 다시팩", "missing": true }
      ],
      "steps": [
        "냄비에 물 500ml를 붓고 다시팩을 넣어 5분간 끓여 국물을 냅니다.",
        "두부를 한입 크기로 썰어 넣고 간장으로 간을 맞춥니다.",
        "계란을 풀어 원을 그리듯 천천히 흘려 넣습니다.",
        "대파를 올리고 마무리합니다."
      ]
    }
  ]
}
```
