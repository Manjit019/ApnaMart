import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useCallback, useState } from 'react';
import { useAuthStore } from '@state/authStore';
import { getOrderById, makeOrderPayment } from '@service/orderService';
import { Colors, Fonts } from '@utils/Constants';
import LiveHeader from './LiveHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import OrderSummary from './OrderSummary';
import DeliveryDetails from './DeliveryDetails';
import LiveMap from './LiveMap';
import { screenHeight } from '@utils/Scaling';
import OrderProgress from './OrderProgress';
import { useFocusEffect } from '@react-navigation/native';
import { createTransaction } from '@service/transactionService';

interface OrderStatus {
  msg: string;
  time: string;
  step: number;
}

const LiveTracking = () => {
  const { user } = useAuthStore();
  const { currentOrder, setCurrentOrder } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    if (!currentOrder?._id) {
      return;
    }

    try {

      const data = await getOrderById(currentOrder._id);

      if (data?.success) {
        setCurrentOrder(data?.order);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  }, [currentOrder?._id, setCurrentOrder]);

  // Use useFocusEffect to refetch when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchOrderDetails();
    }, [fetchOrderDetails]),
  );

  // Auto-refresh order details every 30 seconds for live tracking
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        currentOrder?.status &&
        !['delivered', 'cancelled'].includes(currentOrder.status)
      ) {
        fetchOrderDetails();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentOrder?.status, fetchOrderDetails]);

  const getOrderStatus = useCallback((status: string): OrderStatus => {
    const statusMap: Record<string, OrderStatus> = {
      available: {
        msg: 'Order Placed!',
        time: 'Looking for delivery partner...',
        step: 0,
      },
      confirmed: {
        msg: 'Order Confirmed',
        time: 'Arriving in 10 minutes...',
        step: 1,
      },
      arriving: {
        msg: 'Order Picked Up',
        time: 'Arriving in 6 minutes...',
        step: 2,
      },
      delivered: {
        msg: 'Order Delivered',
        time: 'Fastest Delivery.',
        step: 3,
      },
      cancelled: {
        msg: 'Order Cancelled',
        time: 'Order has been cancelled.',
        step: 0,
      },
    };

    return statusMap[status] || statusMap['available'];
  }, []);

  const handlePayNow = useCallback(async () => {
    if (!currentOrder) return;
    setLoading(true);
    try {
      // Implement payment logic here
      Alert.alert(
        'Payment',
        `Pay ₹${currentOrder.finalTotal} for your order? Don't press back if your clicked pay now.`,
        [
          { text: 'Cancel', style: 'cancel' , onPress: () => setLoading(false) },
          {
            text: 'Pay Now',
            onPress: async () => {
              console.log('Navigate to payment');
              const transactionData = await createTransaction(
                currentOrder?.finalTotal,
                user?._id,
              );

              if (!transactionData) {
                Alert.alert(
                  'Payment Error',
                  'Failed to initialize payment. Please try again.',
                );
                setLoading(false);
                return;
              }

              const paymentResult = await makeOrderPayment(
                currentOrder?._id,
                transactionData.key,
                transactionData.order_id,
                transactionData.amount,
              );

              if (paymentResult?.type === 'error') {
                Alert.alert('Payment Failed', paymentResult.message || 'Payment could not be processed');
                setLoading(false);
              } else if (paymentResult?.type === 'success') {
                console.log("Payment Successful for this order ");
                setLoading(false);
              }

            },
          },
        ],
      );
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to process payment');
    }
  }, [currentOrder, loading]);

  if (!currentOrder) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar
          translucent={false}
          backgroundColor={Colors.secondary}
          barStyle="light-content"
        />
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          No order found
        </CustomText>
      </View>
    );
  }

  const orderStatus = getOrderStatus(currentOrder.status || 'available');

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.secondary}
        barStyle="light-content"
      />

      <LiveHeader
        type="Customer"
        title={orderStatus.msg}
        secondaryTitle={orderStatus.time}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {/* Live Map - Only show if locations are available */}
        {currentOrder?.deliveryLocation?.latitude &&
          currentOrder?.pickupLocation?.latitude && (
            <LiveMap
              deliveryLocation={currentOrder.deliveryLocation}
              pickupLocation={currentOrder.pickupLocation}
              deliveryPersonLocation={currentOrder.deliveryPersonLocation}
              hasAccepted={currentOrder.status === 'confirmed'}
              hasPickedUp={currentOrder.status === 'arriving'}
            />
          )}

        <OrderProgress currentStep={orderStatus.step} />

        {/* Delivery Partner Info */}
        <View style={styles.flexRow}>
          <View style={styles.iconContainer}>
            <Icon
              name={currentOrder?.deliveryPartner ? 'phone' : 'shopping'}
              color={Colors.disabled}
              size={RFValue(20)}
            />
          </View>
          <View style={styles.textContainer}>
            <CustomText
              numberOfLines={1}
              variant="h7"
              fontFamily={Fonts.SemiBold}>
              {currentOrder?.deliveryPartner?.name ||
                'We will soon assign delivery partner'}
            </CustomText>

            {currentOrder?.deliveryPartner?.phone && (
              <CustomText
                numberOfLines={1}
                variant="h6"
                fontFamily={Fonts.Medium}>
                {currentOrder.deliveryPartner.phone}
              </CustomText>
            )}

            <CustomText
              numberOfLines={1}
              variant="h9"
              fontFamily={Fonts.Medium}>
              {currentOrder?.deliveryPartner
                ? 'For delivery instructions you can contact here'
                : orderStatus.msg}
            </CustomText>
          </View>
        </View>

        {/* Delivery Details */}
        <DeliveryDetails
          details={currentOrder?.customer}
          paymentMode={currentOrder?.paymentMode}
        />

        {/* Order Summary */}
        <OrderSummary
          order={currentOrder}
          discount={currentOrder?.discount || 0}
        />

        {/* Pay Now Button - Only show for pending COD orders */}
        {currentOrder?.paymentStatus === 'pending' &&
          currentOrder?.paymentMode === 'COD' &&
          currentOrder?.status === 'confirmed' && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handlePayNow}
              disabled={loading}
              style={[styles.payNowBtn, { backgroundColor: loading ? Colors.disabled : Colors.primary }]}>
              {
                loading ? (
                  <>
                    <ActivityIndicator size={'small'} color={'#fff'} />
                    <CustomText fontFamily={Fonts.SemiBold} style={styles.payNowText}>
                      Processing...
                    </CustomText>
                  </>
                ) : (
                  <CustomText fontFamily={Fonts.SemiBold} style={styles.payNowText}>
                    Pay Now - ₹{currentOrder?.finalTotal}
                  </CustomText>
                )
              }
            </TouchableOpacity>
          )}

        {/* Rating Section */}
        <View style={[styles.flexRow, styles.ratingContainer]}>
          <View style={styles.iconContainer}>
            <Icon
              name="cards-heart-outline"
              color={Colors.disabled}
              size={RFValue(20)}
            />
          </View>
          <View style={styles.textContainer}>
            <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
              Do You Like Our App?
            </CustomText>
            <CustomText variant="h9" fontFamily={Fonts.Regular}>
              Hit the Like button if you really love our app.
            </CustomText>
          </View>
        </View>

        {/* Footer */}
        <CustomText
          variant="h8"
          fontFamily={Fonts.SemiBold}
          style={styles.footerText}>
          Manjit x Coder's Space Grocery Delivery App
        </CustomText>
      </ScrollView>
    </View>
  );
};

export default LiveTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    margin: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    flex: 1,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#d32f2f',
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
  },
  progressContainer: {
    height: screenHeight * 0.35,
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  scrollContainer: {
    paddingBottom: 150,
    backgroundColor: Colors.backgroundSecondary,
    padding: 15,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    borderRadius: 15,
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 0.3,
    borderColor: Colors.border,
    borderRightColor: '#fff',
  },
  ratingContainer: {
    borderColor: Colors.border,
    borderWidth: 1,
  },
  iconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '82%',
  },
  payNowBtn: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginVertical: 16,
  },
  payNowText: {
    color: '#fff',
  },
  footerText: {
    marginTop: 30,
    opacity: 0.5,
    textAlign: 'center',
  },
});
