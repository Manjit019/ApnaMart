import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useAuthStore } from '@state/authStore';
import { getOrderById } from '@service/orderService';
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

const LiveTracking = () => {
  const { currentOrder, setCurrentOrder } = useAuthStore();

  const fetchOrderDetails = async () => {
    const data = await getOrderById(currentOrder?._id as any);
    setCurrentOrder(data);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  let msg = 'Order Placed!';
  let time = 'Arriving in 16 minutes...';
  let step = 0;


  if (currentOrder?.status === 'confirmed') {
    msg = 'Order Confirmed';
    time = 'Arriving in 10 minutes...';
    step = 1;
  }
  else if (currentOrder?.status === 'arriving') {
    msg = 'Order Picked Up';
    time = 'Arriving in 6 minutes...';
    step = 2;
  }
  // else if (currentOrder?.status === 'out for delivery') {
  //   msg = 'Out for delivery';
  //   time = 'Arriving in 2 minutes...';
  //   step = 3;
  // }

  else if (currentOrder?.status === 'delivered') {
    msg = 'Order Delivered';
    time = 'Fasted Delivery.';
    step = 3;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.secondary}
        barStyle="light-content"
      />
      <LiveHeader type="Customer" title={msg} secondaryTitle={time} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>

        {currentOrder?.deliveryLocation?.latitude && currentOrder?.pickupLocation && (
          <LiveMap
            deliveryLocation={currentOrder?.deliveryLocation}
            pickupLocation={currentOrder?.pickupLocation}
            deliveryPersonLocation={currentOrder?.deliveryPersonLocation}
            hasAccepted={currentOrder?.status === 'confirmed'}
            hasPickedUp={currentOrder?.status === 'arriving'}
          />
        )}

        <OrderProgress currentStep={step} />

        <View style={styles.flexRow}>
          <View style={styles.iconContainer}>
            <Icon
              name={currentOrder?.deliveryPartner ? 'phone' : 'shopping'}
              color={Colors.disabled}
              size={RFValue(20)}
            />
          </View>
          <View style={{ width: '82%' }}>
            {currentOrder?.deliveryPartner?.name ? (
              <CustomText
                numberOfLines={1}
                variant="h7"
                fontFamily={Fonts.SemiBold}>
                {currentOrder?.deliveryPartner?.name}
              </CustomText>
            ) : (
              <CustomText
                numberOfLines={1}
                variant="h7"
                fontFamily={Fonts.SemiBold}>
                We will soon assign delivery partner
              </CustomText>
            )}

            {currentOrder?.deliveryPartner && (
              <CustomText
                numberOfLines={1}
                variant="h6"
                fontFamily={Fonts.Medium}>
                {currentOrder?.deliveryPartner?.phone}
              </CustomText>
            )}
            <CustomText
              numberOfLines={1}
              variant="h9"
              fontFamily={Fonts.Medium}>
              {currentOrder?.deliveryPartner
                ? 'for Delivery instructions you can contact here'
                : msg}
            </CustomText>
          </View>
        </View>

        <DeliveryDetails details={currentOrder?.customer} />

        <OrderSummary order={currentOrder} discount={currentOrder?.discount || 0} />

        <View
          style={[
            styles.flexRow,
            { borderColor: Colors.border, borderWidth: 1 },
          ]}>
          <View style={styles.iconContainer}>
            <Icon
              name="cards-heart-outline"
              color={Colors.disabled}
              size={RFValue(20)}
            />
          </View>
          <View style={{ width: '82%' }}>
            <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
              Do You Like Our App ?
            </CustomText>
            <CustomText variant="h9" fontFamily={Fonts.Regular}>
              Hit the Like button if you really love our app.
            </CustomText>
          </View>
        </View>

        <CustomText
          variant="h8"
          fontFamily={Fonts.SemiBold}
          style={{ marginTop: 30, opacity: 0.5, textAlign: 'center' }}>
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
  iconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
