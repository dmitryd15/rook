import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import DKAProtocol from './DKAProtocol';

const EMERGENCY_GUIDELINES = [
  {
    key: 'dka-emergency',
    title: 'Diabetic Ketoacidosis (DKA) / HHS Algorithm',
    description: 'Emergency management of DKA and HHS',
    component: DKAProtocol,
  },
  // Add more emergency protocols here as needed
];

export default function EmergencyGuidelines() {
  const [selected, setSelected] = useState(null);
  const SelectedComponent = selected ? EMERGENCY_GUIDELINES.find(g => g.key === selected)?.component : null;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 16, color: '#1976d2' }}>
            Emergency Protocols
          </Text>
          {selected && SelectedComponent ? (
            <View style={{ flex: 1 }}>
              <Pressable onPress={() => setSelected(null)} style={{ marginBottom: 16 }}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>{'< Back to list'}</Text>
              </Pressable>
              <SelectedComponent />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {EMERGENCY_GUIDELINES.map(g => (
                <Pressable
                  key={g.key}
                  onPress={() => setSelected(g.key)}
                  style={{
                    padding: 20,
                    backgroundColor: '#f2f2f2',
                    borderRadius: 10,
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#181A20' }}>{g.title}</Text>
                  {g.description && (
                    <Text style={{ fontSize: 14, color: '#181A20', marginTop: 2 }}>{g.description}</Text>
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
