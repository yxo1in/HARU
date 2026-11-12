const express = require("express");
const router = express.Router();
const pool = require("../db");


router.get("/", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT u.nickname, j.id AS jobRoleId, j.name AS jobRoleName FROM users u
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
  });
});

module.exports = router;
