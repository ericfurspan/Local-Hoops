import React from 'react';
import { View, Text } from 'react-native';
import { Button, SocialIcon } from 'react-native-elements';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { GoogleLogin, GoogleLogout, FacebookLogin } from '../actions/Auth'
import { setupMessagingPermissions, listenForNotifications } from '../actions/Messaging';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase'
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import styles from './styles/main';

class Login extends React.Component {
    triggerGoogleSignIn = () => {
        this.props.dispatch(GoogleLogin())
    }
    triggerFacebookSignIn = () => {
        this.props.dispatch(FacebookLogin())
    }
    /*forceCrash = () => {
        firebase.crashlytics().crash()
    }*/

    render() {
        if(this.props.authLoading) {
            return <Loading indicator={true}/>
        }
        if(this.props.error) {
            return <ErrorMessage message={this.props.error}/>
        }
        return (
            <View style={[styles.fullCenterContainer,{backgroundColor:'#3578E5'}]}>
                
                <Text style={{color:'#FFFFFF',fontSize:22,marginBottom:10}}>Sign in with</Text>
                <View style={styles.row}>
                    <SocialIcon 
                        type='facebook'
                        raised
                        onPress={() => this.triggerFacebookSignIn()}
                    />
                    <SocialIcon 
                        type='google-plus-official' 
                        raised
                        onPress={() => this.triggerGoogleSignIn()}
                    />             
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state, props) => ({
    authLoading: state.authLoading,
    error: state.error
})

export default connect(mapStateToProps)(Login);
