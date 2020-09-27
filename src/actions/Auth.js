import firebase from '@react-native-firebase/app';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { displayError } from './Feedback';

export const LOGOUT = 'LOGOUT';
export const logout = () => ({
  type: LOGOUT,
});
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const authRequest = () => ({
  type: AUTH_REQUEST,
});
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  user,
});
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const loginError = (message) => ({
  type: LOGIN_ERROR,
  message,
});
export const NEW_USER_REQUEST = 'NEW_USER_REQUEST';
export const newUserRequest = () => ({
  type: NEW_USER_REQUEST,
});
export const NEW_USER_SUCCESS = 'NEW_USER_SUCCESS';
export const newUserSuccess = () => ({
  type: NEW_USER_SUCCESS,
});
export const UPDATE_LOGIN_FORM = 'UPDATE_LOGIN_FORM';
export const updateLoginForm = (field, value) => ({
  type: UPDATE_LOGIN_FORM,
  field,
  value,
});
export const UPDATE_REGISTRATION_FORM = 'UPDATE_REGISTRATION_FORM';
export const updateRegistrationForm = (field, value) => ({
  type: UPDATE_REGISTRATION_FORM,
  field,
  value,
});

export const CreateUserWithEmailPw = (name, email, password) => async (dispatch) => {
  try {
    dispatch(authRequest());
    dispatch(newUserRequest());

    // create user in firebase
    const res = await firebase.auth().createUserWithEmailAndPassword(email, password);

    // create user doc in firestore
    const { uid } = res.user._user;
    const userDoc = {
      uid,
      displayName: name,
      photoURL:
        'https://firebasestorage.googleapis.com/v0/b/local-courts-1536035788302.appspot.com/o/placeholder.png?alt=media&token=f297fe0f-ff64-41c7-a727-8f60e6fa9a07',
      email,
      friends: [],
      status: 'Available',
    };
    await firebase.firestore().doc(`users/${uid}`).set(userDoc);

    return dispatch(newUserSuccess());
  } catch (e) {
    dispatch(displayError(e));
  }
};

export const EmailPwLogin = (email, password) => async (dispatch) => {
  try {
    dispatch(authRequest());

    await firebase.auth().signInWithEmailAndPassword(email, password);

    return dispatch(loginSuccess());
  } catch (e) {
    let errorMessage = e.message;

    // custom error messages
    if (e.code === 'auth/wrong-password') {
      errorMessage = 'Invalid password';
    } else if (e.code === 'auth/user-not-found') {
      errorMessage = 'No user found';
    } else if (e.code === 'auth/user-disabled') {
      errorMessage = 'Sorry, your account has been disabled';
    } else if (e.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    }
    dispatch(loginError(errorMessage));
  }
};

// Facebook Login
export const FacebookLogin = () => (dispatch) => {
  dispatch(authRequest());

  LoginManager.logInWithPermissions(['public_profile', 'email'])
    .then((result) => {
      if (result.isCancelled) {
        dispatch(loginError('Cancelled Facebook login'));
      } else {
        return result;
      }
    })
    .then((result) => {
      if (result) {
        AccessToken.getCurrentAccessToken()
          .then((data) => {
            if (data) {
              const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
              return firebase.auth().signInWithCredential(credential);
            }
          })
          .then((currentUser) => {
            if (currentUser.additionalUserInfo.isNewUser) {
              return dispatch(createUserDoc(currentUser)); // this should create a user object in firestore
            }
          })
          .catch((error) => {
            dispatch(logout());
            dispatch(loginError(`Unable to login with Facebook\n${error}`));
          });
      }
    })
    .catch((error) => {
      dispatch(logout());
      dispatch(loginError(`Unable to login with Facebook\n${error}`));
    });
};

// Google Login
export const GoogleLogin = () => (dispatch) => {
  dispatch(authRequest());

  GoogleSignin.configure();

  GoogleSignin.signIn()
    .then((data) => {
      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      // login with credential
      return firebase.auth().signInWithCredential(credential);
    })
    .then(async (currentUser) => {
      if (currentUser.additionalUserInfo.isNewUser) {
        await dispatch(createUserDoc(currentUser)); // this should create a user object in firestore
        return dispatch(newUserSuccess());
      }
      return currentUser;
    })
    .catch((error) => {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        dispatch(logout());
        dispatch(loginError('Unable to login with Google\nUser cancelled sign in'));
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        dispatch(logout());
        dispatch(loginError('Unable to login with Google\nSign in already in progress'));
      } else {
        dispatch(logout());
        dispatch(loginError(`Unable to login with Google\n${error}`));
      }
    });
};

export const logoutRequest = () => (dispatch) => {
  firebase.auth().signOut();
  dispatch(logout());
};

const createUserDoc = (newUser) => () => {
  const userObj = {
    uid: newUser.user._user.uid,
    displayName: newUser.user._user.displayName,
    photoURL: newUser.user._user.photoURL,
    email: newUser.additionalUserInfo.profile.email,
    friends: [],
    status: 'Available',
  };
  return firebase.firestore().doc(`users/${userObj.uid}`).set(userObj);
};
