import { Colors, Fonts } from "@utils/Constants";
import { FC } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Icon from 'react-native-vector-icons/Ionicons'
import CustomText from "./CustomText";

interface InputProps{
    left:React.ReactNode;
    onClear?:()=>void;
    right?:boolean;
    rightIcon?:string;
}``

const CustomInput:FC<InputProps & React.ComponentProps<typeof TextInput>> = ({
    onClear,
    left,
    right,
    rightIcon = 'close-circle-sharp',
   ...props
}) =>{

    return (
        <View style={styles.flexRow}>
            {left}
            <TextInput {...props} style={styles.inputContainer}  placeholderTextColor={'#ccc'} />
            <View style={styles.icon}>
                    {props.value?.length != 0 && right && 
                        <TouchableOpacity onPress={onClear}>
                            <Icon name={rightIcon} size={RFValue(16)} color='#ccc' />
                    </TouchableOpacity>
                 } 
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text : {
        width : '10%',
        marginLeft : 10
    },
    flexRow :{
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
        borderRadius : 12,
        borderWidth : 0.5,
        marginVertical : 10,
        marginBottom : 20,
        backgroundColor : '#fff',
        shadowOffset : ({width : 0.5, height : 0.5}),
        shadowOpacity : 0.6,
        shadowRadius : 2,
        shadowColor : Colors.border,
        borderColor : Colors.border,
        width : '100%',
    },
    inputContainer : {
        width : '75%',
        fontFamily : Fonts.SemiBold,
        fontSize : RFValue(12),
        paddingVertical : 14,
        paddingBottom : 15,
        height : '100%',
        color: Colors.text,
        bottom : -1,
    },
    icon : {
        width : '5%',
        justifyContent : 'center',
        alignItems : 'center',
        marginLeft : 10,
    }
})


export default CustomInput;