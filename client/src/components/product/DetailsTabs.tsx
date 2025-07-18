import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useState } from 'react'
import { Colors, Fonts } from '@utils/Constants'
import CustomText from '@components/ui/CustomText';
import { renderStars } from '@utils/helper/product';

import Icon from 'react-native-vector-icons/MaterialIcons';


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


const DetailsTabs: FC<{ product: Product }> = ({ product }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'reviews'>('details');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.infoSection}>
                            <CustomText fontFamily={Fonts.SemiBold} variant="h6" style={styles.sectionTitle}>
                                Product Information
                            </CustomText>
                            {product?.brand && (
                                <View style={styles.infoRow}>
                                    <CustomText style={styles.infoLabel}>Brand:</CustomText>
                                    <CustomText style={styles.infoValue}>{product.brand}</CustomText>
                                </View>
                            )}
                            <View style={styles.infoRow}>
                                <CustomText style={styles.infoLabel}>Category:</CustomText>
                                <CustomText style={styles.infoValue}>{product?.category?.name}</CustomText>
                            </View>
                            {product?.shelfLife && (
                                <View style={styles.infoRow}>
                                    <CustomText style={styles.infoLabel}>Shelf Life:</CustomText>
                                    <CustomText style={styles.infoValue}>{product.shelfLife}</CustomText>
                                </View>
                            )}
                            {product?.storage && (
                                <View style={styles.infoRow}>
                                    <CustomText style={styles.infoLabel}>Storage:</CustomText>
                                    <CustomText style={styles.infoValue}>{product.storage}</CustomText>
                                </View>
                            )}
                        </View>

                        {product?.benefits && product.benefits.length > 0 && (
                            <View style={styles.infoSection}>
                                <CustomText fontFamily={Fonts.SemiBold} variant="h6" style={styles.sectionTitle}>
                                    Benefits
                                </CustomText>
                                {product.benefits.map((benefit, index) => (
                                    <View key={index} style={styles.benefitItem}>
                                        <Icon name="check-circle" size={16} color={Colors.secondary} />
                                        <CustomText style={styles.benefitText}>{benefit}</CustomText>
                                    </View>
                                ))}
                            </View>
                        )}

                        {product?.ingredients && product.ingredients.length > 0 && (
                            <View style={styles.infoSection}>
                                <CustomText fontFamily={Fonts.SemiBold} variant="h6" style={styles.sectionTitle}>
                                    Ingredients
                                </CustomText>
                                <CustomText style={styles.ingredientsText}>
                                    {product.ingredients.join(', ')}
                                </CustomText>
                            </View>
                        )}
                    </View>
                );

            case 'nutrition':
                return (
                    <View style={styles.tabContent}>
                        {product?.nutritionalInfo ? (
                            <View style={styles.nutritionGrid}>
                                {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                                    <View key={key} style={styles.nutritionItem}>
                                        <CustomText fontFamily={Fonts.Medium} style={styles.nutritionLabel}>
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </CustomText>
                                        <CustomText fontFamily={Fonts.SemiBold} style={styles.nutritionValue}>
                                            {value}
                                        </CustomText>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <CustomText style={styles.noDataText}>
                                Nutritional information not available
                            </CustomText>
                        )}
                    </View>
                );

            case 'reviews':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.reviewsHeader}>
                            <View style={styles.ratingContainer}>
                                <CustomText fontFamily={Fonts.Bold} variant="h2" style={styles.ratingNumber}>
                                    {product?.rating || 0}
                                </CustomText>
                                <View>
                                    <View style={styles.starsContainer}>
                                        {renderStars(product?.rating || 0)}
                                    </View>
                                    <CustomText style={styles.reviewsCount}>
                                        ({product?.reviews?.length || 0} reviews)
                                    </CustomText>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.9} style={styles.writeReviewBtn}>
                            <CustomText style={styles.writeReviewText}>Write a Review</CustomText>
                        </TouchableOpacity>

                    </View>
                );

            default:
                return null;
        }
    };


    return (
        <View style={styles.tabsContainer} >
            <View style={styles.tabsHeader}>
                {(['details', 'nutrition', 'reviews'] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                        activeOpacity={0.8}
                    >
                        <CustomText
                            style={[styles.tabText, activeTab === tab && styles.activeTabText as any]}
                            fontFamily={activeTab === tab ? Fonts.SemiBold : Fonts.Medium}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </CustomText>
                    </TouchableOpacity>
                ))}
            </View>
            {renderTabContent()}
        </View >
    )
}

export default DetailsTabs

const styles = StyleSheet.create({
    tabsContainer: {
        marginBottom: 20,
    },
    tabsHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f4ff8b',
        borderRadius: 80,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 80,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        color: '#7c7c7cff',
        fontSize: 14,
    },
    activeTabText: {
        color: Colors.secondary,
    },
    tabContent: {
        minHeight: 200,
    },
    infoSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: Colors.text,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    infoLabel: {
        color: '#8f8f8fff',
        fontSize: 14,
    },
    infoValue: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    benefitText: {
        marginLeft: 8,
        color: Colors.text,
        fontSize: 14,
    },
    ingredientsText: {
        color: '#a3a3a3ff',
        lineHeight: 22,
    },
    nutritionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    nutritionItem: {
        width: '48%',
        backgroundColor: Colors.backgroundSecondary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    nutritionLabel: {
        color: '#989898ff',
        fontSize: 12,
        marginBottom: 4,
    },
    nutritionValue: {
        color: Colors.text,
        fontSize: 16,
    },
    noDataText: {
        textAlign: 'center',
        color: '#abababff',
        marginTop: 40,
    },
    reviewsHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingNumber: {
        color: Colors.secondary,
        marginRight: 16,
    },
    reviewsCount: {
        color: '#7b7b7bff',
        fontSize: 14,
        marginTop: 4,
    },
    writeReviewBtn: {
        backgroundColor: Colors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',

    },
    writeReviewText: {
        color: '#fff',
        fontFamily: Fonts.SemiBold
    }, starsContainer: {
        flexDirection: 'row',
        marginRight: 8,
    },
})