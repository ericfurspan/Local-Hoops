import firebase from 'react-native-firebase'
import { getGoogleCourtsByLatLong } from '../api-calls/googleplaces';
import geolib from 'geolib';

export const SAVE_COURT_SUCCESS = 'SAVE_COURT_SUCCESS';
export const saveCourtSuccess = () => ({
    type: SAVE_COURT_SUCCESS
})
export const UPDATE_NEARBY_COURTS = 'UPDATE_NEARBY_COURTS';
export const updateNearbyCourts = (courts) => ({
    type: UPDATE_NEARBY_COURTS,
    courts
})
export const REQUEST_NEARBY_COURTS = 'REQUEST_NEARBY_COURTS';
export const requestNearbyCourts = () => ({
    type: REQUEST_NEARBY_COURTS,
    mapLoading: true
})

// Save Court
export const saveCourt = (data) => (dispatch, getState) => {
    // first check firestore to see if a court at this latlong already exists for this user
    // if not, call discoverCourt and send notifcation to firebase admin (me) to review court
    // then call saveCourt to save court id to user document (saved_courts)

    firebase.firestore().collection('courts')
    .add({
        coords: new firebase.firestore.GeoPoint(data.coords.latitude,data.coords.longitude),
        name: data.name,
        discovered_by: { 
            displayName: getState().currentUser.displayName,
            uid: getState().currentUser.uid
        },
        verified: false,
        pinDate: (new Date()).toLocaleDateString('en-US',{year:'2-digit',month:'2-digit',day:'2-digit'}),
    })
    .then((docRef) => {
        console.log(docRef)
        // add document id to object
        firebase.firestore().collection('courts').doc(docRef.id)
        .update({id:docRef.id})

        // make another firebase call to save res.id to users/saved_courts array
        //dispatch(saveCourtSuccess(res));
        //dispatch(getFriends(getState().currentUser.friends))
    })
    .catch( error => {
        console.error(`Error updating document: ${error}`);
        //dispatch(saveCourtError(error));
    });
}

// Updates nearby courts
export const getNearbyCourts = (coords, searchRadius) => async (dispatch) => {
    try {
        dispatch(requestNearbyCourts());
        // Gets courts from Google Places API within searchRadius
        const googleCourts = await getGoogleCourtsByLatLong(coords, searchRadius);

        // Gets courts Firestore within searchRadius
        let courtsRef = firebase.firestore().collection('courts');
        let courtsSnapshot = await courtsRef.get();

        let centerCoords = { latitude: coords.latitude, longitude: coords.longitude };

        let firestoreCourts = courtsSnapshot.docs.filter(doc => {
            let courtCoords = { latitude: doc.data().coords._latitude, longitude: doc.data().coords._longitude };
            let isMatch = geolib.isPointInCircle(
                courtCoords,
                centerCoords,
                searchRadius
            )
            if(isMatch) return true;
            else return false;
        })

        // normalize firestore court objects
        if(firestoreCourts.length > 0) {
            firestoreCourts = firestoreCourts.map(doc => {
                return {
                    ...doc.data(),
                    coords: {
                        latitude: doc.data().coords._latitude,
                        longitude: doc.data().coords._longitude
                    }
                }
            });
        }
        dispatch(updateNearbyCourts([...firestoreCourts, ...googleCourts]));
    } catch(e) {
        console.error(e);
        //dispatch()
    }
}