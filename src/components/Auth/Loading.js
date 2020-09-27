import React from 'react';
import firebase from '@react-native-firebase/app';
import { connect } from 'react-redux';
import Loading from '../shared/Loading';
import { loginSuccess } from '../../actions/Auth';

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    // if user is authenticated, log in and navigate to App dashboard
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // log in
        firebase
          .firestore()
          .doc(`users/${user.uid}`)
          .get()
          .then((doc) => {
            this.props.dispatch(loginSuccess(doc.data()));
            this.props.navigation.navigate('App');
          });
      } else {
        this.props.navigation.navigate('Auth');
      }
    });
  }

  // Render any loading content that you like here
  render() {
    return <Loading message="Local Hoops" indicator={false} />;
  }
}

export default connect()(AuthLoadingScreen);
