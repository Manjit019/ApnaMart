import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { FC, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts } from '@utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomInput from '@components/ui/CustomInput';
import { TextInput } from 'react-native-gesture-handler';
import RollingBar from 'react-native-rolling-bar';
import CustomText from '@components/ui/CustomText';
import { navigate } from '@utils/NavigationUtils';

const SearchBar: FC<{ query: string, onSetQuery: any, onClear: () => void }> = ({ onSetQuery, query, onClear }) => {

    // const [query, setQuery] = useState('');


    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() => navigate('SearchScreen')} >
            <Icon name="search" color={'#aaa'} size={RFValue(20)} />
            <TextInput
                placeholder='Search'
                placeholderTextColor={Colors.disabled}
                style={styles.inputContainer}
                value={query}
                onChangeText={onSetQuery}
            />
            <View style={styles.divider} />

            {query?.length > 0 ? (
                <Icon name='close-circle-sharp' color={Colors.text} size={RFValue(20)} onPress={onClear} />
            ) : (
                <Icon name="mic" color={Colors.text} size={RFValue(20)} />
            )}

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginInline: 10,
        paddingVertical: 6,
        paddingInline: 14,
        backgroundColor: '#fff',
        borderRadius: 56,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 55,
        borderColor: Colors.border,
        borderWidth: 1,
        overflow: 'hidden'
    },
    inputContainer: {
        width: '70%',
        fontFamily: Fonts.Medium,
        fontSize: RFValue(13),
        color: Colors.text,
    },
    textContainer: {
        width: '90%',
        color: 'f6f6f6',
    },
    divider: {
        height: '70%',
        width: 1,
        backgroundColor: Colors.border,
        marginInline: 10,
        opacity: 0.4,
    },
});

export default SearchBar;
