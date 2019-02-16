import React from 'react';
import { View, AlertIOS } from 'react-native';
import { clearError } from '../actions/Misc';
import { connect } from 'react-redux';
import styles from './styles/main';

class ErrorMessage extends React.Component {

    handleRedirect = () => {
      this.props.dispatch(clearError());
    }
    render() {
      return (
        <View style={styles.centeredContainer}>
          {AlertIOS.alert(
            'Uh oh..',
            this.props.message,
            [
              {
                text: 'OK',
                onPress: () => this.handleRedirect(),
              },
            ],
          )}
        </View>
      )
    }
}
export default connect()(ErrorMessage);
