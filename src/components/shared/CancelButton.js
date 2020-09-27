import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class CancelButton extends React.Component {
  render() {
    return (
      <View style={styles.bottomCenter}>
        <TouchableOpacity testID="cancelButton" onPress={() => this.props.onCancel()}>
          <FontAwesome5 name="times-circle" size={40} color="#fff" />
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
