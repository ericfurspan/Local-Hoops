import firebase from '@react-native-firebase/app';
import crashlytics from '@react-native-firebase/crashlytics';
import { getGoogleCourtsByLatLong, findLocationByQuery, fetchPlaceDetails } from '../../utils/googleplaces';
import {
  setSavedCourts,
  clearNearbyCourts,
  addSavedCourt,
  removeSavedCourt,
} from '../../utils/actions';

export const handleClearNearbyCourts = (dispatch) => {
  return dispatch(clearNearbyCourts());
};

export const handleGetPlaceDetails = async (placeId) => {
  const res = await fetchPlaceDetails(placeId);

  return res;
}

export const handleGetNearbyCourts = async (dispatch, coords, searchRadius) => {
  await getGoogleCourtsByLatLong(coords, searchRadius, dispatch);
};

export const handleGetCoordsForQuery = async (dispatch, searchInput) => {
  const res = await findLocationByQuery(searchInput);

  return res;
};

export const handleCreateCourt = async (court) => {
  try {
    const { name, coords } = court;

    // set the new court document
    await firebase
      .firestore()
      .collection('courts')
      .doc(court.id)
      .set({
        id: court.id,
        name,
        coords: new firebase.firestore.GeoPoint(coords.latitude, coords.longitude),
        photoUrls: court.photoUrls || [],
        discoveredBy: court.discoveredBy,
        pinDate: new Date().toLocaleDateString('en-US', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        }),
      });
  } catch (error) {
    crashlytics().recordError(error);
  }
};

export const handleSaveFavoriteCourt = async (dispatch, uid, court) => {
  try {
    // first add court to firestore if does not yet exist
    const courtDoc = await firebase.firestore().doc(`courts/${court.id}`).get();
    if (!courtDoc.exists) {
      await handleCreateCourt(court);
    }

    // add court id to users saved_courts
    await firebase
      .firestore()
      .doc(`users/${uid}`)
      .update({
        saved_courts: firebase.firestore.FieldValue.arrayUnion(court.id),
      });

    return dispatch(addSavedCourt(court));
  } catch (error) {
    crashlytics().recordError(error);
  }
};

export const handleUnsaveFavoriteCourt = async (dispatch, uid, courtId) => {
  try {
    await firebase
    .firestore()
    .doc(`users/${uid}`)
    .update({
      saved_courts: firebase.firestore.FieldValue.arrayRemove(courtId),
    });

    return dispatch(removeSavedCourt(courtId));
  } catch (error) {
    crashlytics().recordError(error);
  }
};

export const handleGetSavedCourts = async (dispatch, savedCourtIds) => {
  try {
    if (savedCourtIds && savedCourtIds.length > 0) {
      const savedCourts = await Promise.all(
        savedCourtIds.map(async (courtId) => {
          const doc = await firebase.firestore().doc(`courts/${courtId}`).get();
          const { coords } = doc.data();
          return {
            ...doc.data(),
            coords: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
          };
        })
      );
  
      return dispatch(setSavedCourts(savedCourts.filter((c) => c)));
    }
  } catch (error) {
    crashlytics().recordError(error);
  }
};

export const handleLogout = (dispatch, initialProps) => {
  const { navigation } = initialProps;

  firebase.auth().signOut();
  return navigation.navigate('AuthLanding');
};
