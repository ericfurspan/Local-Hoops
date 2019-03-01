import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import styles from './styles/main';
import Logo from '../../assets/img/logo_orange_ball.png';

class Loading extends React.Component {
  render() {
    return (
      <View style={[styles.fullCenterContainer,{backgroundColor: '#3578E5'}]}>
        <Image
          source={Logo}
          // style={{width: 100,height: 100}}
          PlaceholderContent={<ActivityIndicator />}
          placeholderStyle={{backgroundColor: 'transparent'}}
        />
        <Text style={[styles.text,{fontFamily: 'RhodiumLibre-Regular',color: '#FFFFFF'}]}>{this.props.message}</Text>
        {this.props.indicator ? <ActivityIndicator size='large' color='#FFFFFF'/> : null}
      </View>
    )
  }
}

export default Loading;