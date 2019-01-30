import React from 'react';
import { View } from 'react-native';
import Friends from './Friends/Friends';
import Account from './Account';
import { connect } from 'react-redux';
import styles from './styles/main';
import firebase from 'react-native-firebase'
import { addFriendSuccess, getFriends } from '../actions/User';

class Me extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friendRequestsSent: null,
            friendRequestsReceived: null,
            showModal: false
        }
    }
    componentDidMount() {
        this.getFriendRequestsReceived();
    }
    
    setModalVisible = (visible) => {
        this.setState({
            showModal: visible
        })
    }

    getFriendRequestsReceived = () => {
        firebase.firestore().collection('friendRequests')
        .where('requesteeId', '==', this.props.currentUser.uid)
        .get()
        .then(querySnapshot => {
            let friendRequestsReceived = [];
            let counter = 0;
            let snapshotSize = querySnapshot.size;
            querySnapshot.forEach(doc => {
                firebase.firestore().doc(`users/${doc.data().requestorId}`)
                .get()
                .then(doc => {
                    const { photoURL, displayName, uid } = doc.data();
                    let data = {
                        photoURL,
                        displayName,
                        uid
                    }
                    friendRequestsReceived.push(data);
                    counter++;
                    return counter;
                })
                .then((counter) => {
                    if(snapshotSize === counter) {
                        this.setState({friendRequestsReceived})
                    }
                })
            })
        })
        .catch(e => console.error(e))
    }
    cancelFriendRequest = (prospectiveFriendId) => {
        // delete document from friendRequests collection
        firebase.firestore().collection('friendRequests')
        .where('requesteeId', '==', this.props.currentUser.uid)
        .where('requestorId', '==', prospectiveFriendId)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.update({
                    status: 'declined'
                })
            })
        })

        // hide modal
        this.setModalVisible(false);

        // update state to remove friend request where uid === prospectiveFriendId
        let updatedRequests = this.state.friendRequestsReceived.filter(request => {
            return request.uid !== prospectiveFriendId
        })

        this.setState({friendRequestsReceived: updatedRequests})
    }
    acceptFriendRequest = (prospectiveFriendId) => {
        
        // add users to each others friends array
        firebase.firestore().doc(`users/${this.props.currentUser.uid}`)
        .update({
            friends: firebase.firestore.FieldValue.arrayUnion(prospectiveFriendId)
        })
        .then(() => {
            firebase.firestore().doc(`users/${prospectiveFriendId}`)
            .update({
                friends: firebase.firestore.FieldValue.arrayUnion(this.props.currentUser.uid)
            })            
        })        
        // update status of document in friendRequests collection
        firebase.firestore().collection('friendRequests')
        .where('requesteeId', '==', this.props.currentUser.uid)
        .where('requestorId', '==', prospectiveFriendId)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.update({
                    status: 'accepted'
                })
            })
        })

        // hide modal
        this.setModalVisible(false);

        // update state to remove friend request where uid === prospectiveFriendId
        let updatedRequests = this.state.friendRequestsReceived.filter(request => {
            return request.uid !== prospectiveFriendId
        })

        this.setState({friendRequestsReceived: updatedRequests})

        //this.props.dispatch(addFriendSuccess(prospectiveFriendId));
        this.props.dispatch(getFriends([...this.props.friends, prospectiveFriendId]));
    }

    render() {
        console.log(this.state)
        return (
            <View style={styles.container}>
                <View style={styles.account}>
                    <Account 
                        modalVisible={this.state.showModal}
                        friendRequests={this.state.friendRequestsReceived}
                        setModalVisible={visible => this.setModalVisible(visible)}
                        acceptFriendRequest={uid => this.acceptFriendRequest(uid)}
                        cancelFriendRequest={uid => this.cancelFriendRequest(uid)}
                    />
                </View>
                <Friends />
            </View>
        )

    }
}

const mapStateToProps = (state) => ({
    currentUser: state.currentUser,
    friends: state.currentUser.friends
})
export default connect(mapStateToProps)(Me);