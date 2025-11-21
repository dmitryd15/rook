
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle, useColorScheme } from 'react-native';

type CalculatorCardProps = {
  icon: string;
  title: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function CalculatorCard({ icon, title, children, style }: CalculatorCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Centralized color variables for light/dark mode
  const cardBackground = isDark ? '#181a20' : '#fff';
  const cardShadow = '#000';
  const headerBackground = isDark ? '#23272e' : '#e3f2fd';
  const iconColor = isDark ? '#90caf9' : '#1976d2';
  const titleColor = isDark ? '#90caf9' : '#1976d2';
  const bodyBackground = isDark ? '#23272e' : 'transparent';

  return (
    <View
      style={[
        styles.card,
        style,
        {
          backgroundColor: cardBackground,
          shadowColor: cardShadow,
        },
      ]}
    >
      <View style={[styles.header, { backgroundColor: headerBackground }]}> 
        <Ionicons name={icon as any} size={28} color={iconColor} style={styles.icon} />
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      </View>
      <View style={[styles.body, { backgroundColor: bodyBackground }]}> 
        {children}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginVertical: 16,
    marginHorizontal: 8,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  body: {
    padding: 20,
  },
});
