import { View, Text, TouchableOpacity, FlatList, Alert, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatIndianMoney } from '@utils/indianMoneyFormat';
import { useColorScheme } from 'nativewind';
import { SvgXml } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import colors from 'tailwindcss/colors';

// SVG Icons
const minusIcon = `<svg width="24px" height="24px" viewBox="0 0 16 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const plusIcon = `<svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const deleteIcon = `<svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4H14M5 4V2H11V4M13 4V14C13 14.5523 12.5523 15 12 15H4C3.44772 15 3 14.5523 3 14V4H13Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cartIcon = `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

type CartItem = {
    id: number;
    name: string;
    variation: string;
    price: number;
    quantity: number;
    image: string;
    saved: boolean;
};

const Cart = () => {
    const userLoggedIn = false;
    const hasAddress = false;
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [savedItems, setSavedItems] = useState<CartItem[]>([]);
    const router = useRouter();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setCartItems([
        {
          id: 1,
          name: 'Fresh Salmon Fillet',
          variation: '',
          price: 599,
          quantity: 1,
          image: 'https://dummyimage.com/300x300/4CAF50/fff&text=Salmon',
          saved: false
        },
        {
          id: 2,
          name: 'Prawns',
          variation: '500g',
          price: 449,
          quantity: 2,
          image: 'https://dummyimage.com/300x300/FF9800/fff&text=Prawns',
          saved: false
        },
        {
          id: 3,
          name: 'Chicken Breast',
          variation: '1kg',
          price: 299,
          quantity: 1,
          image: 'https://dummyimage.com/300x300/E91E63/fff&text=Chicken',
          saved: false
        },
        {
          id: 4,
          name: 'Mackerel Fish',
          variation: '',
          price: 349,
          quantity: 1,
          image: 'https://dummyimage.com/300x300/2196F3/fff&text=Fish',
          saved: false
        },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
        <View className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <View className="flex-row items-center">
                <View className="w-16 h-16 items-center justify-center rounded-xl mr-4 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                        source={{ uri: item.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white mb-1">{item.name}</Text>
                    <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1">{item.variation}</Text>
                    <Text className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {formatIndianMoney(item.price * item.quantity)}
                    </Text>
                </View>
                <View className="flex-row items-center border border-primary-600 dark:border-primary-700 bg-primary-600 dark:bg-primary-700 rounded-lg">
                    <TouchableOpacity 
                        className={`w-8 h-8 items-center justify-center ${item.quantity <= 1 ? 'opacity-50' : ''}`}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        <SvgXml 
                            xml={minusIcon} 
                            width={10} 
                            height={10}
                            color={isDark ? colors.gray[300] : colors.gray[50]}
                        />
                    </TouchableOpacity>
                    <Text className="mx-2 text-base font-medium text-gray-50 dark:text-white">{item.quantity}</Text>
                    <TouchableOpacity 
                        className="w-8 h-8 items-center justify-center"
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                        <SvgXml 
                            xml={plusIcon} 
                            width={10} 
                            height={10}
                            color={isDark ? colors.gray[300] : colors.gray[50]}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="mt-3 flex-row justify-between space-x-4">
                {/* Remove */}
                <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => confirmRemove(item.id)}
                >
                    {/* <SvgXml 
                        xml={deleteIcon} 
                        width={16} 
                        height={16}
                        color={colors.red[500]}
                    /> */}
                    <Text className="text-gray-400 dark:text-gray-400 text-xs ml-1">Remove</Text>
                </TouchableOpacity>

                {/* Save for later */}
                <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => toggleSaveItem(item.id)}
                >
                    <Text className="text-gray-400 dark:text-gray-400 text-xs ml-1">Save for later</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

  const renderSavedItem = ({ item }: { item: CartItem }) => (
    <View className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <View className="flex-row items-center">
        <View className="w-16 h-16 items-center justify-center rounded-xl mr-4 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-1">{item.name}</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {formatIndianMoney(item.price)}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        className="mt-3 flex-row justify-end items-center"
        onPress={() => moveToCart(item.id)}
      >
        <SvgXml 
          xml={plusIcon} 
          width={16} 
          height={16}
          color={colors.blue[500]}
        />
        <Text className="text-blue-500 dark:text-blue-400 text-sm ml-1">Move to cart</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
        {/* Fixed Header Skeleton with Tailwind gradient */}
        <View className="pt-4 pb-3 px-4 shadow-sm bg-gradient-to-r from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <View className="ml-3">
                <View className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
              </View>
            </View>
            <View className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </View>
        </View>

        <View className="p-4">
          {/* Cart Items Skeleton */}
          <View className="mb-6">
            {[1, 2, 3].map((_, index) => (
              <View key={index} className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
                <View className="flex-row items-center">
                  <View className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-xl mr-4" />
                  <View className="flex-1">
                    <View className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                    <View className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-1" />
                    <View className="h-3 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
                  </View>
                  <View className="flex-row items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                    <View className="w-8 h-8 bg-gray-300 dark:bg-gray-700" />
                    <View className="w-8 h-8 bg-gray-300 dark:bg-gray-700 mx-1" />
                    <View className="w-8 h-8 bg-gray-300 dark:bg-gray-700" />
                  </View>
                </View>
                <View className="flex-row justify-end mt-3 space-x-4">
                  <View className="w-16 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                  <View className="w-16 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                </View>
              </View>
            ))}
          </View>

          {/* Order Summary Skeleton */}
          <View className="p-4 bg-white dark:bg-gray-800 rounded-xl">
            <View className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
            <View className="flex-row justify-between mb-3">
              <View className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
              <View className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            </View>
            <View className="flex-row justify-between mb-3">
              <View className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
              <View className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            </View>
            <View className="h-px bg-gray-200 dark:bg-gray-700 my-3" />
            <View className="flex-row justify-between">
              <View className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
              <View className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Fixed Header with Tailwind gradient */}
      <View className="pt-4 pb-3 px-4 shadow-sm bg-gradient-to-r from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <SvgXml 
              xml={cartIcon} 
              width={16} 
              height={16}
              color={isDark ? colors.gray[300] : colors.gray[800]}
            />
            <Text className="text-xl font-bold ml-3 text-gray-900 dark:text-white">Cart</Text>
          </View>
          <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>

      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 120, paddingHorizontal: 16 }}
        data={[{ key: 'content' }]}
        renderItem={() => (
          <>
            {/* Cart Items */}
            {cartItems.length > 0 ? (
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCartItem}
                scrollEnabled={false}
                // ListHeaderComponent={
                //   <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                //     Your Cart Items
                //   </Text>
                // }
              />
            ) : (
                <View className="items-center py-8">
                    <Text className="text-gray-400 text-lg mb-4">🛒 Your cart is empty</Text>
                    <TouchableOpacity 
                        className="bg-primary-600 px-6 py-3 rounded-lg"
                        style={{
                            backgroundColor: isDark ? colors.blue[700] : colors.blue[600]
                        }}
                    >
                        <Text 
                            className="text-white font-medium"
                            onPress={() => router.push(`/`)}
                        >
                            Browse Products
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Order Summary */}
            {cartItems.length > 0 && (
                <>
                    <View className="mt-6 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Order Summary</Text>

                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-600 dark:text-gray-300 text-xs">Subtotal</Text>
                            <Text className="text-gray-900 dark:text-white text-xs">{formatIndianMoney(subtotal)}</Text>
                        </View>

                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-600 dark:text-gray-300 text-xs">Delivery</Text>
                            <Text className="text-gray-900 dark:text-white text-xs">{formatIndianMoney(shipping)}</Text>
                        </View>

                        <View className="h-px bg-gray-200 dark:bg-gray-700 my-3" />

                        <View className="flex-row justify-between">
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">Total</Text>
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">{formatIndianMoney(total)}</Text>
                        </View>
                    </View>
                </>
            )}

            {/* Saved Items */}
            {savedItems.length > 0 && (
              <FlatList
                data={savedItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSavedItem}
                scrollEnabled={false}
                ListHeaderComponent={
                  <Text className="text-sm font-bold mb-4 mt-6 text-gray-900 dark:text-white">
                    Saved for Later
                  </Text>
                }
              />
            )}

            {/* Cancellation */}
            {cartItems.length > 0 && (
                <>
                    <View className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <Text className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                            Cancellation Policy
                        </Text>
                        <Text className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            Orders can be cancelled any time before they are packed. A full refund will be initiated to your original payment method instantly after cancellation.
                        </Text>
                    </View>
                </>
            )}
          </>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 shadow-sm">
            {(() => {
                // Branch 1 – user must sign in
                if (!userLoggedIn) {
                return (
                    <>
                        <Text className="dark:text-gray-400 text-xs mb-3 text-center">
                            Welcome! Please sign in so we can get your order started.
                        </Text>
                        <TouchableOpacity
                            className={`w-full py-3 rounded-xl items-center ${isDark ? 'bg-primary-700' : 'bg-primary-600'}`}
                            onPress={() => console.log('Open Sign-In')}
                        >
                            <Text className="text-white font-bold text-lg">Sign in to continue</Text>
                        </TouchableOpacity>
                    </>
                );
                }

                // Branch 2 – user logged in but no address
                if (!hasAddress) {
                return (
                    <>
                        <Text className="dark:text-gray-400 text-xs mb-3 text-center">
                            Let&apos;s make sure we know where to send your order. Please add a delivery address.
                        </Text>
                        <TouchableOpacity
                            className={`w-full py-3 rounded-xl items-center ${isDark ? 'bg-primary-700' : 'bg-primary-600'}`}
                            onPress={() => console.log('Add Address')}
                        >
                            <Text className="text-white font-bold text-lg">Add Delivery Address</Text>
                        </TouchableOpacity>
                    </>
                );
                }

                // Branch 3 – everything is fine, show checkout
                return (
                    <>
                        <Text className="dark:text-gray-400 text-xs mb-3 text-center">
                            You're almost there! Tap below to place your order.
                        </Text>
                        <TouchableOpacity
                            className={`w-full py-3 rounded-xl items-center ${isDark ? 'bg-primary-700' : 'bg-primary-600'}`}
                            onPress={() => console.log('Add Address')}
                        >
                            <Text className="text-white font-bold text-lg">Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </>
                );
            })()}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;