import firebase from 'react-native-firebase'
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

export const LOGOUT = 'LOGOUT';
export const logout = () => ({
    type: LOGOUT
});
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const loginRequest = () => ({
    type: LOGIN_REQUEST
});
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    user
});
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const loginError = (message) => ({
    type: LOGIN_ERROR,
    message
});

// Facebook Login
export const FacebookLogin = () => (dispatch) => {
    dispatch(loginRequest());
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
    .then((result) => {
        if(result.isCancelled) {
            dispatch(loginError(`Cancelled Facebook login`));
        } else {return result}
    })
    .then((result) => {
        if(result) {
            AccessToken.getCurrentAccessToken()
                .then(data => {
                    if(data) {
                        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                        return firebase.auth().signInWithCredential(credential);           
                    }
                })
                .then((currentUser) => {
                    if(currentUser.additionalUserInfo.isNewUser) {
                        return dispatch(createUserDoc(currentUser)) // this should create a user object in firestore
                    }
                })
                .catch(error => {
                    console.log(error)
                    dispatch(logout());
                    dispatch(loginError(`Unable to login with Facebook\n${error}`));
                })
        }
    })
    .catch(error => {
        console.log(error)
        dispatch(logout());
        dispatch(loginError(`Unable to login with Facebook\n${error}`));
    })
  }

// Google Login
export const GoogleLogin = () => (dispatch) => {
    dispatch(loginRequest());

    GoogleSignin.configure();

    GoogleSignin.signIn()
    .then(data => {
        // create a new firebase credential with the token  
        const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
        // login with credential
        return firebase.auth().signInWithCredential(credential);
    })
    .then(currentUser => {
        if(currentUser.additionalUserInfo.isNewUser) {
            return dispatch(createUserDoc(currentUser)) // this should create a user object in firestore
        }
        return currentUser
    })
    .catch(error => {
        if(error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                dispatch(logout());
                dispatch(loginError(`Unable to login with Google\nUser cancelled sign in`));
            } else if(error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                console.error('operation (f.e. sign in) is in progress already')
                dispatch(logout());
                dispatch(loginError(`Unable to login with Google\nSign in already in progress`));
            } else {
                console.error(error)
                dispatch(logout());
                dispatch(loginError(`Unable to login with Google\n${error}`));
            }
    })
  }
  /*
  export const GoogleLogout = () => (dispatch, getState) => {
    return GoogleSignin.revokeAccess()
        .then(() => {
            console.log(GoogleSignin)
            GoogleSignin.signOut()
                .then(() => {
                    dispatch(logout())
                })
        })
        .catch(e => console.error(e))
  };
*/
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
        status: 'Available'
    }
    return firebase.firestore().doc(`users/${userObj.uid}`)
      .set(userObj)
}