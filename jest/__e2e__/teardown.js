const { element, by } = require('detox');
import { expect as UIExpect } from 'detox';

// Initialize slack webhook
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const url = "https://hooks.slack.com/services/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";
const webhook = new IncomingWebhook(url);

// Initialize firebase admin
const admin = require('firebase-admin');
const { FIREBASE_SERVICE_ACCOUNT, FIREBASE_DB_URL } = require("../../config");
admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
  databaseURL: FIREBASE_DB_URL
});

const sendSlackNotification = (message) => {
  webhook.send(message);
}

// Returns a promise
// Tries to delete the test user:: Testy McTest
const deleteTestUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const usersSnapshot = await admin.firestore().collection(`users`)
        .where("displayName", "==", "Testy McTest")
        .get();

      const uid = usersSnapshot.docs[0].data().uid;

      await admin.auth().deleteUser(uid);
      await admin.firestore().doc(`users/${uid}`).delete();
      resolve(true);
    } catch(e) {
      sendSlackNotification('JEST ALERT: deleteTestUser rejected');
      reject(false)
    }
  });
}

export const teardown = () => {
  it('Should logout and reroute to auth landing', async () => {
    await UIExpect(element(by.id('AccountButton'))).toExist();
    await element(by.id('AccountButton')).tap();
    await element(by.id('Logout')).tap();
    await UIExpect(element(by.id('enterLogin'))).toBeVisible();
  });

  it('Should delete test@test.com', async () => {
    const res = await deleteTestUser();
    expect(res).toBe(true);
  });
}