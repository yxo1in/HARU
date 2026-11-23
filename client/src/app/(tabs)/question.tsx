import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { JobPill } from "@/components/header-pill";
import { RecordItem } from "@/components/record-item";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeader } from "@/components/section-header";
import { spacing, typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";
import { getJson } from "@/lib/api";
import { recordMeta, todayString, type RecordListItem, type RecordPage } from "@/lib/records";

const PAST_COUNT = 3;

// API 연동 전까지 쓰는 Figma 예시 데이터
const CATEGORIES = ["랜덤", "자기소개", "지원동기", "인성", "기술"];

const TODAY_RESULT = {
  meta: "지원동기, 오늘",
  question: "우리 회사에 지원한 이유는 무엇인가요?",
  score: 82,
};

function openRecord(id?: number) {
  router.push(
    id === undefined
      ? "/record-detail"
      : { pathname: "/record-detail", params: { id: String(id) } },
  );
}

function StartQuestion() {
  const styles = useThemedStyles(createStyles);
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
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.start}>
      <View style={styles.intro}>
        <Text style={styles.title}>{"오늘 답변은\n끝났어요"}</Text>
        <Text style={styles.subtitle}>내일 0시에 새 질문이 열려요</Text>
      </View>
      <RecordItem {...TODAY_RESULT} onPress={() => openRecord()} />
      <Button
        label="같은 질문 다시 답하기"
        variant="secondary"
        onPress={() => router.push("/answer")}
      />
    </View>
  );
}

export default function Question() {
  const styles = useThemedStyles(createStyles);
  // API 연동 전까지 오늘 답변 여부를 주소의 done 값으로 구분함
  const { done } = useLocalSearchParams<{ done?: string }>();
  const [pastItems, setPastItems] = useState<RecordListItem[] | null>(null);

  // 탭으로 돌아올 때마다 지난 질문을 다시 불러옴.
  // 오늘 답변은 위쪽(오늘 결과)에 따로 나오므로 빼고 최근 3개만 보여줌
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const page = await getJson<RecordPage>(`/api/answers?limit=${PAST_COUNT + 1}`);
          if (!active || !page) return;
          const today = todayString();
          setPastItems(
            page.items.filter((item) => item.answerDate !== today).slice(0, PAST_COUNT),
          );
        } catch (e) {
          console.log("past questions load failed:", e);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

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
          {pastItems?.length === 0 && (
            <Text style={styles.subtitle}>아직 답한 질문이 없어요</Text>
          )}
          {pastItems?.map((item) => (
            <RecordItem
              key={item.id}
              meta={recordMeta(item)}
              question={item.question}
              score={item.score}
              onPress={() => openRecord(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
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
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
  },
  chips: {
    gap: spacing.sm,
  },
  past: {
    gap: spacing.md,
  },
});
