import React from 'react';
import { Provider } from 'react-redux';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/functions';
import '@react-native-firebase/messaging';
import 'react-native-gesture-handler';
import store from './store';
import RootNavigator from './navigator';

const App = () => (
  <Provider store={store}>
    <RootNavigator />
  </Provider>
);

export default App;
