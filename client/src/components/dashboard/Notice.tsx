
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React, { FC } from 'react'
import { NoticeHeight } from '@utils/Scaling'
import CustomText from '@components/ui/CustomText'
import { Fonts } from '@utils/Constants'
import {Defs, G, Path, Svg, Use,} from 'react-native-svg'
import { wavyData } from '@utils/dummyData'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Notice:FC = () => {

     const insets = useSafeAreaInsets() ;

  return (
    <View style={{height : NoticeHeight,}}>
      <View style={[styles.container,{paddingTop : insets.top}]}>
            <View style={styles.noticeContainer}>
                <SafeAreaView>
                    <CustomText style={[styles.heading,styles.textCenter]} variant='h8' fontFamily={Fonts.SemiBold}>
                    The raining near this location.
                    </CustomText>
                    <CustomText style={styles.textCenter} variant='h9' fontFamily={Fonts.Medium}>
                        Our delivery partners may take longer to reach you.
                    </CustomText>
                </SafeAreaView>
            </View>
      </View>
      <Svg width='100%' height={35} fill='#ccd5e4' viewBox='0 0 4000 1000' preserveAspectRatio='none' style={styles.wave}>
        <Defs>
            <Path id='wavepath' d={wavyData} />
        </Defs>
        <G>
            <Use href='#wavepath' y={321} />
        </G>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor : '#ccd5e4',
    },
    noticeContainer : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    heading :{
        color  :'#2d3875',
        marginTop : 14
    },
    textCenter : {
        textAlign : 'center',
        marginBottom : 8,
    },
    wave : {
        width : '100%',
        transform : [{rotate : '180deg'}]
    }
    
})

export default Notice