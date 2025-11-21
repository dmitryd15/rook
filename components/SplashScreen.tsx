import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const LOADING_DURATION = 1800; // ms
const BAR_WIDTH = Dimensions.get('window').width * 0.7;

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const [done, setDone] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADING_DURATION,
      useNativeDriver: false,
    }).start(() => {
      setDone(true);
      if (onFinish) onFinish();
    });
  }, []);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_WIDTH],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hospitium Auxiliator</Text>
      <View style={styles.barBg}>
        <Animated.View style={[styles.bar, { width }]} />
      </View>
      <Text style={styles.loadingText}>{done ? 'Welcome!' : 'Loading...'}</Text>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Made by Onyino © 2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    letterSpacing: 1.2,
  },
  barBg: {
    width: BAR_WIDTH,
    height: 16,
    backgroundColor: '#e3eafc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  bar: {
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: '#e3eafc',
    fontSize: 14,
    opacity: 0.85,
    letterSpacing: 0.2,
  },
});
