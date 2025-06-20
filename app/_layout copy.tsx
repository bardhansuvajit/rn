import { Stack } from "expo-router";
import './globals.css';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const prepare = async () => {
      try {
        // Artificially delay for 3 seconds to see the splash screen
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}