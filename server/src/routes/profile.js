const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT u.nickname, u.email, j.id AS jobRoleId, j.name AS jobRoleName FROM users u
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
    email: rows[0].email,
  });
});

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;

router.patch("/updatePassword", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (typeof currentPassword !== "string" || !currentPassword) {
    return res.status(400).json({ error: "현재 비밀번호를 입력해 주세요." });
  }
  if (typeof newPassword !== "string" || !PASSWORD_PATTERN.test(newPassword)) {
    return res
      .status(400)
      .json({ error: "비밀번호는 8~64자로, 영문과 숫자를 섞어 주세요." });
  }

  const [rows] = await pool.query(
    `SELECT password_hash FROM users WHERE id = ?`,
    [req.userId],
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ error: "로그인이 필요해요." });

  // 구글 로그인 계정은 password_hash가 없음
  if (
    !user.password_hash ||
    !(await bcrypt.compare(currentPassword, user.password_hash))
  ) {
    return res.status(400).json({ error: "현재 비밀번호가 맞지 않아요." });
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await pool.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [
    newPasswordHash,
    req.userId,
  ]);

  res.json({ message: "비밀번호를 변경했어요." });
});

router.patch("/updateNickname", async (req, res) => {
  const { newNickname } = req.body;
  if (typeof newNickname !== "string") {
    return res.status(400).json({ error: "닉네임을 입력해주세요." });
  }
  if (
    newNickname.replace(/\s/g, "").length < 2 ||
    newNickname.replace(/\s/g, "").length > 10
  ) {
    return res
      .status(400)
      .json({ error: "닉네임은 공백 제외 2~10자로 입력해 주세요." });
  }
  try {
    await pool.query(`UPDATE users SET nickname=? WHERE id=?`, [
      newNickname.trim(),
      req.userId,
    ]);

    res.json({ message: "닉네임을 변경했어요." });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "이미 사용 중인 닉네임입니다." });
    }
    throw err;
  }
});

module.exports = router;
