import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import Icon from 'react-native-vector-icons/Ionicons'
import { RFValue } from 'react-native-responsive-fontsize';

interface ActionButtonProps{
    icon : string;
    label : string;
    onPress?: () => void;
}

const ActionButton:FC<ActionButtonProps> = ({icon,label,onPress}) => {
  return (
   <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={onPress} >
        <View>
            <Icon name={icon} color={Colors.text} size={RFValue(14)} />
        </View>
        <CustomText variant='h6' fontFamily={Fonts.SemiBold} style={{color:Colors.disabled}}>{label}</CustomText>
   </TouchableOpacity>
  )
}

export default ActionButton

const styles = StyleSheet.create({
  btn : {
    paddingHorizontal  : 10,
    paddingVertical : 8,
    flexDirection : 'row',
    alignItems : 'center',
    borderRadius : 16,
    gap : 14,
  }
})
