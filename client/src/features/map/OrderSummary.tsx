import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import BillDetails from '@features/order/BillDetails';
import {useCouponStore} from '@state/couponStore';

const OrderSummary: FC<{order: any; discount: number}> = ({
  order,
  discount,
}) => {
  const totalPrice =
    order?.items?.reduce(
      (totalPrice: number, cartItems: any) =>
        totalPrice + cartItems.item.price * cartItems.itemCount,
      0,
    ) || 0;

  return (
    <View style={styles.container}>
      <View style={[styles.flexRow, styles.topStyle]}>
        <View style={[styles.iconContainer, {borderRadius: 12}]}>
          <Icon
            name="shopping-outline"
            color={Colors.disabled}
            size={RFValue(20)}
          />
        </View>
        <View>
          <CustomText variant="h7" fontFamily={Fonts.Bold}>
            Order Summary
          </CustomText>
          <CustomText>Order Id - {order?.orderId}</CustomText>
        </View>
      </View>

      {order?.items?.map((item: any, index: number) => {
        return (
          <View
            style={[
              styles.flexRow,
              {borderBottomColor: Colors.border, borderBottomWidth: 0.2},
            ]}
            key={index}>
            <View style={styles.imgContainer}>
              <Image source={{uri: item?.item?.image}} style={styles.img} />
            </View>
            <View style={{width: '55%'}}>
              <CustomText
                numberOfLines={2}
                variant="h8"
                fontFamily={Fonts.Medium}>
                {item?.item?.name}
              </CustomText>
              <CustomText variant="h9" style={{marginTop: 4}}>
                {item.item.quantity}
              </CustomText>
            </View>

            <View style={{width: '20%', alignItems: 'flex-end'}}>
              <CustomText
                variant="h7"
                fontFamily={Fonts.SemiBold}
                style={{alignSelf: 'flex-end', marginTop: 4}}>
                ₹{item.itemCount * item.item.price}
              </CustomText>
            </View>
          </View>
        );
      })}

      <BillDetails totalItemPrice={totalPrice} discount={discount} />
    </View>
  );
};

export default OrderSummary;

const styles = StyleSheet.create({
  img: {
    width: 40,
    height: 40,
  },
  imgContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 16,
    width: '17%',
  },
  container: {
    width: '100%',
    borderRadius: 16,
    marginVertical: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  iconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#fff',
    padding: 10,
  },
  topStyle: {
    backgroundColor: Colors.border,
    paddingVertical: 10,
  },
});
