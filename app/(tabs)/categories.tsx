import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';
import { formatIndianMoney } from '@utils/indianMoneyFormat';

// Dynamic data fetching simulation
const fetchCategories = () => [
    {
        id: 1,
        name: 'Fish',
        icon: 'https://img.icons8.com/emoji/96/fish-emoji.png',
    },
    {
        id: 2,
        name: 'Chicken',
        icon: 'https://img.icons8.com/3d-fluency/94/chicken.png',
    },
    {
        id: 3,
        name: 'Mutton',
        icon: 'https://img.icons8.com/external-soft-fill-juicy-fish/60/external-mutton-video-game-elements-soft-fill-soft-fill-juicy-fish.png',
    },
    {
        id: 4,
        name: 'Fruits',
        icon: 'https://img.icons8.com/emoji/96/kiwi-fruit.png',
    },
];

const fetchProducts = (categoryId: number | null) => {
  const allProducts = [
    {
        id: 1,
        categoryId: 1,
        name: 'Fresh Fish',
        price: 299,
        mrp: 349,
        discount: 15,
        tags: ['500 g', 'Fresh'],
        image: 'https://img.icons8.com/color/96/clown-fish.png',
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
        image: 'https://img.icons8.com/external-icongeek26-flat-icongeek26/64/external-chicken-meat-icongeek26-flat-icongeek26-1.png',
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
        image: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-goat-animal-flaticons-lineal-color-flat-icons-3.png',
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
        image: 'https://img.icons8.com/stickers/100/dragon-fruit.png',
        stock: 20,
    },
  ];

  return categoryId 
    ? allProducts.filter(product => product.categoryId === categoryId)
    : allProducts;
};

const CategoryPage = () => {
    const { colorScheme } = useColorScheme();
    const [activeCat, setActiveCat] = useState<number | null>(null);
    const [cart, setCart] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    // Simulate API fetch
    // const categories = fetchCategories();
    const categories = useMemo(() => [
        { id: null, name: 'All', icon: 'https://img.icons8.com/external-bearicons-blue-bearicons/64/external-All-miscellany-texts-and-badges-bearicons-blue-bearicons.png' },
        ...fetchCategories(),
    ], []);
    const products = useMemo(() => fetchProducts(activeCat), [activeCat]);


    const addToCart = useCallback((productId: number) => {
        setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setCart(prev => {
        if (!prev[productId]) return prev;
        const next = { ...prev };
        next[productId] === 1 ? delete next[productId] : (next[productId] -= 1);
        return next;
        });
    }, []);

    const handleCategoryChange = (categoryId: number | null) => {
        setLoading(true);
        setActiveCat(categoryId);
        // Simulate network delay
        setTimeout(() => setLoading(false), 500);
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <View className="flex-row flex-1">
                {/********* Left sidebar *********/}
                <ScrollView
                className="w-[20%] border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
                showsVerticalScrollIndicator={false}
                >
                    {categories.map(cat => (
                        <TouchableOpacity
                        key={String(cat.id)}                 // id may be null => stringify
                        className={`items-center py-5 px-2 ${
                            activeCat === cat.id ? 'bg-gray-200 dark:bg-gray-800' : ''
                        }`}
                        onPress={() => handleCategoryChange(cat.id)}
                        >
                        <Image source={{ uri: cat.icon }} className="w-8 h-8" />
                        <Text
                            className={`mt-1 text-[10px] text-center ${
                            activeCat === cat.id
                                ? 'text-gray-900 dark:text-gray-100 font-black scale-105'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            {cat.name}
                        </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/********* Right sidebar *********/}
                <View className="w-[80%]">
                {loading ? (
                    <ScrollView className="p-4">
                        <View className="flex-row flex-wrap justify-between gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <View
                            key={index}
                            className="bg-white dark:bg-gray-800 w-[47%] rounded-lg overflow-hidden mb-4 border border-gray-100 dark:border-gray-700 animate-pulse"
                            >
                            {/* Image Placeholder */}
                            <View className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-lg" />

                            {/* Content Placeholder */}
                            <View className="p-3 space-y-2">
                                <View className="h-3 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
                                <View className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
                                <View className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded-full mt-2" />
                            </View>
                            </View>
                        ))}
                        </View>
                    </ScrollView>
                ) : (
                    <ScrollView className="p-4">
                        <View className="flex-row flex-wrap justify-between gap-4">
                            {products.map(product => (
                            <TouchableOpacity
                                key={product.id}
                                className="bg-white dark:bg-gray-800 w-[47%] rounded-lg overflow-hidden mb-4 border border-gray-100 dark:border-gray-700"
                                onPress={() => router.push(`/product/${product.id}`)}
                                activeOpacity={0.9}
                            >
                                {/* Image Container with Fixed Aspect Ratio */}
                                <View className="aspect-square bg-gray-50 dark:bg-gray-900">
                                    <Image
                                    source={{ uri: product.image }}
                                    className="w-full h-full"
                                    resizeMode="contain"
                                    />
                                </View>

                                {/* Product Info */}
                                <View className="p-3">
                                    {/* Tags */}
                                    <View className="flex-row flex-wrap mb-1 gap-1">
                                    <View className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                                        <Text className="text-xs text-green-800 dark:text-green-200">Fresh</Text>
                                    </View>
                                    <View className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                                        <Text className="text-xs text-blue-800 dark:text-blue-200">Premium</Text>
                                    </View>
                                    </View>

                                    {/* Product Name */}
                                    <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-1" numberOfLines={2}>
                                    {product.name}
                                    </Text>

                                    {/* Pricing */}
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <Text className="text-base font-bold text-gray-900 dark:text-white">
                                            {formatIndianMoney(product.price)}
                                        </Text>
                                        <Text className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                            {formatIndianMoney(product.mrp)}
                                        </Text>
                                        <Text className="text-xs text-green-600 dark:text-green-400">
                                            {product.discount}% off
                                        </Text>
                                    </View>

                                    {/* Add Button */}
                                    {cart[product.id] ? (
                                    <View className="flex-row items-center justify-between bg-primary-100 dark:bg-primary-900 rounded-full px-4 py-2">
                                        <TouchableOpacity 
                                        onPress={() => removeFromCart(product.id)}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                        <Text className="text-lg font-bold text-primary-600 dark:text-primary-300">-</Text>
                                        </TouchableOpacity>
                                        <Text className="text-primary-600 dark:text-primary-300 font-medium">
                                        {cart[product.id]}
                                        </Text>
                                        <TouchableOpacity
                                        onPress={() => addToCart(product.id)}
                                        disabled={cart[product.id] >= product.stock}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                        <Text className={`text-lg font-bold ${
                                            cart[product.id] >= product.stock 
                                            ? 'text-gray-400' 
                                            : 'text-primary-600 dark:text-primary-300'
                                        }`}>
                                            +
                                        </Text>
                                        </TouchableOpacity>
                                    </View>
                                    ) : (
                                    <TouchableOpacity
                                        className="bg-primary-600 dark:bg-primary-700 rounded-full py-2 px-4 items-center"
                                        onPress={() => addToCart(product.id)}
                                        activeOpacity={0.8}
                                    >
                                        <Text className="text-white font-medium">Add to Cart</Text>
                                    </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CategoryPage;