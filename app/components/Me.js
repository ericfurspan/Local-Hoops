import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Friends from './Friends/Friends';
import Account from './Account';
import styles from './styles/main';

let deviceHeight = Dimensions.get('window').height;

class Me extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.account}>
                    <Account />
                </View>
                <Friends />
            </View>
        )

    }
}

export default Me;