import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import ForgotPassword from '../ForgotPassword';
import theme from '../../../styles/theme';
import global from '../../../styles/global';

const AuthLogin = ({ loginBasic, redirectToLanding }) => {
  const [loginForm, updateLoginForm] = useState({ email: '', password: '' });
  const [showPwResetForm, setShowPwResetForm] = useState(false);

  if (showPwResetForm) {
    return <ForgotPassword toggleResetForm={setShowPwResetForm} />;
  }

  return (
    <View style={global.authContainer}>
      <View style={global.authHeader}>
        <Button
          title="Back"
          onPress={redirectToLanding}
          titleStyle={global.authBackTitle}
          icon={{ name: 'arrow-left', type: 'font-awesome', color: theme.colors.white }}
          type="clear"
        />
      </View>
      <View style={global.authContent}>
        <Text style={global.authHeading}>Login</Text>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="username"
          autoCorrect={false}
          placeholderTextColor={theme.colors.darkGray}
          style={global.textInput}
          onChangeText={(value) => updateLoginForm({ ...loginForm, email: value })}
          value={loginForm.email}
          testID="emailInput"
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          textContentType="password"
          secureTextEntry
          autoCorrect={false}
          placeholderTextColor={theme.colors.darkGray}
          style={global.textInput}
          onChangeText={(value) => updateLoginForm({ ...loginForm, password: value })}
          value={loginForm.password}
          testID="passwordInput"
        />
        <Button
          title="Submit"
          titleStyle={global.authActionBtnTitle}
          buttonStyle={global.authActionBtn}
          onPress={() => loginBasic(loginForm.email, loginForm.password)}
          testID="loginButton"
        />

        <View style={global.authContent}>
          <Button
            title="Forgot Password?"
            type="clear"
            titleStyle={{ color: theme.colors.white }}
            onPress={() => setShowPwResetForm(true)}
          />
        </View>
      </View>
    </View>
  );
};

export default AuthLogin;
