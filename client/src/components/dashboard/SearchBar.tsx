import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts} from '@utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomInput from '@components/ui/CustomInput';
import {TextInput} from 'react-native-gesture-handler';
import RollingBar from 'react-native-rolling-bar';
import CustomText from '@components/ui/CustomText';

const SearchBar: FC = () => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <Icon name="search" color={'#aaa'} size={RFValue(20)} />
      <RollingBar
        interval={3000}
        defaultStyle={false}
        customStyle={styles.textContainer}>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          {' '}
          Search "sweets"
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          {' '}
          Search "milk"
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          {' '}
          Search "chips"
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          {' '}
          Search "coca cola"
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          {' '}
          Search for aata, dal, cake"
        </CustomText>
      </RollingBar>
      <View style={styles.divider} />
      <Icon name="mic" color={Colors.text} size={RFValue(20)} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginInline: 10,
    paddingVertical: 6,
    paddingInline: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    borderColor: Colors.border,
    borderWidth: 1,
    overflow : 'hidden'
  },
  inputContainer: {
    width: '80%',
    fontFamily: Fonts.SemiBold,
    fontSize: RFValue(14),
    color: Colors.text,
  },
  textContainer: {
    width: '90%',
    color: 'f6f6f6',
  },
  divider: {
    height: '70%',
    width: 1,
    backgroundColor: Colors.border,
    marginInline: 10,
    opacity: 0.4,
  },
});

export default SearchBar;
