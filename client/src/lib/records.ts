// 기록(답변) 목록 관련 타입과 표시용 함수. 기록 탭, 질문 탭이 같이 씀

export type Category = "intro" | "motivation" | "personality" | "technical";

export const CATEGORY_LABELS: Record<Category, string> = {
  intro: "자기소개",
  motivation: "지원동기",
  personality: "인성",
  technical: "기술",
};

// GET /api/answers 의 items 한 개
export type RecordListItem = {
  id: number;
  questionId: number;
  answerDate: string;
  category: Category;
  question: string;
  score: number | null;
  feedbackStatus: "pending" | "done" | "failed";
  retryCount: number;
};

export type RecordPage = { items: RecordListItem[]; nextCursor: number | null };

const pad = (n: number) => String(n).padStart(2, "0");

// 기기 시간 기준 오늘 "YYYY-MM-DD"
export function todayString() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// "2026-11-23" → 오늘이면 "오늘", 아니면 "11월 23일"
export function formatDate(date: string) {
  if (date === todayString()) return "오늘";
  const [, month, day] = date.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}

// 목록에 보여줄 "지원동기, 오늘" 같은 한 줄
export function recordMeta(item: RecordListItem) {
  return `${CATEGORY_LABELS[item.category]}, ${formatDate(item.answerDate)}`;
}

// GET /api/answers/:id (기록 상세, 첨삭 결과 화면)
export type Feedback = {
  score: number;
  strength: string;
  weakness: string;
  suggestion: string;
};

export type RetryItem = {
  id: number;
  createdAt: string;
  feedbackStatus: "pending" | "done" | "failed";
  score: number | null;
  delta: number | null;
};

export type AnswerDetail = {
  id: number;
  questionId: number;
  category: Category;
  question: string;
  content: string;
  answerDate: string;
  createdAt: string;
  retryOfAnswerId: number | null;
  feedbackStatus: "pending" | "done" | "failed";
  feedback: Feedback | null;
  delta: number | null;
  previous: { date: string; score: number } | null;
  retries: RetryItem[];
  retriesLeftToday: number;
};

// POST /api/answers, POST /api/answers/:id/feedback 응답
export type GradeResult = {
  answer: { id: number; feedbackStatus: "done" | "failed" };
  feedback: Feedback | null;
};

// ISO 시각 → "11월 23일 오후 3:40" (기기 시간대 기준)
export function formatDateTime(iso: string) {
  const d = new Date(iso);
  const hour = d.getHours();
  const ampm = hour < 12 ? "오전" : "오후";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${ampm} ${h12}:${pad(d.getMinutes())}`;
}
