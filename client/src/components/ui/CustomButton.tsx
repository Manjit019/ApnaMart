import { Colors, Fonts } from "@utils/Constants";
import { ActivityIndicator, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import CustomText from "./CustomText";

interface CustomButtonProps{
    onPress : () => void;
    title : string;
    disabled : boolean;
    loading : boolean;
    customStyle?:ViewStyle;
}


const CustomButton : React.FC<CustomButtonProps> = ({ onPress, title, disabled, loading ,customStyle}) => {
    return (
        <TouchableOpacity style={[styles.button,{
            backgroundColor : disabled ? Colors.disabled : Colors.secondary
        },customStyle]} onPress={onPress} disabled={disabled} activeOpacity={0.8}>

        { loading ? <ActivityIndicator size='small' color='white' /> : 
        <CustomText variant="h6" fontFamily={Fonts.SemiBold} style={styles.text}> {title}</CustomText>
        }

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button : {
        justifyContent : 'center',
        alignItems : 'center',
        padding : 15,
        borderRadius : 10,
        width : '100%',
    },
    text : {
        color : 'white'
    }
})

export default CustomButton;