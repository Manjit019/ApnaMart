import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import CustomHeader from '@components/ui/CustomHeader';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuthStore } from '@state/authStore';
import ActionButton from './ActionButton';
import { useCartStore } from '@state/cartStore';
import { fetchCustomerOrders } from '@service/orderService';
import OrderItem from '@features/order/OrderItem';
import ProfileOrderItem from './ProfileOrderItem';
import { storage, tokenStorage } from '@state/storage';
import { resetAndNavigate } from '@utils/NavigationUtils';
import WalletSection from './WalletSection';



const ProfileScreen = () => {
  const [orders, setOrders] = useState([]);
  const { user, logout, currentOrder } = useAuthStore();
  const { clearCart } = useCartStore();

  const fetchOrders = async () => {
    const data = await fetchCustomerOrders(user?._id);
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);



  const renderHeader = () => {
    return (
      <View>
        <StatusBar translucent={false} backgroundColor="#fff" barStyle='dark-content' />
        <View style={[styles.flexRow, { justifyContent: 'space-between' }]}>
          <View>
            <CustomText variant="h3" fontFamily={Fonts.SemiBold}>
              Hey! {user?.name.split(' ')[0] || 'Ananonymous'}
            </CustomText>
            <CustomText variant="h7" fontFamily={Fonts.Medium}>
              {user?.phone}
            </CustomText>
            <CustomText variant="h7" fontFamily={Fonts.Medium}>
              {user?.address}
            </CustomText>
          </View>
          <View style={[styles.iconContainer, { flexDirection: 'row' }]}>
            <Icon
              name="flash-outline"
              size={RFValue(16)}
              color={Colors.secondary}
            />
            <CustomText>10</CustomText>
          </View>
        </View>

        <WalletSection />

        <CustomText variant="h8" style={styles.informativeText}>
          YOUR INFORMATION
        </CustomText>
        <ActionButton icon="book-outline" label="Address book" />
        <ActionButton icon="information-circle-outline" label="About Us" />

        <ActionButton
          icon="log-out-outline"
          label="Log out"
          onPress={() => {
            clearCart();
            logout();
            tokenStorage.clearAll();
            storage.clearAll();
            resetAndNavigate('CustomerLogin');
          }}
        />

        <CustomText
          variant="h8"
          fontFamily={Fonts.SemiBold}
          style={{ color: Colors.text, marginBottom: 10, marginTop: 25 }}>
          PAST ORDERS
        </CustomText>
      </View>
    );
  };

  const renderOrders = ({ item, index }: any) => {
    return <ProfileOrderItem key={index} item={item} index={index} />;
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Profile" />

      <FlatList
        data={orders.reverse()}
        ListHeaderComponent={renderHeader}
        renderItem={renderOrders}
        keyExtractor={(item: any) => item?.orderId}
        contentContainerStyle={styles.scrollViewContent}
        ListFooterComponent={
          <CustomText
            variant="h9"
            style={{ textAlign: 'center', paddingTop: 140 }}>
            App Version 1.0.0.0
          </CustomText>
        }
        ListFooterComponentStyle={{ paddingTop: 120 }}
        ListEmptyComponent={() => {
          return (
            <CustomText variant='h8' style={{ paddingTop: 30 }}>No Past Order Found Yet! </CustomText>
          )
        }}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 10,
    paddingTop: 20,
  },
  informativeText: {
    opacity: 0.7,
    marginTop: 20,
    marginBottom: 10,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  iconContainer: {
    borderRadius: 100,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: Colors.secondary,
  },

  pastText: {},
});
