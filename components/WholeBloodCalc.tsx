import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import WholeBloodFormula from './WholeBloodFormula';

export default function HaematologyCalculators({ onBack }: { onBack?: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Haematology Calculators</Text>
      <WholeBloodFormula />
      {/* Add more haematology calculators here as needed */}
      {onBack && (
        <Text style={styles.back} onPress={onBack}>&lt; Back</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 18,
  },
  back: {
    color: '#1976d2',
    marginTop: 24,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
