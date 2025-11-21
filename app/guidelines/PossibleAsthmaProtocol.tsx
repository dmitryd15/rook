// PossibleAsthmaProtocol.tsx
// React Native interactive decision-tree scaffold for converting your PDF protocol
// into an in-app UI. All text is data-driven in PROTOCOL_NODES below so you can
// paste your exact wording without touching component logic.

import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

/********************
 * DATA MODEL
 ********************/

type Option = {
  id: string; // unique option id within node
  label: string; // button label shown to the user
  next?: string; // id of next node. If omitted, node is terminal
};

type Node = {
  id: string; // unique node id
  title: string; // section title
  subtitle?: string; // small description/question
  body?: string[]; // bullet points text
  actions?: string[]; // action bullets (e.g., immediate management)
  options?: Option[]; // decision buttons
  infoHint?: string; // fine-print guidance
};

/********************
 * PUT YOUR PROTOCOL TEXT HERE
 * Paste/replace all strings below with your official wording.
 * This scaffold ships with placeholder wording to illustrate structure only.
 ********************/

export const PROTOCOL_NODES: Node[] = [
  {
    id: "start",
    title: "Possible Asthma",
    subtitle:
      "Wheeze + history of cough or difficult breathing (↑ likelihood if age < 2y and recurrent wheeze)",
    options: [
      { id: "yes", label: "Yes – assess severity", next: "severity-screen" },
      { id: "no", label: "No – consider other diagnoses", next: "alt" },
    ],
  },
  {
    id: "severity-screen",
    title: "Severe Asthma? (Any of the following)",
    body: [
      "Oxygen saturation < 90%",
      "Central cyanosis",
      "Inability to drink/breastfeed",
      "AVPU not 'A' (responds to voice/pain/unresponsive)",
      "Severe chest indrawing",
      "Grunting",
      "RR ≥ 70/min (0–11m) or ≥ 50/min (12–59m)",
      "Silent chest on auscultation",
    ],
    options: [
      { id: "any", label: "Any present", next: "severe-management" },
      { id: "none", label: "None present", next: "mild-moderate" },
    ],
    infoHint: "Replace bullets with exact criteria from your PDF.",
  },
  {
    id: "severe-management",
    title: "Immediate Management (Severe)",
    actions: [
      "Admit/Refer urgently",
      "Oxygen to keep SpO₂ ≥ 92% (per local policy)",
      "Nebulize: 2.5 mg salbutamol or give 6 puffs via MDI + spacer; repeat q20 minutes × 3 as needed",
      "Consider ipratropium 250 mcg via nebulizer with each salbutamol dose for first hour",
      "Prednisolone/Equivalent steroid: per weight-based dosing per your guideline",
      "Antibiotics only if severe pneumonia suspected",
    ],
    options: [
      { id: "monitor", label: "Monitor closely for 1–2 hours", next: "monitor" },
    ],
  },
  {
    id: "mild-moderate",
    title: "Mild or Moderate Asthma",
    body: [
      "Wheeze plus lower chest wall indrawing OR fast breathing",
      "RR > 50/min (age 2–11m) or > 40/min (age 12–59m)",
    ],
    actions: [
      "Give salbutamol MDI: 2 puffs (or 2.5 mg nebulized) q20 minutes up to 3 doses as needed",
      "Reassess after each dose; if improving, continue and plan discharge with caregiver education",
    ],
    options: [
      { id: "no-response", label: "No/poor response", next: "severe-management" },
      { id: "improving", label: "Improving – continue & review", next: "discharge" },
    ],
    infoHint: "Adjust wording & thresholds to match your protocol.",
  },
  {
    id: "monitor",
    title: "Close Monitoring (1–2 hours)",
    body: [
      "Reassess work of breathing, RR, SpO₂, ability to feed/talk",
      "Escalate per severe pathway if deterioration",
    ],
    options: [
      { id: "reassess", label: "Reassess – still severe", next: "severe-management-2" },
      { id: "getting-better", label: "Improving", next: "discharge" },
    ],
  },
  // Duplicate node renamed to avoid key conflict
  {
    id: "severe-management-2",
    title: "Immediate Management (Severe)",
    actions: [
      "Admit/Refer urgently",
      "Oxygen to keep SpO₂ ≥ 92% (per local policy)",
      "Nebulize: 2.5 mg salbutamol or give 6 puffs via MDI + spacer; repeat q20 minutes × 3 as needed",
      "Consider ipratropium 250 mcg via nebulizer with each salbutamol dose for first hour",
      "Prednisolone/Equivalent steroid: per weight-based dosing per your guideline",
      "Antibiotics only if severe pneumonia suspected",
    ],
    options: [
      { id: "monitor", label: "Monitor closely for 1–2 hours", next: "monitor" },
    ],
  },
  {
    id: "discharge",
    title: "Discharge & Follow-up",
    actions: [
      "Review inhaler technique and spacer use with caregiver",
      "Provide salbutamol MDI plan (with max doses per day as per your guideline)",
      "Consider oral corticosteroid course if indicated by protocol",
      "Educate on danger signs and when to return immediately",
      "Arrange follow-up within 3–5 days (or per your policy)",
    ],
    options: [
      { id: "done", label: "Finish" },
      { id: "restart", label: "Restart pathway", next: "start" },
    ],
  },
  {
    id: "alt",
    title: "Consider Alternative Diagnoses",
    body: [
      "Bronchiolitis, pneumonia, foreign body, cardiac causes, etc.",
  "Follow appropriate pathways per local protocols.",
    ],
    options: [{ id: "back", label: "Back to start", next: "start" }],
  },
];

/********************
 * COMPONENT
 ********************/

const findNode = (nodes: Node[], id: string) => nodes.find((n) => n.id === id)!;

export default function PossibleAsthmaProtocol() {
  const nodes = useMemo(() => PROTOCOL_NODES, []);
  const [stack, setStack] = useState<string[]>(["start"]);
  const current = findNode(nodes, stack[stack.length - 1]);

  const goNext = (next?: string) => {
    if (!next) return; // terminal option
    setStack((s) => [...s, next]);
  };
  const goBack = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const restart = () => setStack(["start"]);

  return (
    <View style={[styles.container, { flex: 1 }]}> 
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pediatric Management</Text>
        <Text style={styles.headerSubtitle}>Possible Asthma – Interactive Pathway</Text>
      </View>

      <View style={styles.breadcrumb}>
        {stack.map((id, idx) => (
          <Text key={id} style={styles.crumb}>
            {findNode(nodes, id).title}
            {idx < stack.length - 1 ? "  ›  " : ""}
          </Text>
        ))}
      </View>

      <ScrollView style={[styles.card, { flex: 1, marginBottom: 0 }]} contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <Text style={styles.title}>{current.title}</Text>
        {current.subtitle ? <Text style={styles.subtitle}>{current.subtitle}</Text> : null}

        {current.body && current.body.length > 0 && (
          <View style={styles.section}>
            {current.body.map((line, i) => (
              <Text key={i} style={styles.bullet}>{`• ${line}`}</Text>
            ))}
          </View>
        )}

        {current.actions && current.actions.length > 0 && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Actions</Text>
            {current.actions.map((line, i) => (
              <Text key={i} style={styles.bullet}>{`• ${line}`}</Text>
            ))}
          </View>
        )}

        {current.infoHint ? (
          <Text style={styles.hint}>Hint: {current.infoHint}</Text>
        ) : null}

        <View style={{ height: 12 }} />

        {current.options && (
          <View>
            {current.options.map((opt) => (
              <Pressable
                key={opt.id}
                style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
                onPress={() => {
                  if (!opt.next) {
                    Alert.alert("End of Pathway", "You can restart or go back.");
                  }
                  if (opt.label.toLowerCase().includes("restart")) restart();
                  else if (opt.label.toLowerCase().includes("back")) goBack();
                  else goNext(opt.next);
                }}
              >
                <Text style={styles.buttonText}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />

        <View style={styles.footerRow}>
          <Pressable style={styles.secondaryBtn} onPress={goBack}>
            <Text style={styles.secondaryBtnText}>Back</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={restart}>
            <Text style={styles.secondaryBtnText}>Restart</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

/********************
 * STYLES
 ********************/

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb" },
  header: { paddingTop: 18, paddingBottom: 10, alignItems: "center", backgroundColor: "#0ea5e9" },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700" },
  headerSubtitle: { color: "white", fontSize: 13, opacity: 0.95 },
  breadcrumb: { padding: 10, paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap" },
  crumb: { color: "#475569", fontSize: 12 },
  card: {
    marginHorizontal: 12,
    // marginBottom removed for full height
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#334155", marginTop: 6 },
  section: { marginTop: 12 },
  sectionBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#0f172a", marginBottom: 6 },
  bullet: { fontSize: 14, color: "#0f172a", lineHeight: 20, marginBottom: 4 },
  hint: { marginTop: 10, fontSize: 12, color: "#64748b" },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0ea5e9",
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 15, fontWeight: "700" },
  footerRow: { flexDirection: "row", gap: 10, justifyContent: "center" },
  secondaryBtn: {
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
  },
  secondaryBtnText: { color: "#0f172a", fontWeight: "600" },
  disclaimer: {
    textAlign: "center",
    fontSize: 11,
    color: "#64748b",
    marginBottom: 10,
  },
});
