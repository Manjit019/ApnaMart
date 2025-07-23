import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useEffect} from 'react';
import {screenHeight} from '@utils/Scaling';
import {Colors} from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {handleFitToPath} from '@components/map/mapUtils';
import {useMapRefStore} from '@state/mapStore';
import MapViewComponent from '@components/map/MapViewComponent';

interface LiveMapProps {
  deliveryLocation: any;
  pickupLocation: any;
  deliveryPersonLocation: any;
  hasAccepted: boolean;
  hasPickedUp: boolean;
}

const LiveMap: FC<LiveMapProps> = ({
  deliveryLocation,
  deliveryPersonLocation,
  hasAccepted,
  hasPickedUp,
  pickupLocation,
}) => {
  const {mapRef, setMapRef} = useMapRefStore();

  useEffect(() => {
    if (mapRef) {
      handleFitToPath(
        mapRef,
        deliveryLocation,
        pickupLocation,
        hasPickedUp,
        hasAccepted,
        deliveryPersonLocation,
      );
    }
  }, [  mapRef,
    deliveryLocation,
    hasPickedUp,
    hasAccepted,
    deliveryPersonLocation]);

  return (
    <View style={styles.container}>
      <MapViewComponent
        mapRef={mapRef}
        setMapRef={setMapRef}
        hasAccepted={hasAccepted}
        deliveryLocation={deliveryLocation}
        pickupLocation={pickupLocation}
        deliveryPersonLocation={deliveryPersonLocation}
        hasPickedUp={hasPickedUp}
        
      />

      <TouchableOpacity
        style={styles.flexButton}
        onPress={() => {
          handleFitToPath(
            mapRef,
            deliveryLocation,
            pickupLocation,
            hasPickedUp,
            hasAccepted,
            deliveryPersonLocation,
          );
        }}>
        <Icon name="target" size={RFValue(30)} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
};

export default LiveMap;

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.35,
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  flexButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 0.7,
    borderColor: Colors.border,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    elevation: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
