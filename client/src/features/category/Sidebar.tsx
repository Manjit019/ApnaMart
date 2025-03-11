import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useEffect, useRef} from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';

interface sidebarProps {
  categories: any;
  selectedCategory: any;
  onCategoryPress: (category: any) => void;
}

const Sidebar: FC<sidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryPress,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const indiactorPosition = useSharedValue(0);
  const AnimatedValues = categories?.map(() => useSharedValue(0));

  useEffect(() => {
    let targetIndex = -1;

    categories?.forEach((category: any, index: number) => {
      const isSelected = selectedCategory?._id === category._id;
      AnimatedValues[index].value = withTiming(isSelected ? 2 : -15, {
        duration: 500,
      });

      if (isSelected) targetIndex = index;
    });
    if (targetIndex !== -1) {
      indiactorPosition.value = withTiming(targetIndex * 120, {duration: 500});
      runOnJS(() => {
        scrollViewRef.current?.scrollTo({
          y: targetIndex * 120,
          animated: true,
        });
      });
    }
  }, [selectedCategory]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{translateY: indiactorPosition.value}],
  }));

  return (
    <View style={styles.sideBar}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        <View >
          {categories?.map((category: any, index: number) => {
            const animatedStyle = useAnimatedStyle(()=> ({bottom : AnimatedValues[index].value}))

            return (
                <TouchableOpacity
                 key={index}
                 activeOpacity={1}
                 style={styles.categoryButton}
                 onPress={()=> onCategoryPress(category)}
                >
                    <View style={[styles.imageContainer,selectedCategory._id === category?._id && styles.selectedImageContainer]}>
                        <Animated.Image source={{uri : category?.image}} style={[styles.img,animatedStyle]} />
                    </View>
                    <CustomText fontSize={RFValue(7)} style={{textAlign : 'center',}}>{category?.name}</CustomText>

                </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sideBar: {
    width: '24%',
    backgroundColor: '#ffff',
    borderRightWidth: 0.8,
    borderRightColor: '#eee',
    position: 'relative',
    paddingVertical : 14
  },
  indicator: {
    position: 'absolute',
    right: 0,
    width: 4,
    height: 100,
    top: 0,
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  categoryButton : {
    padding : 10,
    height : 100,
    paddingVertical : 0,
    justifyContent : 'center',
    alignItems : 'center',
    width : '100%',
    marginBottom : 20
  },
  img : {
    width  :'100%',
    height : '80%',
    resizeMode : 'contain'
  },
  imageContainer : {
    borderRadius : 16,
    marginBottom : 10,
    width : '75%',
    aspectRatio : 1,
    justifyContent : 'center',
    alignContent : 'center',
    backgroundColor : Colors.backgroundSecondary,
    overflow : 'hidden'
  },
  selectedImageContainer : {
    backgroundColor : '#fff1c9',
  }
});
