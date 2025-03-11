import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {hocStyle} from '@styles/GlobalStyles';

interface CartAnimationWrapperProps {
  cartCount: number;
  children: React.ReactNode;
}

const CartAnimationWrapper: FC<CartAnimationWrapperProps> = ({
  cartCount,
  children,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [hasAnimated, setHasAnimated] = useState(false);

  const slideUpStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
    opacity: slideAnim,
  };

  useEffect(() => {
    if (cartCount > 0 && !hasAnimated) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(()=> setHasAnimated(true));
    }
    else if(cartCount === 0 && hasAnimated) {
        Animated.timing(slideAnim,{
            toValue : 0,
            duration : 300,
             useNativeDriver : true
        }).start(()=> setHasAnimated(false));
    }
  }, [cartCount,hasAnimated]);

  return (
    <Animated.View style={[hocStyle.cartContainer, slideUpStyle]}>
      {children}
    </Animated.View>
  );
};

export default CartAnimationWrapper;

