import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TodoScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  // Date filter state
  const [showFilter, setShowFilter] = React.useState(false);
  const [filterType, setFilterType] = React.useState<'today' | 'yesterday' | 'custom' | null>(null);
  const [customRange, setCustomRange] = React.useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [showFromPicker, setShowFromPicker] = React.useState(false);
  const [showToPicker, setShowToPicker] = React.useState(false);

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

  // Patients state (single source of truth)
  const [patients, setPatients] = React.useState<any[]>([]);

  // State for patient search in Add To-Do modal
  const [searchPatientText, setSearchPatientText] = React.useState('');
  const filteredPatients = React.useMemo(() => {
    if (!searchPatientText.trim()) return patients;
    const q = searchPatientText.trim().toLowerCase();
    return patients.filter((p: any) =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.ipNumber && String(p.ipNumber).toLowerCase().includes(q))
    );
  }, [searchPatientText, patients]);

  // Helper to get patient info by patientId from patients array
  const getPatientInfo = (todo: any) => {
    if (!todo.patientId) return null;
    return patients.find(p => p.id === todo.patientId) || null;
  };

  // Load patients for dropdown and To-Do card biodata
  const loadPatients = React.useCallback(async () => {
    try {
      // Load patients_list array
      const listRaw = await AsyncStorage.getItem('patients_list');
      if (!listRaw) {
        setPatients([]);
        return;
      }
      const patientList = JSON.parse(listRaw);
      // Fetch each patient by patient_[id]
      const stores = await AsyncStorage.multiGet(
        patientList.map((p: any) => `patient_${p.id}`)
      );
      const list: any[] = [];
      stores.forEach(([key, value]) => {
        if (value) {
          try {
            const data = JSON.parse(value);
            const name = (data.firstName || data.lastName) ? `${data.firstName || ''} ${data.lastName || ''}`.trim() : '';
            const age = typeof data.age === 'number' || typeof data.age === 'string' ? data.age : '';
            const ageMode = typeof data.ageMode === 'string' ? data.ageMode : '';
            const sex = typeof data.sex === 'string' ? data.sex : '';
            const ipNumber = typeof data.ipNumber === 'string' || typeof data.ipNumber === 'number' ? data.ipNumber : '';
            const bedNumber = typeof data.bedNumber === 'string' || typeof data.bedNumber === 'number' ? data.bedNumber : '';
            list.push({
              id: data.id,
              name,
              age,
              ageMode,
              sex,
              ipNumber,
              bedNumber,
            });
          } catch {}
        }
      });
      setPatients(list);
    } catch {}
  }, []);

  // All To Dos state (across all patients)
  const [allTodos, setAllTodos] = React.useState<any[]>([]);

  // Load all patient To Dos from AsyncStorage
  const loadAllTodos = React.useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const patientKeys = keys.filter(k => k.startsWith('patient_'));
      const stores = await AsyncStorage.multiGet(patientKeys);
      let todos: any[] = [];
      stores.forEach(([key, value]) => {
        if (value) {
          try {
            const data = JSON.parse(value);
            if (Array.isArray(data.todos)) {
              const patientId = key.replace('patient_', '');
              // Attach patient info to each todo
              const patientName = (data.firstName || data.lastName) ? `${data.firstName || ''} ${data.lastName || ''}`.trim() : '';
              const age = typeof data.age === 'number' || typeof data.age === 'string' ? data.age : '';
              const ageMode = typeof data.ageMode === 'string' ? data.ageMode : '';
              const sex = typeof data.sex === 'string' ? data.sex : '';
              const ipNumber = typeof data.ipNumber === 'string' || typeof data.ipNumber === 'number' ? data.ipNumber : '';
              const bedNumber = typeof data.bedNumber === 'string' || typeof data.bedNumber === 'number' ? data.bedNumber : '';
              (data.todos || []).forEach((todo: any) => {
                todos.push({
                  ...todo,
                  patientId,
                  patientName,
                  age,
                  ageMode,
                  sex,
                  ipNumber,
                  bedNumber,
                });
              });
            }
          } catch {}
        }
      });
      // Sort by createdAt descending
      todos.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setAllTodos(todos);
    } catch {}
  }, []);

  // Initial load and subscribe to changes
  React.useEffect(() => {
    loadAllTodos();
    loadPatients();
    const interval = setInterval(() => {
      loadAllTodos();
      loadPatients();
    }, 2000); // Poll every 2s for real-time sync
    return () => clearInterval(interval);
  }, [loadAllTodos, loadPatients]);

  // Save To Dos back to each patient in real time
  const saveTodoToPatient = async (todo: any, update: (t: any) => any) => {
    try {
      const patientKey = `patient_${todo.patientId}`;
      const stored = await AsyncStorage.getItem(patientKey);
      if (!stored) return;
      const data = JSON.parse(stored);
      if (!Array.isArray(data.todos)) return;
      const updatedTodos = data.todos.map((t: any) =>
        t.createdAt === todo.createdAt ? update(t) : t
      );
      await AsyncStorage.setItem(patientKey, JSON.stringify({ ...data, todos: updatedTodos }));
      // Optionally, update patientData in patient-profile if you use a global state/store
      loadAllTodos();
    } catch {}
  };

  // Handlers for actions (complete, revert, delete)
  const handleComplete = (todo: any) => {
    saveTodoToPatient(todo, (t) => ({ ...t, completed: true, completedAt: Date.now() }));
  };
  const handleRevert = (todo: any) => {
    saveTodoToPatient(todo, (t) => ({ ...t, completed: false, completedAt: undefined }));
  };
  const handleDelete = (todo: any) => {
    try {
      const patientKey = `patient_${todo.patientId}`;
      AsyncStorage.getItem(patientKey).then((stored) => {
        if (!stored) return;
        const data = JSON.parse(stored);
        if (!Array.isArray(data.todos)) return;
        const updatedTodos = data.todos.filter((t: any) => t.createdAt !== todo.createdAt);
        AsyncStorage.setItem(patientKey, JSON.stringify({ ...data, todos: updatedTodos })).then(loadAllTodos);
      });
    } catch {}
  };

  // Edit modal state
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editTodo, setEditTodo] = React.useState<any>(null);
  const [editType, setEditType] = React.useState('');
  const [editTitle, setEditTitle] = React.useState('');
  const [editDetails, setEditDetails] = React.useState('');
  const [editDropdownOpen, setEditDropdownOpen] = React.useState(false);

  // View modal state
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [viewTodo, setViewTodo] = React.useState<any>(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteTodo, setDeleteTodo] = React.useState<any>(null);

  // Revert modal state
  const [showRevertModal, setShowRevertModal] = React.useState(false);
  const [revertTodo, setRevertTodo] = React.useState<any>(null);

  // Complete modal state
  const [showCompleteModal, setShowCompleteModal] = React.useState(false);
  const [completeTodo, setCompleteTodo] = React.useState<any>(null);
  const [completeText, setCompleteText] = React.useState('');
  const [attachedFile, setAttachedFile] = React.useState<any>(null);
  const [showAttachModal, setShowAttachModal] = React.useState(false);

  // Full screen image viewer state
  const [showImageViewer, setShowImageViewer] = React.useState(false);
  const [imageViewerUri, setImageViewerUri] = React.useState<string | null>(null);

  // Edit handlers
  const openEditModal = (todo: any) => {
    setEditTodo(todo);
    setEditType(todo.type);
    setEditTitle(todo.title);
    setEditDetails(todo.details || '');
    setEditDropdownOpen(false);
    setShowEditModal(true);
  };
  const handleSaveEdit = async () => {
    if (!editTodo) return;
    await saveTodoToPatient(editTodo, (t) => ({
      ...t,
      type: editType,
      title: editTitle,
      details: editDetails,
    }));
    setShowEditModal(false);
    setEditTodo(null);
    setEditType('');
    setEditTitle('');
    setEditDetails('');
    setEditDropdownOpen(false);
  };

  // View handler
  const openViewModal = (todo: any) => {
    setViewTodo(todo);
    setShowViewModal(true);
  };

  // Delete handlers
  const openDeleteModal = (todo: any) => {
    setDeleteTodo(todo);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    if (!deleteTodo) return;
    handleDelete(deleteTodo);
    setShowDeleteModal(false);
    setDeleteTodo(null);
  };

  // Revert handlers
  const openRevertModal = (todo: any) => {
    setRevertTodo(todo);
    setShowRevertModal(true);
  };
  const confirmRevert = () => {
    if (!revertTodo) return;
    handleRevert(revertTodo);
    setShowRevertModal(false);
    setRevertTodo(null);
  };

  // Open complete modal
  const openCompleteModal = (todo: any) => {
    setCompleteTodo(todo);
    setCompleteText('');
    setAttachedFile(null);
    setShowCompleteModal(true);
  };

  // Handle file attachment
  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAttachedFile({
          name: result.assets[0].fileName || 'photo.jpg',
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image',
        });
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
        setAttachedFile({
          name: result.assets[0].fileName || 'gallery-image.jpg',
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image',
        });
      }
    } catch {}
    setShowAttachModal(false);
  };

  // Submit completion
  const handleSubmitComplete = async () => {
    if (!completeTodo) return;
    await saveTodoToPatient(completeTodo, (t) => ({
      ...t,
      completed: true,
      completedAt: Date.now(),
      result: completeText,
      attachedFile,
    }));
    setShowCompleteModal(false);
    setCompleteTodo(null);
    setCompleteText('');
    setAttachedFile(null);
  };

  // Export handler (PDF)
  const handleExport = async () => {
    if (!allTodos.length) {
      alert('No To Do items to export.');
      return;
    }
    // Group todos by patientId for patient info sections
    const todosByPatient: { [key: string]: any[] } = {};
    allTodos.forEach(todo => {
      if (!todosByPatient[todo.patientId]) todosByPatient[todo.patientId] = [];
      todosByPatient[todo.patientId].push(todo);
    });
    let html = `
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; font-size: 14px; color: #222; }
          h2 { color: #1976d2; margin-bottom: 0; }
          h3 { color: #1976d2; margin-top: 32px; margin-bottom: 8px; }
          .biodata-table { border-collapse: collapse; width: 100%; margin-bottom: 10px; }
          .biodata-table td { padding: 4px 12px 4px 0; border: none; font-weight: bold; color: #1976d2; }
          .biodata-table .value { font-weight: normal; color: #222; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 24px; }
          th, td { border: 1px solid #b3c6e0; padding: 8px 6px; text-align: left; }
          th { background: #e3f2fd; color: #1976d2; font-weight: bold; }
          .status-done { color: #43a047; font-weight: bold; }
          .status-pending { color: #e53935; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>To-Do List Export</h2>
        <div style="height: 12px"></div>
        ${Object.entries(todosByPatient).map(([patientId, todos], idx) => {
          const todo = todos[0];
          return `
            <h3>Patient ${idx + 1}</h3>
            <table class="biodata-table">
              <tr>
                <td>Name:</td><td class="value">${todo.patientName || ''}</td>
                <td>Age:</td><td class="value">${todo.age ? `${todo.age} ${todo.ageMode || ''}` : ''}</td>
                <td>Sex:</td><td class="value">${todo.sex || ''}</td>
                <td>IP Number:</td><td class="value">${todo.ipNumber || ''}</td>
                <td>Bed:</td><td class="value">${todo.bedNumber || ''}</td>
                <td>Created On:</td><td class="value">${todo.createdAt ? new Date(todo.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</td>
              </tr>
            </table>
            <table>
              <tr>
                <th>Test Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Details / Notes</th>
                <th>Created On</th>
              </tr>
              ${todos.map((t: any) => `
                <tr>
                  <td>${t.title || ''}</td>
                  <td>${t.type || ''}</td>
                  <td class="${t.completed ? 'status-done' : 'status-pending'}">${t.completed ? 'Done ✅' : 'Pending'}</td>
                  <td>${t.details || ''}</td>
                  <td>${t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</td>
                </tr>
              `).join('')}
            </table>
          `;
        }).join('')}
      </body>
      </html>
    `;
    try {
      // Convert HTML to plain text for centralized exporter
      const rawText = html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|h1|h2|li|tr|td)>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim();

      await exportComprehensiveHistory(rawText, 'ToDoListExport');
    } catch (e) {
      alert('Export failed: ' + (typeof e === 'object' && e && 'message' in e ? (e as any).message : String(e)));
    }
  };

  // Add To-Do modal state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [addPatientId, setAddPatientId] = React.useState('');
  const [addType, setAddType] = React.useState('');
  const [addTitle, setAddTitle] = React.useState('');
  const [addDetails, setAddDetails] = React.useState('');
  const [addDropdownOpen, setAddDropdownOpen] = React.useState(false);
  const [patientDropdownOpen, setPatientDropdownOpen] = React.useState(false);

  // Ensure patient list is refreshed every time Add To-Do modal opens
  React.useEffect(() => {
    if (showAddModal) {
      loadPatients();
    }
  }, [showAddModal, loadPatients]);

  // Add To-Do handler
  const handleAddTodo = async () => {
    if (!addPatientId || !addType || !addTitle) return;
    try {
      const patientKey = `patient_${addPatientId}`;
      const stored = await AsyncStorage.getItem(patientKey);
      if (!stored) return;
      const data = JSON.parse(stored);
      // Extract patient info directly from AsyncStorage patient object
      const patientName = (data.firstName || data.lastName) ? `${data.firstName || ''} ${data.lastName || ''}`.trim() : '';
      const age = typeof data.age === 'number' || typeof data.age === 'string' ? data.age : '';
      const sex = typeof data.sex === 'string' ? data.sex : '';
      const ipNumber = typeof data.ipNumber === 'string' || typeof data.ipNumber === 'number' ? data.ipNumber : '';
      const bedNumber = typeof data.bedNumber === 'string' || typeof data.bedNumber === 'number' ? data.bedNumber : '';
      const newTodo = {
        type: addType,
        title: addTitle,
        details: addDetails,
        createdAt: Date.now(),
        completed: false,
        patientId: addPatientId,
        patientName,
        age,
        sex,
        ipNumber,
        bedNumber,
      };
      const todos = Array.isArray(data.todos) ? [...data.todos, newTodo] : [newTodo];
      await AsyncStorage.setItem(patientKey, JSON.stringify({ ...data, todos }));
      setShowAddModal(false);
      setAddPatientId('');
      setAddType('');
      setAddTitle('');
      setAddDetails('');
      setAddDropdownOpen(false);
      setPatientDropdownOpen(false);
      loadAllTodos();
    } catch {}
  };

  // Search/filter state
  const [search, setSearch] = React.useState('');

  // Filtered todos with date filter
  const filteredTodos = React.useMemo(() => {
    let todos = allTodos;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      todos = todos.filter(
        t =>
          (t.patientName && t.patientName.toLowerCase().includes(s)) ||
          (t.ipNumber && String(t.ipNumber).toLowerCase().includes(s))
      );
    }
    if (filterType === 'today') {
      const today = new Date();
      todos = todos.filter(t => t.createdAt && isSameDay(new Date(t.createdAt), today));
    } else if (filterType === 'yesterday') {
      todos = todos.filter(t => t.createdAt && isYesterday(new Date(t.createdAt)));
    } else if (filterType === 'custom' && customRange.from && customRange.to) {
      todos = todos.filter(t => {
        if (!t.createdAt) return false;
        const d = new Date(t.createdAt);
  if (!customRange.from || !customRange.to) return false;
  return d >= customRange.from && d <= customRange.to;
      });
    }
    return todos;
  }, [allTodos, search, filterType, customRange]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#181a20' : '#fff' }}
      contentContainerStyle={{
        padding: 24,
        paddingBottom: 32,
        paddingTop: 36,
        backgroundColor: isDark ? '#181a20' : '#fff',
        minHeight: '100%',
      }}
    >
      <View style={{ height: 36 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <ThemedText type="title" style={{ color: isDark ? '#90caf9' : '#1976d2', marginBottom: 0 }}>To-Do</ThemedText>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={handleExport}
          style={{
            backgroundColor: isDark ? '#2196F3' : '#e3f2fd',
            paddingVertical: 6,
            paddingHorizontal: 16,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="share-outline" size={18} color={isDark ? '#fff' : '#1976d2'} style={{ marginRight: 4 }} />
          <Text style={{ color: isDark ? '#fff' : '#1976d2', fontWeight: 'bold', fontSize: 15 }}>Export</Text>
        </TouchableOpacity>
      </View>
      <ThemedText
        style={{
          marginBottom: 18,
          fontWeight: 'bold',
          fontSize: 16,
          color: isDark ? '#90caf9' : '#1976d2',
        }}
        lightColor="#1976d2"
        darkColor="#1976d2"
      >
        Manage your tasks and to-dos here.
      </ThemedText>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 18 }}>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={{
            backgroundColor: isDark ? '#1976d2' : '#2196F3',
            paddingVertical: 10,
            paddingHorizontal: 22,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Add To-Do</Text>
        </TouchableOpacity>
      </View>
      {/* Search bar with filter icon */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 18,
          borderRadius: 10,
          backgroundColor: isDark ? '#23272e' : '#f2f2f2',
          borderWidth: 1,
          borderColor: isDark ? '#1976d2' : '#b3c6e0',
          paddingHorizontal: 10,
          height: 44,
        }}
      >
        <Ionicons name="search-outline" size={20} color={isDark ? '#90caf9' : '#1976d2'} style={{ marginRight: 6 }} />
        <TextInput
          style={{
            flex: 1,
            color: isDark ? '#fff' : '#111',
            fontSize: 16,
            paddingVertical: 0,
            backgroundColor: 'transparent',
          }}
          placeholder="Search To-Do"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          onPress={() => setShowFilter(true)}
          style={{
            marginLeft: 8,
            padding: 4,
            borderRadius: 6,
            backgroundColor: isDark ? '#181a20' : '#e3f2fd',
          }}
        >
          <Ionicons name="filter-outline" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
        </TouchableOpacity>
      </View>

      {/* Active filter chip */}
      {filterType && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: isDark ? '#23272e' : '#e3f2fd',
          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 6,
          marginBottom: 10,
          marginTop: -10,
        }}>
          <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', marginRight: 8 }}>
            {filterType === 'today' && 'Today'}
            {filterType === 'yesterday' && 'Yesterday'}
            {filterType === 'custom' && customRange.from && customRange.to &&
              `From ${customRange.from.toLocaleDateString()} to ${customRange.to.toLocaleDateString()}`}
          </Text>
          <TouchableOpacity onPress={() => { setFilterType(null); setCustomRange({ from: null, to: null }); }}>
            <Ionicons name="close-circle" size={20} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Modal: 3 options - Today, Yesterday, Custom date range */}
      <Modal
        visible={showFilter}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilter(false)}
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
              Filter To-Dos
            </Text>
            {/* Today option */}
            <TouchableOpacity
              style={{
                backgroundColor: filterType === 'today' ? '#2196F3' : (isDark ? '#181a20' : '#e3f2fd'),
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 12,
              }}
              onPress={() => { setFilterType('today'); setShowFilter(false); }}
            >
              <Text style={{ color: filterType === 'today' ? '#fff' : (isDark ? '#90caf9' : '#1976d2'), fontWeight: 'bold', fontSize: 16 }}>Today</Text>
            </TouchableOpacity>
            {/* Yesterday option */}
            <TouchableOpacity
              style={{
                backgroundColor: filterType === 'yesterday' ? '#2196F3' : (isDark ? '#181a20' : '#e3f2fd'),
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 12,
              }}
              onPress={() => { setFilterType('yesterday'); setShowFilter(false); }}
            >
              <Text style={{ color: filterType === 'yesterday' ? '#fff' : (isDark ? '#90caf9' : '#1976d2'), fontWeight: 'bold', fontSize: 16 }}>Yesterday</Text>
            </TouchableOpacity>
            {/* Custom date range option */}
            <TouchableOpacity
              style={{
                backgroundColor: filterType === 'custom' ? '#2196F3' : (isDark ? '#181a20' : '#e3f2fd'),
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 12,
              }}
              onPress={() => {
                setFilterType('custom');
                setShowFilter(false);
                setShowFromPicker(true);
              }}
            >
              <Text style={{ color: filterType === 'custom' ? '#fff' : (isDark ? '#90caf9' : '#1976d2'), fontWeight: 'bold', fontSize: 16 }}>Custom Date Range</Text>
            </TouchableOpacity>
            {/* Cancel option */}
            <TouchableOpacity
              style={{
                backgroundColor: '#e53935',
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 0,
              }}
              onPress={() => setShowFilter(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Date pickers for custom range */}
      {showFromPicker && (
        <DateTimePicker
          value={customRange.from || new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(_, date) => {
            setShowFromPicker(false);
            if (date) {
              setCustomRange(prev => ({ ...prev, from: date, to: null }));
              setTimeout(() => setShowToPicker(true), 300);
            }
          }}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={customRange.to || (customRange.from || new Date())}
          mode="date"
          display="default"
          minimumDate={customRange.from || undefined}
          maximumDate={new Date()}
          onChange={(_, date) => {
            setShowToPicker(false);
            if (date) {
              setCustomRange(prev => ({ ...prev, to: date }));
            }
          }}
        />
      )}
      {filteredTodos.length > 0 ? (
        filteredTodos.map((todo, idx) => (
          <View
            key={todo.createdAt || idx}
            style={{
              backgroundColor: isDark ? '#23272e' : '#f7fafd',
              borderRadius: 10,
              padding: 14,
              marginBottom: 12,
              borderLeftWidth: 4,
              borderLeftColor:
                todo.type === 'LAB'
                  ? (isDark ? '#ffb300' : '#ff9800')
                  : todo.type === 'IMAGING'
                  ? (isDark ? '#1976d2' : '#2196F3')
                  : (isDark ? '#43a047' : '#4caf50'),
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {/* Patient info row - show name, age, sex, IP from todo object */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/patient-profile',
                    params: {
                      id: todo.patientId,
                      firstName: (todo.patientName || '').split(' ')[0] || '',
                      lastName: (todo.patientName || '').split(' ').slice(1).join(' ') || '',
                      age: todo.age || '',
                      ageMode: todo.ageMode || '',
                      sex: todo.sex || '',
                      ward: todo.ward || '',
                      ipNumber: todo.ipNumber || '',
                      bedNumber: todo.bedNumber || '',
                    },
                  });
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: isDark ? '#1976d2' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginRight: 12, textDecorationLine: 'underline' }}>
                  {todo.patientName || 'Unknown'}
                </Text>
              </TouchableOpacity>
              <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 14, marginRight: 12 }}>
                Age: {todo.age ? `${todo.age} ${todo.ageMode || ''}` : 'N/A'}
              </Text>
              <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 14, marginRight: 12 }}>
                Sex: {todo.sex || 'N/A'}
              </Text>
              <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 14, marginRight: 12 }}>
                IP: {todo.ipNumber || 'N/A'}
              </Text>
              <Text style={{ color: isDark ? '#fff' : '#333', fontSize: 14, marginRight: 12 }}>
                Bed: {todo.bedNumber || 'N/A'}
              </Text>
            </View>
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
              {/* Dates row */}
              <View style={{ flexDirection: 'row', marginTop: 6, flexWrap: 'wrap' }}>
                <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 12, marginRight: 16 }}>
                  Created: {todo.createdAt ? new Date(todo.createdAt).toLocaleString() : 'N/A'}
                </Text>
                {todo.completed && todo.completedAt && (
                  <Text style={{ color: isDark ? '#43a047' : '#388e3c', fontSize: 12 }}>
                    Completed: {new Date(todo.completedAt).toLocaleString()}
                  </Text>
                )}
              </View>
            </View>
            <View style={{ alignItems: 'center', minWidth: 70, flexDirection: 'row', marginTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 0, marginBottom: 4 }}>
                {!todo.completed ? (
                  <>
                    <TouchableOpacity style={{ marginHorizontal: 6 }} onPress={() => openCompleteModal(todo)}>
                      <Ionicons name="checkmark-done-circle-outline" size={30} color={isDark ? '#43a047' : '#388e3c'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 6 }} onPress={() => openEditModal(todo)}>
                      <Ionicons name="create-outline" size={28} color={isDark ? '#90caf9' : '#1976d2'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 6 }} onPress={() => openDeleteModal(todo)}>
                      <Ionicons name="trash-outline" size={28} color="#e53935" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={{ marginHorizontal: 6 }} onPress={() => openRevertModal(todo)}>
                      <Ionicons name="refresh-circle-outline" size={30} color={isDark ? '#ffb300' : '#ff9800'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 6 }} onPress={() => openViewModal(todo)}>
                      <Ionicons name="eye-outline" size={28} color={isDark ? '#90caf9' : '#1976d2'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 6 }} onPress={() => openDeleteModal(todo)}>
                      <Ionicons name="trash-outline" size={28} color="#e53935" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
              {!todo.completed ? (
                <View style={{
                  backgroundColor: '#e53935',
                  borderRadius: 16,
                  paddingVertical: 3,
                  paddingHorizontal: 16,
                  alignSelf: 'center',
                  marginLeft: 8,
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
                  marginLeft: 8,
                }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Done</Text>
                </View>
              )}
            </View>
          </View>
        ))
      ) : (
        <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 15, marginTop: 8 }}>
          {search.trim()
            ? 'No To Do items match your search.'
            : 'No To Do items yet.'}
        </Text>
      )}

      {/* Edit To Do Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
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
              onPress={() => setEditDropdownOpen(!editDropdownOpen)}
              activeOpacity={0.85}
            >
              <Text style={{ color: isDark ? '#fff' : '#111', fontSize: 16 }}>
                {editType ? editType : 'Select Type'}
              </Text>
              <Ionicons
                name={editDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={22}
                color={isDark ? '#2196F3' : '#0a7ea4'}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            {editDropdownOpen && (
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
                        editType === option
                          ? isDark
                            ? '#2196F3'
                            : '#e3f2fd'
                          : 'transparent',
                    }}
                    onPress={() => {
                      setEditType(option);
                      setEditDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={{
                        color: isDark
                          ? editType === option
                            ? '#fff'
                            : '#90caf9'
                          : editType === option
                          ? '#1976d2'
                          : '#111',
                        fontWeight: editType === option ? 'bold' : 'normal',
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
              value={editTitle}
              onChangeText={setEditTitle}
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
              value={editDetails}
              onChangeText={setEditDetails}
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
                onPress={() => setShowEditModal(false)}
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
                onPress={handleSaveEdit}
                disabled={!editType || !editTitle}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete To Do Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeleteModal(false)}
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
                onPress={confirmDelete}
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
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Revert To Do Confirmation Modal */}
      <Modal
        visible={showRevertModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowRevertModal(false)}
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
                onPress={confirmRevert}
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
                onPress={() => setShowRevertModal(false)}
              >
                <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
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
              onChangeText={setCompleteText}
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
              onPress={() => setShowAttachModal(true)}
            >
              <Ionicons name="clipboard-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                {attachedFile ? `Attached: ${attachedFile.name}` : 'Attach File'}
              </Text>
            </TouchableOpacity>
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

      {/* View To Do Modal */}
      <Modal
        visible={showViewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowViewModal(false)}
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
            {viewTodo && (
              <>
                <Text style={{ color: isDark ? '#fff' : '#111', fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                  {viewTodo.title}
                </Text>
                <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 14, marginBottom: 8 }}>
                  {viewTodo.type}
                </Text>
                {viewTodo.details ? (
                  <Text style={{ color: isDark ? '#ccc' : '#444', fontSize: 15, marginBottom: 8 }}>
                    {viewTodo.details}
                  </Text>
                ) : null}
                <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 13, marginBottom: 10 }}>
                  Created: {new Date(viewTodo.createdAt).toLocaleString()}
                </Text>
                {viewTodo.completed && (
                  <>
                    <Text style={{ color: isDark ? '#43a047' : '#388e3c', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>
                      Result:
                    </Text>
                    <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 15, marginBottom: 8 }}>
                      {viewTodo.result}
                    </Text>
                    {viewTodo.attachedFile?.uri && (
                      <View style={{ marginTop: 10, alignItems: 'flex-start' }}>
                        <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 6 }}>
                          Attached Image:
                        </Text>
                        <View style={{
                          borderRadius: 8,
                          overflow: 'hidden',
                          borderWidth: 1,
                          borderColor: isDark ? '#2196F3' : '#1976d2',
                          backgroundColor: isDark ? '#181a20' : '#e3f2fd',
                        }}>
                          <TouchableOpacity
                            onPress={() => {
                              setImageViewerUri(viewTodo.attachedFile.uri);
                              setShowImageViewer(true);
                            }}
                            activeOpacity={0.9}
                          >
                            <View style={{ width: 220, height: 220, justifyContent: 'center', alignItems: 'center' }}>
                              <Image
                                source={{ uri: viewTodo.attachedFile.uri }}
                                style={{
                                  width: 220,
                                  height: 220,
                                  resizeMode: 'contain',
                                  borderRadius: 8,
                                  backgroundColor: isDark ? '#222' : '#fff'
                                }}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                        {viewTodo.attachedFile.name && (
                          <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 13, marginTop: 4 }}>
                            {viewTodo.attachedFile.name}
                          </Text>
                        )}
                      </View>
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
              onPress={() => setShowViewModal(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Full Screen Image Viewer Modal */}
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
              style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
              activeOpacity={1}
              onPress={() => setShowImageViewer(false)}
            >
              <View style={{ position: 'absolute', top: 40, right: 24, zIndex: 2 }}>
                <Ionicons name="close-circle" size={40} color="#fff" />
              </View>
              <Image
                source={{ uri: imageViewerUri }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                  backgroundColor: '#222'
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </Modal>

      {/* Add To-Do Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
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
              Add To-Do
            </Text>
            {/* Patient search and selection */}
            <View style={{ marginBottom: 8 }}>
              {/* Show selected patient info as a chip/tag above the search bar */}
              {addPatientId ? (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isDark ? '#2196F3' : '#e3f2fd',
                  borderRadius: 16,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  marginBottom: 6,
                  alignSelf: 'flex-start',
                }}>
                  <Text style={{ color: isDark ? '#fff' : '#1976d2', fontSize: 15, fontWeight: 'bold' }}>
                    {(() => {
                      const p = patients.find(x => x.id === addPatientId);
                      return p ? `${p.name}${p.age ? `, Age: ${p.age} ${p.ageMode || ''}` : ''}${p.sex ? `, Sex: ${p.sex}` : ''}${p.ipNumber ? `, IP: ${p.ipNumber}` : ''}` : '';
                    })()}
                  </Text>
                  <TouchableOpacity onPress={() => { setAddPatientId(''); setSearchPatientText(''); }} style={{ marginLeft: 8 }}>
                    <Ionicons name="close-circle" size={20} color={isDark ? '#fff' : '#1976d2'} />
                  </TouchableOpacity>
                </View>
              ) : null}
              <TextInput
                style={{
                  borderWidth: 1.5,
                  borderRadius: 10,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  color: isDark ? '#fff' : '#111',
                  borderColor: isDark ? '#2196F3' : '#0a7ea4',
                  backgroundColor: isDark ? '#181a20' : '#f2f2f2',
                  fontSize: 16,
                  marginBottom: 4,
                }}
                placeholder="Search Patient by name, IP, age, or sex"
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                value={searchPatientText}
                onChangeText={text => {
                  setAddPatientId('');
                  setSearchPatientText(text);
                }}
                editable={true}
              />
              {/* Filtered patient list */}
              {!addPatientId && searchPatientText.length > 0 && (
                <View style={{
                  borderWidth: 1,
                  borderColor: isDark ? '#2196F3' : '#0a7ea4',
                  borderRadius: 10,
                  marginTop: 2,
                  backgroundColor: isDark ? '#23272e' : '#fff',
                  maxHeight: 220,
                  zIndex: 10,
                }}>
                  <ScrollView keyboardShouldPersistTaps="handled">
                    {filteredPatients.length === 0 && (
                      <Text style={{ color: isDark ? '#aaa' : '#888', padding: 14 }}>No patients found.</Text>
                    )}
                    {filteredPatients.map(p => (
                      <TouchableOpacity
                        key={p.id}
                        style={{
                          paddingVertical: 14,
                          paddingHorizontal: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: isDark ? '#333' : '#eee',
                        }}
                        onPress={() => {
                          setAddPatientId(p.id);
                          setSearchPatientText('');
                        }}
                      >
                        <Text style={{ color: isDark ? '#fff' : '#111', fontSize: 16 }}>
                          {`${p.name}${p.age ? `, Age: ${p.age} ${p.ageMode || ''}` : ''}${p.sex ? `, Sex: ${p.sex}` : ''}${p.ipNumber ? `, IP: ${p.ipNumber}` : ''}`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            {/* Type dropdown */}
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
              onPress={() => setAddDropdownOpen(!addDropdownOpen)}
              activeOpacity={0.85}
            >
              <Text style={{ color: isDark ? '#fff' : '#111', fontSize: 16 }}>
                {addType ? addType : 'Select Type'}
              </Text>
              <Ionicons
                name={addDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={22}
                color={isDark ? '#2196F3' : '#0a7ea4'}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            {addDropdownOpen && (
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
                        addType === option
                          ? isDark
                            ? '#2196F3'
                            : '#e3f2fd'
                          : 'transparent',
                    }}
                    onPress={() => {
                      setAddType(option);
                      setAddDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={{
                        color: isDark
                          ? addType === option
                            ? '#fff'
                            : '#90caf9'
                          : addType === option
                          ? '#1976d2'
                          : '#111',
                        fontWeight: addType === option ? 'bold' : 'normal',
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
              value={addTitle}
              onChangeText={setAddTitle}
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
              placeholder="Description"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              multiline
              numberOfLines={4}
              value={addDetails}
              onChangeText={setAddDetails}
            />
            {/* Add and Cancel Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#e53935',
                  paddingVertical: 12,
                  paddingHorizontal: 28,
                  borderRadius: 8,
                  marginRight: 10,
                }}
                onPress={() => setShowAddModal(false)}
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
                onPress={handleAddTodo}
                disabled={!addPatientId || !addType || !addTitle}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}