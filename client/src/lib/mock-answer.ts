// 답변 제출 / 채점 API 연동 전까지 채점 흐름 화면에서 같이 쓰는 예시 데이터

export const MOCK_QUESTION = {
  category: "지원동기",
  text: "우리 회사에 지원한 이유는 무엇인가요?",
};

export const MOCK_ANSWER =
  "저는 사람들이 매일 쓰는 서비스를 만들고 싶어서 지원했습니다. 특히 귀사의 추천 기능을 쓰면서 개발자로 참여하고 싶다고 느꼈어요.";

export const MOCK_FEEDBACK = {
  score: 82,
  delta: 8,
  previous: { date: "11월 22일", score: 74 },
  strength: "회사 서비스를 구체적으로 언급했어요.",
  weakness: "지원 이유가 내 경험과 잘 이어지지 않아요.",
  suggestion: "직접 만든 프로젝트를 예로 들어 보세요.",
};
