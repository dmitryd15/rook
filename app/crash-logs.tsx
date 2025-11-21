import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { clearCrashLogs, getCrashLogs } from '../utils/crashLogger';

export default function CrashLogsScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    const data = await getCrashLogs();
    setLogs(data.reverse());
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crash Logs</Text>
      <Button title="Refresh" onPress={loadLogs} />
      <Button title="Clear Logs" color="red" onPress={async () => { await clearCrashLogs(); loadLogs(); }} />
      <ScrollView style={{ marginTop: 16 }}>
        {loading ? <Text>Loading...</Text> : logs.length === 0 ? <Text>No crash logs found.</Text> : logs.map((log, i) => (
          <View key={i} style={styles.logBox}>
            <Text style={styles.date}>{log.date}</Text>
            <Text selectable style={styles.error}>{log.error}</Text>
            {log.errorInfo && <Text selectable style={styles.info}>{log.errorInfo}</Text>}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1976d2', marginBottom: 12 },
  logBox: { backgroundColor: '#f7faff', borderRadius: 8, padding: 12, marginBottom: 12 },
  date: { color: '#888', fontSize: 12, marginBottom: 4 },
  error: { color: '#d32f2f', fontWeight: 'bold' },
  info: { color: '#333', fontSize: 12, marginTop: 4 },
});
