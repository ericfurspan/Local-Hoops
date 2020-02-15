import { AppRegistry, YellowBox } from 'react-native';
import App from './app/App';

YellowBox.ignoreWarnings(['Warning']);

// App Entry point
AppRegistry.registerComponent('LocalBall', () => App);
