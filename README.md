# 별보러간다

한국관광공사 공공데이터를 조합해 강원권 별 관측 후보를 찾는 React·TypeScript·Tailwind 웹앱입니다. 관광지·집중률·캠핑장·연관 관광지 값은 API 응답에서만 가져오며, 서비스키가 없거나 원본 API가 실패해도 가짜 장소와 수치로 대체하지 않습니다.

## 화면 동선

1. `/` — 서비스 원칙과 데이터 출처를 소개하는 시작 화면
2. `/planner` — 현재 위치·날짜·시간 입력, 실데이터 후보 조회와 설명 가능한 점수
3. `/map` — 관광정보 좌표를 OpenStreetMap에서 확인하고 직선거리 기반 참고 이동값 확인
4. `/trips` — 선택 장소, 고캠핑 등록지, 연관 관광지를 묶은 여정 저장·공유
5. `/alerts` — 실제로 연결된 관광지 집중률 변화 알림 설정
6. `/api-docs.html` — 등록된 전체 API를 실행해 볼 수 있는 Swagger UI

## API 구조

- `/api/recommendations` — 화면용 통합 조회. 필요한 API만 병렬 호출하고 결과를 정규화합니다.
- `/api/catalog` — 등록된 4개 서비스, 23개 오퍼레이션의 기계 판독 카탈로그입니다.
- `/api/openapi.json` — OpenAPI 3.1 문서입니다.
- `/api/public-data/{service}/{operation}` — 등록된 오퍼레이션만 허용하는 서버 측 프록시입니다.
- `/api/health` — 서버와 서비스키 설정 상태를 확인합니다.

브라우저에는 인증키가 전달되지 않습니다. 모든 외부 호출은 Worker의 공통 클라이언트를 거치며 필수 파라미터, HTTP 상태, 공공데이터 `resultCode`를 검사합니다. API 전체를 매번 호출하면 개발계정 일일 트래픽을 낭비하므로 전체 명세는 Swagger로 열어 두고, 추천 화면은 실제로 필요한 오퍼레이션만 호출합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

`.env.example`을 참고해 `.env.local`에 공공데이터포털 일반 인증키(Decoding)를 넣습니다.

```dotenv
DATA_GO_KR_SERVICE_KEY=발급받은_일반_인증키
```

Cloudflare 호환 로컬 런타임을 쓸 때는 같은 값을 `.dev.vars`에 둘 수 있습니다. 두 파일과 실제 인증키는 Git에 커밋하지 않습니다. 키를 넣지 않으면 `/api/recommendations`는 의도적으로 `503 SERVICE_KEY_REQUIRED`를 반환하며 화면은 연결 방법을 안내합니다.

## 구조

```text
src/
  api/                     # 브라우저 API 계약과 호출 함수
  app/                     # 라우팅
  components/              # 공통 셸과 데이터 상태 UI
  domain/                  # 플래너·장소·참고 이동 도메인
  features/recommendations # 추천 조회 상태 훅
  lib/                     # 현재 시간·위치, 추천 점수
  pages/                   # 5개 화면
worker/
  api/                     # 통합 추천 유스케이스
  config/                  # 행정·서비스 코드 설정
  lib/                     # API 레지스트리, 클라이언트, 정규화
  index.js                 # Worker 라우터
  openapi.js               # OpenAPI 문서 생성
```

## 추천 점수 원칙

점수는 응답에 실제로 존재하는 항목만 사용하고, 사용할 수 있는 가중치 합으로 다시 정규화합니다. 현재 가중치는 혼잡 회피 38%, 관측 하늘 28%, 주차 안정 12%, 이동 효율 12%, 접근 편의 10%입니다. 값이 하나도 없으면 점수를 만들지 않고 `제공 안 됨`으로 표시합니다. 직선거리 기반 이동시간은 원본 API 값이 아니라는 점을 UI에서 `참고 추정`으로 명시합니다.

## 검증

```bash
npm run typecheck
npm test
npm run build
```

프로덕션 빌드는 프론트와 모듈형 Worker 전체를 `dist`에 패키징합니다. PWA 서비스 워커는 앱 셸만 캐시하며 API 실패 시 가짜 응답을 생성하지 않습니다.
