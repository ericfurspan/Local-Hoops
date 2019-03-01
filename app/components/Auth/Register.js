import React from 'react';
import { View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { CreateUserWithEmailPw, updateRegistrationForm } from '../../actions/Auth'
import { displayError } from '../../actions/Misc';
import { connect } from 'react-redux';

class Register extends React.Component {

    triggerNewUserEmailPW = () => {
      // validate password and passwordConfirm are the same
      const { name, email, password, passwordConfirm } = this.props.registration_form;
      if(password !== passwordConfirm) {
        return this.props.dispatch(displayError({message: 'Passwords must match'}));
      }
      // validate name length
      if(name && name.length < 3) {
        return this.props.dispatch(displayError({message: 'Please enter a longer name'}));
      }
      if(!password || password.length < 1) {
        return this.props.dispatch(displayError({message: 'Please enter a password'}));
      }
      this.props.dispatch(CreateUserWithEmailPw(name, email, password));
    }

    render() {
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
          </View>

          { // REGISTRATION
          }
          <View style={{justifyContent: 'flex-start',alignItems: 'center',marginTop: 45}}>
            <Text style={{color: '#FFFFFF',fontSize: 22,marginBottom: 10}}>Create your Account</Text>
            <Input
              placeholder='Name'
              placeholderTextColor='#bbb'
              inputStyle={{color: '#333'}}
              inputContainerStyle={{backgroundColor: '#fff',borderRadius: 5}}
              leftIcon={{type: 'ionicon',name: 'ios-person',color: '#333',size: 24}}
              leftIconContainerStyle={{marginRight: 15}}
              onChangeText={(val) => this.props.dispatch(updateRegistrationForm('name', val))}
              value={this.props.registration_form.name}
            />
            <Input
              placeholder='Email'
              placeholderTextColor='#bbb'
              inputStyle={{color: '#333'}}
              inputContainerStyle={{backgroundColor: '#fff',borderRadius: 5}}
              leftIcon={{type: 'ionicon',name: 'ios-mail',color: '#333',size: 24}}
              leftIconContainerStyle={{marginRight: 15}}
              onChangeText={(val) => this.props.dispatch(updateRegistrationForm('email', val))}
              value={this.props.registration_form.email}
            />
            <Input
              placeholder='Password'
              placeholderTextColor='#bbb'
              inputStyle={{color: '#333'}}
              secureTextEntry
              inputContainerStyle={{backgroundColor: '#fff',borderRadius: 5}}
              leftIcon={{type: 'ionicon',name: 'ios-lock',color: '#333',size: 24}}
              leftIconContainerStyle={{marginRight: 20}}
              onChangeText={(val) => this.props.dispatch(updateRegistrationForm('password', val))}
            />
            <Input
              placeholder='Confirm Password'
              placeholderTextColor='#bbb'
              inputStyle={{color: '#333'}}
              secureTextEntry
              inputContainerStyle={{backgroundColor: '#fff',borderRadius: 5}}
              leftIcon={{type: 'ionicon',name: 'ios-lock',color: '#333',size: 24}}
              leftIconContainerStyle={{marginRight: 20}}
              onChangeText={(val) => this.props.dispatch(updateRegistrationForm('passwordConfirm', val))}
            />
            <Button
              title='Sign Up'
              titleStyle={{color: '#3578E5',fontWeight: '500'}}
              buttonStyle={{backgroundColor: '#fff',width: 150}}
              containerStyle={{marginTop: 5}}
              raised
              type='outline'
              onPress={() => this.triggerNewUserEmailPW()}
            />
          </View>
        </View>
      )
    }
}

const mapStateToProps = (state) => ({
  authLoading: state.authLoading,
  error: state.error,
  registration_form: state.registration_form
})

export default connect(mapStateToProps)(Register);
