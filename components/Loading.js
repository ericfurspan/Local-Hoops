import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

class Loading extends React.Component {

    render() {
        return (
            <View style={styles.background}>
                <IonIcon name='ios-basketball' size={80} color='#444' />
                <Text style={styles.text}>Loading {this.props.message}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 25
    }
})

export default Loading;