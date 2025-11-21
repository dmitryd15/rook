import { useTheme } from '@/context/ThemeContext';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

export function LiveClock({ theme: propTheme }: { theme?: 'light' | 'dark' } = {}) {
  const [time, setTime] = useState(new Date());
  const colorScheme = useColorScheme();
  let contextTheme: 'light' | 'dark' | undefined;
  try {
    contextTheme = useTheme().theme;
  } catch {
    contextTheme = undefined;
  }
  const theme = propTheme || contextTheme || colorScheme || 'light';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View
      style={[
        styles.clockContainer,
        theme === 'dark' && { backgroundColor: '#222', borderColor: '#2196F3', borderWidth: 1 },
      ]}
    >
      <Text
        style={[
          styles.clockText,
          theme === 'dark' && { color: '#90caf9' },
        ]}
      >
        {time.toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  clockContainer: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-end',
    marginTop: 12,
    marginRight: 12,
  },
  clockText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
