import {View, Text, StyleSheet, Image} from 'react-native';
import React, {FC, useMemo} from 'react';
import {imageData} from '@utils/dummyData';
import AutoScroll from '@homielab/react-native-auto-scroll';
import {screenHeight, screenWidth} from '@utils/Scaling';

const ProductSlider = () => {
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < imageData.length; i += 4) {
      result.push(imageData.slice(i, i + 4));
    }
    return result;
  }, []);

  return (
    <View pointerEvents="none">
      <AutoScroll
        style={styles.autoScroll}
        endPaddingWidth={0}
        duration={30000}>
        <View style={styles.gridContainer}>
          {rows?.map((row, rowIndex: number) => {
            return <MemoizedRow key={rowIndex} row={row} rowIndex={rowIndex} />
          })}
        </View>
      </AutoScroll>
    </View>
  );
};

const Row: FC<{row: typeof imageData; rowIndex: number}> = ({
  row,
  rowIndex,
}) => {
  return (
    <View style={styles.row}>
      {row.map((image, imageIndex) => {
        const horizontalShift = rowIndex % 2 === 0 ? -25 : 25;
        return (
          <View
            style={[
              styles.imageContainer,
              {transform: [{translateX: horizontalShift}]},
            ]}
            key={imageIndex}>
            <Image source={image} style={styles.image} />
          </View>
        );
      })}
    </View>
  );
};

const MemoizedRow = React.memo(Row);

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 10,
    marginHorizontal: 10,
    width: screenWidth * 0.26,
    backgroundColor: '#e9f7f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    aspectRatio: 1,
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  autoScroll: {
    position: 'absolute',
    zIndex: -2,
  },
  gridContainer: {
    justifyContent: 'center',
    overflow: 'visible',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});

export default ProductSlider;
