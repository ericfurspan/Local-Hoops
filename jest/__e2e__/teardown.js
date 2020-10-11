import admin from 'firebase-admin';
import crashlytics from '@react-native-firebase/crashlytics';
import { element, by } from 'detox';
import { expect as UIExpect } from 'detox';

// Tries to delete the test user
const deleteTestUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const usersSnapshot = await admin
        .firestore()
        .collection('users')
        .where('displayName', '==', 'Testy McTest')
        .get();

      const uid = usersSnapshot.docs[0].data().uid;

      await admin.auth().deleteUser(uid);
      await admin.firestore().doc(`users/${uid}`).delete();
      resolve(true);
    } catch (error) {
      crashlytics().recordError(error);
      reject(false);
    }
  });
};

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
};
