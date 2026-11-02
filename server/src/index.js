const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db'); // MySQL 커넥션 풀

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 서버 + DB 연결 상태 확인
app.get('/api/health', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', name: 'HARU', db: 'connected' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`HARU server listening on http://localhost:${PORT}`);
});
