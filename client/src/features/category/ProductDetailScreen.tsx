import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Share } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import CustomHeader from '@components/ui/CustomHeader';
import { useRoute } from '@react-navigation/native';
import { getProductById } from '@service/productService';
import { screenHeight, screenWidth } from '@utils/Scaling';
import CustomText from '@components/ui/CustomText';
import { useAuthStore } from '@state/authStore';
import AddBuyBtn from '@components/product/AddBuyBtn';
import Carousel, { Pagination, ICarouselInstance } from 'react-native-reanimated-carousel';
import ScalePress from '@components/ui/ScalePress';
import { useSharedValue } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DetailsTabs from '@components/product/DetailsTabs';
import { renderStars } from '@utils/helper/product';

interface Product {
    id: string;
    name: string;
    price: number;
    discountPrice: number;
    quantity: string;
    description: string;
    images: string[];
    category: { name: string };
    brand?: string;
    rating?: number;
    reviews?: {
        user: string,
        rating: number,
        review: string
    }[];
    inStock: boolean;
    nutritionalInfo?: {
        calories?: string;
        protein?: string;
        carbs?: string;
        fat?: string;
        fiber?: string;
    };
    ingredients?: string[];
    shelfLife?: string;
    storage?: string;
    benefits?: string[];
}

const ProductDetailScreen: FC = () => {
    const { params }: any = useRoute();
    const id = params?.productId;
    const { user } = useAuthStore();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'reviews'>('details');



    const ref = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    const baseOptions = {
        vertical: false,
        width: screenWidth,
        height: screenHeight * 0.4,
        onProgressChange: (_: any, absoluteProgress: number) => {
            progress.value = absoluteProgress;
        },
    };

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await getProductById(id);
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            Alert.alert('Error', 'Failed to load product details');
        } finally {
            setLoading(false);
        }
    };


    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this product: ${product?.name} - ₹${product?.price}`,
                title: product?.name,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };


    const calculateDiscount = () => {
        if (product?.discountPrice && product?.price) {
            return Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100);
        }
        return 0;
    };

   
    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.secondary} />
                <CustomText style={styles.loadingText}>Loading product details...</CustomText>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="error-outline" size={64} color={'red'} />
                <CustomText style={styles.errorText}>Product not found</CustomText>
                <TouchableOpacity style={styles.retryBtn} onPress={fetchProduct}>
                    <CustomText style={styles.retryText}>Retry</CustomText>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomHeader
                title="Product Details"
                rightComponent={
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={handleShare} style={styles.headerBtn}>
                            <Icon name="share" size={22} color={Colors.text} />
                        </TouchableOpacity>

                    </View>
                }
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.carouselContainer}>
                    <Carousel
                        {...baseOptions}
                        ref={ref}
                        loop={product.images.length >= 2}
                        pagingEnabled
                        snapEnabled
                        mode="parallax"
                        data={product.images || []}
                        modeConfig={{ parallaxScrollingOffset: 0, parallaxScrollingScale: 1 }}
                        renderItem={({ item }: { item: string }) => (
                            <ScalePress style={styles.imageContainer}>
                                <Image source={{ uri: item }} style={styles.image} />
                            </ScalePress>
                        )}
                    />

                    {product.images && product.images.length > 1 && (
                        <Pagination.Basic
                            data={product.images}
                            progress={progress}
                            dotStyle={styles.paginationDot}
                            activeDotStyle={styles.activePaginationDot}
                            containerStyle={styles.paginationContainer}
                            onPress={onPressPagination}
                            horizontal
                        />
                    )}



                    <View style={[styles.stockBadge, { backgroundColor: product.inStock ? 'green' : 'red' }]}>
                        <CustomText fontFamily={Fonts.SemiBold} style={styles.stockText}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </CustomText>
                    </View>
                </View>


                <View style={styles.productInfo}>
                    <CustomText style={styles.productName} fontFamily={Fonts.SemiBold} variant="h4">
                        {product.name}
                    </CustomText>

                    {/* rating  */}
                    {product.rating && (
                        <View style={styles.ratingRow}>
                            <View style={styles.starsContainer}>
                                {renderStars(product.rating)}
                            </View>
                            <CustomText style={styles.ratingText}>
                                {product.rating} ({product?.reviews?.length || 0} reviews)
                            </CustomText>
                        </View>
                    )}

                    {/* Price */}
                    <View style={styles.priceContainer}>
                        <View style={styles.priceRow}>
                            {product.discountPrice && (
                                <CustomText style={styles.originalPrice} fontFamily={Fonts.Medium} variant="h5">
                                    ₹{product.discountPrice}
                                </CustomText>
                            )}
                            <CustomText fontFamily={Fonts.Bold} variant="h3" style={styles.currentPrice}>
                                ₹{product.price}
                            </CustomText>
                            {calculateDiscount() > 0 && (
                                <View style={styles.discountBadge}>
                                    <CustomText style={styles.discountText}>
                                        {calculateDiscount()}% OFF
                                    </CustomText>
                                </View>
                            )}
                        </View>
                        <View style={styles.quantityLabel}>
                            <CustomText variant="h7" style={styles.quantityText}>
                                {product.quantity}
                            </CustomText>
                        </View>
                    </View>

                    {/* Delivery Info */}
                    <View style={styles.deliveryContainer}>
                        <Icon name="location-on" size={20} color={Colors.secondary} />
                        <View style={styles.deliveryInfo}>
                            <CustomText style={styles.deliveryTitle}>Deliver To</CustomText>
                            <CustomText numberOfLines={2} fontFamily={Fonts.SemiBold} variant="h7">
                                {user?.address || 'Please add delivery address'}
                            </CustomText>
                        </View>
                        <TouchableOpacity activeOpacity={0.9} style={styles.changeAddressBtn}>
                            <CustomText style={styles.changeAddressText} fontFamily={Fonts.SemiBold}>
                                Change
                            </CustomText>
                        </TouchableOpacity>
                    </View>

                    {/* Description */}
                    {
                        product.description && (
                            <View style={styles.descriptionContainer}>
                                <CustomText style={styles.descriptionTitle} fontFamily={Fonts.SemiBold} variant="h6">
                                    Description
                                </CustomText>
                                <CustomText
                                    fontFamily={Fonts.Regular}
                                    variant="h7"
                                    style={styles.descriptionText}
                                    numberOfLines={showFullDescription ? undefined : 3}
                                >
                                    {product.description}
                                </CustomText>
                                {product.description && product.description.length > 100 && (
                                    <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                                        <CustomText style={styles.readMoreText}>
                                            {showFullDescription ? 'Read Less' : 'Read More'}
                                        </CustomText>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )
                    }
                    {/* tabs  */}
                    <DetailsTabs product={product} />
                </View>
            </ScrollView>

            <View style={styles.bottomActions}>
                {
                    product.inStock ? (
                        <AddBuyBtn item={product} />
                    ) : (
                        <CustomText variant='h6' fontFamily={Fonts.SemiBold} style={styles.stockEmptyText}>THIS PRODUCT IS OUT OF STOCK</CustomText>
                    )
                }
            </View>
        </View>
    );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 16,
        color: '#cacaca',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    errorText: {
        marginVertical: 16,
        textAlign: 'center',
        color: 'red',
    },
    retryBtn: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerBtn: {
        padding: 8,
        marginLeft: 8,
    },
    carouselContainer: {
        position: 'relative',
    },
    imageContainer: {
        height: screenHeight * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundSecondary,
        padding: 10
    },
    image: {
        width: '100%',
        height: '95%',
        resizeMode: 'contain',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 8,
        alignSelf: 'center',
        backgroundColor: 'rgba(216, 215, 215, 0.51)',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 5,
        gap: 6
    },
    paginationDot: {
        backgroundColor: '#abababe2',
        borderRadius: 4,
        width: 11,
        height: 6,
    },
    activePaginationDot: {
        backgroundColor: Colors.secondary,
        borderRadius: 4,
    },
    discountBadge: {
        backgroundColor: '#0c9859ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderRadius: 10,
        marginLeft: 5
    },
    discountText: {
        color: '#fff',
        fontSize: 12,
    },
    stockBadge: {
        position: 'absolute',
        top: 16,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderRadius: 10
    },
    stockText: {
        color: '#fff',
        fontSize: 12,
    },
    stockEmptyText: {
        color: '#a51f1fff',
        padding: 20,
        textAlign: 'center',

    },
    productInfo: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    productName: {
        marginBottom: 12,
        color: Colors.text,
        lineHeight: 28,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 8,
    },
    ratingText: {
        color: '#cacaca',
        fontSize: 14,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    originalPrice: {
        color: '#a9a9a9ff',
        textDecorationLine: 'line-through',
        marginRight: 12,
    },
    currentPrice: {
        color: '#000111',
    },
    quantityLabel: {
        backgroundColor: Colors.backgroundSecondary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    quantityText: {
        color: Colors.text,
        fontWeight: '500',
    },
    deliveryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f4ff8b',
        padding: 10,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e3eeff',
        gap: 10
    },
    deliveryInfo: {
        flex: 1,
    },
    deliveryTitle: {
        color: '#a5a5a5ff',
        fontSize: 14,
        marginBottom: 4,
    },
    changeAddressBtn: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    changeAddressText: {
        color: '#fff',
        fontSize: 14,
    },
    descriptionContainer: {
        marginBottom: 24,
    },
    descriptionTitle: {
        marginBottom: 12,
        color: Colors.text,
    },
    descriptionText: {
        color: '#999999ff',
        lineHeight: 22,
    },
    readMoreText: {
        color: Colors.secondary,
        marginTop: 8,
        fontWeight: '500',
    },
 
    bottomActions: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: Colors.border,

    },
});