import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import { EXTRACHARGES } from '@service/config';
import { useCouponStore } from '@state/couponStore';

const CouponResult: FC = () => {

  const { appliedCoupon : result,clearCoupon} = useCouponStore() as any ;

  if (!result) return null;
  

  return (
    <View style={styles.resultBox}>
      {result?.success ? (
        <>
          <CustomText fontFamily={Fonts.SemiBold} style={styles.success}>
            Coupon Applied!✅
          </CustomText>
          <CustomText fontFamily={Fonts.Medium} style={styles.success}>
            You have got discount of ₹{result.discount.toFixed(2)}
          </CustomText>
          <CustomText fontFamily={Fonts.Medium} style={styles.success}>
            Final Amount : ₹{result.finalTotal.toFixed(2) + EXTRACHARGES}
          </CustomText>
        </>
      ) : (
        <CustomText fontFamily={Fonts.SemiBold} style={styles.error}>
          {result.message}
        </CustomText>
      )}
    </View>
  )
}

export default CouponResult

const styles = StyleSheet.create({
  resultBox: {
    marginTop: 15,
    padding: 13,
    backgroundColor: '#e4e9ec77',
    borderRadius: 8
  },
  success: {
    color: '#35d665ff',
    marginBottom: 5
  },
  error: {
    color: '#ff7b7bff',

  },

})