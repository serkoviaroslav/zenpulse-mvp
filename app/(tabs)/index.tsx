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

type PlanId = "monthly" | "yearly";

export default function PaywallScreen() {
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

  const onCta = () => {
    // MVP: сюда позже подключите покупку / пробный период
    // console.log("CTA: start trial with", selectedPlan);
  };

  const horizontalPadding = isSmall ? 18 : 22;
  const cardRadius = 18;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.statusBarSpacer} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: horizontalPadding, paddingBottom: 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Soft background "glow" */}
        <View pointerEvents="none" style={styles.bgGlowTop} />
        <View pointerEvents="none" style={styles.bgGlowBottom} />

        {/* Header */}
        <View style={{ marginTop: 10 }}>
          <Text style={[styles.brand, { fontSize: isSmall ? 26 : 30 }]}>ZenPulse</Text>
          <Text style={[styles.subtitle, { marginTop: 10, fontSize: isSmall ? 14 : 15 }]}>
            Тише в голове. Яснее в фокусе. Осознанность каждый день.
          </Text>
        </View>

        {/* Hero card */}
        <View
          style={[
            styles.heroCard,
            {
              borderRadius: cardRadius,
              marginTop: 18,
              padding: isSmall ? 16 : 18,
            },
          ]}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.heroLabel}>Premium</Text>
          </View>

          <Text style={[styles.heroTitle, { fontSize: isSmall ? 18 : 20 }]}>
            Откройте полный доступ к практикам
          </Text>
          <Text style={[styles.heroDesc, { marginTop: 8, fontSize: isSmall ? 13 : 14 }]}>
            Без рекламы, больше курсов и подборок — чтобы легче держать ритм и спокойствие.
          </Text>

          {/* Benefits */}
          <View style={{ marginTop: 14 }}>
            {benefits.map((b, idx) => (
              <View key={b.title} style={[styles.benefitRow, idx !== 0 && { marginTop: 12 }]}>
                <View style={styles.checkWrap}>
                  <Text style={styles.check}>✓</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.benefitTitle, { fontSize: isSmall ? 13 : 14 }]}>
                    {b.title}
                  </Text>
                  <Text
                    style={[styles.benefitDesc, { fontSize: isSmall ? 12.5 : 13 }]}
                    numberOfLines={2}
                  >
                    {b.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Plans */}
        <View style={{ marginTop: 18 }}>
          <Text style={styles.sectionTitle}>Выберите тариф</Text>

          <View style={{ marginTop: 12 }}>
            {plans.map((p) => {
              const selected = selectedPlan === p.id;
              const isBest = p.id === "yearly";

              return (
                <Pressable
                  key={p.id}
                  onPress={() => setSelectedPlan(p.id)}
                  style={({ pressed }) => [
                    styles.planCard,
                    {
                      borderRadius: cardRadius,
                      padding: isSmall ? 14 : 16,
                      marginTop: p.id === "monthly" ? 0 : 12,
                      borderColor: selected
                        ? "rgba(170, 220, 255, 0.55)"
                        : "rgba(255,255,255,0.08)",
                      backgroundColor: isBest
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.035)",
                      transform: [{ scale: pressed ? 0.99 : 1 }],
                      opacity: pressed ? 0.96 : 1,
                    },
                  ]}
                >
                  <View style={styles.planTopRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.planTitle}>{p.title}</Text>

                        {p.badge ? (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{p.badge}</Text>
                          </View>
                        ) : null}
                      </View>

                      <Text style={styles.planFootnote}>{p.footnote}</Text>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.planPrice}>
                        {p.price}
                        <Text style={styles.planPeriod}> {p.period}</Text>
                      </Text>

                      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                        {selected ? <View style={styles.radioInner} /> : null}
                      </View>
                    </View>
                  </View>

                  {isBest ? (
                    <View style={styles.bestHintRow}>
                      <Text style={styles.bestHint}>
                        Рекомендуем: самый выгодный вариант для регулярной практики
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* CTA */}
        <View style={{ marginTop: 18 }}>
          <Pressable
            onPress={onCta}
            style={({ pressed }) => [
              styles.cta,
              {
                borderRadius: 18,
                paddingVertical: isSmall ? 14 : 16,
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.995 : 1 }],
              },
            ]}
          >
            <Text style={[styles.ctaText, { fontSize: isSmall ? 15 : 16 }]}>
              Попробовать бесплатно
            </Text>
            <Text style={styles.ctaSub}>Отмена в любой момент • Безопасная оплата</Text>
          </Pressable>

          <Text style={styles.legal}>
            Продолжая, вы соглашаетесь с условиями и политикой конфиденциальности. Пробный период
            доступен для новых пользователей.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  safe: {
    flex: 1,
    backgroundColor: "#070A0E",
  },
  statusBarSpacer: {
    height: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
    backgroundColor: "#070A0E",
  },
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingTop: 18,
  },

  // Background glows (very subtle)
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

  brand: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "700" as const,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "rgba(255,255,255,0.62)",
    lineHeight: 20,
  },

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
  heroTopRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "rgba(170, 220, 255, 0.9)",
  },
  heroLabel: {
    color: "rgba(170, 220, 255, 0.9)",
    fontWeight: "600" as const,
    letterSpacing: 0.6,
    textTransform: "uppercase" as const,
    fontSize: 12,
  },
  heroTitle: {
    marginTop: 10,
    color: "rgba(255,255,255,0.90)",
    fontWeight: "700" as const,
    letterSpacing: 0.15,
    lineHeight: 26,
  },
  heroDesc: {
    color: "rgba(255,255,255,0.62)",
    lineHeight: 20,
  },

  benefitRow: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 12,
  },
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
  check: {
    color: "rgba(170, 220, 255, 0.95)",
    fontWeight: "800" as const,
    fontSize: 14,
    marginTop: -1,
  },
  benefitTitle: {
    color: "rgba(255,255,255,0.86)",
    fontWeight: "600" as const,
    letterSpacing: 0.1,
  },
  benefitDesc: {
    marginTop: 3,
    color: "rgba(255,255,255,0.58)",
    lineHeight: 18,
  },

  sectionTitle: {
    color: "rgba(255,255,255,0.82)",
    fontWeight: "700" as const,
    letterSpacing: 0.2,
    fontSize: 14,
  },

  planCard: {
    borderWidth: 1,
  },
  planTopRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  planTitle: {
    color: "rgba(255,255,255,0.88)",
    fontWeight: "700" as const,
    fontSize: 15,
  },
  planFootnote: {
    marginTop: 6,
    color: "rgba(255,255,255,0.58)",
    fontSize: 12.5,
    lineHeight: 17,
  },
  planPrice: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "800" as const,
    fontSize: 16,
    letterSpacing: 0.1,
  },
  planPeriod: {
    color: "rgba(255,255,255,0.62)",
    fontWeight: "600" as const,
    fontSize: 12.5,
  },

  badge: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255, 215, 140, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 140, 0.20)",
  },
  badgeText: {
    color: "rgba(255, 215, 140, 0.90)",
    fontWeight: "700" as const,
    fontSize: 11,
    letterSpacing: 0.3,
  },

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
  radioOuterSelected: {
    borderColor: "rgba(170, 220, 255, 0.70)",
    backgroundColor: "rgba(170, 220, 255, 0.08)",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "rgba(170, 220, 255, 0.95)",
  },

  bestHintRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  bestHint: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12.5,
    lineHeight: 18,
  },

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
  ctaText: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "800" as const,
    letterSpacing: 0.2,
  },
  ctaSub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    lineHeight: 16,
  },
  legal: {
    marginTop: 12,
    textAlign: "center" as const,
    color: "rgba(255,255,255,0.42)",
    fontSize: 11.5,
    lineHeight: 16,
  },
};
