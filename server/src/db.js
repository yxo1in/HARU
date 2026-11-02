// MySQL 커넥션 풀
// - 서버 전체에서 이 pool 하나를 공유한다. 요청마다 연결을 새로 만들지 않는다.
// - 사용 예: const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'haru',

  waitForConnections: true, // 풀이 꽉 차면 에러 대신 대기
  connectionLimit: 10,      // 동시에 유지할 최대 연결 수
  charset: 'utf8mb4',       // 한글, 이모지 저장용
  timezone: '+09:00',
  dateStrings: ['DATE'],
});

// 풀에 새 연결이 생길 때마다 DB 세션 시간대도 한국으로 맞춘다.
// created_at 의 DEFAULT CURRENT_TIMESTAMP 와 NOW() 가 이 시간대를 따르므로
// answer_date(서버에서 Asia/Seoul 로 계산)와 날짜가 어긋나지 않는다.
pool.on('connection', (conn) => {
  conn.query("SET time_zone = '+09:00'");
});

module.exports = pool;
