// import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import App from './app/App';
/* YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Require cycle:']);
YellowBox.ignoreWarnings(['unknown call:']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
*/
YellowBox.ignoreWarnings(['Warning']);

AppRegistry.registerComponent('LocalBall', () => App);