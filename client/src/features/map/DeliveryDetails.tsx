import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts } from '@utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

const DeliveryDetails:FC<{details : any}> = ({details}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.flexRow,styles.topStyle]}>
         <View style={[styles.iconContainer,{borderRadius : 12}]}>
          <Icon
            name="bike-fast"
            color={Colors.disabled}
            size={RFValue(20)}
          />
        </View>
        <View>
          <CustomText variant="h7" fontFamily={Fonts.Bold}>
            Your Delivery Details
          </CustomText>
          <CustomText variant='h9'>Details of your current order</CustomText>
        </View>
      </View>

      <View style={styles.flexRow}>
         <View style={styles.iconContainer}>
          <Icon
            name="map-marker-outline"
            color={Colors.disabled}
            size={RFValue(20)}
          />
        </View>
        <View>
          <CustomText variant="h7" fontFamily={Fonts.Bold} >
            Delivery at Home
          </CustomText>
          <CustomText variant='h8'>{details?.address || '----------'}</CustomText>
        </View>
      </View>

      <View style={styles.flexRow}>
         <View style={styles.iconContainer}>
          <Icon
            name="phone-outline"
            color={Colors.disabled}
            size={RFValue(20)}
          />
        </View>
        <View>
          <CustomText variant="h7" fontFamily={Fonts.Bold} >
            {details?.name || 'Ananymous'} {details?.phone || 'xxxxxxxxx'}
          </CustomText>
          <CustomText variant='h8'>Reciever's cantact no.</CustomText>
        </View>
      </View>
    </View>
  )
}

export default DeliveryDetails

const styles = StyleSheet.create({
    container : {
        width : '100%',
        borderRadius : 16,
        marginVertical : 15,
        paddingBottom : 10,
        backgroundColor : '#fff',
        overflow : 'hidden'
    },
    flexRow : {
        flexDirection : 'row',
        alignItems : 'center',
        gap : 10,
        paddingHorizontal : 10,
        marginBottom : 14
    }, iconContainer: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      topStyle : {
        backgroundColor : Colors.border,
        paddingVertical : 10,
      }
})