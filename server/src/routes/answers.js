const express = require("express");
const router = express.Router();
const pool = require("../db");
const { gradeAnswer } = require("../lib/grader");
const { todayKST } = require("../lib/date");

const CATEGORIES = ["intro", "motivation", "personality", "technical"];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const MAX_CONTENT = 1000;
// 원본 답변 하나에 하루 동안 할 수 있는 재답변 수
const RETRY_LIMIT = 5;

// 기록 목록. 정식 답변만 최신 날짜순.
// cursor 는 이전 응답의 nextCursor(마지막 답변 id). 그 답변보다 날짜가 이전인 것부터
// (정식 답변은 하루 1개라 날짜만으로 순서가 정해짐)
router.get("/", async (req, res) => {
  const { category } = req.query;
  if (category !== undefined && !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "질문 유형이 올바르지 않아요." });
  }

  const cursor =
    req.query.cursor === undefined
      ? null
      : Number.parseInt(req.query.cursor, 10);
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
    `SELECT a.id, a.question_id AS questionId, a.answer_date AS answerDate, q.category, q.content AS question,
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

// 채점에 필요한 질문/직무 정보. 직무는 질문의 직무, 없으면 회원 직무
async function loadGradingInfo(answerId) {
  const [rows] = await pool.query(
    `SELECT a.content, q.content AS question, q.category,
        COALESCE(qj.name, uj.name, '신입') AS jobRole
      FROM answers a
      JOIN questions q ON q.id = a.question_id
      JOIN users u ON u.id = a.user_id
      LEFT JOIN job_roles qj ON qj.id = q.job_role_id
      LEFT JOIN job_roles uj ON uj.id = u.job_role_id
      WHERE a.id = ?`,
    [answerId],
  );
  return rows[0];
}

// AI 채점 후 저장. 성공하면 feedback, 실패하면 failed 로 표시하고 null
async function runGrading(answerId) {
  const info = await loadGradingInfo(answerId);
  let result;
  try {
    result = await gradeAnswer({
      question: info.question,
      category: info.category,
      jobRole: info.jobRole,
      answer: info.content,
    });
  } catch (err) {
    console.error("채점 실패", answerId, err.message);
    await pool.query("UPDATE answers SET feedback_status = 'failed' WHERE id = ?", [answerId]);
    return null;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      `INSERT INTO feedbacks (answer_id, score, strength, weakness, suggestion, model)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [answerId, result.score, result.strength, result.weakness, result.suggestion, result.model],
    );
    await conn.query("UPDATE answers SET feedback_status = 'done' WHERE id = ?", [answerId]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error("채점 저장 실패", answerId, err.message);
    await pool.query("UPDATE answers SET feedback_status = 'failed' WHERE id = ?", [answerId]);
    return null;
  } finally {
    conn.release();
  }

  const { score, strength, weakness, suggestion } = result;
  return { score, strength, weakness, suggestion };
}

// 답변 제출 + 채점
// body: { questionId, content, retryOfAnswerId? }
router.post("/", async (req, res) => {
  const { questionId, retryOfAnswerId } = req.body;
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
  if (!content || content.length > MAX_CONTENT) {
    return res.status(400).json({ error: `답변은 1~${MAX_CONTENT}자로 적어 주세요.` });
  }
  if (!Number.isInteger(questionId)) {
    return res.status(400).json({ error: "질문 번호가 올바르지 않아요." });
  }
  if (retryOfAnswerId != null && !Number.isInteger(retryOfAnswerId)) {
    return res.status(400).json({ error: "원본 답변 번호가 올바르지 않아요." });
  }

  try {
    // 공용 질문이거나 나를 위해 만든 질문만
    const [questions] = await pool.query(
      `SELECT id FROM questions
        WHERE id = ? AND (created_for_user_id IS NULL OR created_for_user_id = ?)`,
      [questionId, req.userId],
    );
    if (questions.length === 0) {
      return res.status(404).json({ error: "질문을 찾을 수 없어요." });
    }

    const today = todayKST();

    if (retryOfAnswerId != null) {
      const [originals] = await pool.query(
        `SELECT id FROM answers
          WHERE id = ? AND user_id = ? AND question_id = ? AND retry_of_answer_id IS NULL`,
        [retryOfAnswerId, req.userId, questionId],
      );
      if (originals.length === 0) {
        return res.status(422).json({ error: "다시 답할 원본 답변을 찾을 수 없어요." });
      }
      const [[{ count }]] = await pool.query(
        `SELECT COUNT(*) AS count FROM answers
          WHERE retry_of_answer_id = ? AND answer_date = ?`,
        [retryOfAnswerId, today],
      );
      if (count >= RETRY_LIMIT) {
        return res.status(429).json({ error: `재답변은 하루에 ${RETRY_LIMIT}번까지 할 수 있어요.` });
      }
    }

    let answerId;
    try {
      const [result] = await pool.query(
        `INSERT INTO answers (user_id, question_id, content, answer_date, retry_of_answer_id)
          VALUES (?, ?, ?, ?, ?)`,
        [req.userId, questionId, content, today, retryOfAnswerId ?? null],
      );
      answerId = result.insertId;
    } catch (err) {
      if (err.errno === 1062) {
        return res.status(409).json({ error: "오늘 정식 답변은 이미 했어요." });
      }
      throw err;
    }

    const feedback = await runGrading(answerId);
    return res.status(201).json({
      answer: { id: answerId, feedbackStatus: feedback ? "done" : "failed" },
      feedback,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "답변을 저장하지 못했어요." });
  }
});

// 채점 다시 하기 (채점에 실패한 내 답변만)
router.post("/:id/feedback", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!(id > 0)) {
    return res.status(400).json({ error: "답변 번호가 올바르지 않아요." });
  }
  try {
    const [rows] = await pool.query(
      "SELECT user_id AS userId, feedback_status AS feedbackStatus FROM answers WHERE id = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "답변을 찾을 수 없어요." });
    }
    if (rows[0].userId !== req.userId) {
      return res.status(403).json({ error: "내 답변만 채점할 수 있어요." });
    }
    if (rows[0].feedbackStatus !== "failed") {
      return res.status(409).json({ error: "다시 채점할 답변이 아니에요." });
    }

    await pool.query("UPDATE answers SET feedback_status = 'pending' WHERE id = ?", [id]);
    const feedback = await runGrading(id);
    return res.json({
      answer: { id, feedbackStatus: feedback ? "done" : "failed" },
      feedback,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "채점하지 못했어요." });
  }
});

// 기록 상세: 답변 + 질문 + 첨삭(점수 변화 포함) + 재답변 목록
router.get("/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!(id > 0)) {
    return res.status(400).json({ error: "답변 번호가 올바르지 않아요." });
  }
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.user_id AS userId, a.question_id AS questionId, a.content,
          a.answer_date AS answerDate, a.created_at AS createdAt,
          a.retry_of_answer_id AS retryOfAnswerId, a.feedback_status AS feedbackStatus,
          q.category, q.content AS question,
          f.score, f.strength, f.weakness, f.suggestion
        FROM answers a
        JOIN questions q ON q.id = a.question_id
        LEFT JOIN feedbacks f ON f.answer_id = a.id
        WHERE a.id = ?`,
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "기록을 찾을 수 없어요." });
    }
    const row = rows[0];
    if (row.userId !== req.userId) {
      return res.status(403).json({ error: "내 기록만 볼 수 있어요." });
    }

    const done = row.feedbackStatus === "done";
    const feedback = done
      ? { score: row.score, strength: row.strength, weakness: row.weakness, suggestion: row.suggestion }
      : null;

    // 점수 변화 비교 대상: 재답변이면 원본, 정식 답변이면 바로 이전 정식 답변
    let previous = null;
    if (done) {
      const [prevRows] = row.retryOfAnswerId
        ? await pool.query(
            `SELECT a.answer_date AS date, f.score FROM answers a
              JOIN feedbacks f ON f.answer_id = a.id
              WHERE a.id = ? AND a.feedback_status = 'done'`,
            [row.retryOfAnswerId],
          )
        : await pool.query(
            `SELECT a.answer_date AS date, f.score FROM answers a
              JOIN feedbacks f ON f.answer_id = a.id
              WHERE a.user_id = ? AND a.retry_of_answer_id IS NULL
                AND a.feedback_status = 'done' AND a.answer_date < ?
              ORDER BY a.answer_date DESC LIMIT 1`,
            [req.userId, row.answerDate],
          );
      previous = prevRows[0] ?? null;
    }

    // 원본 답변의 재답변들. 오늘 남은 횟수는 재답변 화면에서도 필요해서 항상 계산
    const originalId = row.retryOfAnswerId ?? row.id;
    const [retryRows] = await pool.query(
      `SELECT a.id, a.answer_date AS answerDate, a.created_at AS createdAt,
          a.feedback_status AS feedbackStatus, f.score
        FROM answers a
        LEFT JOIN feedbacks f ON f.answer_id = a.id
        WHERE a.retry_of_answer_id = ?
        ORDER BY a.created_at`,
      [originalId],
    );
    const today = todayKST();
    const todayCount = retryRows.filter((r) => r.answerDate === today).length;
    const retriesLeftToday = Math.max(RETRY_LIMIT - todayCount, 0);

    // 재답변 목록은 정식 답변 상세에서만. 각 재답변의 원본 대비 점수 변화 포함
    const retries = row.retryOfAnswerId
      ? []
      : retryRows.map((r) => {
          const score = r.feedbackStatus === "done" ? r.score : null;
          return {
            id: r.id,
            createdAt: r.createdAt,
            feedbackStatus: r.feedbackStatus,
            score,
            delta: score !== null && done ? score - row.score : null,
          };
        });

    return res.json({
      id: row.id,
      questionId: row.questionId,
      category: row.category,
      question: row.question,
      content: row.content,
      answerDate: row.answerDate,
      createdAt: row.createdAt,
      retryOfAnswerId: row.retryOfAnswerId,
      feedbackStatus: row.feedbackStatus,
      feedback,
      delta: feedback && previous ? feedback.score - previous.score : null,
      previous,
      retries,
      retriesLeftToday,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "기록을 불러오지 못했어요." });
  }
});

module.exports = router;
