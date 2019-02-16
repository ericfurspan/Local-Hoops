const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const helper = require('./helper');

admin.initializeApp();

// handles opening friend requests
// sends notification
exports.openFriendRequest = functions.firestore.document('friendRequests/{requestId}')
  .onCreate(async (snapshot, context) => {

    try {
      const requestId = context.params.requestId;
      const data = snapshot.data();

      if(data && data.status === 'pending') {

        let notificationRecipientId, title, body;

        // get name of requestor
        const nameSnapshot = await admin.firestore().doc(`users/${data.requestorId}`).get();
        const requestorName = nameSnapshot.data().displayName;

        notificationRecipientId = data.requesteeId;
        title = `New friend request`;
        body = `${requestorName} wants to be friends`;

        // get fcmToken for notification recipient
        const tokenSnapshot = await admin.firestore().doc(`users/${notificationRecipientId}`).get();
        const fcmToken = tokenSnapshot.data().fcmToken;

        // send notification
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
          }
          // send notification
          await admin.messaging().send(notification);
          console.log(`Successfully sent notification to ${notificationRecipientId}`);
        }
      } else {
        return console.error(`Something went wrong. No data found for requestId: ${requestId}`);
      }
    } catch(e) {
      console.error(e);
    }
  });

// handles closing friend requests
// sends notification and deletes friend request document
exports.closeFriendRequest = functions.firestore.document('friendRequests/{requestId}')
  .onUpdate(async (change, context) => {

    try {
      const requestId = context.params.requestId;
      const beforeData = change.before.exists ? change.before.data() : null;
      const afterData = change.after.exists ? change.after.data() : null;

      let notificationRecipientId, title, body;

      // get name of requestee
      const nameSnapshot = await admin.firestore().doc(`users/${afterData.requesteeId}`).get();
      const requesteeName = nameSnapshot.data().displayName;

      if(beforeData && beforeData.status === 'pending' && afterData) {
      // delete document
        admin.firestore().doc(`friendRequests/${requestId}`)
          .delete();

        // set notification recipient
        notificationRecipientId = afterData.requestorId;

        if(afterData.status === 'accepted') {         // request Accepted
          title = `New friend`;
          body = `${requesteeName} has accepted your friend request`;
        } else if(afterData.status === 'declined') {  // request DECLINED
          title = `Declined friend request`;
          body = `${requesteeName} has declined your friend request`;
        }
        // get fcmToken for notification recipient
        const tokenSnapshot = await admin.firestore().doc(`users/${notificationRecipientId}`).get();
        const fcmToken = tokenSnapshot.data().fcmToken;

        // send notification
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
          }
          // send notification
          await admin.messaging().send(notification);
          console.log(`Successfully sent notification to ${notificationRecipientId}`);
        }
      } else {
        return console.error(`Something went wrong. No data found for requestId: ${requestId}`);
      }
    } catch(e) {
      console.error(e);
    }
  });

exports.newEventNotification = functions.firestore.document('events/{eventId}')
  .onCreate(async (snapshot) => {

    try {
      const data = snapshot.data();
      const participants = data.participants.filter(uid => uid !== data.event_author);

      // get name of event_author
      const nameSnapshot = await admin.firestore().doc(`users/${data.event_author}`).get();
      const authorName = nameSnapshot.data().displayName;

      for(let i=0;i<participants.length;i++) {

        const notificationRecipientId = participants[i];
        const title = `New ${data.type}`;
        const body = `${authorName} tagged you in an event`;

        // get fcmToken for notification recipient
        const tokenSnapshot = await admin.firestore().doc(`users/${notificationRecipientId}`).get();
        const fcmToken = tokenSnapshot.data().fcmToken;

        // send notification
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
          }
          // send notification
          await admin.messaging().send(notification);
          console.log(`Successfully sent notification to ${notificationRecipientId}`);
        }
      }
    } catch(e) {
      console.error(e);
    }
  })