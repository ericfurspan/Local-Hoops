import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';

LogBox.ignoreLogs(['Require cycle:']);

AppRegistry.registerComponent('LocalBall', () => App);
