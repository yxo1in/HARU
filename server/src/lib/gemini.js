// 1. 설정값
const MODEL = "gemini-3.0-flash";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const TIMEOUT_MS = 30_000;

// 2. 응답 모양 (이 형식으로만 답하게 강제)
const SCHEMA = {
  type: "OBJECT",
  properties: {
    score: { type: "INTEGER" },
    strength: { type: "STRING" },
    weakness: { type: "STRING" },
    suggestion: { type: "STRING" },
  },
  required: ["score", "strength", "weakness", "suggestion"],
};

// 3. 채점 함수
async function gradeAnswer({ question, category, jobRole, answer }) {
  // ① 프롬프트 만들기: 직무, 질문 유형, 질문, 답변을 넣고 채점 기준 설명
  const prompt = `너는 ${jobRole} 면접관이야.
    아래 ${category} 질문에 대한 지원자의 답변을 채점해줘.
    
    질문: ${question}
    답변: ${answer}
    
    - score: 0~100 정수. (여기에 점수 기준)
    - strength: 좋았던 점 1~2문장
    - weakness: 아쉬운 점 1~2문장
    - suggestion: 이렇게 바꿔보면 좋을 점 1~2문장
    모두 한국어 존댓말로.
    답변 형식은 score, strength, weakness, suggestion을 각각 / 로 구분해서 하나의 문자열로 해줘
    `;

  // ② fetch 로 POST
  //    headers: "x-goog-api-key": process.env.GEMINI_KEY
  //    body: { contents: [{ role: "user", parts: [{ text: 프롬프트 }] }],
  //            generationConfig: { responseMimeType: "application/json", responseSchema: SCHEMA } }
  //    signal: AbortSignal.timeout(TIMEOUT_MS)   ← 30초 넘으면 자동으로 끊김
  // ③ 실패면 throw (상태 코드가 200이 아니거나, 타임아웃)
  // ④ 결과 꺼내기: data.candidates[0].content.parts[0].text 가 JSON 문자열 → JSON.parse
  // ⑤ 검증: score 가 0~100 정수가 아니거나 글이 비어 있으면 throw
  // ⑥ return { score, strength, weakness, suggestion, model: MODEL }
}

module.exports = { gradeAnswer };
