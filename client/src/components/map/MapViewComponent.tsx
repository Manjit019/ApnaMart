import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MapView, {Polyline} from 'react-native-maps';
import {customMapStyle} from '@utils/CustomMap';
import Markers from './Markers';
import {getPoints} from '@utils/getPoints';
import { Colors } from '@utils/Constants';
import { GOOGLE_MAP_API } from '@service/config';

const MapViewComponent = ({
  mapRef,
  setMapRef,
  camera,
  hasAccepted,
  deliveryLocation,
  pickupLocation,
  deliveryPersonLocation,
  hasPickedUp,
}: any) => {
  return (
    <MapView
      ref={setMapRef}
      style={{flex: 1}}
      provider="google"
      camera={camera}
      customMapStyle={customMapStyle}
      showsUserLocation={true}
      userLocationCalloutEnabled={true}
      userLocationPriority="high"
      showsTraffic={false}
      pitchEnabled={false}
      followsUserLocation={true}
      showsCompass={true}
      showsBuildings={false}
      showsIndoors={false}
      showsScale={false}
      showsIndoorLevelPicker={false}>

      {/* { deliveryPersonLocation && (hasPickedUp || hasAccepted) && (
        //npm i react-native-maps-directions
        <MapViewDirections 
        origin={deliveryPersonLocation} 
        destination={hasAccepted ? pickupLocation : deliveryLocation}
        precision : "high",
        apiKey={GOOGLE_MAP_API}
        strokeColor="#2371f2"
        strokeWidth : {2}
        onError = {err => console.log(err)
        }
        />
      )} */}

      <Markers
        deliveryPersonLocation={deliveryPersonLocation}
        deliveryLocation={deliveryLocation}
        pickupLocation={pickupLocation}
      />
      {!hasPickedUp && deliveryLocation && pickupLocation && (
        <Polyline
          coordinates={getPoints([pickupLocation, deliveryLocation])}
          strokeColor={Colors.text}
          strokeWidth={2}
          geodesic = {true}
          lineDashPattern={[12,10]}
        />
      )}
    </MapView>
  );
};

export default MapViewComponent;

const styles = StyleSheet.create({});
