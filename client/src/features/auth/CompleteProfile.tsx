import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import CustomInput from '@components/ui/CustomInput';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '@components/ui/CustomButton';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import {refetchUser, refresh_token, updateUser} from '@service/authService';
import {resetAndNavigate} from '@utils/NavigationUtils';
import {useAuthStore} from '@state/authStore';

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    pincode: '',
    state: '',
    city: '',
    house: '',
    area: '',
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {setUser} = useAuthStore();

  const fetchAddressByPin = async (pincode: string) => {
    if (pincode.length != 6) return;
    setLoading(true);
    setError('');
    try {
      const {data} = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      if (data[0].Status === 'Success') {
        const postOffices = data[0].PostOffice;
        const uniqueStates: any = [
          ...new Set(postOffices.map((office: any) => office.State)),
        ];
        const uniqueCities: any = [
          ...new Set(postOffices.map((office: any) => office.District)),
        ];

        setStates(uniqueStates);
        setCities(uniqueCities);
        setFormData(prev => ({
          ...prev,
          state: uniqueStates[0] || '',
          city: uniqueCities[0] || '',
        }));
      } else {
        setError('Invalid Pincode or no data available');
      }
    } catch (error) {
      setError('Failed to fetch address details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const isFormIncomplete = Object.values(formData).some(value => !value.trim());

  const handleCompleteProfile = async () => {
    const address = `${formData.house},${formData.area},${formData.city},${formData.state},${formData.pincode}`;
    const formatData = {
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      address: address.trim(),
    };
    setIsSubmitting(true);
    try {
      const data = await updateUser(formatData);
      if (data.success) {
        try {
          refresh_token();
          await refetchUser(setUser);
        } catch (error) {
          Alert.alert('There was an error refreshing token!');
          return false;
        } finally {
          resetAndNavigate('ProductDashboard');
        }
      }
    } catch (error) {
      console.log('Error Updating User.');
      Alert.alert('Something went wrong!', 'Please try again later or skip.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <StatusBar
        backgroundColor={Colors.backgroundSecondary}
        barStyle="dark-content"
        translucent={false}
      />
      <View style={styles.flexRowBetween}>
        <CustomText
          variant="h1"
          fontFamily={Fonts.SemiBold}
          style={{width: '50%'}}>
          Complete Your Profile
        </CustomText>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => resetAndNavigate('ProductDashboard')}>
          <CustomText>Skip</CustomText>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <CustomInput
          value={formData.fullName}
          onChangeText={text => handleInputChange('fullName', text)}
          placeholder="Full Name"
          inputMode="text"
          left={
            <Icon
              name="person-outline"
              color="#a5a555"
              size={RFValue(18)}
              style={{marginRight: 10}}
            />
          }
          right
          onClear={() => setFormData(prev => ({...prev, fullName: ''}))}
        />

        <CustomInput
          onChangeText={text => handleInputChange('email', text)}
          value={formData.email}
          placeholder="Email"
          inputMode="email"
          left={
            <Icon
              name="mail-outline"
              color="#a5a555"
              size={RFValue(18)}
              style={{marginRight: 10}}
            />
          }
          right
          onClear={() => setFormData(prev => ({...prev, email: ''}))}
        />
        <View style={[styles.addressContainer]}>
          <View style={[styles.flexRowBetween, {paddingHorizontal: 0}]}>
            <CustomInput
              value={formData.pincode}
              onChangeText={text => handleInputChange('pincode', text)}
              onBlur={() => fetchAddressByPin(formData.pincode)}
              placeholder="PinCode "
              inputMode="decimal"
              keyboardType="numeric"
              maxLength={6}
              left={
                <Icon
                  name="location-outline"
                  color="#a5a555"
                  size={RFValue(18)}
                  style={{marginRight: 10}}
                />
              }
              right={false}
              onClear={() => setFormData(prev => ({...prev, pincode: ''}))}
              style={{width: '49%', paddingLeft: 15}}
            />
            <View style={[styles.dropdownContainer, {width: '48%'}]}>
              <Icon
                name="location-outline"
                size={RFValue(18)}
                color="#a5a555"
              />
              <Picker
                selectedValue={formData.state}
                onValueChange={value => handleInputChange('state', value)}
                style={styles.picker}
                dropdownIconColor="#a5a555">
                <Picker.Item
                  label="State"
                  value=""
                  style={{fontWeight: 'bold'}}
                />
                {states?.map((state, i) => (
                  <Picker.Item
                    key={`state-${i}`}
                    label={state}
                    value={state}
                    style={{fontWeight: 'bold'}}
                  />
                ))}
              </Picker>
            </View>
          </View>
          {error && (
            <CustomText
              variant="h7"
              style={{color: 'red', marginTop: -16, paddingBottom: 8}}>
              {error}
            </CustomText>
          )}
          <View style={styles.dropdownContainer}>
            <Icon name="location-outline" size={RFValue(18)} color="#a5a555" />
            <Picker
              selectedValue={formData.city}
              onValueChange={value => handleInputChange('city', value)}
              style={styles.picker}
              dropdownIconColor="#a5a555">
              <Picker.Item
                label="Select District"
                value=""
                style={{fontWeight: 'bold'}}
              />
              {cities?.map((city, i) => (
                <Picker.Item
                  key={`city-${i}`}
                  label={city}
                  value={city}
                  style={{fontWeight: 'bold'}}
                />
              ))}
            </Picker>
          </View>
          <CustomInput
            value={formData.area}
            onChangeText={text => handleInputChange('area', text)}
            placeholder="Address Line 1"
            inputMode="text"
            left={
              <Icon
                name="location-outline"
                color="#a5a555"
                size={RFValue(18)}
                style={{marginRight: 10}}
              />
            }
            right
            onClear={() => setFormData(prev => ({...prev, area: ''}))}
          />
          <CustomInput
            value={formData.house}
            onChangeText={text => handleInputChange('house', text)}
            placeholder="Address line 2"
            inputMode="text"
            left={
              <Icon
                name="location-outline"
                color="#a5a555"
                size={RFValue(18)}
                style={{marginRight: 10}}
              />
            }
            right
            onClear={() => setFormData(prev => ({...prev, house: ''}))}
          />
        </View>
        {loading && (
          <ActivityIndicator
            size="small"
            color={Colors.primary}
            style={{position: 'absolute', top: '50%', left: '50%'}}
          />
        )}

        <View style={{marginTop: 30, width: '100%'}}>
          <CustomButton
            disabled={isSubmitting || isFormIncomplete}
            loading={isSubmitting}
            onPress={handleCompleteProfile}
            title="Continue"
          />
          <CustomText
            fontSize={RFValue(6)}
            style={{textAlign: 'center', marginTop: 20}}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </CustomText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 30,
    flexGrow: 1,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  addressContainer: {},
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 0.5,
    marginVertical: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.6,
    shadowRadius: 2,
    shadowColor: Colors.border,
    borderColor: Colors.border,
    width: '100%',
    paddingHorizontal: 24,
  },
  picker: {
    width: '100%',
    backgroundColor: '#fff',
    color: Colors.text,
    fontFamily: Fonts.SemiBold,
  },
});
