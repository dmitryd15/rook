
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

// ----------------------------
//   REUSABLE CALCULATOR BOX
// ----------------------------
type CalcBoxInput = { key: string; label: string };
type CalcBoxProps = {
  title: string;
  inputs: CalcBoxInput[];
  formula: (values: Record<string, number>) => number;
  unit: string;
};
function CalcBox({ title, inputs, formula, unit }: CalcBoxProps) {
  const [values, setValues] = useState<Record<string, number>>({});
  const result = formula(values);

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 14,
        marginBottom: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
        {title}
      </Text>
      {inputs.map((inp: CalcBoxInput) => (
        <TextInput
          key={inp.key}
          placeholder={inp.label}
          keyboardType="numeric"
          onChangeText={(t: string) =>
            setValues((prev: Record<string, number>) => ({ ...prev, [inp.key]: parseFloat(t) || 0 }))
          }
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            padding: 8,
            marginBottom: 8,
          }}
        />
      ))}
      <Text style={{ marginTop: 4, fontSize: 15 }}>
        Result: {" "}
        <Text style={{ fontWeight: "bold" }}>
          {isNaN(result) ? "-" : result.toFixed(2)} {unit}
        </Text>
      </Text>
    </View>
  );
}

const DKA_ALGO = {
  title: 'Diabetic Ketoacidosis (DKA) / Hyperosmolar Hyperglycaemic State (HHS) Algorithm',
  flow: [
    {
      question: 'Begin 30. Hyperglycaemia Algorithm',
      options: [
        {
          label: 'Serum Ketones ≥ 3.0 mmol/L OR pH < 7.30 with HCO₃⁻ < 15 mmol/L',
          diagnosis: 'Diabetic Ketoacidosis',
        },
        {
          label: 'RBS > 33.3 mmol/L OR Serum Osmolality > 320 mOsm/kg, pH > 7.3',
          diagnosis: 'Hyperosmolar Hyperglycaemic State (HHS)',
        },
        {
          label: 'Normal VBG, Serum Ketones < 1.5 mmol/L, Serum Osmolality < 320 mOsm/kg',
          diagnosis: 'Uncomplicated Hyperglycaemia',
          next: 'Go to 30. Hyperglycaemia Algorithm',
        },
      ],
    },
    {
      question: 'Identify and treat precipitating illness',
      note: 'Consider ACS, sepsis. Consult physician and continue with algorithm.',
    },
    {
      section: '1. Fluid Protocol (Ringer’s Lactate)',
      steps: [
        'If Hypotension/Shock: give 20 mL/kg bolus IV, repeat if necessary.',
        'If No Shock: give 10 mL/kg/hr over 2 hrs, then reassess.',
        'Replace deficit over 48 hrs; use isotonic fluids only.',
        '100 mL/kg/day for first 10 kg, 50 mL/kg/day for next 10 kg, 20 mL/kg/day thereafter.',
        'Maintenance + deficit replacement with 0.9% NS → switch to 0.45% NS if Na rises.',
      ],
    },
    {
      section: '2. Potassium Protocol',
      steps: [
        'DO NOT give K⁺ if patient is anuric OR K⁺ > 5.5 mmol/L.',
        'If K⁺ < 3.5 mmol/L → give 40 mmol KCl/L immediately, delay insulin.',
        'If K⁺ 3.5–5.5 mmol/L → give 20–40 mmol KCl/L.',
        'If K⁺ > 5.5 mmol/L → withhold K⁺, monitor 2-hourly.',
        'Monitor K⁺ and urine output hourly.',
      ],
      note: 'Venous Glucose reaches <14 mmol/L or Bicarbonate <15.7 mmol/L → change fluids to 5% Dextrose with 0.45% NS + KCl.',
    },
    {
      section: '3. Insulin Protocol',
      steps: [
        'DO NOT start insulin if K⁺ < 3.5 mmol/L.',
        'Start when K⁺ > 3.5 mmol/L.',
        'Begin continuous IV insulin infusion at 0.05–0.1 units/kg/hr.',
        'Hourly RBS monitoring, aim fall 4–5 mmol/L/hr.',
        'If glucose <14 mmol/L → add 5% Dextrose to IV fluids and continue insulin.',
      ],
    },
    {
      section: '4. Additional Notes',
      steps: [
        'Avoid Bicarbonate unless pH < 6.9.',
        'Replace serum sodium correction = measured Na + (1.6 × (glucose–5.6)/5.6).',
        'Careful fluid balance (input/output chart).',
        'Strict monitoring: RBS, electrolytes, VBG, urine output.',
      ],
    },
  ],
};

type OptionType = { label: string; diagnosis?: string; next?: string };
function renderOptions(options: OptionType[]) {
  return options.map((opt: OptionType, idx: number) => (
    <View key={idx} style={{ marginBottom: 8, marginLeft: 8 }}>
      <Text style={{ fontSize: 16, color: '#1976d2' }}>{opt.label}</Text>
      {opt.diagnosis && (
        <Text style={{ color: '#388e3c', fontWeight: 'bold', marginLeft: 8 }}>→ {opt.diagnosis}</Text>
      )}
      {opt.next && (
        <Text style={{ color: '#888', marginLeft: 8 }}>Next: {opt.next}</Text>
      )}
    </View>
  ));
}

function renderSteps(steps: string[]) {
  return steps.map((step: string, idx: number) => (
    <Text key={idx} style={{ marginBottom: 4, marginLeft: 8 }}>• {step}</Text>
  ));
}

export default function DKAProtocol() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 16, color: '#1976d2' }}>{DKA_ALGO.title}</Text>

      {/* Render all protocol steps except Additional Notes (section 4) */}
      {DKA_ALGO.flow.map((item, idx) => {
        // Skip Additional Notes (section 4)
        if (item.section === '4. Additional Notes') return null;
        return (
          <View key={idx} style={{ marginBottom: 18 }}>
            {item.question && (
              <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 6 }}>{item.question}</Text>
            )}
            {item.options && renderOptions(item.options)}
            {item.note && (
              <Text style={{ color: '#888', fontStyle: 'italic', marginLeft: 8, marginBottom: 4 }}>{item.note}</Text>
            )}
            {item.section && (
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: '#1976d2' }}>{item.section}</Text>
            )}
            {item.steps && renderSteps(item.steps)}
            {item.note && !item.question && (
              <Text style={{ color: '#888', fontStyle: 'italic', marginLeft: 8, marginTop: 4 }}>{item.note}</Text>
            )}
          </View>
        );
      })}

      {/* Additional protocol step after insulin and potassium correction */}
      <View style={{ marginBottom: 18 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: '#1976d2' }}>
          After Insulin and Potassium Correction
        </Text>
        <Text style={{ marginLeft: 8, marginBottom: 4, color: '#444', fontSize: 15 }}>
          If venous blood glucose after insulin and potassium correction is:
        </Text>
        <Text style={{ marginLeft: 16, color: '#444', fontSize: 15 }}>- &lt;11.1 mmol/L in DKA</Text>
        <Text style={{ marginLeft: 16, color: '#444', fontSize: 15 }}>- &lt;16.7 mmol/L in HHS</Text>
        <Text style={{ marginLeft: 8, marginTop: 4, color: '#444', fontSize: 15 }}>Then:</Text>
        <Text style={{ marginLeft: 16, color: '#444', fontSize: 15 }}>1. Change I.V fluids to 5% dextrose with 0.45% NaCl at 150–250 ml/hr</Text>
        <Text style={{ marginLeft: 16, color: '#444', fontSize: 15 }}>2. Decrease Insulin to 0.02–0.05 u/kg/hr I.V Infusion</Text>
        <Text style={{ marginLeft: 16, color: '#444', fontSize: 15 }}>3. Maintain glucose between 8.3–11.1 mmol/L in DKA and 13.9–16.7 mmol/L in HHS</Text>
        <Text style={{ marginLeft: 16, color: '#444', fontSize: 15 }}>4. Continue insulin infusion and fluid hydration until ketosis or hyperosmolarity resolves</Text>
      </View>

      {/* Now render Additional Notes (section 4) here */}
      {DKA_ALGO.flow.map((item, idx) => {
        if (item.section !== '4. Additional Notes') return null;
        return (
          <View key={idx} style={{ marginBottom: 18 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: '#1976d2' }}>{item.section}</Text>
            {item.steps && renderSteps(item.steps)}
          </View>
        );
      })}

      {/* Interactive Key Formulas Section */}
      <View style={{ marginTop: 24, marginBottom: 8 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#1976d2', marginBottom: 8 }}>
          Key Formulas (Interactive)
        </Text>
        <CalcBox
          title="Anion Gap"
          inputs={[
            { key: 'Na', label: 'Na⁺ (mmol/L)' },
            { key: 'Cl', label: 'Cl⁻ (mmol/L)' },
            { key: 'HCO3', label: 'HCO₃⁻ (mmol/L)' },
          ]}
          formula={(values: { Na?: number; Cl?: number; HCO3?: number }) => (values.Na || 0) - ((values.Cl || 0) + (values.HCO3 || 0))}
          unit="mmol/L"
        />
        <CalcBox
          title="Serum Sodium Correction"
          inputs={[
            { key: 'Na', label: 'Measured Na⁺ (mmol/L)' },
            { key: 'Glucose', label: 'Glucose (mmol/L)' },
          ]}
          formula={(values: { Na?: number; Glucose?: number }) => (values.Na || 0) + 2 * ((values.Glucose || 0) - 5.6) / 5.6}
          unit="mmol/L"
        />
        <CalcBox
          title="Serum Potassium Correction (Acidaemia)"
          inputs={[
            { key: 'K', label: 'Measured K⁺ (mmol/L)' },
            { key: 'pH', label: 'Measured pH' },
          ]}
          formula={(values: { K?: number; pH?: number }) => (values.K || 0) - 0.6 * ((7.4 - (values.pH || 0)) * 10)}
          unit="mmol/L"
        />
        <CalcBox
          title="Serum Osmolality"
          inputs={[
            { key: 'Na', label: 'Na⁺ (mmol/L)' },
            { key: 'K', label: 'K⁺ (mmol/L)' },
            { key: 'Glucose', label: 'Glucose (mmol/L)' },
            { key: 'BUN', label: 'BUN (mmol/L)' },
          ]}
          formula={(values: { Na?: number; K?: number; Glucose?: number; BUN?: number }) => 2 * ((values.Na || 0) + (values.K || 0)) + (values.Glucose || 0) + (values.BUN || 0)}
          unit="mOsm/L"
        />
        <CalcBox
          title="Total Body Water Deficit"
          inputs={[
            { key: 'weight', label: 'Weight (kg)' },
            { key: 'Na', label: 'Serum Na⁺ (mmol/L)' },
            { key: 'sex', label: 'Sex (0.6 = men/children, 0.5 = women)' },
          ]}
          formula={(values: { weight?: number; Na?: number; sex?: number }) => (values.sex || 0.6) * (values.weight || 0) * (((values.Na || 0) / 140) - 1)}
          unit="L"
        />
      </View>

      <Text style={{ color: '#888', fontSize: 13, marginTop: 16 }}>
        Always follow local/national guidelines and consult senior staff for severe/complicated cases.
      </Text>
    </ScrollView>
  );
}
