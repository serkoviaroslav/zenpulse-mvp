// app/(tabs)/index.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";

type Screen = "paywall" | "meditations";
type PlanId = "monthly" | "yearly";

type Meditation = {
  id: string;
  title: string;
  minutes: number;
  // true = доступна без покупки
  isFree: boolean;
};

// ✅ ВАЖНО: массив должен существовать в этом файле, иначе MEDITATIONS будет красным
const MEDITATIONS: Meditation[] = [
  { id: "m1", title: "Дыхание и мягкий старт", minutes: 5, isFree: true },
  { id: "m2", title: "Сканирование тела", minutes: 8, isFree: true },
  { id: "m3", title: "Фокус на одном объекте", minutes: 10, isFree: true },
  { id: "m4", title: "Ум как небо", minutes: 15, isFree: false },
  { id: "m5", title: "Глубокое расслабление", minutes: 18, isFree: false },
  { id: "m6", title: "Осознанность", minutes: 9, isFree: false },
];

export default function ZenPulsePrototype() {
  /**
   * Важно:
   * - isSubscribed = "покупка прошла"
   * - по кнопке «Попробовать бесплатно» просто открываем экран с карточками,
   *   но покупка НЕ считается прошедшей => isSubscribed остаётся false
   */
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [screen, setScreen] = useState<Screen>("paywall");

  const openMeditationsAsTrial = () => {
    setScreen("meditations");
  };

  const goToPaywall = () => setScreen("paywall");

  // (Опционально для теста MVP)
  const devActivatePurchase = () => setIsSubscribed(true);
  const devResetPurchase = () => setIsSubscribed(false);

  return screen === "paywall" ? (
    <PaywallScreen
      isSubscribed={isSubscribed}
      onTryFree={openMeditationsAsTrial}
      onDevActivate={devActivatePurchase}
      onDevReset={devResetPurchase}
    />
  ) : (
    // ✅ FIX: правильное имя пропса
    <MeditationsScreen isSubscribed={isSubscribed} onLockedPress={goToPaywall} />
  );
}

/** =========================
 *  PAYWALL
 *  ========================= */
function PaywallScreen({
  isSubscribed,
  onTryFree,
  onDevActivate,
  onDevReset,
}: {
  isSubscribed: boolean;
  onTryFree: () => void;
  onDevActivate: () => void;
  onDevReset: () => void;
}) {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;

  const [selectedPlan, setSelectedPlan] = useState<PlanId>("yearly");

  const plans = useMemo(
    () => [
      {
        id: "monthly" as const,
        title: "Месячный",
        price: "299 ₽",
        period: "/мес",
        badge: null as null | string,
        footnote: "Оплата ежемесячно, отмена в любой момент",
      },
      {
        id: "yearly" as const,
        title: "Годовой",
        price: "1 990 ₽",
        period: "/год",
        badge: "Выгодно",
        footnote: "Экономия ~45% по сравнению с помесячной оплатой",
      },
    ],
    []
  );

  const benefits = useMemo(
    () => [
      { title: "Ежедневные практики", desc: "Короткие сессии для фокуса и спокойствия" },
      { title: "Премиум-курсы", desc: "Глубокие программы по стрессу и осознанности" },
      { title: "Звуки для сна", desc: "Шум дождя, океан и мягкие амбиенты" },
      { title: "Оффлайн-доступ", desc: "Скачивайте и медитируйте без интернета" },
    ],
    []
  );

  const horizontalPadding = isSmall ? 18 : 22;
  const cardRadius = 18;

  return (
    <SafeAreaView style={pw.safe}>
      <View style={pw.statusBarSpacer} />
      <ScrollView
        style={pw.scroll}
        contentContainerStyle={[pw.container, { paddingHorizontal: horizontalPadding, paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View pointerEvents="none" style={pw.bgGlowTop} />
        <View pointerEvents="none" style={pw.bgGlowBottom} />

        <View style={{ marginTop: 10 }}>
          <Text style={[pw.brand, { fontSize: isSmall ? 26 : 30 }]}>ZenPulse</Text>
          <Text style={[pw.subtitle, { marginTop: 10, fontSize: isSmall ? 14 : 15 }]}>
            Тише в голове. Яснее в фокусе. Осознанность каждый день.
          </Text>

          <View style={{ marginTop: 10 }}>
            <Text style={pw.subState}>
              Статус:{" "}
              <Text style={{ fontWeight: "800" as const }}>
                {isSubscribed ? "Покупка прошла (Premium)" : "Не куплено"}
              </Text>
            </Text>
          </View>
        </View>

        <View style={[pw.heroCard, { borderRadius: cardRadius, marginTop: 18, padding: isSmall ? 16 : 18 }]}>
          <View style={pw.heroTopRow}>
            <View style={pw.pulseDot} />
            <Text style={pw.heroLabel}>Premium</Text>
          </View>

          <Text style={[pw.heroTitle, { fontSize: isSmall ? 18 : 20 }]}>Откройте полный доступ к практикам</Text>
          <Text style={[pw.heroDesc, { marginTop: 8, fontSize: isSmall ? 13 : 14 }]}>
            Без рекламы, больше курсов и подборок — чтобы легче держать ритм и спокойствие.
          </Text>

          <View style={{ marginTop: 14 }}>
            {benefits.map((b, idx) => (
              <View key={b.title} style={[pw.benefitRow, idx !== 0 && { marginTop: 12 }]}>
                <View style={pw.checkWrap}>
                  <Text style={pw.check}>✓</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[pw.benefitTitle, { fontSize: isSmall ? 13 : 14 }]}>{b.title}</Text>
                  <Text style={[pw.benefitDesc, { fontSize: isSmall ? 12.5 : 13 }]} numberOfLines={2}>
                    {b.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={pw.sectionTitle}>Выберите тариф</Text>

          <View style={{ marginTop: 12 }}>
            {plans.map((p) => {
              const selected = selectedPlan === p.id;
              const isBest = p.id === "yearly";

              return (
                <Pressable
                  key={p.id}
                  onPress={() => setSelectedPlan(p.id)}
                  style={({ pressed }) => [
                    pw.planCard,
                    {
                      borderRadius: cardRadius,
                      padding: isSmall ? 14 : 16,
                      marginTop: p.id === "monthly" ? 0 : 12,
                      borderColor: selected ? "rgba(170, 220, 255, 0.55)" : "rgba(255,255,255,0.08)",
                      backgroundColor: isBest ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.035)",
                      transform: [{ scale: pressed ? 0.99 : 1 }],
                      opacity: pressed ? 0.96 : 1,
                    },
                  ]}
                >
                  <View style={pw.planTopRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={pw.planTitle}>{p.title}</Text>
                        {p.badge ? (
                          <View style={pw.badge}>
                            <Text style={pw.badgeText}>{p.badge}</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={pw.planFootnote}>{p.footnote}</Text>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={pw.planPrice}>
                        {p.price}
                        <Text style={pw.planPeriod}> {p.period}</Text>
                      </Text>

                      <View style={[pw.radioOuter, selected && pw.radioOuterSelected]}>
                        {selected ? <View style={pw.radioInner} /> : null}
                      </View>
                    </View>
                  </View>

                  {isBest ? (
                    <View style={pw.bestHintRow}>
                      <Text style={pw.bestHint}>Рекомендуем: самый выгодный вариант для регулярной практики</Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* CTA: открывает медитации, но НЕ активирует покупку */}
        <View style={{ marginTop: 18 }}>
          <Pressable
            onPress={onTryFree}
            style={({ pressed }) => [
              pw.cta,
              {
                borderRadius: 18,
                paddingVertical: isSmall ? 14 : 16,
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.995 : 1 }],
              },
            ]}
          >
            <Text style={[pw.ctaText, { fontSize: isSmall ? 15 : 16 }]}>Попробовать бесплатно</Text>
            <Text style={pw.ctaSub}>
              {selectedPlan === "yearly" ? "Годовой тариф выбран" : "Месячный тариф выбран"} • Покупка не завершена
            </Text>
          </Pressable>

          {/* DEV: можно удалить, если не нужно */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <Pressable onPress={onDevActivate} style={({ pressed }) => [pw.devBtn, { opacity: pressed ? 0.7 : 1 }]}>
              <Text style={pw.devBtnText}>DEV: купить</Text>
            </Pressable>
            <Pressable onPress={onDevReset} style={({ pressed }) => [pw.devBtn, { opacity: pressed ? 0.7 : 1 }]}>
              <Text style={pw.devBtnText}>DEV: сброс</Text>
            </Pressable>
          </View>

          <Text style={pw.legal}>
            Продолжая, вы соглашаетесь с условиями и политикой конфиденциальности. Пробный период доступен для новых
            пользователей.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const pw = {
  safe: { flex: 1, backgroundColor: "#070A0E" },
  statusBarSpacer: {
    height: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
    backgroundColor: "#070A0E",
  },
  scroll: { flex: 1 },
  container: { flexGrow: 1, paddingTop: 18 },

  bgGlowTop: {
    position: "absolute" as const,
    top: -140,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: "rgba(120, 190, 255, 0.10)",
  },
  bgGlowBottom: {
    position: "absolute" as const,
    bottom: -200,
    right: -160,
    width: 380,
    height: 380,
    borderRadius: 380,
    backgroundColor: "rgba(160, 120, 255, 0.08)",
  },

  brand: { color: "rgba(255,255,255,0.92)", fontWeight: "700" as const, letterSpacing: 0.2 },
  subtitle: { color: "rgba(255,255,255,0.62)", lineHeight: 20 },
  subState: { color: "rgba(255,255,255,0.50)", fontSize: 12.5 },

  heroCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.03)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  heroTopRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 8 },
  pulseDot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "rgba(170, 220, 255, 0.9)" },
  heroLabel: {
    color: "rgba(170, 220, 255, 0.9)",
    fontWeight: "600" as const,
    letterSpacing: 0.6,
    textTransform: "uppercase" as const,
    fontSize: 12,
  },
  heroTitle: { marginTop: 10, color: "rgba(255,255,255,0.90)", fontWeight: "700" as const, letterSpacing: 0.15 },
  heroDesc: { color: "rgba(255,255,255,0.62)", lineHeight: 20 },

  benefitRow: { flexDirection: "row" as const, alignItems: "flex-start" as const, gap: 12 },
  checkWrap: {
    width: 26,
    height: 26,
    borderRadius: 10,
    backgroundColor: "rgba(170, 220, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(170, 220, 255, 0.18)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: 1,
  },
  check: { color: "rgba(170, 220, 255, 0.95)", fontWeight: "800" as const, fontSize: 14, marginTop: -1 },
  benefitTitle: { color: "rgba(255,255,255,0.86)", fontWeight: "600" as const, letterSpacing: 0.1 },
  benefitDesc: { marginTop: 3, color: "rgba(255,255,255,0.58)", lineHeight: 18 },

  sectionTitle: { color: "rgba(255,255,255,0.82)", fontWeight: "700" as const, letterSpacing: 0.2, fontSize: 14 },

  planCard: { borderWidth: 1 },
  planTopRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12 },
  planTitle: { color: "rgba(255,255,255,0.88)", fontWeight: "700" as const, fontSize: 15 },
  planFootnote: { marginTop: 6, color: "rgba(255,255,255,0.58)", fontSize: 12.5, lineHeight: 17 },
  planPrice: { color: "rgba(255,255,255,0.92)", fontWeight: "800" as const, fontSize: 16, letterSpacing: 0.1 },
  planPeriod: { color: "rgba(255,255,255,0.62)", fontWeight: "600" as const, fontSize: 12.5 },

  badge: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255, 215, 140, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 140, 0.20)",
  },
  badgeText: { color: "rgba(255, 215, 140, 0.90)", fontWeight: "700" as const, fontSize: 11, letterSpacing: 0.3 },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  radioOuterSelected: { borderColor: "rgba(170, 220, 255, 0.70)", backgroundColor: "rgba(170, 220, 255, 0.08)" },
  radioInner: { width: 10, height: 10, borderRadius: 10, backgroundColor: "rgba(170, 220, 255, 0.95)" },

  bestHintRow: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" },
  bestHint: { color: "rgba(255,255,255,0.55)", fontSize: 12.5, lineHeight: 18 },

  cta: {
    borderWidth: 1,
    borderColor: "rgba(170, 220, 255, 0.35)",
    backgroundColor: "rgba(170, 220, 255, 0.14)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  ctaText: { color: "rgba(255,255,255,0.92)", fontWeight: "800" as const, letterSpacing: 0.2 },
  ctaSub: { marginTop: 6, color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 16 },

  devBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center" as const,
  },
  devBtnText: { color: "rgba(255,255,255,0.55)", fontWeight: "700" as const, fontSize: 12.5 },

  legal: { marginTop: 12, textAlign: "center" as const, color: "rgba(255,255,255,0.42)", fontSize: 11.5, lineHeight: 16 },
};

/** =========================
 *  MEDITATIONS
 *  ========================= */
function MeditationsScreen({
  isSubscribed,
  onLockedPress,
}: {
  isSubscribed: boolean;
  onLockedPress: () => void;
}) {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;
  const horizontalPadding = isSmall ? 18 : 22;

  const ms = {
    safe: { flex: 1, backgroundColor: "#070A0E" as const },
    statusBarSpacer: {
      height: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
      backgroundColor: "#070A0E",
    },
    scroll: { flex: 1 },
    container: { flexGrow: 1, paddingTop: 18 },

    bgGlowTop: {
      position: "absolute" as const,
      top: -160,
      right: -130,
      width: 340,
      height: 340,
      borderRadius: 340,
      backgroundColor: "rgba(120, 190, 255, 0.10)",
    },
    bgGlowBottom: {
      position: "absolute" as const,
      bottom: -210,
      left: -170,
      width: 420,
      height: 420,
      borderRadius: 420,
      backgroundColor: "rgba(160, 120, 255, 0.07)",
    },

    topBar: { flexDirection: "row" as const, alignItems: "flex-start" as const, gap: 12 },
    title: { color: "rgba(255,255,255,0.92)", fontWeight: "800" as const, letterSpacing: 0.2 },
    subtitle: { marginTop: 8, color: "rgba(255,255,255,0.60)", lineHeight: 19, fontSize: 13.5 },

    chip: {
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
      backgroundColor: "rgba(255,255,255,0.05)",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      marginTop: 2,
    },
    chipText: { color: "rgba(255,255,255,0.78)", fontWeight: "700" as const, fontSize: 12.5 },

    vibeCard: {
      marginTop: 14,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.10)",
      backgroundColor: "rgba(255,255,255,0.03)",
      borderRadius: 18,
      padding: 16,
    },
    vibeTitle: { color: "rgba(255,255,255,0.88)", fontWeight: "800" as const, fontSize: 15 },
    vibeHint: { marginTop: 6, color: "rgba(255,255,255,0.58)", fontSize: 12.5, lineHeight: 18 },

    moodRow: { flexDirection: "row" as const, gap: 10, marginTop: 12 },
    moodBtn: {
      flex: 1,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.10)",
      backgroundColor: "rgba(255,255,255,0.02)",
      borderRadius: 14,
      paddingVertical: 10,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    moodBtnSelected: {
      borderColor: "rgba(170, 220, 255, 0.35)",
      backgroundColor: "rgba(170, 220, 255, 0.10)",
    },
    moodText: { fontSize: 18 },

    vibeCta: {
      marginTop: 12,
      borderWidth: 1,
      borderColor: "rgba(170, 220, 255, 0.35)",
      backgroundColor: "rgba(170, 220, 255, 0.12)",
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    vibeCtaText: {
      color: "rgba(255,255,255,0.92)",
      fontWeight: "900" as const,
      fontSize: 14.5,
      letterSpacing: 0.2,
    },

    vibeOutput: {
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.08)",
      paddingTop: 12,
    },
    vibeOutputLabel: { color: "rgba(255,255,255,0.62)", fontSize: 12, fontWeight: "700" as const },
    vibeOutputText: { marginTop: 6, color: "rgba(255,255,255,0.88)", fontSize: 13.5, lineHeight: 20 },

    sectionTitle: { marginTop: 0, color: "rgba(255,255,255,0.82)", fontWeight: "800" as const, fontSize: 14 },

    card: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 16,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 12,
    },
    cardUnlocked: { borderColor: "rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.035)" },
    cardLocked: { borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.018)" },

    cardTitle: { color: "rgba(255,255,255,0.88)", fontWeight: "700" as const, fontSize: 15, letterSpacing: 0.1 },
    cardTitleLocked: { color: "rgba(255,255,255,0.46)" },
    cardMeta: { marginTop: 6, color: "rgba(255,255,255,0.60)", fontSize: 12.5 },
    cardMetaLocked: { color: "rgba(255,255,255,0.40)" },

    lockPill: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.10)",
      backgroundColor: "rgba(255,255,255,0.02)",
    },
    lockIcon: { fontSize: 13 },
    lockLabel: { color: "rgba(255,255,255,0.55)", fontWeight: "700" as const, fontSize: 12 },

    playPill: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: "rgba(170, 220, 255, 0.25)",
      backgroundColor: "rgba(170, 220, 255, 0.10)",
    },
    playIcon: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: -1 },
    playLabel: { color: "rgba(255,255,255,0.85)", fontWeight: "800" as const, fontSize: 12 },

    primaryCta: {
      marginTop: 18,
      borderWidth: 1,
      borderColor: "rgba(170, 220, 255, 0.35)",
      backgroundColor: "rgba(170, 220, 255, 0.12)",
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: "center" as const,
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    primaryCtaText: { color: "rgba(255,255,255,0.92)", fontWeight: "900" as const, fontSize: 15, letterSpacing: 0.2 },
    primaryCtaSub: { marginTop: 6, color: "rgba(255,255,255,0.55)", fontSize: 12 },
  };

  // ---- AI Настрой дня ----
  type Mood = "🙂" | "😐" | "😔";
  const [mood, setMood] = useState<Mood>("🙂");
  const [aiText, setAiText] = useState("");

  const buildPrompt = (selectedMood: Mood) => {
    const moodHint =
      selectedMood === "🙂"
        ? "спокойное и приподнятое"
        : selectedMood === "😐"
        ? "нейтральное и немного рассеянное"
        : "уставшее или грустное, нуждается в поддержке";

    return [
      "Ты — ассистент по осознанности в приложении ZenPulse.",
      "Сгенерируй короткую аффирмацию на русском (1–2 предложения).",
      "Стиль: спокойный, премиальный, минималистичный. Без восклицаний.",
      `Настроение пользователя: ${selectedMood} (${moodHint}).`,
    ].join(" ");
  };

  const hashString = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return h;
  };

  const mockLLMResponse = (prompt: string, selectedMood: Mood) => {
    const bank: Record<Mood, string[]> = {
      "🙂": [
        "Сохрани это ясное спокойствие и сделай один небольшой шаг с полным вниманием.",
        "Сегодня достаточно идти мягко и уверенно — вернись к дыханию и продолжай.",
      ],
      "😐": [
        "Сделай паузу на один вдох и выбери одну простую задачу — начни без давления.",
        "Ничего не нужно доказывать: отметь ощущения в теле и продолжай спокойно.",
      ],
      "😔": [
        "Будь бережен к себе: вдохни медленно и отпусти напряжение на выдохе.",
        "Сейчас достаточно одного тихого шага — ты можешь опереться на дыхание.",
      ],
    };

    const idx = Math.abs(hashString(prompt)) % bank[selectedMood].length;
    return bank[selectedMood][idx];
  };

  const onGenerateVibe = () => {
    const prompt = buildPrompt(mood);
    setAiText(mockLLMResponse(prompt, mood));
  };

  // ---- Locked logic: ровно m4–m6, если нет покупки ----
  const lockedIds = useMemo(() => new Set<string>(["m4", "m5", "m6"]), []);

  const onPressMeditation = (m: Meditation) => {
    const locked = !isSubscribed && lockedIds.has(m.id);
    if (locked) return onLockedPress();
    // MVP: позже откроется плеер
  };

  return (
    <SafeAreaView style={ms.safe}>
      <View style={ms.statusBarSpacer} />

      <ScrollView
        style={ms.scroll}
        contentContainerStyle={[ms.container, { paddingHorizontal: horizontalPadding, paddingBottom: 28 }]}
        showsVerticalScrollIndicator={false}
      >
        <View pointerEvents="none" style={ms.bgGlowTop} />
        <View pointerEvents="none" style={ms.bgGlowBottom} />

        <View style={ms.topBar}>
          <View style={{ flex: 1 }}>
            <Text style={[ms.title, { fontSize: isSmall ? 22 : 24 }]}>Медитации</Text>
            <Text style={ms.subtitle}>
              {isSubscribed ? "Premium куплен — все сессии доступны" : "Часть сессий заблокирована до покупки Premium"}
            </Text>
          </View>

          {!isSubscribed ? (
            <Pressable
              onPress={onLockedPress}
              hitSlop={10}
              style={({ pressed }) => [ms.chip, { opacity: pressed ? 0.75 : 1 }]}
            >
              <Text style={ms.chipText}>Paywall</Text>
            </Pressable>
          ) : (
            <View style={[ms.chip, { borderColor: "rgba(170, 220, 255, 0.22)" }]}>
              <Text style={ms.chipText}>Premium</Text>
            </View>
          )}
        </View>

        <View style={ms.vibeCard}>
          <Text style={ms.vibeTitle}>AI Настрой дня</Text>
          <Text style={ms.vibeHint}>Выберите настроение и сгенерируйте короткую аффирмацию.</Text>

          <View style={ms.moodRow}>
            {(["🙂", "😐", "😔"] as Mood[]).map((emoji) => {
              const selected = mood === emoji;
              return (
                <Pressable
                  key={emoji}
                  onPress={() => setMood(emoji)}
                  style={({ pressed }) => [
                    ms.moodBtn,
                    selected && ms.moodBtnSelected,
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Text style={ms.moodText}>{emoji}</Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={onGenerateVibe}
            style={({ pressed }) => [
              ms.vibeCta,
              { opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.995 : 1 }] },
            ]}
          >
            <Text style={ms.vibeCtaText}>Сгенерировать настрой</Text>
          </Pressable>

          {aiText ? (
            <View style={ms.vibeOutput}>
              <Text style={ms.vibeOutputLabel}>Результат</Text>
              <Text style={ms.vibeOutputText}>{aiText}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={ms.sectionTitle}>Подборка</Text>

          <View style={{ marginTop: 12 }}>
            {MEDITATIONS.map((m, idx) => {
              const locked = !isSubscribed && lockedIds.has(m.id);

              return (
                <Pressable
                  key={m.id}
                  onPress={() => onPressMeditation(m)}
                  style={({ pressed }) => [
                    ms.card,
                    locked ? ms.cardLocked : ms.cardUnlocked,
                    {
                      opacity: pressed ? 0.95 : 1,
                      transform: [{ scale: pressed ? 0.99 : 1 }],
                      marginTop: idx === 0 ? 0 : 12,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[ms.cardTitle, locked && ms.cardTitleLocked]} numberOfLines={1}>
                      {m.title}
                    </Text>
                    <Text style={[ms.cardMeta, locked && ms.cardMetaLocked]}>{m.minutes} мин</Text>
                  </View>

                  {locked ? (
                    <View style={ms.lockPill}>
                      <Text style={ms.lockIcon}>🔒</Text>
                      <Text style={ms.lockLabel}>Закрыто</Text>
                    </View>
                  ) : (
                    <View style={ms.playPill}>
                      <Text style={ms.playIcon}>▶</Text>
                      <Text style={ms.playLabel}>Старт</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {!isSubscribed ? (
          <Pressable
            onPress={onLockedPress}
            style={({ pressed }) => [ms.primaryCta, { opacity: pressed ? 0.9 : 1 }]}
          >
            <Text style={ms.primaryCtaText}>Перейти к выбору подписки</Text>
            <Text style={ms.primaryCtaSub}>Заблокированные карточки ведут на Paywall</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
