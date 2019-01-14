import React from 'react';
import { View } from 'react-native';
import Friends from './Friends/Friends';
import Account from './Account';
import styles from './styles/main';

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