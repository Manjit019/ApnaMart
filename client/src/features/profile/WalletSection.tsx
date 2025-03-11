import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@utils/Constants'
import WalletItem from './WalletItem'

const WalletSection = () => {
  return (
    <View style={styles.walletContainer}>
      <WalletItem  icon='wallet-outline' label='wallet' />
      <WalletItem  icon='chatbubble-ellipses-outline' label='Support' />
      <WalletItem  icon='cart-outline' label='Payments' />

    </View>
  )
}

export default WalletSection

const styles = StyleSheet.create({
    walletContainer : {
        justifyContent : 'space-around',
        flexDirection  :'row',
        alignItems : 'center',
        backgroundColor : Colors.backgroundSecondary,
        borderRadius : 16,
        marginVertical : 20,
        paddingVertical : 20
    }
})