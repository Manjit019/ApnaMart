import {View, Text, StyleSheet, Animated as RNAnimated} from 'react-native';
import React, {FC} from 'react';
import {NoticeHeight} from '../../utils/Scaling';
import Notice from '../../components/dashboard/Notice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NOTICE_HEIGHT = -(NoticeHeight + 32);

const NoticeAnimations: FC<{
  noticePosition: any;
  children: React.ReactElement;
}> = ({noticePosition, children}) => {


  return (
    <View style={[styles.container]}>
      <RNAnimated.View
        style={[
          styles.noticeContainer,
          {transform: [{translateY: noticePosition}]},
        ]}>
        <Notice />
      </RNAnimated.View>
      
      <RNAnimated.View
        style={[
          styles.contentContainer,
          { 
            paddingTop: noticePosition.interpolate({
              inputRange: [NOTICE_HEIGHT,0],
              outputRange: [0,NOTICE_HEIGHT+240],
            })
          },
        ]}>
        {children}
      </RNAnimated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  noticeContainer: {
    width: '100%',
    position: 'absolute',
    zIndex : 99
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default NoticeAnimations;
