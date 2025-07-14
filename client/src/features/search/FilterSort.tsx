import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { screenWidth } from '@utils/Scaling'
import { Colors, Fonts } from '@utils/Constants'
import CustomText from '@components/ui/CustomText'
import Icon from 'react-native-vector-icons/Ionicons'
import { RFValue } from 'react-native-responsive-fontsize'

const FilterSort = () => {
  return (
    <View style={styles.absoulteContainer}>
      <View style={styles.menuContainer}>
        <TouchableOpacity activeOpacity={0.9} style={styles.filterBtns}>
          <Icon name='swap-vertical' size={RFValue(16)} />
          <CustomText fontFamily={Fonts.SemiBold} variant='h6'  >SORT</CustomText>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity activeOpacity={0.9} style={styles.filterBtns}>
          <Icon name='filter-outline' size={RFValue(16)} />
          <CustomText fontFamily={Fonts.SemiBold} variant='h6' >FILTER</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default FilterSort

const styles = StyleSheet.create({
  absoulteContainer: {
    position: 'absolute',
    bottom: 20,
    left: '10%',
    width: screenWidth * 0.8,
    backgroundColor: '#b8c9d1ff',
    paddingBlock: 10,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: Colors.border
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'space-around',
    paddingVertical : 4
  },
  filterBtns: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  divider : {
    width : 1,
    height : 20,
    backgroundColor : '#777',
    borderRadius : 10
  }
})