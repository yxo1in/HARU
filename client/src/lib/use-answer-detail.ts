import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getJson } from "@/lib/api";
import { formatDate, type AnswerDetail } from "@/lib/records";

// 기록 상세(GET /api/answers/:id). 첨삭 결과와 기록 상세 화면이 같이 씀
// 화면으로 돌아올 때마다 다시 불러와서 재답변·다시 채점 결과가 바로 보임
export function useAnswerDetail(id: string | undefined) {
  const [detail, setDetail] = useState<AnswerDetail | null>(null);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      let active = true;
      getJson<AnswerDetail>(`/api/answers/${id}`)
        .then((data) => {
          if (active && data) setDetail(data);
        })
        .catch(() => {
          if (active) setError(true);
        });
      return () => {
        active = false;
      };
    }, [id]),
  );

  return { detail, error };
}

// "+8" / "-3" / "±0"
export function formatDelta(delta: number) {
  if (delta === 0) return "±0";
  return delta > 0 ? `+${delta}` : String(delta);
}

// 재답변 줄 설명: "원본보다 6점 올랐어요" / "원본과 같은 점수예요"
export function retryDeltaText(delta: number) {
  if (delta === 0) return "원본과 같은 점수예요";
  return `원본보다 ${Math.abs(delta)}점 ${delta > 0 ? "올랐어요" : "내려갔어요"}`;
}

// 점수 변화 옆 설명. 재답변이면 원본, 정식 답변이면 지난 정식 답변과 비교
export function deltaText(detail: AnswerDetail) {
  if (detail.delta === null || !detail.previous) return "";
  const target = detail.retryOfAnswerId
    ? `원본 답변(${detail.previous.score}점)`
    : `지난 정식 답변(${formatDate(detail.previous.date)}, ${detail.previous.score}점)`;
  if (detail.delta === 0) return `${target}과 같아요`;
  return `${target}보다 ${detail.delta > 0 ? "올랐어요" : "내려갔어요"}`;
}
