const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const router = express.Router();

// 로그인 관련 api 추가

router.post("/register", async (req, res) => {
  const { login_id, password, nickname, job_role_id } = req.body;

  if (!login_id || !password || !nickname) {
    return res
      .status(400)
      .json({ error: "아이디, 비밀번호, 닉네임을 입력해 주세요." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const [result] = await pool.query(
      `INSERT INTO users (provider, login_id, password_hash, nickname, job_role_id)
            VALUES ('local', ?, ?, ?, ?)`,
      [login_id, passwordHash, nickname, job_role_id ?? null],
    );

    res.status(201).json({ id: result.insertId, nickname });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "이미 사용 중인 아이디 or 닉네임입니다." });
    }
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "존재하지 않는 직무예요." });
    }
    throw err;
  }
});

module.exports = router;
