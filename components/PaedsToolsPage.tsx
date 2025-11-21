import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import DukeCriteriaCalculator from './DukeCriteriaCalculator';
import HollidaySegarCalculator from './HollidaySegarCalculator';
import JonesCriteriaCalculator from './JonesCriteriaCalculator';
import PaedWeightCalculator from './PaedWeightCalculator';
import ZScoreCalculator from './ZScoreCalculator';

// Accepts paedsTools array and onBack callback
type Tool = { key: string; name: string; description: string; method?: string };
type Props = { tools: Tool[]; onBack: () => void };
export default function PaedsToolsPage({ tools, onBack }: Props) {
  const [activeTool, setActiveTool] = React.useState<string | null>(null);
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  // Removed window.addEventListener for React Native compatibility

  if (activeTool === 'duke-criteria') {
    return <DukeCriteriaCalculator onBack={() => setActiveTool(null)} />;
  }
  if (activeTool === 'jones-criteria') {
    return <JonesCriteriaCalculator onBack={() => setActiveTool(null)} />;
  }
  if (activeTool === 'paed-weight') {
    return <PaedWeightCalculator onBack={() => setActiveTool(null)} />;
  }
  if (activeTool === 'holliday-segar') {
    return <HollidaySegarCalculator onBack={() => setActiveTool(null)} />;
  }
  if (activeTool === 'zscore') {
    return <ZScoreCalculator onBack={() => setActiveTool(null)} onBackToCategory={onBack} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center', width: '100%' }}>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#0288d1" />
        <Text style={{ color: '#0288d1', fontWeight: 'bold', marginLeft: 8 }}>Back to Categories</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#0288d1', marginBottom: 18 }}>Paediatrics Tools</Text>
      {tools.map(tool => (
        <TouchableOpacity key={tool.key} onPress={() => setActiveTool(tool.key)}>
          <View style={{
            width: '100%',
            backgroundColor: isDark ? '#23242a' : '#e3f2fd',
            borderRadius: 10,
            padding: 16,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: '#0288d1'
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: isDark ? '#90caf9' : '#0288d1'
            }}>{tool.name}</Text>
            <Text style={{
              color: isDark ? '#ccc' : '#555',
              marginTop: 4
            }}>{tool.description}</Text>
            {tool.method && (
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontSize: 13,
                marginTop: 8,
                fontStyle: 'italic'
              }}>{tool.method}</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
      {/* Add Duke Criteria Calculator button */}
      <TouchableOpacity onPress={() => setActiveTool('duke-criteria')}>
        <View style={{
          width: '100%',
          backgroundColor: isDark ? '#23242a' : '#e3f2fd',
          borderRadius: 10,
          padding: 16,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: '#0288d1'
        }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: isDark ? '#90caf9' : '#0288d1'
          }}>Duke Criteria for Infective Endocarditis</Text>
          <Text style={{
            color: isDark ? '#ccc' : '#555',
            marginTop: 4
          }}>Diagnostic calculator for infective endocarditis (IE) using modified Duke criteria.</Text>
          <Text style={{
            color: isDark ? '#90caf9' : '#1976d2',
            fontSize: 13,
            marginTop: 8,
            fontStyle: 'italic'
          }}>Major, minor, and diagnostic criteria</Text>
        </View>
      </TouchableOpacity>
      {/* Add Z-Score Calculator button */}
      <TouchableOpacity onPress={() => setActiveTool('zscore')}>
        <View style={{
          width: '100%',
          backgroundColor: isDark ? '#23242a' : '#e3f2fd',
          borderRadius: 10,
          padding: 16,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: '#0288d1'
        }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: isDark ? '#90caf9' : '#0288d1'
          }}>Length-for-Weight Z-Score</Text>
          <Text style={{
            color: isDark ? '#ccc' : '#555',
            marginTop: 4
          }}>Calculate z-score for paediatric patients using length and weight.</Text>
          <Text style={{
            color: isDark ? '#90caf9' : '#1976d2',
            fontSize: 13,
            marginTop: 8,
            fontStyle: 'italic'
          }}>Uses WHO growth standards</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
