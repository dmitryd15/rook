


import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';


import ConvulsionsProtocol from './ConvulsionsProtocol';
import DKAProtocol from './DKAProtocol';
import PossibleAsthmaProtocol from './PossibleAsthmaProtocol';
import TriageSickChildProtocol from './TriageSickChildProtocol';

const GUIDELINES = [
  {
    key: 'triage-sick-child',
    title: 'Triage of a Sick Child',
    component: TriageSickChildProtocol,
  },
  // Removed legacy Treatment of Convulsions protocol
  {
    key: 'convulsions-modern',
    title: 'Treatment of Convulsions',
    description: '(Children >1 month)',
    component: ConvulsionsProtocol,
  },
  {
    key: 'possible-asthma',
    title: 'Possible Asthma',
    component: PossibleAsthmaProtocol,
  },
  {
    key: 'dka-emergency',
    title: 'Diabetic Ketoacidosis (DKA) Emergency Protocol',
    description: 'Emergency management of DKA',
    component: DKAProtocol,
  },
];

export default function PaedsProtocol() {
  const [selectedGuideline, setSelectedGuideline] = useState<string | null>(null);
  const colorScheme = useColorScheme && typeof useColorScheme === 'function' ? useColorScheme() : 'light';
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? '#181A20' : '#fff';
  const cardColor = isDark ? '#23262F' : '#f2f2f2';
  const textColor = isDark ? '#fff' : '#181A20';
  const accentColor = '#007AFF';

  const handleBack = () => setSelectedGuideline(null);

  const SelectedComponent = selectedGuideline
    ? GUIDELINES.find(g => g.key === selectedGuideline)?.component
    : null;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1, backgroundColor }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 16, color: textColor }}>
            Paediatrics Protocol 5th Edition 2022 (Children 5 yrs or less)
          </Text>
          {selectedGuideline && SelectedComponent ? (
            <View style={{ flex: 1 }}>
              <Pressable onPress={handleBack} style={{ marginBottom: 16 }}>
                <Text style={{ color: accentColor, fontSize: 16 }}>{'< Back to list'}</Text>
              </Pressable>
              <SelectedComponent />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {GUIDELINES.map(g => (
                <Pressable
                  key={g.key}
                  onPress={() => setSelectedGuideline(g.key)}
                  style={{
                    padding: 20,
                    backgroundColor: cardColor,
                    borderRadius: 10,
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor }}>{g.title}</Text>
                  {g.description && (
                    <Text style={{ fontSize: 14, color: textColor, marginTop: 2 }}>{g.description}</Text>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
