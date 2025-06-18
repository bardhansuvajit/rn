import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg' }}
          style={styles.logo}
        />
        <Text style={styles.appName}>ShopEasy</Text>
      </View>

      {/* Delivery Pincode */}
      <TouchableOpacity style={styles.deliveryContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/290275/pexels-photo-290275.jpeg' }}
          style={styles.locationIcon}
        />
        <Text style={styles.deliveryText}>Delivery: 560001</Text>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg' }}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  appName: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  deliveryText: {
    fontSize: 14,
    color: '#333333',
  },
  arrowIcon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
});

export default Header;