import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {screenHeight} from '@utils/Scaling';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import UniversalAdd from '@components/ui/UniversalAdd';

const ProductItem: FC<{item: any; index: any}> = ({item, index}) => {
  const isSecondColumn = index % 2 != 0;

  return (
    <View style={[styles.container, {marginRight: isSecondColumn ? 10 : 0}]}>
      <View style={styles.imageContainer}>
        <Image source={{uri: item?.image}} style={styles.img} />

        <View style={styles.addBtn}>
         <UniversalAdd item={item} />
        </View>
      </View>
      <View style={styles.content}>
        <View style={[{flexDirection : 'row',justifyContent : 'space-between',alignItems : 'center'}]}>

          <View style={styles.flexRow}>
            <Image
              source={require('@assets/icons/clock.png')}
              style={styles.clockIcon}
            />
            <CustomText fontSize={RFValue(6)} fontFamily={Fonts.Medium}>
              20 MINS
            </CustomText>
          </View>
          <CustomText fontSize={RFValue(6)} fontFamily={Fonts.Medium}>
            {item.quantity}
          </CustomText>
        </View>
        <CustomText
          fontFamily={Fonts.Medium}
          variant="h8"
          numberOfLines={2}
          style={{marginVertical: 4}}>
          {item?.name}
        </CustomText>

        <View style={styles.priceContainer}>
          <View style={{flexDirection : 'row',alignItems : 'center'}}>
            <CustomText variant="h8" fontFamily={Fonts.SemiBold}>
              ₹{item?.price}{' '}
            </CustomText>
            <CustomText
              fontFamily={Fonts.Medium}
              variant="h8"
              style={{opacity: 0.7, textDecorationLine: 'line-through'}}>
              ₹{item?.discountPrice}
            </CustomText>
          </View>

        </View>
      </View>
    </View>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    width: '45%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    marginLeft: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    height: screenHeight * 0.14,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    position : 'relative'
  },
  addBtn : {
    position : 'absolute',
    bottom : 5,
    right : 5
  },
  img: {
    height: '100%',
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  flexRow: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: 5,
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.backgroundSecondary,
    alignSelf: 'flex-start',
  },
  clockIcon: {
    height: 15,
    width: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 10,
  },
});
