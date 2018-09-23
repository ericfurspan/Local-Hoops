import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { logout } from '../actions';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase'
import Loading from './Loading';
import FriendList from './FriendList';

class Account extends React.Component {

    logout = () => {
        this.props.dispatch(logout())
        firebase.auth().signOut();
    }
    render() {
        if(this.props.currentUser) {
            return (
                <View style={styles.background}>
                    <Avatar
                        large
                        rounded
                        source={{uri: this.props.currentUser.photoURL}}
                        activeOpacity={0.7}
                    />
                    <Text style={styles.text}>{this.props.currentUser.displayName}</Text>  
                    <FriendList />
                    <TouchableOpacity
                        style={styles.bottomCenter}
                        onPress={() => this.logout()}>
                        <IonIcon name='md-log-out' size={35} color='red' />
                        <Text>Log Out</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return <Loading message='friends...'/>
        }

    }
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50
    },
    text: {
        fontSize: 25,
        marginTop: 5
    },
    bottomCenter: {
        position: 'absolute',
        bottom: '8%',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }
})

const mapStateToProps = (state, props) => ({
    currentUser: state.currentUser
})
export default connect(mapStateToProps)(Account);