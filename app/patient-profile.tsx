import { useTheme } from '@/context/ThemeContext';
import { exportComprehensiveHistory } from '@/utils/pdfExport';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Modal, PanResponder, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { WebView } from 'react-native-webview';

// Helper components for Comprehensive History
function ComprehensiveHistoryInput({ label, value, onChangeText, isDark, readOnly = false }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: '600', marginBottom: 4, fontSize: 13 }}>{label}</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 10,
          fontSize: 14,
          color: isDark ? '#fff' : '#111',
          borderColor: isDark ? '#2196F3' : '#0a7ea4',
          backgroundColor: readOnly ? (isDark ? '#0a0e12' : '#e8e8e8') : (isDark ? '#181a20' : '#f9f9f9'),
        }}
        value={value}
        onChangeText={readOnly ? undefined : onChangeText}
        placeholderTextColor={isDark ? '#999' : '#999'}
        editable={!readOnly}
      />
    </View>
  );
}

function ComprehensiveHistoryTextArea({ value, onChangeText, isDark, placeholder = '', readOnly = false }: any) {
  // Helper function to convert number to Roman numeral
  const toRoman = (num: number): string => {
    const romanMap = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];
    
    let result = '';
    let remaining = num;
    for (const { value, numeral } of romanMap) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }
    return result;
  };

  // Helper function to convert Roman numeral to number
  const fromRoman = (roman: string): number => {
    const romanValues: { [key: string]: number } = {
      'I': 1,
      'V': 5,
      'X': 10,
      'L': 50,
      'C': 100,
      'D': 500,
      'M': 1000,
    };
    
    let result = 0;
    for (let i = 0; i < roman.length; i++) {
      const current = romanValues[roman[i]];
      const next = romanValues[roman[i + 1]];
      
      if (next && current < next) {
        result += next - current;
        i++;
      } else {
        result += current;
      }
    }
    return result;
  };

  const [selection, setSelection] = React.useState<any>(undefined);

  const handleTextChange = (text: string) => {
    const lines = text.split('\n');
    const currentLineIndex = lines.length - 1;
    const currentLine = lines[currentLineIndex];
    let desiredCaretPos: number | null = null;
    
    // Check for auto-numbering: if user types a Roman numeral followed by a period (e.g., "i.")
    const romanMatch = currentLine.match(/^([ivxlcdm]+)\.\s/i);
    if (romanMatch) {
      const userRoman = romanMatch[1].toUpperCase();
      const userNum = fromRoman(userRoman);
      
      // Find the highest number used in previous lines
      let maxNum = 0;
      for (let i = 0; i < currentLineIndex; i++) {
        const match = lines[i].match(/^\*?\*?([ivxlcdm]+)\.\*?\*?/i);
        if (match) {
          const num = fromRoman(match[1].toUpperCase());
          if (num > maxNum) maxNum = num;
        }
      }
      
      // If user typed a number that doesn't match the expected next number, correct it
      const expectedNum = maxNum + 1;
      if (userNum !== expectedNum && maxNum > 0) {
        // Replace with the correct Roman numeral (always lowercase)
        const correctRoman = toRoman(expectedNum).toLowerCase();
        lines[currentLineIndex] = currentLine.replace(/^[ivxlcdm]+\./i, `${correctRoman}.`);
        text = lines.join('\n');
        // Place caret at end of corrected line
        let pos = 0;
        for (let i = 0; i < currentLineIndex; i++) pos += lines[i].length + 1;
        pos += lines[currentLineIndex].length;
        // set desired caret position after update
        // will be applied below
        var _desired = pos;
        // assign to desiredCaretPos after existing logic
        // (we can't set state here because parent onChange may update value)
        (desiredCaretPos as any) = _desired;
      } else if (userNum === expectedNum) {
        // Ensure it's lowercase
        lines[currentLineIndex] = currentLine.replace(/^[ivxlcdm]+\./i, `${userRoman.toLowerCase()}.`);
        text = lines.join('\n');
        let pos = 0;
        for (let i = 0; i < currentLineIndex; i++) pos += lines[i].length + 1;
        pos += lines[currentLineIndex].length;
        (desiredCaretPos as any) = pos;
      }
    }
    
    
    // Check if a newline was just added and handle bullet logic
    if (currentLineIndex > 0) {
      const previousLine = lines[currentLineIndex - 1];
      
      if (previousLine.match(/^\s*•\s*$/) && currentLine === '') {
        // User pressed Enter twice on empty bullet - remove the empty bullet and go to normal line
        lines[currentLineIndex - 1] = '';
        lines[currentLineIndex] = '';
        text = lines.join('\n');
        // Place caret at start of this now-empty line
        let pos = 0;
        for (let i = 0; i < currentLineIndex; i++) pos += lines[i].length + 1;
        desiredCaretPos = pos;
      } else if (previousLine.match(/^\s*•\s*.+/) && currentLine === '') {
        // Previous line is bulleted with content and current line is empty (just created by pressing Enter)
        // Add a new bullet
        lines[currentLineIndex] = '• ';
        text = lines.join('\n');
        // Compute caret position right after the inserted bullet
        let pos = 0;
        for (let i = 0; i < currentLineIndex; i++) pos += lines[i].length + 1;
        pos += lines[currentLineIndex].indexOf('• ') >= 0 ? lines[currentLineIndex].indexOf('• ') + 2 : 2;
        desiredCaretPos = pos;
      }
    }
    
    onChangeText(text);
    // If we computed a desired caret position, set selection so the cursor moves immediately
    if (desiredCaretPos !== null) {
      setTimeout(() => {
        setSelection({ start: desiredCaretPos, end: desiredCaretPos });
      }, 0);
    }
  };

  return (
    <TextInput
      style={{
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        fontSize: 14,
        minHeight: 100,
        marginBottom: 8,
        color: isDark ? '#fff' : '#111',
        borderColor: isDark ? '#2196F3' : '#0a7ea4',
        backgroundColor: isDark ? '#181a20' : '#f9f9f9',
        textAlignVertical: 'top',
      }}
      value={value}
      onChangeText={handleTextChange}
      editable={!readOnly}
      multiline
      numberOfLines={6}
      placeholder={placeholder}
      placeholderTextColor={isDark ? '#999' : '#999'}
      onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
      selection={selection}
    />
  );
}

export default function PatientProfileScreen() {
  // State for ChatGPT modal
  const [showChatGPTModal, setShowChatGPTModal] = React.useState(false);
  // SBAR AI state
  const [sbarSummary, setSbarSummary] = React.useState<string | null>(null);
  const [sbarLoading, setSbarLoading] = React.useState(false);
  const [sbarError, setSbarError] = React.useState<string | null>(null);
  const [showSBARModal, setShowSBARModal] = React.useState(false);

  // Vital signs state
  const [vitalBP, setVitalBP] = useState('');
  const [vitalSPO2, setVitalSPO2] = useState('');
  const [vitalRR, setVitalRR] = useState('');
  const [vitalPulse, setVitalPulse] = useState('');
  const [vitalTemp, setVitalTemp] = useState('');
  // Ward round draft state
  const [wardRoundDraft, setWardRoundDraft] = React.useState<any>(null);
  const [systemicExamination, setSystemicExamination] = React.useState('');
  const [onExamination, setOnExamination] = React.useState('');

  // Automatically bullet each line in Chief Complaints
  const handleChiefComplaintsChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, ''); // Remove existing bullet (allow leading spaces)
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, chief_complaints: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in ROS of Affected Systems
  const handleROSAffectedSystemsChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, ''); // Remove existing bullet (allow leading spaces)
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, hpi_ros: bulletedLines.join('\n')});
  };

  // Add numbering to current line in ROS
  const handleAddNumbering = () => {
    const currentROS = comprehensiveHistory.ros || '';
    const lines = currentROS.split('\n');
    // Find the last number used (checking for Roman numerals)
    let maxNum = 0;
    lines.forEach((line: string) => {
      const match = line.match(/^\*?\*?([ivxlcdm]+)\.\*?\*?/i);
      if (match) {
        // Convert Roman to number for comparison
        const romanValues: { [key: string]: number } = {
          'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000,
        };
        let result = 0;
        const roman = match[1].toUpperCase();
        for (let i = 0; i < roman.length; i++) {
          const current = romanValues[roman[i]];
          const next = romanValues[roman[i + 1]];
          if (next && current < next) {
            result += next - current;
            i++;
          } else {
            result += current;
          }
        }
        if (result > maxNum) maxNum = result;
      }
    });
    
    const nextNum = maxNum + 1;
    // Convert to Roman numeral
    const romanMap = [
      { value: 1000, numeral: 'M' }, { value: 900, numeral: 'CM' }, { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' }, { value: 100, numeral: 'C' }, { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' }, { value: 40, numeral: 'XL' }, { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' }, { value: 5, numeral: 'V' }, { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];
    let nextRoman = '';
    let remaining = nextNum;
    for (const { value, numeral } of romanMap) {
      while (remaining >= value) {
        nextRoman += numeral;
        remaining -= value;
      }
    }
    
    const newLine = `${nextRoman.toLowerCase()}. `;
    setComprehensiveHistory({...comprehensiveHistory, ros: currentROS + (currentROS ? '\n' : '') + newLine});
  };

  // Add bullet to current line in ROS
  const handleAddBullet = () => {
    const currentROS = comprehensiveHistory.ros || '';
    const newLine = '• ';
    setComprehensiveHistory({...comprehensiveHistory, ros: currentROS + (currentROS ? '\n' : '') + newLine});
  };

  // Add numbering to current line in Physical Exam
  const handleAddPhysExamNumbering = () => {
    const currentPhysExam = comprehensiveHistory.phys_exam || '';
    const lines = currentPhysExam.split('\n');
    // Find the last number used (checking for Roman numerals)
    let maxNum = 0;
    lines.forEach((line: string) => {
      const match = line.match(/^\*?\*?([ivxlcdm]+)\.\*?\*?/i);
      if (match) {
        // Convert Roman to number for comparison
        const romanValues: { [key: string]: number } = {
          'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000,
        };
        let result = 0;
        const roman = match[1].toUpperCase();
        for (let i = 0; i < roman.length; i++) {
          const current = romanValues[roman[i]];
          const next = romanValues[roman[i + 1]];
          if (next && current < next) {
            result += next - current;
            i++;
          } else {
            result += current;
          }
        }
        if (result > maxNum) maxNum = result;
      }
    });
    
    const nextNum = maxNum + 1;
    // Convert to Roman numeral
    const romanMap = [
      { value: 1000, numeral: 'M' }, { value: 900, numeral: 'CM' }, { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' }, { value: 100, numeral: 'C' }, { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' }, { value: 40, numeral: 'XL' }, { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' }, { value: 5, numeral: 'V' }, { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];
    let nextRoman = '';
    let remaining = nextNum;
    for (const { value, numeral } of romanMap) {
      while (remaining >= value) {
        nextRoman += numeral;
        remaining -= value;
      }
    }
    
    const newLine = `${nextRoman.toLowerCase()}. `;
    setComprehensiveHistory({...comprehensiveHistory, phys_exam: currentPhysExam + (currentPhysExam ? '\n' : '') + newLine});
  };

  // Add bullet to current line in Physical Exam
  const handleAddPhysExamBullet = () => {
    const currentPhysExam = comprehensiveHistory.phys_exam || '';
    const newLine = '• ';
    setComprehensiveHistory({...comprehensiveHistory, phys_exam: currentPhysExam + (currentPhysExam ? '\n' : '') + newLine});
  };

  const handleROSChange = (text: string) => {
    setComprehensiveHistory({...comprehensiveHistory, ros: text});
  };

  const handlePhysExamChange = (text: string) => {
    setComprehensiveHistory({...comprehensiveHistory, phys_exam: text});
  };

  // Save draft to local state
  const handleSaveWardRoundDraft = () => {
    setWardRoundDraft({
      text: wardRoundText,
      doctor: wardDoctor,
      complaints: todaysComplaints,
      numbered,
      todos: tempTodos,
      attachments: wardRoundAttachments,
      onExamination,
      systemicExamination,
      assessment,
    });
    setWardRoundModal(false);
  };

  // Resume draft
  const handleResumeWardRound = () => {
    if (!wardRoundDraft) return;
    setWardRoundText(wardRoundDraft.text || '');
    setWardDoctor(wardRoundDraft.doctor || '');
    setTodaysComplaints(wardRoundDraft.complaints || '');
    setNumbered(wardRoundDraft.numbered || false);
    setTempTodos(wardRoundDraft.todos || []);
    setWardRoundAttachments(wardRoundDraft.attachments || []);
    setOnExamination(wardRoundDraft.onExamination || '');
    setSystemicExamination(wardRoundDraft.systemicExamination || '');
    setAssessment(wardRoundDraft.assessment || '');
    setWardRoundModal(true);
  };

  // Automatically bullet each line in Systemic Examination
  const handleSystemicExaminationChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, ''); // Remove existing bullet (allow leading spaces)
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setSystemicExamination(bulletedLines.join('\n'));
  };

  // Automatically bullet each line in On Examination
  const handleOnExaminationChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, ''); // Remove existing bullet (allow leading spaces)
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setOnExamination(bulletedLines.join('\n'));
  };

  // Automatically bullet each line in Past Medical & Surgical History
  const handlePastMedSurgChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, past_med_surg: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Personal Socioeconomic History
  const handlePersonalSocioChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, personal_socio: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Family Socioeconomic History
  const handleFamilySocioChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, family_socio: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Birth History
  const handleBirthHistoryChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, birth_hx: bulletedLines.join('\n')});
  };

  // Split Birth History: Antenatal, Natal, Post-natal - each auto-bulleted
  const handleBirthAntenatalChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, birth_antenatal: bulletedLines.join('\n')});
  };

  const handleBirthNatalChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, birth_natal: bulletedLines.join('\n')});
  };

  const handleBirthPostnatalChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, birth_postnatal: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Developmental History
  const handleDevHistoryChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, dev_hx: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Immunization History
  const handleImmunHistoryChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, immun_hx: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Feeding History
  const handleFeedingHistoryChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, feed_hx: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in General Examination
  const handleGenExamChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, gen_exam: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in General Signs
  const handleGenSignsChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, gen_signs: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Local Exam
  const handleLocalExamChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, local_exam: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Impression
  const handleImpressionChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, impression: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Differential Diagnoses
  const handleDiffDiagChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, diff_diag: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Investigations
  const handleInvestigationsChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, investigations: bulletedLines.join('\n')});
  };

  // Split Investigations into Laboratory, Imaging, Special/Functional/Diagnostic - auto-bullet each
  const handleInvestigationsLabChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, investigations_lab: bulletedLines.join('\n')});
  };

  const handleInvestigationsImagingChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, investigations_imaging: bulletedLines.join('\n')});
  };

  const handleInvestigationsSpecialChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^\s*•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, investigations_special: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Obstetric History
  const handleObsHistoryChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, obs_hx: bulletedLines.join('\n')});
  };

  // Automatically bullet each line in Gynaecological History
  const handleGynHistoryChange = (text: string) => {
    const lines = text.split('\n');
    const bulletedLines = lines.map(line => {
      const isBulletOnly = /^\s*•\s*$/.test(line);
      const trimmed = line.replace(/^•\s*/, '');
      if (trimmed === '') return isBulletOnly ? '• ' : '';
      return `• ${trimmed}`;
    });
    setComprehensiveHistory({...comprehensiveHistory, gyn_hx: bulletedLines.join('\n')});
  };

  // Automatically number each non-empty line in Plan (1., 2., 3. ...)
  // This auto-numbering replaces existing numeric or roman prefixes to avoid duplicates.
  const handlePlanAutoNumberChange = (text: string) => {
    const lines = text.split('\n');
    const numberedLines: string[] = [];
    let counter = 1;
    lines.forEach(line => {
      const trimmed = line.replace(/^\s*([0-9]+\.|[ivxlcdm]+\.|\*\s+|•\s+)?\s*/i, '');
      if (trimmed === '') {
        // preserve empty lines without numbering
        numberedLines.push('');
      } else {
        numberedLines.push(`${counter}. ${trimmed}`);
        counter += 1;
      }
    });
    setComprehensiveHistory({...comprehensiveHistory, plan: numberedLines.join('\n')});
  };

  // Auto-number for Supportive Management (W.plan_supportive)
  const handlePlanSupportiveAutoNumberChange = (text: string) => {
    const lines = text.split('\n');
    const numberedLines: string[] = [];
    let counter = 1;
    lines.forEach(line => {
      const trimmed = line.replace(/^\s*([0-9]+\.|[ivxlcdm]+\.|\*\s+|•\s+)?\s*/i, '');
      if (trimmed === '') {
        numberedLines.push('');
      } else {
        numberedLines.push(`${counter}. ${trimmed}`);
        counter += 1;
      }
    });
    setComprehensiveHistory({...comprehensiveHistory, plan_supportive: numberedLines.join('\n')});
  };

  // Auto-number for Definitive Management (W.plan_definitive)
  const handlePlanDefinitiveAutoNumberChange = (text: string) => {
    const lines = text.split('\n');
    const numberedLines: string[] = [];
    let counter = 1;
    lines.forEach(line => {
      const trimmed = line.replace(/^\s*([0-9]+\.|[ivxlcdm]+\.|\*\s+|•\s+)?\s*/i, '');
      if (trimmed === '') {
        numberedLines.push('');
      } else {
        numberedLines.push(`${counter}. ${trimmed}`);
        counter += 1;
      }
    });
    setComprehensiveHistory({...comprehensiveHistory, plan_definitive: numberedLines.join('\n')});
  };

  // QR code modal state
  const [showQRModal, setShowQRModal] = useState(false);
  // Delete patient and all their To-Dos from AsyncStorage
  const handleDeletePatient = async () => {
    try {
      await AsyncStorage.removeItem(patientKey);
      if (router.canGoBack()) router.back();
      else router.replace('/');
    } catch (e) {
      alert('Failed to delete patient: ' + ((e && typeof e === 'object' && 'message' in e) ? (e as any).message : String(e)));
    }
  };
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const params = useLocalSearchParams();

  // Patient data from params
  const {
    firstName = '',
    lastName = '',
    age = '',
    ageMode = '',
    sex = '',
    ward = '',
    ipNumber = '',
    id = '',
    diagnosis = '',
    bedNumber = '',
  } = params;

  const [wardRoundModal, setWardRoundModal] = React.useState(false);
  const [wardRoundText, setWardRoundText] = React.useState('');
  const [wardDoctor, setWardDoctor] = React.useState('');
  const [wardRoundAttachments, setWardRoundAttachments] = React.useState<any[]>([]);
  const [pendingAttachmentForWardRound, setPendingAttachmentForWardRound] = React.useState(false);
  const [assessment, setAssessment] = React.useState('');
  const [todaysComplaints, setTodaysComplaints] = React.useState('');
  const [selectedWardRoundIndices, setSelectedWardRoundIndices] = React.useState<number[]>([]);
  const [planModal, setPlanModal] = React.useState(false);
  const [editingPlanIndex, setEditingPlanIndex] = React.useState<number | null>(null);
  const [planText, setPlanText] = React.useState('');
  const [editingWardRoundIdx, setEditingWardRoundIdx] = React.useState<number | null>(null);
  const [showPatientSummaryModal, setShowPatientSummaryModal] = React.useState(false);
  const [patientSummaryText, setPatientSummaryText] = React.useState('');

  // Comprehensive History state
  const [showComprehensiveHistoryModal, setShowComprehensiveHistoryModal] = React.useState(false);
  const [comprehensiveHistory, setComprehensiveHistory] = React.useState<any>({});

  // Automatically number each line in Today's Complaints
  const handleTodaysComplaintsChange = (text: string) => {
    const lines = text.split('\n');
    const numberedLines = lines.map((line, idx) => {
      const trimmed = line.replace(/^\d+\.\s*/, ''); // Remove existing numbers
      return trimmed ? `${idx + 1}. ${trimmed}` : '';
    });
    setTodaysComplaints(numberedLines.join('\n'));
  };

  // State for popup for each button and their selected levels
  const [showPopup, setShowPopup] = React.useState<string | null>(null);
  const [buttonLevels, setButtonLevels] = React.useState<{ [key: string]: string }>({});
  const [numbered, setNumbered] = React.useState(false);
  const [showToDoModal, setShowToDoModal] = React.useState(false);
  const [toDoType, setToDoType] = React.useState('');
  const [toDoDropdownOpen, setToDoDropdownOpen] = React.useState(false);

  // Add state for To Do title/details
  const [toDoTitle, setToDoTitle] = React.useState('');
  const [toDoDetails, setToDoDetails] = React.useState('');
  const [patientData, setPatientData] = React.useState<any>(null);

  // Temporary To Do items added in this session before saving ward round
  const [tempTodos, setTempTodos] = React.useState<any[]>([]);

  // Unique key for this patient
  const patientKey = `patient_${id}`;

  // Comprehensive history modal read-only flag
  const [comprehensiveReadOnly, setComprehensiveReadOnly] = React.useState(false);

  // Load patient data (ward rounds, todos, etc) on mount
  const [fullPatientData, setFullPatientData] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      try {
        // Load patient-specific data
        const stored = await AsyncStorage.getItem(patientKey);
        const patientSpecificData = stored ? JSON.parse(stored) : {};

        // Load patient registration data from patients list
        const patientsList = await AsyncStorage.getItem('patients_list');
        let registrationData = {};
        if (patientsList) {
          const patients = JSON.parse(patientsList);
          const patient = patients.find((p: any) => p.id === id);
          if (patient) {
            registrationData = patient;
          }
        }

        // Merge both data sources (patientSpecificData overrides registrationData for changes made in this session)
        const merged = { ...registrationData, ...patientSpecificData };
        console.log('DEBUG: patientData merged - registrationData.lmp:', registrationData.lmp, 'patientSpecificData.lmp:', patientSpecificData.lmp, 'merged.lmp:', merged.lmp);
        setPatientData(merged);
        setFullPatientData(merged);
      } catch (error) {
        console.error('DEBUG: Error loading patient data:', error);
      }
    })();
  }, [id]);

  // Save patient data helper
  const savePatientData = async (data: any) => {
    setPatientData(data);
    await AsyncStorage.setItem(patientKey, JSON.stringify(data));
  };

  // Add To Do from modal to temp list (not persistent until ward round is saved)
  const handleAddTempToDo = () => {
    const patientName = `${firstName} ${lastName}`.trim();
    const newTodo = {
      type: toDoType,
      title: toDoTitle,
      details: toDoDetails,
      createdAt: Date.now(),
      patientId: id,
      patientName,
      age,
      sex,
      ipNumber,
    };
    setTempTodos([
      ...tempTodos,
      newTodo,
    ]);
    setShowToDoModal(false);
    setToDoType('');
    setToDoTitle('');
    setToDoDetails('');
  };

  // Save ward round note
  const handleSaveWardRound = async () => {
    const newNote = {
      text: wardRoundText,
      doctor: wardDoctor,
      complaints: todaysComplaints,
      numbered,
      createdAt: Date.now(),
      todos: tempTodos, // attach temp todos to this ward round
      attachments: wardRoundAttachments,
      buttonLevels: { ...buttonLevels },
      onExamination,
      systemicExamination,
      assessment,
      vitalBP,
      vitalSPO2,
      vitalRR,
      vitalPulse,
      vitalTemp,
    };
    const updated = {
      ...patientData,
      wardRounds: [...(patientData?.wardRounds || []), newNote],
      todos: [
        ...(patientData?.todos || []),
        ...tempTodos.map(t => ({ ...t, patientId: id })), // ensure all have patientId
      ],
    };
    await savePatientData(updated);
    setWardRoundModal(false);
    setWardRoundText('');
    setWardDoctor('');
    setTodaysComplaints('');
    setAssessment('');
    setWardRoundAttachments([]);
    setTempTodos([]); // clear temp todos after save
  };

  // Helper to handle numbered input
  const handleWardRoundTextChange = (text: string) => {
    // Always auto-number each line
    const lines = text.split('\n');
    const numberedLines = lines.map((line, idx) => {
      const trimmed = line.replace(/^\d+\.\s*/, ''); // Remove existing numbers
      return trimmed ? `${idx + 1}. ${trimmed}` : '';
    });
    setWardRoundText(numberedLines.join('\n'));
  };

  // Track completed status for todos (persisted in AsyncStorage)
  const handleCompleteTodo = async (idx: number) => {
    const updatedTodos = patientData.todos.map((todo: any, i: number) =>
      i === idx ? { ...todo, completed: true, completedAt: Date.now() } : todo
    );
    await savePatientData({ ...patientData, todos: updatedTodos });
  };

  const handleRevertTodo = async (idx: number) => {
    const updatedTodos = patientData.todos.map((todo: any, i: number) =>
      i === idx ? { ...todo, completed: false, completedAt: undefined } : todo
    );
    await savePatientData({ ...patientData, todos: updatedTodos });
  };

  const handleDeleteTodo = async (idx: number) => {
    const updatedTodos = patientData.todos.filter((_: any, i: number) => i !== idx);
    await savePatientData({ ...patientData, todos: updatedTodos });
  };

  // Handle saving plan to a ward round
  const handleSavePlan = async () => {
    if (editingWardRoundIdx === null || !planText.trim()) {
      alert('Please enter a plan');
      return;
    }

    const updatedWardRounds = patientData.wardRounds.map((wr: any, i: number) => {
      if (i === editingWardRoundIdx) {
        if (!wr.plans) {
          wr.plans = [];
        }
        if (editingPlanIndex !== null) {
          // Edit existing plan
          wr.plans[editingPlanIndex] = {
            ...wr.plans[editingPlanIndex],
            text: planText,
            updatedAt: Date.now(),
          };
        } else {
          // Add new plan
          wr.plans.push({
            text: planText,
            createdAt: Date.now(),
          });
        }
      }
      return wr;
    });

    await savePatientData({ ...patientData, wardRounds: updatedWardRounds });
    setPlanModal(false);
    setPlanText('');
    setEditingPlanIndex(null);
    setEditingWardRoundIdx(null);
  };

  // Handle deleting plan from a ward round
  const handleDeletePlan = async (wardRoundIdx: number, planIdx: number) => {
    const updatedWardRounds = patientData.wardRounds.map((wr: any, i: number) => {
      if (i === wardRoundIdx && wr.plans) {
        wr.plans = wr.plans.filter((_: any, pIdx: number) => pIdx !== planIdx);
      }
      return wr;
    });

    await savePatientData({ ...patientData, wardRounds: updatedWardRounds });
  };

  // Handle editing plan
  const handleEditPlan = (wardRoundIdx: number, planIdx: number, planText: string) => {
    setEditingWardRoundIdx(wardRoundIdx);
    setEditingPlanIndex(planIdx);
    setPlanText(planText);
    setPlanModal(true);
  };

  // Patient summary handlers
  const openPatientSummaryModal = () => {
    setPatientSummaryText(patientData?.patientSummary || '');
    setShowPatientSummaryModal(true);
  };

  const handleSavePatientSummary = async () => {
    const updated = { ...patientData, patientSummary: patientSummaryText };
    await savePatientData(updated);
    setShowPatientSummaryModal(false);
  };

  const handleDeletePatientSummary = async () => {
    const updated = { ...patientData };
    delete updated.patientSummary;
    await savePatientData(updated);
  };

  // Handle opening plan modal to add new plan
  const handleAddPlan = (wardRoundIdx: number) => {
    setEditingWardRoundIdx(wardRoundIdx);
    setEditingPlanIndex(null);
    setPlanText('');
    setPlanModal(true);
  };

  // State for edit To Do modal
  const [showEditTodoModal, setShowEditTodoModal] = React.useState(false);
  const [editTodoIdx, setEditTodoIdx] = React.useState<number | null>(null);
  const [editTodoType, setEditTodoType] = React.useState('');
  const [editTodoTitle, setEditTodoTitle] = React.useState('');
  const [editTodoDetails, setEditTodoDetails] = React.useState('');
  const [editTodoDropdownOpen, setEditTodoDropdownOpen] = React.useState(false);

  // Open edit modal for a specific todo
  const openEditTodoModal = (idx: number) => {
    const todo = patientData.todos[idx];
    setEditTodoIdx(idx);
    setEditTodoType(todo.type);
    setEditTodoTitle(todo.title);
    setEditTodoDetails(todo.details || '');
    setEditTodoDropdownOpen(false);
    setShowEditTodoModal(true);
  };

  // Save edited todo
  const handleSaveEditTodo = async () => {
    if (editTodoIdx === null) return;
    const updatedTodos = patientData.todos.map((todo: any, i: number) =>
      i === editTodoIdx
        ? {
            ...todo,
            type: editTodoType,
            title: editTodoTitle,
            details: editTodoDetails,
          }
        : todo
    );
    await savePatientData({ ...patientData, todos: updatedTodos });
    setShowEditTodoModal(false);
    setEditTodoIdx(null);
    setEditTodoType('');
    setEditTodoTitle('');
    setEditTodoDetails('');
    setEditTodoDropdownOpen(false);
  };

  // Helper to handle numbered input for complete modal
  const handleCompleteTextChange = (text: string) => {
    if (!completeNumbered) {
      setCompleteText(text);
      return;
    }
    const lines = text.split('\n');
    const numberedLines = lines.map((line, idx) => {
      const trimmed = line.replace(/^\d+\.\s*/, '');
      return trimmed ? `${idx + 1}. ${trimmed}` : '';
    });
    setCompleteText(numberedLines.join('\n'));
  };

  // Handle file attachment (show modal)
  const handleAttachFile = async () => {
    setShowAttachModal(true);
  };

  // Handle attach file options (real logic)
  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newAttachment = {
          name: result.assets[0].fileName || 'photo.jpg',
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image',
        };
        // Determine if this is for ward round or todo completion
        if (pendingAttachmentForWardRound) {
          setWardRoundAttachments([...wardRoundAttachments, newAttachment]);
        } else {
          setAttachedFiles([...attachedFiles, newAttachment]);
        }
      }
    } catch {}
    setShowAttachModal(false);
  };

  const handleChooseFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newAttachment = {
          name: result.assets[0].fileName || 'gallery-image.jpg',
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image',
        };
        // Determine if this is for ward round or todo completion
        if (pendingAttachmentForWardRound) {
          setWardRoundAttachments([...wardRoundAttachments, newAttachment]);
        } else {
          setAttachedFiles([...attachedFiles, newAttachment]);
        }
      }
    } catch {}
    setShowAttachModal(false);
  };

  // Submit completion
  const handleSubmitComplete = async () => {
    if (completeIdx === null) return;
    const updatedTodos = patientData.todos.map((todo: any, i: number) =>
      i === completeIdx
        ? {
            ...todo,
            completed: true,
            completedAt: Date.now(),
            result: completeText,
            resultNumbered: completeNumbered,
            attachedFiles,
          }
        : todo
    );
    await savePatientData({ ...patientData, todos: updatedTodos });
    setShowCompleteModal(false);
    setCompleteIdx(null);
    setCompleteText('');
    setCompleteNumbered(false);
    setAttachedFiles([]);
  };

  // Add these state declarations near the other modal states
  const [showCompleteModal, setShowCompleteModal] = React.useState(false);
  const [completeIdx, setCompleteIdx] = React.useState<number | null>(null);
  const [completeText, setCompleteText] = React.useState('');
  const [completeNumbered, setCompleteNumbered] = React.useState(false);
  const [attachedFiles, setAttachedFiles] = React.useState<any[]>([]);
  const [showAttachModal, setShowAttachModal] = React.useState(false);

  // State for delete To Do confirmation modal
  const [showDeleteTodoModal, setShowDeleteTodoModal] = React.useState(false);
  const [deleteTodoIdx, setDeleteTodoIdx] = React.useState<number | null>(null);

  // Open delete confirmation modal (for both completed and pending todos)
  const openDeleteTodoModal = (idx: number) => {
    setDeleteTodoIdx(idx);
    setShowDeleteTodoModal(true);
  };

  // Confirm delete
  const confirmDeleteTodo = async () => {
    if (deleteTodoIdx === null) return;
    const updatedTodos = patientData.todos.filter((_: any, i: number) => i !== deleteTodoIdx);
    await savePatientData({ ...patientData, todos: updatedTodos });
    setShowDeleteTodoModal(false);
    setDeleteTodoIdx(null);
  };

  // State for revert To Do confirmation modal
  const [showRevertTodoModal, setShowRevertTodoModal] = React.useState(false);
  const [revertTodoIdx, setRevertTodoIdx] = React.useState<number | null>(null);

  // Open revert confirmation modal
  const openRevertTodoModal = (idx: number) => {
    setRevertTodoIdx(idx);
    setShowRevertTodoModal(true);
  };

  // Confirm revert
  const confirmRevertTodo = async () => {
    if (revertTodoIdx === null) return;
    const updatedTodos = patientData.todos.map((todo: any, i: number) =>
      i === revertTodoIdx ? { ...todo, completed: false, completedAt: undefined } : todo
    );
    await savePatientData({ ...patientData, todos: updatedTodos });
    setShowRevertTodoModal(false);
    setRevertTodoIdx(null);
  };

  // Add To Do from main page (not in ward round modal)
  const handleAddMainTodo = async () => {
    if (!toDoType || !toDoTitle) return;
    const patientName = `${firstName} ${lastName}`.trim();
    const newTodo = {
      type: toDoType,
      title: toDoTitle,
      details: toDoDetails,
      createdAt: Date.now(),
      patientId: id,
      patientName,
      age,
      sex,
      ipNumber,
    };
    const updated = {
      ...patientData,
      todos: [...(patientData?.todos || []), newTodo],
    };
    await savePatientData(updated);
    setShowToDoModal(false);
    setToDoType('');
    setToDoTitle('');
    setToDoDetails('');
  };

  // Add this function near other modal openers
  const openCompleteModal = (idx: number) => {
    setCompleteIdx(idx);
    setCompleteText('');
    setCompleteNumbered(false);
    setAttachedFiles([]);
    setShowCompleteModal(true);
  };

  // State for view To Do modal
  const [showViewTodoModal, setShowViewTodoModal] = React.useState(false);
  const [viewTodoIdx, setViewTodoIdx] = React.useState<number | null>(null);

  // State for full screen image viewer with zoom
  const [showImageViewer, setShowImageViewer] = React.useState(false);
  const [imageViewerUri, setImageViewerUri] = React.useState<string | null>(null);

  // Zoom and pan state for image viewer
  const scale = React.useRef(new Animated.Value(1)).current;
  const lastScale = React.useRef(1);
  const pan = React.useRef(new Animated.ValueXY()).current;
  const lastPan = React.useRef({ x: 0, y: 0 });

  // PanResponder for pinch and pan gestures (fix: use a mutable object for gesture state)
  const gestureStateRef = React.useRef({
    initialDistance: null as number | null,
    initialScale: 1,
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
  lastPan.current = { x: (pan.x as any)._value ?? 0, y: (pan.y as any)._value ?? 0 };
  lastScale.current = (scale as any)._value ?? 1;
        gestureStateRef.current.initialDistance = null;
        gestureStateRef.current.initialScale = lastScale.current;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          // Pinch zoom
          const touches = evt.nativeEvent.touches;
          if (touches.length === 2) {
            const dx = touches[0].pageX - touches[1].pageX;
            const dy = touches[0].pageY - touches[1].pageY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (!gestureStateRef.current.initialDistance) {
              gestureStateRef.current.initialDistance = distance;
              gestureStateRef.current.initialScale = lastScale.current;
            } else {
              let nextScale = gestureStateRef.current.initialScale * (distance / gestureStateRef.current.initialDistance);
              nextScale = Math.max(1, Math.min(nextScale, 4));
              scale.setValue(nextScale);
            }
          }
  } else if (gestureState.numberActiveTouches === 1 && ((scale as any)._value ?? 1) > 1) {
          // Pan
          let newX = lastPan.current.x + gestureState.dx;
          let newY = lastPan.current.y + gestureState.dy;
          pan.setValue({ x: newX, y: newY });
        }
      },
      onPanResponderRelease: () => {
        gestureStateRef.current.initialDistance = null;
        gestureStateRef.current.initialScale = 1;
      },
      onPanResponderTerminationRequest: () => true,
    })
  ).current;

  // Reset zoom/pan when closing image viewer
  React.useEffect(() => {
    if (!showImageViewer) {
      scale.setValue(1);
      pan.setValue({ x: 0, y: 0 });
    }
  }, [showImageViewer]);

  // Open view modal for a specific todo
  const handleViewTodo = (idx: number) => {
    setViewTodoIdx(idx);
    setShowViewTodoModal(true);
  };

  // Open image viewer for attached file
  const handleViewAttachment = (uri: string) => {
    setImageViewerUri(uri);
    setShowImageViewer(true);
  };

  // State for view ward rounds modal
  const [showWardRoundsModal, setShowWardRoundsModal] = React.useState(false);
  
  // State for collapsible ward rounds by date
  const [expandedDates, setExpandedDates] = React.useState<{ [key: string]: boolean }>({});

  // Helper to toggle selection
  // (Removed duplicate toggleWardRoundSelection to fix redeclaration error)

  // --- Real-time update for ward round results ---
  // This effect will update the wardRounds state with the latest To Do results
  React.useEffect(() => {
    if (!patientData?.wardRounds || !patientData?.todos) return;
    // Map through wardRounds and update each todo with the latest result from patientData.todos
    const updatedWardRounds = patientData.wardRounds.map((wr: any) => {
      if (!wr.todos) return wr;
      const updatedTodos = wr.todos.map((todo: any) => {
        const globalTodo = patientData.todos.find((pt: any) => pt.createdAt === todo.createdAt);
        return globalTodo ? { ...todo, ...globalTodo } : todo;
      });
      return { ...wr, todos: updatedTodos };
    });
    // Only update if changed (avoid infinite loop)
    if (
      JSON.stringify(updatedWardRounds) !== JSON.stringify(patientData.wardRounds)
    ) {
      setPatientData((prev: any) => ({
        ...prev,
        wardRounds: updatedWardRounds,
      }));
    }
  }, [patientData?.todos]);

  // Export handler: export patient profile as a text file and share
  const handleExport = async () => {
    if (!patientData?.wardRounds || patientData.wardRounds.length === 0) {
      alert('No ward rounds to export.');
      return;
    }
    try {
      await generateWardRoundsPDF(patientData.wardRounds, {
        firstName,
        lastName,
        age,
        ageMode,
        sex,
        diagnosis,
        ward,
        bedNumber,
        ipNumber,
      });
    } catch (e) {
      alert('Export failed: ' + (e && (e as any).message ? (e as any).message : e));
    }
  };

  // Export to clipboard: copy all patient data as text
  const handleExportToChatGPT = async () => {
    if (!patientData) {
      alert('No patient data to export.');
      return;
    }
    try {
      const createdOn = id ? new Date(Number(id)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
      let exportText = '';
      exportText += `Patient Profile\n\n`;
      exportText += `Name: ${firstName} ${lastName}\n`;
      exportText += `Age: ${age} ${ageMode}\n`;
      exportText += `Sex: ${sex}\n`;
      exportText += `IP Number: ${ipNumber}\n`;
      exportText += `Ward: ${ward}\n`;
      exportText += `Bed Number: ${bedNumber}\n`;
      exportText += `Diagnosis: ${diagnosis || ''}\n`;
      exportText += `Created On: ${createdOn}\n\n`;

      if (patientData.patientSummary) {
        exportText += `Patient Summary:\n${patientData.patientSummary}\n\n`;
      }

      if (patientData.wardRounds && patientData.wardRounds.length) {
        exportText += `Ward Rounds:\n`;
        patientData.wardRounds.forEach((wr: any, idx: number) => {
          exportText += `${idx + 1}. By: ${wr.doctor || 'Unknown'} (${wr.createdAt ? new Date(wr.createdAt).toLocaleString() : 'Unknown time'})\n`;
          if (wr.complaints) exportText += `   Complaints: ${wr.complaints}\n`;
          if (wr.onExamination) exportText += `   On Examination: ${wr.onExamination}\n`;
          if (wr.systemicExamination) exportText += `   Systemic Examination: ${wr.systemicExamination}\n`;
          if (wr.text) exportText += `   Notes: ${wr.text}\n`;
          if (wr.todos && wr.todos.length) {
            exportText += `   ToDos:\n`;
            wr.todos.forEach((t: any) => {
              exportText += `     - ${t.title} (${t.type})${t.completed ? ' ✅' : ''}${t.details ? ` - ${t.details}` : ''}\n`;
            });
          }
          exportText += `\n`;
        });
      }

      if (patientData.todos && patientData.todos.length) {
        exportText += `To Do List:\n`;
        (patientData.todos as any[]).forEach((todo: any, idx: number) => {
          exportText += `${idx + 1}. ${todo.title} (${todo.type}) - ${todo.completed ? 'Done ✅' : 'Pending'}\n`;
          if (todo.details) exportText += `   Details: ${todo.details}\n`;
          if (todo.createdAt) exportText += `   Created: ${new Date(todo.createdAt).toLocaleString()}\n`;
        });
        exportText += `\n`;
      }

      // Copy to clipboard
      await Clipboard.setStringAsync(exportText);
      Alert.alert('Success', 'Patient data copied to clipboard. Paste into ChatGPT or any other application.');
    } catch (e) {
      Alert.alert('Export failed', (e && (e as any).message) ? (e as any).message : String(e));
    }
  };

  // State for export date picker
  const [showExportDatePicker, setShowExportDatePicker] = React.useState(false);

  // Export PDF for selected ward round date
  const handleExportWardRoundPDF = async (date: Date) => {
    if (!patientData?.wardRounds) return;
    // Filter ward rounds by selected date (ignoring time)
    const selectedDateStr = date.toISOString().slice(0, 10);
    const rounds = patientData.wardRounds.filter((wr: any) => {
      const wrDate = new Date(wr.createdAt);
      return wrDate.toISOString().slice(0, 10) === selectedDateStr;
    });
    if (!rounds.length) {
      alert('No ward rounds found for the selected date.');
      return;
    }
    // Generate modern style HTML for PDF
    const html = `
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #222; }
          h1 { color: #1976d2; font-size: 2em; margin-bottom: 0.2em; }
          h2 { color: #2196F3; font-size: 1.2em; margin-top: 1.2em; margin-bottom: 0.2em; }
          .info { margin-bottom: 1em; }
          .card { border-radius: 12px; border-left: 6px solid #1976d2; background: #f7fafd; margin-bottom: 24px; padding: 18px 18px 12px 18px; }
          .label { color: #1976d2; font-weight: bold; }
          .section { margin-top: 10px; }
          .todo { margin-left: 12px; margin-bottom: 6px; }
          ul, ol { margin: 0 0 0 18px; padding: 0; }
          li { display: list-item; margin-bottom: 6px; margin-left: 0; }
        </style>
      </head>
      <body>
        <h1>Ward Round Report</h1>
        <div class="info">
          <div><span class="label">Name:</span> ${firstName} ${lastName}</div>
          <div><span class="label">Age:</span> ${age} ${ageMode}</div>
          <div><span class="label">Sex:</span> ${sex}</div>
          <div><span class="label">Diagnosis:</span> ${diagnosis}</div>
        </div>
        ${rounds.map((wr: any, idx: number) => `
          <div class="card">
            <h2>${idx + 1}. Ward Round by ${wr.doctor || 'Unknown'} (${new Date(wr.createdAt).toLocaleString()})</h2>
            ${wr.complaints ? `<div class="section"><span class="label">Complaints:</span> ${wr.complaints}</div>` : ''}
            ${wr.onExamination ? `<div class="section"><span class="label">On Examination:</span> ${wr.onExamination}</div>` : ''}
            ${wr.systemicExamination ? `<div class="section"><span class="label">Systemic Examination:</span> ${wr.systemicExamination}</div>` : ''}
            ${wr.assessment ? `<div class="section"><span class="label">Assessment:</span> ${wr.assessment}</div>` : ''}
            ${(wr.vitalBP || wr.vitalSPO2 || wr.vitalRR || wr.vitalPulse || wr.vitalTemp) ? `<div class="section"><span class="label">Vitals:</span> ${[wr.vitalBP ? `BP: ${wr.vitalBP} mmHg` : '', wr.vitalSPO2 ? `SPO2: ${wr.vitalSPO2}%` : '', wr.vitalRR ? `RR: ${wr.vitalRR}/min` : '', wr.vitalPulse ? `Pulse: ${wr.vitalPulse}/min` : '', wr.vitalTemp ? `Temp: ${wr.vitalTemp}°C` : ''].filter(Boolean).join(' | ')}</div>` : ''}
            <div class="section"><span class="label">Main Notes:</span> ${wr.text || ''}</div>
            ${wr.todos && wr.todos.length > 0 ? `<div class="section"><span class="label">To Dos:</span><ul>${wr.todos.map((todo: any) => `<li class="todo">${todo.title} (${todo.type}) - ${todo.details || ''} ${todo.completed ? '✅' : '⏳'}</li>`).join('')}</ul></div>` : ''}
          </div>
        `).join('')}
      </body>
      </html>
    `;
    try {
      // Convert the constructed HTML into a plain-text representation
      const rawText = html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|h1|h2|li|tr|td)>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim();

      // Use the central exporter which converts text -> HTML -> PDF and shares it
      await exportComprehensiveHistory(rawText, 'WardRoundExport');
    } catch (e) {
      alert('Export failed: ' + (e && (e as any).message ? (e as any).message : e));
    }
  };

  // Export comprehensive history as real PDF
  // Build comprehensive history text from form data
  const buildComprehensiveHistoryText = (): string => {
    const lines: string[] = [];

    // Title
    lines.push(`# ${comprehensiveHistory.biodata_name || 'Patient'} - Comprehensive History`);
    lines.push('');

    // BIODATA
    if (comprehensiveHistory.biodata_name) {
      lines.push('## BIODATA');
      if (comprehensiveHistory.biodata_name) lines.push(`**Name:** ${comprehensiveHistory.biodata_name}`);
      if (comprehensiveHistory.biodata_age) lines.push(`**Age:** ${comprehensiveHistory.biodata_age}`);
      if (comprehensiveHistory.biodata_sex) lines.push(`**Sex:** ${comprehensiveHistory.biodata_sex}`);
      if (comprehensiveHistory.biodata_residence) lines.push(`**Residence:** ${comprehensiveHistory.biodata_residence}`);
      if (comprehensiveHistory.biodata_religion) lines.push(`**Religion:** ${comprehensiveHistory.biodata_religion}`);
      if (comprehensiveHistory.biodata_admission) lines.push(`**Date of Admission:** ${comprehensiveHistory.biodata_admission}`);
      if (comprehensiveHistory.biodata_ipnumber) lines.push(`**IP Number:** ${comprehensiveHistory.biodata_ipnumber}`);
      if (comprehensiveHistory.biodata_informant) lines.push(`**Informant:** ${comprehensiveHistory.biodata_informant}`);
      
      // Female-specific fields
      if (comprehensiveHistory.biodata_sex?.toLowerCase().includes('f')) {
        if (comprehensiveHistory.biodata_lmp) lines.push(`**LMP:** ${comprehensiveHistory.biodata_lmp}`);
        if (comprehensiveHistory.biodata_gbd) lines.push(`**GBD:** ${comprehensiveHistory.biodata_gbd}`);
        if (comprehensiveHistory.biodata_edd) lines.push(`**EDD:** ${comprehensiveHistory.biodata_edd}`);
        if (comprehensiveHistory.biodata_parity) lines.push(`**Parity:** ${comprehensiveHistory.biodata_parity}`);
      }
      lines.push('');
    }

    // Main sections
    const sections = [
      { key: 'chief_complaints', title: 'CHIEF COMPLAINTS' },
      { key: 'hpi', title: 'HISTORY OF PRESENT ILLNESS' },
      { key: 'hpi_ros', title: 'ROS of Affected Systems' },
      { key: 'hpi_current_status', title: 'Current Status of Patient' },
      { key: 'ros', title: 'REVIEW OF SYSTEMS' },
      { key: 'past_med_surg', title: 'PAST MEDICAL & SURGICAL HISTORY' },
      { key: 'personal_socio', title: 'PERSONAL SOCIOECONOMIC HISTORY' },
      { key: 'family_socio', title: 'FAMILY SOCIOECONOMIC HISTORY' },
      { key: 'birth_hx', title: 'BIRTH HISTORY' },
      { key: 'dev_hx', title: 'DEVELOPMENTAL HISTORY' },
      { key: 'immun_hx', title: 'IMMUNIZATION HISTORY' },
      { key: 'feed_hx', title: 'FEEDING HISTORY' },
      { key: 'obs_hx', title: 'OBSTETRIC HISTORY' },
      { key: 'gyn_hx', title: 'GYNAECOLOGIC HISTORY' },
      { key: 'gen_exam', title: 'GENERAL EXAMINATION' },
      { key: 'gen_signs', title: 'General Signs' },
      { key: 'vital_signs', title: 'Vital Signs' },
      { key: 'phys_exam', title: 'PHYSICAL EXAMINATION' },
      { key: 'local_exam', title: 'LOCAL EXAMINATION' },
      { key: 'exec_summary', title: 'EXECUTIVE SUMMARY' },
      { key: 'impression', title: 'IMPRESSION' },
      { key: 'diff_diag', title: 'DIFFERENTIAL DIAGNOSES' },
      { key: 'investigations', title: 'INVESTIGATIONS' },
      { key: 'plan', title: 'PLAN' },
    ];

    sections.forEach(({ key, title }) => {
      const value = (comprehensiveHistory as any)[key];
      if (value && value.trim()) {
        lines.push(`## ${title}`);
        lines.push(value);
        lines.push('');
      }
    });

    return lines.join('\n');
  };

  // Comprehensive history export is handled directly via the button using
  // `exportComprehensiveHistory(buildComprehensiveHistoryText(), filename)`.

  // In the View Ward Rounds Modal, update each ward round card:
  // Track selected ward rounds
  const [selectedWardRounds, setSelectedWardRounds] = React.useState<number[]>([]);

  // Toggle ward round selection
  const toggleWardRoundSelection = (idx: number) => {
    setSelectedWardRounds(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#181a20' : '#fff' }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* SBAR AI Summary Section */}
      <View style={{ marginHorizontal: 24, marginTop: 18, marginBottom: 0, padding: 0 }}>
        {/* Removed SBAR Summary (AI) title */}
        {/* Removed Generate SBAR in ChatGPT button */}
      </View>
      {/* SBAR Modal Popup */}
      <Modal
        visible={showSBARModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSBARModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: isDark ? '#23272e' : '#fff', borderRadius: 18, padding: 24, width: '90%', maxWidth: 420, alignItems: 'center' }}>
            {/* Removed SBAR Summary (AI) title in modal */}
            {sbarLoading && (
              <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 16, marginBottom: 8 }}>Generating summary...</Text>
            )}
            {sbarError && (
              <Text style={{ color: '#e53935', fontSize: 15, marginBottom: 6 }}>{sbarError}</Text>
            )}
            {sbarSummary && (
              <ScrollView style={{ maxHeight: 300, width: '100%' }}>
                <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16, lineHeight: 22 }}>{sbarSummary}</Text>
              </ScrollView>
            )}
            <TouchableOpacity
              style={{ marginTop: 18, backgroundColor: isDark ? '#2196F3' : '#1976d2', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 28 }}
              onPress={() => setShowSBARModal(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ChatGPT WebView Modal */}
      <Modal
        visible={showChatGPTModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowChatGPTModal(false)}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: isDark ? '#23272e' : '#e3f2fd' }}>
            <Text style={{ flex: 1, color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 18 }}>ChatGPT</Text>
            <TouchableOpacity onPress={() => setShowChatGPTModal(false)} style={{ marginLeft: 12 }}>
              <Ionicons name="close-circle" size={32} color={isDark ? '#fff' : '#1976d2'} />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: 'https://chat.openai.com/' }}
            style={{ flex: 1 }}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      </Modal>
      <View style={[styles.header, { backgroundColor: isDark ? '#23272e' : '#e3f2fd', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="person-circle" size={72} color={isDark ? '#2196F3' : '#1976d2'} />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: isDark ? '#fff' : '#0a7ea4', fontSize: 28, fontWeight: 'bold', marginTop: 8, marginBottom: 4 }}>
              {firstName} {lastName}
            </Text>
            <Text style={{ color: isDark ? '#aaa' : '#333', fontSize: 16 }}>
              {sex} • {age} {ageMode}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={handleExportToChatGPT}
            style={{
              backgroundColor: isDark ? '#2E7D32' : '#388e3c',
              borderRadius: 24,
              padding: 10,
              marginLeft: 8,
              alignSelf: 'flex-start'
            }}
            accessibilityLabel="Export to ChatGPT"
          >
            <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleExport}
            style={{
              backgroundColor: isDark ? '#2196F3' : '#1976d2',
              borderRadius: 24,
              padding: 10,
              marginLeft: 8,
            }}
            accessibilityLabel="Export"
          >
            <Ionicons name="download-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
  <ProfileRow label="Ward" value={typeof ward === 'string' ? ward : Array.isArray(ward) ? ward.join(', ') : ''} isDark={isDark} icon={"bed" as any} />
  <ProfileRow label="Bed Number" value={typeof bedNumber === 'string' ? bedNumber : Array.isArray(bedNumber) ? bedNumber.join(', ') : ''} isDark={isDark} icon={"bed" as any} />
  <ProfileRow label="IP Number" value={typeof ipNumber === 'string' ? ipNumber : Array.isArray(ipNumber) ? ipNumber.join(', ') : ''} isDark={isDark} icon={"document-text-outline" as any} />
  <ProfileRow label="Sex" value={typeof sex === 'string' ? sex : Array.isArray(sex) ? sex.join(', ') : ''} isDark={isDark} icon={"male-female" as any} />
  <ProfileRow label="Age" value={`${age} ${ageMode}`} isDark={isDark} icon={"calendar-outline" as any} />
  {/* Date of Admission (Days in Ward) */}
  {(() => {
    // Try to get dateOfAdmission from params or patientData
    let dateOfAdmission = '';
    if (params.dateOfAdmission) {
      dateOfAdmission = Array.isArray(params.dateOfAdmission) ? params.dateOfAdmission[0] : params.dateOfAdmission;
    } else if (patientData && patientData.dateOfAdmission) {
      dateOfAdmission = patientData.dateOfAdmission;
    }
    let daysInWard = '';
    let formattedDate = '';
    if (dateOfAdmission) {
      const d = new Date(dateOfAdmission);
      const now = new Date();
      // Format DD/MM/YY
      formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`;
      // Calculate days in ward
      const diff = Math.floor((now.getTime() - d.setHours(0,0,0,0)) / (1000*60*60*24)) + 1;
      daysInWard = diff > 0 ? diff.toString() : '1';
    }
    return (
      <ProfileRow
        label="Admitted:"
        value={dateOfAdmission ? `${formattedDate} (${daysInWard} day${daysInWard === '1' ? '' : 's'})` : '—'}
        isDark={isDark}
        icon={"calendar" as any}
      />
    );
  })()}
  {/* Obstetric Information for Female Patients */}
  {(() => {
    // Get obstetric data from params or patientData
    let para = '';
    let paraLiving = '';
    let gravidity = '';
    let gravid = false;
    let lmp = '';
    let edd = '';
    
    if (params.para) para = Array.isArray(params.para) ? params.para[0] : params.para;
    else if (patientData?.para) para = patientData.para;
    
    if (params.paraLiving) paraLiving = Array.isArray(params.paraLiving) ? params.paraLiving[0] : params.paraLiving;
    else if (patientData?.paraLiving) paraLiving = patientData.paraLiving;
    
    if (params.gravidity) gravidity = Array.isArray(params.gravidity) ? params.gravidity[0] : params.gravidity;
    else if (patientData?.gravidity) gravidity = patientData.gravidity;
    
    if (params.gravid !== undefined) {
      const gravidVal = Array.isArray(params.gravid) ? params.gravid[0] : params.gravid;
      gravid = gravidVal === 'true' || (typeof gravidVal === 'boolean' && gravidVal);
    } else if (patientData?.gravid !== undefined) gravid = patientData.gravid;
    
    if (params.lmp) lmp = Array.isArray(params.lmp) ? params.lmp[0] : params.lmp;
    else if (patientData?.lmp) lmp = patientData.lmp;
    
    if (params.edd) edd = Array.isArray(params.edd) ? params.edd[0] : params.edd;
    else if (patientData?.edd) edd = patientData.edd;
    
    // Helper to format date
    const formatDate = (dateStr: string) => {
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
    const hasObstetricData = para || paraLiving || gravidity || lmp || edd;
    if (!hasObstetricData) return null;
    
    return (
      <>
        {/* LMP */}
        {lmp && (
          <ProfileRow 
            label="LMP" 
            value={formatDate(lmp)} 
            isDark={isDark} 
            icon={"calendar-outline" as any} 
          />
        )}
        {/* Parity and Gravidity */}
        {((para || paraLiving) || (gravidity && gravid)) && (
          <ProfileRow 
            label="Parity" 
            value={`${para || '0'}+${paraLiving || '0'}${gravidity && gravid ? `; G${gravidity}` : ''}`} 
            isDark={isDark} 
            icon={"female" as any} 
          />
        )}
        {/* GBD and EDD side by side */}
        {((() => {
          const gest = getGestationFromLMP(lmp);
          return gest || edd;
        })()) && (
          <>
            {(() => {
              const gest = getGestationFromLMP(lmp);
              if (!gest) return null;
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons name="time-outline" size={20} color={isDark ? '#2196F3' : '#1976d2'} style={{ marginRight: 10 }} />
                  <Text style={[styles.label, { color: isDark ? '#90caf9' : '#1976d2' }]}>GBD:</Text>
                  <Text style={[styles.value, { color: isDark ? '#fff' : '#222', marginLeft: 4 }]}>{gest.weeks} weeks {gest.days} days</Text>
                </View>
              );
            })()}
            {edd && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="calendar-outline" size={20} color={isDark ? '#2196F3' : '#1976d2'} style={{ marginRight: 10 }} />
                <Text style={[styles.label, { color: isDark ? '#90caf9' : '#1976d2' }]}>EDD:</Text>
                <Text style={[styles.value, { color: isDark ? '#fff' : '#222', marginLeft: 4 }]}>{formatDate(edd)}</Text>
              </View>
            )}
          </>
        )}
      </>
    );
  })()}
  <ProfileRow label="Diagnosis" value={typeof diagnosis === 'string' ? diagnosis : Array.isArray(diagnosis) ? diagnosis.join(', ') : ''} isDark={isDark} icon={"medkit-outline" as any} />
  {/* Patient Summary Section */}
  <View style={{ marginTop: 12, marginBottom: 12 }}>
    {patientData?.patientSummary ? (
      <View style={{ padding: 10, borderRadius: 8, backgroundColor: isDark ? '#23272e' : '#e3f2fd' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15 }}>Patient Summary</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={openPatientSummaryModal}
              style={{ backgroundColor: isDark ? '#1976d2' : '#90caf9', borderRadius: 6, padding: 6 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // confirm before deleting
                // Using Alert from react-native
                Alert.alert('Delete Summary', 'Are you sure you want to delete the patient summary?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: handleDeletePatientSummary },
                ]);
              }}
              style={{ backgroundColor: '#d32f2f', borderRadius: 6, padding: 6 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{ color: isDark ? '#fff' : '#222', marginTop: 8 }}>{patientData.patientSummary}</Text>
      </View>
    ) : (
      <TouchableOpacity
        onPress={openPatientSummaryModal}
        style={{ alignSelf: 'flex-start', backgroundColor: isDark ? '#2196F3' : '#1976d2', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add Patient Summary</Text>
      </TouchableOpacity>
    )}
  </View>

  {/* Comprehensive History Button / View */}
  {(() => {
    const hasComprehensive = !!(patientData && patientData.comprehensiveHistory && Object.values(patientData.comprehensiveHistory).some((v: any) => v !== undefined && v !== null && String(v).trim() !== ''));
    if (hasComprehensive) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => {
              setComprehensiveHistory(patientData.comprehensiveHistory || {});
              setComprehensiveReadOnly(true);
              setShowComprehensiveHistoryModal(true);
            }}
            style={{ alignSelf: 'flex-start', backgroundColor: isDark ? '#388e3c' : '#e8f5e9', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 }}
          >
            <Text style={{ color: isDark ? '#fff' : '#388e3c', fontWeight: 'bold' }}>View Comprehensive History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setComprehensiveHistory(patientData.comprehensiveHistory || {});
              setComprehensiveReadOnly(false);
              setShowComprehensiveHistoryModal(true);
            }}
            style={{ alignSelf: 'flex-start', backgroundColor: isDark ? '#1976d2' : '#90caf9', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert('Delete Comprehensive History', 'Are you sure you want to delete the comprehensive history for this patient?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: async () => {
                  const updated = { ...patientData };
                  delete updated.comprehensiveHistory;
                  await savePatientData(updated);
                  // clear any loaded comprehensiveHistory in state
                  setComprehensiveHistory({});
                } },
              ]);
            }}
            style={{ alignSelf: 'flex-start', backgroundColor: '#d32f2f', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // No saved comprehensive history - show create button
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('DEBUG: Opening comprehensive history - patientData:', JSON.stringify(patientData), 'lmp:', patientData?.lmp);
          // Auto-fill biodata from registered patient data
          const lmpValue = patientData?.lmp || '';
          console.log('DEBUG: Setting biodata_lmp to:', lmpValue);
          setComprehensiveHistory({
            biodata_name: `${firstName} ${lastName}`.trim(),
            biodata_age: age,
            biodata_sex: sex,
            biodata_ipnumber: ipNumber,
            biodata_residence: '',
            biodata_religion: '',
            biodata_admission: patientData?.dateOfAdmission || '',
            biodata_informant: '',
            biodata_lmp: lmpValue,
            biodata_gbd: patientData?.gravidity || '',
            biodata_edd: patientData?.edd || '',
            biodata_parity: patientData?.para && patientData?.paraLiving ? `${patientData.para}/${patientData.paraLiving}` : '',
            chief_complaints: '',
            hpi: '',
            hpi_ros: '',
            hpi_current_status: '',
            ros: '',
            obs_hx: '',
            gyn_hx: '',
            past_med_surg: '',
            personal_socio: '',
            family_socio: '',
            birth_hx: '',
            dev_hx: '',
            immun_hx: '',
            feed_hx: '',
            gen_exam: '',
            vital_signs: '',
            gen_signs: '',
            phys_exam: '',
            local_exam: '',
            exec_summary: '',
            impression: '',
            diff_diag: '',
            investigations: '',
            plan: '',
          });
          setComprehensiveReadOnly(false);
          setShowComprehensiveHistoryModal(true);
        }}
        style={{ alignSelf: 'flex-start', backgroundColor: isDark ? '#4caf50' : '#2e7d32', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 12 }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Comprehensive History</Text>
      </TouchableOpacity>
    );
  })()}
      </View>
      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: isDark ? '#23272e' : '#fff', borderRadius: 16, padding: 28, alignItems: 'center', width: 320 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#0a7ea4', marginBottom: 18 }}>Scan to Import Patient</Text>
            <QRCode
              value={JSON.stringify({ id, firstName, lastName, age, ageMode, sex, ward, ipNumber, diagnosis })}
              size={200}
              backgroundColor={isDark ? '#23272e' : '#fff'}
              color={isDark ? '#fff' : '#0a7ea4'}
            />
            <Text style={{ color: isDark ? '#aaa' : '#333', fontSize: 15, marginTop: 18, textAlign: 'center' }}>
              Let another user scan this QR in their app to import this patient profile.
            </Text>
            <TouchableOpacity
              style={{ marginTop: 22, backgroundColor: isDark ? '#2196F3' : '#0a7ea4', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 }}
              onPress={() => setShowQRModal(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.buttonRow}>
        {wardRoundDraft && (
          // If a draft exists and at least one required field is incomplete, show Resume Ward Round in red
          (!wardRoundDraft.text || !wardRoundDraft.doctor || !wardRoundDraft.complaints) ? (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: '#d32f2f' }, // Red
              ]}
              onPress={handleResumeWardRound}
            >
              <Text style={[styles.actionButtonText, { color: '#fff' }]}>Resume Ward Round</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: isDark ? '#2196F3' : '#0a7ea4' },
              ]}
              onPress={() => setWardRoundModal(true)}
            >
              <Text style={styles.actionButtonText}>Add Ward Rounds</Text>
            </TouchableOpacity>
          )
        )}
        {!wardRoundDraft && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? '#2196F3' : '#0a7ea4' },
            ]}
            onPress={() => setWardRoundModal(true)}
          >
            <Text style={styles.actionButtonText}>Add Ward Rounds</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isDark ? '#388e3c' : '#e8f5e9' },
          ]}
          onPress={() => setShowWardRoundsModal(true)}
        >
          <Text style={[
            styles.actionButtonText,
            { color: isDark ? '#fff' : '#388e3c' }
          ]}>View Ward Rounds</Text>
        </TouchableOpacity>
      </View>

      {/* To Do List */}
      <View style={{ marginHorizontal: 24, marginTop: 8 }}>
        <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
          To Do List
        </Text>
        {/* Add To Do Button below To Do List title */}
        <TouchableOpacity
          style={[
            styles.addToDoButton,
            { backgroundColor: isDark ? '#388e3c' : '#4caf50', marginBottom: 12 }
          ]}
          onPress={() => setShowToDoModal(true)}
        >
          <Text style={[
            styles.addToDoButtonText,
            { color: '#fff' }
          ]}>Add To Do</Text>
        </TouchableOpacity>
        {patientData?.todos && patientData.todos.length > 0 ? (
          (patientData.todos as Array<any>).map((todo: any, idx: number) => (
            <View
              key={todo.createdAt ? String(todo.createdAt) : String(idx)}
              style={{
                backgroundColor: isDark ? '#23272e' : '#f7fafd',
                borderRadius: 10,
                padding: 14,
                marginBottom: 10,
                borderLeftWidth: 4,
                borderLeftColor:
                  todo.type === 'LAB'
                    ? (isDark ? '#ffb300' : '#ff9800')
                    : todo.type === 'IMAGING'
                    ? (isDark ? '#1976d2' : '#2196F3')
                    : (isDark ? '#43a047' : '#4caf50'),
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: isDark ? '#fff' : '#111', fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>
                  {idx + 1}. {todo.title}
                </Text>
                <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 14, marginBottom: 2 }}>
                  {todo.type}
                </Text>
                {todo.details ? (
                  <Text style={{ color: isDark ? '#ccc' : '#444', fontSize: 15, marginTop: 2 }}>
                    {todo.details}
                  </Text>
                ) : null}
                <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 12, marginTop: 6 }}>
                  {new Date(todo.createdAt).toLocaleString()}
                </Text>
              </View>
              <View style={{ alignItems: 'center', minWidth: 70 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 0, marginBottom: 4 }}>
                  {!todo.completed ? (
                    <>
                      {/* Complete */}
                      <TouchableOpacity
                        onPress={() => openCompleteModal(idx)}
                        style={{ marginHorizontal: 6 }}
                        accessibilityLabel="Complete"
                      >
                        <Ionicons name="checkmark-done-circle-outline" size={30} color={isDark ? '#43a047' : '#388e3c'} />
                      </TouchableOpacity>
                      {/* Edit */}
                      <TouchableOpacity
                        onPress={() => openEditTodoModal(idx)}
                        style={{ marginHorizontal: 6 }}
                        accessibilityLabel="Edit"
                      >
                        <Ionicons name="create-outline" size={28} color={isDark ? '#90caf9' : '#1976d2'} />
                      </TouchableOpacity>
                      {/* Delete */}
                      <TouchableOpacity
                        onPress={() => openDeleteTodoModal(idx)}
                        style={{ marginHorizontal: 6 }}
                        accessibilityLabel="Delete"
                      >
                        <Ionicons name="trash-outline" size={28} color="#e53935" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      {/* Revert */}
                      <TouchableOpacity
                        onPress={() => openRevertTodoModal(idx)}
                        style={{ marginHorizontal: 6 }}
                        accessibilityLabel="Revert"
                      >
                        <Ionicons name="refresh-circle-outline" size={30} color={isDark ? '#ffb300' : '#ff9800'} />
                      </TouchableOpacity>
                      {/* View */}
                      <TouchableOpacity
                        onPress={() => handleViewTodo(idx)}
                        style={{ marginHorizontal: 6 }}
                        accessibilityLabel="View"
                      >
                        <Ionicons name="eye-outline" size={28} color={isDark ? '#90caf9' : '#1976d2'} />
                      </TouchableOpacity>
                      {/* Delete */}
                      <TouchableOpacity
                        onPress={() => openDeleteTodoModal(idx)}
                        style={{ marginHorizontal: 6 }}
                        accessibilityLabel="Delete"
                      >
                        <Ionicons name="trash-outline" size={28} color="#e53935" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                {/* Status badge below icons */}
                {!todo.completed ? (
                  <View style={{
                    backgroundColor: '#e53935',
                    borderRadius: 16,
                    paddingVertical: 3,
                    paddingHorizontal: 16,
                    alignSelf: 'center',
                  }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Pending</Text>
                  </View>
                ) : (
                  <View style={{
                    backgroundColor: '#43a047',
                    borderRadius: 16,
                    paddingVertical: 3,
                    paddingHorizontal: 16,
                    alignSelf: 'center',
                  }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Done</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 15, marginTop: 8 }}>
            No To Do items yet.
          </Text>
        )}
      </View>

      {/* To Do Modal */}
      <Modal
        visible={showToDoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowToDoModal(false)}
      >
        <View style={[styles.todoModalOverlay, { paddingHorizontal: 0 }]}>
          <View
            style={[
              styles.todoModalContainer,
              {
                backgroundColor: isDark ? '#23272e' : '#fff',
                borderRadius: 24,
                padding: 0,
                width: '96%',
                maxWidth: 420,
                shadowColor: isDark ? '#000' : '#2196F3',
                shadowOpacity: 0.18,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 12,
              },
            ]}
          >
            <View
              style={{
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                backgroundColor: isDark ? '#181a20' : '#e3f2fd',
                paddingVertical: 24,
                paddingHorizontal: 28,
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: isDark ? '#222' : '#e3f2fd',
              }}
            >
              <Ionicons name="clipboard-outline" size={36} color={isDark ? '#2196F3' : '#1976d2'} style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: isDark ? '#fff' : '#1976d2', marginBottom: 2 }}>
                Add To Do
              </Text>
              <Text style={{ color: isDark ? '#aaa' : '#1976d2', fontSize: 15 }}>
                Assign a task for this patient
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, paddingTop: 18, paddingBottom: 12 }}>
              {/* Dropdown */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderRadius: 10,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  marginBottom: 8,
                  borderColor: isDark ? '#2196F3' : '#0a7ea4',
                  backgroundColor: isDark ? '#181a20' : '#f2f2f2',
                  justifyContent: 'space-between',
                }}
                onPress={() => setToDoDropdownOpen(!toDoDropdownOpen)}
                activeOpacity={0.85}
              >
                <Text style={{ color: isDark ? '#fff' : '#111', fontSize: 16 }}>
                  {toDoType ? toDoType : 'Select Type'}
                </Text>
                <Ionicons
                  name={toDoDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={22}
                  color={isDark ? '#2196F3' : '#0a7ea4'}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
              {toDoDropdownOpen && (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: isDark ? '#2196F3' : '#0a7ea4',
                    borderRadius: 10,
                    marginTop: 2,
                    marginBottom: 12,
                    backgroundColor: isDark ? '#23272e' : '#fff',
                    overflow: 'hidden',
                  }}
                >
                  {['LAB', 'IMAGING', 'Comments'].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={{
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderBottomWidth: option !== 'Comments' ? 1 : 0,
                        borderBottomColor: isDark ? '#333' : '#eee',
                        backgroundColor:
                          toDoType === option
                            ? isDark
                              ? '#2196F3'
                              : '#e3f2fd'
                            : 'transparent',
                      }}
                      onPress={() => {
                        setToDoType(option);
                        setToDoDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={{
                          color: isDark
                            ? toDoType === option
                              ? '#fff'
                              : '#90caf9'
                            : toDoType === option
                            ? '#1976d2'
                            : '#111',
                          fontWeight: toDoType === option ? 'bold' : 'normal',
                          fontSize: 16,
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {/* Title input */}
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 16,
                  marginTop: 8,
                  marginBottom: 10,
                  color: isDark ? '#fff' : '#111',
                  borderColor: isDark ? '#2196F3' : '#0a7ea4',
                  backgroundColor: isDark ? '#23272e' : '#fff',
                }}
                placeholder="Title"
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                value={toDoTitle}
                onChangeText={setToDoTitle}
              />
              {/* Details input */}
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 16,
                  minHeight: 90,
                  marginBottom: 10,
                  color: isDark ? '#fff' : '#111',
                  borderColor: isDark ? '#2196F3' : '#0a7ea4',
                  backgroundColor: isDark ? '#23272e' : '#fff',
                }}
                placeholder="Details"
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                multiline
                numberOfLines={4}
                value={toDoDetails}
                onChangeText={setToDoDetails}
              />
              {/* Save and Cancel Buttons */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#e53935',
                    paddingVertical: 12,
                    paddingHorizontal: 28,
                    borderRadius: 8,
                    marginRight: 10,
                  }}
                  onPress={() => setShowToDoModal(false)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#43a047',
                    paddingVertical: 12,
                    paddingHorizontal: 28,
                    borderRadius: 8,
                  }}
                  onPress={() => {
                    // If ward round modal is open, add to tempTodos, else add to main todos
                    if (wardRoundModal) {
                      handleAddTempToDo();
                    } else {
                      handleAddMainTodo();
                    }
                  }}
                  disabled={!toDoType || !toDoTitle}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Ward Round Modal */}
      <Modal
        visible={wardRoundModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setWardRoundModal(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: isDark ? '#181a20' : '#fff' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#111', fontSize: 18, marginBottom: 6 }]}> 
              {`${firstName} ${lastName}`.trim() || 'Patient'} | Age: {age}{ageMode ? ` ${ageMode}` : ''} | Dx: {diagnosis || 'N/A'}
            </Text>
            <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 15, marginBottom: 10 }}>
              {(() => {
                if (!params.createdAt) return '';
                const admitDate = new Date(Number(params.createdAt));
                const now = new Date();
                const diff = Math.floor((now.getTime() - admitDate.getTime()) / (1000 * 60 * 60 * 24));
                return `Admitted: ${diff} day${diff === 1 ? '' : 's'} ago`;
              })()}
            </Text>
            <TextInput
              style={[ 
                styles.wardDoctorInput,
                { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', backgroundColor: isDark ? '#23272e' : '#fff' }
              ]}
              placeholder="Ward Doctor's Name"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={wardDoctor}
              onChangeText={setWardDoctor}
              autoCapitalize="words"
              returnKeyType="next"
            />
            {/* Today's Complaints input */}
            <TextInput
              style={[
                styles.wardDoctorInput,
                { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', backgroundColor: isDark ? '#23272e' : '#fff' }
              ]}
              placeholder="Today's Complaints"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={todaysComplaints}
              onChangeText={handleTodaysComplaintsChange}
              multiline
              numberOfLines={2}
              returnKeyType="next"
            />
            {/* Horizontal buttons below Today's Complaints */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10, marginTop: 4 }}>
              {['P', 'J', 'Cy', 'C', 'O', 'L', 'D'].map((label, idx) => (
                <TouchableOpacity
                  key={label}
                  style={{
                    backgroundColor: isDark ? '#2196F3' : '#e3f2fd',
                    borderRadius: 8,
                    paddingVertical: 6,
                    paddingHorizontal: 8,
                    marginRight: idx !== 6 ? 3 : 0,
                    alignItems: 'center',
                    minWidth: 26,
                    flexDirection: 'row',
                  }}
                  onPress={() => setShowPopup(label)}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 13 }}>{label}</Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: isDark ? '#fff' : '#1976d2',
                      marginLeft: 2,
                      lineHeight: 13,
                      position: 'relative',
                      top: -5,
                    }}
                  >
                    {buttonLevels[label] ? buttonLevels[label] : <Text style={{ fontSize: 9, color: '#888' }}>0</Text>}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Popup Modal for all buttons */}
            <Modal
              visible={!!showPopup}
              transparent
              animationType="fade"
              onRequestClose={() => setShowPopup(null)}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <View style={{ backgroundColor: isDark ? '#23272e' : '#fff', borderRadius: 14, padding: 24, alignItems: 'center', minWidth: 180 }}>
                  <Text style={{ fontSize: 17, fontWeight: 'bold', color: isDark ? '#fff' : '#1976d2', marginBottom: 16 }}>Select {showPopup} value</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    {['0', '+', '++', '+++'].map((p, i) => (
                      <TouchableOpacity
                        key={p}
                        style={{
                          backgroundColor: isDark ? '#2196F3' : '#e3f2fd',
                          borderRadius: 8,
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          marginHorizontal: i !== 3 ? 6 : 0,
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          if (showPopup) {
                            setButtonLevels(prev => ({ ...prev, [showPopup]: p === '0' ? '' : p }));
                          }
                          setShowPopup(null);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 18 }}>
                          {p}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={{ marginTop: 18 }}
                    onPress={() => setShowPopup(null)}
                  >
                    <Text style={{ color: isDark ? '#fff' : '#1976d2', fontSize: 15 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* On Examination input */}
            <TextInput
              style={[
                styles.wardDoctorInput,
                { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', backgroundColor: isDark ? '#23272e' : '#fff', marginTop: 2 }
              ]}
              placeholder="On Examination"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={onExamination}
              onChangeText={handleOnExaminationChange}
              multiline
              numberOfLines={3}
              returnKeyType="next"
            />

            {/* Vital Signs Section */}
            <View style={{ marginTop: 12, marginBottom: 8 }}>
              <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 6 }}>
                Vital Signs
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <TextInput
                  style={[
                    styles.wardDoctorInput,
                    {
                      flex: 1,
                      minWidth: 120,
                      marginRight: 8,
                      color: isDark ? '#fff' : '#111',
                      backgroundColor: isDark ? '#23272e' : '#fff',
                      borderColor: isDark ? '#444' : '#ccc',
                    },
                  ]}
                  placeholder="Blood Pressure (mmHg)"
                  placeholderTextColor={isDark ? '#aaa' : '#888'}
                  value={vitalBP}
                  onChangeText={setVitalBP}
                  keyboardType="default"
                  returnKeyType="next"
                />
                <TextInput
                  style={[
                    styles.wardDoctorInput,
                    {
                      flex: 1,
                      minWidth: 100,
                      marginRight: 8,
                      color: isDark ? '#fff' : '#111',
                      backgroundColor: isDark ? '#23272e' : '#fff',
                      borderColor: isDark ? '#444' : '#ccc',
                    },
                  ]}
                  placeholder="SPO2 (%)"
                  placeholderTextColor={isDark ? '#aaa' : '#888'}
                  value={vitalSPO2}
                  onChangeText={setVitalSPO2}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
                <TextInput
                  style={[
                    styles.wardDoctorInput,
                    {
                      flex: 1,
                      minWidth: 120,
                      marginRight: 8,
                      color: isDark ? '#fff' : '#111',
                      backgroundColor: isDark ? '#23272e' : '#fff',
                      borderColor: isDark ? '#444' : '#ccc',
                    },
                  ]}
                  placeholder="Respiratory Rate (/min)"
                  placeholderTextColor={isDark ? '#aaa' : '#888'}
                  value={vitalRR}
                  onChangeText={setVitalRR}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
                <TextInput
                  style={[
                    styles.wardDoctorInput,
                    {
                      flex: 1,
                      minWidth: 120,
                      marginRight: 8,
                      color: isDark ? '#fff' : '#111',
                      backgroundColor: isDark ? '#23272e' : '#fff',
                      borderColor: isDark ? '#444' : '#ccc',
                    },
                  ]}
                  placeholder="Pulse Rate (/min)"
                  placeholderTextColor={isDark ? '#aaa' : '#888'}
                  value={vitalPulse}
                  onChangeText={setVitalPulse}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
                <TextInput
                  style={[
                    styles.wardDoctorInput,
                    {
                      flex: 1,
                      minWidth: 120,
                      color: isDark ? '#fff' : '#111',
                      backgroundColor: isDark ? '#23272e' : '#fff',
                      borderColor: isDark ? '#444' : '#ccc',
                    },
                  ]}
                  placeholder="Temperature (°C)"
                  placeholderTextColor={isDark ? '#aaa' : '#888'}
                  value={vitalTemp}
                  onChangeText={setVitalTemp}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </View>
            <TextInput
              style={[
                styles.wardDoctorInput,
                { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', backgroundColor: isDark ? '#23272e' : '#fff', marginTop: 2 }
              ]}
              placeholder="Systemic Examination"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={systemicExamination}
              onChangeText={handleSystemicExaminationChange}
              multiline
              numberOfLines={3}
              returnKeyType="next"
            />
            <TextInput
              style={[
                styles.wardDoctorInput,
                { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', backgroundColor: isDark ? '#23272e' : '#fff', marginTop: 8 }
              ]}
              placeholder="Assessment"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={assessment}
              onChangeText={setAssessment}
              multiline
              numberOfLines={3}
              returnKeyType="next"
            />
            <TextInput
              style={[ 
                styles.wardRoundInput,
                { color: isDark ? '#fff' : '#111', borderColor: isDark ? '#444' : '#ccc', backgroundColor: isDark ? '#23272e' : '#fff' }
              ]}
              placeholder="Type ward round notes here..."
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={wardRoundText}
              onChangeText={handleWardRoundTextChange}
              multiline
              textAlignVertical="top"
              numberOfLines={10}
            />

            {/* Attach File button for ward round */}
            <TouchableOpacity
              style={{
                backgroundColor: isDark ? '#2196F3' : '#e3f2fd',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 20,
                alignItems: 'center',
                marginBottom: 10,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                gap: 8,
                marginTop: 6,
              }}
              onPress={() => {
                setShowAttachModal(true);
                setPendingAttachmentForWardRound(true);
              }}
            >
              <Ionicons name="attach" size={20} color={isDark ? '#fff' : '#1976d2'} style={{ marginRight: 6 }} />
              <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 15 }}>
                Attach File ({wardRoundAttachments.length})
              </Text>
            </TouchableOpacity>
            {/* Display attached files for ward round */}
            {wardRoundAttachments.length > 0 && (
              <View style={{ marginBottom: 12, width: '100%' }}>
                <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 6 }}>
                  Attached Files:
                </Text>
                {wardRoundAttachments.map((file, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: isDark ? '#23272e' : '#e3f2fd',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 6,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 14 }}>
                        {idx + 1}. {file.name}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setWardRoundAttachments(wardRoundAttachments.filter((_, i) => i !== idx));
                      }}
                      style={{ padding: 4 }}
                    >
                      <Ionicons name="close-circle" size={24} color="#e53935" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {/* Add To Do Button for Ward Round */}
            <TouchableOpacity
              style={{
                backgroundColor: isDark ? '#388e3c' : '#4caf50',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
                width: '48%',
                alignSelf: 'flex-start'
              }}
              onPress={() => {
                // Open To Do modal for temp todos (ward round context)
                setShowToDoModal(true);
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Add To Do</Text>
            </TouchableOpacity>
            {/* Display temp todos beneath Add To Do button until saved */}
            {tempTodos.length > 0 && (
              <View style={{ marginBottom: 12, width: '100%' }}>
                <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 6 }}>
                  To Dos (pending save):
                </Text>
                {tempTodos.map((todo, idx) => (
                  <View key={idx} style={{ backgroundColor: isDark ? '#23272e' : '#e3f2fd', borderRadius: 8, padding: 10, marginBottom: 6 }}>
                    <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 14 }}>{todo.type}: {todo.title}</Text>
                    {todo.details ? (
                      <Text style={{ color: isDark ? '#aaa' : '#333', fontSize: 13, marginTop: 2 }}>{todo.details}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
            {/* Save and Cancel Buttons */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: isDark ? '#2196F3' : '#0a7ea4', marginTop: 16 }]}
              onPress={handleSaveWardRound}
              disabled={!wardRoundText}
            >
              <Text style={styles.actionButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#888', marginTop: 8 }]}
              onPress={() => {
                setWardRoundModal(false);
                setTempTodos([]);
              }}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* To Do Modal */}
      <Modal
        visible={showToDoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowToDoModal(false)}
      >
        <View style={[styles.todoModalOverlay, { paddingHorizontal: 0 }]}>
          <View
            style={[
              styles.todoModalContainer,
              {
                backgroundColor: isDark ? '#23272e' : '#fff',
                borderRadius: 24,
                padding: 0,
                width: '96%',
                maxWidth: 420,
                shadowColor: isDark ? '#000' : '#2196F3',
                shadowOpacity: 0.18,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 12,
              },
            ]}
          >
            <View
              style={{
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                backgroundColor: isDark ? '#181a20' : '#e3f2fd',
                paddingVertical: 24,
                paddingHorizontal: 28,
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: isDark ? '#222' : '#e3f2fd',
              }}
            >
              <Ionicons name="clipboard-outline" size={36} color={isDark ? '#2196F3' : '#1976d2'} style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: isDark ? '#fff' : '#1976d2', marginBottom: 2 }}>
                Add To Do
              </Text>
              <Text style={{ color: isDark ? '#aaa' : '#1976d2', fontSize: 15 }}>
                Assign a task for this patient
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, paddingTop: 18, paddingBottom: 12 }}>
              {/* Dropdown */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderRadius: 10,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  marginBottom: 8,
                  borderColor: isDark ? '#2196F3' : '#0a7ea4',
                  backgroundColor: isDark ? '#181a20' : '#f2f2f2',
                  justifyContent: 'space-between',
                }}
                onPress={() => setToDoDropdownOpen(!toDoDropdownOpen)}
                activeOpacity={0.85}
              >
                <Text style={{ color: isDark ? '#fff' : '#111', fontSize: 16 }}>
                  {toDoType ? toDoType : 'Select Type'}
                </Text>
                <Ionicons
                  name={toDoDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={22}
                  color={isDark ? '#2196F3' : '#0a7ea4'}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
              {toDoDropdownOpen && (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: isDark ? '#2196F3' : '#0a7ea4',
                    borderRadius: 10,
                    marginTop: 2,
                    marginBottom: 12,
                    backgroundColor: isDark ? '#23272e' : '#fff',
                    overflow: 'hidden',
                  }}
                >
                  {['LAB', 'IMAGING', 'Comments'].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={{
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderBottomWidth: option !== 'Comments' ? 1 : 0,
                        borderBottomColor: isDark ? '#333' : '#eee',
                        backgroundColor:
                          toDoType === option
                            ? isDark
                              ? '#2196F3'
                              : '#e3f2fd'
                            : 'transparent',
                      }}
                      onPress={() => {
                        setToDoType(option);
                        setToDoDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={{
                          color: isDark
                            ? toDoType === option
                              ? '#fff'
                              : '#90caf9'
                            : toDoType === option
                            ? '#1976d2'
                            : '#111',
                          fontWeight: toDoType === option ? 'bold' : 'normal',
                          fontSize: 16,
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {/* Title input */}
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 16,
                  marginTop: 8,
                  marginBottom: 10,
                  color: isDark ? '#fff' : '#111',
                  borderColor: isDark ? '#2196F3' : '#0a7ea4',
                  backgroundColor: isDark ? '#23272e' : '#fff',
                }}
                placeholder="Title"
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                value={toDoTitle}
                onChangeText={setToDoTitle}
              />
              {/* Details input */}
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 16,
                  minHeight: 90,
                  marginBottom: 10,
                  color: isDark ? '#fff' : '#111',
                  borderColor: isDark ? '#2196F3' : '#0a7ea4',
                  backgroundColor: isDark ? '#23272e' : '#fff',
                }}
                placeholder="Details"
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                multiline
                numberOfLines={4}
                value={toDoDetails}
                onChangeText={setToDoDetails}
              />
              {/* Save and Cancel Buttons */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#e53935',
                    paddingVertical: 12,
                    paddingHorizontal: 28,
                    borderRadius: 8,
                    marginRight: 10,
                  }}
                  onPress={() => setShowToDoModal(false)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#43a047',
                    paddingVertical: 12,
                    paddingHorizontal: 28,
                    borderRadius: 8,
                  }}
                  onPress={() => {
                    // If ward round modal is open, add to tempTodos, else add to main todos
                    if (wardRoundModal) {
                      handleAddTempToDo();
                    } else {
                      handleAddMainTodo();
                    }
                  }}
                  disabled={!toDoType || !toDoTitle}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Complete To Do Modal */}
      <Modal
        visible={showCompleteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: '92%',
            maxWidth: 420,
            backgroundColor: isDark ? '#23272e' : '#fff',
            borderRadius: 20,
            padding: 24,
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: isDark ? '#fff' : '#1976d2',
              marginBottom: 16,
              alignSelf: 'center'
            }}>
              Complete To Do
            </Text>
            {/* Numbered toggle */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <TouchableOpacity
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: isDark ? '#2196F3' : '#0a7ea4',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                  backgroundColor: completeNumbered ? (isDark ? '#2196F3' : '#0a7ea4') : 'transparent',
                }}
                onPress={() => setCompleteNumbered(!completeNumbered)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: completeNumbered }}
              >
                {completeNumbered && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </TouchableOpacity>
              <Text style={{ color: isDark ? '#fff' : '#111', fontSize:  16 }}>
                Number each line
              </Text>
            </View>
            {/* Results input */}
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 14,
                fontSize: 16,
                minHeight: 90,
                marginBottom: 14,
                color: isDark ? '#fff' : '#111',
                borderColor: isDark ? '#2196F3' : '#0a7ea4',
                backgroundColor: isDark ? '#23272e' : '#fff',
              }}
              placeholder="Write results here..."
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={completeText}
              onChangeText={handleCompleteTextChange}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {/* Attach file button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#888',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 20,
                alignItems: 'center',
                marginBottom: 14,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                gap: 8,
              }}
              onPress={handleAttachFile}
            >
              <Ionicons name="clipboard-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                Attach Files ({attachedFiles.length})
              </Text>
            </TouchableOpacity>
            {/* Display attached files */}
            {attachedFiles.length > 0 && (
              <View style={{ marginBottom: 14, width: '100%' }}>
                <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 6 }}>
                  Attached Files:
                </Text>
                {attachedFiles.map((file, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: isDark ? '#23272e' : '#e3f2fd',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 6,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 14 }}>
                        {idx + 1}. {file.name}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setAttachedFiles(attachedFiles.filter((_, i) => i !== idx));
                      }}
                      style={{ padding: 4 }}
                    >
                      <Ionicons name="close-circle" size={24} color="#e53935" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {/* Submit and Cancel buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#e53935',
                  paddingVertical: 12,
                  paddingHorizontal: 28,
                  borderRadius: 8,
                  marginRight: 10,
                }}
                onPress={() => setShowCompleteModal(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#43a047',
                  paddingVertical: 12,
                  paddingHorizontal: 28,
                  borderRadius: 8,
                }}
                onPress={handleSubmitComplete}
                disabled={!completeText}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Attach File Modal */}
      <Modal
        visible={showAttachModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAttachModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: 320,
            backgroundColor: isDark ? '#23272e' : '#fff',
            borderRadius: 18,
            padding: 24,
            alignItems: 'stretch',
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: isDark ? '#fff' : '#1976d2',
              marginBottom: 18,
              alignSelf: 'center'
            }}>
              Attach File
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: isDark ? '#2196F3' : '#0a7ea4',
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 12,
              }}
              onPress={handleTakePhoto}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: isDark ? '#388e3c' : '#4caf50',
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 12,
              }}
              onPress={handleChooseFromGallery}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#e53935',
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 0,
              }}
              onPress={() => setShowAttachModal(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit To Do Modal */}
      <Modal
        visible={showEditTodoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditTodoModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: '92%',
            maxWidth: 420,
            backgroundColor: isDark ? '#23272e' : '#fff',
            borderRadius: 20,
            padding: 24,
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: isDark ? '#fff' : '#1976d2',
              marginBottom: 16,
              alignSelf: 'center'
            }}>
              Edit To Do
            </Text>
            {/* Dropdown for type */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1.5,
                borderRadius: 10,
                paddingVertical: 14,
                paddingHorizontal: 16,
                marginBottom: 8,
                borderColor: isDark ? '#2196F3' : '#0a7ea4',
                backgroundColor: isDark ? '#181a20' : '#f2f2f2',
                justifyContent: 'space-between',
              }}
              onPress={() => setEditTodoDropdownOpen(!editTodoDropdownOpen)}
              activeOpacity={0.85}
            >
              <Text style={{ color: isDark ? '#fff' : '#111', fontSize: 16 }}>
                {editTodoType ? editTodoType : 'Select Type'}
              </Text>
              <Ionicons
                name={editTodoDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={22}
                color={isDark ? '#2196F3' : '#0a7ea4'}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            {editTodoDropdownOpen && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? '#2196F3' : '#0a7ea4',
                  borderRadius: 10,
                  marginTop: 2,
                  marginBottom: 12,
                  backgroundColor: isDark ? '#23272e' : '#fff',
                  overflow: 'hidden',
                }}
              >
                {['LAB', 'IMAGING', 'Comments'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={{
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderBottomWidth: option !== 'Comments' ? 1 : 0,
                      borderBottomColor: isDark ? '#333' : '#eee',
                      backgroundColor:
                        editTodoType === option
                          ? isDark
                            ? '#2196F3'
                            : '#e3f2fd'
                          : 'transparent',
                    }}
                    onPress={() => {
                      setEditTodoType(option);
                      setEditTodoDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={{
                        color: isDark
                          ? editTodoType === option
                            ? '#fff'
                            : '#90caf9'
                          : editTodoType === option
                          ? '#1976d2'
                          : '#111',
                        fontWeight: editTodoType === option ? 'bold' : 'normal',
                        fontSize: 16,
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {/* Title input */}
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 14,
                fontSize: 16,
                marginTop: 8,
                marginBottom: 10,
                color: isDark ? '#fff' : '#111',
                borderColor: isDark ? '#2196F3' : '#0a7ea4',
                backgroundColor: isDark ? '#23272e' : '#fff',
              }}
              placeholder="Title"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={editTodoTitle}
              onChangeText={setEditTodoTitle}
            />
            {/* Details input */}
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 14,
                fontSize: 16,
                minHeight: 90,
                marginBottom: 10,
                color: isDark ? '#fff' : '#111',
                borderColor: isDark ? '#2196F3' : '#0a7ea4',
                backgroundColor: isDark ? '#23272e' : '#fff',
              }}
              placeholder="Details"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              multiline
              numberOfLines={4}
              value={editTodoDetails}
              onChangeText={setEditTodoDetails}
            />
            {/* Save and Cancel Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#e53935',
                  paddingVertical: 12,
                  paddingHorizontal: 28,
                  borderRadius: 8,
                  marginRight: 10,
                }}
                onPress={() => setShowEditTodoModal(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#43a047',
                  paddingVertical: 12,
                  paddingHorizontal: 28,
                  borderRadius: 8,
                }}
                onPress={handleSaveEditTodo}
                disabled={!editTodoType || !editTodoTitle}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete To Do Confirmation Modal */}
      <Modal
        visible={showDeleteTodoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeleteTodoModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: 320,
            backgroundColor: isDark ? '#23272e' : '#fff',
            borderRadius: 18,
            padding: 24,
            alignItems: 'center',
            elevation: 10,
          }}>
            <Ionicons name="warning-outline" size={48} color={isDark ? '#ffb4b4' : '#d32f2f'} style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#d32f2f', marginBottom: 10, textAlign: 'center' }}>
              Delete To Do?
            </Text>
            <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
              Are you sure you want to delete this To Do item? This action cannot be undone.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#e53935',
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  marginRight: 12,
                }}
                onPress={confirmDeleteTodo}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: isDark ? '#444' : '#ccc',
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                }}
                onPress={() => setShowDeleteTodoModal(false)}
              >
                <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Revert To Do Confirmation Modal */}
      <Modal
        visible={showRevertTodoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowRevertTodoModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: 320,
            backgroundColor: isDark ? '#23272e' : '#fff',
            borderRadius: 18,
            padding: 24,
            alignItems: 'center',
            elevation: 10,
          }}>
            <Ionicons name="warning-outline" size={48} color={isDark ? '#ffe082' : '#ffb300'} style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#ff9800', marginBottom: 10, textAlign: 'center' }}>
              Revert To Do?
            </Text>
            <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
              Are you sure you want to mark this To Do as not completed?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: isDark ? '#ffb300' : '#ff9800',
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  marginRight: 12,
                }}
                onPress={confirmRevertTodo}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Revert</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: isDark ? '#444' : '#ccc',
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                }}
                onPress={() => setShowRevertTodoModal(false)}
              >
                <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View To Do Modal */}
      <Modal
        visible={showViewTodoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowViewTodoModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: '92%',
            maxWidth: 420,
            backgroundColor: isDark ? '#23272e' : '#fff',
            borderRadius: 20,
            padding: 24,
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: isDark ? '#fff' : '#1976d2',
              marginBottom: 16,
              alignSelf: 'center'
            }}>
              To Do Result
            </Text>
            {viewTodoIdx !== null && patientData?.todos?.[viewTodoIdx] && (
              <>
                <Text style={{ color: isDark ? '#fff' : '#111', fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                  {patientData.todos[viewTodoIdx].title}
                </Text>
                <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 14, marginBottom: 8 }}>
                  {patientData.todos[viewTodoIdx].type}
                </Text>
                {patientData.todos[viewTodoIdx].details ? (
                  <Text style={{ color: isDark ? '#ccc' : '#444', fontSize: 15, marginBottom: 8 }}>
                    {patientData.todos[viewTodoIdx].details}
                  </Text>
                ) : null}
                <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 13, marginBottom: 10 }}>
                  Created: {new Date(patientData.todos[viewTodoIdx].createdAt).toLocaleString()}
                </Text>
                {patientData.todos[viewTodoIdx].completed && (
                  <>
                    <Text style={{ color: isDark ? '#43a047' : '#388e3c', fontWeight: 'bold', fontSize: 14, marginTop: 2 }}>
                      Result:
                    </Text>
                    <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 14, marginBottom: 2 }}>
                      {patientData.todos[viewTodoIdx].result}
                    </Text>
                    {patientData.todos[viewTodoIdx].attachedFiles && patientData.todos[viewTodoIdx].attachedFiles.length > 0 && (
                      <TouchableOpacity
                        onPress={() => handleViewAttachment(patientData.todos[viewTodoIdx].attachedFiles[0].uri)}
                        style={{
                          marginTop: 10,
                          alignSelf: 'flex-start',
                          backgroundColor: isDark ? '#181a20' : '#e3f2fd',
                          borderRadius: 8,
                          padding: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Ionicons name="image-outline" size={18} color={isDark ? '#2196F3' : '#1976d2'} style={{ marginRight: 6 }} />
                        <Text style={{ color: isDark ? '#2196F3' : '#1976d2', fontWeight: 'bold', fontSize: 14 }}>
                          View Attached File
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: '#888',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 28,
                alignItems: 'center',
                marginTop: 18,
                alignSelf: 'flex-end'
              }}
              onPress={() => setShowViewTodoModal(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View Ward Rounds Modal */}
      <Modal
        visible={showWardRoundsModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowWardRoundsModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: isDark ? '#23272e' : '#fff',
          padding: 0,
        }}>
          <View style={{
            flex: 1,
            backgroundColor: isDark ? '#23272e' : '#fff',
            borderRadius: 0,
            padding: 0,
            elevation: 0,
            maxWidth: '100%',
            width: '100%',
            maxHeight: '100%',
          }}>
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: isDark ? '#fff' : '#1976d2',
              marginBottom: 16,
              alignSelf: 'center'
            }}>
              Ward Round Sessions
            </Text>
            <ScrollView style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              {patientData?.wardRounds && patientData.wardRounds.length > 0 ? (
                (() => {
                  // Group ward rounds by date (YYYY-MM-DD)
                  const groupedByDate = patientData.wardRounds.reduce((acc: any, wr: any, idx: number) => {
                    const date = new Date(wr.createdAt);
                    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    if (!acc[dateKey]) {
                      acc[dateKey] = [];
                    }
                    acc[dateKey].push({ wr, idx });
                    return acc;
                  }, {});

                  // Sort dates in descending order (newest first)
                  const sortedDates = Object.keys(groupedByDate).sort().reverse();

                  return sortedDates.map((dateKey) => {
                    const date = new Date(dateKey);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const dayNum = date.getDate();
                    const suffix = dayNum % 10 === 1 && dayNum !== 11 ? 'st' : dayNum % 10 === 2 && dayNum !== 12 ? 'nd' : dayNum % 10 === 3 && dayNum !== 13 ? 'rd' : 'th';
                    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                    const year = date.getFullYear();
                    const displayDate = `${dayName} ${dayNum}${suffix} ${monthName} ${year}`;

                    const isExpanded = expandedDates[dateKey] ?? true; // Default to expanded

                    return (
                      <View key={dateKey} style={{ marginBottom: 16 }}>
                        {/* Date Header (Collapsible) */}
                        {(() => {
                          const dateWardRoundIndices = groupedByDate[dateKey].map((item: any) => item.idx);
                          const allSelected = dateWardRoundIndices.every((idx: number) => selectedWardRoundIndices.includes(idx));
                          const someSelected = dateWardRoundIndices.some((idx: number) => selectedWardRoundIndices.includes(idx));
                          
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setExpandedDates((prev) => ({
                                  ...prev,
                                  [dateKey]: !prev[dateKey],
                                }));
                              }}
                              onLongPress={() => {
                                // Select/Deselect all ward rounds for this date
                                if (allSelected) {
                                  // Deselect all for this date
                                  setSelectedWardRoundIndices(prev => 
                                    prev.filter(idx => !dateWardRoundIndices.includes(idx))
                                  );
                                } else {
                                  // Select all for this date
                                  setSelectedWardRoundIndices(prev => {
                                    const newSelection = [...prev];
                                    dateWardRoundIndices.forEach((idx: number) => {
                                      if (!newSelection.includes(idx)) {
                                        newSelection.push(idx);
                                      }
                                    });
                                    return newSelection;
                                  });
                                }
                              }}
                              style={{
                                backgroundColor: allSelected 
                                  ? (isDark ? '#0d47a1' : '#2196F3') 
                                  : someSelected
                                  ? (isDark ? '#1976d2' : '#64B5F6')
                                  : (isDark ? '#2196F3' : '#1976d2'),
                                borderRadius: 10,
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 8,
                                borderWidth: allSelected ? 2 : someSelected ? 1 : 0,
                                borderColor: allSelected 
                                  ? '#fff'
                                  : someSelected
                                  ? (isDark ? '#90caf9' : '#fff')
                                  : 'transparent',
                              }}
                            >
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                {allSelected && (
                                  <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color="#fff"
                                  />
                                )}
                                {someSelected && !allSelected && (
                                  <Ionicons
                                    name="remove-circle"
                                    size={24}
                                    color="#fff"
                                  />
                                )}
                                <Text style={{
                                  color: '#fff',
                                  fontWeight: 'bold',
                                  fontSize: 16,
                                }}>
                                  {displayDate}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Text style={{ color: '#fff', fontSize: 14 }}>
                                  {allSelected ? `${groupedByDate[dateKey].length}/${groupedByDate[dateKey].length}` : someSelected ? `${dateWardRoundIndices.filter((idx: number) => selectedWardRoundIndices.includes(idx)).length}/${groupedByDate[dateKey].length}` : groupedByDate[dateKey].length}
                                </Text>
                                <Ionicons
                                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                  size={24}
                                  color="#fff"
                                />
                              </View>
                            </TouchableOpacity>
                          );
                        })()}

                        {/* Ward Rounds for this date (Collapsible) */}
                        {isExpanded && groupedByDate[dateKey].map(({ wr, idx }: any) => {
                          const isSelected = selectedWardRoundIndices.includes(idx);
                          return (
                            <TouchableOpacity
                              key={wr.createdAt || idx}
                              activeOpacity={0.85}
                              onLongPress={() => toggleWardRoundSelection(idx)}
                              style={{
                                marginBottom: 12,
                                padding: 14,
                                borderRadius: 10,
                                backgroundColor: isSelected ? (isDark ? '#0d47a1' : '#bbdefb') : (isDark ? '#181a20' : '#f7fafd'),
                                borderLeftWidth: 4,
                                borderLeftColor: isSelected ? (isDark ? '#fff' : '#1976d2') : (isDark ? '#2196F3' : '#1976d2'),
                                borderWidth: isSelected ? 2 : 0,
                                borderColor: isSelected ? (isDark ? '#fff' : '#1976d2') : 'transparent',
                                position: 'relative',
                                marginLeft: 8,
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
                              {/* Ward Round Doctor and Time */}
                              <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
                                Ward Round by {wr.doctor || 'Unknown'}
                              </Text>
                              <Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 13, marginBottom: 8 }}>
                                {new Date(wr.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                              </Text>

                              {/* Complaints */}
                              {wr.complaints ? (
                                <>
                                  <Text style={{ color: isDark ? '#ffb300' : '#ff9800', fontWeight: 'bold', fontSize: 15, marginBottom: 2, marginTop: 8 }}>
                                    Complaints
                                  </Text>
                                  <Text style={{ color: isDark ? '#ffb300' : '#ff9800', fontSize: 15, marginBottom: 4, marginTop: 2 }}>
                                    {wr.complaints}
                                  </Text>
                                </>
                              ) : null}

                              {/* General Signs */}
                              {wr.buttonLevels && typeof wr.buttonLevels === 'object' && (
                                <>
                                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 2, marginTop: 8 }}>
                                    General Signs
                                  </Text>
                                  <View style={{ flexDirection: 'row', marginBottom: 6, marginTop: 2 }}>
                                    {['P', 'J', 'Cy', 'C', 'O', 'L', 'D'].map((label, idx) => {
                                      const value = wr.buttonLevels[label];
                                      return (
                                        <View
                                          key={label}
                                          style={{
                                            backgroundColor: isDark ? '#2196F3' : '#e3f2fd',
                                            borderRadius: 10,
                                            paddingVertical: 8,
                                            paddingHorizontal: 14,
                                            marginRight: idx !== 6 ? 8 : 0,
                                            alignItems: 'center',
                                            minWidth: 36,
                                            flexDirection: 'row',
                                          }}
                                        >
                                          <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 16 }}>
                                            {label}
                                            <Text
                                              style={{
                                                fontSize: 15,
                                                color: isDark ? '#fff' : '#1976d2',
                                                marginLeft: 2,
                                                lineHeight: 18,
                                                position: 'relative',
                                                top: -7,
                                              }}
                                            >
                                              {value ? value : '0'}
                                            </Text>
                                          </Text>
                                        </View>
                                      );
                                    })}
                                  </View>
                                </>
                              )}

                              {/* On Examination */}
                              {wr.onExamination ? (
                                <>
                                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 2, marginTop: 8 }}>
                                    On Examination
                                  </Text>
                                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 15, marginBottom: 2, marginTop: 2 }}>
                                    {wr.onExamination}
                                  </Text>
                                </>
                              ) : null}

                              {/* Systemic Examination */}
                              {wr.systemicExamination ? (
                                <>
                                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 2, marginTop: 8 }}>
                                    Systemic Examination
                                  </Text>
                                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 15, marginBottom: 2, marginTop: 2 }}>
                                    {wr.systemicExamination}
                                  </Text>
                                </>
                              ) : null}

                              {/* Attachments */}
                              {wr.attachments && wr.attachments.length > 0 && (
                                <View style={{ marginTop: 8 }}>
                                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 6 }}>
                                    Attachments ({wr.attachments.length}):
                                  </Text>
                                  {wr.attachments.map((attachment: any, aIdx: number) => (
                                    <TouchableOpacity
                                      key={aIdx}
                                      onPress={() => handleViewAttachment(attachment.uri)}
                                      style={{
                                        marginBottom: 6,
                                        alignSelf: 'flex-start',
                                        backgroundColor: isDark ? '#181a20' : '#e3f2fd',
                                        borderRadius: 8,
                                        padding: 6,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Ionicons name="image-outline" size={16} color={isDark ? '#2196F3' : '#1976d2'} style={{ marginRight: 4 }} />
                                      <Text style={{ color: isDark ? '#2196F3' : '#1976d2', fontWeight: 'bold', fontSize: 12 }}>
                                        {aIdx + 1}. {attachment.name}
                                      </Text>
                                    </TouchableOpacity>
                                  ))}
                                </View>
                              )}

                              {/* Vital Signs */}
                              {(wr.vitalBP || wr.vitalSPO2 || wr.vitalRR || wr.vitalPulse || wr.vitalTemp) ? (
                                <>
                                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 2, marginTop: 8 }}>
                                    Vital Signs
                                  </Text>
                                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                                    {wr.vitalBP ? (
                                      <Text style={{ color: isDark ? '#fff' : '#1976d2', fontSize: 14, marginRight: 12 }}>BP: {wr.vitalBP} mmHg</Text>
                                    ) : null}
                                    {wr.vitalSPO2 ? (
                                      <Text style={{ color: isDark ? '#fff' : '#1976d2', fontSize: 14, marginRight: 12 }}>SPO2: {wr.vitalSPO2}%</Text>
                                    ) : null}
                                    {wr.vitalRR ? (
                                      <Text style={{ color: isDark ? '#fff' : '#1976d2', fontSize: 14, marginRight: 12 }}>RR: {wr.vitalRR}/min</Text>
                                    ) : null}
                                    {wr.vitalPulse ? (
                                      <Text style={{ color: isDark ? '#fff' : '#1976d2', fontSize: 14, marginRight: 12 }}>Pulse: {wr.vitalPulse}/min</Text>
                                    ) : null}
                                    {wr.vitalTemp ? (
                                      <Text style={{ color: isDark ? '#fff' : '#1976d2', fontSize: 14, marginRight: 12 }}>Temp: {wr.vitalTemp}°C</Text>
                                    ) : null}
                                  </View>
                                </>
                              ) : null}

                              {/* Assessment */}
                              {wr.assessment ? (
                                <>
                                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 2, marginTop: 8 }}>
                                    Assessment
                                  </Text>
                                  <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 15, marginBottom: 8, marginTop: 2 }}>
                                    {wr.assessment}
                                  </Text>
                                </>
                              ) : null}

                              {/* Plan Section */}
                              <View style={{ marginTop: 12, marginBottom: 8 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15 }}>
                                    Plan
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => handleAddPlan(idx)}
                                    style={{
                                      backgroundColor: isDark ? '#2196F3' : '#1976d2',
                                      borderRadius: 6,
                                      paddingVertical: 6,
                                      paddingHorizontal: 12,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      gap: 4,
                                    }}
                                  >
                                    <Ionicons name="add-circle-outline" size={16} color="#fff" />
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Add Plan</Text>
                                  </TouchableOpacity>
                                </View>

                                {wr.plans && wr.plans.length > 0 ? (
                                  wr.plans.map((plan: any, pIdx: number) => (
                                    <View
                                      key={pIdx}
                                      style={{
                                        marginBottom: 8,
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: isDark ? '#23272e' : '#e3f2fd',
                                        borderLeftWidth: 3,
                                        borderLeftColor: isDark ? '#2196F3' : '#1976d2',
                                      }}
                                    >
                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 14, flex: 1, paddingRight: 8 }}>
                                          {pIdx + 1}. {plan.text}
                                        </Text>
                                        <View style={{ flexDirection: 'row', gap: 6 }}>
                                          <TouchableOpacity
                                            onPress={() => handleEditPlan(idx, pIdx, plan.text)}
                                            style={{
                                              backgroundColor: isDark ? '#1976d2' : '#90caf9',
                                              borderRadius: 4,
                                              padding: 4,
                                            }}
                                          >
                                            <Ionicons name="pencil" size={14} color="#fff" />
                                          </TouchableOpacity>
                                          <TouchableOpacity
                                            onPress={() => handleDeletePlan(idx, pIdx)}
                                            style={{
                                              backgroundColor: '#d32f2f',
                                              borderRadius: 4,
                                              padding: 4,
                                            }}
                                          >
                                            <Ionicons name="trash" size={14} color="#fff" />
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    </View>
                                  ))
                                ) : (
                                  <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 13, fontStyle: 'italic' }}>
                                    No plans added yet
                                  </Text>
                                )}
                              </View>

                              {/* Main Notes */}
                              <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: 'bold', fontSize: 15, marginBottom: 2, marginTop: 8 }}>
                                Main Notes
                              </Text>
                              <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 15, marginBottom: 8, marginTop: 2 }}>
                                {wr.text}
                              </Text>

                              {/* To Dos */}
                              {wr.todos && wr.todos.length > 0 && (
                                <View style={{ marginTop: 4 }}>
                                  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>
                                    To Dos:
                                  </Text>
                                  {Array.isArray(wr.todos) && wr.todos.map((todo: any, tIdx: number) => {
                                    const globalTodo = (patientData.todos || []).find((pt: any) => pt.createdAt === todo.createdAt);
                                    const isCompleted = globalTodo?.completed;
                                    return (
                                      <View key={todo.createdAt || tIdx} style={{
                                        marginBottom: 8,
                                        padding: 8,
                                        borderRadius: 8,
                                        backgroundColor: isDark ? '#23272e' : '#e3f2fd'
                                      }}>
                                        <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 15 }}>
                                          {tIdx + 1}. {todo.title} <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13 }}>({todo.type})</Text>
                                        </Text>
                                        {todo.details ? (
                                          <Text style={{ color: isDark ? '#ccc' : '#444', fontSize: 14, marginTop: 2 }}>
                                            {todo.details}
                                          </Text>
                                        ) : null}
                                        <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 13, marginTop: 2 }}>
                                          {isCompleted ? 'Done' : 'Pending'}
                                        </Text>
                                        {isCompleted && (
                                          <>
                                            <Text style={{ color: isDark ? '#43a047' : '#388e3c', fontWeight: 'bold', fontSize: 14, marginTop: 2 }}>
                                              Result:
                                            </Text>
                                            <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 14, marginBottom: 2 }}>
                                              {globalTodo?.result}
                                            </Text>
                                            {globalTodo?.attachedFiles && globalTodo.attachedFiles.length > 0 && (
                                              <View style={{ marginTop: 6 }}>
                                                <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>
                                                  Files ({globalTodo.attachedFiles.length}):
                                                </Text>
                                                {globalTodo.attachedFiles.map((file: any, fIdx: number) => (
                                                  <TouchableOpacity
                                                    key={fIdx}
                                                    onPress={() => handleViewAttachment(file.uri)}
                                                    style={{
                                                      marginBottom: 4,
                                                      alignSelf: 'flex-start',
                                                      backgroundColor: isDark ? '#181a20' : '#e3f2fd',
                                                      borderRadius: 6,
                                                      padding: 6,
                                                      flexDirection: 'row',
                                                      alignItems: 'center',
                                                    }}
                                                  >
                                                    <Ionicons name="image-outline" size={16} color={isDark ? '#2196F3' : '#1976d2'} style={{ marginRight: 4 }} />
                                                    <Text style={{ color: isDark ? '#2196F3' : '#1976d2', fontWeight: 'bold', fontSize: 12 }}>
                                                      {fIdx + 1}. {file.name}
                                                    </Text>
                                                  </TouchableOpacity>
                                                ))}
                                              </View>
                                            )}
                                          </>
                                        )}
                                      </View>
                                    );
                                  })}
                                </View>
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    );
                  });
                })()
              ) : (
                <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 16, textAlign: 'center', marginTop: 24 }}>
                  No ward round sessions yet.
                </Text>
              )}
            </ScrollView>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: isDark ? '#333' : '#ddd', backgroundColor: isDark ? '#181a20' : '#f7fafd' }}>
              {/* Selection indicator */}
              {selectedWardRounds.length > 0 && (
                <View style={{ marginBottom: 12, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: isDark ? '#2196F3' : '#e3f2fd', borderRadius: 8 }}>
                  <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 14 }}>
                    {selectedWardRounds.length} Ward Round{selectedWardRounds.length !== 1 ? 's' : ''} Selected
                  </Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                {selectedWardRounds.length > 0 && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#ff9800',
                      borderRadius: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      alignItems: 'center',
                      flex: 0.3,
                    }}
                    onPress={() => setSelectedWardRounds([])}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Clear</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{
                    backgroundColor: isDark ? '#2196F3' : '#1976d2',
                    borderRadius: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 28,
                    alignItems: 'center',
                    flex: selectedWardRounds.length > 0 ? 1 : 0.6,
                  }}
                  onPress={async () => {
                    if (selectedWardRounds.length > 0) {
                      if (!patientData?.wardRounds) return;
                      const rounds = selectedWardRounds.map(idx => patientData.wardRounds[idx]);
                      if (!rounds.length) {
                        alert('No ward rounds selected.');
                        return;
                      }

                      try {
                        // Build simple plain-text representation for export
                        let txt = `Ward Round Report - ${firstName} ${lastName}\n\n`;
                        rounds.forEach((wr: any) => {
                          const wrDate = new Date(wr.createdAt);
                          txt += `${wrDate.toLocaleString()} - Dr. ${wr.doctor || 'Unknown'}\n`;
                          if (wr.complaints) txt += `Complaints: ${wr.complaints}\n`;
                          if (wr.onExamination) txt += `On Examination: ${wr.onExamination}\n`;
                          if (wr.systemicExamination) txt += `Systemic Examination: ${wr.systemicExamination}\n`;
                          if (wr.assessment) txt += `Assessment: ${wr.assessment}\n`;
                          if (wr.vitalBP || wr.vitalSPO2 || wr.vitalRR || wr.vitalPulse || wr.vitalTemp) {
                            const vitals = [];
                            if (wr.vitalBP) vitals.push(`BP: ${wr.vitalBP} mmHg`);
                            if (wr.vitalSPO2) vitals.push(`SPO2: ${wr.vitalSPO2}%`);
                            if (wr.vitalRR) vitals.push(`RR: ${wr.vitalRR}/min`);
                            if (wr.vitalPulse) vitals.push(`Pulse: ${wr.vitalPulse}/min`);
                            if (wr.vitalTemp) vitals.push(`Temp: ${wr.vitalTemp}°C`);
                            txt += `Vitals: ${vitals.join(' | ')}\n`;
                          }
                          txt += `Notes: ${wr.text || 'No notes'}\n`;
                          if (wr.todos && wr.todos.length > 0) {
                            txt += `To Dos:\n`;
                            wr.todos.forEach((todo: any) => {
                              txt += ` - ${todo.title} (${todo.type}) - ${todo.details || ''} ${todo.completed ? '✅' : '⏳'}\n`;
                            });
                          }
                          if (wr.attachments && wr.attachments.length > 0) {
                            txt += `Attachments: ${wr.attachments.map((att: any) => att.name).join(', ')}\n`;
                          }
                          txt += `\n`;
                        });

                        const filename = `${firstName}_${lastName}_WardRound_${new Date().toISOString().split('T')[0]}`;
                        await exportComprehensiveHistory(txt, filename);
                      } catch (e) {
                        alert('Export failed: ' + (e && (e as any).message ? (e as any).message : e));
                      }
                    } else {
                      alert('Please select ward rounds to export.');
                    }
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                    {selectedWardRounds.length > 0 ? `Export (${selectedWardRounds.length})` : 'Export'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: isDark ? '#FF6B35' : '#ff9800',
                    borderRadius: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    flex: 0.4,
                  }}
                  onPress={async () => {
                    if (selectedWardRounds.length > 0) {
                      // Print to PDF
                      if (!patientData?.wardRounds) return;
                      const rounds = selectedWardRounds.map(idx => patientData.wardRounds[idx]);
                      if (!rounds.length) {
                        alert('No ward rounds selected.');
                        return;
                      }
                      
                      try {
                        // Build HTML for printing/PDF
                        let printHtml = '';
                        rounds.forEach((wr: any) => {
                          const wrDate = new Date(wr.createdAt);
                          const dayName = wrDate.toLocaleDateString('en-US', { weekday: 'long' });
                          const dayNum = wrDate.getDate();
                          const suffix = dayNum % 10 === 1 && dayNum !== 11 ? 'st' : dayNum % 10 === 2 && dayNum !== 12 ? 'nd' : dayNum % 10 === 3 && dayNum !== 13 ? 'rd' : 'th';
                          const monthName = wrDate.toLocaleDateString('en-US', { month: 'short' });
                          const year = wrDate.getFullYear();
                          const displayDate = `${dayName} ${dayNum}${suffix} ${monthName} ${year}`;
                          const displayTime = wrDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                          
                          printHtml += `${displayDate} at ${displayTime} - Dr. ${wr.doctor || 'Unknown'}\n`;
                          if (wr.complaints) printHtml += `Complaints: ${wr.complaints}\n`;
                          if (wr.onExamination) printHtml += `On Examination: ${wr.onExamination}\n`;
                          if (wr.systemicExamination) printHtml += `Systemic Examination: ${wr.systemicExamination}\n`;
                          if (wr.assessment) printHtml += `Assessment: ${wr.assessment}\n`;
                          if (wr.vitalBP || wr.vitalSPO2 || wr.vitalRR || wr.vitalPulse || wr.vitalTemp) {
                            const vitals = [];
                            if (wr.vitalBP) vitals.push(`BP: ${wr.vitalBP}`);
                            if (wr.vitalSPO2) vitals.push(`SPO2: ${wr.vitalSPO2}%`);
                            if (wr.vitalRR) vitals.push(`RR: ${wr.vitalRR}`);
                            if (wr.vitalPulse) vitals.push(`HR: ${wr.vitalPulse}`);
                            if (wr.vitalTemp) vitals.push(`Temp: ${wr.vitalTemp}°C`);
                            printHtml += `Vitals: ${vitals.join(', ')}\n`;
                          }
                          if (wr.plans && wr.plans.length > 0) {
                            printHtml += `Plan:\n`;
                            wr.plans.forEach((plan: any) => {
                              printHtml += `  • ${plan.text}\n`;
                            });
                          }
                          printHtml += `Notes: ${wr.text || 'No notes'}\n\n`;
                        });
                        
                        // Export the generated plain text using the centralized exporter
                        await exportComprehensiveHistory(printHtml, `${firstName}_${lastName}_WardRound`);
                      } catch (e) {
                        alert('Print failed: ' + (e && (e as any).message ? (e as any).message : e));
                      }
                    } else {
                      alert('Please select ward rounds to export.');
                    }
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                    🖨️ Print PDF
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#888',
                    borderRadius: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    flex: 0.3,
                  }}
                  onPress={() => {
                    setShowWardRoundsModal(false);
                    setSelectedWardRounds([]);
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Plan Modal */}
      <Modal
        visible={planModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPlanModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: '92%',
            maxWidth: 420,
            backgroundColor: isDark ? '#23272e' : '#fff',
            borderRadius: 20,
            padding: 24,
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: isDark ? '#fff' : '#1976d2',
              marginBottom: 16,
              alignSelf: 'center'
            }}>
              {editingPlanIndex !== null ? 'Edit Plan' : 'Add Plan'}
            </Text>
            {/* Plan text input */}
            <TextInput
              style={{
                borderWidth: 2,
                borderRadius: 10,
                padding: 14,
                fontSize: 16,
                minHeight: 140,
                marginBottom: 16,
                color: isDark ? '#fff' : '#111',
                borderColor: isDark ? '#2196F3' : '#0a7ea4',
                backgroundColor: isDark ? '#181a20' : '#f5f5f5',
              }}
              placeholder="Type the plan here..."
              placeholderTextColor={isDark ? '#999' : '#999'}
              multiline
              numberOfLines={7}
              value={planText}
              onChangeText={setPlanText}
              autoFocus
            />
            {/* Save and Cancel Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#e53935',
                  paddingVertical: 12,
                  paddingHorizontal: 28,
                  borderRadius: 8,
                }}
                onPress={() => {
                  setPlanModal(false);
                  setPlanText('');
                  setEditingPlanIndex(null);
                  setEditingWardRoundIdx(null);
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#43a047',
                  paddingVertical: 12,
                  paddingHorizontal: 28,
                  borderRadius: 8,
                }}
                onPress={handleSavePlan}
                disabled={!planText.trim()}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Patient Summary Modal */}
      <Modal
        visible={showPatientSummaryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPatientSummaryModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: '92%',
            maxWidth: 520,
            backgroundColor: isDark ? '#23272e' : '#fff',
            borderRadius: 20,
            padding: 24,
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: isDark ? '#fff' : '#1976d2',
              marginBottom: 16,
              alignSelf: 'center'
            }}>{patientData?.patientSummary ? 'Edit Patient Summary' : 'Add Patient Summary'}</Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                minHeight: 120,
                marginBottom: 16,
                color: isDark ? '#fff' : '#111',
                borderColor: isDark ? '#2196F3' : '#0a7ea4',
                backgroundColor: isDark ? '#181a20' : '#fff',
              }}
              placeholder="Write a brief patient summary..."
              placeholderTextColor={isDark ? '#999' : '#999'}
              multiline
              numberOfLines={6}
              value={patientSummaryText}
              onChangeText={setPatientSummaryText}
              autoFocus
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#e53935', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
                onPress={() => {
                  setShowPatientSummaryModal(false);
                  setPatientSummaryText('');
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#43a047', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
                onPress={handleSavePatientSummary}
                disabled={!patientSummaryText.trim()}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Comprehensive History Modal */}
      <Modal
        visible={showComprehensiveHistoryModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowComprehensiveHistoryModal(false)}
      >
        <ScrollView style={{ flex: 1, backgroundColor: isDark ? '#151718' : '#fff', paddingTop: Platform.OS === 'ios' ? 50 : 20 }}>
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#0a7ea4' }}>Comprehensive History</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity onPress={() => exportComprehensiveHistory(buildComprehensiveHistoryText(), comprehensiveHistory.biodata_name || 'ComprehensiveHistory')}>
                  <Ionicons name="document-text" size={26} color={isDark ? '#fff' : '#0a7ea4'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowComprehensiveHistoryModal(false)}>
                  <Ionicons name="close" size={28} color={isDark ? '#fff' : '#0a7ea4'} />
                </TouchableOpacity>
              </View>
            </View>

            {/* A. BIODATA SECTION */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>BIODATA</Text>
              
              <ComprehensiveHistoryInput label="Name" value={comprehensiveHistory.biodata_name || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_name: val})} isDark={isDark} readOnly={true} />
              <ComprehensiveHistoryInput label="Age" value={comprehensiveHistory.biodata_age || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_age: val})} isDark={isDark} readOnly={true} />
              <ComprehensiveHistoryInput label="Sex" value={comprehensiveHistory.biodata_sex || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_sex: val})} isDark={isDark} readOnly={true} />
              <ComprehensiveHistoryInput label="Residence (County, Location)" value={comprehensiveHistory.biodata_residence || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_residence: val})} isDark={isDark} />
              <ComprehensiveHistoryInput label="Religion" value={comprehensiveHistory.biodata_religion || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_religion: val})} isDark={isDark} />
              <ComprehensiveHistoryInput label="IP Number" value={comprehensiveHistory.biodata_ipnumber || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_ipnumber: val})} isDark={isDark} readOnly={true} />
              <ComprehensiveHistoryInput label="Date of Admission" value={comprehensiveHistory.biodata_admission || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_admission: val})} isDark={isDark} readOnly={!!comprehensiveHistory.biodata_admission} />
              <ComprehensiveHistoryInput label="Informant" value={comprehensiveHistory.biodata_informant || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_informant: val})} isDark={isDark} />
              
              {sex?.toLowerCase().includes('f') && (
                <>
                  <ComprehensiveHistoryInput label="LMP (If female)" value={comprehensiveHistory.biodata_lmp || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_lmp: val})} isDark={isDark} readOnly={!!comprehensiveHistory.biodata_lmp} />
                  <ComprehensiveHistoryInput label="GBD (If female and gravid)" value={comprehensiveHistory.biodata_gbd || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_gbd: val})} isDark={isDark} readOnly={!!comprehensiveHistory.biodata_gbd} />
                  <ComprehensiveHistoryInput label="EDD (If female and gravid)" value={comprehensiveHistory.biodata_edd || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_edd: val})} isDark={isDark} readOnly={!!comprehensiveHistory.biodata_edd} />
                  <ComprehensiveHistoryInput label="Parity" value={comprehensiveHistory.biodata_parity || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, biodata_parity: val})} isDark={isDark} readOnly={!!comprehensiveHistory.biodata_parity} />
                </>
              )}
            </View>

            {/* B. CHIEF COMPLAINTS */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>CHIEF COMPLAINTS</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.chief_complaints || ''} onChangeText={handleChiefComplaintsChange} isDark={isDark} placeholder="Each line will be bulleted" readOnly={comprehensiveReadOnly} />
            </View>

            {/* C. HPI */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>HISTORY OF PRESENT ILLNESS (HPI)</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.hpi || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, hpi: val})} isDark={isDark} placeholder="Include current status and progression" readOnly={comprehensiveReadOnly} />
              
              {/* ROS of the affected systems subsection */}
              <View style={{ marginTop: 12, marginBottom: 12, paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: isDark ? '#2196F3' : '#0a7ea4' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#64b5f6' : '#1565c0', marginBottom: 8 }}>ROS of the Affected Systems</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.hpi_ros || ''} onChangeText={handleROSAffectedSystemsChange} isDark={isDark} placeholder="Review of systems for the affected body systems - each line will be bulleted" readOnly={comprehensiveReadOnly} />
              </View>

              {/* Current Status of the Patient subsection */}
              <View style={{ marginTop: 12, marginBottom: 0, paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: isDark ? '#2196F3' : '#0a7ea4' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#64b5f6' : '#1565c0', marginBottom: 8 }}>Current Status of the Patient</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.hpi_current_status || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, hpi_current_status: val})} isDark={isDark} placeholder="Current clinical status and presentation" readOnly={comprehensiveReadOnly} />
              </View>
            </View>

            {/* D. REVIEW OF SYSTEMS */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2' }}>REVIEW OF SYSTEMS</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={handleAddNumbering}
                    style={{ padding: 6, backgroundColor: isDark ? '#2196F3' : '#0a7ea4', borderRadius: 4 }}
                  >
                    <Ionicons name="list-circle" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddBullet}
                    style={{ padding: 6, backgroundColor: isDark ? '#2196F3' : '#0a7ea4', borderRadius: 4 }}
                  >
                    <Ionicons name="list" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={{ color: isDark ? '#aaa' : '#666', marginBottom: 6, fontSize: 12 }}>GIT, GUT, R/S, CVS, CNS, MSS, ENT, Skin - Type and press numbered/bullet buttons to format</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.ros || ''} onChangeText={handleROSChange} isDark={isDark} placeholder="Enter review of systems..." readOnly={comprehensiveReadOnly} />
            </View>

            {/* E. OBSTETRIC HISTORY */}
            {sex?.toLowerCase().includes('f') && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>OBSTETRIC HISTORY</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.obs_hx || ''} onChangeText={handleObsHistoryChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
              </View>
            )}

            {/* F. GYNAECOLOGICAL HISTORY */}
            {sex?.toLowerCase().includes('f') && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>GYNAECOLOGICAL HISTORY</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.gyn_hx || ''} onChangeText={handleGynHistoryChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
              </View>
            )}

            {/* G. PAST MEDICAL SURGICAL HISTORY */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>PAST MEDICAL & SURGICAL HISTORY</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.past_med_surg || ''} onChangeText={handlePastMedSurgChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
            </View>

            {/* H. PERSONAL SOCIOECONOMIC HISTORY */}
            {parseInt(age) > 1 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>PERSONAL SOCIOECONOMIC HISTORY</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.personal_socio || ''} onChangeText={handlePersonalSocioChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
              </View>
            )}

            {/* I. FAMILY SOCIOECONOMIC HISTORY */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>FAMILY SOCIOECONOMIC HISTORY</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.family_socio || ''} onChangeText={handleFamilySocioChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
            </View>

            {/* J. BIRTH HISTORY */}
            {parseInt(age) < 14 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>BIRTH HISTORY</Text>
                <Text style={{ color: isDark ? '#aaa' : '#666', marginBottom: 8, fontSize: 12 }}>Antenatal</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.birth_antenatal || ''} onChangeText={handleBirthAntenatalChange} isDark={isDark} placeholder="Antenatal details (each line will be bulleted)" readOnly={comprehensiveReadOnly} />

                <Text style={{ color: isDark ? '#aaa' : '#666', marginTop: 12, marginBottom: 8, fontSize: 12 }}>Natal</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.birth_natal || ''} onChangeText={handleBirthNatalChange} isDark={isDark} placeholder="Natal/delivery details (each line will be bulleted)" readOnly={comprehensiveReadOnly} />

                <Text style={{ color: isDark ? '#aaa' : '#666', marginTop: 12, marginBottom: 8, fontSize: 12 }}>Post Natal</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.birth_postnatal || ''} onChangeText={handleBirthPostnatalChange} isDark={isDark} placeholder="Post-natal course (each line will be bulleted)" readOnly={comprehensiveReadOnly} />
              </View>
            )}

            {/* K. DEVELOPMENTAL HISTORY */}
            {parseInt(age) < 14 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>DEVELOPMENTAL HISTORY</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.dev_hx || ''} onChangeText={handleDevHistoryChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
              </View>
            )}

            {/* L. IMMUNIZATION HISTORY */}
            {parseInt(age) < 14 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>IMMUNIZATION HISTORY</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.immun_hx || ''} onChangeText={handleImmunHistoryChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
              </View>
            )}

            {/* M. FEEDING HISTORY */}
            {parseInt(age) < 14 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>FEEDING HISTORY</Text>
                <ComprehensiveHistoryTextArea value={comprehensiveHistory.feed_hx || ''} onChangeText={handleFeedingHistoryChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
              </View>
            )}

            {/* N. GENERAL EXAMINATION */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>GENERAL EXAMINATION</Text>
              
              {/* On Examination subsection */}
              <Text style={{ color: isDark ? '#aaa' : '#666', marginBottom: 8, fontSize: 12 }}>On Examination</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.gen_exam || ''} onChangeText={handleGenExamChange} isDark={isDark} placeholder="Observations on examination" readOnly={comprehensiveReadOnly} />

              {/* General Signs subsection */}
              <Text style={{ color: isDark ? '#aaa' : '#666', marginTop: 12, marginBottom: 8, fontSize: 12 }}>General Signs</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.gen_signs || ''} onChangeText={handleGenSignsChange} isDark={isDark} placeholder="e.g. level of consciousness, appearance" readOnly={comprehensiveReadOnly} />

              {/* Vital Signs subsection */}
              <Text style={{ color: isDark ? '#aaa' : '#666', marginTop: 12, marginBottom: 8, fontSize: 12 }}>Vital Signs</Text>
              
              {/* Display Summary */}
              {(comprehensiveHistory.vital_bp_systolic || comprehensiveHistory.vital_bp_diastolic || comprehensiveHistory.vital_pr || comprehensiveHistory.vital_rr || comprehensiveHistory.vital_spo2 || comprehensiveHistory.vital_temp) && (
                <View style={{ marginBottom: 12, padding: 10, backgroundColor: isDark ? '#0a0e12' : '#f5f5f5', borderRadius: 6 }}>
                  {comprehensiveHistory.vital_bp_systolic && comprehensiveHistory.vital_bp_diastolic && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 12 }}>BP: {comprehensiveHistory.vital_bp_systolic}/{comprehensiveHistory.vital_bp_diastolic} mmHg</Text>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ff4444' }}>
                        {(parseInt(comprehensiveHistory.vital_bp_systolic) >= 140 || parseInt(comprehensiveHistory.vital_bp_diastolic) >= 90) ? '(High)' : (parseInt(comprehensiveHistory.vital_bp_systolic) < 90 || parseInt(comprehensiveHistory.vital_bp_diastolic) < 60) ? '(Low)' : ''}
                      </Text>
                    </View>
                  )}
                  {comprehensiveHistory.vital_pr && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 12 }}>P.R: {comprehensiveHistory.vital_pr} /min</Text>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ff4444' }}>
                        {(parseInt(comprehensiveHistory.vital_pr) > 100) ? '(High)' : (parseInt(comprehensiveHistory.vital_pr) < 60) ? '(Low)' : ''}
                      </Text>
                    </View>
                  )}
                  {comprehensiveHistory.vital_rr && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 12 }}>R.R: {comprehensiveHistory.vital_rr} /min</Text>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ff4444' }}>
                        {(parseInt(comprehensiveHistory.vital_rr) > 20) ? '(High)' : (parseInt(comprehensiveHistory.vital_rr) < 12) ? '(Low)' : ''}
                      </Text>
                    </View>
                  )}
                  {comprehensiveHistory.vital_spo2 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 12 }}>SPO2: {comprehensiveHistory.vital_spo2} %</Text>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ff4444' }}>
                        {(parseInt(comprehensiveHistory.vital_spo2) < 95) ? '(Low)' : ''}
                      </Text>
                    </View>
                  )}
                  {comprehensiveHistory.vital_temp && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 12 }}>Temp: {comprehensiveHistory.vital_temp} °C</Text>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ff4444' }}>
                        {(parseFloat(comprehensiveHistory.vital_temp) > 38.5) ? '(High Fever)' : (parseFloat(comprehensiveHistory.vital_temp) > 37.5) ? '(Fever)' : (parseFloat(comprehensiveHistory.vital_temp) < 36.5) ? '(Low)' : ''}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View style={{ gap: 8 }}>
                {/* Blood Pressure */}
                <View style={{ gap: 4 }}>
                  <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: '600', fontSize: 12 }}>B.P</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 4,
                          padding: 8,
                          fontSize: 13,
                          color: isDark ? '#fff' : '#111',
                          borderColor: isDark ? '#2196F3' : '#0a7ea4',
                          backgroundColor: isDark ? '#181a20' : '#f9f9f9',
                        }}
                        value={comprehensiveHistory.vital_bp_systolic || ''}
                        onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, vital_bp_systolic: val})}
                        placeholder="Sys"
                        placeholderTextColor={isDark ? '#999' : '#999'}
                        keyboardType="numeric"
                      />
                    </View>
                    <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 16, fontWeight: 'bold' }}>/</Text>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 4,
                          padding: 8,
                          fontSize: 13,
                          color: isDark ? '#fff' : '#111',
                          borderColor: isDark ? '#2196F3' : '#0a7ea4',
                          backgroundColor: isDark ? '#181a20' : '#f9f9f9',
                        }}
                        value={comprehensiveHistory.vital_bp_diastolic || ''}
                        onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, vital_bp_diastolic: val})}
                        placeholder="Dia"
                        placeholderTextColor={isDark ? '#999' : '#999'}
                        keyboardType="numeric"
                      />
                    </View>
                    <Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 11 }}>mmHg</Text>
                  </View>
                </View>

                {/* Pulse Rate */}
                <View style={{ gap: 4 }}>
                  <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: '600', fontSize: 12 }}>P.R</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <TextInput
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 4,
                        padding: 8,
                        fontSize: 13,
                        color: isDark ? '#fff' : '#111',
                        borderColor: isDark ? '#2196F3' : '#0a7ea4',
                        backgroundColor: isDark ? '#181a20' : '#f9f9f9',
                      }}
                      value={comprehensiveHistory.vital_pr || ''}
                      onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, vital_pr: val})}
                      placeholder="beats"
                      placeholderTextColor={isDark ? '#999' : '#999'}
                      keyboardType="numeric"
                    />
                    <Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 11 }}>/min</Text>
                  </View>
                </View>

                {/* Respiratory Rate */}
                <View style={{ gap: 4 }}>
                  <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: '600', fontSize: 12 }}>R.R</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <TextInput
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 4,
                        padding: 8,
                        fontSize: 13,
                        color: isDark ? '#fff' : '#111',
                        borderColor: isDark ? '#2196F3' : '#0a7ea4',
                        backgroundColor: isDark ? '#181a20' : '#f9f9f9',
                      }}
                      value={comprehensiveHistory.vital_rr || ''}
                      onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, vital_rr: val})}
                      placeholder="breaths"
                      placeholderTextColor={isDark ? '#999' : '#999'}
                      keyboardType="numeric"
                    />
                    <Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 11 }}>/min</Text>
                  </View>
                </View>

                {/* SPO2 */}
                <View style={{ gap: 4 }}>
                  <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: '600', fontSize: 12 }}>SPO2</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <TextInput
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 4,
                        padding: 8,
                        fontSize: 13,
                        color: isDark ? '#fff' : '#111',
                        borderColor: isDark ? '#2196F3' : '#0a7ea4',
                        backgroundColor: isDark ? '#181a20' : '#f9f9f9',
                      }}
                      value={comprehensiveHistory.vital_spo2 || ''}
                      onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, vital_spo2: val})}
                      placeholder="saturation"
                      placeholderTextColor={isDark ? '#999' : '#999'}
                      keyboardType="numeric"
                    />
                    <Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 11 }}>%</Text>
                  </View>
                </View>

                {/* Temperature */}
                <View style={{ gap: 4 }}>
                  <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: '600', fontSize: 12 }}>Temp</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <TextInput
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 4,
                        padding: 8,
                        fontSize: 13,
                        color: isDark ? '#fff' : '#111',
                        borderColor: isDark ? '#2196F3' : '#0a7ea4',
                        backgroundColor: isDark ? '#181a20' : '#f9f9f9',
                      }}
                      value={comprehensiveHistory.vital_temp || ''}
                      onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, vital_temp: val})}
                      placeholder="temperature"
                      placeholderTextColor={isDark ? '#999' : '#999'}
                      keyboardType="decimal-pad"
                    />
                    <Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 11 }}>°C</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* O. PHYSICAL EXAMINATION */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2' }}>PHYSICAL EXAMINATION</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={handleAddPhysExamNumbering}
                    style={{ padding: 6, backgroundColor: isDark ? '#2196F3' : '#0a7ea4', borderRadius: 4 }}
                  >
                    <Ionicons name="list-circle" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddPhysExamBullet}
                    style={{ padding: 6, backgroundColor: isDark ? '#2196F3' : '#0a7ea4', borderRadius: 4 }}
                  >
                    <Ionicons name="list" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={{ color: isDark ? '#aaa' : '#666', marginBottom: 6, fontSize: 12 }}>Skin, HEENT, Neck, Respiratory, Cardiovascular, Abdomen, Musculoskeletal, CNS, Lymphatic, Psychiatric</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.phys_exam || ''} onChangeText={handlePhysExamChange} isDark={isDark} placeholder="Start with affected systems..." readOnly={comprehensiveReadOnly} />
            </View>

            {/* R. LOCAL EXAM */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>LOCAL EXAM (If wound, swelling, or lesion)</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.local_exam || ''} onChangeText={handleLocalExamChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
            </View>

            {/* S. EXECUTIVE SUMMARY */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>EXECUTIVE SUMMARY</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.exec_summary || ''} onChangeText={(val) => setComprehensiveHistory({...comprehensiveHistory, exec_summary: val})} isDark={isDark} readOnly={comprehensiveReadOnly} />
            </View>

            {/* T. IMPRESSION */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>IMPRESSION</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.impression || ''} onChangeText={handleImpressionChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
            </View>

            {/* U. DIFFERENTIAL DIAGNOSES */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>DIFFERENTIAL DIAGNOSES</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.diff_diag || ''} onChangeText={handleDiffDiagChange} isDark={isDark} readOnly={comprehensiveReadOnly} />
            </View>

            {/* V. INVESTIGATIONS */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>INVESTIGATIONS</Text>
              <Text style={{ color: isDark ? '#aaa' : '#666', marginBottom: 8, fontSize: 12 }}>Laboratory tests</Text>
              <ComprehensiveHistoryTextArea
                value={comprehensiveHistory.investigations_lab || ''}
                onChangeText={handleInvestigationsLabChange}
                isDark={isDark}
                placeholder="e.g. FBC, U&E, LFTs, Blood cultures"
              />

              <Text style={{ color: isDark ? '#aaa' : '#666', marginTop: 12, marginBottom: 8, fontSize: 12 }}>Imaging</Text>
              <ComprehensiveHistoryTextArea
                value={comprehensiveHistory.investigations_imaging || ''}
                onChangeText={handleInvestigationsImagingChange}
                isDark={isDark}
                placeholder="e.g. CXR, USS, CT, MRI"
              />

              <Text style={{ color: isDark ? '#aaa' : '#666', marginTop: 12, marginBottom: 8, fontSize: 12 }}>Special / Functional / Diagnostic procedures</Text>
              <ComprehensiveHistoryTextArea
                value={comprehensiveHistory.investigations_special || ''}
                onChangeText={handleInvestigationsSpecialChange}
                isDark={isDark}
                placeholder="e.g. ECG, EEG, Endoscopy, Biopsy"
              />
            </View>

            {/* W. PLAN */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 12 }}>PLAN</Text>
              <Text style={{ color: isDark ? '#aaa' : '#666', marginBottom: 8, fontSize: 12 }}>Supportive Management</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.plan_supportive || ''} onChangeText={handlePlanSupportiveAutoNumberChange} isDark={isDark} placeholder="Supportive management (each line will be auto-numbered)" />

              <Text style={{ color: isDark ? '#aaa' : '#666', marginTop: 12, marginBottom: 8, fontSize: 12 }}>Definitive Management</Text>
              <ComprehensiveHistoryTextArea value={comprehensiveHistory.plan_definitive || ''} onChangeText={handlePlanDefinitiveAutoNumberChange} isDark={isDark} placeholder="Definitive management (each line will be auto-numbered)" />
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 24, marginBottom: 40 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#e53935', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
                onPress={() => {
                  if (comprehensiveReadOnly) {
                    setShowComprehensiveHistoryModal(false);
                    setComprehensiveReadOnly(false);
                  } else {
                    setShowComprehensiveHistoryModal(false);
                    setComprehensiveHistory({});
                  }
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              {!comprehensiveReadOnly && (
                <TouchableOpacity
                  style={{ backgroundColor: '#43a047', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
                  onPress={() => {
                    // Save comprehensive history
                    savePatientData({
                      ...patientData,
                      comprehensiveHistory,
                    });
                    setShowComprehensiveHistoryModal(false);
                    setComprehensiveReadOnly(false);
                    Alert.alert('Success', 'Comprehensive history saved');
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </Modal>
      <Modal
        visible={showImageViewer}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowImageViewer(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.95)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {imageViewerUri && (
            <TouchableOpacity
              style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
              activeOpacity={1}
              onPress={() => setShowImageViewer(false)}
            >
              <View style={{ position: 'absolute', top: 40, right: 24, zIndex: 2 }}>
                <Ionicons name="close-circle" size={40} color="#fff" />
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Animated.View
                  {...panResponder.panHandlers}
                  style={{
                    transform: [
                      { scale: scale },
                      { translateX: pan.x },
                      { translateY: pan.y }
                    ],
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    source={{ uri: imageViewerUri }}
                    style={{
                      width: Dimensions.get('window').width,
                      height: Dimensions.get('window').height * 0.9,
                      borderRadius: 12,
                      resizeMode: 'contain',
                      backgroundColor: '#222'
                    }}
                  />
                </Animated.View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

type ProfileRowProps = { label: string; value: string; isDark: boolean; icon: string };
function ProfileRow({ label, value, isDark, icon }: ProfileRowProps) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon as any} size={20} color={isDark ? '#2196F3' : '#1976d2'} style={{ marginRight: 10 }} />
      <Text style={[styles.label, { color: isDark ? '#90caf9' : '#1976d2' }]}>{label}:</Text>
      <Text style={[styles.value, { color: isDark ? '#fff' : '#222' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderColor: '#e3f2fd',
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
    minWidth: 90,
  },
  value: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
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
    width: '95%',
    maxHeight: '95%',
    backgroundColor: '#222',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalScrollContent: {
    padding: 20,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  wardRoundInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 160,
    marginBottom: 12,
  },
  wardDoctorInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  addToDoButton: {
    alignSelf: 'flex-start',
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  addToDoButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  todoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoModalContainer: {
    width: '90%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'stretch',
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  todoTitleInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  todoDetailsInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 10,
  },
});