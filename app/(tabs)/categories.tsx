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
        icon: 'https://dummyimage.com/96x96/000/fff.png&text=Fish',
    },
    {
        id: 2,
        name: 'Chicken',
        icon: 'https://dummyimage.com/96x96/000/fff.png&text=Chicken',
    },
    {
        id: 3,
        name: 'Mutton',
        icon: 'https://dummyimage.com/96x96/000/fff.png&text=Mutton',
    },
    {
        id: 4,
        name: 'Fruits',
        icon: 'https://dummyimage.com/96x96/000/fff.png&text=Fruits',
    },
];


const fetchProducts = (categoryId: number | null) => {
    const allProducts = [
        // Original products
        {
            id: 1,
            categoryId: 1,
            name: 'Fresh Fish',
            price: 299,
            mrp: 349,
            discount: 15,
            tags: ['500 g', 'Fresh'],
            image: 'https://dummyimage.com/96x96/00BCD4/ffffff&text=Fish',
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
            image: 'https://dummyimage.com/96x96/FF5722/ffffff&text=Chicken',
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
            image: 'https://dummyimage.com/96x96/795548/ffffff&text=Mutton',
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
            image: 'https://dummyimage.com/96x96/8BC34A/ffffff&text=Fruits',
            stock: 20,
        },

        // Additional Fish Products (5-9)
        {
            id: 5,
            categoryId: 1,
            name: 'Pomfret Fish',
            price: 499,
            mrp: 599,
            discount: 17,
            tags: ['300 g', 'Sea Fish'],
            image: 'https://dummyimage.com/96x96/00BCD4/ffffff&text=Pomfret',
            stock: 12,
        },
        {
            id: 6,
            categoryId: 1,
            name: 'Rohu Fish',
            price: 199,
            mrp: 249,
            discount: 20,
            tags: ['500 g', 'River Fish'],
            image: 'https://dummyimage.com/96x96/00BCD4/ffffff&text=Rohu',
            stock: 18,
        },
        {
            id: 7,
            categoryId: 1,
            name: 'Katla Fish',
            price: 179,
            mrp: 229,
            discount: 22,
            tags: ['500 g', 'Freshwater'],
            image: 'https://dummyimage.com/96x96/00BCD4/ffffff&text=Katla',
            stock: 15,
        },
        {
            id: 8,
            categoryId: 1,
            name: 'Hilsa Fish',
            price: 899,
            mrp: 1099,
            discount: 18,
            tags: ['400 g', 'Premium'],
            image: 'https://dummyimage.com/96x96/00BCD4/ffffff&text=Hilsa',
            stock: 6,
        },
        {
            id: 9,
            categoryId: 1,
            name: 'Tilapia Fillet',
            price: 349,
            mrp: 399,
            discount: 13,
            tags: ['250 g', 'Boneless'],
            image: 'https://dummyimage.com/96x96/00BCD4/ffffff&text=Tilapia',
            stock: 9,
        },

        // Additional Chicken Products (10-14)
        {
            id: 10,
            categoryId: 2,
            name: 'Chicken Legs',
            price: 199,
            mrp: 249,
            discount: 20,
            tags: ['500 g', 'Skinless'],
            image: 'https://dummyimage.com/96x96/FF5722/ffffff&text=Legs',
            stock: 20,
        },
        {
            id: 11,
            categoryId: 2,
            name: 'Chicken Wings',
            price: 179,
            mrp: 199,
            discount: 10,
            tags: ['500 g', 'Party Pack'],
            image: 'https://dummyimage.com/96x96/FF5722/ffffff&text=Wings',
            stock: 25,
        },
        {
            id: 12,
            categoryId: 2,
            name: 'Chicken Mince',
            price: 229,
            mrp: 279,
            discount: 18,
            tags: ['500 g', 'Ground'],
            image: 'https://dummyimage.com/96x96/FF5722/ffffff&text=Mince',
            stock: 12,
        },
        {
            id: 13,
            categoryId: 2,
            name: 'Chicken Liver',
            price: 149,
            mrp: 179,
            discount: 17,
            tags: ['250 g', 'Fresh'],
            image: 'https://dummyimage.com/96x96/FF5722/ffffff&text=Liver',
            stock: 8,
        },
        {
            id: 14,
            categoryId: 2,
            name: 'Whole Chicken',
            price: 399,
            mrp: 499,
            discount: 20,
            tags: ['1.2 kg', 'Farm Fresh'],
            image: 'https://dummyimage.com/96x96/FF5722/ffffff&text=Whole',
            stock: 7,
        },

        // Additional Mutton Products (15-19)
        {
            id: 15,
            categoryId: 3,
            name: 'Mutton Curry Cut',
            price: 699,
            mrp: 799,
            discount: 13,
            tags: ['500 g', 'Bone-in'],
            image: 'https://dummyimage.com/96x96/795548/ffffff&text=Curry',
            stock: 10,
        },
        {
            id: 16,
            categoryId: 3,
            name: 'Mutton Biryani Cut',
            price: 749,
            mrp: 849,
            discount: 12,
            tags: ['500 g', 'Special Cut'],
            image: 'https://dummyimage.com/96x96/795548/ffffff&text=Biryani',
            stock: 8,
        },
        {
            id: 17,
            categoryId: 3,
            name: 'Mutton Leg',
            price: 899,
            mrp: 999,
            discount: 10,
            tags: ['1 kg', 'Premium'],
            image: 'https://dummyimage.com/96x96/795548/ffffff&text=Leg',
            stock: 5,
        },
        {
            id: 18,
            categoryId: 3,
            name: 'Mutton Keema',
            price: 649,
            mrp: 749,
            discount: 13,
            tags: ['500 g', 'Minced'],
            image: 'https://dummyimage.com/96x96/795548/ffffff&text=Keema',
            stock: 9,
        },
        {
            id: 19,
            categoryId: 3,
            name: 'Mutton Chops',
            price: 799,
            mrp: 899,
            discount: 11,
            tags: ['500 g', 'Rib Cut'],
            image: 'https://dummyimage.com/96x96/795548/ffffff&text=Chops',
            stock: 7,
        },

        // Additional Fruits (20-24)
        {
            id: 20,
            categoryId: 4,
            name: 'Fresh Apples',
            price: 129,
            mrp: 149,
            discount: 13,
            tags: ['1 kg', 'Shimla'],
            image: 'https://dummyimage.com/96x96/8BC34A/ffffff&text=Apples',
            stock: 25,
        },
        {
            id: 21,
            categoryId: 4,
            name: 'Bananas',
            price: 49,
            mrp: 59,
            discount: 17,
            tags: ['6 pcs', 'Ripe'],
            image: 'https://dummyimage.com/96x96/8BC34A/ffffff&text=Bananas',
            stock: 30,
        },
        {
            id: 22,
            categoryId: 4,
            name: 'Oranges',
            price: 89,
            mrp: 99,
            discount: 10,
            tags: ['1 kg', 'Nagpur'],
            image: 'https://dummyimage.com/96x96/8BC34A/ffffff&text=Oranges',
            stock: 20,
        },
        {
            id: 23,
            categoryId: 4,
            name: 'Grapes',
            price: 149,
            mrp: 179,
            discount: 17,
            tags: ['500 g', 'Seedless'],
            image: 'https://dummyimage.com/96x96/8BC34A/ffffff&text=Grapes',
            stock: 15,
        },
        {
            id: 24,
            categoryId: 4,
            name: 'Pomegranate',
            price: 199,
            mrp: 249,
            discount: 20,
            tags: ['1 kg', 'Kashmiri'],
            image: 'https://dummyimage.com/96x96/8BC34A/ffffff&text=Pome...',
            stock: 12,
        },

        // Vegetables (25-29)
        {
            id: 25,
            categoryId: 5,
            name: 'Fresh Tomatoes',
            price: 29,
            mrp: 39,
            discount: 26,
            tags: ['1 kg', 'Local'],
            image: 'https://dummyimage.com/96x96/4CAF50/ffffff&text=Tomatoes',
            stock: 40,
        },
        {
            id: 26,
            categoryId: 5,
            name: 'Potatoes',
            price: 39,
            mrp: 49,
            discount: 20,
            tags: ['1 kg', 'Fresh'],
            image: 'https://dummyimage.com/96x96/4CAF50/ffffff&text=Potatoes',
            stock: 35,
        },
        {
            id: 27,
            categoryId: 5,
            name: 'Onions',
            price: 49,
            mrp: 59,
            discount: 17,
            tags: ['1 kg', 'Premium'],
            image: 'https://dummyimage.com/96x96/4CAF50/ffffff&text=Onions',
            stock: 30,
        },
        {
            id: 28,
            categoryId: 5,
            name: 'Carrots',
            price: 59,
            mrp: 69,
            discount: 14,
            tags: ['500 g', 'Organic'],
            image: 'https://dummyimage.com/96x96/4CAF50/ffffff&text=Carrots',
            stock: 20,
        },
        {
            id: 29,
            categoryId: 5,
            name: 'Broccoli',
            price: 99,
            mrp: 119,
            discount: 17,
            tags: ['1 pc', 'Fresh'],
            image: 'https://dummyimage.com/96x96/4CAF50/ffffff&text=Broccoli',
            stock: 12,
        },

        // Dairy (30-34)
        {
            id: 30,
            categoryId: 6,
            name: 'Fresh Milk',
            price: 60,
            mrp: 70,
            discount: 14,
            tags: ['1L', 'Full Cream'],
            image: 'https://dummyimage.com/96x96/FFFFFF/000000&text=Milk',
            stock: 50,
        },
        {
            id: 31,
            categoryId: 6,
            name: 'Paneer',
            price: 199,
            mrp: 229,
            discount: 13,
            tags: ['250 g', 'Homemade'],
            image: 'https://dummyimage.com/96x96/FFFFFF/000000&text=Paneer',
            stock: 20,
        },
        {
            id: 32,
            categoryId: 6,
            name: 'Curd',
            price: 45,
            mrp: 55,
            discount: 18,
            tags: ['500 g', 'Fresh'],
            image: 'https://dummyimage.com/96x96/FFFFFF/000000&text=Curd',
            stock: 30,
        },
        {
            id: 33,
            categoryId: 6,
            name: 'Butter',
            price: 89,
            mrp: 99,
            discount: 10,
            tags: ['100 g', 'Amul'],
            image: 'https://dummyimage.com/96x96/FFFFFF/000000&text=Butter',
            stock: 25,
        },
        {
            id: 34,
            categoryId: 6,
            name: 'Cheese',
            price: 149,
            mrp: 179,
            discount: 17,
            tags: ['200 g', 'Mozzarella'],
            image: 'https://dummyimage.com/96x96/FFFFFF/000000&text=Cheese',
            stock: 15,
        }
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
        { id: null, name: 'All', icon: 'https://dummyimage.com/96x96/d32f2f/fff.png&text=All' },
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
                        <Image source={{ uri: cat.icon }} className="w-8 h-8 rounded-full" />
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