import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { JobPill } from "@/components/header-pill";
import { RecordItem } from "@/components/record-item";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeader } from "@/components/section-header";
import { darkColors, spacing, typography } from "@/constants/theme";

// API 연동 전까지 쓰는 Figma 예시 데이터
const CATEGORIES = ["랜덤", "자기소개", "지원동기", "인성", "기술"];

const TODAY_RESULT = {
  meta: "지원동기, 오늘",
  question: "우리 회사에 지원한 이유는 무엇인가요?",
  score: 82,
};

const PAST_QUESTIONS = [
  { meta: "자기소개, 10월 25일", question: "1분 동안 자기소개를 해 주세요.", score: 78 },
  { meta: "인성, 10월 24일", question: "협업 중 갈등을 해결한 경험이 있나요?", score: 86 },
  { meta: "기술, 10월 22일", question: "최근에 공부한 기술을 설명해 주세요.", score: 71 },
];

function openRecord() {
  router.push("/record-detail");
}

function StartQuestion() {
  const [category, setCategory] = useState("랜덤");

  return (
    <View style={styles.start}>
      <Text style={styles.title}>{"어떤 질문으로\n연습할까요?"}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {CATEGORIES.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={item === category}
            onPress={() => setCategory(item)}
          />
        ))}
      </ScrollView>
      <Button label="면접 시작하기" onPress={() => router.push("/generating")} />
    </View>
  );
}

function TodayDone() {
  return (
    <View style={styles.start}>
      <View style={styles.intro}>
        <Text style={styles.title}>{"오늘 답변은\n끝났어요"}</Text>
        <Text style={styles.subtitle}>내일 0시에 새 질문이 열려요</Text>
      </View>
      <RecordItem {...TODAY_RESULT} onPress={openRecord} />
      <Button
        label="같은 질문 다시 답하기"
        variant="secondary"
        onPress={() => router.push("/answer")}
      />
    </View>
  );
}

export default function Question() {
  // API 연동 전까지 오늘 답변 여부를 주소의 done 값으로 구분함
  const { done } = useLocalSearchParams<{ done?: string }>();

  return (
    <View style={styles.container}>
      <ScreenHeader title="질문">
        <JobPill job="백엔드" />
      </ScreenHeader>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        {done ? <TodayDone /> : <StartQuestion />}

        <View style={styles.past}>
          <SectionHeader
            title="지난 질문"
            trailing="전체 보기"
            onPressTrailing={() => router.navigate("/record")}
          />
          {PAST_QUESTIONS.map((item) => (
            <RecordItem key={item.meta} {...item} onPress={openRecord} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.bgSecondary,
  },
  scroll: {
    flex: 1,
  },
  body: {
    gap: spacing["2xl"],
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["2xl"],
  },
  start: {
    gap: spacing.xl,
  },
  intro: {
    gap: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: darkColors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: darkColors.textTertiary,
  },
  chips: {
    gap: spacing.sm,
  },
  past: {
    gap: spacing.md,
  },
});
