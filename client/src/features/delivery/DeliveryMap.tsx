import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAuthStore} from '@state/authStore';
import {
  confirmOrder,
  getOrderById,
  sendLiveOrderUpdates,
} from '@service/orderService';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import LiveHeader from '@features/map/LiveHeader';
import CustomText from '@components/ui/CustomText';
import DeliveryDetails from '@features/map/DeliveryDetails';
import OrderSummary from '@features/map/OrderSummary';
import {screenHeight} from '@utils/Scaling';
import {useRoute} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import {hocStyle} from '@styles/GlobalStyles';
import CustomButton from '@components/ui/CustomButton';

const DeliveryMap = () => {
  const user = useAuthStore(state => state.user);
  const [orderData, setOrderData] = useState<any>(null);
  const [myLocation, setMyLocation] = useState<any>(null);
  const [loading,setLoading] = useState(true);
  const route = useRoute();
  const orderDetails = route?.params as Record<string, any>;
  const {currentOrder, setCurrentOrder} = useAuthStore();

  const fetchOrderDetails = async () => {
    const data = await getOrderById(orderDetails?._id as any);
    setCurrentOrder(data);
    setOrderData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  /*
  useEffect 
  */
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        setMyLocation({latitude, longitude});
      },
      err => {
        console.log('Error Fetching Geolocation : ', err);
      },
      {enableHighAccuracy: true, distanceFilter: 200},
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  const acceptOrder = async () => {
    const data = await confirmOrder(orderData?._id, myLocation);
    if (data) {
      setCurrentOrder(data);
      Alert.alert('Order Accepted,Grab your package');
    } else {
      Alert.alert('There was an error!');
    }
    fetchOrderDetails();
  };

  const orderPickedUp = async () => {
    const data = await sendLiveOrderUpdates(
      orderData?._id,
      myLocation,
      'arriving',
    );
    if (data) {
      setCurrentOrder(data);
      Alert.alert("Order Picked Up","Let's deliver it as soon as possible");
    } else {
      Alert.alert('There was an error!');
    }
    fetchOrderDetails();
  };

  const orderDelivered = async () => {
    const data = await sendLiveOrderUpdates(
      orderData?._id,
      myLocation,
      'delivered',
    );

    if (data) {
      setCurrentOrder(null);
      Alert.alert('Congrats!,You made it😍',"Great job! Order Delivered Successfully");
    } else {
      Alert.alert('There was an error!');
    }
    fetchOrderDetails();
  };

  let msg = 'Start this order';
  if (
    orderData?.deliveryPartner?._id == user?._id &&
    orderData?.status === 'confirmed'
  ) {
    msg = 'Grab your order';
  } else if (
    orderData?.deliveryPartner?._id == user?._id &&
    orderData?.status === 'arriving'
  ) {
    msg = 'Complete your order';
  } else if (
    orderData?.deliveryPartner?._id == user?._id &&
    orderData?.status === 'delivered'
  ) {
    msg = 'Your milestone';
  } else if (
    orderData?.deliveryPartner?._id == user?._id &&
    orderData?.status != 'available'
  ) {
    msg = 'You missed it';
  }

  useEffect(() => {
    async function sendLiveUpdates() {
      if (
        orderData?.deliveryPartner?._id == user?._id &&
        orderData?.status != 'delivered' &&
        orderData?.status != 'cancelled'
      ) {
        await sendLiveOrderUpdates(
          orderData._id,
          myLocation,
          orderData?.status,
        );
      }
    }
    sendLiveUpdates();
  }, [myLocation]);

  if(loading){
    return (
      <View style={[styles.container,{justifyContent : 'center',alignItems : 'center'}]}>
        <ActivityIndicator color={Colors.text} size='small' />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <LiveHeader type="Delivery" title="ApnaMart" secondaryTitle={msg} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {/* <LiveMap 
          deliveryLocation={currentOrder?.deliveryLocation}
          pickupLocation={currentOrder?.pickupLocation}
          deliveryPersonLocation={currentOrder?.deliveryPersonLocation}
          hasAccepted={currentOrder?.status == 'confirmed'}
          hasPickedUp={currentOrder?.status == 'arriving'}
        /> */}
        {/* <OrderProgress currentStep={step} /> */}

        <DeliveryDetails details={currentOrder?.customer} />

        <OrderSummary order={currentOrder} />

        <View
          style={[
            styles.flexRow,
            {borderColor: Colors.border, borderWidth: 1},
          ]}>
          <View style={styles.iconContainer}>
            <Icon
              name="cards-heart-outline"
              color={Colors.disabled}
              size={RFValue(20)}
            />
          </View>
          <View style={{width: '82%'}}>
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
          style={{marginTop: 30, opacity: 0.5, textAlign: 'center'}}>
          Manjit x Coder's Space Grocery Delivery App
        </CustomText>
      </ScrollView>

      {orderData?.status != 'delivered' && orderData?.status != 'cancelled' && (
        <View style={[hocStyle.cartContainer, styles.btnContainer]}>
          {orderData?.status == 'available' && (
            <CustomButton
              title="Accept Order"
              disabled={false}
              onPress={acceptOrder}
              loading={false}
            />
          )}
          {orderData?.status == 'confirmed' &&
            orderData?.deliveryPartner?._id === user?._id && (
              <CustomButton
                title="Order Picked Up"
                disabled={false}
                onPress={orderPickedUp}
                loading={false}
              />
            )}
          {orderData?.status == 'arriving' &&
            orderData?.deliveryPartner?._id === user?._id && (
              <CustomButton
                title="Delivered"
                disabled={false}
                onPress={orderDelivered}
                loading={false}
              />
            )}
        </View>
      )}
    </View>
  );
};

export default DeliveryMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
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
  btnContainer: {
    padding: 10,
  },
});
