

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Navigation from '@navigation/Navigation';
import React from 'react';

const App = () => {
  return (
    <GestureHandlerRootView>
      <Navigation />
    </GestureHandlerRootView>
  );
};

export default App;
