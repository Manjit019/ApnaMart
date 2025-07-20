import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import UniversalAdd from '@components/ui/UniversalAdd';

const OrderItem: FC<{item: any}> = ({item}) => {
  return (
    <View style={[styles.flexRow, {borderTopWidth: 0.7}]}>
      <View style={styles.imgContainer}>
        <Image source={{uri: item?.item?.image}} style={styles.img} />
      </View>

      <View style={{width: '58%'}}>
        <CustomText numberOfLines={2} variant="h8" fontFamily={Fonts.Medium}>
          {item?.item?.name}
        </CustomText>

        <CustomText variant="h9">{item?.item?.quantity}</CustomText>

        <View style={[styles.flexRow,{paddingHorizontal  : 0,paddingVertical : 0,marginTop : 5}]}>
          <CustomText fontFamily={Fonts.SemiBold}>
            ₹{item?.count * item?.item?.price}
          </CustomText>
          <CustomText
            variant="h8"
            fontFamily={Fonts.Medium}
            style={{
              opacity: 0.5,
              textDecorationLine: 'line-through',
            }}>
            ₹{item?.count * item?.item?.discountPrice}
          </CustomText>
        </View>
      </View>

      <View style={{width: '20%', alignItems: 'flex-end'}}>
        <UniversalAdd item={item?.item} />
      </View>
    </View>
  );
};

export default OrderItem;

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
    aspectRatio  : 1
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopColor: Colors.border,

  },
});
