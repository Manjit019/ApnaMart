import { View, Text,  StyleSheet, Image } from 'react-native'
import React, { FC } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { darkWeatherColors, sunnyWeatherColors } from '@utils/Constants'
import { screenHeight, screenWidth } from '@utils/Scaling'
import LottieView from 'lottie-react-native'
import { useCollapsibleContext } from '@r0b0t3d/react-native-collapsible'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Visuals:FC = () => {

    const {scrollY} = useCollapsibleContext();

    const headerAnimatedStyle = useAnimatedStyle(()=> {
        const opacity = interpolate(scrollY.value,[0,80],[1,0]);

        return {opacity}
    })

  return (
    <Animated.View style={[styles.container,headerAnimatedStyle]}>
       <LinearGradient colors={darkWeatherColors} style={styles.gradient} />
       <Image source={require('@assets/images/cloud.png')} style={styles.cloud} />
       <LottieView autoPlay enableMergePathsAndroidForKitKatAndAbove loop style={styles.lottie} source={require('@assets/animations/raining.json')} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
    container : {
        // width : '100%',
        position : 'absolute',
    },
    lottie : {
        width : '100%',
        height : 140,
        position : 'absolute',
        transform  :[{scaleX : -1}]
    },
    gradient : {
        width : '100%',
        height : screenHeight*0.3,
        position : 'absolute',

    },
    cloud : {
        width : screenWidth,
        resizeMode : 'stretch',
        height : 100
    },
    sunLottie : {
        width : 170,
        height : 170,
        position : 'absolute',
        right : 40,
        top : 0
    }
})

export default Visuals