import firebase from 'react-native-firebase'
import { getGoogleCourtsByLatLong } from '../api-calls/googleplaces';
import geolib from 'geolib';
import { displayError } from './Misc';

export const ADD_COURT_SUCCESS = 'ADD_COURT_SUCCESS';
export const addCourtSuccess = () => ({
  type: ADD_COURT_SUCCESS
})
export const ADD_COURT_ERROR = 'ADD_COURT_ERROR';
export const addCourtError = (error) => ({
  type: ADD_COURT_ERROR,
  error
})
export const UPDATE_NEARBY_COURTS = 'UPDATE_NEARBY_COURTS';
export const updateNearbyCourts = (courts) => ({
  type: UPDATE_NEARBY_COURTS,
  courts
})
export const REQUEST_NEARBY_COURTS = 'REQUEST_NEARBY_COURTS';
export const requestNearbyCourts = () => ({
  type: REQUEST_NEARBY_COURTS,
})
export const FAILED_NEARBY_COURTS = 'FAILED_NEARBY_COURTS';
export const failedNearbyCourts = () => ({
  type: FAILED_NEARBY_COURTS,
})

export const UPDATE_SAVED_COURTS = 'UPDATE_SAVED_COURTS';
export const updateSavedCourts = savedCourts => ({
  type: UPDATE_SAVED_COURTS,
  savedCourts
})
export const SAVE_COURT_SUCCESS = 'SAVE_COURT_SUCCESS';
export const saveCourtSuccess = (courtId) => ({
  type: SAVE_COURT_SUCCESS,
  courtId
})
export const UNSAVE_COURT_SUCCESS = 'UNSAVE_COURT_SUCCESS';
export const unSaveCourtSuccess = (courtId) => ({
  type: UNSAVE_COURT_SUCCESS,
  courtId
})
export const GET_SAVED_COURTS_ERROR = 'GET_SAVED_COURTS_ERROR';
export const getSavedCourtsError = () => ({
  type: GET_SAVED_COURTS_ERROR,
})
export const TRY_GET_SAVED_COURTS = 'TRY_GET_SAVED_COURTS';
export const tryGetSavedCourts = () => ({
  type: TRY_GET_SAVED_COURTS,
})

// Get saved courts
export const getSavedCourts = () => async (dispatch, getState) => {
  dispatch(tryGetSavedCourts());
  try {
    const savedCourtIds = getState().currentUser.saved_courts;
    if(savedCourtIds && savedCourtIds.length > 0) {
      const savedCourts = await Promise.all(savedCourtIds.map(async courtId => {
        const doc = await firebase.firestore().doc(`courts/${courtId}`).get();
        return {
          ...doc.data(),
          coords: {
            latitude: doc.data().coords.latitude,
            longitude: doc.data().coords.longitude
          }
        }
      }))
      return dispatch(updateSavedCourts(savedCourts.filter(c=>c)));
    }
  } catch(e) {
    dispatch(getSavedCourtsError());
    dispatch(displayError(e))
  }
}

// Save court for user
// Also saves new court to system if doesn't already exist
export const trySaveCourt = (court) => async (dispatch, getState) => {

  if(court.id) {
    try {
      // if a new court, add to firestore
      let courtDoc = await firebase.firestore().doc(`courts/${court.id}`).get();
      if(!courtDoc.exists) {
        dispatch(addCourt(court))
      }

      // update users firestore doc w/ court.id
      await firebase.firestore().doc(`users/${getState().currentUser.uid}`)
        .update({
          saved_courts: firebase.firestore.FieldValue.arrayUnion(court.id)
        })

      await dispatch(saveCourtSuccess(court.id));
      dispatch(getSavedCourts());
    } catch(e) {
      dispatch(displayError(e))
    }
  }
}

// Unsave court for user
export const unSaveCourt = (courtId) => async (dispatch, getState) => {
  try {
    await firebase.firestore().doc(`users/${getState().currentUser.uid}`)
      .update({
        saved_courts: firebase.firestore.FieldValue.arrayRemove(courtId)
      })
    await dispatch(unSaveCourtSuccess(courtId))
    dispatch(getSavedCourts());
  } catch(e) {
    dispatch(displayError(e))
  }
}

// Add new Court
export const addCourt = (data) => (dispatch, getState) => {
  try {
    let courtId;
    // if court does not yet have an ID, create one
    if(!data.id) {
      courtId = firebase.firestore().collection('courts').doc().id;
    } else {
      courtId = data.id;
    }
    firebase.firestore().collection('courts').doc(courtId)
      .set({
        coords: new firebase.firestore.GeoPoint(data.coords.latitude,data.coords.longitude),
        name: data.name,
        discovered_by: {  // if court from 3rd source (i.e Google Places), use the displayName given from UI and the current users id
          displayName: data.discovered_by ? data.discovered_by.displayName : getState().currentUser.displayName,
          uid: getState().currentUser.uid
        },
        verified: false,
        id: courtId,
        pinDate: (new Date()).toLocaleDateString('en-US',{year: '2-digit',month: '2-digit',day: '2-digit'}),
      })

    dispatch(addCourtSuccess());
    dispatch(getNearbyCourts())
  } catch(e) {
    dispatch(addCourtError(e));
  }

}

// Updates nearby courts
export const getNearbyCourts = (coords, searchRadius = 15000) => async (dispatch, getState) => {
  try {
    if(!coords) {
      coords = getState().location;
    }

    let nearbyCourts = [];

    dispatch(requestNearbyCourts());

    // Gets courts Firestore within searchRadius
    let courtsRef = firebase.firestore().collection('courts');
    let courtsSnapshot = await courtsRef.get();
    let centerCoords = { latitude: coords.latitude, longitude: coords.longitude };
    let firestoreCourts = courtsSnapshot.docs.filter(doc => {
      let courtCoords = { latitude: doc.data().coords.latitude, longitude: doc.data().coords.longitude };
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
            latitude: doc.data().coords.latitude,
            longitude: doc.data().coords.longitude
          }
        }
      });
      // add firestore courts to nearby courts
      nearbyCourts.push(...firestoreCourts);
    }
    const firestoreCourtIds = firestoreCourts.map(c=>c.id);

    // Gets courts from Google Places API within searchRadius
    const res = await getGoogleCourtsByLatLong(coords, searchRadius);
    if(res.error) {
      // failed API call
      dispatch(displayError(res.message));
    } else {
      // success, add google courts to nearby courts
      // but first remove any google courts which are already pulled in from firestore
      // this prevents duplicate places on map but will ensure other users see the google court
      // even if they have not saved it

      let cleanedRes = [];

      // no saved courts, no cleaning necessary - add all courts from Google
      if(!firestoreCourtIds) {
        cleanedRes = res;
      } else { // some saved courts, make sure not to include any google courts that are already saved to firestore
        res.length > 0 && res.forEach(court => {
          if( !(firestoreCourtIds.includes(court.id)) ) {
            cleanedRes.push(court);
          }
        })
      }
      nearbyCourts.push(...cleanedRes);
    }
    dispatch(updateNearbyCourts(nearbyCourts));
  } catch(e) {
    dispatch(displayError(e))
    dispatch(failedNearbyCourts());
  }
}