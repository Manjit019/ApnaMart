import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {Colors, Fonts} from '@utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import {formatISOToCustom} from '@utils/DateUtils';
import {navigate} from '@utils/NavigationUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CartItem {
  _id: string;
  item: any;
  itemCount: number;
}

interface Order {
  orderId: string;
  items: CartItem[];
  deliveryLocation: string | any;
  totalPrice: number;
  createdAt: string;
  status: 'confirmed' | 'completed';
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'available':
      return '#0EDB11';
    case 'confirmed':
      return '#007bfa';
    case 'delivered':
      return '#9BABBD';
    case 'cancelled':
      return '#dc3545';
    default:
      return '#620564';
  }
}

const DeliveryOrderItem: FC<{item: Order; index: number}> = ({index, item}) => {
  return (
    <View style={styles.container}>
      <View style={styles.flexRowBetween}>
        <CustomText variant="h8" fontFamily={Fonts.SemiBold}>
          {item.orderId}
        </CustomText>
        <View style={[styles.statusContainer]}>
          <CustomText
            variant="h8"
            fontFamily={Fonts.SemiBold}
            style={[styles.statusText, {color: getStatusColor(item.status)}]}>
            {item.status}
          </CustomText>
        </View>
      </View>

      <View style={styles.itemContainer}>
        {item.items.slice(0, 2).map((i, idx) => {
          return (
            <CustomText variant="h8" numberOfLines={1} key={idx}>
              {i.itemCount} x {i.item?.name}
            </CustomText>
          );
        })}
      </View>

      <View style={[styles.flexRowBetween, styles.addressContainer]}>
        <View style={styles.addressTextContainer}>
          <CustomText variant="h8" numberOfLines={1}>
            {item?.deliveryLocation?.address}
          </CustomText>
          <CustomText variant="h8" style={{marginTop : 4}}>
            {formatISOToCustom(item.createdAt)}
          </CustomText>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.iconContainer}
          onPress={() => {
            navigate('DeliveryMap', {
              ...item,
            });
          }}>
          <Icon
            name="arrow-right-circle"
            size={RFValue(24)}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeliveryOrderItem;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.7,
    padding: 10,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  flexRowBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 24,
  },
  statusText: {
    textTransform: 'capitalize',
    color: '#fff',
  },
  itemContainer: {
    width: '50%',
    marginTop: 13,
  },
  addressContainer: {
    marginTop: 10,
  },
  addressTextContainer: {
    width: '70%',
  },
  dateText: {
    marginTop: 2,
    fontSize: RFValue(8),
  },
  iconContainer: {
    alignItems: 'flex-end',
  },
});
