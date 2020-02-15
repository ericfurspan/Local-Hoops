import { createStackNavigator } from 'react-navigation-stack';

import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import AuthLanding from '../components/Auth/Landing';

const AuthNavigator = createStackNavigator(
  {
    AuthLanding: AuthLanding,
    Login: Login,
    Register: Register,
  },
  {
    headerMode: 'none',
  }
);

export default AuthNavigator;
