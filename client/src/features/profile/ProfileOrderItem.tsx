import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import {formatISOToCustom} from '@utils/DateUtils';

interface CartItem {
  _id: string | number;
  item: any;
  itemCount: number;
}

interface Order {
  orderId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: 'confirmed' | 'completed';
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'available':
      return '#d6dd';
    case 'confirmed':
      return '#007bfa';
    case 'delivered':
      return '#0EDB11';
    case 'cancelled':
      return '#dc3545';
    case 'arriving':
      return 'orange';
    default:
      return '#620564';
  }
}

const ProfileOrderItem: FC<{item: any; index: number}> = ({index, item}) => {
  return (
    <View style={[styles.container, {borderTopWidth: index === 0 ? 0.7 : 0}]}>
      <View style={[styles.flexRowBetween, {marginBottom: 8}]}>
        <CustomText variant="h8" fontFamily={Fonts.Medium}>
          {item.orderId}
        </CustomText>
        <CustomText
          variant="h8"
          fontFamily={Fonts.Medium}
          style={[
            {textTransform: 'capitalize', color: getStatusColor(item.status)},
          ]}>
          ◉ {item.status}
        </CustomText>
      </View>

      <View style={styles.flexRowBetween}>
        <View style={{width: '50%'}}>
          {item?.items?.map((i : any, idx : number) => {
            return (
              <CustomText key={idx} variant="h9" numberOfLines={1}>
                {i?.itemCount} x {i?.item?.name}
              </CustomText>
            );
          })}
        </View>
        <View style={{alignItems: 'flex-end',alignSelf : 'flex-end'}}>
          <CustomText
            variant="h5"
            fontFamily={Fonts.SemiBold}
            style={{marginTop: 10}}>
            ₹{item?.finalTotal || item?.totalPrice}
          </CustomText>
          <CustomText variant="h8">
            {formatISOToCustom(item.createdAt)}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default ProfileOrderItem;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.4,
    paddingVertical: 16,
    opacity: 0.9,
    borderColor : Colors.disabled
  },
  flexRowBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
