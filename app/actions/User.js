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

// Add friend
export const addFriend = (userId, friendId) => (dispatch, getState) => {
    dispatch(addFriendRequest());
    
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
            followers: firebase.firestore.FieldValue.arrayRemove(userId)
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
