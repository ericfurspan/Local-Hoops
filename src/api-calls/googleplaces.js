// Place Search - https://developers.google.com/places/web-service/search
// Place Details - https://developers.google.com/places/web-service/details

import { GOOGLE_API_KEY } from '../../config';
import crashlytics from '@react-native-firebase/crashlytics';

export const getGoogleCourtsByLatLong = async (coords, searchRadius) => {
  try {
    const searchUrl = `
      https://maps.googleapis.com/maps/api/place/nearbysearch/json?
        location=${coords.latitude},${coords.longitude}
        &keyword=basketballcourt
        &radius=${searchRadius}
        &rankby=prominence
        &key=${GOOGLE_API_KEY}
      `;

    const res = await fetch(searchUrl);
    if (res.ok && res.status === 200) {
      const json = await res.json();
      const courtData = json.results.map((court) => {
        return {
          coords: {
            latitude: court.geometry.location.lat,
            longitude: court.geometry.location.lng,
          },
          name: court.name,
          location: court.vicinity,
          id: court.place_id,
          discovered_by: {
            displayName: 'Google Places',
            uid: null,
          },
          verified: false,
        };
      });
      const updatedCourtData = await addCourtDetail(courtData);
      return updatedCourtData;
    } else {
      crashlytics().recordError(res);
      return { error: true, message: 'Uh Oh! Failed to reach Google API' };
    }
  } catch (error) {
    crashlytics().recordError(error);
    return error;
  }
};

export const findLocationByQuery = async (query, callback) => {
  try {
    const searchQuery = encodeURIComponent(query.trim());
    const geocodeUrl = `
      https://maps.googleapis.com/maps/api/geocode/json?
        address=${searchQuery}
        &key=${GOOGLE_API_KEY}
      `;
  
    const res = await fetch(geocodeUrl);
    if (res.ok && res.status === 200) {
      const json = await res.json();
      return callback(
        {
          latitude: json.results[0].geometry.location.lat,
          longitude: json.results[0].geometry.location.lng,
        },
        true
      );
    } else {
      crashlytics().recordError(res);
      return { error: true, message: 'Uh Oh! Failed to reach Google API' };
    }
  } catch (error) {
    crashlytics().recordError(error);
    return error;
  }
};

// Place Details
const addCourtDetail = async (courtData) => {
  try {
    const updatedCourtData = [];

    for (let i = 0; i < courtData.length; i++) {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${courtData[i].id}&fields=formatted_address,url,photo&key=${GOOGLE_API_KEY}`;
      const res = await fetch(searchUrl);
      if (res.ok && res.status === 200) {
        const json = await res.json();
        const updatedCourt = {
          ...courtData[i],
          address: json.result.formatted_address,
          gMapsUrl: json.result.url,
        };
        updatedCourtData.push(updatedCourt);
      } else {
        return { error: true, message: 'Uh Oh! Failed to reach Google API' };
      }
    }
    return updatedCourtData;
  } catch (e) {
    return e;
  }
};

/*
// Return City, State from latlong
const getCityAndState = (lat, long) => {
    //const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&keyword=basketballcourt&radius=${searchRadius}&rankby=prominence&key=${GOOGLE_API_KEY}`
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${GOOGLE_API_KEY}`
    fetch(geocodeUrl)
        .then(res => res.json())
        .then(json => {
            //callback(json.results[0].geometry.location.lat)
        })
        .catch(err => {console.error(err)})
}
*/
