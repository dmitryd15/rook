import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function WholeBloodFormula() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [weight, setWeight] = useState('');
  const [currentHb, setCurrentHb] = useState('');
  const [targetHb, setTargetHb] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculateVolume() {
    const w = parseFloat(weight);
    const hbNow = parseFloat(currentHb);
    const hbTarget = parseFloat(targetHb);
    if (!w || !hbNow || !hbTarget) {
      setResult('Enter valid weight and Hb values.');
      return;
    }
    if (hbTarget <= hbNow) {
      setResult('Target Hb must be greater than current Hb.');
      return;
    }
    // Volume (ml) = weight (kg) × 8 × (target Hb - actual Hb)
    const volume = w * 8 * (hbTarget - hbNow);
    setResult(`Estimated whole blood volume: ${volume.toFixed(0)} mL`);
  }

  return (
    <View style={[styles.toolDetailBox, { width: '100%', maxWidth: 420, backgroundColor: isDark ? '#181c24' : '#fff' }]}>
      <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>Whole Blood Transfusion Calculator</Text>
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter weight (kg):</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Current Hb (g/dL):</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Current Hb (g/dL)"
        keyboardType="numeric"
        value={currentHb}
        onChangeText={setCurrentHb}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Target Hb (g/dL):</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Target Hb (g/dL)"
        keyboardType="numeric"
        value={targetHb}
        onChangeText={setTargetHb}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <TouchableOpacity style={styles.calcButton} onPress={calculateVolume}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.resultBox, { backgroundColor: isDark ? '#222b38' : '#e3f2fd', borderColor: isDark ? '#90caf9' : '#1976d2', marginTop: 18 }]}>
          <Text style={[styles.resultText, { color: isDark ? '#90caf9' : '#1976d2', textAlign: 'center' }]}>{result}</Text>
        </View>
      )}
      <Text style={{ color: '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        Volume (mL) = weight (kg) × 8 × (Target Hb - Actual Hb){"\n"}
        8 mL/kg raises Hb by ~1 g/dL. Always round to nearest 50 mL and adjust for clinical context.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toolDetailBox: {
    borderRadius: 12,
    padding: 24,
    marginTop: 24,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toolDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f7faff',
    marginBottom: 12,
  },
  calcButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  calcButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 200,
    maxWidth: '100%',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});