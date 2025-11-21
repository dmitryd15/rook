import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ClipObject, ClipStorage } from './ClipStorage';

const { width } = Dimensions.get('window');

export default function Clip({ navigation, refreshTrigger }: any) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [clips, setClips] = useState<ClipObject[]>([]);
  // responsive thumbnail size based on screen width
  const thumbSize = Math.min(120, Math.max(80, Math.floor(width * 0.26)));

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      loadClips();
    });
    loadClips();
    return () => unsub();
  }, []);

  // Reload clips when refreshTrigger changes
  useEffect(() => {
    loadClips();
  }, [refreshTrigger]);

  async function loadClips() {
    const all = await ClipStorage.getAllClips();
    setClips(all);
  }

  function renderItem({ item }: { item: ClipObject }) {
    const preview = item.images && item.images.length ? item.images[0] : null;
    const short = item.history ? (item.history.length > 100 ? item.history.slice(0, 100) + '...' : item.history) : '';
    const date = new Date(item.createdAt).toLocaleString();

    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1f2429' : '#fff',
              borderColor: isDark ? '#2f3640' : '#e6e6e6',
              shadowColor: isDark ? '#000' : '#1976d2',
              position: 'relative',
            },
          ]}
          onPress={() => navigation.navigate('ClipDetail', { id: item.id })}
          activeOpacity={0.9}
        >
          {preview ? (
            <Image source={{ uri: preview }} style={[styles.thumb, { width: thumbSize, height: thumbSize }]} />
          ) : (
            <View style={[styles.thumb, { width: thumbSize, height: thumbSize, alignItems: 'center', justifyContent: 'center' }]}>
              <Ionicons name="image-outline" size={Math.floor(thumbSize * 0.36)} color={isDark ? '#90caf9' : '#999'} />
            </View>
          )}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.title, { color: isDark ? '#fff' : '#111', fontSize: 16, fontWeight: '700' }]} numberOfLines={1}>
              {item.title || short}
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#cfd8dc' : '#444' }]} numberOfLines={2}>{short}</Text>
            <Text style={[styles.timestamp, { color: isDark ? '#90caf9' : '#666' }]}>{date}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={[styles.repoCard, { backgroundColor: isDark ? '#1b1f23' : '#fff', borderColor: isDark ? '#2f3640' : '#e6e6e6' }]}>
        <Text style={{ fontWeight: '800', fontSize: 18, color: isDark ? '#90caf9' : '#1976d2' }}>Case Studies</Text>
        <Text style={{ color: isDark ? '#cfd8dc' : '#666', marginTop: 4 }}>{clips.length} case{clips.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList data={clips} keyExtractor={i => i.id} renderItem={renderItem} showsVerticalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ paddingHorizontal: 0 }} />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ClipForm')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  repoCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%'
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 0,
    borderWidth: 1,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
    position: 'relative'
  },
  thumb: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontSize: 14,
    color: '#222'
  },
  subtitle: {
    marginTop: 6,
    color: '#555',
    fontSize: 13
  },
  timestamp: {
    marginTop: 8,
    color: '#666',
    fontSize: 12
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  }
});
