# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a


You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:


## Join the community

Join our community of developers creating universal apps.


## Expo React Native Offline APK Project

This project is set up for offline-first React Native development using Expo. All assets and code should be bundled locally to ensure the APK works without internet access.

## Development

- Use `npm start` to launch the Expo development server.
- Use Expo Go on your device to scan the QR code and live preview the app.
- All assets (images, fonts, etc.) should be placed in the project and referenced locally.

## Building Offline APK

1. Ensure all assets are bundled locally.
2. Run `npx expo export --platform android` to generate a static bundle.
3. Use EAS Build or Expo CLI to build the APK for offline use.

## Notes
- This project does not rely on remote assets or APIs.
- For a production APK, use EAS Build: https://docs.expo.dev/build/introduction/

---
Replace this README with project-specific instructions as you develop your app.
