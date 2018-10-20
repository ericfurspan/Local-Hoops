import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase'
import { updateFriends } from '../actions';

class FriendList extends React.Component {

    state = {
        friends: []
    }

    componentDidMount() {
        // query friends and pass to FriendsList
        if(this.props.currentUser.friends.length > 0) {
            let counter = 0;
            let friends = [];
            this.props.currentUser.friends.forEach(uid => {
                firebase.firestore().collection('users').doc(uid)
                .get()
                .then(doc => {
                    friends.push(doc.data());
                    counter++;
                    if(counter === this.props.currentUser.friends.length) {
                        //this.setState({friends})
                        this.props.dispatch(updateFriends(friends))
                    }
                })
                .catch(e => console.error(e))
            })
        }
    }
    render() {
        if(this.props.friends) {
            console.log(this.props.friends)
            return (
                <View style={styles.container}>
                    <Text>Friends</Text>

                    <List containerStyle={{marginBottom: 20}}>
                    {this.props.friends.map((f) => (
                        <ListItem
                            containerStyle={{width: 300}}
                            roundAvatar
                            avatar={{uri:f.photoURL}}
                            key={f.uid}
                            title={f.displayName}
                            subtitle={f.email}
                        />
                    ))}
                    </List>

                </View>
            )
        } else {
            return null
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50
    },
    text: {
        fontSize: 25
    }
})

const mapStateToProps = (state, props) => ({
    currentUser: state.currentUser,
    friends: state.friends
})
export default connect(mapStateToProps)(FriendList);