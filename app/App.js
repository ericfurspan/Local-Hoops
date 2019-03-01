import React from 'react';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Provider } from 'react-redux'
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
// import FCM from './components/FCM';
import Friends from './components/Friends/Friends';
import AuthLoading from './components/Auth/AuthLoading';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthLanding from './components/Auth/AuthLanding';
import IonIcon from 'react-native-vector-icons/Ionicons';
import store from './store';

const AuthStack = createStackNavigator(
  {
    AuthLanding: AuthLanding,
    Login: Login,
    Register: Register
  },
  {
    headerMode: 'none'
  }
);
const AppStack = createBottomTabNavigator({
  Dashboard: { screen: Dashboard },
  Explore: { screen: Explore },
  // FCM: { screen: FCM }, // uncomment for REV 2
  Friends: { screen: Friends }
},
{
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused }) => {
      const { routeName } = navigation.state;
      let iconName;
      let iconColor = '#4B4B4B'
      if (routeName === 'Dashboard') {
        iconName = 'ios-home';
      } else if (routeName === 'Explore') {
        iconName = 'ios-compass';
      } else if (routeName === 'Chat') {
        iconName = 'md-chatboxes'
      } else if (routeName === 'Friends') {
        iconName = 'ios-people'
      }
      if(focused) {
        iconColor = '#EF8333'
      }
      return <IonIcon name={iconName} size={30} color={iconColor}/>
    },
  }),
  tabBarOptions: {
    style: {
      backgroundColor: '#FAFAFA',
      height: 60,
    },
    showLabel: true,
    labelStyle: {
      fontSize: 12
    },
    activeTintColor: '#EF8333',
    inactiveTintColor: 'gray',
  }
}
);

const Nav = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

export default function App() {
  return (
    <Provider store={store}>
      <Nav />
    </Provider>
  );
}