
// - 사용 예: const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // 풀이 꽉 차면 에러 대신 대기
  connectionLimit: 10,      // 동시에 유지할 최대 연결 수
  charset: 'utf8mb4',       // 한글, 이모지 저장용
  timezone: '+09:00',
  dateStrings: ['DATE'],
});

pool.on('connection', (conn) => {
  conn.query("SET time_zone = '+09:00'");
});

module.exports = pool;
