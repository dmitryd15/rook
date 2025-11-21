type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  ageMode: string;
  sex: string;
  ward: string;
  ipNumber: string;
  diagnosis: string;
  bedNumber: string;
  dateOfAdmission: string; // ISO string
  para?: string; // parity first number
  paraLiving?: string; // parity second number (living)
  gravidity?: string; // G number as string
  gravid?: boolean;
  lmp?: string; // ISO string
  edd?: string; // ISO string
};
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const PATIENTS_KEY = 'patients_list';
const initialForm: Omit<Patient, 'id'> = {
  firstName: '',
  lastName: '',
  age: '',
  ageMode: 'years', // default to years
  sex: '',
  ward: '',
  ipNumber: '',
  diagnosis: '',
  bedNumber: '',
  dateOfAdmission: '',
  para: '',
  paraLiving: '',
  gravidity: '',
  gravid: false,
  lmp: '',
  edd: '',
};



function PatientsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Omit<Patient, 'id'>>(initialForm);
  const [showLMPPicker, setShowLMPPicker] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editPatient, setEditPatient] = useState<any>(null);
  const [showEditLMPPicker, setShowEditLMPPicker] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePatient, setDeletePatient] = useState<any>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Today');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  // Auto-calculate gravidity (G) = Para + Losses + (gravid ? 1 : 0)
  React.useEffect(() => {
    const p = Number((form as any).para || 0);
    const pl = Number((form as any).paraLiving || 0);
    const added = (form as any).gravid ? 1 : 0;
    const calc = p + pl + added;
    // Only set gravidity when user has marked gravid; otherwise clear it
    if ((form as any).gravid) {
      if ((form as any).gravidity !== String(calc)) {
        setForm((prev: any) => ({ ...prev, gravidity: String(calc) }));
      }
    } else {
      if ((form as any).gravidity !== '') {
        setForm((prev: any) => ({ ...prev, gravidity: '' }));
      }
    }
    // only when para/paraLiving/gravid change
  }, [form.para, form.paraLiving, form.gravid]);

  // For editPatient, mirror the same calculation but allow the user to override if desired.
  React.useEffect(() => {
    if (!editPatient) return;
    const p = Number(editPatient.para || 0);
    const pl = Number(editPatient.paraLiving || 0);
    const added = editPatient.gravid ? 1 : 0;
    const calc = p + pl + added;
    // Only set gravidity when editPatient.gravid is true; otherwise clear
    if (editPatient.gravid) {
      if (String(editPatient.gravidity || '') !== String(calc)) {
        setEditPatient((prev: any) => ({ ...prev, gravidity: String(calc) }));
      }
    } else {
      if (String(editPatient.gravidity || '') !== '') {
        setEditPatient((prev: any) => ({ ...prev, gravidity: '' }));
      }
    }
  }, [editPatient?.para, editPatient?.paraLiving, editPatient?.gravid]);
  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    return `${day}/${month}/${year}`;
  };

  // Full-year formatter (useful for EDD display with 4-digit year)
  const formatDateFull = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    return `${day}/${month}/${year}`;
  };

  // Compute gestation (weeks + days) from LMP
  const getGestationFromLMP = (lmpStr?: string) => {
    if (!lmpStr) return null;
    const lmp = new Date(lmpStr);
    const now = new Date();
    // difference in days
    const diffDays = Math.floor((now.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { weeks: 0, days: 0 };
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    return { weeks, days };
  };

  // Compose the concise obstetric summary string requested by the user
  const getObstetricSummary = () => {
    // Only show sensible defaults even when fields are empty
    const p = form.para && form.para.trim() !== '' ? form.para : '0';
    const pl = form.paraLiving && form.paraLiving.trim() !== '' ? form.paraLiving : '0';
    let s = `Para ${p}+${pl}`;
    // Only show gravidity when user has marked gravid (avoid showing G0)
    if (form.gravid) {
      const g = form.gravidity && form.gravidity.trim() !== '' ? form.gravidity : '';
      if (g) s += `, G${g}`;
    }
    // Determine gestation from LMP: show gestation/EDD whenever LMP is provided
    if (form.lmp) {
      const gest = getGestationFromLMP(form.lmp);
      if (gest) {
        s += `; GBD: ${gest.weeks}weeks ${gest.days} days, EDD: ${formatDateFull(form.edd || form.lmp)}`;
      }
    }
    return s;
  };

  // Selection state for patients
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  // Long press to select patient
  const handleLongPressPatient = (id: string) => {
    setSelectedPatients(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  // Export ward rounds for selected patients
  const handleExportWardRounds = async () => {
    setExporting(true);
    try {
      // Fetch all selected patients' ward rounds from AsyncStorage
      const patientWardRounds = [];
      for (const pid of selectedPatients) {
        const patientStr = await AsyncStorage.getItem(`patient_${pid}`);
        if (!patientStr) continue;
        const patient = JSON.parse(patientStr);
        if (!patient.wardRounds || !Array.isArray(patient.wardRounds) || patient.wardRounds.length === 0) continue;
        patientWardRounds.push({
          ...patient,
          wardRounds: patient.wardRounds,
        });
      }
      if (patientWardRounds.length === 0) {
        alert('No ward rounds found for selected patients.');
        setExporting(false);
        return;
      }
      // Use the same PDF format as in View Ward Rounds modal, but ensure each patient is clearly separated
      let html = `<html><head><meta charset="utf-8" />\
        <style>\
          body { font-family: Arial, sans-serif; margin: 24px; color: #222; }\
          h1 { color: #1976d2; font-size: 2em; margin-bottom: 0.2em; }\
          h2 { color: #2196F3; font-size: 1.2em; margin-top: 1.2em; margin-bottom: 0.2em; }\
          .info { margin-bottom: 1em; }\
          .card { border-radius: 12px; border-left: 6px solid #1976d2; background: #f7fafd; margin-bottom: 24px; padding: 18px 18px 12px 18px; }\
          .label { color: #1976d2; font-weight: bold; }\
          .section { margin-top: 10px; }\
          .todo { margin-left: 12px; margin-bottom: 6px; }\
          .patient-separator { border: none; border-top: 3px solid #1976d2; margin: 36px 0 36px 0; }\
          ul, ol { margin: 0 0 0 18px; padding: 0; }\
          li { display: list-item; margin-bottom: 6px; margin-left: 0; }\
        </style>\
      </head><body>`;
      html += `<h1>Ward Round Report</h1>`;
      patientWardRounds.forEach((patient, pidx) => {
        if (pidx > 0) html += '<hr class="patient-separator" />';
        html += `<div class="info">`;
        html += `<div><span class="label">Name:</span> ${patient.firstName} ${patient.lastName}</div>`;
        html += `<div><span class="label">Age:</span> ${patient.age} ${patient.ageMode}</div>`;
        html += `<div><span class="label">Sex:</span> ${patient.sex}</div>`;
        html += `<div><span class="label">Diagnosis:</span> ${patient.diagnosis}</div>`;
        html += `<div><span class="label">Ward:</span> ${patient.ward}</div>`;
        html += `<div><span class="label">Bed Number:</span> ${patient.bedNumber}</div>`;
        html += `<div><span class="label">IP Number:</span> ${patient.ipNumber}</div>`;
        html += `</div>`;
  (patient.wardRounds || []).forEach((wr: any, idx: number) => {
          html += `<div class="card">`;
          html += `<h2>${idx + 1}. Ward Round by ${wr.doctor || 'Unknown'} (${wr.createdAt ? new Date(wr.createdAt).toLocaleString() : ''})</h2>`;
          if (wr.complaints) html += `<div class="section"><span class="label">Complaints:</span> ${wr.complaints}</div>`;
          if (wr.onExamination) html += `<div class="section"><span class="label">On Examination:</span> ${wr.onExamination}</div>`;
          // Format systemicExamination as a bullet list if it contains dash-prefixed lines
          if (wr.systemicExamination) {
            const lines = wr.systemicExamination.split(/\r?\n/).map((l: string) => l.trim()).filter((l: string) => l.length > 0);
            const dashLines = lines.filter((l: string) => /^[-•\u2022]/.test(l));
            if (dashLines.length > 0) {
              html += `<div class="section"><span class="label">Systemic Examination:</span><ul>`;
              dashLines.forEach((item: string) => {
                // Remove the dash/bullet and extra spaces
                html += `<li>${item.replace(/^[-•\u2022]\s*/, '')}</li>`;
              });
              html += `</ul></div>`;
              // If there are non-dash lines, show them above the list
              const nonDashLines = lines.filter((l: string) => !/^[-•\u2022]/.test(l));
              if (nonDashLines.length > 0) {
                html += `<div style="margin-bottom:4px;">${nonDashLines.join('<br/>')}</div>`;
              }
            } else {
              html += `<div class="section"><span class="label">Systemic Examination:</span> ${wr.systemicExamination}</div>`;
            }
          }
          if (wr.vitalBP || wr.vitalSPO2 || wr.vitalRR || wr.vitalPulse || wr.vitalTemp) {
            html += `<div class="section"><span class="label">Vitals:</span> ${[wr.vitalBP ? `BP: ${wr.vitalBP} mmHg` : '', wr.vitalSPO2 ? `SPO2: ${wr.vitalSPO2}%` : '', wr.vitalRR ? `RR: ${wr.vitalRR}/min` : '', wr.vitalPulse ? `Pulse: ${wr.vitalPulse}/min` : '', wr.vitalTemp ? `Temp: ${wr.vitalTemp}°C` : ''].filter(Boolean).join(' | ')}</div>`;
          }
          html += `<div class="section"><span class="label">Main Notes:</span> ${wr.text || ''}</div>`;
          if (wr.todos && wr.todos.length > 0) {
            html += `<div class="section"><span class="label">To Dos:</span><ul>`;
                wr.todos.forEach((todo: any) => {
              html += `<li class="todo">${todo.title} (${todo.type}) - ${todo.details || ''} ${todo.completed ? '✅' : '⏳'}</li>`;
            });
            html += `</ul></div>`;
          }
          html += `</div>`;
        });
      });
      html += `</body></html>`;

      // Convert the constructed HTML to a plain-text representation
      const rawText = html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|h1|h2|li|tr|td)>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim();

      // Use centralized exporter (converts text -> HTML -> PDF -> share)
      await exportComprehensiveHistory(rawText, 'WardRoundReport');
    } catch (e) {
      alert('Export failed: ' + (e && (e as any).message ? (e as any).message : e));
    }
    setExporting(false);
    setSelectedPatients([]);
  };

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PATIENTS_KEY);
        if (stored) setPatients(JSON.parse(stored));
      } catch {}
    })();
  }, []);

  const handleChange = (field: string, value: any) => {
    // Only allow digits for age and ipNumber fields
    if (["age","ipNumber"].includes(field)) {
      if (!/^\d*$/.test(value)) return;
    }
    setForm({ ...form, [field]: value });
  };

  const handleSex = (sex: string) => setForm({ ...form, sex });

  const [formError, setFormError] = useState('');
  const handleSave = async () => {
    // All fields required
  const requiredFields: (keyof Omit<Patient, 'id'>)[] = ['firstName', 'lastName', 'age', 'ageMode', 'sex', 'ward', 'ipNumber', 'diagnosis', 'bedNumber'];
    for (const field of requiredFields) {
      const value = form[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
    setFormError('All fields are required.');
        return;
      }
    }
    setFormError('');
  // Use the user's gravid selection (prefilled when LMP chosen) when saving
  const newPatient: Patient = { ...form, id: Date.now().toString(), gravid: !!form.gravid };
    const updated = [...patients, newPatient];
    setPatients(updated);
    // Save to patients_list
    await AsyncStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
    // Save under patient_[id]
    await AsyncStorage.setItem(`patient_${newPatient.id}`, JSON.stringify(newPatient));
    setForm(initialForm);
    setModalVisible(false);
  };

  const [search, setSearch] = useState('');
  // Helper to check if a date is today/yesterday
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(date, yesterday);
  };

  // Filter patients by search and selectedFilter
  const filteredPatients = patients.filter(p => {
    // Search filter
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      if (
        !(p.firstName && p.firstName.toLowerCase().includes(s)) &&
        !(p.lastName && p.lastName.toLowerCase().includes(s)) &&
        !(p.ward && p.ward.toLowerCase().includes(s)) &&
        !(p.ipNumber && p.ipNumber.toLowerCase().includes(s))
      ) {
        return false;
      }
    }
    // Date filter
    if (selectedFilter === 'Today') {
      if (!p.id) return false;
      const d = new Date(Number(p.id));
      return isSameDay(d, new Date());
    } else if (selectedFilter === 'Yesterday') {
      if (!p.id) return false;
      const d = new Date(Number(p.id));
      return isYesterday(d);
    } else if (selectedFilter === 'Custom Range' && customStart && customEnd) {
      if (!p.id) return false;
      const d = new Date(Number(p.id));
      return d >= customStart && d <= customEnd;
    }
    return true;
  });
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#181a20' : 'white' }}
      contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Export Ward Rounds Button (appears when patients are selected) - now at the top */}
      {selectedPatients.length > 0 && (
        <TouchableOpacity
          style={{
            backgroundColor: isDark ? '#2196F3' : '#1976d2',
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 32,
            alignItems: 'center',
            alignSelf: 'center',
            marginVertical: 18,
            flexDirection: 'row',
            gap: 10,
            elevation: 4,
            zIndex: 10,
          }}
          onPress={handleExportWardRounds}
          disabled={exporting}
        >
          <Ionicons name="download-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
            {exporting ? 'Exporting...' : 'Export Ward Rounds'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isDark ? '#2196F3' : '#0a7ea4',
            marginTop: 32 * 2, // 2cm ~ 64px
            width: '50%',
            alignSelf: 'flex-start',
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Register Patient</Text>
      </TouchableOpacity>

      {/* Modern Search Bar with Filter Button */}
      <View style={[styles.searchBar, { backgroundColor: isDark ? '#222' : '#f2f2f2', borderColor: isDark ? '#444' : '#ccc' }]}> 
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#fff' : '#111' }]}
          placeholder="Search patients..."
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={22} color={isDark ? '#2196F3' : '#0a7ea4'} />
        </TouchableOpacity>
      </View>

      {/* Active Filter Chip */}
      {selectedFilter && selectedFilter !== '' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 12, marginTop: -8 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#333' : '#e0f2ff',
            borderRadius: 16,
            paddingVertical: 6,
            paddingHorizontal: 14,
            marginRight: 8,
          }}>
            <Text style={{ color: isDark ? '#fff' : '#0a7ea4', fontWeight: 'bold', fontSize: 15 }}>
              {selectedFilter === 'Custom Range' && customStart && customEnd
                ? `${customStart.toLocaleDateString()} - ${customEnd.toLocaleDateString()}`
                : selectedFilter}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedFilter('');
                setCustomStart(null);
                setCustomEnd(null);
              }}
              style={{ marginLeft: 8 }}
              accessibilityLabel="Remove filter"
            >
              <Ionicons name="close-circle" size={18} color={isDark ? '#fff' : '#0a7ea4'} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Patient Cards List */}
      <View style={{ flex: 1 }}>
        {filteredPatients.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <Ionicons name="person-outline" size={48} color={isDark ? '#555' : '#bbb'} />
            <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 18, marginTop: 8 }}>No patients found.</Text>
          </View>
        ) : (
          filteredPatients.map((p, idx) => {
            const isSelected = selectedPatients.includes(p.id);
            return (
              <TouchableOpacity
                key={p.id || idx}
                onLongPress={() => handleLongPressPatient(p.id)}
                activeOpacity={0.85}
                style={{
                  backgroundColor: isSelected ? (isDark ? '#0d47a1' : '#bbdefb') : (isDark ? '#23272e' : '#fff'),
                  borderRadius: 18,
                  padding: 20,
                  marginBottom: 18,
                  shadowColor: isDark ? '#000' : '#0a7ea4',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 10,
                  elevation: 4,
                  borderWidth: 2,
                  borderColor: isSelected ? (isDark ? '#fff' : '#1976d2') : (isDark ? '#222' : '#e3f2fd'),
                  position: 'relative',
                }}
              >
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={28}
                    color={isDark ? '#fff' : '#1976d2'}
                    style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
                  />
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{
                    backgroundColor: isDark ? '#2196F3' : '#e3f2fd',
                    borderRadius: 50,
                    padding: 8,
                    marginRight: 14,
                  }}>
                    <Ionicons name="person" size={28} color={isDark ? '#fff' : '#2196F3'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#0a7ea4', marginBottom: 2 }}>{p.firstName} {p.lastName}</Text>
                    <Text style={{ color: isDark ? '#aaa' : '#333', fontSize: 14 }}>{p.sex} • {p.age} {p.ageMode}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                  <Ionicons name="bed" size={18} color={isDark ? '#90caf9' : '#1976d2'} style={{ marginRight: 6 }} />
                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 15, fontWeight: '500' }}>Ward: </Text>
                  <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 15 }}>{p.ward}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                  <Ionicons name="document-text-outline" size={18} color={isDark ? '#90caf9' : '#1976d2'} style={{ marginRight: 6 }} />
                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 15, fontWeight: '500' }}>IP Number: </Text>
                  <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 15 }}>{p.ipNumber}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                  <Ionicons name="medkit-outline" size={18} color={isDark ? '#90caf9' : '#1976d2'} style={{ marginRight: 6 }} />
                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 15, fontWeight: '500' }}>Diagnosis: </Text>
                  <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 15 }}>{p.diagnosis}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                  <Ionicons name="bed-outline" size={18} color={isDark ? '#90caf9' : '#1976d2'} style={{ marginRight: 6 }} />
                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 15, fontWeight: '500' }}>Bed Number: </Text>
                  <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 15 }}>{p.bedNumber}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                  <Ionicons name="calendar-outline" size={18} color={isDark ? '#90caf9' : '#1976d2'} style={{ marginRight: 6 }} />
                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: '500', fontSize: 15 }}>Date of Admission: </Text>
                  <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 15 }}>
                    {p.dateOfAdmission ? `${formatDate(p.dateOfAdmission)} (${Math.max(1, Math.ceil((new Date().getTime() - new Date(p.dateOfAdmission).getTime()) / (1000 * 60 * 60 * 24)))} day(s) in ward)` : 'N/A'}
                  </Text>
                </View>
                {/* Obstetric Information */}
                {(() => {
                  // Helper to format date
                  const obsFormatDate = (dateStr: string) => {
                    if (!dateStr) return '';
                    const d = new Date(dateStr);
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = String(d.getFullYear());
                    return `${day}/${month}/${year}`;
                  };

                  // Helper to compute gestation from LMP
                  const getGestationFromLMP = (lmpStr?: string) => {
                    if (!lmpStr) return null;
                    const lmpDate = new Date(lmpStr);
                    const now = new Date();
                    const diffDays = Math.floor((now.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (diffDays < 0) return { weeks: 0, days: 0 };
                    const weeks = Math.floor(diffDays / 7);
                    const days = diffDays % 7;
                    return { weeks, days };
                  };

                  // Show obstetric information if any field is populated
                  const hasObstetricData = p.para || p.paraLiving || p.gravidity || p.lmp || p.edd;
                  if (!hasObstetricData) return null;

                  return (
                    <>
                      {p.lmp && (
                        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                          <Ionicons name="calendar-outline" size={18} color={isDark ? '#4db6ac' : '#00897b'} style={{ marginRight: 6 }} />
                          <Text style={{ color: isDark ? '#4db6ac' : '#00897b', fontSize: 15, fontWeight: '500' }}>LMP: </Text>
                          <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 15 }}>{obsFormatDate(p.lmp)}</Text>
                        </View>
                      )}
                      {((p.para || p.paraLiving) || (p.gravidity && p.gravid)) && (
                        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                          <Ionicons name="female" size={18} color={isDark ? '#f48fb1' : '#c2185b'} style={{ marginRight: 6 }} />
                          <Text style={{ color: isDark ? '#f48fb1' : '#c2185b', fontSize: 15, fontWeight: '500' }}>Parity: </Text>
                          <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 15 }}>{p.para || '0'}+{p.paraLiving || '0'}{p.gravidity && p.gravid ? `; G${p.gravidity}` : ''}</Text>
                        </View>
                      )}
                      {((() => {
                        const gest = getGestationFromLMP(p.lmp);
                        return gest || p.edd;
                      })()) && (
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 2 }}>
                          {(() => {
                            const gest = getGestationFromLMP(p.lmp);
                            if (!gest) return null;
                            return (
                              <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Ionicons name="time-outline" size={16} color={isDark ? '#64b5f6' : '#1976d2'} style={{ marginRight: 4 }} />
                                  <Text style={{ color: isDark ? '#64b5f6' : '#1976d2', fontSize: 13, fontWeight: '500' }}>GBD: </Text>
                                  <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 13 }}>{gest.weeks}w {gest.days}d</Text>
                                </View>
                              </View>
                            );
                          })()}
                          {p.edd && (
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="calendar-outline" size={16} color={isDark ? '#4db6ac' : '#00897b'} style={{ marginRight: 4 }} />
                                <Text style={{ color: isDark ? '#4db6ac' : '#00897b', fontSize: 13, fontWeight: '500' }}>EDD: </Text>
                                <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 13 }}>{obsFormatDate(p.edd)}</Text>
                              </View>
                            </View>
                          )}
                        </View>
                      )}
                    </>
                  );
                })()}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 }}>
                  {/* Only show action buttons if not in selection mode */}
                  {selectedPatients.length === 0 && (
                    <>
                      <TouchableOpacity
                        style={{
                          backgroundColor: isDark ? '#1976d2' : '#e3f2fd',
                          paddingVertical: 7,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          marginRight: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          const paramsSafe: any = { ...p };
                          // router params expect strings/numbers; ensure boolean is serialized
                          if (typeof paramsSafe.gravid === 'boolean') paramsSafe.gravid = paramsSafe.gravid ? 'true' : 'false';
                          // push as params
                          router.push({
                            pathname: '/patient-profile',
                            params: paramsSafe,
                          });
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="eye-outline" size={18} color={isDark ? '#fff' : '#1976d2'} style={{ marginRight: 5 }} />
                        <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 15 }}>View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: isDark ? '#388e3c' : '#e8f5e9',
                          paddingVertical: 7,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          marginRight: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          setEditPatient(p);
                          setEditModalVisible(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="create-outline" size={18} color={isDark ? '#fff' : '#388e3c'} style={{ marginRight: 5 }} />
                        <Text style={{ color: isDark ? '#fff' : '#388e3c', fontWeight: 'bold', fontSize: 15 }}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: isDark ? '#d32f2f' : '#ffebee',
                          paddingVertical: 7,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          setDeletePatient(p);
                          setDeleteModalVisible(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="trash-outline" size={18} color={isDark ? '#fff' : '#d32f2f'} style={{ marginRight: 5 }} />
                        <Text style={{ color: isDark ? '#fff' : '#d32f2f', fontWeight: 'bold', fontSize: 15 }}>Delete</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 300, backgroundColor: isDark ? '#222' : '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 6 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: isDark ? '#fff' : '#222' }}>Filter By</Text>
            {['Today', 'Yesterday', 'Custom Range'].map(option => (
              <TouchableOpacity
                key={option}
                style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 8, backgroundColor: selectedFilter === option ? (isDark ? '#333' : '#eee') : 'transparent' }}
                onPress={() => {
                  setSelectedFilter(option);
                  if (option === 'Custom Range') {
                    // Don't close modal, show calendar pickers
                  } else {
                    setFilterModalVisible(false);
                  }
                }}
              >
                <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: selectedFilter === option ? 'bold' : 'normal' }}>{option}</Text>
              </TouchableOpacity>
            ))}
            {selectedFilter === 'Custom Range' && (
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={{ marginBottom: 10, padding: 10, backgroundColor: isDark ? '#333' : '#eee', borderRadius: 8 }}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={{ color: isDark ? '#fff' : '#222' }}>
                    {customStart ? `Start: ${customStart.toLocaleDateString()}` : 'Select Start Date'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginBottom: 10, padding: 10, backgroundColor: isDark ? '#333' : '#eee', borderRadius: 8 }}
                  onPress={() => setShowEndPicker(true)}
                  disabled={!customStart}
                >
                  <Text style={{ color: isDark ? '#fff' : '#222' }}>
                    {customEnd ? `End: ${customEnd.toLocaleDateString()}` : 'Select End Date'}
                  </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <TouchableOpacity
                    style={{ padding: 10, borderRadius: 8, backgroundColor: isDark ? '#2196F3' : '#0a7ea4', marginRight: 8 }}
                    onPress={() => {
                      setFilterModalVisible(false);
                      // TODO: Apply custom range filter
                    }}
                    disabled={!customStart || !customEnd}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Apply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 10, borderRadius: 8, backgroundColor: isDark ? '#444' : '#ccc' }}
                    onPress={() => {
                      setCustomStart(null);
                      setCustomEnd(null);
                      setFilterModalVisible(false);
                    }}
                  >
                    <Text style={{ color: isDark ? '#fff' : '#222' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
        {/* DateTimePickers for custom range */}
        <DateTimePickerModal
          isVisible={showStartPicker}
          mode="date"
          onConfirm={date => {
            setShowStartPicker(false);
            if (date) {
              setCustomStart(date);
              if (customEnd && date > customEnd) setCustomEnd(null);
            }
          }}
          onCancel={() => setShowStartPicker(false)}
          maximumDate={(() => { const today = new Date(); today.setHours(0,0,0,0); return (customEnd && customEnd < today) ? customEnd : today; })()}
          date={customStart || new Date()}
          themeVariant={isDark ? 'dark' : 'light'}
        />
        <DateTimePickerModal
          isVisible={showEndPicker}
          mode="date"
          onConfirm={date => {
            setShowEndPicker(false);
            if (date) setCustomEnd(date);
          }}
          onCancel={() => setShowEndPicker(false)}
          minimumDate={customStart || undefined}
          maximumDate={(() => { const today = new Date(); today.setHours(0,0,0,0); return today; })()}
          date={customEnd || customStart || new Date()}
          themeVariant={isDark ? 'dark' : 'light'}
        />
      </Modal>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#111' }]}>Register Patient</Text>
              <TextInput
                style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                placeholder="First Name"
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                value={form.firstName}
                onChangeText={v => handleChange('firstName', v)}
              />
              <TextInput
                style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                placeholder="Last Name"
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                value={form.lastName}
                onChangeText={v => handleChange('lastName', v)}
              />
              <View style={[styles.ageRow, { alignItems: 'center' }]}> 
                <TextInput
                  style={[styles.input, styles.ageInput, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', flex: 2 }]}
                  placeholder="Age"
                  placeholderTextColor={isDark ? '#aaa' : '#888'}
                  value={form.age}
                  onChangeText={v => handleChange('age', v.slice(0,3))}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <View style={[styles.dropdownContainer, { borderColor: isDark ? '#444' : '#ccc', backgroundColor: isDark ? '#222' : '#fff', justifyContent: 'center', height: 40 }]}> 
                  <Picker
                    selectedValue={form.ageMode}
                    onValueChange={v => handleChange('ageMode', v)}
                    style={{ color: isDark ? '#fff' : '#111', width: 110, height: 40, backgroundColor: 'transparent', marginTop: Platform.OS === 'android' ? -8 : 0 }}
                    dropdownIconColor={isDark ? '#fff' : '#111'}
                  >
                    <Picker.Item label="Days" value="days" />
                    <Picker.Item label="Weeks" value="weeks" />
                    <Picker.Item label="Months" value="months" />
                    <Picker.Item label="Years" value="years" />
                  </Picker>
                </View>
              </View>
              <View style={styles.sexRow}>
                <TouchableOpacity
                  style={[styles.sexButton, form.sex === 'Male' && styles.sexButtonSelected]}
                  onPress={() => handleSex('Male')}
                >
                  <Text style={[styles.sexText, form.sex === 'Male' && styles.sexTextSelected]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sexButton, form.sex === 'Female' && styles.sexButtonSelected]}
                  onPress={() => handleSex('Female')}
                >
                  <Text style={[styles.sexText, form.sex === 'Female' && styles.sexTextSelected]}>Female</Text>
                </TouchableOpacity>
              </View>
              {/* Obstetric fields for females (LMP asked first when age between 12 and 50 years) */}
              {form.sex === 'Female' && form.ageMode === 'years' && Number(form.age) >= 12 && Number(form.age) <= 50 && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', marginBottom: 6 }}>Obstetric</Text>
                  <Text style={{ color: isDark ? '#bbb' : '#555', fontSize: 12, marginBottom: 6 }}>Note: the '+' value indicates pregnancy losses before 28 weeks</Text>

                  {/* LMP picker appears first (only shown for ages 12-50) */}
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: isDark ? '#444' : '#ccc',
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 8,
                      backgroundColor: isDark ? '#23272e' : '#f7faff',
                    }}
                    onPress={() => setShowLMPPicker(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold' }}>
                      {form.lmp ? `LMP: ${formatDate(form.lmp)}` : 'Select LMP (Last Menstrual Period)'}
                    </Text>
                  </TouchableOpacity>
                    {form.edd ? (
                    <Text style={{ color: isDark ? '#fff' : '#222', marginBottom: 8 }}>Estimated Due Date: {formatDate(form.edd)}</Text>
                  ) : null}

                  {/* Parity inputs (G shown only when gravid is true) */}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                      style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', flex: 1 }]}
                      placeholder="Para"
                      placeholderTextColor={isDark ? '#aaa' : '#888'}
                      value={form.para}
                      onChangeText={v => handleChange('para', v.replace(/[^0-9]/g, '').slice(0,2))}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <TextInput
                      style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', flex: 1 }]}
                      placeholder="+ (loss <28w)"
                      placeholderTextColor={isDark ? '#aaa' : '#888'}
                      value={form.paraLiving}
                      onChangeText={v => handleChange('paraLiving', v.replace(/[^0-9]/g, '').slice(0,2))}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    {/* Gravidity input will appear only when gravid is true */}
                    {form.gravid && (
                      <TextInput
                        style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', width: 80 }]}
                        placeholder="G"
                        placeholderTextColor={isDark ? '#aaa' : '#888'}
                        value={form.gravidity}
                        onChangeText={v => handleChange('gravidity', v.replace(/[^0-9]/g, '').slice(0,2))}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                    )}
                  </View>

                  {/* Allow user to confirm/override gravid. If LMP was just set, we prefill gravid=true above, but user can change it. */}
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                    <TouchableOpacity
                      style={[styles.sexButton, !form.gravid ? styles.sexButtonSelected : {}]}
                      onPress={() => handleChange('gravid', false)}
                    >
                      <Text style={[styles.sexText, !form.gravid && styles.sexTextSelected]}>Not Gravid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.sexButton, form.gravid ? styles.sexButtonSelected : {}]}
                      onPress={() => handleChange('gravid', true)}
                    >
                      <Text style={[styles.sexText, form.gravid && styles.sexTextSelected]}>Gravid</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Concise obstetric summary as requested (Para X+Y, Gx; GBD: Wweeks D days, EDD: dd/mm/yyyy) */}
                  <Text style={{ color: isDark ? '#fff' : '#111', marginBottom: 8, fontWeight: '600' }}>{getObstetricSummary()}</Text>
                </View>
              )}
              <TextInput
                style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                placeholder="Ward"
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                value={form.ward}
                onChangeText={v => handleChange('ward', v)}
              />
              <TextInput
                style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                placeholder="IP Number (digits only)"
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                value={form.ipNumber}
                onChangeText={v => handleChange('ipNumber', v.slice(0,10))}
                keyboardType="numeric"
                maxLength={10}
              />
                <TextInput
                  style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                  placeholder="Diagnosis"
                  placeholderTextColor={isDark ? '#aaa' : '#888'}
                  value={form.diagnosis}
                  onChangeText={v => handleChange('diagnosis', v)}
                  autoCapitalize="sentences"
                  autoCorrect
                />
                <TextInput
                  style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                  placeholder="Bed Number"
                  placeholderTextColor={isDark ? '#aaa' : '#888'}
                  value={form.bedNumber}
                  onChangeText={v => handleChange('bedNumber', v.replace(/[^0-9]/g, '').slice(0,4))}
                  keyboardType="numeric"
                  maxLength={4}
                />
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: isDark ? '#444' : '#ccc',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    backgroundColor: isDark ? '#23272e' : '#f7faff',
                  }}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold' }}>
                    {form.dateOfAdmission ? `Date of Admission: ${formatDate(form.dateOfAdmission)}` : 'Select Date of Admission'}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="date"
                  onConfirm={date => {
                    setShowDatePicker(false);
                    setForm({ ...form, dateOfAdmission: date.toISOString() });
                  }}
                  onCancel={() => setShowDatePicker(false)}
                  date={form.dateOfAdmission ? new Date(form.dateOfAdmission) : new Date()}
                  maximumDate={new Date()}
                  themeVariant={isDark ? 'dark' : 'light'}
                />
                  {/* LMP Date Picker for registration */}
                  <DateTimePickerModal
                    isVisible={showLMPPicker}
                    mode="date"
                    onConfirm={date => {
                      setShowLMPPicker(false);
                      const lmpIso = date.toISOString();
                      const eddDate = new Date(date.getTime() + 280 * 24 * 60 * 60 * 1000);
                      // Do not prefill gravid when LMP is chosen; user should confirm gravid manually
                      setForm({ ...form, lmp: lmpIso, edd: eddDate.toISOString() });
                    }}
                    onCancel={() => setShowLMPPicker(false)}
                    date={form.lmp ? new Date(form.lmp) : new Date()}
                    maximumDate={new Date()}
                    themeVariant={isDark ? 'dark' : 'light'}
                  />
              {formError ? (
                <Text style={{ color: '#d32f2f', marginBottom: 8, fontWeight: 'bold', textAlign: 'center' }}>{formError}</Text>
              ) : null}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: isDark ? '#2196F3' : '#0a7ea4', marginTop: 16 }]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#888', marginTop: 8 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#111' }]}>Edit Patient</Text>
              {editPatient && (
                <>
                  <TextInput
                    style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                    placeholder="First Name"
                    placeholderTextColor={isDark ? '#aaa' : '#888'}
                    value={editPatient.firstName}
                    onChangeText={v => setEditPatient({ ...editPatient, firstName: v })}
                  />
                  <TextInput
                    style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                    placeholder="Last Name"
                    placeholderTextColor={isDark ? '#aaa' : '#888'}
                    value={editPatient.lastName}
                    onChangeText={v => setEditPatient({ ...editPatient, lastName: v })}
                  />
                  <View style={[styles.ageRow, { alignItems: 'center' }]}> 
                    <TextInput
                      style={[styles.input, styles.ageInput, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', flex: 2 }]}
                      placeholder="Age"
                      placeholderTextColor={isDark ? '#aaa' : '#888'}
                      value={editPatient.age}
                      onChangeText={v => setEditPatient({ ...editPatient, age: v.replace(/[^0-9]/g, '').slice(0,3) })}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                    <View style={[styles.dropdownContainer, { borderColor: isDark ? '#444' : '#ccc', backgroundColor: isDark ? '#222' : '#fff', justifyContent: 'center', height: 40 }]}> 
                      <Picker
                        selectedValue={editPatient.ageMode}
                        onValueChange={v => setEditPatient({ ...editPatient, ageMode: v })}
                        style={{ color: isDark ? '#fff' : '#111', width: 110, height: 40, backgroundColor: 'transparent', marginTop: Platform.OS === 'android' ? -8 : 0 }}
                        dropdownIconColor={isDark ? '#fff' : '#111'}
                      >
                        <Picker.Item label="Days" value="days" />
                        <Picker.Item label="Weeks" value="weeks" />
                        <Picker.Item label="Months" value="months" />
                        <Picker.Item label="Years" value="years" />
                      </Picker>
                    </View>
                  </View>
                  <View style={styles.sexRow}>
                    <TouchableOpacity
                      style={[styles.sexButton, editPatient.sex === 'Male' && styles.sexButtonSelected]}
                      onPress={() => setEditPatient({ ...editPatient, sex: 'Male' })}
                    >
                      <Text style={[styles.sexText, editPatient.sex === 'Male' && styles.sexTextSelected]}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.sexButton, editPatient.sex === 'Female' && styles.sexButtonSelected]}
                      onPress={() => setEditPatient({ ...editPatient, sex: 'Female' })}
                    >
                      <Text style={[styles.sexText, editPatient.sex === 'Female' && styles.sexTextSelected]}>Female</Text>
                    </TouchableOpacity>
                  </View>
                  {/* Obstetric fields for females in edit modal (LMP asked first when age between 12 and 50 years) */}
                  {editPatient.sex === 'Female' && editPatient.ageMode === 'years' && Number(editPatient.age) >= 12 && Number(editPatient.age) <= 50 && (
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', marginBottom: 6 }}>Obstetric</Text>
                      <Text style={{ color: isDark ? '#bbb' : '#555', fontSize: 12, marginBottom: 6 }}>Note: the '+' value indicates pregnancy losses before 28 weeks</Text>

                      {/* LMP picker first */}
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          borderColor: isDark ? '#444' : '#ccc',
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 8,
                          backgroundColor: isDark ? '#23272e' : '#f7faff',
                        }}
                        onPress={() => setShowEditLMPPicker(true)}
                        activeOpacity={0.8}
                      >
                        <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold' }}>
                          {editPatient.lmp ? `LMP: ${formatDate(editPatient.lmp)}` : 'Select LMP (Last Menstrual Period)'}
                        </Text>
                      </TouchableOpacity>
                      {editPatient.edd ? (
                        <Text style={{ color: isDark ? '#fff' : '#222', marginBottom: 8 }}>Estimated Due Date: {formatDate(editPatient.edd)}</Text>
                      ) : null}

                      {/* Parity inputs (G shown only when gravid is true) */}
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TextInput
                          style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', flex: 1 }]}
                          placeholder="Para"
                          placeholderTextColor={isDark ? '#aaa' : '#888'}
                          value={String(editPatient.para || '')}
                          onChangeText={v => setEditPatient({ ...editPatient, para: v.replace(/[^0-9]/g, '').slice(0,2) })}
                          keyboardType="numeric"
                          maxLength={2}
                        />
                        <TextInput
                          style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', flex: 1 }]}
                          placeholder="+ (loss <28w)"
                          placeholderTextColor={isDark ? '#aaa' : '#888'}
                          value={String(editPatient.paraLiving || '')}
                          onChangeText={v => setEditPatient({ ...editPatient, paraLiving: v.replace(/[^0-9]/g, '').slice(0,2) })}
                          keyboardType="numeric"
                          maxLength={2}
                        />
                        {/* Gravidity input will appear only when gravid is true */}
                        {editPatient.gravid && (
                          <TextInput
                            style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', width: 80 }]}
                            placeholder="G"
                            placeholderTextColor={isDark ? '#aaa' : '#888'}
                            value={String(editPatient.gravidity || '')}
                            onChangeText={v => setEditPatient({ ...editPatient, gravidity: v.replace(/[^0-9]/g, '').slice(0,2) })}
                            keyboardType="numeric"
                            maxLength={2}
                          />
                        )}
                      </View>

                      {/* Allow user to confirm/override gravid in edit modal */}
                      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                        <TouchableOpacity
                          style={[styles.sexButton, !editPatient.gravid ? styles.sexButtonSelected : {}]}
                          onPress={() => setEditPatient({ ...editPatient, gravid: false })}
                        >
                          <Text style={[styles.sexText, !editPatient.gravid && styles.sexTextSelected]}>Not Gravid</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.sexButton, editPatient.gravid ? styles.sexButtonSelected : {}]}
                          onPress={() => setEditPatient({ ...editPatient, gravid: true })}
                        >
                          <Text style={[styles.sexText, editPatient.gravid && styles.sexTextSelected]}>Gravid</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Concise obstetric summary */}
                      <Text style={{ color: isDark ? '#fff' : '#111', marginBottom: 8, fontWeight: '600' }}>{getObstetricSummary()}</Text>
                    </View>
                  )}
                  <TextInput
                    style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                    placeholder="Ward"
                    placeholderTextColor={isDark ? '#aaa' : '#888'}
                    value={editPatient.ward}
                    onChangeText={v => setEditPatient({ ...editPatient, ward: v })}
                  />
                  <TextInput
                    style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                    placeholder="IP Number (digits only)"
                    placeholderTextColor={isDark ? '#aaa' : '#888'}
                    value={editPatient.ipNumber}
                    onChangeText={v => setEditPatient({ ...editPatient, ipNumber: v.replace(/[^0-9]/g, '').slice(0,10) })}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                    <TextInput
                      style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                      placeholder="Diagnosis"
                      placeholderTextColor={isDark ? '#aaa' : '#888'}
                      value={editPatient.diagnosis}
                      onChangeText={v => setEditPatient({ ...editPatient, diagnosis: v })}
                      autoCapitalize="sentences"
                      autoCorrect
                    />
                    <TextInput
                      style={[styles.input, { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc' }]}
                      placeholder="Bed Number"
                      placeholderTextColor={isDark ? '#aaa' : '#888'}
                      value={editPatient.bedNumber}
                      onChangeText={v => setEditPatient({ ...editPatient, bedNumber: v.replace(/[^0-9]/g, '').slice(0,4) })}
                      keyboardType="numeric"
                      maxLength={4}
                    />
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: isDark ? '#444' : '#ccc',
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 12,
                      backgroundColor: isDark ? '#23272e' : '#f7faff',
                    }}
                    onPress={() => setShowEditDatePicker(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold' }}>
                      {editPatient.dateOfAdmission ? `Date of Admission: ${formatDate(editPatient.dateOfAdmission)}` : 'Select Date of Admission'}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showEditDatePicker}
                    mode="date"
                    onConfirm={date => {
                      setShowEditDatePicker(false);
                      setEditPatient({ ...editPatient, dateOfAdmission: date.toISOString() });
                    }}
                    onCancel={() => setShowEditDatePicker(false)}
                    date={editPatient.dateOfAdmission ? new Date(editPatient.dateOfAdmission) : new Date()}
                    maximumDate={new Date()}
                    themeVariant={isDark ? 'dark' : 'light'}
                  />
                  {/* Edit LMP Date Picker */}
                  <DateTimePickerModal
                    isVisible={showEditLMPPicker}
                    mode="date"
                    onConfirm={date => {
                      setShowEditLMPPicker(false);
                      const lmpIso = date.toISOString();
                      const eddDate = new Date(date.getTime() + 280 * 24 * 60 * 60 * 1000);
                      // Do not prefill gravid when LMP is selected; user should confirm gravid manually
                      setEditPatient({ ...editPatient, lmp: lmpIso, edd: eddDate.toISOString() });
                    }}
                    onCancel={() => setShowEditLMPPicker(false)}
                    date={editPatient.lmp ? new Date(editPatient.lmp) : new Date()}
                    maximumDate={new Date()}
                    themeVariant={isDark ? 'dark' : 'light'}
                  />
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: isDark ? '#388e3c' : '#388e3c', marginTop: 16 }]}
                    onPress={async () => {
                      // Save edited patient (ensure gravid inferred from LMP)
                      const updated = patients.map(pt => {
                        if (pt.id !== editPatient.id) return pt;
                        const computedGravid = !!editPatient.lmp && new Date(editPatient.lmp).getTime() <= Date.now();
                        return { ...editPatient, gravid: computedGravid };
                      });
                      setPatients(updated);
                      await AsyncStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
                      setEditModalVisible(false);
                      setEditPatient(null);
                    }}
                  >
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#888', marginTop: 8 }]}
                    onPress={() => {
                      setEditModalVisible(false);
                      setEditPatient(null);
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { justifyContent: 'center', alignItems: 'center', padding: 28, maxWidth: 340 }]}> 
            <Ionicons name="warning-outline" size={48} color={isDark ? '#ffb4b4' : '#d32f2f'} style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#d32f2f', marginBottom: 10, textAlign: 'center' }}>Delete Patient?</Text>
            <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
              Are you sure you want to delete this patient? This action cannot be undone.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                style={{ backgroundColor: isDark ? '#d32f2f' : '#d32f2f', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, marginRight: 12 }}
                onPress={async () => {
                  if (deletePatient) {
                    const updated = patients.filter(pt => pt.id !== deletePatient.id);
                    setPatients(updated);
                    await AsyncStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
                  }
                  setDeleteModalVisible(false);
                  setDeletePatient(null);
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: isDark ? '#444' : '#ccc', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 }}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setDeletePatient(null);
                }}
              >
                <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

export default PatientsScreen;

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  filterButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#222',
    borderRadius: 16,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  ageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ageInput: {
    marginRight: 8,
  },
  dropdownContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    height: 40,
    minWidth: 90,
    marginLeft: 0,
    paddingHorizontal: 4,
  },
  sexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sexButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  sexButtonSelected: {
    backgroundColor: '#2196F3',
  },
  sexText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  sexTextSelected: {
    color: '#fff',
  },
});
