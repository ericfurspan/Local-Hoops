import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import Loading from '../Loading';
import ErrorMessage from '../ErrorMessage';
import styles from '../styles/main';
import Logo from '../../../assets/img/logo_orange_ball.png'

class AuthLanding extends React.Component {

  render() {
    if(this.props.authLoading) {
      return <Loading indicator={true}/>
    } else if(this.props.error) {
      return <ErrorMessage message={this.props.error}/>
    }

    return (
      <View style={[styles.fullCenterContainer,{backgroundColor: '#3578E5'}]}>
        <Image
          source={Logo}
          style={{width: 300,height: 300}}
          PlaceholderContent={<ActivityIndicator />}
          placeholderStyle={{backgroundColor: 'transparent'}}
        />
        <Button
          title='LOGIN'
          titleStyle={{color: '#3578E5',fontWeight: '500'}}
          buttonStyle={{backgroundColor: '#fff',width: 250,borderColor: '#fff',borderRadius: 5,borderWidth: 1}}
          containerStyle={{marginTop: 5}}
          raised
          type='outline'
          onPress={() => this.props.navigation.navigate('Login')}
          testID='enterLogin'
        />
        <Button
          title='SIGN UP'
          titleStyle={{color: '#fff',fontWeight: '500'}}
          buttonStyle={{backgroundColor: '#3578E5',width: 250,borderColor: '#fff',borderRadius: 5,borderWidth: 1}}
          containerStyle={{marginTop: 5}}
          raised
          type='outline'
          onPress={() => this.props.navigation.navigate('Register')}
          testID='enterSignup'
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  authLoading: state.authLoading,
  error: state.error,
})

export default connect(mapStateToProps)(AuthLanding);
