import { GOOGLE_MAP_API } from '@service/config';
import axios from 'axios';

export const reverseGeocode = async (latitude:any, longitude:any, setUser ?: any) => {
  
  try {
    const apiKey = GOOGLE_MAP_API;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    if (response.data.results.length > 0) {
      const address = response.data.results[0].formatted_address;
      return address;
    } else {
      console.warn('No address found for this location');
      return '';
    } 
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
  }
};


