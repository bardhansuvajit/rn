import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useLayoutEffect, useRef } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Dimensions, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatIndianMoney } from '@utils/indianMoneyFormat';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductDetailPage = () => {
    const { id } = useLocalSearchParams();
    const { colorScheme } = useColorScheme();
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const navigation = useNavigation();
    const [wishlisted, setWishlisted] = useState(false);

    // Mock product data - replace with API call using id
    const product = {
        id,
        title: "Fresh Norwegian Salmon Fillet",
        images: [
            "https://images.pexels.com/photos/842142/pexels-photo-842142.jpeg",
            "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg",
            "https://images.pexels.com/photos/29748127/pexels-photo-29748127.jpeg",
        ],
        rating: 4.7,
        reviewCount: 128,
        price: 899,
        mrp: 1099,
        discount: 18,
        variants: [
        { id: 1, name: "500g", price: 899 },
        { id: 2, name: "1kg", price: 1699 },
        { id: 3, name: "2kg", price: 3199 }
        ],
        tags: ["Fresh", "Organic", "Preservative Free"],
        shortDescription: "Premium quality Norwegian salmon fillet, rich in omega-3 fatty acids",
        longDescription: "Our Norwegian salmon fillet is sourced from the cold, clear waters of Norway. Each fillet is hand-cut to perfection, ensuring consistent thickness for even cooking. The salmon is flash-frozen immediately after catching to preserve freshness and nutrients. Rich in omega-3 fatty acids and protein, this versatile fish is perfect for grilling, baking, or pan-searing.",
        inStock: true,
        deliveryInfo: "Same day delivery available for orders before 12pm"
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);


    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
    const [imageIndex, setImageIndex] = useState(0);

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Image Carousel */}
            <View className="h-[400px] bg-white dark:bg-gray-800">
                <FlatList
                    horizontal
                    pagingEnabled
                    data={product.images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        resizeMode="cover"
                        style={{
                            width: SCREEN_WIDTH,
                            height: '100%',
                        }}
                    />
                    )}
                    showsHorizontalScrollIndicator={false}
                    onScroll={e => {
                    const offsetX = e.nativeEvent.contentOffset.x;
                    const index = Math.round(offsetX / SCREEN_WIDTH);
                    setImageIndex(index);
                    }}
                    scrollEventThrottle={16}
                />

                {/* Back Icon */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="absolute top-12 left-4 bg-black/30 rounded-full p-2"
                >
                    <Feather name="arrow-left" size={20} color="white" />
                </TouchableOpacity>

                {/* Share Icon */}
                <TouchableOpacity
                    onPress={() => {
                        Share.share({
                        message: `Check out this product:\n${product.title}\n\nView here: https://yourstore.com/product/${product.id}`,
                        });
                    }}
                    className="absolute top-12 right-4 bg-black/30 rounded-full p-2"
                >
                    <Feather name="share-2" size={20} color="white" />
                </TouchableOpacity>

                {/* Wishlist Icon */}
                <TouchableOpacity
                    onPress={() => {
                    setWishlisted(!wishlisted);
                    }}
                    className="absolute top-24 right-4 bg-black/30 rounded-full p-2"
                >
                    <Ionicons
                        name={wishlisted ? 'heart' : 'heart-outline'}
                        size={24}
                        color={wishlisted ? '#ef4444' : 'white'}
                        style={{ opacity: wishlisted ? 1 : 0.9 }}
                    />
                </TouchableOpacity>

                {/* Dots Indicator */}
                <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
                    {product.images.map((_, index) => (
                    <View
                        key={index}
                        style={{ marginHorizontal: 2 }}
                        className={`w-2 h-2 rounded-full ${
                        imageIndex === index
                            ? 'bg-primary-600 dark:bg-primary-400'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    />
                    ))}
                </View>
            </View>

            {/* Product details */}
            <ScrollView 
                className="flex-1 px-4 pt-4"
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                {/* Product Title and Rating */}
                <View className="mb-4">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                        {product.title}
                    </Text>
                    <View className="flex-row items-center mt-2">
                        <View className="flex-row items-center bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full mr-2">
                            <Ionicons name="star" size={14} color="#16a34a" />
                            <Text className="text-green-800 dark:text-green-200 ml-1 text-sm">
                                {product.rating} ({product.reviewCount})
                            </Text>
                        </View>
                        {product.tags.map((tag, index) => (
                            <View key={index} className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full mr-2">
                                <Text className="text-blue-800 dark:text-blue-200 text-xs">{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Price Section */}
                <View className="mb-6">
                    <View className="flex-row items-center">
                        <Text className="text-2xl font-bold text-gray-900 dark:text-white mr-2">
                            {formatIndianMoney(product.variants[selectedVariant].price)}
                        </Text>
                        <Text className="text-lg text-gray-500 dark:text-gray-400 line-through">
                            {formatIndianMoney(product.mrp)}
                        </Text>
                        <Text className="text-green-600 dark:text-green-400 ml-2 font-medium">
                            {product.discount}% OFF
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Inclusive of all taxes
                    </Text>
                </View>

                {/* Variant Selection */}
                <View className="mb-6">
                    <Text className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Select Size
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                        {product.variants.map((variant, index) => (
                        <TouchableOpacity
                            key={variant.id}
                            className={`px-4 py-2 rounded-full border ${
                            selectedVariant === index
                                ? 'border-primary-600 bg-primary-100 dark:bg-primary-900'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                            onPress={() => setSelectedVariant(index)}
                        >
                            <Text
                            className={`${
                                selectedVariant === index
                                ? 'text-primary-600 dark:text-primary-300 font-medium'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                            >
                            {variant.name}
                            </Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Quantity Selector */}
                <View className="mb-6">
                    <Text className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Quantity
                    </Text>
                    <View className="flex-row items-center border border-gray-300 dark:border-gray-600 rounded-full w-32 justify-between px-4 py-2">
                        <TouchableOpacity onPress={decrementQuantity}>
                        <Feather name="minus" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                        </TouchableOpacity>
                        <Text className="text-lg font-medium text-gray-900 dark:text-white">
                        {quantity}
                        </Text>
                        <TouchableOpacity onPress={incrementQuantity}>
                        <Feather name="plus" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Description */}
                <View className="mb-6">
                {/* <Text className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Description
                </Text> */}
                <Text className="text-gray-700 dark:text-gray-300 mb-2">
                    {product.shortDescription}
                </Text>
                {showFullDescription && (
                    <Text className="text-gray-700 dark:text-gray-300">
                    {product.longDescription}
                    </Text>
                )}
                <TouchableOpacity
                    onPress={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2"
                >
                    <Text className="text-primary-600 dark:text-primary-400 font-medium">
                    {showFullDescription ? 'Show Less' : 'Read More'}
                    </Text>
                </TouchableOpacity>
                </View>

                {/* Delivery Info */}
                <View className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <View className="flex-row items-start">
                    <Feather name="truck" size={18} color="#3b82f6" className="mt-1 mr-2" />
                    <View>
                    <Text className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                        Delivery Information
                    </Text>
                    <Text className="text-blue-700 dark:text-blue-300 text-sm">
                        {product.deliveryInfo}
                    </Text>
                    </View>
                </View>
                </View>
            </ScrollView>

            {/* Fixed Bottom Buttons */}
            <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between px-3 pt-0 pb-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-20">
                {/* Left Side - Product Info */}
                <View className="flex-1">
                    {/* Variant Name (Top) */}
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {product.variants[selectedVariant].name}
                    </Text>
                    
                    {/* Pricing (Bottom) */}
                    <View className="flex-row items-end space-x-2">
                        <Text className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatIndianMoney(product.variants[selectedVariant].price)}
                        </Text>
                        <View className="flex-row items-baseline ml-2">
                            <Text className="text-sm text-gray-500 dark:text-gray-400 line-through mr-1">
                            {formatIndianMoney(product.mrp)}
                            </Text>
                            <Text className="text-sm font-medium text-green-600 dark:text-green-400">
                            {product.discount}% OFF
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Right Side - Add to Cart Button */}
                <TouchableOpacity 
                    className="w-40 bg-primary-600 dark:bg-primary-700 py-3 rounded-lg items-center"
                    style={{ marginLeft: 'auto' }}
                >
                    <Text className="text-white font-bold">Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProductDetailPage;