import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect } from 'react';
import { useAuthStore } from '@state/authStore';
import { screenWidth } from '@utils/Scaling';
import LottieView from 'lottie-react-native';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import { goBack, replace } from '@utils/NavigationUtils';
import { useRoute } from '@react-navigation/native';
import { useCartStore } from '@state/cartStore';
import { useCouponStore } from '@state/couponStore';

const OrderSuccess: FC = () => {
  const { user, setCurrentOrder } = useAuthStore();
  const { clearCart } = useCartStore();
  const {clearCoupon} = useCouponStore();

  const route = useRoute();
  const orderDetails = route?.params as Record<string, any>;

  useEffect(() => {

    clearCart();
    clearCoupon();
    setCurrentOrder(orderDetails);

    const timeoutId = setTimeout(() => {
      replace('LiveTracking')
    }, 4000)
    return () => clearTimeout(timeoutId);
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle='dark-content' />
      <LottieView
        source={require('@assets/animations/confirm.json')}
        autoPlay
        duration={2000}
        loop={false}
        speed={1}
        style={styles.lottieView}
        enableMergePathsAndroidForKitKatAndAbove
        hardwareAccelerationAndroid
      />
      <CustomText
        variant="h8"
        fontFamily={Fonts.SemiBold}
        style={styles.orderPlacedText}>
        ORDER PLACED
      </CustomText>
      <View style={styles.deliveryContainer}>
        <CustomText
          variant="h4"
          fontFamily={Fonts.SemiBold}
          style={styles.deliveryText}>
          Delivering to Home
        </CustomText>
      </View>
      <CustomText variant="h8" style={styles.addressText}>
        {user?.address || 'Addresss Not Available'}
      </CustomText>
    </View>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  lottieView: {
    width: screenWidth * 0.6,
    height: 150,
  },
  orderPlacedText: {
    opacity: 0.6,
  },
  deliveryContainer: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.secondary,
    paddingBottom: 4,
    marginBottom: 5,
  },
  deliveryText: {
    marginTop: 15,
    borderColor: Colors.secondary,
  },
  addressText: {
    opacity: 0.8,
    width: '80%',
    textAlign: 'center',
    marginTop: 10,
  },
});
