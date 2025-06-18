import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatIndianMoney } from '@utils/indianMoneyFormat';
import { useColorScheme } from 'nativewind';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  saved: boolean;
};

const Cart = () => {
  const { colorScheme } = useColorScheme();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Fresh Salmon Fillet',
      price: 599,
      quantity: 1,
      image: '🐟',
      saved: false
    },
    {
      id: 2,
      name: 'Prawns (500g)',
      price: 449,
      quantity: 2,
      image: '🦐',
      saved: false
    },
    {
      id: 3,
      name: 'Chicken Breast (1kg)',
      price: 299,
      quantity: 1,
      image: '🍗',
      saved: false
    },
    {
      id: 4,
      name: 'Mackerel Fish',
      price: 349,
      quantity: 1,
      image: '🐠',
      saved: false
    },
  ]);

  const [savedItems, setSavedItems] = useState<CartItem[]>([]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 49;
  const total = subtotal + shipping;

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };

  const confirmRemove = (id: number) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => toggleSaveItem(id) }
      ]
    );
  };

  const toggleSaveItem = (id: number) => {
    const itemIndex = cartItems.findIndex(item => item.id === id);
    const item = cartItems[itemIndex];
    
    if (item.saved) {
      setCartItems(cartItems.map(i => 
        i.id === id ? {...i, saved: false} : i
      ));
      setSavedItems(savedItems.filter(i => i.id !== id));
    } else {
      setCartItems(cartItems.filter(i => i.id !== id));
      setSavedItems([...savedItems, {...item, saved: true}]);
    }
  };

  const moveToCart = (id: number) => {
    const item = savedItems.find(item => item.id === id);
    if (!item) return;
    setSavedItems(savedItems.filter(i => i.id !== id));
    setCartItems([...cartItems, { ...item, saved: false }]);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <View className="flex-row items-center">
        <View className="w-16 h-16 items-center justify-center rounded-lg mr-4">
          <Text className="text-5xl">{item.image}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</Text>
          <Text className="text-gray-500 dark:text-gray-400">
            {formatIndianMoney(item.price)} x {item.quantity}
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity 
            className={`w-8 h-8 items-center justify-center rounded-full ${
              item.quantity <= 1 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-600'
            }`}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Text className={`text-lg ${item.quantity <= 1 ? 'text-gray-400' : ''}`}>-</Text>
          </TouchableOpacity>
          <Text className="mx-3 text-gray-900 dark:text-white">{item.quantity}</Text>
          <TouchableOpacity 
            className="w-8 h-8 items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full"
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text className="text-lg">+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-3 flex-row">
        <TouchableOpacity 
          className="mr-4"
          onPress={() => toggleSaveItem(item.id)}
        >
          <Text className="text-blue-500 dark:text-blue-400 text-sm">Save for later</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmRemove(item.id)}>
          <Text className="text-red-500 dark:text-red-400 text-sm">Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSavedItem = ({ item }: { item: CartItem }) => (
    <View className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <View className="flex-row items-center">
        <View className="w-16 h-16 items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg mr-4">
          <Text className="text-2xl">{item.image}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</Text>
          <Text className="text-gray-500 dark:text-gray-400">{formatIndianMoney(item.price)}</Text>
        </View>
      </View>
      <TouchableOpacity 
        className="mt-3"
        onPress={() => moveToCart(item.id)}
      >
        <Text className="text-blue-500 dark:text-blue-400 text-sm">Move to cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <FlatList
        className="flex-1 p-4"
        data={[{ key: 'content' }]} // Single item to render all content
        renderItem={() => (
          <>
            {/* Cart Items */}
            {cartItems.length > 0 ? (
              <>
                <Text className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                  Items in Cart ({cartItems.length})
                </Text>
                <FlatList
                  data={cartItems}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderCartItem}
                  scrollEnabled={false}
                />
              </>
            ) : (
              <View className="items-center py-8">
                <Text className="text-gray-400 text-lg mb-4">🛒 Your cart is empty</Text>
                <TouchableOpacity className="bg-primary-600 px-6 py-3 rounded-lg">
                  <Text className="text-white font-medium">Browse Products</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Saved Items */}
            {savedItems.length > 0 && (
              <>
                <Text className="text-lg font-medium mb-3 mt-6 text-gray-900 dark:text-white">
                  Saved for Later ({savedItems.length})
                </Text>
                <FlatList
                  data={savedItems}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderSavedItem}
                  scrollEnabled={false}
                />
              </>
            )}

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <View className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Order Summary</Text>
                
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600 dark:text-gray-300">Subtotal</Text>
                  <Text className="text-gray-900 dark:text-white">{formatIndianMoney(subtotal)}</Text>
                </View>
                
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600 dark:text-gray-300">Shipping</Text>
                  <Text className="text-gray-900 dark:text-white">{formatIndianMoney(shipping)}</Text>
                </View>
                
                <View className="h-px bg-gray-200 dark:bg-gray-700 my-3" />
                
                <View className="flex-row justify-between">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">Total</Text>
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">{formatIndianMoney(total)}</Text>
                </View>
              </View>
            )}
          </>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <TouchableOpacity 
            className="w-full bg-primary-600 dark:bg-primary-700 py-3 rounded-lg items-center"
            onPress={() => console.log('Proceed to Checkout')}
          >
            <Text className="text-white font-bold">
              Proceed to Checkout ({formatIndianMoney(total)})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;