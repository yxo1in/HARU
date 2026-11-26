const express = require("express");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const pool = require("./db"); // MySQL 커넥션 풀

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 서버 + DB 연결 상태 확인
app.get("/api/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok", name: "HARU", db: "connected" });
});

// API 문서 (Swagger UI)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/job-roles", require("./routes/jobRoles"));

const auth = require("./middleware/auth");

// home
app.use("/api/home", auth, require("./routes/home"));

// profile
app.use("/api/profile", auth, require("./routes/profile"));

// 기록 탭
app.use("/api/stats", auth, require("./routes/stats"));
app.use("/api/answers", auth, require("./routes/answers"));

// 질문 생성
app.use("/api/questions", auth, require("./routes/questions"));

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// 채점 중에 서버가 꺼지면 답변이 pending 으로 영원히 남음
// → 5분 넘은 pending 은 failed 로 바꿔서 "다시 채점" 할 수 있게 함 (서버 시작 시 + 5분마다)
const PENDING_CHECK_MS = 5 * 60 * 1000;
async function failStalePending() {
  try {
    const [result] = await pool.query(
      `UPDATE answers SET feedback_status = 'failed'
        WHERE feedback_status = 'pending' AND created_at < NOW() - INTERVAL 5 MINUTE`,
    );
    if (result.affectedRows > 0) {
      console.log(`오래된 채점 대기 ${result.affectedRows}개를 실패로 바꿈`);
    }
  } catch (err) {
    console.error("채점 대기 정리 실패", err.message);
  }
}

app.listen(PORT, () => {
  console.log(`HARU server listening on http://localhost:${PORT}`);
  failStalePending();
  setInterval(failStalePending, PENDING_CHECK_MS);
});
