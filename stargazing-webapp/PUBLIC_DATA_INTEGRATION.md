# 공공데이터 API 연결

## 연결 서비스

| 내부 ID | 공식 서비스 | 등록 오퍼레이션 | 추천 화면 사용 |
|---|---|---:|---|
| `korTour` | 국문 관광정보 서비스(KorService2) | 15 | 별 관측 키워드 검색 |
| `concentration` | 관광지 집중률 방문자 추이 예측 | 1 | 향후 집중률 조회 |
| `camping` | 고캠핑 정보 조회서비스 | 5 | 캠핑장 기본정보 조회 |
| `relatedTourism` | 관광지별 연관 관광지 정보 | 2 | 지역기반 연관 관광지 조회 |

전체 23개 오퍼레이션은 `worker/lib/public-data-registry.js` 한 곳에서 URL·파라미터·필수 여부를 관리합니다. `/api/openapi.json`은 이 레지스트리에서 자동 생성되므로 API가 추가되면 Swagger UI에도 함께 나타납니다.

## 호출 흐름

1. 브라우저가 현재 날짜·출발시각·허용된 위치 좌표를 `/api/recommendations`에 전달합니다.
2. Worker가 서버 환경 변수에서 서비스키를 읽습니다.
3. 통합 추천 유스케이스가 필요한 오퍼레이션만 병렬 호출합니다.
4. 공통 클라이언트가 필수 파라미터와 공공데이터 응답 코드를 검사합니다.
5. 서비스별 응답을 공통 장소 모델로 정규화합니다.
6. 성공·부분 성공·실패 상태와 실제 응답 건수를 화면에 전달합니다.

일부 서비스가 실패하면 성공한 실데이터만 반환하며 실패한 필드는 `null`로 남습니다. 네 서비스가 모두 실패하면 `502 ALL_SOURCES_FAILED`, 키가 없으면 `503 SERVICE_KEY_REQUIRED`입니다. 어떤 경우에도 고정 관광지나 임의 수치로 채우지 않습니다.

## 서비스키

로컬 Vite 개발 서버는 `.env.local`, Cloudflare 호환 로컬 런타임은 `.dev.vars`, 배포 환경은 비밀 환경 변수 `DATA_GO_KR_SERVICE_KEY`를 사용합니다. 공공데이터포털의 일반 인증키(Decoding)를 권장하며, Encoding 키가 들어오면 공통 클라이언트가 한 번만 디코딩합니다.

## Swagger 사용

개발 서버에서 `/api-docs.html`을 열면 등록된 모든 오퍼레이션과 파라미터를 확인하고 `Try it out`으로 호출할 수 있습니다. Swagger의 호출도 동일한 허용 목록 프록시를 거치므로 임의 URL 프록시로 악용할 수 없고, 서비스키는 브라우저에 노출되지 않습니다.

## 실데이터 확인 순서

1. `/api/health`에서 `publicDataConfigured: true` 확인
2. `/api/public-data/korTour/searchKeyword?keyword=천문대` 호출
3. `/api/recommendations`에서 `mode`, `sources`, `destinations` 확인
4. 화면의 데이터 출처 영역에서 서비스별 응답 건수 확인
