import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Keyboard,
  Alert,
} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import ProductSlider from '@components/login/ProductSlider';
import {resetAndNavigate} from '@utils/NavigationUtils';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts, lightColors} from '@utils/Constants';
import CustomInput from '@components/ui/CustomInput';
import CustomButton from '@components/ui/CustomButton';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import {RFValue} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import {customerLogin} from '@service/authService';
import {useAuthStore} from '@state/authStore';

const bottomColors = [...lightColors].reverse();

const CustomerLogin: FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [gestureSequence, setGestureSequence] = useState<string[]>([]);
  const keyboardOffsetHeight = useKeyboardOffsetHeight();

  const {user, setUser} = useAuthStore();

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (keyboardOffsetHeight == 0) {
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
  }, [keyboardOffsetHeight]);

  const handleAuth = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const data = await customerLogin(phoneNumber);

      setUser(data.customer);

      resetAndNavigate('ProductDashboard');
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'Something went wrong during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGesture = ({nativeEvent}: any) => {
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

      if (newSequence.join(' ') === 'up up') {
        setGestureSequence([]);
        resetAndNavigate('DeliveryLogin');
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <CustomSafeAreaView>
          <ProductSlider />
          <PanGestureHandler onHandlerStateChange={handleGesture}>
            <Animated.ScrollView
              bounces={false}
              keyboardDismissMode={'on-drag'}
              keyboardShouldPersistTaps={'handled'}
              contentContainerStyle={styles.subContainer}
              style={{transform: [{translateY: animatedValue}]}}>
              <LinearGradient colors={bottomColors} style={styles.gradient} />
              <View style={styles.content}>
                <Image
                  source={require('@assets/appIcons/app_icon.jpg')}
                  style={styles.logo}
                />
                <CustomText variant="h2" fontFamily={Fonts.Bold} style={{textAlign : 'center'}} >
                 Your Everyday Grocery Partner
                </CustomText>
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.SemiBold}
                  style={styles.text}>
                  Log in or Sign Up
                </CustomText>

                <CustomInput
                  onChangeText={text => {
                    setPhoneNumber(text.slice(0, 10));
                  }}
                  onClear={() => {
                    setPhoneNumber('');
                  }}
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
                />
                <CustomButton
                  title="Continue"
                  disabled={phoneNumber?.length != 10}
                  onPress={() => handleAuth()}
                  loading={loading}
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
