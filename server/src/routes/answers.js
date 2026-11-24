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

// ===================================================================
// TODO: 답변 API 추가 (번호 순서대로, README 6-1 / 6-2 / 6-4)
// ===================================================================
// TODO(1): (완료) AI 채점 함수 — server/src/lib/grader.js 의 gradeAnswer (Groq)
//          gradeAnswer({ question, category, jobRole, answer })
//          → { score, strength, weakness, suggestion, model } / 실패하면 throw
// TODO(2): 한국 날짜 헬퍼 공용으로 빼기
//          home.js 의 today 계산(9시간 더하기)을 server/src/lib/date.js 로 옮겨서 같이 쓰기
// TODO(3): POST /  답변 제출 + 채점
//          body: { questionId, content, retryOfAnswerId? }
//          1. content 1~1000자 확인 → 아니면 400
//          2. questionId 질문이 있는지 → 없으면 404
//          3. 재답변이면 원본 확인
//             (id = retryOfAnswerId AND user_id = 나 AND question_id 같음 AND 원본이 정식 답변)
//             → 없으면 422, 오늘 재답변 5개 이상이면 429
//          4. answers INSERT (answer_date = 한국 날짜, feedback_status = 'pending')
//             → MySQL 1062 에러(오늘 정식 답변 이미 있음) 면 409
//          5. AI 채점 (TODO(1) 의 gradeAnswer, try/catch 로 실패 처리)
//             성공 → 트랜잭션으로 feedbacks INSERT + feedback_status = 'done'
//             실패 → feedback_status = 'failed' (답변은 남김)
//          6. 201 { answer, feedback }  채점 실패면 feedback: null
// TODO(4): delta 계산 (피드백 화면의 "+8")
//          재답변: 원본 답변 점수와의 차이
//          정식 답변: 바로 이전 정식 답변(done) 점수와의 차이 / 비교 대상 없으면 null
// TODO(5): POST /:id/feedback  채점 다시 하기
//          내 답변 + feedback_status = 'failed' 일 때만 TODO(3) 의 5번만 다시 실행
//          남의 답변 403, 없으면 404, failed 가 아니면 409
// TODO(6): GET /:id  기록 상세
//          { answer, question, feedback(delta 포함), retries: [{ id, score, feedbackStatus, createdAt }] }
//          재답변 id 로 조회하면 retries 는 빈 배열 / 남의 답변 403, 없으면 404
// TODO(7): 오래된 pending 정리 — index.js 에서 서버 시작 시 + 5분마다
//          UPDATE answers SET feedback_status = 'failed'
//          WHERE feedback_status = 'pending' AND created_at < NOW() - INTERVAL 5 MINUTE
// TODO(8): swagger.json 에 위 API 3개 추가
