const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");

// 로그인 관련 api 추가

const LOGIN_ID_PATTERN = /^[a-z0-9]{4,20}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;
const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 10;

function findRegisterError({ login_id, password, nickname, job_role_id }) {
  if (!login_id || !password || !nickname) {
    return "아이디, 비밀번호, 닉네임을 입력해 주세요.";
  }
  if (typeof login_id !== "string" || !LOGIN_ID_PATTERN.test(login_id)) {
    return "아이디는 영문 소문자와 숫자 4~20자로 입력해 주세요.";
  }
  if (typeof password !== "string" || !PASSWORD_PATTERN.test(password)) {
    return "비밀번호는 8~64자로, 영문과 숫자를 섞어 주세요.";
  }
  const nicknameLength =
    typeof nickname === "string" ? nickname.replace(/\s/g, "").length : 0;
  if (
    nicknameLength < NICKNAME_MIN_LENGTH ||
    nicknameLength > NICKNAME_MAX_LENGTH
  ) {
    return "닉네임은 공백 제외 2~10자로 입력해 주세요.";
  }
  if (job_role_id != null && !Number.isInteger(job_role_id)) {
    return "존재하지 않는 직무예요.";
  }
  return null;
}
const loginError = ({ login_id, password }) => {
  if (!login_id || !password) {
    return "아이디, 비밀번호를 입력해 주세요.";
  }
  if (typeof login_id !== "string") {
    return "아이디를 입력해주세요";
  }
  if (typeof password !== "string") {
    return "비밀번호를 입력해주세요";
  }
  return null;
};
router.post("/register", async (req, res) => {
  const { login_id, password, nickname, job_role_id } = req.body;

  const validationError = findRegisterError(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const [result] = await pool.query(
      `INSERT INTO users (provider, login_id, password_hash, nickname, job_role_id)
            VALUES ('local', ?, ?, ?, ?)`,
      [login_id, passwordHash, nickname.trim(), job_role_id ?? null],
    );

    res.status(201).json({ id: result.insertId, nickname: nickname.trim() });
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

router.post("/login", async (req, res) => {
  const { login_id, password } = req.body;
  if (loginError({ login_id, password })) {
    return res.status(400).json({ error: loginError({ login_id, password }) });
  }

  const [result] = await pool.query(
    `SELECT id, login_id, nickname, password_hash FROM users WHERE login_id = ?`,
    [login_id],
  );
  const user = result[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res
      .status(401)
      .json({ error: "아이디 또는 비밀번호가 맞지 않아요." });
  }
  const accessToken = jwt.sign(
    { userId: user.id, login_id: user.login_id },
    process.env.JWT_SECRET,
    {
      expiresIn: "14d",
    },
  );
  res.json({
    accessToken,
    user: { id: user.id, login_id: user.login_id, nickname: user.nickname },
  });
});

module.exports = router;
