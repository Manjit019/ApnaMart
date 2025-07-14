import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '@utils/Constants';
import {useAuthStore} from '@state/authStore';
import DeliveryHeader from '@components/delivery/DeliveryHeader';
import TabBar from '@components/delivery/TabBar';
import Geolocation from '@react-native-community/geolocation';
import {fetchOrders} from '@service/orderService';
import DeliveryOrderItem from '@components/delivery/DeliveryOrderItem';
import CustomText from '@components/ui/CustomText';
import withLiveOrder from './withLiveOrder';

const DeliveryDashboard = () => {
  const {user, setUser} = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<
    'cancelled' | 'available'|'arriving' | 'confirmed' | 'delivered'
  >('available');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setData([]);
    setRefreshing(true);
    setLoading(true);
    const data = await fetchOrders(selectedTab, user?._id, user?.branch);
    setData(data);
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  const renderOrderItem = ({item, index}: any) => {
    return <DeliveryOrderItem index={index} item={item} />;
  };

  // const updateUser = ()=>{
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       const {latitude,longitude} = position.coords;
  //       reverseGeocode(latitude,longitude,setUser)
  //     },
  //     err => console.log(err),
  //     {
  //       enableHighAccuracy : false,
  //       timeout : 15000
  //     }
  //   )
  // }

  // useEffect(()=>{
  // updateUser()
  // },[])

  return (
    <View style={styles.container}>
       <StatusBar translucent={false} backgroundColor={Colors.secondary} barStyle='dark-content' />
      <SafeAreaView>
        <DeliveryHeader name={user?.name} email={user?.email} />
      </SafeAreaView>
      <View style={styles.subContainer}>
        <TabBar selectedTab={selectedTab} onTabChange={setSelectedTab} />

        <FlatList
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => await fetchData()}
            />
          }
          ListEmptyComponent={() => {
            if (loading) {
              return (
                <View style={styles.center}>
                  <ActivityIndicator color={Colors.secondary} size="small" />
                </View>
              );
            }
            return (
              <View style={styles.center}>
                <CustomText>No Orders Found Yet!</CustomText>
              </View>
            );
          }}
          renderItem={renderOrderItem}
          keyExtractor={item => item.orderId}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </View>
  );
};

export default withLiveOrder(DeliveryDashboard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  subContainer: {
    backgroundColor: Colors.backgroundSecondary,
    flex: 1,
    padding: 6,
  },
  flatListContainer: {
    padding: 2,
    paddingBottom : 100
  },
  center: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
