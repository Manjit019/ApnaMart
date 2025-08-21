import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors, Fonts } from '@utils/Constants';
import OrderList from './OrderList';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BillDetails from './BillDetails';
import { useCartStore } from '@state/cartStore';
import { useAuthStore } from '@state/authStore';
import { hocStyle } from '@styles/GlobalStyles';
import ArrowButton from '@components/ui/ArrowButton';
import { createOrder } from '@service/orderService';
import { navigate, resetAndNavigate } from '@utils/NavigationUtils';
import CouponSheet from './CouponSheet';
import { EXTRACHARGES } from '@service/config';
import { useCouponStore } from '@state/couponStore';
import { applyCoupon } from '@service/couponService';
import { createTransaction } from '@service/transactionService';

const ProductOrder = () => {
  const { getTotalPrice, cart, clearCart } = useCartStore();
  const { user, setCurrentOrder, currentOrder } = useAuthStore();
  const {
    appliedCoupon: couponResult,
    clearCoupon,
    setCoupon,
  } = useCouponStore() as any;
  
  const [loading, setLoading] = useState(false);
  const [couponSheetVisible, setCouponSheetVisible] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'COD' | 'Online'>('Online');

  const totalItemPrice = getTotalPrice();

  const handlePlaceOrder = useCallback(async () => {
    // Validation checks
    if (currentOrder !== null) {
      Alert.alert('Order in Progress', 'Let your first order be delivered before placing a new one');
      return;
    }

    if (!cart || cart.length === 0) {
      Alert.alert('Empty Cart', 'Add items to your cart before placing an order');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to place an order');
      return;
    }

    if (!user.liveLocation?.latitude || !user.liveLocation?.longitude) {
      Alert.alert('Location Required', 'Please set your delivery location');
      return;
    }
    setCurrentOrder(null);

    const formattedData = cart.map(item => ({
      id: item._id,
      item: item.item,
      count: item.count,
    }));

    const baseTotal = totalItemPrice + EXTRACHARGES;
    const finalTotal = couponResult?.success 
      ? baseTotal - (couponResult.discount || 0)
      : baseTotal;

    setLoading(true);

    try {
      if (paymentMode === 'Online') {
        // Create transaction for online payment
        const transactionData = await createTransaction(finalTotal, user._id);
        
        if (!transactionData) {
          Alert.alert('Payment Error', 'Failed to initialize payment. Please try again.');
          return;
        }

        const orderResult = await createOrder(
          formattedData,
          baseTotal,
          couponResult?.couponId,
          user.liveLocation,
          couponResult?.discount || 0,
          transactionData.amount,
          paymentMode,
          transactionData.key,
          transactionData.order_id,
          transactionData.method,
          transactionData.notes,
        );

        if (orderResult?.type === 'error') {
          Alert.alert('Payment Failed', orderResult.message || 'Payment could not be processed');
        } else if (orderResult?.type === 'success') {
          // Clear cart on successful order
          clearCart();
          if (couponResult?.success) {
            clearCoupon();
          }
        }
        
      } else if (paymentMode === 'COD') {
        const orderResult = await createOrder(
          formattedData,
          baseTotal,
          couponResult?.couponId,
          user.liveLocation,
          couponResult?.discount || 0,
          finalTotal,
          paymentMode
        );

        if (orderResult?.type === 'success') {
          clearCart();
          if (couponResult?.success) {
            clearCoupon();
          }
        } else {
          Alert.alert('Order Failed', orderResult?.message || 'Failed to place order');
        }
      }
    } catch (error) {
      console.error('Order placement error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [
    currentOrder,
    cart,
    user,
    totalItemPrice,
    couponResult,
    paymentMode,
    setCurrentOrder,
    clearCart,
    clearCoupon
  ]);

  // Revalidate coupon when total price changes
  useEffect(() => {
    const revalidateCoupon = async () => {
      if (!couponResult?.coupon) return;  
      try {
        const data = await applyCoupon(
          couponResult.coupon,
          totalItemPrice + EXTRACHARGES,
        );
        setCoupon(data);
      } catch (error) {
        console.log('Failed to revalidate coupon:', error);
        clearCoupon();
      }
    };

    revalidateCoupon();
  }, [totalItemPrice, couponResult?.coupon, setCoupon, clearCoupon]);

  const handleCouponPress = useCallback(() => {
    setCouponSheetVisible(true);
  }, []);

  const handleCouponSheetClose = useCallback(() => {
    setCouponSheetVisible(false);
  }, []);

  const handlePaymentModeChange = useCallback((mode: 'COD' | 'Online') => {
    setPaymentMode(mode);
  }, []);

  const calculatedFinalTotal = couponResult?.success
    ? totalItemPrice + EXTRACHARGES - (couponResult.discount || 0)
    : totalItemPrice + EXTRACHARGES;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={false}
        backgroundColor="#fff"
        barStyle="dark-content"
      />

      <CustomHeader
        title="Checkout"
        rightComponent={
          <TouchableOpacity>
            <Ionicons name="wallet-outline" size={RFValue(18)} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OrderList />

        {/* Coupon Section */}
        {couponResult?.success ? (
          <View style={styles.couponResultContainer}>
            <View style={styles.flexRow}>
              <Image
                source={require('@assets/icons/coupon.png')}
                style={styles.couponIcon}
                tintColor={'#2ead54ff'}
              />
              <CustomText
                variant="h7"
                fontFamily={Fonts.SemiBold}
                style={styles.couponAppliedText}>
                Coupon Applied!
              </CustomText>
              <CustomText
                variant="h8"
                fontFamily={Fonts.SemiBold}
                style={styles.couponCode}>
                {couponResult.coupon}
              </CustomText>
            </View>

            <CustomText
              variant="h8"
              fontFamily={Fonts.Medium}
              style={styles.couponDiscountText}>
              Congrats! You have got discount of ₹{couponResult.discount}
            </CustomText>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={clearCoupon}>
              <Icon name="close-circle" color={'#707471f8'} size={18} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.flexRowBetween}
            onPress={handleCouponPress}>
            <View style={styles.flexRow}>
              <Image
                source={require('@assets/icons/coupon.png')}
                style={styles.couponIcon}
              />
              <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
                Use Coupons
              </CustomText>
            </View>
            <Icon name="chevron-right" size={RFValue(22)} color={Colors.text} />
          </TouchableOpacity>
        )}

        {/* Bill Details */}
        <BillDetails
          totalItemPrice={totalItemPrice}
          discount={couponResult?.discount || 0}
        />

        {/* Payment Mode Selection */}
        <View style={styles.paymentModeContainer}>
          <CustomText
            variant="h6"
            fontFamily={Fonts.SemiBold}
            style={styles.paymentModeTitle}>
            Choose Payment Method
          </CustomText>
          <View style={styles.paymentModeRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handlePaymentModeChange('COD')}
              style={[
                styles.paymentMode,
                paymentMode === 'COD' && styles.selectedPaymentMode,
              ]}>
              <Icon name="cash" size={RFValue(12)} />
              <CustomText fontFamily={Fonts.Medium}>
                Cash on Delivery
              </CustomText>
            </TouchableOpacity>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handlePaymentModeChange('Online')}
              style={[
                styles.paymentMode,
                paymentMode === 'Online' && styles.selectedPaymentMode,
              ]}>
              <Icon name="qrcode" size={RFValue(12)} />
              <CustomText fontFamily={Fonts.Medium}>Pay Online</CustomText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.flexRowBetween}>
          <View>
            <CustomText variant="h8" fontFamily={Fonts.SemiBold}>
              Cancellation Policy
            </CustomText>
            <CustomText
              variant="h9"
              style={styles.cancelText}
              fontFamily={Fonts.SemiBold}>
              Orders cannot be cancelled once packed for delivery. In case of
              unexpected delays, refund will be provided if applicable.
            </CustomText>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={hocStyle.cartContainer}>
        <View style={styles.absoluteContainer}>
          {/* Delivery Address */}
          <View style={styles.addressContainer}>
            <View style={styles.flexRow}>
              <Image
                source={require('@assets/icons/home.png')}
                style={styles.homeIcon}
              />
              <View style={styles.addressTextContainer}>
                <CustomText variant="h8" fontFamily={Fonts.Medium}>
                  Delivering to Home
                </CustomText>
                <CustomText
                  variant="h9"
                  numberOfLines={2}
                  style={styles.addressText}>
                  {user?.address || 'Address not set'}
                </CustomText>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8}>
              <CustomText
                variant="h8"
                style={styles.changeAddressText}
                fontFamily={Fonts.SemiBold}>
                Change
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Payment Gateway */}
          <View style={styles.paymentGateway}>
            <View style={styles.paymentInfoContainer}>
              <CustomText fontFamily={Fonts.Regular} fontSize={RFValue(6)}>
                PAY USING
              </CustomText>
              <CustomText
                fontFamily={Fonts.Regular}
                variant="h9"
                style={styles.paymentMethodText}>
                {paymentMode === 'COD' ? 'Cash on Delivery' : 'Online Secured'}
              </CustomText>
            </View>
            
            <View style={styles.buttonContainer}>
              <ArrowButton
                loading={loading}
                price={calculatedFinalTotal}
                title= {paymentMode === 'COD' ? 'Place Order' : 'Pay Now'}
                onPress={handlePlaceOrder}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Coupon Sheet Modal */}
      {couponSheetVisible && (
        <CouponSheet onClose={handleCouponSheetClose} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    paddingBottom: 250,
  },
  flexRowBetween: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    flexDirection: 'row',
    borderRadius: 16,
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 6,
  },
  couponIcon: {
    width: 25,
    height: 25,
  },
  couponAppliedText: {
    color: '#2ead54ff',
  },
  couponDiscountText: {
    color: '#2fab54d7',
  },
  cancelText: {
    marginTop: 4,
    opacity: 0.6,
  },
  paymentGateway: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 14,
    paddingTop: 12,
  },
  paymentInfoContainer: {
    width: '30%',
  },
  paymentMethodText: {
    marginTop: 2,
  },
  buttonContainer: {
    width: '70%',
  },
  addressContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.7,
    borderBottomColor: Colors.border,
  },
  homeIcon: {
    width: 20,
    height: 20,
  },
  addressTextContainer: {
    width: '75%',
  },
  addressText: {
    opacity: 0.6,
  },
  changeAddressText: {
    color: Colors.secondary,
  },
  absoluteContainer: {
    marginVertical: 15,
    marginBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  couponResultContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#49bf6da3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: 'relative',
  },
  couponCode: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#67ff8528',
    borderRadius: 6,
    color: '#168e3aff',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  paymentModeContainer: {
    marginBottom: 17,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
  },
  paymentModeTitle: {
    marginVertical: 8,
  },
  paymentModeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  paymentMode: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e4e4e46a',
    borderWidth: 0.3,
    borderColor: '#00000069',
    opacity: 0.7,
  },
  selectedPaymentMode: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: '#78d4fc23',
    opacity: 1,
  },
});

export default ProductOrder;