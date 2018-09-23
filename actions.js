import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase'

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
export const loginError = () => ({
    type: LOGIN_ERROR
});
export const UPDATE_EVENTS = 'UPDATE_EVENTS';
export const updateEvents = (category, events) => ({
    type: UPDATE_EVENTS,
    events,
    category
})
export const UPDATE_EVENTS_REQUEST = 'UPDATE_EVENTS_REQUEST';
export const updateEventsRequest = () => ({
    type: UPDATE_EVENTS_REQUEST,
})
export const UPDATE_FRIENDS = 'UPDATE_FRIENDS';
export const updateFriends = (friends) => ({
    type: UPDATE_FRIENDS,
    friends
})

// Facebook Login
export const FacebookLogin = () => (dispatch, getState) => {

    dispatch(loginRequest());

      return LoginManager.logInWithReadPermissions(['public_profile', 'email'])
        .then((result) => {
            if(result.isCancelled) {
                console.log('User cancelled facebook login')
            } else {
                console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
            }
        })
        .then(() => {
            AccessToken.getCurrentAccessToken()
                .then(data => {
                    if(!data) {
                        console.error('Something went wrong obtaining the users access token');
                    } else {
                        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                        return firebase.auth().signInAndRetrieveDataWithCredential(credential);
                    }
                })
                .then((currentUser) => {
                    if(currentUser.additionalUserInfo.isNewUser) {
                        return dispatch(createUserDoc(currentUser)) // this should create a user object in firestore
                    }
                })
                .catch(error => {
                    throw 'Something went wrong trying to signInAndRetrieveDataWithCredential'
                })
        })
        .catch(error => {
            console.error(`Failed logging into facebook`)
        })
  }

// Google Login
export const GoogleLogin = () => (dispatch, getState) => {
      dispatch(loginRequest());

      GoogleSignin.configure();
  
      GoogleSignin.signIn()
        .then(data => {
            // create a new firebase credential with the token  
            const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
            // login with credential
            return firebase.auth().signInAndRetrieveDataWithCredential(credential);
        })
        .then(currentUser => {
            if(currentUser.additionalUserInfo.isNewUser) {
                return dispatch(createUserDoc(currentUser)) // this should create a user object in firestore
            }
            return currentUser
        })
        .catch(error => {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.error('user cancelled the login flow')
              } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                console.error('operation (f.e. sign in) is in progress already')
              } 
            dispatch(loginError(e));
            console.error(e);
        })
  }
  
  export const GoogleLogout = () => (dispatch, getState) => {
    return GoogleSignin.revokeAccess()
        .then(() => {
            GoogleSignin.signOut()
                .then(() => {
                    dispatch(logout())
                })
        })
        .catch(e => console.error(e))
  };

  const createUserDoc = (newUser) => () => {
    const userObj = {
        uid: newUser.user._user.uid,
        displayName: newUser.user._user.displayName,
        photoURL: newUser.user._user.photoURL,
        email: newUser.additionalUserInfo.profile.email,
        friends: [],
    }
    return firebase.firestore().doc(`users/${userObj.uid}`)
      .set(userObj)
}