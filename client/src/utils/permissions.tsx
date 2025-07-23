import { PermissionsAndroid, Platform } from "react-native";


export async function requestLocationPermission() {
    
    if(Platform.OS === 'android'){
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
            title : 'Location Permission',
             message : 'ApnaMart needs access to your location.',
             buttonNeutral : "Ask Me Later",
             buttonNegative : 'Cancel',
             buttonPositive : 'OK',
        });

        return granted === PermissionsAndroid.RESULTS.GRANTED;
    };

    return true;
}