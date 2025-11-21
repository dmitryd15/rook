import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WholeBloodCalc from './WholeBloodCalc';

interface Tool {
  key: string;
  name: string;
  description: string;
  method?: string;
}

interface HaematologyToolsPageProps {
  tools: Tool[];
  onBack: () => void;
}

export default function HaematologyToolsPage({ tools, onBack }: HaematologyToolsPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTool, setActiveTool] = useState<string | null>(null);

  if (activeTool === 'whole-blood-calc') {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#181a20' : '#f7faff' }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => setActiveTool(null)}>
          <Ionicons name="arrow-back" size={20} color="#1976d2" />
          <Text style={[styles.backText, { color: isDark ? '#90caf9' : '#1976d2' }]}>Back to Haematology</Text>
        </TouchableOpacity>
        <WholeBloodCalc />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDark ? '#181a20' : '#f7faff' }]}
      contentContainerStyle={styles.contentContainer}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#1976d2" />
        <Text style={[styles.backText, { color: isDark ? '#90caf9' : '#1976d2' }]}>Back to Categories</Text>
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: isDark ? '#90caf9' : '#1976d2' }]}>Haematology Tools</Text>
      
      <View style={styles.toolsContainer}>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.key}
            style={[
              styles.toolCard,
              {
                backgroundColor: isDark ? '#23272e' : '#fff',
                borderColor: '#1976d2',
                shadowColor: isDark ? '#000' : '#1976d2',
              }
            ]}
            onPress={() => setActiveTool(tool.key)}
            activeOpacity={0.85}
          >
            <View style={styles.toolIconContainer}>
              <Ionicons name="water-outline" size={32} color="#1976d2" />
            </View>
            <View style={styles.toolContent}>
              <Text style={[styles.toolName, { color: isDark ? '#fff' : '#1976d2' }]}>
                {tool.name}
              </Text>
              <Text style={[styles.toolDescription, { color: isDark ? '#aaa' : '#666' }]}>
                {tool.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#1976d2" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  toolsContainer: {
    gap: 16,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  toolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  toolContent: {
    flex: 1,
  },
  toolName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
});
