// TreatmentConvulsionsProtocol.tsx
// Interactive protocol for "Treatment of Convulsions, Age > 1 month"


import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useColorScheme } from '../../hooks/useColorScheme';

function ConvulsionsProtocol() {

type Step =
  | { type: "start" }
  | { type: "safety" }
  | { type: "lasting5" }
  | { type: "afterFirstDiazepam" }
  | { type: "afterSecondDiazepam" }
  | { type: "phenobarb" }
  | { type: "escalation" };

  const [stack, setStack] = useState<Step[]>([{ type: "start" }]);
  const current = stack[stack.length - 1];

  const colorScheme = useColorScheme && typeof useColorScheme === 'function' ? useColorScheme() : 'light';
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#181A20' : '#fff';
  const cardColor = isDark ? '#23262F' : '#f8f9fa';
  const textColor = isDark ? '#fff' : '#181A20';
  const noteColor = isDark ? '#aaa' : '#555';
  const buttonColor = isDark ? '#22304a' : '#d0e8ff';
  const backButtonColor = isDark ? '#222' : '#eee';

  const goTo = (s: Step) => setStack((prev) => [...prev, s]);
  const goBack = () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  // Shared button styles
  const buttonStyle = {
    padding: 14,
    backgroundColor: buttonColor,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center" as const,
  };
  const backButtonStyle = {
    padding: 10,
    backgroundColor: backButtonColor,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center" as const,
  };
  const cardStyle = {
    marginBottom: 16,
    backgroundColor: cardColor,
    borderRadius: 8,
    padding: 12,
  };

  function renderStart() {
    return (
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 22, marginBottom: 6, color: textColor }}>
          Treatment of Convulsions
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 12, color: textColor }}>Age &gt; 1 month</Text>
        <Text style={{ fontSize: 15, marginBottom: 12, color: noteColor }}>
          For convulsions in the first month, refer to page 65
        </Text>
        <Pressable style={buttonStyle} onPress={() => goTo({ type: "safety" })}>
          <Text style={{ fontSize: 16, color: textColor }}>Child convulsing → Ensure safety & check ABCD</Text>
        </Pressable>
      </View>
    );
  }

  function renderSafety() {
    return (
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10, color: textColor }}>
          Ensure safety and check ABCD
        </Text>
        <View style={cardStyle}>
          <Text style={{ fontSize: 15, color: textColor }}>A – Place in lateral position, suction if indicated</Text>
          <Text style={{ fontSize: 15, color: textColor }}>B – Start on oxygen via NRM</Text>
          <Text style={{ fontSize: 15, color: textColor }}>
            C – Check for temperature gradient, severe pallor
          </Text>
          <Text style={{ fontSize: 15, color: textColor }}>D – Check RBS or give 5ml/kg of 10% Dextrose</Text>
        </View>

        <Text style={{ fontSize: 16, marginBottom: 8, color: textColor }}>Convulsion lasting &gt; 5 min?</Text>
        <Pressable style={buttonStyle} onPress={() => goTo({ type: "lasting5" })}>
          <Text style={{ fontSize: 16, color: textColor }}>Yes → Give Diazepam</Text>
        </Pressable>
        <Pressable style={buttonStyle} onPress={() => goTo({ type: "safety" })}>
          <Text style={{ fontSize: 16, color: textColor }}>No → Observe & investigate</Text>
        </Pressable>

        <Pressable style={backButtonStyle} onPress={goBack}>
          <Text style={{ color: textColor }}>{"< Back"}</Text>
        </Pressable>
      </View>
    );
  }

  function renderLasting5() {
    return (
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10, color: textColor }}>
          Give IV Diazepam 0.3 mg/kg
        </Text>
        <View style={cardStyle}>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Slowly over 1 minute OR rectal diazepam 0.5 mg/kg
          </Text>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Alternatives: IV Lorazepam or buccal midazolam (if available)
          </Text>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Check ABCD when convulsion stops, observe & investigate cause
          </Text>
        </View>
        <Pressable style={buttonStyle} onPress={() => goTo({ type: "afterFirstDiazepam" })}>
          <Text style={{ fontSize: 16, color: textColor }}>Convulsion continues 5 mins after first dose</Text>
        </Pressable>
        <Pressable style={backButtonStyle} onPress={goBack}>
          <Text style={{ color: textColor }}>{"< Back"}</Text>
        </Pressable>
      </View>
    );
  }

  function renderAfterFirstDiazepam() {
    return (
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10, color: textColor }}>
          If convulsion continues after 5 mins
        </Text>
        <View style={cardStyle}>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Give second dose of diazepam 0.3 mg/kg slowly IV or rectal diazepam 0.5 mg/kg
          </Text>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Check airway & breathing when convulsion stops
          </Text>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Investigate the cause & refer appropriately
          </Text>
        </View>
        <Pressable style={buttonStyle} onPress={() => goTo({ type: "afterSecondDiazepam" })}>
          <Text style={{ fontSize: 16, color: textColor }}>
            Convulsion continues 5 mins after second dose
          </Text>
        </Pressable>
        <Pressable style={backButtonStyle} onPress={goBack}>
          <Text style={{ color: textColor }}>{"< Back"}</Text>
        </Pressable>
      </View>
    );
  }

  function renderAfterSecondDiazepam() {
    return (
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10, color: textColor }}>
          Give Phenobarbital
        </Text>
        <View style={cardStyle}>
          <Text style={{ fontSize: 15, color: textColor }}>• IV Phenobarbital 15 mg/kg (loading dose)</Text>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Then maintenance therapy with phenobarbital 2.5 mg/kg OD for 48 hrs
          </Text>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Review response during active seizure
          </Text>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Check ABCD when convulsion stops, investigate cause & refer
          </Text>
        </View>
        <Pressable style={buttonStyle} onPress={() => goTo({ type: "escalation" })}>
          <Text style={{ fontSize: 16, color: textColor }}>Convulsion persists despite phenobarbital</Text>
        </Pressable>
        <Pressable style={backButtonStyle} onPress={goBack}>
          <Text style={{ color: textColor }}>{"< Back"}</Text>
        </Pressable>
      </View>
    );
  }

  function renderEscalation() {
    return (
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10, color: textColor }}>
          If convulsions continue despite 2 doses diazepam + phenobarbital
        </Text>
        <View style={cardStyle}>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Do not give another phenobarbital loading dose in 24h
          </Text>
          <Text style={{ fontSize: 15, color: textColor }}>
            • If known epileptic, give maintenance loading dose of their antiepileptic
          </Text>
          <Text style={{ fontSize: 15, color: textColor }}>
            • Consider paraldehyde (IM/rectal) OR IV valproate (see formulary)
          </Text>
        </View>
        <Pressable style={backButtonStyle} onPress={goBack}>
          <Text style={{ color: textColor }}>{"< Back"}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} style={{ flex: 1, backgroundColor }}>
        {current.type === "start" && renderStart()}
        {current.type === "safety" && renderSafety()}
        {current.type === "lasting5" && renderLasting5()}
        {current.type === "afterFirstDiazepam" && renderAfterFirstDiazepam()}
        {current.type === "afterSecondDiazepam" && renderAfterSecondDiazepam()}
        {current.type === "escalation" && renderEscalation()}
      </ScrollView>
    </View>
  );
}
export default ConvulsionsProtocol;
