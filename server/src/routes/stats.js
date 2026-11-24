const express = require("express");
const router = express.Router();
const pool = require("../db");

const CATEGORIES = ["intro", "motivation", "personality", "technical"];
const DEFAULT_SCORE_LIMIT = 8;
const MAX_SCORE_LIMIT = 30;

// 기록 탭 맨 위 요약 (정식 답변 + 피드백 완료 기준)
router.get("/summary", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ROUND(AVG(f.score)) AS averageScore, COUNT(*) AS totalAnswers, MAX(f.score) AS bestScore
      FROM answers a
      JOIN feedbacks f ON a.id = f.answer_id
      WHERE a.user_id = ? AND a.retry_of_answer_id IS NULL AND a.feedback_status = 'done'`,
    [req.userId],
  );
  const row = rows[0];

  res.json({
    // AVG 결과는 문자열(DECIMAL)로 와서 숫자로 바꿈. 기록이 없으면 null
    averageScore: row.averageScore === null ? null : Number(row.averageScore),
    totalAnswers: row.totalAnswers,
    bestScore: row.bestScore,
  });
});

// 기록 탭 점수 흐름. 최신 limit 개를 오래된 순으로
router.get("/scores", async (req, res) => {
  const { category } = req.query;
  if (category !== undefined && !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "질문 유형이 올바르지 않아요." });
  }

  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || DEFAULT_SCORE_LIMIT, 1),
    MAX_SCORE_LIMIT,
  );

  const [rows] = await pool.query(
    `SELECT a.id AS answerId, a.answer_date AS answerDate, f.score
      FROM answers a
      JOIN feedbacks f ON a.id = f.answer_id
      JOIN questions q ON q.id = a.question_id
      WHERE a.user_id = ? AND a.retry_of_answer_id IS NULL AND a.feedback_status = 'done'
        ${category ? "AND q.category = ?" : ""}
      ORDER BY a.answer_date DESC
      LIMIT ?`,
    category ? [req.userId, category, limit] : [req.userId, limit],
  );

  res.json({ points: rows.reverse() });
});

module.exports = router;
