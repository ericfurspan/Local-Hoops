import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { GoogleLogin, GoogleLogout, FacebookLogin } from '../actions/auth'
import { connect } from 'react-redux';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

class Login extends React.Component {
    triggerGoogleSignIn = () => {
        this.props.dispatch(GoogleLogin())
    }
    triggerFacebookSignIn = () => {
        this.props.dispatch(FacebookLogin())
    }
    render(props) {
        return (
            <View style={styles.background}>
                <Text style={styles.header}>Please sign in</Text>
                <Button
                    onPress={() => this.triggerGoogleSignIn()}
                    icon={{name:'logo-google',type:'ionicon',size:36,color:'#0d0d0d', style: { marginRight: 40 }}}
                    title='Login with Google'
                    backgroundColor='#FFFFFF'
                    textStyle={{color:'#3f3f3f', fontSize: 16}}
                    buttonStyle={{borderColor: '#F6F8FA', borderWidth: 1, width: 250}}
                />
                <Button
                    style={{marginTop: 5}}
                    onPress={() => this.triggerFacebookSignIn()}
                    icon={{name:'logo-facebook',type:'ionicon',size:36,color:'#FFFFFF', style: { marginRight: 30 }}}
                    title='Login with Facebook'
                    backgroundColor='#3578E5'
                    textStyle={{color:'#F6F8FA', fontSize: 16}}
                    buttonStyle={{borderColor: '#F6F8FA', borderWidth: 1, width: 250}}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        fontSize: 25,
        position: 'absolute',
        top: 50
    }
})

export default connect()(Login);
