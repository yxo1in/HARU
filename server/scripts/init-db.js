const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// 운영 환경에서 실수로 실행하면 데이터가 전부 날아가므로 막는다
if (process.env.NODE_ENV === 'production') {
  console.error('NODE_ENV=production 에서는 db:init 을 실행할 수 없습니다. (모든 테이블을 DROP 합니다)');
  process.exit(1);
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: 'utf8mb4',
    multipleStatements: true,
  });

  const files = ['schema.sql', 'seed.sql'];
  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(__dirname, '..', 'db', file), 'utf8');
      await conn.query(sql);
      console.log(`✔ ${file} 실행 완료`);
    }

    const [tables] = await conn.query('SHOW TABLES FROM haru');
    console.log('테이블:', tables.map((t) => Object.values(t)[0]).join(', '));
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('DB 초기화 실패:', err.message);
  process.exit(1);
});
