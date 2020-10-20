import firebase from '@react-native-firebase/app';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Alert } from 'react-native';
import { setCurrentUser } from '../../../utils/actions';
import { AVATAR_PLACEHOLDER_URL } from '../../../utils/constants';

export const handleAppleLogin = async (dispatch, initialProps) => {
  try {
    const { navigation } = initialProps;

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!appleAuthRequestResponse.identityToken) {
      Alert.alert('Apple Sign-In failed', 'No identify token returned');
    }

    const { identityToken, nonce } = appleAuthRequestResponse;

    const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);

    const user = await firebase.auth().signInWithCredential(appleCredential);

    const userObj = compileUserObj(user);

    if (user.additionalUserInfo.isNewUser) {
      await createNewUser(userObj);
    }

    dispatch(setCurrentUser(userObj));
    return navigation.navigate('App');
  } catch (error) {
    console.log('handleAppleLogin error', error);
  }
};

export const handleGoogleLogin = async (dispatch, initialProps) => {
  const { navigation } = initialProps;

  try {
    GoogleSignin.configure();

    const res = await GoogleSignin.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(res.idToken, res.accessToken);
    const user = await firebase.auth().signInWithCredential(credential);

    const userObj = compileUserObj(user);

    if (user.additionalUserInfo.isNewUser) {
      await createNewUser(userObj);
    }

    dispatch(setCurrentUser(userObj));
    return navigation.navigate('App');
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert('Login Failed', 'Unable to login with Google\nUser cancelled sign in');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      Alert.alert('Login Failed', 'Unable to login with Google\nSign in already in progress');
    } else {
      Alert.alert('Login Failed', `Unable to login with Google\n${error}`);
    }
  }
};

export const handleFacebookLogin = async (dispatch, initialProps) => {
  const { navigation } = initialProps;

  try {
    const res = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (res.isCancelled) {
      Alert.alert('Login Failed', 'Cancelled Facebook login');
    } else {
      if (res) {
        const authResponse = await AccessToken.getCurrentAccessToken();

        if (authResponse) {
          const credential = firebase.auth.FacebookAuthProvider.credential(
            authResponse.accessToken
          );
          const user = await firebase.auth().signInWithCredential(credential);

          const userObj = compileUserObj(user);

          if (user.additionalUserInfo.isNewUser) {
            await createNewUser(userObj);
          }

          dispatch(setCurrentUser(userObj));
          return navigation.navigate('App');
        }
      }
    }
  } catch (error) {
    Alert.alert('Login Failed', `Alert Unable to login with Facebook\n${error}`);
  }
};

const compileUserObj = (userData) => ({
  uid: userData.user._user.uid,
  displayName: userData.user._user.displayName || userData.additionalUserInfo.profile.email,
  photoURL: userData.user._user.photoURL || AVATAR_PLACEHOLDER_URL,
  email: userData.additionalUserInfo.profile.email,
});

const createNewUser = async (userObj) => {
  await firebase.firestore().doc(`users/${userObj.uid}`).set(userObj);
};
