import React from 'react';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
//import FCM from './components/FCM';
import Me from './components/Me';
import AuthLoading from './components/AuthLoading';
import Login from './components/Login';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import store from '../store';
import { Provider } from 'react-redux'

const AuthStack = createStackNavigator(
  { 
    SignIn: Login 
  },
  {
    headerMode: 'none'
  }
);
const AppStack = createBottomTabNavigator({
  Dashboard: { screen: Dashboard },
  Explore: { screen: Explore },
  //FCM: { screen: FCM }, // uncomment for REV 2
  Me: { screen: Me }
},
{
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused }) => {
      const { routeName } = navigation.state;
      let iconName;
      let iconColor = '#4B4B4B'
      if (routeName === 'Dashboard') {
        iconName = 'md-home';
      } else if (routeName === 'Explore') {
        iconName = 'md-compass';
      } else if (routeName === 'Chat') {
        iconName = 'md-chatboxes'
      } else if (routeName === 'Me') {
        iconName = 'md-person'
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
      height: 55
    },
    showLabel: true,
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