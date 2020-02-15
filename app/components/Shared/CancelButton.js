import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

class CancelButton extends React.Component {

  render() {
    return (
      <View style={styles.bottomCenter}>
        <TouchableOpacity
          testID="cancelButton"
          onPress={() => this.props.onCancel()}>
          <IonIcon name="ios-close-circle-outline" size={40} color="#fff"/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomCenter: {
    position: 'absolute',
    bottom: '1.5%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CancelButton;

