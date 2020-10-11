import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import theme from '../../../styles/theme';
import global from '../../../styles/global';

const AuthRegister = ({ tryCreateNewUser, redirectToLanding }) => {
  const [registrationForm, updateRegistrationForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleEmailPwRegistration = () => {
    const { name, email, password, passwordConfirm } = registrationForm;
    tryCreateNewUser(name, email, password, passwordConfirm);
  };

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
        <Text style={global.authHeading}>Sign Up</Text>
        <TextInput
          placeholder="Name"
          autoCorrect={false}
          placeholderTextColor={theme.colors.darkGray}
          style={global.textInput}
          onChangeText={(val) => updateRegistrationForm({ ...registrationForm, name: val })}
          value={registrationForm.name}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCorrect={false}
          placeholderTextColor={theme.colors.darkGray}
          style={global.textInput}
          onChangeText={(val) => updateRegistrationForm({ ...registrationForm, email: val })}
          value={registrationForm.email}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          placeholderTextColor={theme.colors.darkGray}
          style={global.textInput}
          secureTextEntry
          onChangeText={(val) => updateRegistrationForm({ ...registrationForm, password: val })}
        />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor={theme.colors.darkGray}
          style={global.textInput}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          onChangeText={(val) =>
            updateRegistrationForm({ ...registrationForm, passwordConfirm: val })
          }
        />
        <Button
          title="Sign Up"
          titleStyle={global.authActionBtnTitle}
          buttonStyle={global.authActionBtn}
          onPress={handleEmailPwRegistration}
        />
      </View>
    </View>
  );
};

export default AuthRegister;
