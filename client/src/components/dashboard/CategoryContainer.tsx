import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import ScalePress from '@components/ui/ScalePress';
import {navigate} from '@utils/NavigationUtils';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import { screenHeight } from '@utils/Scaling';

const CategoryContainer: FC<{data: any}> = ({data}) => {
  const renderItems = (item: any[]) => {
    return (
      <>
        {item.map((item, index) => (
          <ScalePress
            key={index}
            style={styles.item}
            onPress={() => navigate("ProductCategory",{...item})} >
            <View style={styles.imageContainer} >
                <Image source={item?.image} style={styles.img} />
            </View>
            <CustomText style={styles.text} variant='h8' fontFamily={Fonts.Medium}>{item?.name}</CustomText>
          </ScalePress>
        ))}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>{renderItems(data?.slice(0, 4))}</View>
      <View style={styles.row}>{renderItems(data?.slice(4, 8))}</View>
    </View>
  );
};

export default CategoryContainer;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  text: {
    textAlign: 'center',
  },
  item: {
    width: '22%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height : 80,
    justifyContent  :'center',
    alignItems : 'center',
    borderRadius : 16,
    padding : 8,
    backgroundColor : "#e5f3f5",
    marginBottom : 8
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
});
