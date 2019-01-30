import firebase from 'react-native-firebase'

export const UPDATE_USERLOC = 'UPDATE_USERLOC';
export const updateUserLoc = userLoc => ({
    type: UPDATE_USERLOC,
    userLoc
});

export const UPDATE_FRIENDS = 'UPDATE_FRIENDS';
export const updateFriends = (friends) => ({
    type: UPDATE_FRIENDS,
    friends
})
export const ADD_FRIEND_REQUEST = 'ADD_FRIEND_REQUEST';
export const addFriendRequest = () => ({
    type: ADD_FRIEND_REQUEST
})
export const ADD_FRIEND_SUCCESS = 'ADD_FRIEND_SUCCESS';
export const addFriendSuccess = (friendId) => ({
    type: ADD_FRIEND_SUCCESS,
    friendId
})
export const ADD_FRIEND_ERROR = 'ADD_FRIEND_ERROR';
export const addFriendError = (error) => ({
    type: ADD_FRIEND_ERROR,
    error
})
export const REMOVE_FRIEND_REQUEST = 'REMOVE_FRIEND_REQUEST';
export const removeFriendRequest = () => ({
    type: REMOVE_FRIEND_REQUEST
})
export const REMOVE_FRIEND_SUCCESS = 'REMOVE_FRIEND_SUCCESS';
export const removeFriendSuccess = (friendId) => ({
    type: REMOVE_FRIEND_SUCCESS,
    friendId
})
export const REMOVE_FRIEND_ERROR = 'REMOVE_FRIEND_ERROR';
export const removeFriendError = (error) => ({
    type: REMOVE_FRIEND_ERROR,
    error
})

// Send friend request
export const sendFriendRequest = (userId, prospectiveFriendId) => (dispatch, getState) => {
    try {
        firebase.firestore().collection('friendRequests')
        .add({
            requestorId: userId,
            requesteeId: prospectiveFriendId,
            status: 'pending'
        })
    } catch(e) {
        console.error(e)
    }

    /*
    // get info about prospective friend
    firebase.firestore().doc(`users/${prospectiveFriendId}`)
    .get()
    .then(doc => {
        return {
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL
        }
    }) 
    .then(prospectiveFriend => { // add prospective friends info to users friendRequestsSent collection
        firebase.firestore().doc(`users/${userId}/friendRequestsSent/${prospectiveFriendId}`)
        .set({
            status: 'pending',
            displayName: prospectiveFriend.displayName,
            photoURL: prospectiveFriend.photoURL,
            uid: prospectiveFriendId
        })
        .then(() => { // add current users info to prospective friends friendRequestsSent collection
            firebase.firestore().doc(`users/${prospectiveFriendId}/friendRequestsReceived/${userId}`)
            .set({
                status: 'pending',
                displayName: getState().currentUser.displayName,
                photoURL: getState().currentUser.photoURL,
                uid: userId
            })
        })
    }).catch(e => console.error(e))
    */
}

// Add friend
export const addFriend = (userId, friendId) => (dispatch, getState) => {
    dispatch(addFriendRequest());
    
    // add a document with status flag set to pending 
    // to users/{uid}/friendRequestsReceived/{requestorUid}/ 
    // as well as to users/{requestorUid}/friendRequestsSent/{uid}/

    firebase.firestore().doc(`users/${userId}`)
    .update({
        friends: firebase.firestore.FieldValue.arrayUnion(friendId)
    })
    .then(() => {
        firebase.firestore().doc(`users/${friendId}`)
        .update({
            followers: firebase.firestore.FieldValue.arrayUnion(userId)
        })
    })
    .then(() => {
        dispatch(addFriendSuccess(friendId));
        dispatch(getFriends(getState().currentUser.friends))
    })
    .catch( error => {
        console.error(`Error updating document: ${error}`);
        dispatch(addFriendError());
    });
}

// Remove friend
export const removeFriend = (userId, friendId) => (dispatch, getState) => {
    dispatch(removeFriendRequest());

    firebase.firestore().doc(`users/${userId}`)
    .update({
        friends: firebase.firestore.FieldValue.arrayRemove(friendId)
    })
    .then(() => {
        firebase.firestore().doc(`users/${friendId}`)
        .update({
            friends: firebase.firestore.FieldValue.arrayRemove(userId)
        })
    })
    .then(() => {
        dispatch(removeFriendSuccess(friendId));
        dispatch(getFriends(getState().currentUser.friends))
    })
    .catch( error => {
        console.error(`Error updating document: ${error}`);
        dispatch(removeFriendError());
    });
}

// Get Friends
export const getFriends = (friendIds) => (dispatch) => {
    let counter = 0;
    let friends = [];
    friendIds.forEach(uid => {
        firebase.firestore().collection('users').doc(uid)
        .get()
        .then(doc => {
            friends.push(doc.data());
            counter++;
            if(counter === friendIds.length) {
                dispatch(updateFriends(friends))
            } else {
                console.log(friends.length)
            }
        })
        .catch(e => console.error(e))
    })
}
