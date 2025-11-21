import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ExpoCalendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Alert, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
// Helper to schedule a local notification for a reminder
async function scheduleReminderNotification(title: string, body: string, date: string, time: string) {
  try {
    // Combine date and time into a JS Date object
    const [hour, minute] = time.split(':').map(Number);
    const fireDate = new Date(date);
    fireDate.setHours(hour, minute, 0, 0);
    if (fireDate > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: fireDate,
      });
    }
  } catch (e) {
    // Ignore notification errors
  }
}

// Helper to add rotation to phone calendar with reminders
async function addRotationToCalendar(ward: string, date: string, start: string, end: string, note?: string) {
  // Schedule notifications 30 mins before shift starts and ends
  try {
    // Parse date and time to JS Date
    const match = start.match(/(\d+):(\d+) (AM|PM)/i);
    if (!match) return;
    const [, hourStr, minStr, ampm] = match;
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minStr, 10);
    if (ampm && ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (ampm && ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
    const startDate = new Date(date);
    startDate.setHours(hour, minute, 0, 0);
    // End time
    let endDate = new Date(startDate);
    if (end) {
      const matchEnd = end.match(/(\d+):(\d+) (AM|PM)/i);
      if (matchEnd) {
        let [ , hourStrE, minStrE, ampmE ] = matchEnd;
        let hourE = parseInt(hourStrE, 10);
        const minuteE = parseInt(minStrE, 10);
        if (ampmE && ampmE.toUpperCase() === 'PM' && hourE !== 12) hourE += 12;
        if (ampmE && ampmE.toUpperCase() === 'AM' && hourE === 12) hourE = 0;
        endDate = new Date(date);
        endDate.setHours(hourE, minuteE, 0, 0);
      } else {
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // fallback 1 hour
      }
    } else {
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // fallback 1 hour
    }
    // 30 mins before start
    const startNotif = new Date(startDate.getTime() - 30 * 60 * 1000);
    if (startNotif > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Shift Starts in 30 mins',
          body: `Your shift for ${ward} starts at ${start}`,
        },
        trigger: { seconds: Math.floor((startNotif.getTime() - Date.now()) / 1000), channelId: 'default' },
      });
    }
    // 30 mins before end
    if (endDate && endDate > new Date()) {
      const endNotif = new Date(endDate.getTime() - 30 * 60 * 1000);
      if (endNotif > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Shift Ends in 30 mins',
            body: `Your shift for ${ward} ends at ${end}`,
          },
          trigger: { seconds: Math.floor((endNotif.getTime() - Date.now()) / 1000), channelId: 'default' },
        });
      }
    }
  } catch (e) { /* ignore notification errors */ }
  try {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Calendar permission is needed to add rotations to your phone calendar.');
      return;
    }
    const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
    let defaultCalendar = calendars.find(cal => cal.allowsModifications && cal.source && (cal.source.name === 'Default' || cal.source.name === 'iCloud' || cal.source.name === 'Local Account'));
    if (!defaultCalendar) {
      defaultCalendar = calendars.find(cal => cal.allowsModifications);
    }
    if (!defaultCalendar) {
      Alert.alert('No modifiable calendar found', 'Could not find a calendar to add the rotation.');
      return;
    }
    // Parse date and time to JS Date
    const match = start.match(/(\d+):(\d+) (AM|PM)/i);
    if (!match) return;
    const [, hourStr, minStr, ampm] = match;
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minStr, 10);
    if (ampm && ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (ampm && ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
    const startDate = new Date(date);
    startDate.setHours(hour, minute, 0, 0);
    // End time
    let endDate = new Date(startDate);
    if (end) {
      const matchEnd = end.match(/(\d+):(\d+) (AM|PM)/i);
      if (matchEnd) {
        let [ , hourStrE, minStrE, ampmE ] = matchEnd;
        let hourE = parseInt(hourStrE, 10);
        const minuteE = parseInt(minStrE, 10);
        if (ampmE && ampmE.toUpperCase() === 'PM' && hourE !== 12) hourE += 12;
        if (ampmE && ampmE.toUpperCase() === 'AM' && hourE === 12) hourE = 0;
        endDate = new Date(date);
        endDate.setHours(hourE, minuteE, 0, 0);
      } else {
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // fallback 1 hour
      }
    } else {
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // fallback 1 hour
    }
    await ExpoCalendar.createEventAsync(defaultCalendar.id, {
      title: `Rotation: ${ward}`,
      startDate,
      endDate,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notes: note || 'Created from the app rotation',
      alarms: [
        { relativeOffset: 0 }, // At time of event
        { relativeOffset: -30 }, // 30 minutes before
      ],
    });
  } catch (e) {
    Alert.alert('Calendar Error', 'Could not add rotation to calendar.');
  }
}
  // Helper to add reminder to phone calendar
  async function addReminderToCalendar(title: string, date: string, time: string) {
    try {
      const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Calendar permission is needed to add reminders to your phone calendar.');
        return;
      }
      const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
      let defaultCalendar = calendars.find(cal => cal.allowsModifications && cal.source && (cal.source.name === 'Default' || cal.source.name === 'iCloud' || cal.source.name === 'Local Account'));
      if (!defaultCalendar) {
        // fallback to first modifiable calendar
        defaultCalendar = calendars.find(cal => cal.allowsModifications);
      }
      if (!defaultCalendar) {
        Alert.alert('No modifiable calendar found', 'Could not find a calendar to add the reminder.');
        return;
      }
      // Parse date and time to JS Date
      const match = time.match(/(\d+):(\d+) (AM|PM)/i);
      if (!match) return;
      const [, hourStr, minStr, ampm] = match;
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minStr, 10);
      if (ampm && ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (ampm && ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
      const startDate = new Date(date);
      startDate.setHours(hour, minute, 0, 0);
      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 min event
      await ExpoCalendar.createEventAsync(defaultCalendar.id, {
        title,
        startDate,
        endDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notes: 'Created from the app reminder',
      });
    } catch (e) {
      Alert.alert('Calendar Error', 'Could not add reminder to calendar.');
    }
  }

const SCHEDULE_KEY = 'schedule_list';

export default function ScheduleScreen() {
  // Notification permission is now requested only once at app setup
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [schedule, setSchedule] = React.useState<any[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [editIdx, setEditIdx] = React.useState<number | null>(null);
  // Add Rotation modal state
  const [showRotationModal, setShowRotationModal] = React.useState(false);
  const [rotationDate, setRotationDate] = React.useState(new Date());
  const [rotationWard, setRotationWard] = React.useState('');
  const [rotationStart, setRotationStart] = React.useState('');
  const [rotationEnd, setRotationEnd] = React.useState('');
  const [rotationNote, setRotationNote] = React.useState('');
  const [showStartPicker, setShowStartPicker] = React.useState(false);
  const [showEndPicker, setShowEndPicker] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  // Rotations state for calendar marking and display
  const [rotations, setRotations] = React.useState<any[]>([]);
  // State for selected rotation popup
  const [selectedRotation, setSelectedRotation] = React.useState<any | null>(null);
  // State for selected calendar date
  const [selectedDate, setSelectedDate] = React.useState<string>(new Date().toISOString().slice(0, 10));
  // State for reminders modal and reminders list
  const [showReminders, setShowReminders] = React.useState(false);
  type Reminder = { text: string; date: string; time: string };
  const [reminders, setReminders] = React.useState<Reminder[]>([]);
  const [reminderInput, setReminderInput] = React.useState('');
  const [reminderDate, setReminderDate] = React.useState<string>(new Date().toISOString().slice(0, 10));
  const [reminderTime, setReminderTime] = React.useState('');
  const [showReminderDatePicker, setShowReminderDatePicker] = React.useState(false);
  const [showReminderTimePicker, setShowReminderTimePicker] = React.useState(false);
  const [editReminderIdx, setEditReminderIdx] = React.useState<number | null>(null);
  const [showDeleteReminderIdx, setShowDeleteReminderIdx] = React.useState<number | null>(null);
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Load schedule from AsyncStorage
  React.useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(SCHEDULE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setSchedule(list);
      // Extract rotations
      setRotations(list.filter((item: any) => item.type === 'rotation'));
    })();
  }, []);

  // Save schedule to AsyncStorage
  const saveSchedule = async (list: any[]) => {
    setSchedule(list);
    setRotations(list.filter((item: any) => item.type === 'rotation'));
    await AsyncStorage.setItem(SCHEDULE_KEY, JSON.stringify(list));
  };

  // Open modal for add/edit
  const openModal = (idx: number | null = null) => {
    if (idx !== null) {
      const item = schedule[idx];
      setEditIdx(idx);
      setTitle(item.title);
      setDesc(item.desc);
      setDate(item.date);
      setTime(item.time);
    } else {
      setEditIdx(null);
      setTitle('');
      setDesc('');
      setDate('');
      setTime('');
    }
    setShowModal(true);
  };

  // Add or update event
  const handleSave = async () => {
    if (!title || !date || !time) return;
    const newEvent = { title, desc, date, time, createdAt: Date.now() };
    let updated;
    if (editIdx !== null) {
      updated = schedule.map((ev, i) => (i === editIdx ? newEvent : ev));
    } else {
      updated = [...schedule, newEvent];
    }
    await saveSchedule(updated);
    setShowModal(false);
  };

  // Delete event
  const handleDelete = async (idx: number) => {
    const updated = schedule.filter((_, i) => i !== idx);
    await saveSchedule(updated);
  };

  // Today's date string in YYYY-MM-DD
  const todayStr = new Date().toISOString().slice(0, 10);

  // Helper to check if selectedDate is before today
  const isPastDate = selectedDate < todayStr;
  // Check if selected date already has a rotation
  const rotationForSelectedDate = rotations.find(r => r.date === selectedDate);

  return (
  <ScrollView style={{ flex: 1, backgroundColor: isDark ? '#181a20' : 'white', marginTop: 30 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, paddingBottom: 12 }}>
        <ThemedText type="title" style={{ color: '#1976d2' }}>Schedule</ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => setShowReminders(true)}
            style={{ padding: 8, borderRadius: 20, backgroundColor: isDark ? '#23272e' : '#e3f2fd' }}
            accessibilityLabel="Reminders"
          >
            <Ionicons name="notifications-outline" size={24} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
      {/* Reminders Modal */}
      <Modal
        visible={showReminders}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReminders(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '92%', maxWidth: 420, backgroundColor: isDark ? '#23272e' : '#fff', borderRadius: 20, padding: 24, elevation: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#1976d2', marginBottom: 16, alignSelf: 'center' }}>Reminders</Text>
            <TextInput
              style={{ borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12, color: isDark ? '#fff' : '#111', borderColor: isDark ? '#2196F3' : '#0a7ea4', backgroundColor: isDark ? '#23272e' : '#fff' }}
              placeholder="Add a new reminder..."
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={reminderInput}
              onChangeText={setReminderInput}
              returnKeyType="done"
            />
            {/* Date Picker */}
            <TouchableOpacity
              style={{ borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 8, backgroundColor: isDark ? '#23272e' : '#fff', borderColor: isDark ? '#2196F3' : '#0a7ea4' }}
              onPress={() => setShowReminderDatePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={{ color: isDark ? '#fff' : '#111', fontSize: 16 }}>
                {reminderDate ? new Date(reminderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Pick date'}
              </Text>
            </TouchableOpacity>
            {showReminderDatePicker && (
              <DateTimePicker
                value={reminderDate ? new Date(reminderDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedDate) => {
                  setShowReminderDatePicker(false);
                  if (selectedDate) {
                    setReminderDate(selectedDate.toISOString().slice(0, 10));
                  }
                }}
              />
            )}
            {/* Time Picker */}
            <TouchableOpacity
              style={{ borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 8, backgroundColor: isDark ? '#23272e' : '#fff', borderColor: isDark ? '#2196F3' : '#0a7ea4' }}
              onPress={() => setShowReminderTimePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={{ color: isDark ? '#fff' : '#111', fontSize: 16 }}>
                {reminderTime ? reminderTime : 'Pick time'}
              </Text>
            </TouchableOpacity>
            {showReminderTimePicker && (
              <DateTimePicker
                value={reminderTime ? new Date(`1970-01-01T${reminderTime}:00`) : new Date()}
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedDate) => {
                  setShowReminderTimePicker(false);
                  if (selectedDate) {
                    let h = selectedDate.getHours();
                    const m = selectedDate.getMinutes();
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    h = h % 12;
                    if (h === 0) h = 12;
                    const hStr = h.toString().padStart(2, '0');
                    const mStr = m.toString().padStart(2, '0');
                    setReminderTime(`${hStr}:${mStr} ${ampm}`);
                  }
                }}
              />
            )}
            {/* Helper to check if reminder is in the future */}
            {(() => {
              let isFuture = false;
              if (reminderDate && reminderTime) {
                const match = reminderTime.match(/(\d+):(\d+) (AM|PM)/i);
                if (match) {
                  const [, hourStr, minStr, ampm] = match;
                  let hour = parseInt(hourStr, 10);
                  const minute = parseInt(minStr, 10);
                  if (ampm && ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
                  if (ampm && ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
                  const reminderDateTime = new Date(reminderDate);
                  reminderDateTime.setHours(hour, minute, 0, 0);
                  isFuture = reminderDateTime.getTime() > Date.now();
                }
              }
              return (
                <>
                  <TouchableOpacity
                    style={{ backgroundColor: isFuture ? '#43a047' : '#bbb', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, alignSelf: 'center', marginBottom: 16, opacity: isFuture ? 1 : 0.7 }}
                    onPress={async () => {
                      if (reminderInput.trim() && reminderDate && reminderTime && isFuture) {
                        if (editReminderIdx !== null) {
                          // Update existing reminder
                          setReminders(reminders.map((r, i) =>
                            i === editReminderIdx
                              ? { text: reminderInput.trim(), date: reminderDate, time: reminderTime }
                              : r
                          ));
                          setEditReminderIdx(null);
                        } else {
                          // Add new reminder
                          setReminders([
                            { text: reminderInput.trim(), date: reminderDate, time: reminderTime },
                            ...reminders,
                          ]);
                          await addReminderToCalendar(reminderInput.trim(), reminderDate, reminderTime);
                          await scheduleReminderNotification(
                            'Reminder',
                            reminderInput.trim(),
                            reminderDate,
                            reminderTime
                          );
                        }
                        setReminderInput('');
                        setReminderDate(new Date().toISOString().slice(0, 10));
                        setReminderTime('');
                      }
                    }}
                    disabled={!reminderInput.trim() || !reminderDate || !reminderTime || !isFuture}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>{editReminderIdx !== null ? 'Update Reminder' : 'Add Reminder'}</Text>
                  </TouchableOpacity>
                  {!isFuture && reminderInput.trim() && reminderDate && reminderTime ? (
                    <Text style={{ color: '#e53935', fontSize: 13, textAlign: 'center', marginBottom: 8 }}>
                      Please select a future date and time for your reminder.
                    </Text>
                  ) : null}
                </>
              );
            })()}
            {reminders.length === 0 ? (
              <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 16, textAlign: 'center' }}>No reminders yet.</Text>
            ) : (
              reminders.map((rem, idx) => (
                <View key={idx} style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: isDark ? '#333' : '#eee', paddingBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 15 }}>{rem.text}</Text>
                    <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13 }}>
                      {new Date(rem.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} {rem.time}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      style={{ marginLeft: 8, padding: 4, borderRadius: 6, backgroundColor: isDark ? '#1976d2' : '#e3f2fd' }}
                      onPress={() => {
                        setReminderInput(rem.text);
                        setReminderDate(rem.date);
                        setReminderTime(rem.time);
                        setEditReminderIdx(idx);
                      }}
                    >
                      <Ionicons name="create-outline" size={18} color={isDark ? '#fff' : '#1976d2'} />
                    </TouchableOpacity>
                    <View style={{ width: 16 }} />
                    <TouchableOpacity
                      style={{ padding: 4, borderRadius: 6, backgroundColor: '#e53935' }}
                      onPress={() => setShowDeleteReminderIdx(idx)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                    {/* Reminder Delete Confirmation Modal */}
                    <Modal
                      visible={showDeleteReminderIdx === idx}
                      transparent
                      animationType="fade"
                      onRequestClose={() => setShowDeleteReminderIdx(null)}
                    >
                      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: isDark ? '#23272e' : '#fff', borderRadius: 16, padding: 28, minWidth: 260, alignItems: 'center', elevation: 8 }}>
                          <Text style={{ fontSize: 17, color: isDark ? '#fff' : '#222', marginBottom: 18, textAlign: 'center' }}>
                            Are you sure you want to delete this reminder?
                          </Text>
                          <View style={{ flexDirection: 'row', gap: 16 }}>
                            <TouchableOpacity
                              style={{ backgroundColor: '#bbb', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginRight: 8 }}
                              onPress={() => setShowDeleteReminderIdx(null)}
                            >
                              <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{ backgroundColor: '#e53935', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 }}
                              onPress={() => {
                                setReminders(reminders.filter((_, i) => i !== idx));
                                if (editReminderIdx === idx) {
                                  setReminderInput('');
                                  setReminderDate(new Date().toISOString().slice(0, 10));
                                  setReminderTime('');
                                  setEditReminderIdx(null);
                                }
                                setShowDeleteReminderIdx(null);
                              }}
                            >
                              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Delete</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                </View>
              ))
            )}
            <TouchableOpacity
              style={{ marginTop: 12, backgroundColor: '#1976d2', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32, alignSelf: 'center' }}
              onPress={() => setShowReminders(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        </View>
      </View>
      {/* Calendar below top bar */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <Calendar
          markedDates={{
            ...rotations.reduce((acc, rot) => {
              acc[rot.date] = {
                ...(acc[rot.date] || {}),
                marked: true,
                dotColor: '#43a047',
              };
              return acc;
            }, {} as any),
            [selectedDate]: {
              ...(rotations.find(r => r.date === selectedDate) ? { marked: true, dotColor: '#43a047' } : {}),
              selected: true,
              selectedColor: '#1976d2',
              selectedTextColor: '#fff',
            },
          }}
          theme={{
            backgroundColor: isDark ? '#181a20' : '#fff',
            calendarBackground: isDark ? '#181a20' : '#fff',
            textSectionTitleColor: isDark ? '#90caf9' : '#1976d2',
            selectedDayBackgroundColor: '#1976d2',
            selectedDayTextColor: '#fff',
            todayTextColor: '#43a047',
            dayTextColor: isDark ? '#fff' : '#222',
            textDisabledColor: isDark ? '#555' : '#ccc',
            arrowColor: isDark ? '#90caf9' : '#1976d2',
            monthTextColor: isDark ? '#fff' : '#1976d2',
            indicatorColor: isDark ? '#90caf9' : '#1976d2',
            dotColor: '#43a047',
            selectedDotColor: '#fff',
          }}
          style={{ borderRadius: 12, elevation: 2 }}
          onDayPress={(day: { dateString: string }) => {
            setSelectedDate(day.dateString);
            const found = rotations.find(r => r.date === day.dateString);
            if (found) {
              setSelectedRotation(found);
            } else {
              setSelectedRotation(null);
            }
          }}
        />
      {/* Rotation Details Popup */}
      <Modal
        visible={!!selectedRotation}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedRotation(null)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: isDark ? '#23272e' : '#fff', borderRadius: 16, padding: 24, minWidth: 260, alignItems: 'center', elevation: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#1976d2' : '#1976d2', marginBottom: 8 }}>
              {selectedRotation?.date && new Date(selectedRotation.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
            <Text style={{ fontSize: 16, color: isDark ? '#bbffbb' : '#388e3c', marginBottom: 4 }}>
              Ward: {selectedRotation?.ward}
            </Text>
            <Text style={{ fontSize: 15, color: isDark ? '#bbffbb' : '#388e3c', marginBottom: 2 }}>
              Time: {selectedRotation?.start} - {selectedRotation?.end}
            </Text>
            {selectedRotation?.note ? (
              <Text style={{ fontSize: 15, color: isDark ? '#fff' : '#333', marginBottom: 2, marginTop: 4, fontStyle: 'italic', textAlign: 'center' }}>
                Note: {selectedRotation.note}
              </Text>
            ) : null}
            <TouchableOpacity
              style={{ marginTop: 16, backgroundColor: '#1976d2', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24 }}
              onPress={() => setSelectedRotation(null)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        {/* Show ward name(s) below the date if rotation exists for that date */}
        {/* (Removed: do not display ward names in green under the calendar) */}
      </View>
      {/* Add Rotation button below calendar */}
      <View style={{ alignItems: 'flex-start', marginBottom: 8, paddingLeft: 24, flexDirection: 'row', gap: 12 }}>
        {!rotationForSelectedDate ? (
          <TouchableOpacity
            style={{
              backgroundColor: isPastDate ? (isDark ? '#555' : '#ccc') : (isDark ? '#43a047' : '#4caf50'),
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 32,
              marginTop: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              elevation: 2,
              opacity: isPastDate ? 0.6 : 1,
            }}
            onPress={() => {
              if (!isPastDate) {
                setRotationDate(new Date(selectedDate));
                setShowRotationModal(true);
              }
            }}
            disabled={isPastDate}
          >
            <Ionicons name="repeat-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Add Rotation</Text>
          </TouchableOpacity>
        ) : (
          <>
            {(() => {
              const rotDate = new Date(rotationForSelectedDate.date);
              rotDate.setHours(0,0,0,0);
              const today = new Date();
              today.setHours(0,0,0,0);
              const isPastRotation = rotDate < today;
              return <>
                <TouchableOpacity
                  style={{
                    backgroundColor: isPastRotation ? (isDark ? '#555' : '#ccc') : (isDark ? '#1976d2' : '#1976d2'),
                    borderRadius: 8,
                    paddingVertical: 7,
                    paddingHorizontal: 14,
                    marginTop: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    elevation: 1,
                    opacity: isPastRotation ? 0.6 : 1,
                  }}
                  onPress={() => {
                    if (!isPastRotation) {
                      setRotationDate(new Date(rotationForSelectedDate.date));
                      setRotationWard(rotationForSelectedDate.ward);
                      setRotationStart(rotationForSelectedDate.start);
                      setRotationEnd(rotationForSelectedDate.end);
                      setRotationNote(rotationForSelectedDate.note || '');
                      setEditIdx(schedule.findIndex(ev => ev.type === 'rotation' && ev.date === rotationForSelectedDate.date));
                      setShowRotationModal(true);
                    }
                  }}
                  disabled={isPastRotation}
                >
                  <Ionicons name="create-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#e53935',
                    borderRadius: 8,
                    paddingVertical: 7,
                    paddingHorizontal: 14,
                    marginTop: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    elevation: 1,
                  }}
                  onPress={() => setShowDeleteConfirm(true)}
                >
                  <Ionicons name="trash-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Delete</Text>
                </TouchableOpacity>
              </>;
            })()}
            {/* Delete Confirmation Modal */}
            <Modal
              visible={showDeleteConfirm}
              transparent
              animationType="fade"
              onRequestClose={() => setShowDeleteConfirm(false)}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: isDark ? '#23272e' : '#fff', borderRadius: 16, padding: 28, minWidth: 260, alignItems: 'center', elevation: 8 }}>
                  <Text style={{ fontSize: 17, color: isDark ? '#fff' : '#222', marginBottom: 18, textAlign: 'center' }}>
                    Are you sure you want to delete this rotation?
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <TouchableOpacity
                      style={{ backgroundColor: '#bbb', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginRight: 8 }}
                      onPress={() => setShowDeleteConfirm(false)}
                    >
                      <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ backgroundColor: '#e53935', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 }}
                      onPress={async () => {
                        const idx = schedule.findIndex(ev => ev.type === 'rotation' && ev.date === rotationForSelectedDate.date);
                        if (idx !== -1) {
                          const updated = schedule.filter((_, i) => i !== idx);
                          await saveSchedule(updated);
                        }
                        setShowDeleteConfirm(false);
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
      {/* Add Rotation Modal */}
      <Modal visible={showRotationModal} animationType="slide" transparent onRequestClose={() => setShowRotationModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '92%', maxWidth: 420, backgroundColor: isDark ? '#23272e' : '#fff', borderRadius: 20, padding: 24, elevation: 10 }}>
            {/* Date, Month, Year display */}
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#1976d2', marginBottom: 10, alignSelf: 'center' }}>
              {rotationDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
            {/* Ward input */}
            <TextInput
              style={{ borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 14, color: isDark ? '#fff' : '#111', borderColor: isDark ? '#2196F3' : '#0a7ea4', backgroundColor: isDark ? '#23272e' : '#fff' }}
              placeholder="Ward"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={rotationWard}
              onChangeText={setRotationWard}
            />
            {/* Shift start time */}
            <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>Shift Start Time</Text>
            <TouchableOpacity
              style={{ borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 14, backgroundColor: isDark ? '#23272e' : '#fff', borderColor: isDark ? '#2196F3' : '#0a7ea4' }}
              onPress={() => setShowStartPicker(true)}
              activeOpacity={0.8}
            >
              <Text style={{ color: rotationStart ? (isDark ? '#fff' : '#111') : (isDark ? '#aaa' : '#888'), fontSize: 16 }}>
                {rotationStart ? rotationStart : 'Pick start time'}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={rotationStart ? new Date(`1970-01-01T${rotationStart}:00`) : new Date()}
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) {
                    let h = selectedDate.getHours();
                    const m = selectedDate.getMinutes();
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    h = h % 12;
                    if (h === 0) h = 12;
                    const hStr = h.toString().padStart(2, '0');
                    const mStr = m.toString().padStart(2, '0');
                    setRotationStart(`${hStr}:${mStr} ${ampm}`);
                  }
                }}
              />
            )}
            {/* Shift end time */}
            <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>Shift End Time</Text>
            <TouchableOpacity
              style={{ borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 18, backgroundColor: isDark ? '#23272e' : '#fff', borderColor: isDark ? '#2196F3' : '#0a7ea4' }}
              onPress={() => setShowEndPicker(true)}
              activeOpacity={0.8}
            >
              <Text style={{ color: rotationEnd ? (isDark ? '#fff' : '#111') : (isDark ? '#aaa' : '#888'), fontSize: 16 }}>
                {rotationEnd ? rotationEnd : 'Pick end time'}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={rotationEnd ? new Date(`1970-01-01T${rotationEnd}:00`) : new Date()}
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) {
                    let h = selectedDate.getHours();
                    const m = selectedDate.getMinutes();
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    h = h % 12;
                    if (h === 0) h = 12;
                    const hStr = h.toString().padStart(2, '0');
                    const mStr = m.toString().padStart(2, '0');
                    setRotationEnd(`${hStr}:${mStr} ${ampm}`);
                  }
                }}
              />
            )}
            {/* Note input */}
            <TextInput
              style={{ borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 10, color: isDark ? '#fff' : '#111', borderColor: isDark ? '#2196F3' : '#0a7ea4', backgroundColor: isDark ? '#23272e' : '#fff' }}
              placeholder="Note (optional)"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={rotationNote}
              onChangeText={setRotationNote}
              multiline
              numberOfLines={2}
            />
            {/* Cancel and Add buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <TouchableOpacity style={{ backgroundColor: '#e53935', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8, marginRight: 10 }} onPress={() => setShowRotationModal(false)}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#43a047', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8 }}
                onPress={async () => {
                  // Prevent saving for past dates
                  const dateStr = rotationDate.toISOString().slice(0, 10);
                  if (dateStr < todayStr) return;
                  // If editing, update existing rotation, else add new
                  let updated;
                  if (editIdx !== null && schedule[editIdx]?.type === 'rotation') {
                    updated = schedule.map((ev, i) =>
                      i === editIdx
                        ? {
                            ...ev,
                            ward: rotationWard,
                            start: rotationStart,
                            end: rotationEnd,
                            note: rotationNote,
                          }
                        : ev
                    );
                  } else {
                    // Only add if not already present for this date
                    if (rotations.find(r => r.date === dateStr)) return;
                    updated = [
                      ...schedule,
                      {
                        type: 'rotation',
                        date: dateStr,
                        ward: rotationWard,
                        start: rotationStart,
                        end: rotationEnd,
                        note: rotationNote,
                        createdAt: Date.now(),
                      },
                    ];
                  }
                  await saveSchedule(updated);
                  // If adding (not editing), also add to phone calendar
                  if (editIdx === null) {
                    await addRotationToCalendar(rotationWard, dateStr, rotationStart, rotationEnd, rotationNote);
                  }
                  setShowRotationModal(false);
                  setRotationWard('');
                  setRotationStart('');
                  setRotationEnd('');
                  setRotationNote('');
                  setEditIdx(null);
                }}
                disabled={!rotationWard || !rotationStart || !rotationEnd || rotationDate.toISOString().slice(0, 10) < todayStr}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* All Rotations Section */}
      <View style={{ marginTop: 32, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#1976d2' : '#1976d2', marginBottom: 12 }}>All Rotations</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {rotations.length === 0 ? (
            <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 16, marginTop: 16, textAlign: 'center' }}>No scheduled events yet.</Text>
          ) : (
            (() => {
              const today = new Date();
              today.setHours(0,0,0,0);
              const sorted = [...rotations].sort((a, b) => {
                const da = new Date(a.date);
                const db = new Date(b.date);
                da.setHours(0,0,0,0);
                db.setHours(0,0,0,0);
                // Current (today) first, then future, then past
                if (da.getTime() === today.getTime()) return -1;
                if (db.getTime() === today.getTime()) return 1;
                if (da > today && db > today) return da.getTime() - db.getTime();
                if (da < today && db < today) return db.getTime() - da.getTime();
                if (da > today) return -1;
                if (db > today) return 1;
                return 0;
              });
              return sorted.map((ev, idx) => (
                <View key={ev.createdAt || idx} style={{ backgroundColor: isDark ? '#23272e' : '#f7fafd', borderRadius: 10, padding: 16, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: isDark ? '#1976d2' : '#2196F3' }}>
                  <Text style={{ color: isDark ? '#1976d2' : '#1976d2', fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>
                    {(() => {
                      const d = new Date(ev.date);
                      const day = d.toLocaleDateString(undefined, { weekday: 'long' });
                      const dayNum = d.getDate();
                      const nth = (n: number) => {
                        if (n > 3 && n < 21) return 'th';
                        switch (n % 10) {
                          case 1: return 'st';
                          case 2: return 'nd';
                          case 3: return 'rd';
                          default: return 'th';
                        }
                      };
                      const month = d.toLocaleDateString(undefined, { month: 'long' });
                      const year = d.getFullYear();
                      return `${day} ${dayNum}${nth(dayNum)} ${month} ${year}`;
                    })()}
                  </Text>
                  <Text style={{ color: isDark ? '#43a047' : '#388e3c', fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{ev.ward}</Text>
                  <Text style={{ color: isDark ? '#aaa' : '#333', fontSize: 14, marginBottom: 2 }}>{ev.start} - {ev.end}</Text>
                  {ev.note ? <Text style={{ color: isDark ? '#ccc' : '#444', fontSize: 15, marginBottom: 4 }}>{ev.note}</Text> : null}
                </View>
              ));
            })()
          )}
        </ScrollView>
      </View>
      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '92%', maxWidth: 420, backgroundColor: isDark ? '#23272e' : '#fff', borderRadius: 20, padding: 24, elevation: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#1976d2', marginBottom: 16, alignSelf: 'center' }}>{editIdx !== null ? 'Edit Event' : 'Add Event'}</Text>
            <TextInput
              style={{ borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 10, color: isDark ? '#fff' : '#111', borderColor: isDark ? '#2196F3' : '#0a7ea4', backgroundColor: isDark ? '#23272e' : '#fff' }}
              placeholder="Title"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={{ borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 10, color: isDark ? '#fff' : '#111', borderColor: isDark ? '#2196F3' : '#0a7ea4', backgroundColor: isDark ? '#23272e' : '#fff' }}
              placeholder="Description (optional)"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={desc}
              onChangeText={setDesc}
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={{ borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 10, color: isDark ? '#fff' : '#111', borderColor: isDark ? '#2196F3' : '#0a7ea4', backgroundColor: isDark ? '#23272e' : '#fff' }}
              placeholder="Date (YYYY-MM-DD)"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={date}
              onChangeText={setDate}
            />
            <TextInput
              style={{ borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 10, color: isDark ? '#fff' : '#111', borderColor: isDark ? '#2196F3' : '#0a7ea4', backgroundColor: isDark ? '#23272e' : '#fff' }}
              placeholder="Time (e.g. 14:00)"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={time}
              onChangeText={setTime}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <TouchableOpacity style={{ backgroundColor: '#e53935', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8, marginRight: 10 }} onPress={() => setShowModal(false)}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#43a047', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8 }} onPress={handleSave} disabled={!title || !date || !time}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{editIdx !== null ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  </ScrollView>
  );
}
