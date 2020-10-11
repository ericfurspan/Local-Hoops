import React from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Explore, AuthLoading, AuthLanding, AuthLogin, AuthRegister } from './views';

// const getIcon = (name, isFocused) => {
//   let iconName;
//   if (name === 'Dashboard') {
//     iconName = 'home';
//   } else if (name === 'Explore') {
//     iconName = 'map-marker-alt';
//   }

//   return (
//     <FontAwesome5
//       name={iconName}
//       size={24}
//       color={isFocused ? theme.colors.orange : theme.colors.black}
//     />
//   );
// };

// const getTabScreenOptions = ({ route }) => {
//   const { name } = route;

//   return {
//     tabBarIcon: ({ focused }) => getIcon(name, focused),
//   };
// };

// const AppTabs = createBottomTabNavigator();
// const AppScreen = () => (
//   <AppTabs.Navigator
//     initialRouteName="Dashboard"
//     tabBarOptions={{ showLabel: false }}
//     headerMode="none"
//   >
//     <AppTabs.Screen name="Dashboard" component={Dashboard} options={getTabScreenOptions} />
//     <AppTabs.Screen name="Explore" component={Explore} options={getTabScreenOptions} />
//   </AppTabs.Navigator>
// );

const AuthStack = createStackNavigator();
const AuthScreen = () => (
  <AuthStack.Navigator headerMode="none" screenOptions={{ gestureEnabled: false }}>
    <AuthStack.Screen name="AuthLoading" component={AuthLoading} />
    <AuthStack.Screen name="AuthLanding" component={AuthLanding} />
    <AuthStack.Screen name="AuthLogin" component={AuthLogin} />
    <AuthStack.Screen name="AuthRegister" component={AuthRegister} />
  </AuthStack.Navigator>
);

const RootStack = createDrawerNavigator();
const RootNavigator = () => (
  <NavigationContainer fallback={ActivityIndicator}>
    <RootStack.Navigator initialRouteName="Auth" screenOptions={{ gestureEnabled: false }}>
      <RootStack.Screen name="Auth" component={AuthScreen} />
      <RootStack.Screen name="App" component={Explore} />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
