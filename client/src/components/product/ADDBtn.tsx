import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {FC, useEffect} from 'react';
import {useCartStore} from '@state/cartStore';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

const ADDBtn: FC<{item: any}> = ({item}) => {

  const count = useCartStore(state => state.getItemCount(item?._id));

  const {addItem, removeItem} = useCartStore();

  return (
    <View
      style={[
        styles.container,
        // {backgroundColor: count === 0 ? '#fff' : Colors.secondary},
      ]}>
      {count === 0 ? (
        <Pressable onPress={() => addItem(item)} style={styles.add}>
          <CustomText
            variant="h6"
            fontFamily={Fonts.SemiBold}
            style={styles.addText}>
            ADD TO CART
          </CustomText>
           <Icon name="cart-outline" color={Colors.secondary} size={RFValue(16)} />
        </Pressable>
      ) : (
        <View style={styles.counterContainer}>
          <Pressable onPress={() => removeItem(item?._id)} style={styles.iconStyle}>
            <Icon name="minus" color="#9c1515ff" size={RFValue(20)} />
          </Pressable>
          <CustomText
            variant="h2"
            fontFamily={Fonts.SemiBold}
            style={[styles.text]}>
            {count}
          </CustomText>
          <Pressable onPress={() => addItem(item)} style={styles.iconStyle}>
            <Icon name="plus" color="#007a31ff" size={RFValue(20)} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ADDBtn;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal : 8,
  },
  add: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
    flexDirection : 'row'
  },
  addText: {
    color: Colors.secondary,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap : 14,
    borderWidth : 1,
    borderColor : '#cfcfcfde',
    borderRadius : 30,
    padding : 7
  },
  text: {
    color: '#000',
  },
  iconStyle : {
    borderColor : Colors.border,
    borderWidth : 0.7,
    borderRadius : 50,
    padding : 4
  }
});
