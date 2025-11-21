import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ClipObject, ClipStorage } from './ClipStorage';

export default function ClipForm({ navigation, route }: any) {
  const editingId = route.params?.id;
  const [title, setTitle] = useState('');
  const [history, setHistory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [labs, setLabs] = useState<string[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (editingId) loadExisting();
  }, [editingId]);

  async function loadExisting() {
    const all = await ClipStorage.getAllClips();
    const found = all.find(c => c.id === editingId);
    if (found) {
      setTitle(found.title || '');
      setHistory(found.history);
      setImages(found.images || []);
      setLabs(found.labs || []);
    }
  }

  async function pickImages() {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      if (res.canceled) return;
      const uris = res.assets.map((a: any) => a.uri);
      const next = [...images, ...uris].slice(0, 10);
      setImages(next);
    } catch (e) {
      console.error('pickImages', e);
    }
  }

  async function pickDocument() {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      const r: any = res as any;
      if (r && r.type === 'success') {
        setLabs(prev => [...prev, r.uri]);
      }
    } catch (e) {
      console.error('pickDocument', e);
    }
  }

  async function save() {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a title for this clip');
      return;
    }
    if (!history.trim()) {
      Alert.alert('Validation', 'Please enter a brief history');
      return;
    }
    const clip: ClipObject = {
      id: editingId || String(Date.now()),
      title: title.trim(),
      history: history.trim(),
      images,
      labs,
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      await ClipStorage.updateClip(editingId, clip as any);
    } else {
      await ClipStorage.saveClip(clip);
    }
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#121417' : '#fff' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: isDark ? '#2f3640' : '#e6e6e6' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#90caf9' : '#1976d2'} />
          <Text style={{ marginLeft: 8, color: isDark ? '#90caf9' : '#1976d2', fontWeight: '600' }}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 20 }}>
        <Text style={{ marginBottom: 6, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2' }}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={[styles.titleInput, { backgroundColor: isDark ? '#23272e' : '#fff', color: isDark ? '#fff' : '#222', borderColor: isDark ? '#333' : '#ddd' }]}
          placeholder="Enter clip title"
          placeholderTextColor={isDark ? '#90caf9' : '#888'}
        />

        <Text style={{ marginTop: 12, marginBottom: 6, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2' }}>Brief Patient History</Text>
        <TextInput
          value={history}
          onChangeText={setHistory}
          multiline
          style={[styles.input, { backgroundColor: isDark ? '#23272e' : '#fff', color: isDark ? '#fff' : '#222', borderColor: isDark ? '#333' : '#ddd' }]}
          placeholder="Enter brief history"
          placeholderTextColor={isDark ? '#90caf9' : '#888'}
        />

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2' }}>Images ({images.length}/10)</Text>
          <ScrollView horizontal style={{ marginTop: 8 }}>
            {images.map((uri, i) => (
              <View key={i} style={{ marginRight: 8 }}>
                <Image source={{ uri }} style={{ width: 100, height: 100, borderRadius: 6 }} />
                <TouchableOpacity onPress={() => setImages(images.filter((_, idx) => idx !== i))} style={{ position: 'absolute', right: 2, top: 2 }}>
                  <Ionicons name="close-circle" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={pickImages} style={[styles.addThumb, { backgroundColor: isDark ? '#23272e' : '#f6f6f6' }]}>
              <Ionicons name="image-outline" size={36} color={isDark ? '#90caf9' : '#888'} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2' }}>Lab Attachments</Text>
          {labs.map((uri, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Ionicons name="document-text-outline" size={24} color={isDark ? '#cfd8dc' : '#666'} />
              <Text style={{ marginLeft: 8, flex: 1, color: isDark ? '#fff' : '#222' }} numberOfLines={1}>{uri}</Text>
              <TouchableOpacity onPress={() => setLabs(labs.filter((_, idx) => idx !== i))}>
                <Ionicons name="close" size={20} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={pickDocument} style={{ marginTop: 8, padding: 10, backgroundColor: isDark ? '#23272e' : '#eee', borderRadius: 6 }}>
            <Text style={{ color: isDark ? '#90caf9' : '#222' }}>Add Document</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1, padding: 12, backgroundColor: isDark ? '#424242' : '#ddd', borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={save} style={{ flex: 1, padding: 12, backgroundColor: '#1976d2', borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 120,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  titleInput: {
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    color: '#222'
  },
  addThumb: {
    width: 100,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center'
  }
});


