import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import CustomText from '@components/ui/CustomText'
import { Fonts } from '@utils/Constants'
import { RFValue } from 'react-native-responsive-fontsize'
import { useAuthStore } from '@state/authStore'
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import { navigate } from '@utils/NavigationUtils'

const header:FC<{showNotice:()=>void}> = ({showNotice}) => {

    const {user,setUser} = useAuthStore();

  return (
    <View style={styles.subContainer}>
     <TouchableOpacity activeOpacity={0.8}>
        <CustomText variant='h8' fontFamily={Fonts.Bold} style={styles.text}> Delivery in</CustomText>
     <View style={styles.flexRowGap}>
        <CustomText fontFamily={Fonts.SemiBold} variant='h2' style={styles.text}>
                16 minutes
        </CustomText>
        <TouchableOpacity style={styles.noticeBtn} onPress={showNotice} activeOpacity={0.8} >
            <CustomText  fontSize={RFValue(6)} fontFamily={Fonts.SemiBold} style={[{color : '#3b4886'}]}>🌧️ Rain</CustomText>
        </TouchableOpacity>
     </View>

     <View style={styles.flexRow}>
        <CustomText variant='h8' fontFamily={Fonts.Medium} numberOfLines={1} style={styles.text}>
            {user?.address || "Location Not Available!"}
        </CustomText>
        <Icon name='menu-down' color='#fff' size={RFValue(20)} style={{bottom : -1}}  />
     </View>
     </TouchableOpacity>

     <TouchableOpacity activeOpacity={0.7} onPress={()=> navigate("ProfileScreen")}>
        <Icon name='account-circle-outline' size={RFValue(36)} color='#fff' />
     </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    subContainer : {
        flexDirection : 'row',
        alignItems : 'center',
        paddingHorizontal : 10,
        paddingTop : Platform.OS==='android' ? 10 : 5,
        justifyContent : 'space-between',
        marginTop : 10
    },
    text : {
        color : '#fff',
    },
    text2 : {
        color : '#fff',
        width : '90%',
        // textAlign : 'center',
    },
    flexRow : {
        justifyContent : 'flex-start',
        alignItems : 'center',
        flexDirection : 'row',
        gap : 2,
        width : '70%',
        paddingHorizontal : 5,

    },
    flexRowGap : {
        flexDirection : 'row',
        alignItems  :'center',
        gap : 5
    },
    noticeBtn : {
        backgroundColor : 'hsla(0, 0.00%, 100.00%, 0.6)',
        borderRadius : 100,
        paddingHorizontal : 8,
        paddingVertical: 2,
        bottom : -2,
    }
})

export default header