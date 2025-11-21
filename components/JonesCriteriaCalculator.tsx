import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function JonesCriteriaCalculator({ onBack }) {
  const [major, setMajor] = useState({
    carditis: false,
    polyarthritis: false,
    chorea: false,
    erythema: false,
    nodules: false,
  });
  const [minor, setMinor] = useState({
    arthralgia: false,
    fever: false,
    esr: false,
    pr: false,
  });
  const [evidence, setEvidence] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function count(obj) {
    return Object.values(obj).filter(Boolean).length;
  }

  function calculate() {
    const majorCount = count(major);
    const minorCount = count(minor);
    if (!evidence) {
      setResult('No evidence of preceding Group A Strep infection. Does not meet Jones Criteria.');
      return;
    }
    if (majorCount >= 2) {
      setResult('Meets Jones Criteria: 2 major criteria + evidence of strep infection.');
    } else if (majorCount === 1 && minorCount >= 2) {
      setResult('Meets Jones Criteria: 1 major + 2 minor criteria + evidence of strep infection.');
    } else {
      setResult('Does NOT meet Jones Criteria for acute rheumatic fever.');
    }
  }

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const mainColor = isDark ? '#90caf9' : '#0288d1';
  const bgColor = isDark ? '#181a20' : '#fff';
  const cardBg = isDark ? '#23272e' : '#e3f2fd';
  const borderColor = isDark ? '#90caf9' : '#0288d1';
  const textColor = isDark ? '#e0e0e0' : '#222';
  const subTextColor = isDark ? '#b0b0b0' : '#555';
  return (
    <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center', width: '100%', backgroundColor: bgColor }}>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color={mainColor} />
        <Text style={{ color: mainColor, fontWeight: 'bold', marginLeft: 8 }}>Back to Paeds Tools</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: mainColor, marginBottom: 18 }}>Jones Criteria for Rheumatic Fever</Text>
      <Text style={{ fontWeight: 'bold', color: mainColor, marginBottom: 8 }}>Evidence of preceding Group A Strep infection?</Text>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => setEvidence(true)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
          <Ionicons name={evidence ? 'radio-button-on' : 'radio-button-off'} size={22} color={mainColor} />
          <Text style={{ marginLeft: 6, color: mainColor }}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEvidence(false)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name={!evidence ? 'radio-button-on' : 'radio-button-off'} size={22} color={mainColor} />
          <Text style={{ marginLeft: 6, color: mainColor }}>No</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontWeight: 'bold', color: mainColor, marginBottom: 8 }}>Major Criteria</Text>
      {Object.entries(major).map(([key, val]) => (
        <TouchableOpacity key={key} onPress={() => setMajor(m => ({ ...m, [key as keyof typeof major]: !m[key as keyof typeof major] }))} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name={val ? 'checkbox' : 'square-outline'} size={22} color={val ? mainColor : subTextColor} />
          <Text style={{ marginLeft: 8, fontSize: 16, color: textColor }}>{
            key === 'carditis' ? 'Carditis' :
            key === 'polyarthritis' ? 'Polyarthritis' :
            key === 'chorea' ? 'Chorea' :
            key === 'erythema' ? 'Erythema marginatum' :
            key === 'nodules' ? 'Subcutaneous nodules' : key
          }</Text>
        </TouchableOpacity>
      ))}
      <Text style={{ fontWeight: 'bold', color: mainColor, marginTop: 12, marginBottom: 8 }}>Minor Criteria</Text>
      {Object.entries(minor).map(([key, val]) => (
        <TouchableOpacity key={key} onPress={() => setMinor(m => ({ ...m, [key as keyof typeof minor]: !m[key as keyof typeof minor] }))} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name={val ? 'checkbox' : 'square-outline'} size={22} color={val ? mainColor : subTextColor} />
          <Text style={{ marginLeft: 8, fontSize: 16, color: textColor }}>{
            key === 'arthralgia' ? 'Arthralgia' :
            key === 'fever' ? 'Fever' :
            key === 'esr' ? 'Elevated ESR/CRP' :
            key === 'pr' ? 'Prolonged PR interval' : key
          }</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={calculate} style={{ backgroundColor: mainColor, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 18, marginBottom: 8 }}>
  <Text style={{ color: isDark ? '#e0e0e0' : '#fff', fontWeight: 'bold', fontSize: 16 }}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={{ backgroundColor: cardBg, borderRadius: 8, padding: 16, marginTop: 12, borderWidth: 1, borderColor: borderColor }}>
          <Text style={{ color: mainColor, fontWeight: 'bold', textAlign: 'center' }}>{result}</Text>
        </View>
      )}
      <Text style={{ color: subTextColor, fontSize: 12, marginTop: 18, textAlign: 'center' }}>
        Diagnosis requires evidence of preceding Group A Strep infection plus 2 major OR 1 major + 2 minor criteria.
      </Text>
    </ScrollView>
  );
}
