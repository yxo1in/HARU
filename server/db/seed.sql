-- =====================================================================
--  HARU 기본 데이터 (직무 목록 + 기본 질문)
--  schema.sql 실행 후에 실행된다. (npm run db:init 이 순서대로 처리)
-- =====================================================================

USE haru;

-- ---------------------------------------------------------------------
--  직무 목록
-- ---------------------------------------------------------------------
INSERT INTO job_roles (name, sort_order) VALUES
  ('프론트엔드 개발자', 1),
  ('백엔드 개발자',     2),
  ('모바일 앱 개발자',  3),
  ('데이터 분석가',     4),
  ('UI/UX 디자이너',    5),
  ('서비스 기획자',     6);

-- ---------------------------------------------------------------------
--  공통 질문 (job_role_id = NULL → 모든 직무에 출제)
-- ---------------------------------------------------------------------
INSERT INTO questions (job_role_id, category, content) VALUES
  -- 자기소개
  (NULL, 'intro',       '1분 동안 자기소개를 해주세요.'),
  (NULL, 'intro',       '본인을 한 문장으로 표현한다면 어떻게 말하시겠어요?'),
  (NULL, 'intro',       '본인의 가장 큰 강점과 그것을 보여주는 경험을 말씀해 주세요.'),

  -- 지원동기
  (NULL, 'motivation',  '우리 회사에 지원한 이유는 무엇인가요?'),
  (NULL, 'motivation',  '이 직무를 선택하게 된 계기는 무엇인가요?'),
  (NULL, 'motivation',  '5년 뒤 본인의 모습은 어떨 것이라고 생각하나요?'),

  -- 인성
  (NULL, 'personality', '팀원과 의견이 충돌했던 경험과 어떻게 해결했는지 말씀해 주세요.'),
  (NULL, 'personality', '실패했던 경험과 그로부터 배운 점은 무엇인가요?'),
  (NULL, 'personality', '마감 기한이 촉박한 상황에서 어떻게 우선순위를 정하나요?'),
  (NULL, 'personality', '스트레스를 받을 때 어떻게 해소하나요?');

-- ---------------------------------------------------------------------
--  직무별 기술 질문
--  (SELECT id FROM job_roles WHERE name = ...) 로 직무 id 를 찾아 넣는다
-- ---------------------------------------------------------------------
INSERT INTO questions (job_role_id, category, content) VALUES
  -- 프론트엔드
  ((SELECT id FROM job_roles WHERE name = '프론트엔드 개발자'), 'technical',
   '브라우저에 URL 을 입력했을 때 화면이 그려지기까지의 과정을 설명해 주세요.'),
  ((SELECT id FROM job_roles WHERE name = '프론트엔드 개발자'), 'technical',
   'React 에서 상태 관리를 어떻게 설계하는 편인가요? 그 이유도 함께 말씀해 주세요.'),
  ((SELECT id FROM job_roles WHERE name = '프론트엔드 개발자'), 'technical',
   '웹 성능을 개선했던 경험이 있다면 어떤 방법을 썼는지 설명해 주세요.'),

  -- 백엔드
  ((SELECT id FROM job_roles WHERE name = '백엔드 개발자'), 'technical',
   'REST API 를 설계할 때 신경 쓰는 원칙은 무엇인가요?'),
  ((SELECT id FROM job_roles WHERE name = '백엔드 개발자'), 'technical',
   '데이터베이스 인덱스는 언제, 왜 사용하나요?'),
  ((SELECT id FROM job_roles WHERE name = '백엔드 개발자'), 'technical',
   '트랜잭션이 필요한 상황을 예로 들어 설명해 주세요.'),

  -- 모바일
  ((SELECT id FROM job_roles WHERE name = '모바일 앱 개발자'), 'technical',
   '네이티브 앱과 크로스 플랫폼 앱의 장단점을 비교해 주세요.'),
  ((SELECT id FROM job_roles WHERE name = '모바일 앱 개발자'), 'technical',
   '앱에서 네트워크가 불안정할 때 사용자 경험을 어떻게 지키나요?'),

  -- 데이터 분석
  ((SELECT id FROM job_roles WHERE name = '데이터 분석가'), 'technical',
   '분석 결과를 비전공자에게 설명해야 한다면 어떻게 전달하시겠어요?'),
  ((SELECT id FROM job_roles WHERE name = '데이터 분석가'), 'technical',
   '데이터에 결측치나 이상치가 많을 때 어떻게 처리하나요?'),

  -- UI/UX
  ((SELECT id FROM job_roles WHERE name = 'UI/UX 디자이너'), 'technical',
   '사용자 리서치 결과를 디자인에 반영했던 경험을 말씀해 주세요.'),
  ((SELECT id FROM job_roles WHERE name = 'UI/UX 디자이너'), 'technical',
   '개발자와 협업할 때 디자인 의도를 어떻게 전달하나요?'),

  -- 기획
  ((SELECT id FROM job_roles WHERE name = '서비스 기획자'), 'technical',
   '기능 우선순위를 정할 때 어떤 기준을 사용하나요?'),
  ((SELECT id FROM job_roles WHERE name = '서비스 기획자'), 'technical',
   '출시한 기능의 성과를 어떤 지표로 측정하시겠어요?');
