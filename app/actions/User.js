import firebase from 'react-native-firebase'

export const UPDATE_STATUS = 'UPDATE_STATUS';
export const updateStatus = (status) => ({
    type: UPDATE_STATUS,
    status
})
export const UPDATE_FRIENDS = 'UPDATE_FRIENDS';
export const updateFriends = (friend) => ({
    type: UPDATE_FRIENDS,
    friend
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
export const sendFriendRequest = (userId, prospectiveFriendId) => (dispatch) => {
    try {
        // first check if a friend request document already exists
        firebase.firestore().collection(`friendRequests`)
        .where("requesteeId", "==", userId)
        .where("requestorId", "==", prospectiveFriendId)
        .get()
        .then(doc => {
            if(doc.empty) {
                firebase.firestore().collection(`friendRequests`)
                .where("requesteeId", "==", prospectiveFriendId)
                .where("requestorId", "==", userId)
                .get()
                .then(doc => {
                    if(doc.empty) {
                        // no friend request exists yet
                        firebase.firestore().collection('friendRequests')
                        .add({
                            requestorId: userId,
                            requesteeId: prospectiveFriendId,
                            status: 'pending'
                        })
                    } else {
                        dispatch(addFriendError({message: `A friend request already exists`}));
                    }
                })
            } else {
                dispatch(addFriendError({message: `A friend request already exists`}));
            }
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
export const createFriends = (requesteeId, requestorId) => () => {

    // add users to each others friends array
    firebase.firestore().doc(`users/${requesteeId}`)
    .update({
        friends: firebase.firestore.FieldValue.arrayUnion(requestorId)
    })
    .then(() => {
        firebase.firestore().doc(`users/${requestorId}`)
        .update({
            friends: firebase.firestore.FieldValue.arrayUnion(requesteeId)
        })            
    })        
    // update status of document in friendRequests collection
    firebase.firestore().collection('friendRequests')
    .where('requesteeId', '==', requesteeId)
    .where('requestorId', '==', requestorId)
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            doc.ref.update({
                status: 'accepted'
            })
        })
    })    
}

export const cancelFriendRequest = (requesteeId, requestorId) => () => {

    // delete document from friendRequests collection
    firebase.firestore().collection('friendRequests')
    .where('requesteeId', '==', requesteeId)
    .where('requestorId', '==', requestorId)
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            doc.ref.update({
                status: 'declined'
            })
        })
    })
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
export const getFriends = (friendIds) => (dispatch, getState) => {
    friendIds.forEach(uid => {
        firebase.firestore().collection('users').doc(uid)
        .onSnapshot(doc => {
            // make sure friend was not removed before updating
            let stillFriends = doc.data().friends.find(uid=>uid===getState().currentUser.uid);
            if(stillFriends) {
                dispatch(updateFriends(doc.data()))
            } else {
                dispatch(removeFriendSuccess(doc.data().uid));
            }
        })
    })
}

export const updateUserStatus = (status) => (dispatch, getState) => {
    firebase.firestore().doc(`users/${getState().currentUser.uid}`)
    .update({
        status
    })
    .then(() => {
        return dispatch(updateStatus(status))
    })
    .catch(e => console.error(e))
}