import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export function ThemeToggle({ isDark, onToggle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isDark ? 'Dark' : 'Light'} Mode</Text>
      <Switch
        value={isDark}
        onValueChange={onToggle}
        thumbColor={isDark ? '#2196F3' : '#f4f3f4'}
        trackColor={{ false: '#767577', true: '#2196F3' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 12,
    marginTop: 8,
  },
  label: {
    marginRight: 8,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});
