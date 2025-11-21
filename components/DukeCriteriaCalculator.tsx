import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';

const pearls = [
  'Suspect IE and consider the Duke Criteria in patients with:',
  'Prolonged fever (Fever of Unknown Origin).',
  'Fever and vascular phenomena (stroke, limb ischemia, physical findings of septic emboli).',
  'Persistently positive blood cultures (2 or more).',
  'Prosthetic valves who are febrile.',
  'Injection drug users who are febrile.',
  'A pre-disposing heart condition who are febrile.',
  'Fever with a recent history of hospitalization.'
];

const majorCriteria = [
  'Blood culture positive for typical microorganism (e.g., Staphylococcus aureus, Enterococcus, viridans streptococci)',
  'Echocardiogram showing valvular vegetation',
];

const minorCriteria = [
  'Predisposing cardiac lesion',
  'Intravenous drug use',
  'Temperature >38°C (100.4°F)',
  'Embolic phenomena',
  'Immunologic phenomena (e.g., glomerulonephritis)',
  'Positive blood culture not meeting above criteria',
];

function countSelected(arr: boolean[]) {
  return arr.reduce((acc, v) => acc + (v ? 1 : 0), 0);
}

export default function DukeCriteriaCalculator({ onBack }: { onBack?: () => void }) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const [major, setMajor] = useState(Array(majorCriteria.length).fill(false));
  const [minor, setMinor] = useState(Array(minorCriteria.length).fill(false));

  const majorCount = countSelected(major);
  const minorCount = countSelected(minor);

  let result = '';
  if (majorCount >= 2 || (majorCount === 1 && minorCount >= 3)) {
    result = 'Definite IE';
  } else if ((majorCount === 1 && minorCount === 1) || minorCount >= 3) {
    result = 'Possible IE';
  } else {
    result = 'Criteria for IE not met';
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center', width: '100%' }}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={{ alignSelf: 'flex-start', marginBottom: 12 }}>
          <Text style={{ color: '#0288d1', fontWeight: 'bold' }}>{'< Back'}</Text>
        </TouchableOpacity>
      )}
      <Text style={{ fontWeight: 'bold', fontSize: 20, color: isDark ? '#90caf9' : '#1976d2', marginBottom: 8 }}>
        Duke Criteria for Infective Endocarditis
      </Text>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 10, marginBottom: 4, color: isDark ? '#90caf9' : '#1976d2' }}>When to Use</Text>
      {pearls.map((p, i) => (
        <Text key={i} style={{ color: isDark ? '#ccc' : '#333', marginBottom: 2, fontSize: 15 }}>{p}</Text>
      ))}
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 16, marginBottom: 4, color: isDark ? '#90caf9' : '#1976d2' }}>Major Criteria</Text>
      {majorCriteria.map((c, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setMajor(m => m.map((v, idx) => idx === i ? !v : v))}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}
        >
          <View style={{ width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: isDark ? '#90caf9' : '#1976d2', backgroundColor: major[i] ? (isDark ? '#1976d2' : '#90caf9') : 'transparent', marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 15 }}>{c}</Text>
        </TouchableOpacity>
      ))}
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 16, marginBottom: 4, color: isDark ? '#90caf9' : '#1976d2' }}>Minor Criteria</Text>
      {minorCriteria.map((c, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setMinor(m => m.map((v, idx) => idx === i ? !v : v))}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}
        >
          <View style={{ width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: isDark ? '#90caf9' : '#1976d2', backgroundColor: minor[i] ? (isDark ? '#1976d2' : '#90caf9') : 'transparent', marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 15 }}>{c}</Text>
        </TouchableOpacity>
      ))}
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 18, color: isDark ? '#90caf9' : '#1976d2' }}>Result</Text>
      <Text style={{ color: result === 'Definite IE' ? '#2ecc40' : result === 'Possible IE' ? '#ffeb3b' : '#e53935', fontWeight: 'bold', fontSize: 18, marginBottom: 18 }}>{result}</Text>
      <Text style={{ color: isDark ? '#aaa' : '#555', fontSize: 13, marginTop: 10, marginBottom: 30 }}>
        {`Definite IE: 2 major OR 1 major + 3 minor criteria\nPossible IE: 1 major + 1 minor OR 3 minor criteria`}
      </Text>
    </ScrollView>
  );
}
