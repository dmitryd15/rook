import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
// import * as LocalAuthentication from 'expo-local-authentication';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-reanimated';


import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreen from '../components/SplashScreen';
import { AuthProvider } from '../src/contexts/AuthContext';

// Register for push notifications and handle incoming notifications
async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);
  return token;
}

// Set notification handler to always show notifications when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  // Register for push notifications and set up listener
  useEffect(() => {
    registerForPushNotificationsAsync();
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      // Handle notification received in foreground
      console.log('Notification received:', notification);
    });
    return () => subscription.remove();
  }, []);
  const [showSplash, setShowSplash] = useState(true);
  const [eulaAccepted, setEulaAccepted] = useState<boolean | null>(null);
  const [showEula, setShowEula] = useState(false);

  // EULA text (full version)
  const EULA_TEXT = `END USER LICENSE AGREEMENT (EULA) FOR HOSPITIUM AUXILIATOR\n\nEffective Date: August 11, 2025\nDeveloper: Onyino\n\n1. ACCEPTANCE OF TERMS\nBy downloading, installing, or using Hospitium Auxiliator (\"the App\"), you agree to be bound by the terms of this End User License Agreement.\n\n2. LICENSE GRANT\nSubject to the terms of this Agreement, Onyino grants you a limited, non-exclusive, non-transferable license to use the App on your mobile device for personal or professional healthcare management purposes within Kenya only.\n\n3. GEOGRAPHIC RESTRICTION\nThis App is intended for use ONLY within the Republic of Kenya. Use of this App outside Kenya is prohibited and may violate local laws and regulations.\n\n4. RESTRICTIONS\nYou may NOT:\n- Reverse engineer, decompile, or disassemble the App\n- Distribute, sell, or sublicense the App\n- Use the App for any illegal or unauthorized purpose\n- Remove any copyright or proprietary notices\n- Use the App outside the Republic of Kenya\n\n5. HEALTHCARE DISCLAIMER\nIMPORTANT: This App is a healthcare management tool and is NOT intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare professionals for medical decisions. The developer makes no medical recommendations whatsoever.\n\n6. DATA AND PRIVACY\n- All patient data is stored locally on your device\n- No patient data is transmitted to external servers\n- You are responsible for maintaining data security and patient confidentiality\n- Comply with all applicable Kenyan healthcare privacy laws and regulations\n\n7. NO WARRANTY\nThe App is provided \"AS IS\" without warranties of any kind. Onyino disclaims all warranties, express or implied, including but not limited to merchantability and fitness for a particular purpose.\n\n8. COMPLETE LIMITATION OF LIABILITY\nTO THE FULLEST EXTENT PERMITTED BY KENYAN LAW:\n- Onyino shall NOT be liable for any damages, losses, injuries, or consequences arising from use of this App\n- You use this App entirely at your own risk\n- Onyino accepts NO responsibility for medical decisions, patient outcomes, data loss, or any other consequences\n- This limitation applies to ALL types of damages including direct, indirect, incidental, special, consequential, or punitive damages\n- Your sole remedy is to discontinue use of the App\n\n9. INDEMNIFICATION\nYou agree to indemnify and hold harmless Onyino from any claims, damages, or expenses arising from your use of the App or violation of this Agreement.\n\n10. TERMINATION\nThis license is effective until terminated. You may terminate it by uninstalling the App. Onyino may terminate this license if you fail to comply with any terms.\n\n11. GOVERNING LAW AND JURISDICTION\nThis Agreement shall be governed by the laws of the Republic of Kenya. Any disputes shall be resolved in Kenyan courts only.\n\n12. CONTACT INFORMATION\nFor questions about this EULA, contact: victoronyino@gmail.com\n\n---\n\nBy using Hospitium Auxiliator, you acknowledge that:\n- You have read and understood this Agreement\n- You agree to be bound by its terms\n- You understand the App is for use in Kenya only\n- You use the App entirely at your own risk\n- The creator accepts no liability whatsoever\n\n© 2025 Onyino. All rights reserved.`;

  useEffect(() => {
    (async () => {
      const accepted = await AsyncStorage.getItem('eulaAccepted');
      if (accepted === 'true') {
        setEulaAccepted(true);
        setShowEula(false);
      } else {
        setEulaAccepted(false);
        setShowEula(true);
      }
    })();
  }, []);

  const handleAcceptEula = async () => {
    await AsyncStorage.setItem('eulaAccepted', 'true');
    setEulaAccepted(true);
    setShowEula(false);
  };
  // Device authentication removed as per user request
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  if (!loaded || eulaAccepted === null) {
    return null;
  }
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }
  // EULA Modal
  if (showEula) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, maxWidth: 420, width: '92%', maxHeight: '90%' }}>
            <ScrollView style={{ marginBottom: 18 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#1976d2', textAlign: 'center' }}>End User License Agreement</Text>
              <Text style={{ fontSize: 15, color: '#222', lineHeight: 22 }}>{EULA_TEXT}</Text>
            </ScrollView>
            <TouchableOpacity style={{ backgroundColor: '#1976d2', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, alignSelf: 'center' }} onPress={handleAcceptEula}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>I Agree</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <AuthProvider>
      <CustomThemeProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </CustomThemeProvider>
    </AuthProvider>
  );
}
