const functions = require('firebase-functions');
const admin = require('firebase-admin');
//const helper = require('./helper');

admin.initializeApp();


exports.sendFriendRequestNotification = functions.firestore.document('friendRequests/{requestId}')
.onWrite(async (change, context) => {

  const requestId = context.params.requestId;
  const beforeData = change.before.exists ? change.before.data() : null;
  const afterData = change.after.exists ? change.after.data() : null;

  let notificationRecipientId, title, body;  

  // get name of requestee
  const nameSnapshot = await admin.firestore().doc(`users/${afterData.requesteeId}`).get();
  const requesteeName = nameSnapshot.data().displayName;

  if(afterData && afterData.status === 'pending') {

    notificationRecipientId = afterData.requesteeId;
    title = `New friend request`;
    body = `${requesteeName} wants to be friends`;

  } else if(beforeData && beforeData.status === 'pending' && afterData) {
    // delete document
    admin.firestore().doc(`friendRequests/${requestId}`)
    .delete();

    if(afterData.status === 'accepted') {

      notificationRecipientId = afterData.requestorId;
      title = `New friend`;
      body = `${requesteeName} has accepted your friend request`;

    } else if(afterData.status === 'declined') {

      notificationRecipientId = afterData.requestorId;
      title = `Declined friend request`;
      body = `${requesteeName} has declined your friend request`;
    }
  }
  
  // get fcmToken for notification recipient
  const tokenSnapshot = await admin.firestore().doc(`users/${notificationRecipientId}`).get();
  const fcmToken = tokenSnapshot.data().fcmToken;

  if(fcmToken) {
    // build the notification
    const notification = {
      "notification": {
        "title": title,
        "body": body,
      },
      "apns": {
        "payload": {
          "aps": {
            "content-available": 1,
            "alert": {
              "body": body,
            },
            "badge": 0                      
          }
        }
      },
      "token": fcmToken
    };

    // send notification
    await admin.messaging().send(notification);
    console.log(`Successfully sent notification: ${{...notification}}`);
  }
})

// monitors friend requests and dispatches notifications
exports.handleFriendRequests = functions.firestore.document('users/{userId}/{collectionType}/{prospectiveFriendId}')
  .onWrite(async (change, context) => {
    const userId = context.params.userId; // The userId in the Path.
    const collectionType = context.params.collectionType;
    const prospectiveFriendId = context.params.prospectiveFriendId;
    const newStatus = change.after.data().status;
    
    let tokenSnapshot, fcmToken, title, body, prospectiveFriendName;

    try {
      // get name of prospective friend
      const nameSnapshot = await admin.firestore().doc(`users/${prospectiveFriendId}`).get();
      prospectiveFriendName = nameSnapshot.data().displayName;
    
      let notificationRecipientId;
      if(collectionType === 'friendRequestsSent') {
        notificationRecipientId = prospectiveFriendId;
      } else if(collectionType === 'friendRequestsReceived') {
        notificationRecipientId = userId;
      }

      if(newStatus === 'pending') {                // REQUEST PENDING
        // build notification to userId that prospectiveFriendId has requested to be friends
        title = `New friend request`;
        body = `${prospectiveFriendName} wants to be friends`;
      } else if(newStatus === 'accepted') {        // REQUEST ACCEPTED
        // delete both users friend request documents
        await admin.firestore().doc(`users/${prospectiveFriendId}/friendRequestsReceived/${userId}`)
        .delete();
        await admin.firestore().doc(`users/${userId}/friendRequestsSent/${prospectiveFriendId}`)
        .delete();

        // add both users to each others `friends` array
        await admin.firestore().doc(`users/${prospectiveFriendId}`)
        .update({
          friends: admin.firestore.FieldValue.arrayUnion(userId)
        })
        await admin.firestore().doc(`users/${userId}`)
        .update({
          friends: admin.firestore.FieldValue.arrayUnion(prospectiveFriendId)
        })     

        // build notification to userId that prospectiveFriendId has accepted friend request
        title = `New friend`;
        body = `${prospectiveFriendName} has accepted your friend request`;
      } else if(newStatus === 'cancelled') {        // REQUEST CANCELLED
        // delete friend request docs
        await admin.firestore().doc(`users/${prospectiveFriendId}/friendRequestsSent/${prospectiveFriendId}`)
        .delete();
        await admin.firestore().doc(`users/${userId}/friendRequestsReceived/${userId}`)
        .delete();
        
        // build notification to userId that prospectiveFriendId has denied friend request
        title = `Declined friend request`;
        body = `${prospectiveFriendName} has declined your friend request`;
      }

      // get fcmToken for notification recipient
      tokenSnapshot = await admin.firestore().doc(`users/${notificationRecipientId}`).get();
      fcmToken = tokenSnapshot.data().fcmToken;

      if(fcmToken) {
        // build the notification
        const notification = {
          "notification": {
            "title": title,
            "body": body,
          },
          "apns": {
            "payload": {
              "aps": {
                "content-available": 1,
                "alert": {
                  "body": body,
                },
                "badge": 0                      
              }
            }
          },
          "token": fcmToken
        };

        // send notification
        await admin.messaging().send(notification);
        console.log(`Successfully sent notification: ${{...notification}}`);
      }
    } catch(error) {
      console.error(error);
    }
    
  })