import { Stack } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from '../components/Onboarding';

SplashScreen.preventAutoHideAsync();

// const FORCE_ONBOARDING = 'true';

export default function RootLayout() {
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
    const splashHidden = useRef(false);

    useEffect(() => {
        const init = async () => {
            try {
                // if (FORCE_ONBOARDING) return setIsFirstLaunch(true);

                const flag = await AsyncStorage.getItem('@proj1/isFirstLaunch');
                if (flag === null) {
                await AsyncStorage.setItem('@proj1/isFirstLaunch', 'false');
                    setIsFirstLaunch(true);
                } else {
                    setIsFirstLaunch(false);
                }
            } catch (e) {
                console.error('First‑launch check failed:', e);
                setIsFirstLaunch(false);
            }
        };
        init();
    }, []);

    /** hide splash once we know what to show */
    useEffect(() => {
        const hide = async () => {
            if (isFirstLaunch !== null && !splashHidden.current) {
                await SplashScreen.hideAsync();
                splashHidden.current = true;
            }
        };
        hide();
    }, [isFirstLaunch]);

    if (isFirstLaunch === null) return null;

    return isFirstLaunch ? (
        <Onboarding onDone={() => setIsFirstLaunch(false)} />
    ) : (
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        </Stack>
    );
}