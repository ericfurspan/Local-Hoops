import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles from './styles/main';

class Loading extends React.Component {

  render() {
    return (
      <View style={[styles.fullCenterContainer,{backgroundColor: '#3578E5'}]}>
        <Text style={[styles.text,{fontFamily: 'RhodiumLibre-Regular',color: '#FFFFFF'}]}>{this.props.message}</Text>
        {this.props.indicator ? <ActivityIndicator size='large' color='#FFFFFF'/> : null}
      </View>
    )
  }
}

export default Loading;