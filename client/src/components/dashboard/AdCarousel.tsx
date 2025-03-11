import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {screenHeight, screenWidth} from '@utils/Scaling';
import Carousel from 'react-native-reanimated-carousel';
import ScalePress from '@components/ui/ScalePress';

const AdCarousel: FC<{adData: any}> = ({adData}) => {
  const baseOptions = {
    vertical: false,
    width: screenWidth,
    height: screenHeight * 0.26,
  };

  return (
    <View style={{left : -20, marginVertical: 20}}>
      <Carousel
        {...baseOptions}
        loop
        pagingEnabled
        snapEnabled
        autoPlay
        autoPlayInterval={3000}
        mode="parallax"
        data={adData}
        modeConfig={{parallaxScrollingOffset: 0, parallaxScrollingScale: 0.94}}
        renderItem={({item}:any)=> {
            return (
                <ScalePress style={styles.imageContainer}>
                        <Image source={item} style={styles.img} />
                </ScalePress>
            );
        }}
      />
    </View>
  );
};

export default AdCarousel;

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
});
