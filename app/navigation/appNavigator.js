import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import IonIcon from 'react-native-vector-icons/Ionicons';

import Dashboard from '../components/Screens/Dashboard';
import Explore from '../components/Screens/Explore';
import Social from '../components/Screens/Social';
import AuthLoading from '../components/Auth/Loading';
import AuthNavigator from './authNavigator';

const BottomTopNavigator = createBottomTabNavigator(
  {
    Dashboard: { screen: Dashboard },
    Explore: { screen: Explore },
    Social: { screen: Social },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        console.log(navigation);
        let iconName;
        let iconColor = '#4B4B4B';
        if (routeName === 'Dashboard') {
          iconName = 'ios-home';
        } else if (routeName === 'Explore') {
          iconName = 'ios-compass';
        } else if (routeName === 'Chat') {
          iconName = 'md-chatboxes';
        } else if (routeName === 'Social') {
          iconName = 'ios-people';
        }
        if (focused) {
          iconColor = '#EF8333';
        }
        return <IonIcon name={iconName} size={30} color={iconColor} testID={`${routeName}Button`}/>;
      },
    }),
    tabBarOptions: {
      style: {
        backgroundColor: '#FAFAFA',
        height: 60,
      },
      showLabel: true,
      labelStyle: {
        fontSize: 12,
      },
      activeTintColor: '#EF8333',
      inactiveTintColor: 'gray',
    },
  }
);


const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: BottomTopNavigator,
    Auth: AuthNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
