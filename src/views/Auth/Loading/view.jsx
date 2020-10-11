import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import firebase from '@react-native-firebase/app';
import theme from '../../../styles/theme';

const AuthLoading = ({ doLoginSuccess, redirectToLanding }) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .doc(`users/${user.uid}`)
          .get()
          .then((doc) => {
            doLoginSuccess(doc.data());
          });
      } else {
        redirectToLanding();
      }
    });
  });

  return <ActivityIndicator size="large" color={theme.colors.blue} />;
};

export default AuthLoading;
