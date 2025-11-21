import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function HollidaySegarCalculator({ onBack }) {
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      setResult('Enter a valid weight in kg.');
      return;
    }
    let fluid = 0;
    if (w <= 10) {
      fluid = w * 100;
    } else if (w <= 20) {
      fluid = 1000 + (w - 10) * 50;
    } else {
      fluid = 1500 + (w - 20) * 20;
    }
    setResult(`Maintenance fluid: ${fluid.toLocaleString()} mL/24h\nHourly rate: ${(fluid/24).toFixed(1)} mL/hr`);
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
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: mainColor, marginBottom: 18 }}>Holliday-Segar Method</Text>
      <Text style={{ color: subTextColor, marginBottom: 12 }}>Calculate daily maintenance fluid requirement for children.</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: borderColor, borderRadius: 8, padding: 12, fontSize: 16, width: '100%', marginBottom: 12, backgroundColor: bgColor, color: textColor }}
        placeholder="Enter weight in kg"
        placeholderTextColor={subTextColor}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TouchableOpacity onPress={calculate} style={{ backgroundColor: mainColor, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 8, marginBottom: 8 }}>
  <Text style={{ color: isDark ? '#e0e0e0' : '#fff', fontWeight: 'bold', fontSize: 16 }}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={{ backgroundColor: cardBg, borderRadius: 8, padding: 16, marginTop: 12, borderWidth: 1, borderColor: borderColor }}>
          <Text style={{ color: mainColor, fontWeight: 'bold', textAlign: 'center' }}>{result}</Text>
        </View>
      )}
      <Text style={{ color: subTextColor, fontSize: 12, marginTop: 18, textAlign: 'center' }}>
        Holliday-Segar formula: 100 mL/kg for first 10 kg, 50 mL/kg for next 10 kg, 20 mL/kg for each kg above 20. Divide by 24 for hourly rate.
      </Text>
    </ScrollView>
  );
}
