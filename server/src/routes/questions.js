const express = require("express");
const router = express.Router();
const pool = require("../db");
const { generateQuestion } = require("../lib/generateQuestion");

// schema.sql 의 questions.category ENUM 과 같은 값
const CATEGORIES = ["intro", "motivation", "personality", "technical"];

router.post("/postQuestion", async (req, res) => {
  let { category } = req.body;
  // 안 보내면(질문 탭의 "랜덤") 네 가지 중 하나를 고름
  if (!category) {
    category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "질문 유형이 올바르지 않아요." });
  }
  try {
    const [rows] = await pool.query(
      `SELECT u.job_role_id AS jobRoleId, j.name AS jobRoleName  FROM users u  LEFT JOIN job_roles j ON j.id = u.job_role_id WHERE u.id = ?`,
      [req.userId],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "회원 정보를 찾을 수 없어요." });
    }
    if (rows[0].jobRoleId === null) {
      return res.status(400).json({ error: "직무를 먼저 골라 주세요." });
    }
    const question = await generateQuestion({
      category,
      jobRole: rows[0].jobRoleName,
    });
    const [result] = await pool.query(
      `INSERT INTO questions (job_role_id, created_for_user_id, category, content, source)
        VALUES (?, ?, ?, ?, 'ai')`,
      [rows[0].jobRoleId, req.userId, category, question.content],
    );
    return res
      .status(201)
      .json({ id: result.insertId, category, content: question.content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "질문을 만들지 못했어요." });
  }
});

module.exports = router;
