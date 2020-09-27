import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AuthLoading, AuthLanding, AuthLogin, AuthRegistration } from './components/Auth';
import { Dashboard, Explore, Social } from './views';

const getIcon = (name, isFocused) => {
  let iconName;
  if (name === 'Dashboard') {
    iconName = 'home'
  } else if (name === 'Explore') {
    iconName = 'compass'
  } else if (name === 'Social') {
    iconName = 'users'
  };

  return (
    <FontAwesome5 name={iconName} size={24} color={isFocused ? "#EF8333" : "#454545"} />
  )
};

const getTabScreenOptions = ({ route, navigation }) => {
  const { name } = route;
  
  return {
    tabBarIcon: ({ focused }) => getIcon(name, focused),
  }
}

const AuthStack = createStackNavigator();
const AuthScreen = () => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen name="AuthLoading" component={AuthLoading} />
    <AuthStack.Screen name="AuthLanding" component={AuthLanding} />
    <AuthStack.Screen name="Login" component={AuthLogin} />
    <AuthStack.Screen name="Register" component={AuthRegistration} />
  </AuthStack.Navigator>
);

const AppTabs = createBottomTabNavigator();
const AppScreen = () => (
  <AppTabs.Navigator tabBarOptions={{ showLabel: false }}>
    <AppTabs.Screen name="Dashboard" component={Dashboard} options={getTabScreenOptions} />
    <AppTabs.Screen name="Explore" component={Explore} options={getTabScreenOptions} />
    <AppTabs.Screen name="Social" component={Social} options={getTabScreenOptions} />
  </AppTabs.Navigator>
);

const RootStack = createDrawerNavigator();
const RootNavigator = () => (
  <NavigationContainer>
    <RootStack.Navigator initialRouteName="Auth">
      <RootStack.Screen name="Auth" component={AuthScreen} />
      <RootStack.Screen name="App" component={AppScreen} />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
