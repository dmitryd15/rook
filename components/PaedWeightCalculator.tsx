import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function PaedWeightCalculator({ onBack }) {
  const [age, setAge] = useState('');
  const [isMonths, setIsMonths] = useState(true); // true = months, false = years
  const [result, setResult] = useState<string | null>(null);

  function calculate() {
    const n = parseFloat(age);
    if (isNaN(n) || n < 0) {
      setResult('Enter a valid age.');
      return;
    }
    let weight = 0;
    if (isMonths) {
      if (n <= 9) {
        weight = n * 0.5 + 4;
        setResult(`Estimated weight: ${weight.toFixed(2)} kg (age ${n} months)`);
      } else if (n > 9) {
        // For months > 9, convert to years and use 2a+8
        const years = n / 12;
        weight = years * 2 + 8;
        setResult(`Estimated weight: ${weight.toFixed(2)} kg (age ${(years).toFixed(2)} years)`);
      } else {
        setResult('Enter age in months (0 or more).');
      }
    } else if (!isMonths && n > 0) {
      weight = n * 2 + 8;
      setResult(`Estimated weight: ${weight.toFixed(2)} kg (age ${n} years)`);
    } else {
      setResult('For months, enter 0 or more. For years, enter >0.');
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
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: mainColor, marginBottom: 18 }}>Paediatric Weight Estimation</Text>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => setIsMonths(true)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
          <Ionicons name={isMonths ? 'radio-button-on' : 'radio-button-off'} size={22} color={mainColor} />
          <Text style={{ marginLeft: 6, color: mainColor }}>Age in months (0-9)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsMonths(false)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name={!isMonths ? 'radio-button-on' : 'radio-button-off'} size={22} color={mainColor} />
          <Text style={{ marginLeft: 6, color: mainColor }}>Age in years (&gt;0)</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={{ borderWidth: 1, borderColor: borderColor, borderRadius: 8, padding: 12, fontSize: 16, width: '100%', marginBottom: 12, backgroundColor: bgColor, color: textColor }}
        placeholder={isMonths ? 'Enter age in months (0-9)' : 'Enter age in years (>0)'}
        placeholderTextColor={subTextColor}
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TouchableOpacity onPress={calculate} style={{ backgroundColor: mainColor, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 8, marginBottom: 8 }}>
  <Text style={{ color: isDark ? '#e0e0e0' : '#fff', fontWeight: 'bold', fontSize: 16 }}>Estimate Weight</Text>
      </TouchableOpacity>
      {result && (
        <View style={{ backgroundColor: cardBg, borderRadius: 8, padding: 16, marginTop: 12, borderWidth: 1, borderColor: borderColor }}>
          <Text style={{ color: mainColor, fontWeight: 'bold', textAlign: 'center' }}>{result}</Text>
        </View>
      )}
      <Text style={{ color: subTextColor, fontSize: 12, marginTop: 18, textAlign: 'center' }}>
        For 9 months and under: Weight (kg) = (Age in months × 0.5) + 4{"\n"}
        Above 9 months: Weight (kg) = (Age in years × 2) + 8 (use months/12 for years if age is in months)
      </Text>
    </ScrollView>
  );
}
