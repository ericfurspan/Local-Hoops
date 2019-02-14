import React from 'react';
import { View, StatusBar} from 'react-native';
import Friends from './Friends/Friends';
import Account from './Account';
import { connect } from 'react-redux';
import styles from './styles/main';
import firebase from 'react-native-firebase'
import { createFriends, getFriends, cancelFriendRequest } from '../actions/User';

class Me extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribeFriendRequestsReceived = null;
        this.state = {
            friendRequestsSent: null,
            friendRequestsReceived: null,
            showModal: false
        }
    }
    componentDidMount() {
        //this.getFriendRequestsReceived();
    }
    setModalVisible = (visible) => {
        this.setState({
            showModal: visible
        })
    }
    componentWillUnmount() {
        this.unsubscribeFriendRequestsReceived();
    }
    getFriendRequestsReceived = () => {
        this.unsubscribeFriendRequestsReceived = firebase.firestore().collection('friendRequests')
        .where('requesteeId', '==', this.props.currentUser.uid)
        .onSnapshot(querySnapshot => {
            let friendRequestsReceived = [];
            let counter = 0;
            let snapshotSize = querySnapshot.size;
            querySnapshot.forEach(doc => {
                if(doc.data().status === 'pending') {
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
                    .catch( (e) => {
                        console.log('firebase error in Me.js!');
                        console.log(e);
                    })
                }
            })            
        }, error => {
            console.log('snapshot error!')
            console.log(error);
        })
    }
    denyFriendRequest = (prospectiveFriendId) => {

        // Cancel the request
        this.props.dispatch(cancelFriendRequest(this.props.currentUser.uid, prospectiveFriendId))

        // Hide modal
        this.setModalVisible(false);

        // update state to remove friend request where uid === prospectiveFriendId
        let updatedRequests = this.state.friendRequestsReceived.filter(request => {
            return request.uid !== prospectiveFriendId
        })

        this.setState({friendRequestsReceived: updatedRequests})
    }
    acceptFriendRequest = (prospectiveFriendId) => {

        // Accept the request and create friends
        this.props.dispatch(createFriends(this.props.currentUser.uid, prospectiveFriendId))

        // Hide modal
        this.setModalVisible(false);

        // Remove friend request where uid === prospectiveFriendId
        let updatedRequests = this.state.friendRequestsReceived.filter(request => {
            return request.uid !== prospectiveFriendId
        })

        // Update state
        this.setState({friendRequestsReceived: updatedRequests})

        // Update friends list
        let updatedFriendIds;
        if(this.props.currentUser.friends) {
            updatedFriendIds = [...this.props.currentUser.friends, prospectiveFriendId];
        } else {
            updatedFriendIds = [prospectiveFriendId]
        }

        this.props.dispatch(getFriends(updatedFriendIds));
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.showModal ?
                    <StatusBar hidden />
                    : null
                }
                <View style={styles.account}>
                    <Account 
                        modalVisible={this.state.showModal}
                        friendRequests={this.state.friendRequestsReceived}
                        setModalVisible={visible => this.setModalVisible(visible)}
                        acceptFriendRequest={uid => this.acceptFriendRequest(uid)}
                        denyFriendRequest={uid => this.denyFriendRequest(uid)}
                    />
                </View>
                <Friends />
            </View>
        )

    }
}

const mapStateToProps = (state) => ({
    currentUser: state.currentUser,
})
export default connect(mapStateToProps)(Me);