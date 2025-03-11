import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {FC, useEffect} from 'react';
import {useCartStore} from '@state/cartStore';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';

const UniversalAdd: FC<{item: any}> = ({item}) => {

  const count = useCartStore(state => state.getItemCount(item?._id));

  const {addItem, removeItem} = useCartStore();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: count === 0 ? '#fff' : Colors.secondary},
      ]}>
      {count === 0 ? (
        <Pressable onPress={() => addItem(item)} style={styles.add}>
          <CustomText
            variant="h9"
            fontFamily={Fonts.SemiBold}
            style={styles.addText}>
            ADD
          </CustomText>
        </Pressable>
      ) : (
        <View style={styles.counterContainer}>
          <Pressable onPress={() => removeItem(item?._id)} style={styles.iconStyle}>
            <Icon name="minus" color="#fff" size={RFValue(10)} />
          </Pressable>
          <CustomText
            variant="h8"
            fontFamily={Fonts.SemiBold}
            style={[styles.text]}>
            {count}
          </CustomText>
          <Pressable onPress={() => addItem(item)} style={styles.iconStyle}>
            <Icon name="plus" color="#fff" size={RFValue(10)} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default UniversalAdd;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 58,
    width: 78,
    paddingHorizontal : 4
  },
  add: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  addText: {
    color: Colors.secondary,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 6,
    justifyContent: 'space-between',
    gap : 4
  },
  text: {
    color: '#fff',
  },
  iconStyle : {
    borderColor : Colors.border,
    borderWidth : 0.7,
    borderRadius :50,
    padding : 2
  }
});
