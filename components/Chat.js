import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Chat extends React.Component {

    render() {
        return (
            <View style={styles.background}>
                <Text style={styles.text}>Chat...coming soon</Text>
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
        fontSize: 30
    }
})

export default Chat;