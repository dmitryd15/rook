import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, FlatList, Image, Modal, ScrollView, Share, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ClipObject, ClipStorage } from './ClipStorage';

const { width } = Dimensions.get('window');

export default function ClipDetail({ route, navigation }: any) {
  const id = route.params?.id;
  const [clip, setClip] = useState<ClipObject | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});
  const [searchInput, setSearchInput] = useState('');
  const [linkMode, setLinkMode] = useState<'search' | 'manual'>('search');
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    load();
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const stored = await AsyncStorage.getItem('patients_list');
      if (stored) {
        const patientsList = JSON.parse(stored);
        setPatients(patientsList);
      }
    } catch (e) {
      console.error('load patients', e);
    }
  }

  useEffect(() => {
    if (linkMode === 'search' && searchInput.trim()) {
      const query = searchInput.trim().toLowerCase();
      const filtered = patients.filter(p => {
        const name = `${p.firstName} ${p.lastName}`.toLowerCase();
        const ip = (p.ipNumber || '').toLowerCase();
        return name.includes(query) || ip.includes(query);
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients([]);
    }
  }, [searchInput, linkMode, patients]);

  async function load() {
    const all = await ClipStorage.getAllClips();
    const found = all.find(c => c.id === id) || null;
    setClip(found);
  }

  async function handleDelete() {
    Alert.alert('Delete', 'Delete this clip?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await ClipStorage.deleteClip(id);
          // Delay slightly to ensure deletion is persisted before navigation
          setTimeout(() => {
            navigation.goBack();
          }, 100);
        } catch (e) {
          console.error('delete', e);
          Alert.alert('Error', 'Could not delete clip');
        }
      } }
    ]);
  }

  async function handleLinkPatient(patientData: any) {
    try {
      if (clip) {
        await ClipStorage.updateClip(clip.id, { linkedPatient: patientData } as any);
        await load();
        setShowLinkModal(false);
        setSearchInput('');
      }
    } catch (e) {
      console.error('link patient', e);
      Alert.alert('Error', 'Could not link patient');
    }
  }

  async function handleImageLongPress(uri: string) {
    Alert.alert('Image', 'Choose action', [
      { text: 'Share', onPress: () => shareImage(uri) },
      { text: 'Save', onPress: () => saveImageToLibrary(uri) },
      { text: 'Cancel', style: 'cancel' }
    ]);
  }

  async function shareImage(uri: string) {
    try {
      await Share.share({ url: uri });
    } catch (e) {
      console.error('share image', e);
      Alert.alert('Error', 'Could not share image');
    }
  }

  async function saveImageToLibrary(uri: string) {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Permission to access media library is required to save images.');
        return;
      }
      const filename = uri.split('/').pop() || `rook_${Date.now()}.jpg`;
      const localUri = FileSystem.cacheDirectory + filename;
      const download = await FileSystem.downloadAsync(uri, localUri);
      const asset = await MediaLibrary.createAssetAsync(download.uri);
      try { await MediaLibrary.createAlbumAsync('Rook', asset, false); } catch (_) {}
      Alert.alert('Saved', 'Image saved to your photos');
    } catch (e) {
      console.error('save image', e);
      Alert.alert('Error', 'Could not save image');
    }
  }

  if (!clip) return null;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#121417' : '#fff' }}>
      {/* Back Button Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: isDark ? '#2f3640' : '#e6e6e6' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Clip')} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#90caf9' : '#1976d2'} />
          <Text style={{ marginLeft: 8, color: isDark ? '#90caf9' : '#1976d2', fontWeight: '600' }}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: isDark ? '#90caf9' : '#1976d2', flex: 1 }}>{clip.title || 'Clip'}</Text>
          <View style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {clip.linkedPatient ? (
              <TouchableOpacity onPress={() => navigation.navigate('PatientProfile', { id: clip.linkedPatient?.id, ip: clip.linkedPatient?.ip, name: clip.linkedPatient?.name })} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="person-circle" size={28} color={isDark ? '#90caf9' : '#1976d2'} />
                <Text style={{ fontSize: 14, color: isDark ? '#90caf9' : '#1976d2', fontWeight: '600', maxWidth: 140 }} numberOfLines={1}>{clip.linkedPatient.name || clip.linkedPatient.ip}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setShowLinkModal(true)} style={{ padding: 4 }}>
                <Ionicons name="link-outline" size={24} color={isDark ? '#90caf9' : '#1976d2'} />
              </TouchableOpacity>
            )}
            {clip.linkedPatient && (
              <TouchableOpacity onPress={async () => { await ClipStorage.updateClip(clip.id, { linkedPatient: null } as any); load(); }} style={{ padding: 2 }}>
                <Text style={{ color: '#d32f2f', fontSize: 12, fontWeight: '600' }}>unlink</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: isDark ? '#90caf9' : '#1976d2' }}>History</Text>
        <Text style={{ marginBottom: 12, color: isDark ? '#fff' : '#222' }}>{clip.history}</Text>

        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: isDark ? '#90caf9' : '#1976d2' }}>Images</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {clip.images.map((uri, i) => (
            <TouchableOpacity key={i} onPress={() => { setSelectedIndex(i); setShowImageModal(true); }} onLongPress={() => handleImageLongPress(uri)} activeOpacity={0.9}>
              <View style={{ width: (width - 40) / 3, height: (width - 40) / 3, margin: 4, borderRadius: 6, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#111' : '#fafafa' }}>
                <Image
                  source={{ uri }}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                  onLoadStart={() => setLoadingMap(prev => ({ ...prev, [i]: true }))}
                  onLoadEnd={() => setLoadingMap(prev => ({ ...prev, [i]: false }))}
                />
                {loadingMap[i] && (
                  <ActivityIndicator size="small" color="#1976d2" style={{ position: 'absolute' }} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom fullscreen image viewer with manual swipe */}
        <Modal visible={showImageModal} transparent onRequestClose={() => setShowImageModal(false)}>
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Header */}
            <View style={{ width: '100%', paddingTop: 40, paddingHorizontal: 12, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <TouchableOpacity onPress={() => setShowImageModal(false)} style={{ padding: 8 }}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={{ color: '#fff', fontWeight: '600' }}>{selectedIndex + 1} / {clip.images.length}</Text>
              <TouchableOpacity onPress={() => shareImage(clip.images[selectedIndex])} style={{ padding: 8 }}>
                <Ionicons name="share-social" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Image */}
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              scrollEnabled={false}
              style={{ flex: 1 }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onLongPress={() => handleImageLongPress(clip.images[selectedIndex])}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}
              >
                <Image
                  source={{ uri: clip.images[selectedIndex] }}
                  style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                />
              </TouchableOpacity>
            </ScrollView>

            {/* Navigation arrows */}
            {selectedIndex > 0 && (
              <TouchableOpacity
                onPress={() => setSelectedIndex(selectedIndex - 1)}
                style={{ position: 'absolute', left: 12, top: '50%', padding: 12, marginTop: -20 }}
              >
                <Ionicons name="chevron-back" size={36} color="#fff" />
              </TouchableOpacity>
            )}
            {selectedIndex < clip.images.length - 1 && (
              <TouchableOpacity
                onPress={() => setSelectedIndex(selectedIndex + 1)}
                style={{ position: 'absolute', right: 12, top: '50%', padding: 12, marginTop: -20 }}
              >
                <Ionicons name="chevron-forward" size={36} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </Modal>

        <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 12, color: isDark ? '#90caf9' : '#1976d2' }}>Lab Attachments</Text>
        {clip.labs.map((uri, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Ionicons name="document-text-outline" size={24} color={isDark ? '#cfd8dc' : '#666'} />
            <Text style={{ marginLeft: 8, flex: 1, color: isDark ? '#fff' : '#222' }} numberOfLines={1}>{uri}</Text>
            <TouchableOpacity onPress={async () => { const newLabs = clip.labs.filter((_, idx) => idx !== i); await ClipStorage.updateClip(clip.id, { labs: newLabs } as any); load(); }}>
              <Ionicons name="close" size={20} color="#d32f2f" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ClipForm', { id: clip.id })} style={{ flex: 1, padding: 12, backgroundColor: '#1976d2', borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={{ flex: 1, padding: 12, backgroundColor: '#d32f2f', borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Link Patient Modal */}
      <Modal visible={showLinkModal} transparent animationType="slide" onRequestClose={() => setShowLinkModal(false)}>
        <View style={{ flex: 1, backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }}>
          <View style={{ flex: 1, backgroundColor: isDark ? '#121417' : '#fff', marginTop: 100, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: isDark ? '#2f3640' : '#e6e6e6' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2' }}>Link Patient</Text>
              <TouchableOpacity onPress={() => setShowLinkModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#90caf9' : '#1976d2'} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
              {/* Toggle between Search and Manual Entry */}
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                <TouchableOpacity 
                  onPress={() => setLinkMode('search')} 
                  style={{ flex: 1, padding: 10, backgroundColor: linkMode === 'search' ? '#1976d2' : (isDark ? '#23272e' : '#e3f2fd'), borderRadius: 8, alignItems: 'center' }}
                >
                  <Text style={{ color: linkMode === 'search' ? '#fff' : (isDark ? '#90caf9' : '#1976d2'), fontWeight: 'bold' }}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setLinkMode('manual')} 
                  style={{ flex: 1, padding: 10, backgroundColor: linkMode === 'manual' ? '#1976d2' : (isDark ? '#23272e' : '#e3f2fd'), borderRadius: 8, alignItems: 'center' }}
                >
                  <Text style={{ color: linkMode === 'manual' ? '#fff' : (isDark ? '#90caf9' : '#1976d2'), fontWeight: 'bold' }}>Manual</Text>
                </TouchableOpacity>
              </View>

              {linkMode === 'search' ? (
                <>
                  <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: isDark ? '#90caf9' : '#1976d2' }}>Search by Name or IP Number:</Text>
                  <TextInput
                    style={{ backgroundColor: isDark ? '#23272e' : '#f7faff', color: isDark ? '#fff' : '#222', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: isDark ? '#90caf9' : '#90caf9' }}
                    placeholder="Enter patient name or IP number..."
                    placeholderTextColor={isDark ? '#90caf9' : '#888'}
                    value={searchInput}
                    onChangeText={setSearchInput}
                  />
                  {filteredPatients.length > 0 ? (
                    <FlatList
                      data={filteredPatients}
                      keyExtractor={p => p.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => handleLinkPatient({ id: item.id, name: `${item.firstName} ${item.lastName}`, ip: item.ipNumber })}
                          style={{ backgroundColor: isDark ? '#23272e' : '#f7faff', padding: 12, marginBottom: 8, borderRadius: 8, borderWidth: 1, borderColor: isDark ? '#90caf9' : '#e0e0e0' }}
                        >
                          <Text style={{ fontWeight: 'bold', color: isDark ? '#fff' : '#222' }}>{item.firstName} {item.lastName}</Text>
                          <Text style={{ color: isDark ? '#cfd8dc' : '#666', fontSize: 12, marginTop: 4 }}>IP: {item.ipNumber || 'N/A'} | Ward: {item.ward || 'N/A'}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  ) : searchInput.trim() ? (
                    <Text style={{ color: isDark ? '#aaa' : '#888', textAlign: 'center', marginVertical: 16 }}>No patients found</Text>
                  ) : (
                    <Text style={{ color: isDark ? '#aaa' : '#888', textAlign: 'center', marginVertical: 16 }}>Start typing to search...</Text>
                  )}
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: isDark ? '#90caf9' : '#1976d2' }}>Enter Patient Details:</Text>
                  <TextInput
                    style={{ backgroundColor: isDark ? '#23272e' : '#f7faff', color: isDark ? '#fff' : '#222', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: isDark ? '#90caf9' : '#90caf9' }}
                    placeholder="IP Number"
                    placeholderTextColor={isDark ? '#90caf9' : '#888'}
                    value={searchInput}
                    onChangeText={setSearchInput}
                  />
                  <TouchableOpacity 
                    onPress={() => handleLinkPatient({ ip: searchInput, name: '', id: `patient_${Date.now()}` })}
                    style={{ backgroundColor: '#1976d2', padding: 12, borderRadius: 8, alignItems: 'center' }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Link Patient</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
