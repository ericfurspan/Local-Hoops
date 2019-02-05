import React from 'react';
import Loading from './Loading';
import firebase from 'react-native-firebase'
import { loginSuccess } from '../actions/Auth';
import { connect } from 'react-redux';

class AuthLoadingScreen extends React.Component {

  componentDidMount() {
    // if user is authenticated, navigate to App dashboard
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
          firebase.firestore().doc(`users/${user.uid}`)
          .get()
          .then(doc => {
              this.props.dispatch(loginSuccess(doc.data()))
              this.props.navigation.navigate('App');
          })
        } else {
          this.props.navigation.navigate('Auth');
        }

    })
  }

  // Render any loading content that you like here
  render() {
    return (
        <Loading message='Local Hoops' indicator={false}/>
    );
  }
}

export default connect()(AuthLoadingScreen);