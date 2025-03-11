import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { Colors, Fonts } from '@utils/Constants'
import CustomText from '@components/ui/CustomText'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { RFValue } from 'react-native-responsive-fontsize'

const ReportItem:FC<{
    iconName:string;
    underline?:boolean;
    title : string;
    price : number;
}> = ({iconName,price,title,underline}) => {
    return (
        <View style={[styles.flexRowBetween,{marginBottom : 10}]}>
            <View style={styles.flexRow}>
                <Icon name={iconName} style={{opacity : 0.7}} size={RFValue(12)}  />
                <CustomText style={{textDecorationLine : underline ? 'underline' : 'none',marginLeft : 4}} variant='h8' fontFamily={Fonts.Medium}>{title}</CustomText>
            </View>
            <CustomText variant='h8' fontFamily={Fonts.SemiBold}>
                ₹{price}
            </CustomText>
        </View>
    )
}


const BillDetails:FC<{totalItemPrice : any}> = ({totalItemPrice}) => {
  return (
    <View style={styles.container}>
       <CustomText style={styles.text} variant='h6' fontFamily={Fonts.SemiBold}>Bill Details</CustomText>

       <View style={styles.billContainer}>
            <ReportItem iconName='article' title='Items total' price={totalItemPrice} />
            <ReportItem iconName='pedal-bike' title='Delivery Charge' price={29} />
            <ReportItem iconName='shopping-bag' title='Handling Charge' price={4} />
            <ReportItem iconName='cloudy-snowing' title='Surge Charge' price={7} />

       </View>
        <View style={[styles.flexRowBetween,{marginBottom : 16}]}>
            <CustomText style={styles.text} variant='h7' fontFamily={Fonts.SemiBold}>Grand Total</CustomText>
            <CustomText style={styles.text} variant='h6' fontFamily={Fonts.Bold}>₹{totalItemPrice + 40}</CustomText>

        </View>

    </View>
  )
}


export default BillDetails

const styles = StyleSheet.create({
    container : {
        backgroundColor : '#fff',
        borderRadius : 16,
        marginVertical : 15,
    },
    text : {
        marginHorizontal : 10,
        marginTop : 15
    },
    billContainer : {
        padding : 10,
        paddingBottom : 0,
        borderBottomColor : Colors.border,
        borderBottomWidth : 0.2,
        borderTopColor : Colors.border,
        borderTopWidth : 0.2,
        marginTop : 6
    },
    flexRowBetween : {
        justifyContent : 'space-between',
        alignItems : 'center',
        flexDirection : 'row'
    },
    flexRow : {
        flexDirection : 'row',
        alignItems : 'center',
        gap : 1
    }
})