import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { DailyPad } from "@/components/daily-pad";
import { RadioRow } from "@/components/radio-row";
import { ScoreCircle } from "@/components/score-circle";
import { ScreenHeader } from "@/components/screen-header";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { getJson } from "@/lib/api";
import {
  CATEGORY_LABELS,
  todayString,
  type Category,
  type RecordListItem,
  type RecordPage,
} from "@/lib/records";

// 하루에 같은 질문을 다시 답할 수 있는 횟수 (서버 README 의 RETRY_LIMIT 와 같음)
const RETRY_LIMIT = 5;

type Profile = { jobRoleName: string | null };

// "random" 은 서버에 category 를 안 보내서 네 가지 중 하나를 고르게 함
type Choice = Category | "random";

function choices(jobName: string): { key: Choice; title: string; desc: string }[] {
  return [
    { key: "random", title: "랜덤", desc: "네 가지 중 하나를 골라 드려요" },
    { key: "intro", title: "자기소개", desc: "나를 1~2분 안에 소개하기" },
    { key: "motivation", title: "지원동기", desc: "이 회사와 직무를 고른 이유" },
    { key: "personality", title: "인성", desc: "갈등, 실패, 협업 경험" },
    { key: "technical", title: "기술", desc: `${jobName} 직무 지식` },
  ];
}

function StartQuestion({ jobName }: { jobName: string }) {
  const styles = useThemedStyles(createStyles);
  const [choice, setChoice] = useState<Choice>("random");

  return (
    <View style={styles.body}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>어떤 질문을 받을까요?</Text>
        <View style={styles.cardSpacer} />
        {choices(jobName).map((item, i) => {
          const selected = item.key === choice;
          return (
            <View key={item.key}>
              {i > 0 && <View style={styles.divider} />}
              <RadioRow
                title={item.title}
                desc={item.desc}
                selected={selected}
                onPress={() => setChoice(item.key)}
              />
            </View>
          );
        })}
      </View>
      <Text style={styles.notice}>
        {`${jobName} 직무에 맞춰 AI가 새 질문을 만들어요.\n질문은 하루에 한 번 정식으로 답할 수 있어요.`}
      </Text>
      <Button
        label="질문 받기"
        onPress={() =>
          router.push({
            pathname: "/generating",
            params: choice === "random" ? {} : { category: choice },
          })
        }
      />
    </View>
  );
}

function TodayDone({ answer }: { answer: RecordListItem }) {
  const styles = useThemedStyles(createStyles);
  const left = Math.max(RETRY_LIMIT - answer.retryCount, 0);

  return (
    <View style={styles.body}>
      <DailyPad date={answer.answerDate} doodle={<Text style={styles.done}>끝!</Text>}>
        <View style={styles.message}>
          <Text style={styles.messageTitle}>오늘 답변을 마쳤어요.</Text>
          <Text style={styles.messageSub}>다음 질문은 내일 0시에 열려요.</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.result}>
          <View style={styles.resultText}>
            <Text style={styles.resultCategory}>{CATEGORY_LABELS[answer.category]}</Text>
            <Text style={styles.resultQuestion}>{answer.question}</Text>
          </View>
          {answer.score === null ? (
            <Text style={styles.resultPending}>채점 중</Text>
          ) : (
            <ScoreCircle score={answer.score} />
          )}
        </View>
        <View style={styles.retryRow}>
          {answer.retryCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{`재답변 ${answer.retryCount}번`}</Text>
            </View>
          )}
          <Text style={styles.retryText}>
            {left > 0
              ? `오늘 ${left}번 더 다시 답할 수 있어요.`
              : "오늘은 더 다시 답할 수 없어요."}
          </Text>
        </View>
        <Button
          label="같은 질문 다시 답하기"
          variant="secondary"
          disabled={left === 0}
          onPress={() => router.push("/answer")}
        />
      </DailyPad>
      <Button
        label="오늘 첨삭 다시 보기"
        variant="ghost"
        onPress={() =>
          router.push({ pathname: "/record-detail", params: { id: String(answer.id) } })
        }
      />
    </View>
  );
}

export default function Question() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const [jobName, setJobName] = useState<string | null>(null);
  // undefined = 아직 불러오는 중, null = 오늘 답변 없음
  const [todayAnswer, setTodayAnswer] = useState<RecordListItem | null | undefined>(undefined);

  // 탭으로 돌아올 때마다 직무와 오늘 답변 여부를 다시 불러옴
  // 가장 최근 정식 답변이 오늘 날짜면 "오늘 완료" 화면
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const [profile, page] = await Promise.all([
            getJson<Profile>("/api/profile"),
            getJson<RecordPage>("/api/answers?limit=1"),
          ]);
          if (!active || !profile || !page) return;
          setJobName(profile.jobRoleName);
          const latest = page.items[0];
          setTodayAnswer(latest && latest.answerDate === todayString() ? latest : null);
        } catch (e) {
          console.log("question load failed:", e);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  if (todayAnswer === undefined) return null;
  const job = jobName ?? "선택한";

  return (
    <View style={styles.container}>
      <ScreenHeader title="질문">
        <Pressable style={styles.role} onPress={() => router.navigate("/profile")}>
          <Text style={styles.roleText}>{jobName ?? "직무 선택"}</Text>
          <Image source={assets.v4ChevronDown} style={styles.roleIcon} />
        </Pressable>
      </ScreenHeader>

      <ScrollView style={styles.scroll}>
        {todayAnswer ? <TodayDone answer={todayAnswer} /> : <StartQuestion jobName={job} />}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  role: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  roleText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
  roleIcon: {
    width: 14,
    height: 14,
  },
  scroll: {
    flex: 1,
  },
  body: {
    gap: 14,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["2xl"],
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },

  // 질문 고르기
  card: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 19,
    letterSpacing: -0.19,
    color: colors.text,
  },
  cardSpacer: {
    height: 6,
  },
  notice: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSub,
  },

  // 오늘 완료
  done: {
    fontFamily: fonts.pen,
    fontSize: 64,
    lineHeight: 58,
    color: colors.accent,
    transform: [{ rotate: "8deg" }],
  },
  message: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: 18,
  },
  messageTitle: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  messageSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSub,
  },
  result: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: 14,
  },
  resultText: {
    flex: 1,
    gap: 3,
  },
  resultCategory: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSub,
  },
  resultQuestion: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  resultPending: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSub,
  },
  retryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: colors.highlight,
  },
  badgeText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.onHighlight,
  },
  retryText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSub,
  },
});
