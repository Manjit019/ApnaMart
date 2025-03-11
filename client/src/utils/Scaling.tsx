import { Dimensions, Platform } from "react-native";

export const screenWidth:number = Dimensions.get('window').width
export const screenHeight:number = Dimensions.get('window').height

export const NoticeHeight = Platform.OS === 'ios' ? screenHeight*0.12 : screenHeight*0.07;