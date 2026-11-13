const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/", async (req, res) => {
  const [jobRoles] = await pool.query(
    "SELECT id, name FROM job_roles ORDER BY sort_order",
  );
  res.json({ jobRoles });
});

module.exports = router;
