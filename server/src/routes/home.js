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
    `SELECT a.answer_date AS date, f.score FROM answers a
      JOIN feedbacks f ON a.id = f.answer_id
      WHERE a.user_id = ? AND a.retry_of_answer_id IS NULL AND a.feedback_status = 'done'
      ORDER BY a.answer_date DESC
      LIMIT 6`,
    [req.userId],
  );

  // [{ date: "2026-11-15", score: 68 }, ...] 오래된 → 최신 (차트 아래 날짜 표시용으로 날짜도 같이)
  const scores = scoreRows.reverse();

  const weekday = new Date(`${today}T00:00:00Z`).getUTCDay();
  const monday = addDays(today, -((weekday + 6) % 7));
  const weeklyCount = answerRows.filter(
    (row) => row.answer_date >= monday,
  ).length;

  // 오늘 답변(정식 + 재답변) 중 80점 이상이 하나라도 있는지
  const [goodRows] = await pool.query(
    `SELECT 1 FROM answers a
      JOIN feedbacks f ON a.id = f.answer_id
      WHERE a.user_id = ? AND a.answer_date = ? AND f.score >= 80
      LIMIT 1`,
    [req.userId, today],
  );
  const over80Today = goodRows.length > 0;

  res.json({
    nickname: rows[0].nickname,
    jobRoleId: rows[0].jobRoleId,
    jobRoleName: rows[0].jobRoleName,
    last7Days: last7Days,
    streak,
    scores,
    quests: { answeredToday, over80Today, weeklyCount },
  });
});

module.exports = router;
