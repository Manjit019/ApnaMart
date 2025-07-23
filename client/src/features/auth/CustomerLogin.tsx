import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Keyboard,
  Alert,
  StatusBar,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {FC, useEffect, useRef, useState, useCallback} from 'react';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import ProductSlider from '@components/login/ProductSlider';
import {navigate, resetAndNavigate} from '@utils/NavigationUtils';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts, lightColors} from '@utils/Constants';
import CustomInput from '@components/ui/CustomInput';
import CustomButton from '@components/ui/CustomButton';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import {RFValue} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import {customerLogin} from '@service/authService';
import {useAuthStore} from '@state/authStore';
import OtpModal from '@components/login/OtpModal';
import auth from '@react-native-firebase/auth';
import Geolocation from '@react-native-community/geolocation';
import {requestLocationPermission} from '@utils/permissions';

const bottomColors = [...lightColors].reverse();

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const CustomerLogin: FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);

  const [gestureSequence, setGestureSequence] = useState<string[]>([]);
  const keyboardOffsetHeight = useKeyboardOffsetHeight();

  const {user, setUser} = useAuthStore();

  const animatedValue = useRef(new Animated.Value(0)).current;

  // Keyboard animation
  useEffect(() => {
    if (keyboardOffsetHeight === 0) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: -keyboardOffsetHeight * 0.84,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [keyboardOffsetHeight, animatedValue]);

  const requestLocationAndGetPosition = useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermission();
      setLocationPermissionGranted(hasPermission);

      if (!hasPermission) {
        console.log('Location permission denied');
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude, accuracy} = position.coords;
          const locationData: LocationData = {latitude, longitude, accuracy};
          setUserLocation(locationData);
          const currentUser = useAuthStore.getState().user;
          useAuthStore.getState().setUser({
            ...currentUser,
            location: locationData,
          });
        },
        error => {
          console.error('Error getting location:', error);
          switch (error.code) {
            case 1:
              ToastAndroid.show(
                'Location permission denied',
                ToastAndroid.SHORT,
              );
              break;
            case 2:
              ToastAndroid.show('Location unavailable', ToastAndroid.SHORT);
              break;
            case 3:
              ToastAndroid.show('Location request timeout', ToastAndroid.SHORT);
              break;
            default:
              ToastAndroid.show('Unknown location error', ToastAndroid.SHORT);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000, // 5 minutes
        },
      );
    } catch (error) {
      console.error('Error requesting location:', error);
    }
  }, [setUser]);

  useEffect(() => {
    requestLocationAndGetPosition();
  }, [requestLocationAndGetPosition]);

  const sendOtp = useCallback(async () => {
    Keyboard.dismiss();
    setLoading(true);

    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number.',
      );
      setLoading(false);
      return;
    }

    try {
      const confirmation = await auth().signInWithPhoneNumber(
        `+91${phoneNumber}`,
      );
      console.log('OTP sent successfully');
      setConfirm(confirmation);
      setModalVisible(true);
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      let errorMessage = 'Failed to send OTP';
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format.';
      }

      if (Platform.OS === 'android') {
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [phoneNumber]);

  const verifyOTP = useCallback(
    async (code: string) => {
      if (code.length !== 6) return;

      try {
        if (!confirm) {
          throw new Error('No confirmation object available');
        }

        await confirm.confirm(code);
        setIsOtpVerified(true);
        return true;
      } catch (error: any) {
        console.error('OTP Verification Failed:', error);

        let errorMessage = 'Invalid OTP. Please try again.';
        if (error.code === 'auth/invalid-verification-code') {
          errorMessage = 'Invalid verification code.';
        } else if (error.code === 'auth/code-expired') {
          errorMessage = 'Verification code has expired.';
        }

        Alert.alert('Verification Failed', errorMessage);
        return false;
      }
    },
    [confirm],
  );

  const handleLogin = useCallback(async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number.',
      );
      return;
    }
    setLoading(true);
    try {
      const loginData = await customerLogin(
        phoneNumber,
        isOtpVerified,
        userLocation,
      );

      if (!loginData) {
        throw new Error('Login failed - no data received');
      }
      if (loginData.phoneVerified && loginData.customer) {
        console.log('User already verified, logging in directly');
        setUser(loginData.customer);

        if (loginData.customer.name === 'User' || !loginData.customer.address) {
          console.log("User hasn't completed profile");
          navigate('CompleteProfile');
          return;
        }
        resetAndNavigate('ProductDashboard');
        return;
      }

      if (!loginData.phoneVerified) {
        console.log('Phone verification required, sending OTP');
        setIsOtpVerified(false);
        await sendOtp();
        return;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please try again.';
      Alert.alert('Login Failed', errorMessage);
      setIsOtpVerified(false);
      setModalVisible(false);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, isOtpVerified, userLocation, sendOtp, setUser]);


  const handlePostOtpLogin = useCallback(async () => {
    setLoading(true);
    try {
      const loginData = await customerLogin(
        phoneNumber,
        true,
        userLocation,
      );

      if (!loginData || !loginData.customer) {
        throw new Error('Login failed after OTP verification');
      }

      setUser(loginData.customer);
      if (loginData.customer.name === 'User' || !loginData.customer.address) {
        console.log("User hasn't completed profile");
        setModalVisible(false);
        navigate('CompleteProfile');
        return;
      }
      setModalVisible(false);
      resetAndNavigate('ProductDashboard');
    } catch (error: any) {
      console.error('Post-OTP login error:', error);
      Alert.alert(
        'Login Failed',
        'Failed to complete login after verification',
      );
      setModalVisible(false);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, userLocation, setUser]);

  const handleGesture = useCallback(
    ({nativeEvent}: any) => {
      if (nativeEvent.state === State.END) {
        const {translationX, translationY} = nativeEvent;

        let direction = '';
        if (Math.abs(translationX) > Math.abs(translationY)) {
          direction = translationX > 0 ? 'right' : 'left';
        } else {
          direction = translationY > 0 ? 'down' : 'up';
        }

        const newSequence = [...gestureSequence, direction].slice(-5);
        setGestureSequence(newSequence);

        if (newSequence.join(' ') === 'down down left right up') {
          setGestureSequence([]);
          resetAndNavigate('DeliveryLogin');
        }
      }
    },
    [gestureSequence],
  );

  const handlePhoneNumberChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
  }, []);

  const handleClearPhone = useCallback(() => {
    setPhoneNumber('');
  }, []);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setIsOtpVerified(false);
    setConfirm(null);
  }, []);

  const handleOtpConfirm = useCallback(
    async (code: string) => {
      const verified = await verifyOTP(code);
      if (verified) {
        await handlePostOtpLogin();
      }
    },
    [verifyOTP, handlePostOtpLogin],
  );

  const handleResendOtp = useCallback(async () => {
    await sendOtp();
  }, [sendOtp]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        backgroundColor="#ffffff"
        barStyle="dark-content"
        translucent={false}
      />
      <View style={styles.container}>
        <CustomSafeAreaView>
          <ProductSlider />
          <PanGestureHandler onHandlerStateChange={handleGesture}>
            <Animated.ScrollView
              bounces={false}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.subContainer}
              style={{transform: [{translateY: animatedValue}]}}>
              <LinearGradient colors={bottomColors} style={styles.gradient} />

              <View style={styles.content}>
                <Image
                  source={require('@assets/appIcons/app_icon.jpg')}
                  style={styles.logo}
                />
                <CustomText
                  variant="h2"
                  fontFamily={Fonts.Bold}
                  style={styles.title}>
                  Your Everyday Grocery Partner
                </CustomText>

                <CustomText
                  variant="h5"
                  fontFamily={Fonts.SemiBold}
                  style={styles.text}>
                  Log in or Sign Up
                </CustomText>

                <CustomInput
                  onChangeText={handlePhoneNumberChange}
                  onClear={handleClearPhone}
                  value={phoneNumber}
                  left={
                    <CustomText
                      style={styles.phoneText}
                      variant="h6"
                      fontFamily={Fonts.SemiBold}>
                      +91
                    </CustomText>
                  }
                  placeholder="Enter Mobile Number"
                  inputMode="numeric"
                  right={true}
                  keyboardType="phone-pad"
                  maxLength={10}
                />

                <CustomButton
                  title={'Continue'}
                  disabled={phoneNumber?.length !== 10 || loading}
                  onPress={handleLogin}
                  loading={loading}
                  loadingText='Please wait...'
                />
              </View>
            </Animated.ScrollView>
          </PanGestureHandler>
        </CustomSafeAreaView>

        <View style={styles.footer}>
          <CustomText fontSize={RFValue(6)}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </CustomText>
        </View>
      </View>

      <OtpModal
        isVisible={modalVisible}
        onClose={handleModalClose}
        onConfirm={handleOtpConfirm}
        isVerified={isOtpVerified}
        onResend={handleResendOtp}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logo: {
    height: 50,
    width: 50,
    borderRadius: 20,
    marginVertical: 10,
  },
  title: {
    textAlign: 'center',
    marginVertical: 10,
  },
  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.7,
  },
  phoneText: {
    paddingLeft: 10,
    paddingRight: 6,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F2FC',
    padding: 10,
    borderTopWidth: 0.5,
    borderColor: Colors.border,
  },
  gradient: {
    paddingTop: 60,
    width: '100%',
  },
});

export default CustomerLogin;
