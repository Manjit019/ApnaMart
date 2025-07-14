import { View, Text, Animated } from 'react-native'
import React, { FC } from 'react'
import { useCollapsibleContext } from '@r0b0t3d/react-native-collapsible'
import { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Header from '@components/dashboard/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedHeader:FC<{showNotice:()=>void}> = ({showNotice}) => {

    const {scrollY} = useCollapsibleContext();
     const insets = useSafeAreaInsets() ;

    const headerAnimatedStyle = useAnimatedStyle(()=>{
        const opacity = interpolate(
            scrollY.value,
            [0,120],
            [1,0]
        )
        return {opacity}
    })

  return (
    <Animated.View style={[headerAnimatedStyle,{paddingTop : insets.top}]}>
      <Header showNotice={showNotice} />
    </Animated.View>
  )
}

export default AnimatedHeader