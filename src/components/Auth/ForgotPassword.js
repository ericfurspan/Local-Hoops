import React from 'react';
import { View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import { connect } from 'react-redux';
import { displayError } from '../../actions/Feedback';
import styles from '../../styles/main';

class ForgotPassword extends React.Component {
  state = {
    resetForm: {},
    codeSent: false,
  };

  sendResetEmail = async (email) => {
    try {
      if (email && email.trim().length > 0) {
        await firebase.auth().sendPasswordResetEmail(email);
        this.setState({ resetForm: {}, codeSent: true });
      }
    } catch (e) {
      this.props.dispatch(displayError(e));
    }
  };

  render() {
    return (
      <View style={{ paddingTop: 30, backgroundColor: '#3578E5', flex: 1 }}>
        <Button
          title="Back"
          onPress={() => this.props.toggleResetForm(false)}
          titleStyle={{ color: '#fff', fontSize: 18, fontWeight: '500', marginLeft: 5 }}
          icon={{ name: 'arrow-left', type: 'font-awesome', size: 30, color: '#fff' }}
          containerStyle={{ alignSelf: 'flex-start' }}
          buttonStyle={{ backgroundColor: 'transparent' }}
        />
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500', marginBottom: 25 }}>
            Reset your Password
          </Text>
          <View style={{ marginBottom: 50 }}>
            <Input
              placeholder="Email Address"
              placeholderTextColor="#bbb"
              inputStyle={{ color: '#333' }}
              inputContainerStyle={{
                backgroundColor: '#fff',
                borderRadius: 5,
                width: '80%',
                alignSelf: 'center',
                padding: 5,
              }}
              leftIcon={{ name: 'at', type: 'font-awesome', color: '#333', size: 24 }}
              leftIconContainerStyle={{ marginRight: 15 }}
              value={this.props.login_form.email}
              onChangeText={(email) =>
                this.setState((prevState) => ({
                  resetForm: {
                    ...prevState.resetForm,
                    email,
                  },
                }))
              }
            />
            <Button
              title="Send reset email"
              titleStyle={{ color: '#3578E5', fontWeight: '500', fontSize: 20 }}
              buttonStyle={{ backgroundColor: '#fff', borderColor: '#fff', borderRadius: 5, borderWidth: 1 }}
              raised
              containerStyle={{ marginTop: 5, alignSelf: 'center' }}
              type="outline"
              onPress={() => this.sendResetEmail(this.state.resetForm.email)}
            />
            {this.state.codeSent ? (
              <Text style={[styles.smallRed, { alignSelf: 'center', marginTop: 20, fontWeight: '500' }]}>
                Check your email for next steps
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

export default connect()(ForgotPassword);
