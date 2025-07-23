import axios from 'axios';
import {BASE_URL} from './config';
import {tokenStorage} from '@state/storage';
import {useAuthStore} from '@state/authStore';
import { resetAndNavigate } from '@utils/NavigationUtils';
import { appAxios } from './apiInterceptors';


export const customerLogin = async (phone: string,isPhoneVerified : boolean,liveLocation ?: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/customer/login`, { phone , isPhoneVerified ,liveLocation });
    
    const {accessToken, refreshToken, customer} = response.data;
    
    tokenStorage.set('accessToken', accessToken);
    tokenStorage.set('refreshToken', refreshToken);

    return response.data;

  } catch (err) {
    console.log('Login Error', err);
  }
};




export const refresh_token = async () => {
    try {

        const refreshToken = tokenStorage.getString('refreshToken');


      const response = await axios.post(`${BASE_URL}/refresh-token`, {refreshToken});

      const new_access_token = response.data.accessToken;
      const new_refresh_token = response.data.refreshToken;

      tokenStorage.set('accessToken', new_access_token);
      tokenStorage.set('refreshToken', new_refresh_token);

      return new_access_token;

    } catch (error) {
      console.log('Refresh Token Error!', error);
      tokenStorage.clearAll();
      resetAndNavigate("CustomerLogin");
    }
  };

  


  export const refetchUser = async (setUser:any) => {
    try {
      const response = await appAxios.get('/user');
      setUser(response.data.user);

    } catch (error) {
      console.error('Refetch User Error!');
    }
  };


  //Delivery Login 

  export const deliveryLogin = async (email: string,password : string) => {
    try {
      const response = await axios.post(`${BASE_URL}/delivery/login`, { email,password });
      
      const {accessToken, refreshToken, deliveryPartner} = response.data;
      
      tokenStorage.set('accessToken', accessToken);
      tokenStorage.set('refreshToken', refreshToken);
  
      return response.data;
  
    } catch (err) {
      console.log('Login Error', err);
    }
  };
  

  export const updateUser = async (formData : any) => {

      try {
        const res = await appAxios.patch(`${BASE_URL}/user`,formData);
        return res.data;
      } catch (error) {
        console.log("Error Updating user");
        return null
      }
  }