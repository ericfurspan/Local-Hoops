import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SocialIcon, Input, Button, Image } from 'react-native-elements';
import { GoogleLogin, FacebookLogin, EmailPwLogin, updateLoginForm } from '../actions/Auth'
import { connect } from 'react-redux';
import styles from './styles/main';
import Logo from '../../assets/img/nyk.png'
import ForgotPassword from './ForgotPassword';

class Login extends React.Component {
    state = {
      showResetForm: false,
    }
    triggerGoogleSignIn = () => {
      this.props.dispatch(GoogleLogin())
    }
    triggerFacebookSignIn = () => {
      this.props.dispatch(FacebookLogin())
    }
    triggerEmailPWSignin = () => {
      const { email, password } = this.props.login_form;
      this.props.dispatch(EmailPwLogin(email, password))
    }
    toggleResetForm = (visible) => {
      this.setState({
        showResetForm: visible
      })
    }

    render() {
      if(this.state.showResetForm) {
        return (
          <ForgotPassword login_form={this.props.login_form} toggleResetForm={this.toggleResetForm}/>
        )
      }
      return (
        <View style={{paddingTop: 30,backgroundColor: '#3578E5',flex: 1}}>
          <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}}>
            <Button
              title='Back'
              onPress={() => this.props.navigation.navigate('AuthLanding')}
              titleStyle={{color: '#fff',fontSize: 18,fontWeight: '500',marginLeft: 5}}
              icon={{name: 'ios-arrow-back',type: 'ionicon',size: 30,color: '#fff'}}
              buttonStyle={{backgroundColor: 'transparent'}}
            />
            <View style={{flexDirection: 'row',alignItems: 'center',marginRight: 10}}>
              <Image source={Logo} style={{width: 30,height: 30,marginRight: 3}} PlaceholderContent={<ActivityIndicator />} placeholderStyle={{backgroundColor: 'transparent'}}/>
              <Text style={{color: '#fff', fontSize: 18, fontWeight: '500'}}>Local Hoops</Text>
            </View>
          </View>
          <View style={{justifyContent: 'flex-start',alignItems: 'center',marginTop: 45}}>
            { // SIGN IN
            }
            <Text style={{color: '#FFFFFF',fontSize: 22,marginBottom: 10}}>Log in</Text>
            <Input
              placeholder='Email'
              placeholderTextColor='#bbb'
              inputStyle={{color: '#333'}}
              inputContainerStyle={{backgroundColor: '#fff',borderRadius: 5,width: '80%',alignSelf: 'center'}}
              leftIcon={{type: 'ionicon',name: 'ios-mail',color: '#333',size: 24}}
              leftIconContainerStyle={{marginRight: 15}}
              onChangeText={(value) => this.props.dispatch(updateLoginForm('email', value))}
              value={this.props.login_form.email}
            />
            <Input
              placeholder='Password'
              placeholderTextColor='#bbb'
              inputStyle={{color: '#333'}}
              secureTextEntry
              inputContainerStyle={{backgroundColor: '#fff',borderRadius: 5,width: '80%',alignSelf: 'center'}}
              leftIcon={{type: 'ionicon',name: 'ios-lock',color: '#333',size: 24}}
              leftIconContainerStyle={{marginRight: 20}}
              onChangeText={(value) => this.props.dispatch(updateLoginForm('password', value))}
            />
            <Button
              title='Login'
              titleStyle={{color: '#3578E5',fontWeight: '500',fontSize: 20}}
              buttonStyle={{backgroundColor: '#fff',width: 150,borderColor: '#fff',borderRadius: 5,borderWidth: 1}}
              containerStyle={{marginTop: 5}}
              raised
              type='outline'
              onPress={() => this.triggerEmailPWSignin()}
            />
            <Button
              title='Change my password'
              titleStyle={{fontWeight: '500',fontSize: 15}}
              buttonStyle={{backgroundColor: 'transparent'}}
              onPress={() => this.setState({showResetForm: true})}
              containerStyle={{marginTop: 10}}
            />

            <View style={{marginTop: 55, alignItems: 'center'}}>
              <Text style={{color: '#bbb',fontSize: 14,marginBottom: 10}}>- OR CONNECT WITH -</Text>
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
          </View>
        </View>
      )
    }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  authLoading: state.authLoading,
  error: state.error,
  login_form: state.login_form
})

export default connect(mapStateToProps)(Login);
