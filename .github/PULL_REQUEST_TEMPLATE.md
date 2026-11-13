## 변경 사항

### 앱 (client)
- 화면 UI 구현
  - Welcome, 아이디 로그인, 회원가입
  - 하단 탭 4개: 홈, 질문, 기록, 프로필
  - 질문 흐름: 질문 생성 중, 생성 실패, 답변 채팅, 피드백
  - 기록 상세, 기록 빈 상태
- 공통 컴포넌트: 버튼, 입력창, 칩, 내비게이션 바, 바텀 시트 등
- 회원가입, 로그인 API 연동

### 서버 (server)
- DB 스키마, 시드 데이터, 초기화 스크립트 (`npm run db:init`)
- `POST /api/auth/register`: 회원가입. 입력값 검증, bcrypt로 비밀번호 저장
- `POST /api/auth/login`: 로그인. 성공하면 14일 유효한 JWT 발급
- `GET /api/job-roles`: 직무 목록
- Swagger 문서 (`/docs`)
