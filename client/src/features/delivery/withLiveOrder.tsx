import CustomText from '@components/ui/CustomText';
import Geolocation from '@react-native-community/geolocation';
import {sendLiveOrderUpdates} from '@service/orderService';
import {useAuthStore} from '@state/authStore';
import {hocStyle} from '@styles/GlobalStyles';
import {Colors, Fonts} from '@utils/Constants';
import {navigate} from '@utils/NavigationUtils';
import {FC, useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

const withLiveOrder = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): FC<P> => {
  const WithLiveOrderComponent: FC<P> = props => {
    const {currentOrder, user} = useAuthStore();
    const [myLocation, setMyLocation] = useState<any>(null);

    useEffect(() => {
      if (currentOrder) {
        const watchId = Geolocation.watchPosition(
          async position => {
            const {latitude, longitude} = position.coords;
            console.log(
              'Live trcking, : ',
              'LAT : ',
              new Date().toLocaleTimeString(),
              latitude,
              'LON :',
              new Date().toLocaleTimeString(),
              longitude,
            );
            setMyLocation({latitude, longitude});
          },
          err => {
            console.log('Error fetching location :', err);
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 200,
          },
        );
        return () => Geolocation.clearWatch(watchId);
      }
    }, [currentOrder]);

    useEffect(() => {
      async function sendLiveUpdates() {
        if (
          currentOrder?.deliveryPartner?._id &&
          currentOrder?.status != 'delivered' &&
          currentOrder?.status != 'cancelled'
        ) {
          sendLiveOrderUpdates(
            currentOrder?._id,
            myLocation,
            currentOrder?.status,
          );
        }
      }
      sendLiveUpdates();
    }, [myLocation]);

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />
        {currentOrder && currentOrder.status != 'delivered' && currentOrder?.status !='cancelled' && (
          <View
            style={[
              hocStyle.cartContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
              },
            ]}>
            <View style={styles.flexRow}>
              <View style={styles.img}>
                <Image
                  source={require('@assets/icons/bucket.png')}
                  style={{width: 20, height: 20}}
                />
              </View>
              <View style={{width: '65%'}}>
                <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
                  {currentOrder?.orderId}
                </CustomText>
                <CustomText variant="h9" fontFamily={Fonts.SemiBold}>
                  {currentOrder?.deliveryLocation?.address}
                </CustomText>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigate('DeliveryMap', {...currentOrder});
                }}>
                <CustomText
                  variant="h8"
                  style={{color: Colors.secondary}}
                  fontFamily={Fonts.SemiBold}>
                  Continue
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return WithLiveOrderComponent;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 15,
    marginBottom: 15,
    paddingVertical: 10,
    padding: 10,
  },
  img: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 0.7,
    borderColor: Colors.secondary,
    borderRadius: 5,
  },
});

export default withLiveOrder;
