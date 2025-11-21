import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';

// --- Length-for-Weight Z-Score Table for Boys (full data) ---
const lengthWeightTableBoys: Array<{ length: number; '-3SD': number; '-2SD': number; '-1SD': number; Median: number; '+1SD': number; '+2SD': number; '+3SD': number }> = [
  { length: 45, '-3SD': 1.9, '-2SD': 2, '-1SD': 2.2, 'Median': 2.4, '+1SD': 2.7, '+2SD': 3, '+3SD': 3.3 },
  // ...existing data (copy all from tools.tsx)...
];
// --- Length-for-Weight Z-Score Table (full data) ---
const lengthWeightTable: Array<{ length: number; '-3SD': number; '-2SD': number; '-1SD': number; Median: number; '+1SD': number; '+2SD': number; '+3SD': number }> = [
  { length: 45, '-3SD': 1.9, '-2SD': 2.1, '-1SD': 2.3, 'Median': 2.5, '+1SD': 2.7, '+2SD': 3, '+3SD': 3.3 },
  // ...existing data (copy all from tools.tsx)...
];

export function ZScoreCalculator({ onBack, onBackToCategory }: { onBack?: () => void; onBackToCategory?: () => void }) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const [length, setLength] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [gender, setGender] = React.useState('male');
  const [result, setResult] = React.useState<string | null>(null);
  const [resultColor, setResultColor] = React.useState<string | null>(null);

  function calculateZScore() {
    const len = parseFloat(length);
    const wt = parseFloat(weight);
    if (isNaN(len) || isNaN(wt)) {
      setResult('Please enter valid numbers for length and weight.');
      setResultColor(null);
      return;
    }
    // Find closest length in the correct table
    const table = gender === 'male' ? lengthWeightTableBoys : lengthWeightTable;
    const row = table.reduce((prev, curr) => Math.abs(curr.length - len) < Math.abs(prev.length - len) ? curr : prev);
    // Find z-score by comparing weight to SD columns
    let z = null;
    const cols = ['-3SD','-2SD','-1SD','Median','+1SD','+2SD','+3SD'] as const;
    for (let i = 0; i < cols.length - 1; i++) {
      const low = row[cols[i]];
      const high = row[cols[i+1]];
      if ((wt >= low && wt <= high) || (wt <= low && wt >= high)) {
        // Linear interpolation
        z = i - 3 + (wt - low) / (high - low);
        break;
      }
    }
    if (z === null) {
      if (wt < row['-3SD']) z = -3;
      else if (wt > row['+3SD']) z = 3;
    }
    // Determine color for result box and interpretation
    let color = isDark ? '#23272e' : '#f7faff';
    let interpretation = '';
    if (z !== null) {
      if (Math.abs(z) <= 1) {
        color = '#2ecc40'; // green
      } else if (Math.abs(z) === 2) {
        color = '#ffeb3b'; // yellow
        if (z === -2) interpretation = 'Malnutrition';
        if (z === 2) interpretation = 'Overweight';
      } else if (Math.abs(z) === 3) {
        color = '#ff5252'; // red
        if (z === -3) interpretation = 'Severe Malnutrition';
        if (z === 3) interpretation = 'Obese (Malnutrition)';
      } else {
        color = '#ff9800'; // orange for between 2 and 3
      }
    }
    let resultText = z !== null ? `Z-score: ${z.toFixed(2)}` : 'Weight out of table range.';
    if (interpretation) resultText += `\n${interpretation}`;
    setResult(resultText);
    setResultColor(color);
  }

  return (
    <View style={{ backgroundColor: isDark ? '#181c24' : '#fff', borderRadius: 12, padding: 20, width: '100%', maxWidth: 420, alignSelf: 'center', alignItems: 'center', marginTop: 12 }}>
      {(onBackToCategory || onBack) && (
        <View style={{ flexDirection: 'row', width: '100%', marginBottom: 12 }}>
          {onBackToCategory && (
            <TouchableOpacity onPress={onBackToCategory} style={{ flex: 1, backgroundColor: isDark ? '#23272e' : '#e3f2fd', borderRadius: 8, padding: 10, alignItems: 'center', marginRight: 4 }}>
              <Text style={{ color: '#0288d1', fontWeight: 'bold' }}>Back to Category</Text>
            </TouchableOpacity>
          )}
          {onBack && (
            <TouchableOpacity onPress={onBack} style={{ flex: 1, backgroundColor: isDark ? '#23272e' : '#e3f2fd', borderRadius: 8, padding: 10, alignItems: 'center', marginLeft: onBackToCategory ? 4 : 0 }}>
              <Text style={{ color: '#0288d1', fontWeight: 'bold' }}>Back</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12, color: isDark ? '#90caf9' : '#1976d2' }}>Length-for-Weight Z-Score Calculator</Text>
      <TextInput
        style={{ backgroundColor: isDark ? '#23272e' : '#f7faff', color: isDark ? '#fff' : '#222', borderRadius: 8, padding: 10, marginBottom: 10, width: '100%' }}
        placeholder="Length (cm)"
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        value={length}
        onChangeText={setLength}
        keyboardType="numeric"
      />
      <TextInput
        style={{ backgroundColor: isDark ? '#23272e' : '#f7faff', color: isDark ? '#fff' : '#222', borderRadius: 8, padding: 10, marginBottom: 10, width: '100%' }}
        placeholder="Weight (kg)"
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setGender('male')} style={{ flex: 1, backgroundColor: gender === 'male' ? (isDark ? '#1976d2' : '#90caf9') : (isDark ? '#23272e' : '#e3f2fd'), borderRadius: 8, marginRight: 4, padding: 10, alignItems: 'center' }}>
          <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: gender === 'male' ? 'bold' : 'normal' }}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender('female')} style={{ flex: 1, backgroundColor: gender === 'female' ? (isDark ? '#1976d2' : '#90caf9') : (isDark ? '#23272e' : '#e3f2fd'), borderRadius: 8, marginLeft: 4, padding: 10, alignItems: 'center' }}>
          <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: gender === 'female' ? 'bold' : 'normal' }}>Female</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={calculateZScore} style={{ backgroundColor: isDark ? '#1976d2' : '#90caf9', borderRadius: 8, padding: 12, marginTop: 8, width: '100%', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Calculate Z-Score</Text>
      </TouchableOpacity>
      {result && (
        <View style={{ marginTop: 16, padding: 16, borderRadius: 8, backgroundColor: resultColor || (isDark ? '#23272e' : '#f7faff'), alignItems: 'center', width: '100%' }}>
          <Text style={{ color: isDark ? '#222' : '#222', fontWeight: 'bold', fontSize: 16 }}>{result}</Text>
        </View>
      )}
    </View>
  );
}

export default ZScoreCalculator;
