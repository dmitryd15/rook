import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

function ProteinCreatinineRatioCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [protein, setProtein] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [ratio, setRatio] = useState<string | null>(null);

  const calculateRatio = () => {
    const proteinValue = parseFloat(protein);
    const creatinineValue = parseFloat(creatinine);
    if (!isNaN(proteinValue) && !isNaN(creatinineValue) && creatinineValue !== 0) {
      setRatio((proteinValue / creatinineValue).toFixed(2));
    } else {
      setRatio(null);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ color: isDark ? '#f8bbd0' : '#c2185b', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
        Protein/Creatinine Ratio Calculator
      </Text>
      <TextInput
        style={{
          borderColor: isDark ? '#f8bbd0' : '#c2185b',
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginBottom: 8,
          color: isDark ? '#fff' : '#000',
        }}
        placeholder="Enter protein (mg/dL)"
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />
      <TextInput
        style={{
          borderColor: isDark ? '#f8bbd0' : '#c2185b',
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginBottom: 8,
          color: isDark ? '#fff' : '#000',
        }}
        placeholder="Enter creatinine (mg/dL)"
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        keyboardType="numeric"
        value={creatinine}
        onChangeText={setCreatinine}
      />
      <TouchableOpacity
        style={{
          backgroundColor: isDark ? '#f8bbd0' : '#c2185b',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={calculateRatio}
      >
        <Text style={{ color: isDark ? '#000' : '#fff', fontWeight: 'bold' }}>Calculate</Text>
      </TouchableOpacity>
      {ratio !== null && (
        <Text style={{ marginTop: 16, color: isDark ? '#f8bbd0' : '#c2185b', fontSize: 16 }}>
          Protein/Creatinine Ratio: {ratio}
        </Text>
      )}
    </View>
  );
}

export default ProteinCreatinineRatioCalculator;