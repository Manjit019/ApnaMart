import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import CustomText from '@components/ui/CustomText'
import { screenWidth } from '@utils/Scaling'
import { Colors, Fonts } from '@utils/Constants'
import UniversalAdd from '@components/ui/UniversalAdd'
import ADDBtn from './ADDBtn'
import  Icon  from 'react-native-vector-icons/Ionicons'
import { navigate } from '@utils/NavigationUtils'



const AddBuyBtn: FC<{item:any}> = ({item}) => {
    return (
        <View style={styles.container}>
            <View style={{width : screenWidth * 0.5}}>
                <ADDBtn item={item} />
            </View>
            <TouchableOpacity onPress={() => navigate('ProductOrder')} style={[styles.btn, { backgroundColor: Colors.secondary }]}>

                <CustomText fontFamily={Fonts.SemiBold} variant='h6' style={{color : '#fff'}} >CHECKOUT</CustomText>
                <Icon name='arrow-forward' size={19} color='#fff' />
            </TouchableOpacity>
        </View>
    )
}

export default AddBuyBtn;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    btn: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        width: screenWidth * 0.5,
    }
})