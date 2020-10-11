import firebase from '@react-native-firebase/app';
import { Alert } from 'react-native';
import { AVATAR_PLACEHOLDER_URL } from '../../../utils/constants';

export const handleCreateEmailPwUser = async (
  name,
  email,
  password,
  passwordConfirm,
  dispatch,
  initialProps
) => {
  try {
    const validated = validateSubmission(name, email, password, passwordConfirm);

    if (validated.isValid) {
      const res = await firebase.auth().createUserWithEmailAndPassword(email, password);

      const { uid } = res.user._user;
      const userDoc = {
        uid,
        displayName: name,
        photoURL: AVATAR_PLACEHOLDER_URL,
        email,
      };
      await firebase.firestore().doc(`users/${uid}`).set(userDoc);
    } else {
      Alert.alert('Signup Failed', validated.message);
    }
  } catch (error) {
    Alert.alert('Signup Failed', error.message);
  }
};

const validateSubmission = (name, email, password, passwordConfirm) => {
  if (password !== passwordConfirm) {
    const msg = 'Passwords must match';
    return { message: msg, isValid: false };
  }
  if (name && name.length < 3) {
    const msg = 'Please enter a longer name';
    return { message: msg, isValid: false };
  }
  if (!password || password.length < 1) {
    const msg = 'Please enter a password';
    return { message: msg, isValid: false };
  }

  return { isValid: true };
};
