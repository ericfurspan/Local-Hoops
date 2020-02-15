import React from 'react';
import { View, AlertIOS } from 'react-native';
import { clearError } from '../../actions/Misc';
import { connect } from 'react-redux';
import styles from '../../styles/main';

class ErrorMessage extends React.Component {

    handleRedirect = () => {
      this.props.dispatch(clearError());
    }
    render() {
      console.log(this.props);
      return (
        <View style={styles.centeredContainer}>
          {AlertIOS.alert(
            'Whoops',
            this.props.message,
            [
              {
                text: 'OK',
                onPress: () => this.handleRedirect(),
              },
            ]
          )}
        </View>
      );
    }
}
export default connect()(ErrorMessage);
