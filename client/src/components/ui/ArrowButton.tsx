import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { Colors, Fonts } from '@utils/Constants';
import CustomText from './CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons'


interface ArrowButtonProps {
    title : string;
    onPress?: () => void;
    price?:number;
    loading?: boolean;
}

const ArrowButton:FC<ArrowButtonProps> = ({title,loading,onPress,price}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} disabled={loading} onPress={onPress} style={[styles.btn,{justifyContent : price !== 0 ? 'space-between' : 'center'}]}>
      {
        price != 0 && price && (
            <View>
                <CustomText variant='h7' style={{color : '#fff'}} fontFamily={Fonts.Medium}>₹{price}.0</CustomText>
                <CustomText variant='h9' style={{color : '#fff'}} fontFamily={Fonts.Medium}>TOTAL</CustomText>

            </View>
        )
      }
      <View style={styles.flexRow}>
            <CustomText variant='h6' fontFamily={Fonts.Medium} style={{color : '#fff'}}>{title}</CustomText>
            {
                loading ? (
                    <ActivityIndicator size='small' color='white' style={{marginHorizontal : 6}} />
                ) : (
                    <Icon name="arrow-right" color="#fff" size={RFValue(25)} />
                )
            }
      </View>
    </TouchableOpacity>
  )
}

export default ArrowButton

const styles = StyleSheet.create({
    btn : {
        backgroundColor : Colors.secondary,
        padding : 10,
        justifyContent : 'center',
        alignItems : 'center',
        flexDirection : 'row',
        borderRadius : 16,
        marginVertical : 10,
        marginHorizontal : 15
    },
    flexRow : {
        flexDirection : 'row',
        justifyContent : 'center',
         alignItems : 'center'
    }
})