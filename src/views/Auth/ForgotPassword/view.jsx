import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import crashlytics from '@react-native-firebase/crashlytics';
import theme from '../../../styles/theme';
import global from '../../../styles/global';
import styles from './style';

const ForgotPassword = ({ toggleResetForm }) => {
  const [email, updateEmail] = useState('');
  const [resetCodeSent, setResetCodeSent] = useState(false);

  const sendResetEmail = async () => {
    try {
      if (email && email.trim().length > 0) {
        await firebase.auth().sendPasswordResetEmail(email);
        updateEmail('');
        setResetCodeSent(true);
      }
    } catch (error) {
      crashlytics().recordError(error);
    }
  };

  return (
    <View style={global.authContainer}>
      <View style={global.authHeader}>
        <Button
          title="Back"
          onPress={() => toggleResetForm(false)}
          titleStyle={global.authBackTitle}
          icon={{ name: 'arrow-left', type: 'font-awesome', color: theme.colors.white }}
          type="clear"
        />
      </View>
      <View style={global.authContent}>
        <Text style={global.authHeading}>Reset Password</Text>
        <TextInput
          placeholder="Email Address"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="username"
          placeholderTextColor={theme.colors.gray}
          style={global.textInput}
          value={email}
          onChangeText={(_email) => updateEmail(_email)}
        />
        <Button
          title="Send reset email"
          titleStyle={global.authActionBtnTitle}
          buttonStyle={styles.submitBtn}
          onPress={sendResetEmail}
        />

        {resetCodeSent && <Text style={styles.feedbackText}>Check your inbox!</Text>}
      </View>
    </View>
  );
};

export default ForgotPassword;
