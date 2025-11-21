// TriageSickChildProtocol.tsx
// Scaffold for "Triage of a Sick Child" protocol. Replace text with your official protocol content.

import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useColorScheme } from '../../hooks/useColorScheme';

// Types for the protocol structure

type LabelObj = { bold: string; rest: string };
type EmergencyOption = {
  label: string | LabelObj;
  signs?: string[];
  action: string[];
};
type PriorityOption = {
  label: string | LabelObj;
  description?: string;
};

// (Optional) Example node typing if you later enforce types on TRIAGE_DATA
type TriageNode =
  | {
      id: 'start';
      question: string;
      note?: string;
      yesLabel: string;
      noLabel: string;
      yes: { id: 'emergency-signs'; question: string; options: EmergencyOption[] };
      no: {
        id: 'priority-signs';
        question: string;
        yesLabel: string;
        noLabel: string;
        yes: { id: 'priority-list'; options: PriorityOption[]; action: string[] };
        no: { id: 'nonurgent'; label: string; action: string[] };
      };
    }
  | { id: 'emergency-signs'; question: string; options: EmergencyOption[] }
  | { id: 'priority-actions'; action: string[] }
  | { id: 'nonurgent'; label: string; action: string[] };

const TRIAGE_DATA = {
  title: 'Triage of Sick Children',
  flow: [
    {
      question: 'Any Emergency Signs?',
      note: 'If history of trauma ensure cervical spine is protected',
      yesLabel: '→ Yes',
      noLabel: '→ No',
      yes: {
        question: 'Which Emergency Sign?',
        options: [
          {
            label: { bold: 'A', rest: 'irway & Breathing' },
            signs: [
              'Obstructed breathing',
              'Central cyanosis',
              'Severe respiratory distress',
              'Weak / absent breathing',
            ],
            action: [
              'Immediate transfer to emergency area',
              'Start life support procedures',
              'Give oxygen',
              'Weigh if possible',
            ],
          },
          {
            label: { bold: 'C', rest: 'irculation' },
            signs: [
              'Cold hands with ANY of:',
              'Capillary refill > 3 secs',
              'Weak + fast pulse',
              'Slow (<60 bpm) or absent pulse',
            ],
            action: ['Immediate transfer to emergency area'],
          },
          {
            label: { bold: 'C', rest: 'oma / Convulsing / Confusion' },
            signs: ["AVPU = 'P' or 'U'"],
            action: ['Immediate transfer to emergency area'],
          },
          {
            label: { bold: 'D', rest: 'iarrhoea with sunken eyes / Skin pinch > 2 secs' },
            action: [
              'Immediate transfer to emergency area',
              'Assess/treat for severe dehydration',
            ],
          },
        ],
      },
      no: {
        question: 'Any Priority Signs?',
        yesLabel: '→ Yes',
        noLabel: '→ No',
        yes: {
          options: [
            { label: { bold: 'T', rest: 'iny' }, description: 'Sick infant aged < 2 months' },
            { label: { bold: 'T', rest: 'emperature' }, description: 'Very high > 39.5°C' },
            { label: { bold: 'T', rest: 'rauma' }, description: 'Major trauma' },
            { label: { bold: 'P', rest: 'ain' }, description: 'Child in severe pain' },
            { label: { bold: 'P', rest: 'oisoning' }, description: 'Mother reports poisoning' },
            { label: { bold: 'P', rest: 'allor' }, description: 'Severe pallor' },
            { label: { bold: 'R', rest: 'estless / Irritable / Lethargic / Floppy' } },
            { label: { bold: 'R', rest: 'espiratory distress' } },
            { label: { bold: 'R', rest: 'eferral' }, description: 'Has urgent referral letter' },
            { label: { bold: 'R', rest: 'ecent admission' }, description: 'Discharge within 2 weeks' },
            { label: { bold: 'B', rest: 'urns' }, description: 'Burns of both feet' },
            { label: { bold: 'V', rest: 'isible severe wasting' } },
          ],
          action: [
            'Front of the queue',
            'Clinical assessment as soon as possible',
            'Weigh',
            'Baseline observations',
          ],
        },
        no: {
          label: 'Non-Urgent',
          action: ['Wait in the queue'],
        },
      },
    },
  ],
};

type TriageStep =
  | { type: 'start' }
  | { type: 'emergency-signs' }
  | { type: 'priority-signs' }       // now shows list + Yes/No
  | { type: 'priority-actions' }     // shows actions only after Yes
  | { type: 'nonurgent' };

const { title, flow } = TRIAGE_DATA;

export default function TriageSickChildProtocol() {
  const colorScheme = useColorScheme && typeof useColorScheme === 'function' ? useColorScheme() : 'light';
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#181A20' : '#fff';
  const cardColor = isDark ? '#23262F' : '#f2faff';
  const cardPriorityColor = isDark ? '#23262F' : '#fffbe6';
  const textColor = isDark ? '#fff' : '#181A20';
  const noteColor = isDark ? '#aaa' : '#555';
  const accentColor = '#007AFF';
  const buttonColor = isDark ? '#22304a' : '#d0e8ff';
  const backButtonColor = isDark ? '#222' : '#eee';
  // Navigation state: stack of steps
  const [stack, setStack] = useState<TriageStep[]>([{ type: 'start' }]);
  const current = stack[stack.length - 1];
  const start = flow[0];

  // Navigation helpers
  const goTo = (step: TriageStep) => setStack((s) => [...s, step]);
  const goBack = () => { if (stack.length > 1) setStack((s) => s.slice(0, -1)); };

  // Shared helpers
  function renderLabel(label: string | LabelObj) {
    if (typeof label === "string") {
      return <Text style={{ fontSize: 16, fontWeight: "bold", color: textColor }}>{label.trim()}</Text>;
    }
    return (
      <Text style={{ fontSize: 16, color: textColor }}>
        <Text style={{ fontWeight: "bold", color: textColor }}>{label.bold.trim()}</Text>
        <Text style={{ fontWeight: "normal", color: textColor }}>{label.rest.trim()}</Text>
      </Text>
    );
  }

  // Renderers for each step
  function renderStart() {
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 8, color: textColor }}>{title}</Text>
        <Text style={{ fontSize: 18, marginBottom: 8, color: textColor }}>{start.question.trim()}</Text>
        {start.note && <Text style={{ fontSize: 15, marginBottom: 8, color: noteColor }}>{start.note.trim()}</Text>}
        <Pressable
          style={{ ...buttonStyle, backgroundColor: buttonColor }}
          onPress={() => goTo({ type: 'emergency-signs' })}
        >
          <Text style={{ fontSize: 16, color: textColor }}>{start.yesLabel.trim()}</Text>
        </Pressable>
        <Pressable
          style={{ ...buttonStyle, backgroundColor: buttonColor }}
          onPress={() => goTo({ type: 'priority-signs' })}
        >
          <Text style={{ fontSize: 16, color: textColor }}>{start.noLabel.trim()}</Text>
        </Pressable>
      </View>
    );
  }

  function renderEmergencySigns() {
    const node = start.yes;
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, color: textColor }}>{node.question.trim()}</Text>
        {Array.isArray(node.options) && node.options.map((opt, i) => (
          opt && opt.label ? (
            <View key={i} style={{ marginBottom: 16, backgroundColor: cardColor, borderRadius: 8, padding: 10 }}>
              {renderLabel(opt.label)}
              {Array.isArray(opt.signs) && opt.signs.length > 0 && (
                <View style={{ marginLeft: 10, marginTop: 6 }}>
                  {opt.signs.map((s, j) => (
                    s ? <Text key={j} style={{ fontSize: 15, color: textColor }}>• {s.trim()}</Text> : null
                  ))}
                </View>
              )}
              <View style={{ marginLeft: 10, marginTop: 8 }}>
                {Array.isArray(opt.action) && opt.action.map((a, j) => (
                  a ? <Text key={j} style={{ fontSize: 15, color: accentColor }}>→ {a.trim()}</Text> : null
                ))}
              </View>
            </View>
          ) : null
        ))}
        <Pressable style={{ ...backButtonStyle, backgroundColor: backButtonColor }} onPress={goBack}>
          <Text style={{ fontSize: 16, color: textColor }}>{'< Back'}</Text>
        </Pressable>
      </View>
    );
  }

  // NEW: Show the Priority Signs first, then ask Yes/No
  function renderPrioritySigns() {
    const node = start.no;          // "Any Priority Signs?"
    const list = start.no.yes;      // contains the options + action

    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, color: textColor }}>{node.question.trim()}</Text>

        {/* Priority Signs list FIRST */}
        {Array.isArray(list.options) && list.options.map((opt, i) => (
          opt && opt.label ? (
            <View key={i} style={{ marginBottom: 10, backgroundColor: cardPriorityColor, borderRadius: 8, padding: 10 }}>
              {renderLabel(opt.label)}
              {opt.description && <Text style={{ fontSize: 15, marginTop: 2, color: textColor }}>{opt.description.trim()}</Text>}
            </View>
          ) : null
        ))}

        {/* Then ask Yes / No */}
        <Text style={{ fontSize: 16, marginTop: 8, marginBottom: 8, color: textColor }}>Are any Priority Signs present?</Text>
        <Pressable
          style={{ ...buttonStyle, backgroundColor: buttonColor }}
          onPress={() => goTo({ type: 'priority-actions' })}
        >
          <Text style={{ fontSize: 16, color: textColor }}>{node.yesLabel.trim()}</Text>
        </Pressable>
        <Pressable
          style={{ ...buttonStyle, backgroundColor: buttonColor }}
          onPress={() => goTo({ type: 'nonurgent' })}
        >
          <Text style={{ fontSize: 16, color: textColor }}>{node.noLabel.trim()}</Text>
        </Pressable>

        <Pressable style={{ ...backButtonStyle, backgroundColor: backButtonColor }} onPress={goBack}>
          <Text style={{ fontSize: 16, color: textColor }}>{'< Back'}</Text>
        </Pressable>
      </View>
    );
  }

  // NEW: Actions only (after "Yes")
  function renderPriorityActions() {
    const node = start.no.yes;
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, color: textColor }}>Priority: Actions</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: textColor }}>Do the following:</Text>
        {Array.isArray(node.action) && node.action.map((a, i) => (
          a ? <Text key={i} style={{ fontSize: 15, color: accentColor }}>→ {a.trim()}</Text> : null
        ))}
        <Pressable style={{ ...backButtonStyle, backgroundColor: backButtonColor }} onPress={goBack}>
          <Text style={{ fontSize: 16, color: textColor }}>{'< Back'}</Text>
        </Pressable>
      </View>
    );
  }

  function renderNonUrgent() {
    const node = start.no.no;
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, color: textColor }}>{node.label.trim()}</Text>
        {Array.isArray(node.action) && node.action.map((a, i) => (
          a ? <Text key={i} style={{ fontSize: 15, color: accentColor }}>→ {a.trim()}</Text> : null
        ))}
        <Pressable style={{ ...backButtonStyle, backgroundColor: backButtonColor }} onPress={goBack}>
          <Text style={{ fontSize: 16, color: textColor }}>{'< Back'}</Text>
        </Pressable>
      </View>
    );
  }

  // Button styles
  const buttonStyle = {
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center' as const,
  };
  const backButtonStyle = {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center' as const,
  };

  // Main render
  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} style={{ flex: 1, backgroundColor }}>
        {current.type === 'start' && renderStart()}
        {current.type === 'emergency-signs' && renderEmergencySigns()}
        {current.type === 'priority-signs' && renderPrioritySigns()}
        {current.type === 'priority-actions' && renderPriorityActions()}
        {current.type === 'nonurgent' && renderNonUrgent()}
      </ScrollView>
    </View>
  );
}
