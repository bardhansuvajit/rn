import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Modal, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';
import AppLogo from '../../assets/images/icon.png';
import AppLogoDark from '../../assets/images/icon.png';
import { locationPinIcon, searchIcon } from '@utils/svgIcons';
import { integersOnly } from '@utils/inputSanitizers';
import { formatIndianMoney } from '@utils/indianMoneyFormat';
import { useRouter } from 'expo-router';
import { InteractionManager } from 'react-native';

interface Category {
    id: string;
    name: string;
    imageUrl?: string;
}

interface SliderItem {
    id: string;
    imageUrl: string;
    imageAlt?: string;
}

interface Product {
    id: number;
    categoryId: number;
    name: string;
    price: number;
    mrp: number;
    discount: number;
    tags: string[];
    image: string;
    stock: number;
}

const Header = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [newPostalCode, setNewPostalCode] = useState('');
    const [currentPostalCode, setCurrentPostalCode] = useState('700001');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
    const [loadingSlider, setLoadingSlider] = useState(true);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const searchInputRef = useRef<TextInput>(null);
    const postalCodeInputRef = useRef<TextInput>(null);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Simulate API call
                // In a real app, you would use something like:
                // const response = await fetch('https://api.example.com/categories');
                // const data = await response.json();
                
                // Mock API response with placeholder images
                const mockCategories = [
                    { id: '1', name: 'All', imageUrl: 'https://dummyimage.com/100&text=All' },
                    { id: '2', name: 'Groceries', imageUrl: 'https://dummyimage.com/100&text=Groceries' },
                    { id: '3', name: 'Electronics', imageUrl: 'https://dummyimage.com/100&text=Electronics' },
                    { id: '4', name: 'Fashion', imageUrl: 'https://dummyimage.com/100&text=Fashionable' },
                    { id: '5', name: 'Home', imageUrl: 'https://dummyimage.com/100&text=Home-Items' },
                    { id: '6', name: 'Beauty', imageUrl: 'https://dummyimage.com/100&text=Beauty-Lists' },
                    { id: '7', name: 'Toys', imageUrl: 'https://dummyimage.com/100&text=Toys-Gift' },
                    { id: '8', name: 'Sports', imageUrl: 'https://dummyimage.com/100&text=Sports-Item' },
                ];

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                setCategories(mockCategories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                // Fallback categories in case API fails
                setCategories([{ id: '1', name: 'All', imageUrl: 'https://placehold.co/50?text=All' }]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Fetch sliders from API
    useEffect(() => {
        const fetchSliderData = async () => {
            try {
            // Mock API response
            const mockSliderItems = [
                { id: '1', imageUrl: 'https://dummyimage.com/800x400/4CAF50/fff&text=Special Offer', imageAlt: 'Special Offer' },
                { id: '2', imageUrl: 'https://dummyimage.com/800x400/2196F3/fff&text=New Arrivals', imageAlt: 'New Arrivals' },
                { id: '3', imageUrl: 'https://dummyimage.com/800x400/FF9800/fff&text=Seasonal Sale', imageAlt: 'Seasonal Sale' },
            ];
            
            await new Promise(resolve => setTimeout(resolve, 500));
            setSliderItems(mockSliderItems);
            } catch (error) {
            console.error('Failed to fetch slider:', error);
            } finally {
            setLoadingSlider(false);
            }
        };

        fetchSliderData();
    }, []);

    // Sliders auto scroll after 3 seconds
    useEffect(() => {
        if (!sliderItems.length || loadingSlider) return;

        const interval = setInterval(() => {
            setCurrentSlideIndex(prevIndex => {
                const newIndex = (prevIndex + 1) % sliderItems.length;
                
                // Scroll to the new index
                scrollViewRef.current?.scrollTo({
                    x: newIndex * Dimensions.get('window').width,
                    animated: true,
                });
                
                return newIndex;
            });
        }, 3000); // 3 seconds interval

        return () => clearInterval(interval);
    }, [sliderItems.length, loadingSlider]);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
            // Mock API response
            const mockProducts = [
                {
                id: 1,
                categoryId: 1,
                name: 'Fresh Fish',
                price: 299,
                mrp: 349,
                discount: 15,
                tags: ['500 g', 'Fresh'],
                image: 'https://dummyimage.com/300x300/4CAF50/fff&text=Fish',
                stock: 10,
                },
                {
                id: 2,
                categoryId: 2,
                name: 'Raw Chicken',
                price: 249,
                mrp: 295,
                discount: 12,
                tags: ['500gm-1kg', 'Fresh'],
                image: 'https://dummyimage.com/300x300/FF9800/fff&text=Chicken',
                stock: 15,
                },
                {
                id: 3,
                categoryId: 3,
                name: 'Goat Mutton',
                price: 899,
                mrp: 1049,
                discount: 24,
                tags: ['500 g', 'Fresh'],
                image: 'https://dummyimage.com/300x300/795548/fff&text=Mutton',
                stock: 8,
                },
                {
                id: 4,
                categoryId: 4,
                name: 'Seasonal Fruits',
                price: 88,
                mrp: 112,
                discount: 18,
                tags: ['100-200 g', 'Fresh'],
                image: 'https://dummyimage.com/300x300/8BC34A/fff&text=Fruits',
                stock: 20,
                },
                {
                id: 5,
                categoryId: 5,
                name: 'Organic Vegetables',
                price: 120,
                mrp: 150,
                discount: 20,
                tags: ['500 g', 'Organic'],
                image: 'https://dummyimage.com/300x300/4CAF50/fff&text=Veggies',
                stock: 25,
                },
                {
                id: 6,
                categoryId: 6,
                name: 'Fresh Milk',
                price: 60,
                mrp: 70,
                discount: 14,
                tags: ['1L', 'Dairy'],
                image: 'https://dummyimage.com/300x300/FFFFFF/000&text=Milk',
                stock: 30,
                },
            ];

            await new Promise(resolve => setTimeout(resolve, 500));
            setProducts(mockProducts);
            } catch (error) {
            console.error('Failed to fetch products:', error);
            } finally {
            setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    // Focus when search modal opens
    useEffect(() => {
        if (isSearchVisible) {
            const timeout = setTimeout(() => {
                InteractionManager.runAfterInteractions(() => {
                    searchInputRef.current?.focus();
                });
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [isSearchVisible]);

    // Focus when delivery postcode modal opens
    useEffect(() => {
        if (isLocationModalVisible) {
            const timeout = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                postalCodeInputRef.current?.focus();
            });
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [isLocationModalVisible]);


    const handleLocationPress = () => {
        setIsLocationModalVisible(true);
        setNewPostalCode('');
        setErrorMessage('');
    };

    const handleLocationChange = () => {
        if (newPostalCode === '700001' || newPostalCode === '700002') {
            setCurrentPostalCode(newPostalCode);
            setIsLocationModalVisible(false);
            setErrorMessage('');
        } else {
            setErrorMessage('We don\'t deliver to this location yet');
        }
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-gray-900">
            {/* Fixed Header Section */}
            <View className="bg-white dark:bg-gray-900">
                {/* Main Header */}
                <View className="flex-row justify-between items-center px-4 pt-2 pb-2 bg-white dark:bg-gray-900">
                    {/* Left - Logo */}
                    <Image source={isDark ? AppLogoDark : AppLogo} className="w-10 h-10 rounded-lg" />

                    {/* Right - Location */}
                    <TouchableOpacity 
                        className="flex-row items-center px-3 py-2" 
                        activeOpacity={0.7}
                        onPress={handleLocationPress}
                    >
                        <View>
                            <SvgXml 
                                xml={locationPinIcon} 
                                width={16} 
                                height={16}
                                color={isDark ? colors.gray[400] : colors.gray[500]} 
                            />
                        </View>

                        <View className="ml-2">
                            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Delivery to</Text>
                            <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Kolkata {currentPostalCode}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Full-width Search Bar */}
                <TouchableOpacity 
                    className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 mx-4 mb-3"
                    activeOpacity={0.8}
                    onPress={() => setIsSearchVisible(true)}
                >
                    <View className="text-gray-500 dark:text-gray-400">
                        <SvgXml 
                            xml={searchIcon} 
                            width={18} 
                            height={18}
                            color={isDark ? colors.gray[400] : colors.gray[500]}
                        />
                    </View>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 ml-2.5">
                        Search for products...
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingTop: 0 }}
            >
                {/* Categories Scroll View */}
                <View className="mb-3">
                    {loadingCategories ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <View key={index} className="items-center mr-3 animate-pulse">
                                <View className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 mb-1" />
                                <View className="w-12 h-3 rounded bg-gray-300 dark:bg-gray-700" />
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                            className="flex-grow-0"
                        >
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    onPress={() => setSelectedCategory(category.name)}
                                    className={`mr-3 items-center ${selectedCategory === category.name 
                                        ? 'opacity-100' 
                                        : 'opacity-70'
                                    }`}
                                    activeOpacity={0.7}
                                >
                                    <View className={`w-16 h-16 rounded-full items-center justify-center ${selectedCategory === category.name 
                                        ? 'bg-primary-100 dark:bg-primary-900/30' 
                                        : 'bg-gray-100 dark:bg-gray-800'
                                    }`}>
                                        <Image
                                            source={{ uri: category.imageUrl || `https://via.placeholder.com/50?text=${category.name}` }}
                                            className="w-16 h-16 rounded-full"
                                            resizeMode="cover"
                                            onError={(e) => console.warn('Image load error for', category.name)}
                                        />
                                    </View>
                                    <Text 
                                        className={`text-xs mt-1 font-medium ${selectedCategory === category.name 
                                            ? 'text-primary-600 dark:text-primary-400' 
                                            : isDark 
                                                ? 'text-gray-300' 
                                                : 'text-gray-700'
                                        }`}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Slider Section */}
                {loadingSlider && (
                    <View className="mb-4 px-4 animate-pulse" style={{ height: Dimensions.get('window').width * 0.5 }}>
                        <View className="w-full h-full rounded-xl bg-gray-300 dark:bg-gray-700" />
                    </View>
                )}

                {!loadingSlider && sliderItems.length > 0 && (
                    <View className="mb-4" style={{ height: Dimensions.get('window').width * 0.5 }}>
                        <ScrollView
                            ref={scrollViewRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            decelerationRate="fast"
                            scrollEventThrottle={16}
                            onScroll={(event) => {
                                const contentOffset = event.nativeEvent.contentOffset.x;
                                const index = Math.round(contentOffset / Dimensions.get('window').width);
                                setCurrentSlideIndex(index);
                            }}
                        >
                            {sliderItems.map((item) => (
                                <View 
                                    key={item.id} 
                                    style={{ width: Dimensions.get('window').width }}
                                    accessible={true}
                                    accessibilityLabel={item.imageAlt || "Promotional banner"}
                                >
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        style={{ 
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        resizeMode="contain"
                                        accessibilityElementsHidden={true}
                                        importantForAccessibility="no"
                                    />
                                </View>
                            ))}
                        </ScrollView>
                        
                        {/* Optional: Add dot indicators */}
                        <View className="flex-row justify-center mt-2">
                            {sliderItems.map((_, index) => (
                                <View
                                    key={index}
                                    className={`w-2 h-2 rounded-full mx-1 ${index === currentSlideIndex ? 'bg-primary-600' : 'bg-gray-300'}`}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* Featured Products Section */}
                <View className="px-4 mb-4">
                    <Text className="text-lg font-bold text-gray-400 dark:text-gray-500 mb-3">Products</Text>

                    {loadingProducts ? (
                        <View className="flex-row flex-wrap justify-between">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <View key={index} className="bg-white dark:bg-gray-800 w-[32%] rounded-lg overflow-hidden mb-4 border border-gray-100 dark:border-gray-700 animate-pulse">
                                <View className="aspect-square bg-gray-200 dark:bg-gray-700" />
                                <View className="p-2 space-y-2">
                                    <View className="h-3 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
                                    <View className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
                                    <View className="h-6 w-full bg-gray-300 dark:bg-gray-600 rounded mt-2" />
                                </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap justify-between">
                        {products.map(product => (
                            <TouchableOpacity
                            key={product.id}
                            className="bg-white dark:bg-gray-800 w-[32%] rounded-lg overflow-hidden mb-4 border border-gray-100 dark:border-gray-700"
                            onPress={() => router.push(`/product/${product.id}`)}
                            activeOpacity={0.9}
                            >
                            {/* Image Container */}
                            <View className="aspect-square bg-gray-50 dark:bg-gray-900">
                                <Image
                                source={{ uri: product.image }}
                                className="w-full h-full"
                                resizeMode="contain"
                                accessibilityLabel={product.name}
                                />
                            </View>

                            {/* Product Info */}
                            <View className="p-2">
                                {/* Product Name */}
                                <Text 
                                className="text-sm font-semibold text-gray-900 dark:text-white mb-1" 
                                numberOfLines={2}
                                >
                                {product.name}
                                </Text>

                                {/* Pricing */}
                                <View className="flex-col">
                                    <Text className="text-sm font-bold text-gray-900 dark:text-white">
                                        {formatIndianMoney(product.price)}
                                    </Text>
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                    ₹{product.mrp}
                                    </Text>
                                    <Text className="text-xs text-green-600 dark:text-green-400">
                                    {product.discount}% off
                                    </Text>
                                </View>
                                </View>

                                {/* Add Button */}
                                <TouchableOpacity
                                    className="bg-primary-600 dark:bg-primary-700 rounded-lg py-1 px-2 mt-2 items-center"
                                    activeOpacity={0.8}
                                >
                                <Text className="text-white text-xs font-medium">Add</Text>
                                </TouchableOpacity>
                            </View>
                            </TouchableOpacity>
                        ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Search Modal */}
            <Modal
                visible={isSearchVisible}
                animationType="slide"
                onRequestClose={() => setIsSearchVisible(false)}
            >
                <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
                    <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <TextInput
                            ref={searchInputRef}
                            keyboardType="default"
                            returnKeyType="search"
                            placeholder="Search for products..."
                            placeholderTextColor={isDark ? '#999' : '#888'}
                            className="flex-1 text-base py-2.5 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        />
                        <TouchableOpacity 
                            className="ml-3"
                            onPress={() => setIsSearchVisible(false)}
                        >
                            <Text className="text-base text-gray-400 dark:text-gray-500">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
                        <Text className="text-base text-gray-500 dark:text-gray-400">
                            Start typing to see products...
                        </Text>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* Location Change Modal */}
            <Modal
                visible={isLocationModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsLocationModalVisible(false)}
            >
                <TouchableOpacity 
                    className="flex-1 justify-center items-center bg-black/50"
                    activeOpacity={1}
                    onPressOut={() => setIsLocationModalVisible(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1}
                        onPress={() => {}} // Empty handler to prevent bubbling
                        className={`w-11/12 p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                    >
                        <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Change Delivery Location
                        </Text>

                        <TextInput
                            ref={postalCodeInputRef} 
                            placeholder="Enter new postal code"
                            placeholderTextColor={isDark ? '#999' : '#888'}
                            value={newPostalCode}
                            onChangeText={(text) => setNewPostalCode(integersOnly(text))}
                            keyboardType="numeric"
                            maxLength={6}
                            className={`text-base py-3 px-4 rounded-lg border ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} mb-4`}
                        />

                        {errorMessage ? (
                            <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
                        ) : null}

                        <Text className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Currently we only deliver to 700001 and 700002 postal codes
                        </Text>

                        <View className="flex-row justify-end space-x-3">
                            <TouchableOpacity
                                onPress={() => setIsLocationModalVisible(false)}
                                className="px-4 py-2 rounded-lg"
                            >
                                <Text className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleLocationChange}
                                disabled={!newPostalCode}
                                className={`px-4 py-2 rounded-lg ${!newPostalCode ? 'bg-gray-400' : 'bg-primary-600'}`}
                            >
                                <Text className="text-base text-white">Change</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

        </SafeAreaView>
    );
};

export default Header;