import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { Colors, Fonts } from '@utils/Constants'
import CustomText from '@components/ui/CustomText';
import  Icon  from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { resetAndNavigate } from '@utils/NavigationUtils';
import { storage, tokenStorage } from '@state/storage';
import { useAuthStore } from '@state/authStore';

interface DeliveryHeaderProps{
    name : string;
    email : string;
}

const DeliveryHeader:FC<DeliveryHeaderProps> = ({email,name}) => {

    const {logout} = useAuthStore();

  return (
    <View style={styles.flexRow}>
      <View style={styles.imgContainer}>
            <Image source={require('@assets/images/delivery_boy.png')} style={styles.img} />
      </View>
      <View style={styles.infoContainer}>
            <CustomText variant='h4' fontFamily={Fonts.SemiBold} numberOfLines={1}>Hello {name}</CustomText>
            <CustomText variant='h8' fontFamily={Fonts.Medium}>{email}</CustomText>
      </View>

        <TouchableOpacity activeOpacity={0.7} onPress={()=>{
            resetAndNavigate("CustomerLogin");
            logout();
            tokenStorage.clearAll();
            storage.clearAll();
        }}>
            <Icon name='log-out-outline' size={RFValue(24)} color='#000' />
        </TouchableOpacity>

    </View>
  )
}

export default DeliveryHeader

const styles = StyleSheet.create({
    flexRow : {
        justifyContent : 'center',
        alignItems : 'center',
        flexDirection : 'row',
        padding : 10
    },
    imgContainer : {
        padding : 4,
        borderRadius : 100,
        height : 60,
        width : 60,
        overflow : 'hidden',
        backgroundColor : Colors.backgroundSecondary
    },
    img : {
        width : '100%',
        height : '100%',
    },
    infoContainer : {
        justifyContent : 'flex-start',
        width : '75%',
        paddingHorizontal : 10
    }
})