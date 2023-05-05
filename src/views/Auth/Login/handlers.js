import firebase from '@react-native-firebase/app';
import { Alert } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { setCurrentUser } from '../../../utils/actions';
import { AVATAR_PLACEHOLDER_URL } from '../../../utils/constants';

export const handleEmailPwLogin = async (email, password, dispatch, initialProps) => {
  const { navigation } = initialProps;

  try {
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);
    const userObj = compileUserObj(user);

    dispatch(setCurrentUser(userObj));
    return navigation.navigate('App');
  } catch (error) {
    crashlytics().recordError(error);
    if (error.code === 'auth/wrong-password') {
      Alert.alert('Login Failed', 'Invalid password');
    } else if (error.code === 'auth/user-not-found') {
      Alert.alert('Login Failed', 'No user found');
    } else if (error.code === 'auth/user-disabled') {
      Alert.alert('Login Failed', 'Sorry, your account has been disabled');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Login Failed', 'Invalid email address');
    }
  }
};

const compileUserObj = (userData) => ({
  uid: userData.user._user.uid,
  displayName: userData.user._user.displayName || userData.additionalUserInfo.profile.email,
  photoURL: userData.user._user.photoURL || AVATAR_PLACEHOLDER_URL,
  email: userData.additionalUserInfo.profile.email,
});
