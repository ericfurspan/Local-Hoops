import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';

class BackButton extends React.Component {

  render() {
    return (
      <Button
        title='BACK'
        icon={{name: 'ios-arrow-back',type: 'ionicon',size: 20,color: '#FFFFFF'}}
        onPress={() => this.props.previousStep()}
        buttonStyle={{backgroundColor: '#A9A9A9',borderRadius: 10, padding: 10}}
      />
    )
  }
}
class NextButton extends React.Component {

  render() {
    return (
      <Button
        title={this.props.title || 'NEXT'}
        icon={{name: 'ios-arrow-forward',type: 'ionicon',size: 20,color: '#FFFFFF'}}
        iconRight
        onPress={() => this.props.nextStep()}
        buttonStyle={styles.button}
        disabled={this.props.disabled}
      />
    )
  }
}
class Checkmark extends React.Component {

  render() {
    return (
      <Button
        title='SAVE'
        icon={{name: 'ios-checkmark',type: 'ionicon',size: 35,color: '#FFFFFF'}}
        onPress={() => this.props.completeEvent()}
        buttonStyle={styles.button}
      />
    )
  }
}
class Cancel extends React.Component {

  render() {
    return (
      <View style={styles.bottomCenter}>
        <TouchableOpacity
          onPress={() => this.props.onCancel()}>
          <IonIcon name='ios-close-circle-outline' size={40} color='#fff'/>
        </TouchableOpacity>
      </View>
    )
  }
}

class Save extends React.Component {

  render() {
    return (
      <Button
        title={this.props.title || 'SAVE'}
        icon={{name: 'ios-save',type: 'ionicon',size: 20,color: '#FFFFFF'}}
        onPress={() => this.props.onSaveEvent()}
        buttonStyle={styles.button}
        disabled={this.props.disabled}

      />
    )
  }
}

class Saved extends React.Component {

  render() {
    return (
      <Button
        title='SAVED!'
        icon={{name: 'ios-checkmark',type: 'ionicon',size: 35}}
        onPress={() => this.props.onUnsaveEvent()}
        buttonStyle={styles.button}
      />
    )
  }
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3578E5',
    borderColor: '#F6F8FA',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10
  },
  bottomCenter: {
    position: 'absolute',
    bottom: '1.5%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export { BackButton, NextButton, Checkmark, Cancel, Save, Saved };

