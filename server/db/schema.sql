  -- =====================================================================
  --  HARU 데이터베이스 스키마
  --  실행: npm run db:init  (server 폴더에서)
  --  MySQL 8.0.16 이상 필요 (CHECK 제약, 생성 컬럼 사용)
  -- =====================================================================

  CREATE DATABASE IF NOT EXISTS haru
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

  USE haru;

  -- 재실행 시 깨끗하게 다시 만들기 위해 FK 역순으로 삭제
  DROP TABLE IF EXISTS feedbacks;
  DROP TABLE IF EXISTS answers;
  DROP TABLE IF EXISTS questions;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS job_roles;


  -- ---------------------------------------------------------------------
  --  job_roles : 지원 직무 목록 (프론트엔드, 백엔드 ...)
  --  - 관리자가 미리 넣어두는 고정 데이터. 사용자는 선택만 한다.
  -- ---------------------------------------------------------------------
  CREATE TABLE job_roles (
    id         INT AUTO_INCREMENT PRIMARY KEY
              COMMENT '직무 고유 번호',
    name       VARCHAR(50) NOT NULL UNIQUE
              COMMENT '직무 이름 (예: 백엔드 개발자). 중복 불가',
    sort_order INT NOT NULL DEFAULT 0
              COMMENT '화면에 보여줄 순서. 작을수록 위에 표시'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='지원 직무 목록';


  -- ---------------------------------------------------------------------
  --  users : 회원 정보
  --  - 로그인 방식이 두 가지(자체 ID / 구글)라서 provider 로 구분한다.
  --  - local  : login_id + password_hash 사용, google_sub 는 NULL
  --  - google : google_sub 사용, login_id / password_hash 는 NULL
  --  - 아래 CHECK 제약이 위 조합을 DB 레벨에서 강제한다.
  -- ---------------------------------------------------------------------
  CREATE TABLE users (
    id            INT AUTO_INCREMENT PRIMARY KEY
                  COMMENT '회원 고유 번호',
    provider      ENUM('local','google') NOT NULL
                  COMMENT '가입 방식. local=아이디/비밀번호, google=구글 로그인',
    login_id      VARCHAR(50) NULL UNIQUE
                  COMMENT '자체 로그인용 아이디. local 회원만 사용, 중복 불가',
    password_hash VARCHAR(255) NULL
                  COMMENT '비밀번호 해시(bcrypt). 평문 저장 금지. local 회원만 사용',
    google_sub    VARCHAR(255) NULL UNIQUE
                  COMMENT '구글 계정 고유 ID(sub 클레임). google 회원만 사용, 중복 불가',
    email         VARCHAR(255) NULL
                  COMMENT '이메일. 구글 가입 시 자동 저장, local 은 선택 입력',
    nickname      VARCHAR(50) NOT NULL UNIQUE
                  COMMENT '화면에 표시되는 닉네임. 중복 불가',
    job_role_id   INT NULL
                  COMMENT '희망 직무(job_roles.id). 아직 선택 안 했으면 NULL',
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                  COMMENT '가입 일시',
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                  COMMENT '프로필 마지막 수정 일시. 행이 바뀌면 자동 갱신',

    -- 직무가 삭제되면 회원의 희망 직무만 NULL 로 바뀌고 회원은 유지
    CONSTRAINT fk_users_job_role FOREIGN KEY (job_role_id)
      REFERENCES job_roles(id) ON DELETE SET NULL,

    -- 가입 방식에 맞는 컬럼이 반드시 채워져 있어야 함
    CONSTRAINT chk_users_provider CHECK (
      (provider = 'local'  AND login_id IS NOT NULL AND password_hash IS NOT NULL) OR
      (provider = 'google' AND google_sub IS NOT NULL)
    )
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='회원 정보 및 희망 직무';


  -- ---------------------------------------------------------------------
  --  questions : 면접 질문
  --  - job_role_id 가 NULL 이면 모든 직무에 공통으로 나가는 질문
  --  - created_for_user_id 가 NULL 이면 모두에게 공용,
  --    값이 있으면 AI 가 그 회원만을 위해 만든 질문 (다른 회원에게 안 나감)
  --  - 답변이 참조하고 있어서 삭제 대신 is_active=0 으로 숨긴다
  -- ---------------------------------------------------------------------
  CREATE TABLE questions (
    id                  INT AUTO_INCREMENT PRIMARY KEY
                        COMMENT '질문 고유 번호',
    job_role_id         INT NULL
                        COMMENT '대상 직무(job_roles.id). NULL 이면 모든 직무 공통 질문',
    created_for_user_id INT NULL
                        COMMENT 'AI 가 특정 회원용으로 만든 질문이면 그 회원 id. NULL 이면 공용 질문',
    category            ENUM('intro','motivation','personality','technical') NOT NULL
                        COMMENT '질문 유형. intro=자기소개, motivation=지원동기, personality=인성, technical=기술',
    content             VARCHAR(500) NOT NULL
                        COMMENT '질문 본문',
    source              ENUM('preset','ai') NOT NULL DEFAULT 'preset'
                        COMMENT '출처. preset=미리 등록한 질문, ai=AI 가 생성한 질문',
    is_active           TINYINT(1) NOT NULL DEFAULT 1
                        COMMENT '출제 여부. 0 이면 더 이상 출제하지 않음 (삭제 대신 사용)',
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                        COMMENT '질문 등록 일시',

    CONSTRAINT fk_questions_job_role FOREIGN KEY (job_role_id)
      REFERENCES job_roles(id) ON DELETE SET NULL,

    -- 회원 탈퇴 시 그 회원 전용 AI 질문도 함께 삭제
    CONSTRAINT fk_questions_user FOREIGN KEY (created_for_user_id)
      REFERENCES users(id) ON DELETE CASCADE,

    -- 오늘의 질문 뽑기: 직무 + 활성 + 공용/본인 전용 조건으로 조회
    INDEX idx_questions_pick (job_role_id, is_active, created_for_user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='면접 질문 (공용 + AI 생성)';


  -- ---------------------------------------------------------------------
  --  answers : 사용자 답변
  --  - 하루 한 번 규칙: 한국 시간 0시 기준으로 하루에 정식 답변 1개
  --  - 재답변(같은 질문 다시 답하기)은 retry_of_answer_id 에 원본을 넣는다
  --    → 피드백은 받지만 하루 1회 제한과 점수 그래프에서는 제외
  --  - daily_key 는 정식 답변이면 날짜, 재답변이면 NULL 이 자동으로 들어가는
  --    생성 컬럼(VIRTUAL). UNIQUE 인덱스는 NULL 을 중복으로 보지 않으므로
  --    정식 답변에만 "하루 한 번"이 걸린다.
  --    ※ STORED 로 하면 retry_of_answer_id 의 CASCADE FK 를 MySQL 이 거부하므로 VIRTUAL 사용
  -- ---------------------------------------------------------------------
  CREATE TABLE answers (
    id                 INT AUTO_INCREMENT PRIMARY KEY
                      COMMENT '답변 고유 번호',
    user_id            INT NOT NULL
                      COMMENT '답변한 회원(users.id)',
    question_id        INT NOT NULL
                      COMMENT '답변한 질문(questions.id)',
    content            TEXT NOT NULL
                      COMMENT '답변 본문',
    answer_date        DATE NOT NULL
                      COMMENT '답변한 날짜(한국 시간 기준). 서버에서 Asia/Seoul 로 계산해 넣음',
    retry_of_answer_id INT NULL
                      COMMENT 'NULL 이면 그날의 정식 답변. 값이 있으면 그 답변에 대한 재답변',
    daily_key          DATE AS (IF(retry_of_answer_id IS NULL, answer_date, NULL)) VIRTUAL
                      COMMENT '자동 계산. 정식 답변이면 answer_date, 재답변이면 NULL. 하루 1회 제한용',
    feedback_status    ENUM('pending','done','failed') NOT NULL DEFAULT 'pending'
                      COMMENT 'AI 피드백 상태. pending=생성 대기, done=완료, failed=실패(재시도 대상)',
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                      COMMENT '답변 제출 일시',

    -- 회원 탈퇴 시 답변도 함께 삭제
    CONSTRAINT fk_answers_user FOREIGN KEY (user_id)
      REFERENCES users(id) ON DELETE CASCADE,

    -- 답변이 달린 질문은 삭제 불가 (is_active=0 으로 숨겨야 함)
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id)
      REFERENCES questions(id) ON DELETE RESTRICT,

    -- 원본 답변이 지워지면 재답변도 함께 삭제
    CONSTRAINT fk_answers_retry FOREIGN KEY (retry_of_answer_id)
      REFERENCES answers(id) ON DELETE CASCADE,

    -- 정식 답변은 회원당 하루 한 번만
    UNIQUE KEY uq_answers_daily (user_id, daily_key),

    -- 기록 목록 / 점수 그래프: 회원별 날짜순 조회
    INDEX idx_answers_history (user_id, answer_date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='사용자 답변 (정식 답변 + 재답변)';


  -- ---------------------------------------------------------------------
  --  feedbacks : 답변별 AI 피드백
  --  - answers 와 1:1. AI 호출이 실패하면 이 행이 없고
  --    answers.feedback_status 가 failed 로 남아 재시도할 수 있다.
  --  - 화면 구성(좋았던 점 / 아쉬운 점 / 이렇게 바꿔보면)에 맞춰 세 컬럼으로 분리
  -- ---------------------------------------------------------------------
  CREATE TABLE feedbacks (
    id         INT AUTO_INCREMENT PRIMARY KEY
              COMMENT '피드백 고유 번호',
    answer_id  INT NOT NULL UNIQUE
              COMMENT '대상 답변(answers.id). 답변 하나당 피드백 하나',
    score      TINYINT UNSIGNED NOT NULL
              COMMENT '점수 0~100',
    strength   TEXT NOT NULL
              COMMENT '좋았던 점',
    weakness   TEXT NOT NULL
              COMMENT '아쉬운 점',
    suggestion TEXT NOT NULL
              COMMENT '이렇게 바꿔보면 (개선 제안)',
    model      VARCHAR(50) NULL
              COMMENT '피드백을 만든 AI 모델 이름 (예: gemini-2.5-flash). 모델 변경 이력 추적용',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
              COMMENT '피드백 생성 일시',

    -- 답변이 지워지면 피드백도 함께 삭제
    CONSTRAINT fk_feedbacks_answer FOREIGN KEY (answer_id)
      REFERENCES answers(id) ON DELETE CASCADE,

    -- AI 응답 파싱 오류로 범위 밖 점수가 들어오는 것을 차단
    CONSTRAINT chk_feedbacks_score CHECK (score BETWEEN 0 AND 100)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='답변별 AI 피드백';
