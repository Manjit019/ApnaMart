import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
import CustomButton from '@components/ui/CustomButton';
import { Colors, Fonts } from '@utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const CouponInput: FC<{ onApply: (couponCode: string) => void, loading: boolean }> = ({ onApply, loading }) => {

    const [code, setCode] = useState('');

    return (
        <View>
            <BottomSheetTextInput value={code} onChangeText={setCode} placeholder='Enter Coupon Code' style={styles.input} />
            <CustomButton title='Apply Coupon' disabled={code.length < 2 || loading} loading={loading} loadingText='Applying Coupon..' onPress={() => {
                if (code.trim()) {
                    onApply(code.trim())
                }
            }} />
        </View>
    )
}

export default CouponInput

const styles = StyleSheet.create({
    input: {
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
        shadowOffset: ({ width: 0.5, height: 0.5 }),
        shadowOpacity: 0.6,
        shadowRadius: 2,
        shadowColor: Colors.border,
        borderColor: Colors.border,
        borderWidth: 1,
        width: '100%',
        fontFamily: Fonts.SemiBold,
        fontSize: RFValue(13),
        paddingVertical: 14,
        paddingHorizontal : 18
    }
})