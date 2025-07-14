

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Navigation from '@navigation/Navigation';
import React from 'react';
import {SafeAreaProvider,useSafeAreaInsets} from 'react-native-safe-area-context'

const App = () => {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
       <Navigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
