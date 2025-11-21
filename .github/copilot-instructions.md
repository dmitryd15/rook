- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [ ] Clarify Project Requirements
- [ ] Scaffold the Project
- [ ] Customize the Project
- [ ] Install Required Extensions
- [ ] Compile the Project
- [ ] Create and Run Task
- [ ] Launch the Project
- [ ] Ensure Documentation is Complete

## Progress
- Project scaffolded with Expo for offline APK development.
- README updated with offline and Expo Go instructions.
- **expo-image-picker must be installed for image/file attachment features.**
- **You should use `npx expo install expo-image-picker` instead of the global `expo` command for best compatibility.**

- If you encounter `GraphQL request failed` when running `eas build`, it is likely a temporary network or Expo server issue.
- Try again after a few minutes, check your internet connection, or visit https://status.expo.dev for Expo service status.
- If the problem persists, ensure you are logged in with `npx expo login` and your Expo CLI is up to date.

- [ ] To add shifts to your calendar by importing an ICS file, you need to:
  1. Parse the ICS file (iCalendar format) in your app using a library like `ical.js` or `ics-js`.
  2. Extract shift events from the ICS data (look for VEVENT entries).
  3. Convert each event to your app's shift format (date, ward, shiftStart, shiftEnd).
  4. Save the parsed shifts into your app's schedule storage (e.g., AsyncStorage under 'schedule_list').
  5. Optionally, provide a UI for users to select and import an ICS file (using expo-document-picker or expo-file-system).

- [ ] There is no built-in React Native/Expo API for direct ICS import, but you can implement this flow using JavaScript libraries and Expo file pickers.

- [ ] For best compatibility, use `expo-document-picker` to let users select an ICS file, then parse and import its contents as described above.
