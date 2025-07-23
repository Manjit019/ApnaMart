import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Marker} from 'react-native-maps';

const Markers = ({
  deliveryLocation,
  pickupLocation,
  deliveryPersonLocation,
}: any) => {
  return (
    <>
      {deliveryLocation && (
        <Marker
          image={require('@assets/icons/my_pin.png')}
          coordinate={deliveryLocation}
          style={{height: 20, width: 20,}}
        />
      )}
      {pickupLocation && (
        <Marker
          image={require('@assets/icons/store.png')}
          coordinate={pickupLocation}
          style={{height: 20, width: 20,}}
        />
      )}
      {deliveryPersonLocation && (
        <Marker
          image={require('@assets/icons/delivery.png')}
          coordinate={deliveryPersonLocation}
          style={{height: 20, width: 20, position: 'absolute', zIndex: 55}}
        />
      )}
    </>
  );
};

export default Markers;

