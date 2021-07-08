const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.newUserNotification = functions.auth.user()
  .onCreate((user) => {
    const { email } = user;
    console.log(`New user: ${email}`);

    // TODO: log?
  });
