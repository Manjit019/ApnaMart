import {View, Text, Alert, StyleSheet} from 'react-native';
import React, {FC, useState} from 'react';
import {resetAndNavigate} from '@utils/NavigationUtils';
import {deliveryLogin} from '@service/authService';
import {useAuthStore} from '@state/authStore';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import {ScrollView} from 'react-native-gesture-handler';
import {screenHeight} from '@utils/Scaling';
import LottieView from 'lottie-react-native';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import CustomInput from '@components/ui/CustomInput';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomButton from '@components/ui/CustomButton';

const DeliveryLogin: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(true);

  const {user, setUser} = useAuthStore();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await deliveryLogin(email, password);
      setUser(data.deliveryPartner);
      resetAndNavigate('DeliveryDashboard');
    } catch (error) {
      Alert.alert('Login Failed!');
    } finally { 
      setLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <View style={styles.container}>
          <View style={styles.lottieContainer}>
            <LottieView
              autoPlay
              loop
              style={styles.lottie}
              source={require('@assets/animations/delivery_man.json')}
            />
          </View>
          <CustomText variant="h3" fontFamily={Fonts.Bold}>
            Delivery Partner Portal
          </CustomText>
          <CustomText
            variant="h7"
            fontFamily={Fonts.SemiBold}
            style={styles.text}>
            Faster than flash
          </CustomText>

          <CustomInput
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            inputMode="email"
            left={
              <Icon
                name="mail"
                color="#f8890E"
                size={RFValue(18)}
                style={{marginRight: 10}}
              />
            }
            right
            onClear={()=>setEmail('')}
          />
           <CustomInput
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={isEyeOpen}
            left={
              <Icon
                name="key"
                color="#f8890E"
                size={RFValue(18)}
                style={{marginRight: 10}}
              />
            }
            right
            rightIcon={!isEyeOpen ? 'eye-off' : 'eye'}
            onClear={()=> setIsEyeOpen(!isEyeOpen)}

          />

          <CustomButton disabled={email.length ==0 || password.length<8} title='Login' onPress={handleLogin} loading={loading} customStyle={{marginTop : 75}} />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  lottie: {
    height: '100%',
    width: '100%',
  },
  lottieContainer: {
    height: screenHeight * 0.25,
    width: '100%',
  },
  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.8,
  },
});

export default DeliveryLogin;
