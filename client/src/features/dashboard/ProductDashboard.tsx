import {
  View,
  Text,
  Animated as RNAnimated,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Pressable,
  Linking,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useAuthStore} from '@state/authStore';
import NoticeAnimations from './NoticeAnimations';
import {NoticeHeight, screenHeight} from '@utils/Scaling';
import Visuals from './Visuals';
import {
  CollapsibleContainer,
  CollapsibleHeaderContainer,
  CollapsibleScrollView,
  useCollapsibleContext,
  withCollapsibleContext,
} from '@r0b0t3d/react-native-collapsible';
import AnimatedHeader from './AnimatedHeader';
import StickySearchBar from './StickySearchBar';
import CustomText from '@components/ui/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import Content from './Content';
import withCart from '@features/cart/withCart';
import withLiveStatus from '@features/map/withLiveStatus';

const NOTICE_HEIGHT = -(NoticeHeight + 12);

const ProductDashboard = () => {
  const noticePosition = useRef(new RNAnimated.Value(NOTICE_HEIGHT)).current;

  const {scrollY, expand} = useCollapsibleContext();
  const previousScroll = useRef<number>(0);

  const backToTopStyle = useAnimatedStyle(() => {
    const isScrollingUp =
      scrollY.value < previousScroll.current && scrollY.value > 180;
    const opacity = withTiming(isScrollingUp ? 1 : 0, {duration: 300});
    const translateY = withTiming(isScrollingUp ? 0 : 10, {duration: 300});

    previousScroll.current = scrollY.value;

    return {
      opacity,
      transform: [{translateY}],
    };
  });

  const slideUp = () => {
    RNAnimated.timing(noticePosition, {
      toValue: NOTICE_HEIGHT,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  const slideDown = () => {
    RNAnimated.timing(noticePosition, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    slideDown();
    const timeoutId = setTimeout(() => {
      slideUp();
    }, 3500);
    return () => clearTimeout(timeoutId);
  }, []);

  // const {user} = useAuthStore();
  return (
    <NoticeAnimations noticePosition={noticePosition}>
      <>
        <Visuals />
        <SafeAreaView />

        <Animated.View style={[styles.backToTopBtn, backToTopStyle]}>
          <TouchableOpacity
            onPress={() => {
              scrollY.value = 0;
              expand();
            }}
            activeOpacity={0.9}
            style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <Icon
              name="arrow-up-circle-outline"
              color="white"
              size={RFValue(12)}
            />
            <CustomText
              variant="h9"
              style={{color: 'white'}}
              fontFamily={Fonts.SemiBold}>
              Back to Top
            </CustomText>
          </TouchableOpacity>
        </Animated.View>

        <CollapsibleContainer style={styles.panelContainer}>
          <CollapsibleHeaderContainer containerStyle={styles.transparent}>
            <AnimatedHeader
              showNotice={() => {
                slideDown();
                const timeoutId = setTimeout(() => {
                  slideUp();
                }, 3500);
                return () => clearTimeout(timeoutId);
              }}
            />

            <StickySearchBar />
          </CollapsibleHeaderContainer>

          <CollapsibleScrollView
            nestedScrollEnabled
            style={styles.panelContainer}
            showsVerticalScrollIndicator={false}>
            <Content />

            <View style={{backgroundColor: '#f8f8f8', padding: 20}}>
              <CustomText
                fontSize={RFValue(26)}
                fontFamily={Fonts.Bold}
                style={{opacity: 0.2}}>
                ApnaMart 🛒
              </CustomText>
              <CustomText
                fontSize={RFValue(18)}
                fontFamily={Fonts.Bold}
                style={{opacity: 0.2}}>
                Your Everyday Grocery Partner.
              </CustomText>
              <View
                style={{
                  opacity: 0.3,
                  marginTop: 10,
                  paddingBottom: 100,
                  flexDirection: 'row',
                  alignItems: 'baseline',
                }}>
                <CustomText fontFamily={Fonts.Bold}>
                  Developed with 🩶 by
                </CustomText>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: '#000',
                    borderRadius: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                  }}
                  onPress={() =>
                    Linking.openURL('https://manjitsportfolio.netlify.app/')
                  }>
                  <CustomText
                    fontFamily={Fonts.SemiBold}
                    style={{color: 'blue'}}>
                    Manjit
                  </CustomText>
                </TouchableOpacity>
              </View>
              <CustomText variant="h9" style={{textAlign: 'center'}}>
                App Version 1.0.0.0
              </CustomText>
            </View>
          </CollapsibleScrollView>
        </CollapsibleContainer>
      </>
    </NoticeAnimations>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  backToTopBtn: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 50,
    position: 'absolute',
    top: Platform.OS === 'ios' ? screenHeight * 0.18 : 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 50,
    paddingInline: 10,
    paddingVertical: 5,
  },
});

export default withLiveStatus(
  withCart(withCollapsibleContext(ProductDashboard)),
);
