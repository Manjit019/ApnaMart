import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { adData, categories } from '@utils/dummyData'
import AdCarousel from '@components/dashboard/AdCarousel'
import CustomText from '@components/ui/CustomText'
import { Fonts } from '@utils/Constants'
import CategoryContainer from '@components/dashboard/CategoryContainer'

const Content:FC = () => {
  return (
    <View style={styles.container}>
      <AdCarousel adData={adData} />
      <CustomText variant='h5'  fontFamily={Fonts.SemiBold}> Grocery & Kitchens</CustomText>
      <CategoryContainer data={categories} />
      <CustomText variant='h5'  fontFamily={Fonts.SemiBold}> Best Sellers</CustomText>
      <CategoryContainer data={categories.reverse()} />
      <CustomText variant='h5'  fontFamily={Fonts.SemiBold}> Snacks & Drinks</CustomText>
      <CategoryContainer data={categories} />
      <CustomText variant='h5'  fontFamily={Fonts.SemiBold}>Home & Life Style</CustomText>
      <CategoryContainer data={categories.reverse()} />
    </View>
  )
}

export default Content

const styles = StyleSheet.create({
    container : {
        paddingHorizontal : 20,
    }
})