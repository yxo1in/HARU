// 답변 AI 채점 (Groq). 다른 코드는 gradeAnswer 만 부르면 되고 AI 쪽 사정은 몰라도 됨

// 1. 설정값
const MODEL = "openai/gpt-oss-120b";
const URL = "https://api.groq.com/openai/v1/chat/completions";
const TIMEOUT_MS = 30_000;

// 2. 응답 모양 (이 형식으로만 답하게 강제)
const SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer" },
    strength: { type: "string" },
    weakness: { type: "string" },
    suggestion: { type: "string" },
  },
  required: ["score", "strength", "weakness", "suggestion"],
  additionalProperties: false,
};

// 3. 채점 함수
// 성공하면 { score, strength, weakness, suggestion, model } 을 돌려주고,
// 실패(타임아웃, 응답 오류, 형식이 이상함)하면 throw → 부르는 쪽에서 feedback_status 를 failed 로
async function gradeAnswer({ question, category, jobRole, answer }) {
  // ① 프롬프트 만들기: 직무, 질문 유형, 질문, 답변을 넣고 채점 기준 설명
  const prompt = `너는 ${jobRole} 면접관이야.
아래 ${category} 질문에 대한 지원자의 답변을 채점해줘.

질문: ${question}
답변: ${answer}

- score: 0~100 정수.
  90 이상: 질문에 정확히 답하고, 구체적인 경험·행동·결과가 모두 있음
  70~89: 질문에 맞게 답했지만 구체적인 근거나 결과 중 일부가 부족함
  50~69: 방향은 맞지만 일반적인 이야기 위주라 설득력이 약함
  50 미만: 질문과 거리가 있거나, 한두 문장뿐이라 판단하기 어려움
- strength: 좋았던 점 1~2문장
- weakness: 아쉬운 점 1~2문장
- suggestion: 이렇게 바꿔보면 좋을 점 1~2문장
모두 한국어 존댓말로.`;

  // ② fetch 로 POST (30초 넘으면 자동으로 끊김)
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: {
        type: "json_schema",
        json_schema: { name: "grade", strict: true, schema: SCHEMA },
      },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  // ③ 실패면 throw
  if (!res.ok) {
    throw new Error(`AI 채점 요청 실패: status ${res.status}`);
  }

  // ④ 결과 꺼내기: choices[0].message.content 가 JSON 문자열
  const data = await res.json();
  const result = JSON.parse(data.choices?.[0]?.message?.content ?? "");

  // ⑤ 검증: score 가 0~100 정수가 아니거나 글이 비어 있으면 실패
  const { score, strength, weakness, suggestion } = result;
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new Error(`AI 채점 점수가 올바르지 않음: ${score}`);
  }
  for (const text of [strength, weakness, suggestion]) {
    if (typeof text !== "string" || !text.trim()) {
      throw new Error("AI 채점 피드백이 비어 있음");
    }
  }

  // ⑥ 결과 + 사용한 모델 이름 (feedbacks.model 에 저장)
  return {
    score,
    strength: strength.trim(),
    weakness: weakness.trim(),
    suggestion: suggestion.trim(),
    model: MODEL,
  };
}

module.exports = { gradeAnswer };
