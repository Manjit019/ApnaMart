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
import React, { useEffect, useState } from 'react';
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
import { navigate } from '@utils/NavigationUtils';
import CouponSheet from './CouponSheet';
import { EXTRACHARGES } from '@service/config';
import { useCouponStore } from '@state/couponStore';
import { applyCoupon } from '@service/couponService';

const ProductOrder = () => {
  const { getTotalPrice, cart, clearCart } = useCartStore();
  const { user, setCurrentOrder, currentOrder } = useAuthStore();
  const { appliedCoupon: couponResult, clearCoupon, setCoupon } = useCouponStore() as any;
  const [loading, setLoading] = useState(false);
  const [couponSheetVisible, setCouponSheetVisible] = useState(false);


  const totalItemPrice = getTotalPrice();

  const handlePlaceOrder = async () => {
    if (currentOrder !== null) {
      Alert.alert('Let your first order to be delivered');
      return;
    }
    setCurrentOrder(null);

    const formattedData = cart.map(item => ({
      id: item._id,
      item: item.item,
      count: item.count,
    }));

    if (formattedData.length == 0) {
      Alert.alert('Add any items to place order');
      return;
    }
    const payableAmount = couponResult?.success ? couponResult?.finalTotal : totalItemPrice + EXTRACHARGES

    setLoading(true);
    const data = await createOrder(
      formattedData,
      payableAmount,
      couponResult?.couponId,
    );

    if (data != null) {
      setCurrentOrder(data);
      clearCart();
      clearCoupon();
      navigate('OrderSuccess', { ...data });
    }

    setLoading(false);
  };

  useEffect(() => {
    const revalidateCoupon = async () => {
      if (!couponResult?.coupon) return;
      try {
        const data = await applyCoupon(couponResult.coupon, totalItemPrice + EXTRACHARGES);
        setCoupon(data);
      } catch (error) {
        console.log('Failed to revalidate coupon:', error);
      }
    };
    revalidateCoupon();

  }, [totalItemPrice]);

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

        {couponResult?.success ? (
          <View style={styles.couponResultContainer}>
            <View style={styles.flexRow}>
              <Image
                source={require('@assets/icons/coupon.png')}
                style={{ width: 25, height: 25 }}
                tintColor={'#2ead54ff'}
              />
              <CustomText
                variant="h7"
                fontFamily={Fonts.SemiBold}
                style={{ color: '#2ead54ff' }}>
                Coupon Applied!
              </CustomText>
              <CustomText
                variant="h8"
                fontFamily={Fonts.SemiBold}
                style={styles.couponCode}>
                {couponResult?.coupon}{' '}
              </CustomText>
            </View>

            <CustomText
              variant="h8"
              fontFamily={Fonts.Medium}
              style={{ color: '#2fab54d7' }}>
              Congrats! You have got discount of ₹{couponResult?.discount}
            </CustomText>

            <TouchableOpacity style={styles.removeBtn} onPress={() => clearCoupon()} >
              <Icon name='close-circle' color={'#707471f8'} size={18} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.flexRowBetween}
            onPress={() => setCouponSheetVisible(true)}>
            <View style={styles.flexRow}>
              <Image
                source={require('@assets/icons/coupon.png')}
                style={{ width: 25, height: 25 }}
              />
              <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
                Use Coupons
              </CustomText>
            </View>
            <Icon name="chevron-right" size={RFValue(22)} color={Colors.text} />
          </TouchableOpacity>
        )}

        <BillDetails
          totalItemPrice={totalItemPrice}
          discount={couponResult?.discount}
        />

        <View style={styles.flexRowBetween}>
          <View>
            <CustomText variant="h8" fontFamily={Fonts.SemiBold}>
              Cancellation Policy
            </CustomText>
            <CustomText
              variant="h9"
              style={styles.cancelText}
              fontFamily={Fonts.SemiBold}>
              Order can not be cancelled once packed for delivery, In case of
              unexcepted delays, refund will be provided,if applicable
            </CustomText>
          </View>
        </View>
      </ScrollView>

      <View style={hocStyle.cartContainer}>
        <View style={styles.absoluteContainer}>
          <View style={styles.addressContainer}>
            <View style={styles.flexRow}>
              <Image
                source={require('@assets/icons/home.png')}
                style={{ width: 20, height: 20 }}
              />
              <View style={{ width: '75%' }}>
                <CustomText variant="h8" fontFamily={Fonts.Medium}>
                  Delivering to Home
                </CustomText>
                <CustomText
                  variant="h9"
                  numberOfLines={2}
                  style={{ opacity: 0.6 }}>
                  {user?.address}
                </CustomText>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8}>
              <CustomText
                variant="h8"
                style={{ color: Colors.secondary }}
                fontFamily={Fonts.SemiBold}>
                Change
              </CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentGateway}>
            <View style={{ width: '30%' }}>
              <CustomText fontFamily={Fonts.Regular} fontSize={RFValue(6)}>
                PAY USING
              </CustomText>
              <CustomText
                fontFamily={Fonts.Regular}
                variant="h9"
                style={{ marginTop: 2 }}>
                Cash on Delivery
              </CustomText>
            </View>
            <View style={{ width: '70%' }}>
              <ArrowButton
                loading={loading}
                price={couponResult?.success ? totalItemPrice + EXTRACHARGES - couponResult?.discount : totalItemPrice + EXTRACHARGES}
                title="Place Order"
                onPress={handlePlaceOrder}
              />
            </View>
          </View>
        </View>
      </View>

      {couponSheetVisible && (
        <CouponSheet
          onClose={() => setCouponSheetVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
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
  addressContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.7,
    borderBottomColor: Colors.border,
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

  }
});

export default ProductOrder;
