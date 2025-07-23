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
import React, { useEffect, useState, useCallback } from 'react';
import { Colors } from '@utils/Constants';
import { useAuthStore } from '@state/authStore';
import DeliveryHeader from '@components/delivery/DeliveryHeader';
import TabBar from '@components/delivery/TabBar';
import Geolocation from '@react-native-community/geolocation';
import { fetchOrders } from '@service/orderService';
import DeliveryOrderItem from '@components/delivery/DeliveryOrderItem';
import CustomText from '@components/ui/CustomText';
import withLiveOrder from './withLiveOrder';
import { reverseGeocode } from '@utils/mapUtils';

type TabType = 'cancelled' | 'available' | 'arriving' | 'confirmed' | 'delivered';


const DeliveryDashboard = () => {
  const { user } = useAuthStore();
  
  const [userData, setUserData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('available');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.secondary} size="large" />
      </View>
    );
  }

  const fetchData = useCallback(async () => {
    if (!userData?._id) return;
    
    try {
      setRefreshing(true);
      setLoading(true);
      const orderData = await fetchOrders(selectedTab, userData._id, userData.branch);
      setData(orderData || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setData([]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [selectedTab, userData?._id, userData?.branch]);

  const updateUserLocation = useCallback(() => {
    if (locationLoading) return; 
    
    setLocationLoading(true);
    
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const address = await reverseGeocode(latitude, longitude);
          setUserData((prev:any) => {
            if (!prev) return prev;
            return {
              ...prev,
              address,
              liveLocation: { latitude, longitude }
            };
          });
        } catch (error) {
          console.error('Error getting address:', error);
          setUserData((prev:any) => {
            if (!prev) return prev;
            return {
              ...prev,
              liveLocation: { latitude, longitude }
            };
          });
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 25000, 
      }
    );
  }, [locationLoading]);

 
  useEffect(() => {
    if (user) {
      setUserData(user);
      updateUserLocation();
    }
  }, [user, updateUserLocation]);

  useEffect(() => {
    if (userData?._id) {
      fetchData();
    }
  }, [fetchData, userData?._id]);

  const renderOrderItem = useCallback(({ item, index }: any) => {
    return <DeliveryOrderItem index={index} item={item} />;
  }, []);

  const handleRefresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const handleTabChange = useCallback((tab: TabType) => {
    setSelectedTab(tab);
  }, []);

  const renderEmptyComponent = useCallback(() => {
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
  }, [loading]);

  const keyExtractor = useCallback((item: any) => item.orderId, []);

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent={false} 
        backgroundColor={Colors.primary} 
        barStyle="light-content" 
      />
      
      <SafeAreaView>
        <DeliveryHeader 
          name={userData?.name || 'Partner'} 
          email={userData?.email || ''} 
        />
      </SafeAreaView>
      
      <View style={styles.subContainer}>
        <TabBar 
          selectedTab={selectedTab} 
          onTabChange={handleTabChange} 
        />

        <FlatList
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
          renderItem={renderOrderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.flatListContainer,
            data.length === 0 && styles.emptyListContainer
          ]}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
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
    paddingBottom: 100,
  },
  emptyListContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});