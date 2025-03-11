import { StyleSheet } from "react-native";


export const hocStyle = StyleSheet.create({
    cartContainer : {
        position : 'absolute',
        bottom : 0,
        width : '100%',
        backgroundColor : '#fff',
        borderTopLeftRadius : 10,
        borderTopRightRadius : 10,
        elevation : 10,
        shadowOpacity  :0.3,
        shadowRadius : 5,
        shadowOffset : {height : 1,width : 1}
    }
})
