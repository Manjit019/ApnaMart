import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import { screenHeight } from '@utils/Scaling';
import React, { FC, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const steps = [
  { title: 'Order Placed', icon: 'circle' },
  { title: 'Order Confirmed', icon: 'checkbox-marked-circle' },
  { title: 'Picked Up', icon: 'store-check' },
  // { title: 'Out for Delivery', icon: 'motorbike' },
  { title: 'Delivered', icon: 'package-variant' },
];

const ProgressTracker: FC<{ currentStep: number }> = ({ currentStep }) => {
  const progress = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: currentStep,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const getStepActivation = (index: number) => {
    return progress.interpolate({
      inputRange: [index - 1, index + 0.3],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  };

  const progressInterpolate = progress.interpolate({
    inputRange: [0, steps.length - 1],
    outputRange: ['0%', '100%'],
  });

  const colorInterpolate = progress.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['#e0e0e0', '#4caf50', '#4caf50', '#4caf50'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.filledProgress,
              { width: progressInterpolate, backgroundColor: colorInterpolate },
            ]}
          />
        </View>

        {steps.map((step, index) => {
          const stepActivation = getStepActivation(index);
          return (
            <View
              key={index}
              style={[
                styles.stepContainer,
                { left: `${index * (100 / (steps.length - 1))}%` },
              ]}>
              <Animated.View
                style={[
                  styles.stepCircle,
                  index <= currentStep
                    ? styles.activeStep
                    : styles.inactiveStep,
                  {
                    backgroundColor: stepActivation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#ffffff', '#4caf50'],
                    }),
                  },
                  {
                    borderColor: stepActivation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#ddd', '#4caf50'],
                    }),
                  },
                ]}>
                <Icon
                  name={index <= currentStep ? 'check' : step.icon}
                  size={20}
                  color={index <= currentStep ? '#fff' : '#888'}
                  style={styles.icon}
                />
              </Animated.View>
              <CustomText
                fontSize={RFValue(6.5)}
                fontFamily={Fonts.Medium}
                style={[
                  styles.stepTitle,
                  index <= currentStep
                    ? styles.activeTitle
                    : styles.inactiveTitle,
                ]}>
                {step.title}
              </CustomText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    height: screenHeight * 0.15,
    marginVertical : 6
  },
  progressContainer: {
    height: 100,
    position: 'relative',
    padding: 20,
  },
  progressBar: {
    position: 'absolute',
    top: 16,
    width: '100%',
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
  },
  filledProgress: {
    height: '100%',
    borderRadius: 2,
  },
  stepContainer: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -25 }],
  },
  stepCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: '#00C853',
  },
  inactiveStep: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  stepTitle: {
    textAlign: 'center',
    width: 80,
  },
  activeTitle: {
    color: '#00C853',
    fontWeight: '600',
  },
  inactiveTitle: {
    color: '#888',
  },
  icon: {
    marginLeft: 1, // minor icon alignment adjustment
  },
});

export default ProgressTracker;
