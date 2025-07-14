import { Alert, Modal, NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputKeyPressEventData, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomButton from '@components/ui/CustomButton';

interface OtpModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (code: string) => void;
    isVerified: boolean;
    onResend: () => void;
}

const OtpModal: FC<OtpModalProps> = ({ isVisible, onClose, onConfirm, isVerified, onResend }) => {

    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [otp, setOtp] = useState<any[]>(new Array(6).fill(''));
    const inputRefs = useRef<any>([]);

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];

        if (text === '') {
            newOtp[index] = '';
            setOtp(newOtp);

            if (index > 0) {
                setTimeout(() => inputRefs.current[index - 1]?.focus(), 10);
            }
            return
        }

        if (/^\d$/.test(text)) {
            newOtp[index] = text;
            setOtp(newOtp);
            if (index < 5) {
                setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
            }
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        const code = otp.join('');
        if (code.length < 6) return;
        onConfirm(code);
    }

    useEffect(() => {
        if (isVisible) {
            startTimer();
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isVisible]);

    const startTimer = () => {
        setResendTimer(30);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setResendTimer((prev) => {
                if (prev === 1 && timerRef.current) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <Modal visible={isVisible} onRequestClose={onClose} animationType="slide" statusBarTranslucent presentationStyle='formSheet' style={styles.container} backdropColor={'rgba(0, 0, 0, 0.24)'} >
            <View style={styles.modalContainer}>
                <CustomText variant='h5' fontFamily={Fonts.Bold} >Enter OTP</CustomText>
                <CustomText variant='h7' style={{ opacity: 0.7, marginVertical: 3, width: '87%' }}>We have sent you a OTP to your phone number.</CustomText>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => inputRefs.current[index] = ref}
                            value={digit}
                            onChangeText={text => handleChange(text, index)}
                            maxLength={1}
                            keyboardType='number-pad'
                            style={[styles.input, isVerified ? { borderColor: 'green', borderWidth: 1.4 } : { borderColor: Colors.border }]}
                        // onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
                        //     console.log(e);

                        //     if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
                        //         inputRefs.current[index - 1]?.focus();
                        //     }
                        // }}
                        />
                    ))}
                </View>

                <CustomButton title={!isVerified ?( loading ? "Verifying.." : "Verify OTP") : "Signing in..."} loading={loading} disabled={loading || otp.join().length < 6} onPress={handleVerify} />

                <View style={styles.resendContainer}>
                    <CustomText variant="body">
                        Didn't receive the code?{' '}
                    </CustomText>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => {
                        if (resendTimer === 0) {
                            console.log('Resending OTP...');
                            onResend();
                            startTimer();
                        }
                    }}>
                        <CustomText
                            variant="body"
                            style={{
                                color: resendTimer === 0 ? Colors.primary : 'gray',
                                textDecorationLine: resendTimer === 0 ? 'underline' : 'none',
                            }}
                        >
                            {resendTimer === 0 ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                        </CustomText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default OtpModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.24)',
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        bottom: 0,
        position: 'absolute',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 6,
        paddingHorizontal: 8,
        paddingVertical: 10,
        marginBottom: 16,

    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        width: 50,
        height: 50,
        fontSize: RFValue(18),
        textAlign: 'center',
        fontFamily: Fonts.Bold
    },
    resendContainer: {
        alignItems: 'center',
        marginVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
    },
})