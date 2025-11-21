import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

const EYE_RESPONSES = [
  { label: 'None', value: 1 },
  { label: 'To pain', value: 2 },
  { label: 'To speech', value: 3 },
  { label: 'Spontaneous', value: 4 },
];
const VERBAL_RESPONSES = [
  { label: 'None', value: 1 },
  { label: 'Incomprehensible sounds', value: 2 },
  { label: 'Inappropriate words', value: 3 },
  { label: 'Confused', value: 4 },
  { label: 'Oriented', value: 5 },
];
const MOTOR_RESPONSES = [
  { label: 'None', value: 1 },
  { label: 'Extension to pain', value: 2 },
  { label: 'Abnormal flexion to pain', value: 3 },
  { label: 'Withdrawal from pain', value: 4 },
  { label: 'Localizes pain', value: 5 },
  { label: 'Obeys commands', value: 6 },
];

export default function GCSCalculator({ onBack }: { onBack?: () => void }) {
  const [eye, setEye] = useState(4);
  const [verbal, setVerbal] = useState(5);
  const [motor, setMotor] = useState(6);
  const total = eye + verbal + motor;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const mainColor = isDark ? '#90caf9' : '#1976d2';
  const bgColor = isDark ? '#181a20' : '#fff';
  const cardBg = isDark ? '#23272e' : '#f7faff';
  const borderColor = isDark ? '#90caf9' : '#90caf9';
  const textColor = isDark ? '#e0e0e0' : '#222';
  const subTextColor = isDark ? '#b0b0b0' : '#555';
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}> 
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backText, { color: mainColor }]}>Back</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: mainColor }]}>Glasgow Coma Scale (GCS)</Text>
      <Text style={[styles.subtitle, { color: subTextColor }]}>Select best response for each:</Text>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: mainColor }]}>Eye Opening (E)</Text>
        {EYE_RESPONSES.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, eye === opt.value && { ...styles.selected, backgroundColor: cardBg, borderColor: mainColor }]}
            onPress={() => setEye(opt.value)}
          >
            <Text style={[styles.optionText, { color: textColor }]}>{opt.value} - {opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: mainColor }]}>Verbal Response (V)</Text>
        {VERBAL_RESPONSES.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, verbal === opt.value && { ...styles.selected, backgroundColor: cardBg, borderColor: mainColor }]}
            onPress={() => setVerbal(opt.value)}
          >
            <Text style={[styles.optionText, { color: textColor }]}>{opt.value} - {opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: mainColor }]}>Motor Response (M)</Text>
        {MOTOR_RESPONSES.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, motor === opt.value && { ...styles.selected, backgroundColor: cardBg, borderColor: mainColor }]}
            onPress={() => setMotor(opt.value)}
          >
            <Text style={[styles.optionText, { color: textColor }]}>{opt.value} - {opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.resultBox, { backgroundColor: cardBg }]}> 
        <Text style={[styles.resultText, { color: mainColor }]}>Total GCS: <Text style={{ fontWeight: 'bold', color: textColor }}>{total}</Text></Text>
        <Text style={[styles.resultText, { color: subTextColor }]}> 
          {total === 15 && 'Normal'}
          {total >= 13 && total < 15 && 'Mild injury'}
          {total >= 9 && total < 13 && 'Moderate injury'}
          {total < 9 && 'Severe injury'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, width: '100%', maxWidth: 480, alignSelf: 'center' },
  backButton: { marginBottom: 12 },
  backText: { color: '#1976d2', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#555', marginBottom: 16, textAlign: 'center' },
  section: { marginBottom: 18 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 6 },
  option: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#90caf9', marginBottom: 6 },
  selected: { backgroundColor: '#e3f2fd', borderColor: '#1976d2' },
  optionText: { fontSize: 15 },
  resultBox: { marginTop: 18, padding: 14, backgroundColor: '#f7faff', borderRadius: 8, alignItems: 'center' },
  resultText: { fontSize: 16, marginBottom: 2 },
});
