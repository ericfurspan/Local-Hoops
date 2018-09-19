import React from 'react';
import { AsyncStorage, View } from 'react-native';
import Loading from './Loading';
import firebase from 'react-native-firebase'
import {loginSuccess} from '../actions/auth';
import { connect } from 'react-redux';

class AuthLoadingScreen extends React.Component {

  componentDidMount() {
    // if user is authenticated, navigate to dashboard
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
          console.log(user)
          this.props.dispatch(loginSuccess(user))
          this.props.navigation.navigate('App');
        } else {
          this.props.navigation.navigate('Auth');
        }
    })
  }

  // Render any loading content that you like here
  render() {
    return (
        <Loading />
    );
  }
}
  
export default connect()(AuthLoadingScreen);