// import { Text, View } from "react-native";
// import { Link } from "expo-router";

// export default function Index() {
//   return (
//     <View className="flex-1 items-center justify-center bg-primary-200 dark:bg-primary-900">
//         <Text className="font-bold text-primary-500 dark:text-primary-200 text-5xl">Welcome!</Text>
//     </View>
//   );
// }



import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import AppLogo from '../../assets/images/icon.png';

// SVG Icons
const locationPinIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FF6B6B">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
</svg>
`;

const chevronDownIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#4A4A4A">
  <path d="M7 10l5 5 5-5z"/>
</svg>
`;

const searchIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2">
  <circle cx="11" cy="11" r="8"/>
  <path d="M21 21l-4.35-4.35"/>
</svg>
`;

const Header = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Main Header */}
      <View style={styles.headerContainer}>
        {/* Left - Logo */}
        <Image source={AppLogo} style={styles.logo} />

        {/* Right - Location */}
        <TouchableOpacity style={styles.locationContainer} activeOpacity={0.7}>
          <SvgXml xml={locationPinIcon} width={16} height={16} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.deliveryLabel}>Delivery to</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>Bangalore 560001</Text>
              <SvgXml xml={chevronDownIcon} width={16} height={16} style={styles.chevronIcon} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Full-width Search Bar */}
      <TouchableOpacity 
        style={styles.searchBarContainer} 
        activeOpacity={0.8}
        onPress={() => setIsSearchVisible(true)}
      >
        <SvgXml xml={searchIcon} width={18} height={18} />
        <Text style={styles.searchPlaceholder}>Search for products...</Text>
      </TouchableOpacity>

      {/* Search Modal */}
      <Modal
        visible={isSearchVisible}
        animationType="slide"
        onRequestClose={() => setIsSearchVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.searchModalHeader}>
            <TextInput
              autoFocus={true}
              placeholder="Search for products..."
              placeholderTextColor="#888"
              style={styles.searchModalInput}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsSearchVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {/* Search results would go here */}
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchHintText}>Start typing to see products...</Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    paddingTop: 24
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  locationTextContainer: {
    marginLeft: 8,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  chevronIcon: {
    marginLeft: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#888',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchModalInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  closeButton: {
    marginLeft: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  searchResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchHintText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Header;