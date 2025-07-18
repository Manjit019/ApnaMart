import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
// import SplashScreen from '@features/auth/SplashScreen';
import SplashScreen from '../features/auth/SplashScreen';
import { navigationRef } from '@utils/NavigationUtils';
import DeliveryLogin from '@features/auth/DeliveryLogin';
import CustomerLogin from '@features/auth/CustomerLogin';
import ProductDashboard from '@features/dashboard/ProductDashboard';
import DeliveryDashboard from '@features/delivery/DeliveryDashboard';
import ProductCategory from '@features/category/ProductCategory';
import ProductOrder from '@features/order/ProductOrder';
import OrderSuccess from '@features/order/OrderSuccess';
import LiveTracking from '@features/map/LiveTracking';
import ProfileScreen from '@features/profile/ProfileScreen';
import DeliveryMap from '@features/delivery/DeliveryMap';
import CompleteProfile from '@features/auth/CompleteProfile';
import SearchScreen from '@features/search/SearchScreen';
import ProductDetailScreen from '@features/category/ProductDetailScreen';

const Stack = createNativeStackNavigator();

const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}  >
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen}
          options={{ navigationBarHidden: true }} />

        <Stack.Screen name="ProductDashboard" component={ProductDashboard}
          options={{ navigationBarHidden: true }} />

        <Stack.Screen name="DeliveryDashboard" component={DeliveryDashboard}
          options={{ navigationBarHidden: true }} />

        <Stack.Screen name="ProductCategory" component={ProductCategory}
          options={{ navigationBarHidden: true }} />

          <Stack.Screen name="ProductDetails" component={ProductDetailScreen}
          options={{ navigationBarHidden: true }} />

        <Stack.Screen name="SearchScreen" component={SearchScreen}
          options={{ navigationBarHidden: true }} />

        <Stack.Screen name="ProductOrder" component={ProductOrder}
          options={{ navigationBarHidden: true }} />

        <Stack.Screen name="OrderSuccess" component={OrderSuccess}
          options={{ navigationBarHidden: true }} />

        <Stack.Screen name="LiveTracking" component={LiveTracking}
          options={{ navigationBarHidden: true }} />

        <Stack.Screen name="ProfileScreen" component={ProfileScreen}
          options={{ navigationBarHidden: true }} />

        <Stack.Screen name="DeliveryMap" component={DeliveryMap}
          options={{ navigationBarHidden: true }} />

        <Stack.Screen
          options={{
            animation: 'fade',
            navigationBarHidden: true
          }}
          name="DeliveryLogin"
          component={DeliveryLogin}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
            navigationBarHidden: true
          }}
          name="CustomerLogin"
          component={CustomerLogin}
        />
        <Stack.Screen
          options={{
            animation: 'ios_from_right',
            navigationBarHidden: true
          }}
          name="CompleteProfile"
          component={CompleteProfile}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
