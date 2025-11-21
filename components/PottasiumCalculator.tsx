import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PottasiumCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [weight, setWeight] = useState('');
  const [serumK, setSerumK] = useState('');
  const [targetK, setTargetK] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [sex, setSex] = useState<'male' | 'female'>('male');

  function calculateDeficit() {
    const w = parseFloat(weight);
    const k = parseFloat(serumK);
    const t = parseFloat(targetK);
    if (!w || !k || !t) {
      setResult('Enter valid weight and potassium values.');
      return;
    }
    if (t < 3.5 || t > 5.0) {
      setResult('Target potassium must be between 3.5 and 5.0 mmol/L.');
      return;
    }
    const factor = sex === 'male' ? 0.4 : 0.3;
    const deficit = (t - k) * w * factor;
    setResult(`Estimated K⁺ deficit: ${deficit.toFixed(1)} mmol\n(${factor} mmol/kg for each 1 mmol/L below target)`);
  }

  return (
    <View style={[styles.toolDetailBox, { width: '100%', maxWidth: 420, backgroundColor: isDark ? '#181c24' : '#fff' }]}> 
      <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>Potassium Deficit Calculator</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: sex === 'male' ? (isDark ? '#1976d2' : '#90caf9') : 'transparent',
            borderColor: '#1976d2',
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 18,
            marginRight: 8,
          }}
          onPress={() => setSex('male')}
        >
          <Text style={{ color: sex === 'male' ? '#fff' : (isDark ? '#90caf9' : '#1976d2'), fontWeight: 'bold' }}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: sex === 'female' ? (isDark ? '#1976d2' : '#90caf9') : 'transparent',
            borderColor: '#1976d2',
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 18,
          }}
          onPress={() => setSex('female')}
        >
          <Text style={{ color: sex === 'female' ? '#fff' : (isDark ? '#90caf9' : '#1976d2'), fontWeight: 'bold' }}>Female</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter weight (kg):</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter serum potassium (mmol/L):</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Serum K⁺ (mmol/L)"
        keyboardType="numeric"
        value={serumK}
        onChangeText={setSerumK}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Target potassium (mmol/L):</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Target K⁺ (mmol/L)"
        keyboardType="numeric"
        value={targetK}
        onChangeText={setTargetK}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <TouchableOpacity style={styles.calcButton} onPress={calculateDeficit}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: isDark ? '#222b38' : '#e3f2fd', borderColor: isDark ? '#90caf9' : '#1976d2', marginTop: 18 }]}> 
          <Text style={[styles.bmiResultText, { color: isDark ? '#90caf9' : '#1976d2', textAlign: 'center' }]}>{result}</Text>
        </View>
      )}
      <Text style={{ color: '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        Potassium deficit (mmol) ≈ (Target K - Actual K) × weight (kg) × {sex === 'male' ? '0.4' : '0.3'}{"\n"}
        {sex === 'male' ? '0.4 mmol/kg for each 1 mmol/L below target (male).' : '0.3 mmol/kg for each 1 mmol/L below target (female).'} Usual target: 4.0 mmol/L.{"\n"}
        <Text style={{ color: '#aaa', fontSize: 12 }}>
          1 mEq = 1 mmol/L for potassium.
        </Text>
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
  bmiResultBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 200,
    maxWidth: '100%',
    marginBottom: 8,
  },
  bmiResultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
