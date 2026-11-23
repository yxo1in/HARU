const express = require("express");
const router = express.Router();
const pool = require("../db");

const CATEGORIES = ["intro", "motivation", "personality", "technical"];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// 기록 목록. 정식 답변만 최신 날짜순.
// cursor 는 이전 응답의 nextCursor(마지막 답변 id). 그 답변보다 날짜가 이전인 것부터
// (정식 답변은 하루 1개라 날짜만으로 순서가 정해짐)
router.get("/", async (req, res) => {
  const { category } = req.query;
  if (category !== undefined && !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "질문 유형이 올바르지 않아요." });
  }

  const cursor = req.query.cursor === undefined ? null : Number.parseInt(req.query.cursor, 10);
  if (cursor !== null && !(cursor > 0)) {
    return res.status(400).json({ error: "cursor 값이 올바르지 않아요." });
  }

  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  const conditions = ["a.user_id = ?", "a.retry_of_answer_id IS NULL"];
  const params = [req.userId];
  if (category) {
    conditions.push("q.category = ?");
    params.push(category);
  }
  if (cursor !== null) {
    conditions.push(
      "a.answer_date < (SELECT c.answer_date FROM answers c WHERE c.id = ? AND c.user_id = ?)",
    );
    params.push(cursor, req.userId);
  }

  // 다음 페이지가 있는지 알려고 limit 보다 1개 더 가져옴
  const [rows] = await pool.query(
    `SELECT a.id, a.answer_date AS answerDate, q.category, q.content AS question,
        f.score, a.feedback_status AS feedbackStatus,
        (SELECT COUNT(*) FROM answers r WHERE r.retry_of_answer_id = a.id) AS retryCount
      FROM answers a
      JOIN questions q ON q.id = a.question_id
      LEFT JOIN feedbacks f ON f.answer_id = a.id
      WHERE ${conditions.join(" AND ")}
      ORDER BY a.answer_date DESC
      LIMIT ?`,
    [...params, limit + 1],
  );

  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit).map((row) => ({
    ...row,
    score: row.feedbackStatus === "done" ? row.score : null,
  }));

  res.json({
    items,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  });
});

module.exports = router;
