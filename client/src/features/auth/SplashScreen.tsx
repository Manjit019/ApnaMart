import { View, StyleSheet, Image, Alert } from 'react-native';
import React, { FC, useEffect } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import { screenHeight, screenWidth } from '@utils/Scaling';
import Logo from '@assets/appIcons/app_icon.jpg';
import GeoLocation from '@react-native-community/geolocation';
import { useAuthStore } from '@state/authStore';
import { tokenStorage } from '@state/storage';
import { resetAndNavigate } from '@utils/NavigationUtils';
import {jwtDecode} from 'jwt-decode';
import { refetchUser, refresh_token } from '@service/authService';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';

GeoLocation.setRNConfiguration({
    skipPermissionRequests : false,
    authorizationLevel : 'always',
    enableBackgroundLocationUpdates : true,
    locationProvider : 'auto'
});

interface DecodedToken{
  exp:number;
}

const SplashScreen:FC = () => {

  const {user,setUser} = useAuthStore();

  const tokenCheck = async ()=>{

    const accessToken = tokenStorage.getString('accessToken') as string;
    const refreshToken = tokenStorage.getString('refreshToken') as string;

    // tokenStorage.clearAll();
    

    if(accessToken){
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);
      
      const currentTime = Date.now()/1000;  

      if(decodedRefreshToken?.exp < currentTime){
        resetAndNavigate("CustomerLogin");
        Alert.alert("Session Expired","Please Login again");
        return false;
      }
      if(decodedAccessToken?.exp < currentTime){
          try {
            refresh_token();
            await refetchUser(setUser);
          } catch (error) {
            Alert.alert("There was an error refreshing token!");
            return false;
          }
      }


      if(user?.role === "Customer"){
        resetAndNavigate("ProductDashboard");
      }else{
        resetAndNavigate("DeliveryDashboard");
      }

      return true;
    }

    resetAndNavigate("CustomerLogin");
    return false;
  }

  useEffect(() => {
    const fetchUserLocation = async ()=>{
      try {
        GeoLocation.requestAuthorization();
        tokenCheck();
      } catch (error) {
        Alert.alert("Sorry we need location service to give you better shopping experience");
      }
    }

    const timeoutId = setTimeout(fetchUserLocation, 1500);
  
    return () => {
      clearTimeout(timeoutId)
    }
  }, []);
  

  return (
    <View style={styles.container}> 
      {/* <Image source={Logo} style={styles.logoImage} /> */}
      <CustomText  fontFamily={Fonts.Bold} style={styles.appText}> Apna<CustomText variant='h1' fontFamily={Fonts.Bold} style={[styles.appText,{color : 'orange'}]}>Mart</CustomText></CustomText>
      <CustomText variant='h8' fontFamily={Fonts.Medium} style={{opacity : 0.8}} >Your Everyday Grocery Partner</CustomText>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor : Colors.primary_light,
        flex: 1,
        justifyContent : 'center',
        alignItems : 'center',
    },
    logoImage : {
        height:screenHeight * 0.7,
        width :screenWidth * 0.7,
        resizeMode : 'contain',
    },
    appText : {
      color : '#000',
      fontSize : RFValue(45)
    }
});

export default SplashScreen;
