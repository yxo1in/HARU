// 한국 날짜 헬퍼. 서버 시계가 UTC 여도 한국 0시 기준 "YYYY-MM-DD" 를 만들어 줌

// 지금 한국 날짜 (UTC + 9시간)
function todayKST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// "YYYY-MM-DD" 에서 n 일 더하거나 빼기
function addDays(date, n) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

module.exports = { todayKST, addDays };
