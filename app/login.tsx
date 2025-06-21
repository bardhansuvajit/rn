import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { Video, ResizeMode } from 'expo-av';
import { integersOnly } from '@utils/inputSanitizers';
import BASE_URL from '@constants/api';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      });
      return () => task.cancel();
    }, [])
  );

  const handlePhoneChange = (text: string) => {
    setPhone(integersOnly(text));
  };

  const handleContinue = async () => {
    if (!phone || phone.length !== 10) {
      ToastAndroid.show('Please enter a valid 10-digit number', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/login/check`, { phone });
      console.log('API Response:', response.data);
      ToastAndroid.show('Login check success', ToastAndroid.SHORT);
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      ToastAndroid.show('Login failed', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const video = useRef(null);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* 🔁 Background Video */}
      <Video
        ref={video}
        source={require('../assets/images/login/login-bg.mp4')} // Must be local for background autoplay
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
      />
        <SafeAreaView className="flex-1 justify-center p-6 bg-black/40 dark:bg-black/60">
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <View className="mb-8">
            <Text className="text-3xl font-bold text-center text-white">
                Sign in / Create your account
            </Text>
            <Text className="text-center text-gray-200 mt-2">
                Enter your Phone Number to proceed
            </Text>
            </View>

            <View className="mb-4">
            <Text className="text-sm font-medium text-white mb-1">Phone Number</Text>
            <View className="flex-row items-center bg-white/90 border border-gray-300 rounded-lg overflow-hidden">
                <View className="px-3 py-3 bg-gray-100 border-r border-gray-200">
                <Text className="text-gray-800">India (+91)</Text>
                </View>
                <TextInput
                className="flex-1 p-3 text-gray-800"
                placeholder="Enter phone number"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="number-pad"
                maxLength={10}
                ref={inputRef}
                />
            </View>
            </View>

            <View className="mt-5">
            <Text className="text-white/80 mb-4">
                By continuing you agree to our Terms & Conditions
            </Text>
            </View>

            <TouchableOpacity
            className="bg-primary-600 dark:bg-primary-700 py-3 rounded-lg mb-4"
            onPress={handleContinue}
            disabled={loading}
            >
            <Text className="text-white text-center font-semibold">
                {loading ? 'Please wait...' : 'Continue'}
            </Text>
            </TouchableOpacity>

            <View className="absolute top-14 right-10">
            <TouchableOpacity onPress={toggleColorScheme}>
                <Text className="text-white text-xl">
                {colorScheme === 'dark' ? '☀️' : '🌙'}
                </Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    </View>
  );
};

export default LoginPage;
