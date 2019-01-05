const functions = require('firebase-functions');
const admin = require('firebase-admin');
let helper = require('./helper');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

/*
exports.sendEventNotification = functions.firestore.document('/events/{eventId}')
  .onWrite((change, context) => {
    const beforeData = change.before.data(); // data before the write
    const afterData = change.after.data(); // data after the write
    const eventId = context.params.eventId; // The eventId in the Path.
    console.log(beforeData)
    console.log(afterData)
    console.log(eventId)

    let message = {
        data: {
          score: '123',
          time: '2:45'
        },
        topic: 'nyc'
    };

    return admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      return true
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});
*/
// sends notification to user when they have been followed or unfollowed
exports.sendFollowerNotification = functions.firestore.document('/users/{userId}')
  .onWrite(async (change, context) => {
    const userId = context.params.userId; // The eventId in the Path.

    const beforeFollowers = change.before.data().followers;
    const afterFollowers = change.after.data().followers;

    if(beforeFollowers === afterFollowers) {
      return 0 // exit because nothing changed
    }

    // determine what changed
    let diffUID = helper.diff(beforeFollowers, afterFollowers);

    try {
      let title, body;

      const nameSnapshot = await admin.firestore().doc(`users/${diffUID}`).get();
      const name = nameSnapshot.data().displayName;

      if(beforeFollowers.length < afterFollowers.length) {
          // follower added
          title = `You have a new follower`;
          body = `${name} has followed you on LocalBall`;
      } else if(beforeFollowers.length > afterFollowers.length) {
          // follower removed
          title = `You have been unfollowed`;
          body = `${name} has unfollowed you on LocalBall`;
      } else {
        return 0;
      }

      // get fcmToken of the user who has been followed/unfollowed
      const tokenSnapshot = await admin.firestore().doc(`users/${userId}`).get();
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
                }                      
              }
            }
          },
          "token": fcmToken
        };

        // send notification
        const response = await admin.messaging().send(notification);
        console.log(`Successfully sent notification: ${{...notification}}`);
      } else {
        throw new Error(`No fcmToken found for ${name}`);
      }
    } catch(error) { // handle any errors
      console.log(error)
      return error;
    }
});
    
/*
const notification = new firebase.notifications.Notification()
  .setNotificationId('notificationId')
  .setTitle('My notification title')
  .setBody('My notification body')
  .setData({
    key1: 'value1',
    key2: 'value2',
  });

  firebase.notifications().displayNotification(notification)

  */