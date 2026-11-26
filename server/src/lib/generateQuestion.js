// 면접 질문 AI 생성 (Groq). 다른 코드는 generateQuestion 만 부르면 되고 AI 쪽 사정은 몰라도 됨


// 1. 설정값
const MODEL = "openai/gpt-oss-120b";
const URL = "https://api.groq.com/openai/v1/chat/completions";
const TIMEOUT_MS = 30_000;
// questions.content 가 VARCHAR(500) 이라 그보다 길면 실패로 처리
const MAX_LENGTH = 500;

// 2. 질문 유형별로 AI 에게 알려줄 설명
const CATEGORY_GUIDE = {
  intro: "자기소개 질문. 지원자가 자신을 소개하고 강점을 보여줄 수 있는 질문",
  motivation: "지원동기 질문. 이 직무를 고른 이유, 커리어 목표를 묻는 질문",
  personality: "인성 질문. 실패 경험, 우선 순위, 피드백 받아들이기, 책임감, 마감 압박, 새로운 걸 배운 경험, 태도와 가치관을 묻는 질문",
  technical: "기술 질문. 이 직무에서 실제로 쓰는 지식과 문제 해결 능력을 확인하는 질문",
};

// 3. 응답 모양 (이 형식으로만 답하게 강제)
const SCHEMA = {
  type: "object",
  properties: {
    content: { type: "string" },
  },
  required: ["content"],
  additionalProperties: false,
};

// 4. 질문 생성 함수
// 성공하면 { content, model } 을 돌려주고,
// 실패(타임아웃, 응답 오류, 형식이 이상함)하면 throw → 부르는 쪽에서 500 응답
async function generateQuestion({ category, jobRole }) {
  const guide = CATEGORY_GUIDE[category];
  if (!guide) {
    throw new Error(`알 수 없는 질문 유형: ${category}`);
  }

  // ① 프롬프트 만들기: 직무와 질문 유형을 넣고 질문 조건 설명
  const prompt = `너는 ${jobRole} 직무 면접관이야.
신입 지원자에게 할 면접 질문을 하나 만들어줘.

질문 유형: ${guide}

- content: 질문 한 개. 1~2문장, 200자 이내
- 답변을 글로 3~5문장 정도 쓸 수 있는 질문
- 예/아니오로 끝나는 질문, 여러 질문을 한꺼번에 묻는 질문은 피하기
- 한국어 존댓말로.`;

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
        json_schema: { name: "question", strict: true, schema: SCHEMA },
      },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  // ③ 실패면 throw
  if (!res.ok) {
    throw new Error(`AI 질문 생성 요청 실패: status ${res.status}`);
  }

  // ④ 결과 꺼내기: choices[0].message.content 가 JSON 문자열
  const data = await res.json();
  const result = JSON.parse(data.choices?.[0]?.message?.content ?? "");

  // ⑤ 검증: 질문이 비어 있거나 DB 칸보다 길면 실패
  const content = typeof result.content === "string" ? result.content.trim() : "";
  if (!content) {
    throw new Error("AI 질문이 비어 있음");
  }
  if (content.length > MAX_LENGTH) {
    throw new Error(`AI 질문이 너무 김: ${content.length}자`);
  }

  // ⑥ 결과 + 사용한 모델 이름
  return { content, model: MODEL };
}

module.exports = { generateQuestion };
