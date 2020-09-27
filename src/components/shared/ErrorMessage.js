import React from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { clearError } from '../../actions/Feedback';
import styles from '../../styles/main';

class ErrorMessage extends React.Component {
  handleRedirect = () => {
    this.props.dispatch(clearError());
  };

  render() {
    return (
      <View style={styles.centeredContainer}>
        {Alert.alert('Whoops', this.props.message, [
          {
            text: 'OK',
            onPress: () => this.handleRedirect(),
          },
        ])}
      </View>
    );
  }
}
export default connect()(ErrorMessage);
