import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import styles from '../../styles/main';
import Logo from '../../../assets/img/logo_orange_ball.png';

class Loading extends React.Component {
  render() {
    return (
      <View style={[styles.fullCenterContainer,{backgroundColor: '#3578E5'}]}>
        <Image
          source={Logo}
          style={{width: 300,height: 300}}
          PlaceholderContent={<ActivityIndicator />}
          placeholderStyle={{backgroundColor: 'transparent'}}
        />
        {this.props.indicator ? <ActivityIndicator size="large" color="#FFFFFF"/> : null}
      </View>
    );
  }
}

export default Loading;
