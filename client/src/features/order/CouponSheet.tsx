import { Keyboard, StatusBar, StyleSheet } from 'react-native';
import React, {
    FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import CouponInput from '@components/order/CouponInput';
import CouponResult from '@components/order/CouponResult';
import { applyCoupon } from '@service/couponService';
import { useCartStore } from '@state/cartStore';
import { EXTRACHARGES } from '@service/config';
import { useCouponStore } from '@state/couponStore';

const CouponSheet: FC<{ onClose: () => void }> = ({ onClose }) => {
    const bottomSheetRef = useRef(null);
    const [applying, setApplying] = useState(false);

    const snapPoints = useMemo(() => ['30%', '60%'], []);

    const { getTotalPrice } = useCartStore();
    const { setCoupon, appliedCoupon } = useCouponStore() as any;

    const cartTotal = getTotalPrice();

    const handleApply = async (code: string) => {
        try {
            setApplying(true);
            Keyboard.dismiss();
            const data = await applyCoupon(code, cartTotal + EXTRACHARGES);
            setCoupon(data);
            const timoutId = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timoutId);

        } catch (error) {
            console.log(error);
        } finally {
            setApplying(false);
        }
    }

    return (
        <>
            <StatusBar backgroundColor={'#00000049'} />
            <BottomSheet
                onClose={onClose}
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                enablePanDownToClose
                containerStyle={{ backgroundColor: '#00000049' }}>
                <BottomSheetView style={{ padding: 20 }}>
                    <CouponInput onApply={handleApply} loading={applying} />
                    <CouponResult />
                </BottomSheetView>
            </BottomSheet>
        </>
    );
};

export default CouponSheet;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
});
