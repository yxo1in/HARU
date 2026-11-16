const express = require("express");
const router = express.Router();
const pool = require("../db");


router.get("/", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT u.nickname, j.id AS jobRoleId, j.name AS jobRoleName FROM users u
        LEFT JOIN job_roles j ON j.id = u.job_role_id
        WHERE u.id = ?`,
    [req.userId],
  );

  const user = rows[0];
  if (!user) return res.status(401).json({ error: "로그인이 필요해요." });

  res.json({
    nickname: rows[0].nickname,
    jobRoleId: rows[0].jobRoleId,
    jobRoleName: rows[0].jobRoleName,
  });
});

module.exports = router;

// ===================================================================
// TODO: 홈 API 확장 (번호 순서대로)
// ===================================================================
// TODO(0): 한국 시간 기준 날짜 헬퍼 — todayKST() → "YYYY-MM-DD", 날짜 ±n일 계산
//          (DB 연결이 +09:00 이고 DATE 는 문자열로 옴)
// TODO(0): 테스트용 더미 데이터 server/db/dummy.sql 먼저 작성
//          - 최근 10일 정식 답변 (중간에 하루 빠뜨리기)
//          - 재답변 1개, feedback_status='pending' 답변 1개 (계산에서 빠지는지 확인용)
// TODO(1): 정식 답변 날짜 목록 조회
//          answers 에서 user_id = ? AND retry_of_answer_id IS NULL, answer_date DESC
//          → streak / last7Days / quests 계산에 같이 씀
// TODO(2): 점수 최근 6개 조회
//          answers JOIN feedbacks, 정식 답변 + feedback_status = 'done'
//          최신 6개 가져와서 오래된 순으로 뒤집기 (answer_date 도 같이 → over80Today 계산용)
// TODO(3): scores — [62, 70, ...] 오래된 → 최신
// TODO(4): quests — { answeredToday, over80Today, weeklyCount }
//          weeklyCount 는 이번 주 월요일(KST)부터 오늘까지 정식 답변 수
// TODO(5): last7Days — 오늘 포함 7일, [{ date, status }] 오래된 → 최신
//          status: 답변 있으면 "done", 없으면 "missed", 오늘인데 아직 안 했으면 "today"
// TODO(6): streak — 연속 답변 일수
//          오늘 했으면 오늘부터, 안 했으면 어제부터 하루씩 거슬러 올라가며 셈
// TODO(7): res.json 에 streak / last7Days / scores / quests 추가
//          + swagger.json 의 GET /api/home 응답 형식도 추가
