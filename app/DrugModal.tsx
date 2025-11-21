
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';



export default function DrugModal({ drug, onClose }) {
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [dose, setDose] = useState<string | null>(null);
  // If drug has conditions, default to first; else null
  const [selectedConditionIdx, setSelectedConditionIdx] = useState(0);

  const hasConditions = Array.isArray(drug.conditions) && drug.conditions.length > 0;
  const selectedCondition = hasConditions ? drug.conditions[selectedConditionIdx] : null;

  // Patient type for legacy drugs
  const [patientType, setPatientType] = useState<'child' | 'adult'>('child');

  const calculateDose = () => {
    if (selectedCondition) {
      // If weight-based
      if (selectedCondition.unit.includes('kg')) {
        if (!weight || isNaN(Number(weight))) return setDose(null);
        const w = parseFloat(weight);
        let d = (selectedCondition.baseDose * w);
        // If max per dose is in note, try to parse it
        const maxMatch = selectedCondition.note && selectedCondition.note.match(/max[^\d]*(\d+)/i);
        if (maxMatch) {
          const max = parseFloat(maxMatch[1]);
          if (!isNaN(max) && d > max) d = max;
        }
        setDose(d.toFixed(2) + ' ' + selectedCondition.unit + (selectedCondition.note ? ` (${selectedCondition.note})` : ''));
      } else {
        // Fixed dose
        setDose(selectedCondition.baseDose + ' ' + selectedCondition.unit + (selectedCondition.note ? ` (${selectedCondition.note})` : ''));
      }
      return;
    }
    // Legacy fallback
    if (drug.calc) {
      if (!weight || isNaN(Number(weight))) return setDose(null);
      const w = parseFloat(weight);
      setDose((drug.calc.baseDose * w).toFixed(2) + ' ' + (drug.calc.unit || 'mg'));
    } else {
      setDose('No calculator for this drug.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>{drug.name}</Text>
      <Text style={{ fontSize: 16, marginBottom: 18 }}>{drug.info}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 6 }}>Dosage Calculator</Text>
      {/* Condition selector if available */}
      {hasConditions && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Select condition:</Text>
          {drug.conditions.map((cond, idx) => (
            <Pressable
              key={cond.label}
              onPress={() => setSelectedConditionIdx(idx)}
              style={{
                backgroundColor: selectedConditionIdx === idx ? '#1976d2' : '#eee',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                marginBottom: 4,
              }}
            >
              <Text style={{ color: selectedConditionIdx === idx ? '#fff' : '#222', fontWeight: 'bold' }}>{cond.label}</Text>
              {cond.note && <Text style={{ color: selectedConditionIdx === idx ? '#fff' : '#555', fontSize: 12 }}>{cond.note}</Text>}
            </Pressable>
          ))}
        </View>
      )}
      {/* Show input fields as needed */}
      {selectedCondition && selectedCondition.unit.includes('kg') && (
        <TextInput
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 }}
        />
      )}
      {/* Fallback for legacy patient type logic */}
      {!hasConditions && (
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Pressable
            onPress={() => setPatientType('child')}
            style={{
              backgroundColor: patientType === 'child' ? '#1976d2' : '#eee',
              paddingVertical: 8,
              paddingHorizontal: 18,
              borderRadius: 6,
              marginRight: 8,
            }}
          >
            <Text style={{ color: patientType === 'child' ? '#fff' : '#222', fontWeight: 'bold' }}>Child</Text>
          </Pressable>
          <Pressable
            onPress={() => setPatientType('adult')}
            style={{
              backgroundColor: patientType === 'adult' ? '#1976d2' : '#eee',
              paddingVertical: 8,
              paddingHorizontal: 18,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: patientType === 'adult' ? '#fff' : '#222', fontWeight: 'bold' }}>Adult</Text>
          </Pressable>
        </View>
      )}
      {!hasConditions && patientType === 'child' && (
        <TextInput
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 }}
        />
      )}
      {/* Age input is not used for Dexamethasone, but kept for extensibility */}
      {/* <TextInput
        placeholder="Age (years)"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 }}
      /> */}
      <Pressable onPress={calculateDose} style={{ backgroundColor: '#1976d2', padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 16 }}>Calculate Dose</Text>
      </Pressable>
      {dose !== null && (
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Dose: {dose}</Text>
      )}
      <Pressable onPress={onClose} style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: '#1976d2', fontSize: 16 }}>Close</Text>
      </Pressable>
    </ScrollView>
  );
}
