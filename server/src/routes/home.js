const express = require("express");
const router = express.Router();
const pool = require("../db");

function addDays(date, n) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

router.get("/", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT u.nickname, j.id AS jobRoleId, j.name AS jobRoleName FROM users u
        LEFT JOIN job_roles j ON j.id = u.job_role_id
        WHERE u.id = ?`,
    [req.userId],
  );

  const user = rows[0];
  if (!user) return res.status(401).json({ error: "로그인이 필요해요." });

  const [answerRows] = await pool.query(
    `SELECT answer_date FROM answers
    WHERE user_id = ? AND retry_of_answer_id IS NULL
    ORDER BY answer_date desc`,
    [req.userId],
  );

  const today = new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const last7Days = [];
  const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
  for (let i = 6; i >= 0; i--) {
    const date = addDays(today, -i);
    const answered = answerRows.some((row) => row.answer_date === date);
    const day = WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
    let status = "missed";
    if (answered) status = "done";
    else if (date === today) status = "today";

    last7Days.push({ date, day, status });
  }

  const answeredToday = answerRows.some((row) => row.answer_date === today);

  let streak = 0;
  let checkDay = answeredToday ? today : addDays(today, -1);
  while (answerRows.some((row) => row.answer_date === checkDay)) {
    streak++;
    checkDay = addDays(checkDay, -1);
  }

  const [scoreRows] = await pool.query(
    `SELECT f.score FROM answers a
      JOIN feedbacks f ON a.id = f.answer_id
      WHERE a.user_id = ? AND a.retry_of_answer_id IS NULL AND a.feedback_status = 'done'
      ORDER BY a.answer_date DESC
      LIMIT 6`,
    [req.userId],
  );

  const scores = scoreRows.map((row) => row.score).reverse();

  res.json({
    nickname: rows[0].nickname,
    jobRoleId: rows[0].jobRoleId,
    jobRoleName: rows[0].jobRoleName,
    last7Days: last7Days,
    streak,
    scores,
  });
});

module.exports = router;

// ===================================================================
// TODO: 홈 API 확장 (번호 순서대로)
// ===================================================================
// TODO(4): quests — { answeredToday, over80Today, weeklyCount }
//          weeklyCount 는 이번 주 월요일(KST)부터 오늘까지 정식 답변 수
// TODO(6): streak — 연속 답변 일수
//          오늘 했으면 오늘부터, 안 했으면 어제부터 하루씩 거슬러 올라가며 셈
// TODO(7): res.json 에 streak / last7Days / scores / quests 추가
//          + swagger.json 의 GET /api/home 응답 형식도 추가
