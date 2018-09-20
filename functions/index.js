const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/*
exports.createUser = functions.auth.user().onCreate((user) => {
    // init user in firestore
    const userObj = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        friends: []
    }
    console.log(`Creating new user! ${userObj.displayName}`)
    return admin.firestore().doc(`users/${userObj.uid}`)
     .set(userObj);
});
*/