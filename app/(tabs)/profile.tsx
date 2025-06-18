import { View, Text, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { integersOnly } from '@utils/inputSanitizers';
import BASE_URL from '@constants/api';

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const handlePhoneChange = (text: string) => {
        setPhone(integersOnly(text));
    };

    // Create the ref and focus inside useEffect
    const inputRef = useRef<TextInput>(null);
    useFocusEffect(
        React.useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100); // 100–300ms works best
            });

            return () => task.cancel();
        }, [])
    );


    const handleContinue = async () => {
        // Check if phone is empty or not 10 digits
        if (!phone || phone.length !== 10) {
            ToastAndroid.show('Please enter a valid 10-digit number', ToastAndroid.SHORT);
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${BASE_URL}/login/check`, {
                phone,
            });

            console.log('API Response:', response.data);
            ToastAndroid.show('Login check success', ToastAndroid.SHORT);

        } catch (error: any) {
            console.error('API Error:', error.response?.data || error.message);
            ToastAndroid.show('Login failed', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

  return (
    <SafeAreaView className="flex-1 justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View className="mb-8">
        <Text className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Sign in/ Create your account
        </Text>
        <Text className="text-center text-gray-600 dark:text-gray-300 mt-2">
          Enter your Phone Number to proceed
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number
        </Text>
        <View className="flex-row items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <View className="px-3 py-3 bg-gray-100 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
            <Text className="text-gray-800 dark:text-white">India (+91)</Text>
          </View>
          <TextInput
            className="flex-1 p-3 text-gray-800 dark:text-white"
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
        <Text className="text-gray-500 dark:text-gray-400 mb-4">
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
          <Text className="text-gray-800 dark:text-white">
            {colorScheme === 'dark' ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;