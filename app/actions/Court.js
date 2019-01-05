import firebase, { Firebase } from 'react-native-firebase'

export const SAVE_COURT_SUCCESS = 'SAVE_COURT_SUCCESS';
export const saveCourtSuccess = () => ({
    type: SAVE_COURT_SUCCESS
})

// Save Court
export const saveCourt = (data) => (dispatch, getState) => {
    // first check firestore to see if a court at this latlong already exists for this user
    // if not, call discoverCourt and send notifcation to firebase admin (me) to review court
    // then call saveCourt to save court id to user document (saved_courts)

    firebase.firestore().collection('courts')
    .add({
        coords: {latitude: data.lat, longitude: data.long},
        name: data.name,
        discovered_by: {uid:getState().currentUser.uid,displayName:getState().currentUser.displayName},
        verified: false,
        pinDate: new Date()
    })
    .then((res) => {
        // make another firebase call to save res.id to users/saved_courts array
        console.log(res)
        //dispatch(saveCourtSuccess(res));
        //dispatch(getFriends(getState().currentUser.friends))
    })
    .catch( error => {
        console.error(`Error updating document: ${error}`);
        //dispatch(saveCourtError(error));
    });
}