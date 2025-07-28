import CustomText from '@components/ui/CustomText';
import {useNavigationState} from '@react-navigation/native';
import {SOCKET_URL} from '@service/config';
import {getOrderById} from '@service/orderService';
import {useAuthStore} from '@state/authStore';
import {hocStyle} from '@styles/GlobalStyles';
import {Colors, Fonts} from '@utils/Constants';
import {navigate} from '@utils/NavigationUtils';
import {FC, useEffect} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon  from 'react-native-vector-icons/Ionicons';
import {io} from 'socket.io-client';

const withLiveStatus = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): FC<P> => {
  const withLiveStatusComponent: FC<P> = props => {
    const {currentOrder, setCurrentOrder} = useAuthStore();

    const routeName = useNavigationState(
      state => state.routes[(state.stale, state.index)].name,
    );
   

    const fetchOrderDetails = async () => {
      const data = await getOrderById(currentOrder?._id as any);
      if(data?.success){
        setCurrentOrder(data.order);
      }
      const isDeliveredOrCancelled = data?.order?.status === 'delivered' || data?.order?.status === 'cancelled';

      if(isDeliveredOrCancelled){
        setCurrentOrder(null);
      }
    };


    
    
    useEffect(() => {
      if (currentOrder) {
        const socketInstance = io(SOCKET_URL, {
          transports: ['websocket'],
          withCredentials: true,
          path : "/socket.io/"
        });
        
        socketInstance.emit('joinRoom', currentOrder?._id);
        socketInstance.on('liveTrackingUpdate', (updatedOrder) => {
          fetchOrderDetails();
          console.log('RECIEVING LIVE UPDATES🧿');
        });
        socketInstance.on('orderConfirmed', (orderConfirmed) => {
          fetchOrderDetails();
          console.log('ORDER CONFIRMATION LIVE UPDATES 🧿');
        });
        socketInstance.on('connect_error', (error) => {
          console.log('SOCKET CONNECTION ERROR❌', error);
        })
        return () => {
          socketInstance.disconnect();
        };
      }
    }, [currentOrder]);

    

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />
        {currentOrder && routeName === 'ProductDashboard' && (
          <View
            style={[
              hocStyle.cartContainer,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            <View style={styles.flexRow}>
              <View style={styles.img}>
                <Image
                  source={require('@assets/icons/bucket.png')}
                  style={{width: 20, height: 20}}
                />
              </View>
              <View style={{width: '65%'}}>
                <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
                  Order is {currentOrder?.status}
                </CustomText>
                <CustomText variant="h9" fontFamily={Fonts.Medium}>
                  {currentOrder?.items![0]?.item.name +
                    (currentOrder?.items?.length - 1 > 0
                      ? ` and ${currentOrder?.items?.length - 1}+ more items`
                      : '')}
                </CustomText>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.btn}
              onPress={() => navigate('LiveTracking')}>
                <Icon name='eye' color={Colors.secondary} size={16} />
              <CustomText
                fontFamily={Fonts.Medium}
                variant="h8"
                style={{color: Colors.secondary}}>
                View
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  return withLiveStatusComponent;
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0.7,
    borderColor: Colors.secondary,
    borderRadius: 15,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center',
    gap : 4
  },
});

export default withLiveStatus;
