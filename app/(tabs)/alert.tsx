import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import React, { useCallback, useRef, useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';

// Emergency codes configuration
const CODES = [
  { code: 'Blue', label: 'Code Blue', desc: 'Adult Cardiac Arrest', color: '#1e3a8a', emoji: '🚨', tags: ['adult'] },
  { code: 'Pink', label: 'Code Pink', desc: 'Infant/child emergency', color: '#ff71a0', emoji: '👶', tags: ['peds'] },
  { code: 'OB', label: 'Code OB', desc: 'Obstetric emergency', color: '#7c3aed', emoji: '🤰', tags: ['ob'] },
  { code: 'Stroke', label: 'Code Stroke', desc: 'Suspected stroke', color: '#0ea5a4', emoji: '🧠', tags: ['all'] },
  { code: 'STEMI', label: 'Code STEMI', desc: 'Acute MI', color: '#ef4444', emoji: '❤️', tags: ['adult'] },
  { code: 'Sepsis', label: 'Code Sepsis', desc: 'Severe sepsis', color: '#f97316', emoji: '🦠', tags: ['all'] },
  { code: 'Trauma', label: 'Code Trauma', desc: 'Trauma activation', color: '#b91c1c', emoji: '🩺', tags: ['all'] },
  { code: 'RRT', label: 'Rapid Response', desc: 'Rapid Response Team', color: '#f59e0b', emoji: '⚠️', tags: ['all'] }
];

function getTextColor(bg: string) {
  try {
    const hex = bg.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 0.6 ? '#000' : '#fff';
  } catch (e) {
    return '#fff';
  }
}

export default function AlertScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = Colors[theme].background;
  const textColor = Colors[theme].text;

  // State
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [chooserVisible, setChooserVisible] = useState(false);
  const [mode, setMode] = useState<'none' | 'search' | 'list'>('none');
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [alertHistory, setAlertHistory] = useState<any[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [activeAlert, setActiveAlert] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const soundRef = useRef<Audio.Sound | null>(null);

  // Load patients and history on mount
  useFocusEffect(
    useCallback(() => {
      loadPatients();
      loadAlertHistory();
    }, [])
  );

  const loadPatients = async () => {
    try {
      const pRaw = await AsyncStorage.getItem('patients_list');
      if (pRaw) {
        const parsed = JSON.parse(pRaw);
        setPatients(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {
      console.warn('Failed to load patients', e);
    }
  };

  const loadAlertHistory = async () => {
    try {
      const hRaw = await AsyncStorage.getItem('alert_history');
      if (hRaw) {
        const parsed = JSON.parse(hRaw);
        setAlertHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {
      console.warn('Failed to load alert history', e);
    }
  };

  const saveAlertToHistory = async (code: string, patient: any) => {
    try {
      const entry = {
        code,
        patient,
        timestamp: new Date().toISOString(),
        acknowledged: false,
      };
      const newHistory = [entry, ...alertHistory];
      setAlertHistory(newHistory);
      await AsyncStorage.setItem('alert_history', JSON.stringify(newHistory));
    } catch (e) {
      console.warn('Failed to save alert', e);
    }
  };

  const playAlert = useCallback(async () => {
    try {
      Vibration.vibrate([0, 500, 200, 500]);
    } catch (e) {
      // ignore
    }
  }, []);

  const playCodeBlueSound = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/Alert sounds/Code Blue.wav')
      );
      soundRef.current = sound;
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
    } catch (e) {
      console.warn('Failed to play Code Blue sound', e);
    }
  }, []);

  const triggerCode = (code: string) => {
    setActiveCode(code);
    setMode('none');
    setChooserVisible(true);
    playAlert();
  };

  const searchPatients = (text: string) => {
    setSearchText(text);
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setConfirmVisible(true);
  };

  const confirmAndTrigger = async () => {
    if (!activeCode || !selectedPatient) return;
    
    try {
      await saveAlertToHistory(activeCode, selectedPatient);
      
      setActiveAlert({
        code: activeCode,
        patient: selectedPatient,
        timestamp: new Date().toISOString(),
      });
      
      setChooserVisible(false);
      setConfirmVisible(false);
      setSelectedPatient(null);
      setActiveCode(null);
      setMode('none');
      setSearchText('');
      
      // Play Code Blue sound if triggered
      if (activeCode === 'Blue') {
        await playCodeBlueSound();
      }
      
      // Keep the fullscreen alert visible until acknowledged by the user
    } catch (e) {
      Alert.alert('Error', 'Failed to trigger code');
    }
  };

  const acknowledgeAlert = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (e) {
        console.warn('Failed to stop sound', e);
      }
      soundRef.current = null;
    }
    setActiveAlert(null);
  };

  const filteredPatients = searchText
    ? patients.filter(p => 
        (p.firstName?.toLowerCase().includes(searchText.toLowerCase())) ||
        (p.lastName?.toLowerCase().includes(searchText.toLowerCase())) ||
        (p.ipNumber?.toString().includes(searchText))
      )
    : patients;

  const codeInfo = CODES.find(c => c.code === (activeAlert?.code || activeCode));

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 16 : 8 }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Emergency Codes</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setHistoryVisible(true)}
        >
          <Ionicons name="list-outline" size={24} color={Colors[theme].tint} />
        </TouchableOpacity>
      </View>

      {/* Code Grid */}
      <View style={styles.codeGrid}>
        {CODES.map((code) => (
          <TouchableOpacity
            key={code.code}
            style={[styles.codeCard, { backgroundColor: code.color }]}
            onPress={() => triggerCode(code.code)}
            activeOpacity={0.8}
          >
            <Text style={styles.codeEmoji}>{code.emoji}</Text>
            <Text style={[styles.codeLabel, { color: getTextColor(code.color) }]}>
              Code {code.code}
            </Text>
            <Text style={[styles.codeDesc, { color: getTextColor(code.color), opacity: 0.9 }]}>
              {code.desc}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Alert Fullscreen Modal */}
      <Modal visible={!!activeAlert} transparent animationType="fade" onRequestClose={() => {}} hardwareAccelerated={true}>
        <TouchableOpacity activeOpacity={1} style={{
          flex: 1,
          backgroundColor: codeInfo?.color || '#000',
          justifyContent: 'center',
          alignItems: 'center',
        }} onPress={() => {}} disabled={true}>
          <View style={{ position: 'absolute', top: 48, right: 20 }}>
            <TouchableOpacity
              onPress={acknowledgeAlert}
              style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8 }}
            >
              <Text style={{ color: getTextColor(codeInfo?.color || '#000'), fontWeight: '700' }}>Acknowledge</Text>
            </TouchableOpacity>
          </View>

          <View style={{ padding: 20, alignItems: 'center', width: '94%' }}>
            <Text style={{
              fontSize: 48,
              fontWeight: '900',
              color: getTextColor(codeInfo?.color || '#000'),
              marginBottom: 12,
              textAlign: 'center'
            }}>
              {codeInfo?.label}
            </Text>

            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: getTextColor(codeInfo?.color || '#000'),
              marginBottom: 8
            }}>
              {codeInfo?.desc}
            </Text>

            {activeAlert?.patient && (
              <View style={{ marginTop: 16, width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16 }}>
                <Text style={{ color: getTextColor(codeInfo?.color || '#000'), fontWeight: '700', fontSize: 22, marginBottom: 8 }}>
                  {activeAlert.patient.firstName} {activeAlert.patient.lastName}
                </Text>
                <Text style={{ color: getTextColor(codeInfo?.color || '#000'), opacity: 0.9, fontSize: 18 }}>
                  IP#: {activeAlert.patient.ipNumber || '—'}
                </Text>
                <Text style={{ color: getTextColor(codeInfo?.color || '#000'), opacity: 0.9, fontSize: 18 }}>
                  Ward: {activeAlert.patient.ward || '—'}
                </Text>
                <Text style={{ color: getTextColor(codeInfo?.color || '#000'), opacity: 0.9, fontSize: 18 }}>
                  Bed: {activeAlert.patient.bedNumber || '—'}
                </Text>
                <Text style={{ color: getTextColor(codeInfo?.color || '#000'), opacity: 0.9, marginTop: 8, fontSize: 18 }}>
                  {activeAlert.patient.diagnosis || 'No diagnosis'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={{ marginTop: 32, backgroundColor: getTextColor(codeInfo?.color || '#000') === '#fff' ? '#000' : '#fff', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8 }}
              onPress={acknowledgeAlert}
            >
              <Text style={{ fontWeight: '800', color: getTextColor(codeInfo?.color || '#000') === '#fff' ? '#fff' : '#000', fontSize: 20 }}>
                Acknowledge
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Chooser Modal */}
      <Modal visible={chooserVisible} transparent animationType="fade" onRequestClose={() => setChooserVisible(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalCard, { backgroundColor: bgColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                Trigger Code {activeCode}
              </Text>
              <TouchableOpacity onPress={() => setChooserVisible(false)}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: textColor, opacity: 0.7 }]}>
              Select a patient to link with this code
            </Text>

            {/* Search or List Mode */}
            {mode === 'none' && (
              <View style={styles.modeSelect}>
                <TouchableOpacity
                  style={[styles.modeButton, { backgroundColor: isDark ? '#0a7ea4' : Colors[theme].tint }]}
                  onPress={() => setMode('search')}
                >
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text style={styles.modeButtonText}>Search Patient</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeButton, { backgroundColor: isDark ? '#0a7ea4' : Colors[theme].tint }]}
                  onPress={() => setMode('list')}
                >
                  <Ionicons name="list" size={20} color="#fff" />
                  <Text style={styles.modeButtonText}>Select from List</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Search Mode */}
            {mode === 'search' && (
              <View>
                <TextInput
                  placeholder="Search by name or IP#"
                  style={[styles.searchInput, {
                    backgroundColor: isDark ? '#1e1e1e' : '#f0f0f0',
                    color: textColor,
                  }]}
                  placeholderTextColor={textColor}
                  onChangeText={searchPatients}
                  value={searchText}
                />
                <ScrollView style={{ maxHeight: 300 }}>
                  {filteredPatients.length === 0 ? (
                    <Text style={[styles.noDataText, { color: textColor }]}>
                      No patients found
                    </Text>
                  ) : (
                    filteredPatients.map((p) => (
                      <TouchableOpacity
                        key={p.id}
                        style={[styles.patientRow, { borderBottomColor: Colors[theme].icon }]}
                        onPress={() => handleSelectPatient(p)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.patientName, { color: textColor }]}>
                            {p.firstName} {p.lastName}
                          </Text>
                          <Text style={[styles.patientDetail, { color: textColor, opacity: 0.6 }]}>
                            IP#: {p.ipNumber} • {p.ward}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors[theme].tint} />
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}

            {/* List Mode */}
            {mode === 'list' && (
              <ScrollView style={{ maxHeight: 350 }}>
                {patients.length === 0 ? (
                  <Text style={[styles.noDataText, { color: textColor }]}>
                    No patients registered
                  </Text>
                ) : (
                  patients.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.patientRow, { borderBottomColor: Colors[theme].icon }]}
                      onPress={() => handleSelectPatient(p)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.patientName, { color: textColor }]}>
                          {p.firstName} {p.lastName}
                        </Text>
                        <Text style={[styles.patientDetail, { color: textColor, opacity: 0.6 }]}>
                          IP#: {p.ipNumber} • {p.ward}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={Colors[theme].tint} />
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            )}

            {/* Confirm Modal */}
            <Modal visible={confirmVisible} transparent animationType="fade">
              <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <View style={[styles.confirmCard, { backgroundColor: bgColor }]}>
                  <Text style={[styles.confirmTitle, { color: textColor }]}>Confirm Code Trigger</Text>
                  
                  {selectedPatient && (
                    <View style={[styles.confirmDetails, { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}>
                      <Text style={[styles.confirmLabel, { color: textColor }]}>Code:</Text>
                      <Text style={[styles.confirmValue, { color: Colors[theme].tint }]}>{activeCode}</Text>
                      
                      <Text style={[styles.confirmLabel, { color: textColor, marginTop: 12 }]}>Patient:</Text>
                      <Text style={[styles.confirmValue, { color: textColor }]}>
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </Text>
                      <Text style={[styles.confirmValue, { color: textColor, opacity: 0.7, fontSize: 12 }]}>
                        IP#: {selectedPatient.ipNumber} • Ward: {selectedPatient.ward}
                      </Text>
                    </View>
                  )}

                  <View style={styles.confirmButtons}>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#ef4444' }]}
                      onPress={() => setConfirmVisible(false)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#10b981' }]}
                      onPress={confirmAndTrigger}
                    >
                      <Text style={styles.buttonText}>Trigger</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: Colors[theme].tint }]}
                onPress={() => {
                  setChooserVisible(false);
                  setMode('none');
                  setSearchText('');
                }}
              >
                <Text style={[styles.cancelButtonText, { color: Colors[theme].tint }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* History Modal */}
      <Modal visible={historyVisible} transparent animationType="fade" onRequestClose={() => setHistoryVisible(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalCard, { backgroundColor: bgColor, maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Alert History</Text>
              <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {alertHistory.length === 0 ? (
                <Text style={[styles.noDataText, { color: textColor }]}>
                  No alerts triggered yet
                </Text>
              ) : (
                alertHistory.map((item, idx) => {
                  const code = CODES.find(c => c.code === item.code);
                  return (
                    <View
                      key={idx}
                      style={[styles.historyItem, {
                        borderBottomColor: Colors[theme].icon,
                        backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9'
                      }]}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.historyEmoji}>{code?.emoji}</Text>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={[styles.historyCode, { color: textColor }]}>
                            {code?.label}
                          </Text>
                          <Text style={[styles.historyPatient, { color: textColor, opacity: 0.6 }]}>
                            {item.patient?.firstName} {item.patient?.lastName}
                          </Text>
                          <Text style={[styles.historyTime, { color: textColor, opacity: 0.5 }]}>
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </Text>
                        </View>
                        {item.acknowledged && (
                          <View style={styles.acknowledgedBadge}>
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 64,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyButton: {
    padding: 8,
  },
  codeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  codeCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  codeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  codeLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  codeDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  modeSelect: {
    gap: 12,
    marginBottom: 16,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  modeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  patientName: {
    fontWeight: '600',
    fontSize: 14,
  },
  patientDetail: {
    fontSize: 12,
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
  confirmCard: {
    width: '85%',
    borderRadius: 12,
    padding: 20,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  confirmDetails: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  confirmLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  confirmValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  historyEmoji: {
    fontSize: 24,
  },
  historyCode: {
    fontWeight: '600',
    fontSize: 14,
  },
  historyPatient: {
    fontSize: 12,
    marginTop: 2,
  },
  historyTime: {
    fontSize: 11,
    marginTop: 2,
  },
  acknowledgedBadge: {
    padding: 4,
  },
});
