/* eslint-disable no-await-in-loop */

import crashlytics from '@react-native-firebase/crashlytics';
import { setNearbyCourts } from './actions';
import { GOOGLE_API_KEY } from '../../config';

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const compilePlaces = async (places) => {
  const results = [];

  for (let i = 0; i < places.length; i++) {
    results.push({
      coords: {
        latitude: places[i].geometry.location.lat,
        longitude: places[i].geometry.location.lng,
      },
      name: places[i].name,
      location: places[i].vicinity,
      id: places[i].place_id,
      discoveredBy: 'Google Places',
    });
  }

  return results;
};

const getPage = async (url) => {
  const res = await fetch(url);

  if (res.ok && res.status === 200) {
    const json = await res.json();
    const { next_page_token, results } = json;

    const data = await compilePlaces(results);

    if (next_page_token) {
      return { data, next_page_token };
    }

    return { data };
  } else {
    crashlytics().recordError(
      `Failed Google Places query with url ${url} and response ${JSON.stringify(res)}`
    );
  }
};

export const getGoogleCourtsByLatLong = async (coords, searchRadius, dispatch) => {
  let queryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.latitude},${coords.longitude}&keyword=basketballcourt&radius=${searchRadius}&rankby=prominence&key=${GOOGLE_API_KEY}`;
  let nextToken;

  try {
    do {
      const pageResults = await getPage(queryUrl);
      nextToken = pageResults.next_page_token;

      dispatch(setNearbyCourts(pageResults.data));

      if (nextToken) {
        await snooze(2000);
        queryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextToken}&key=${GOOGLE_API_KEY}`;
      }
    } while (nextToken);

    return true;
  } catch (error) {
    crashlytics().recordError(error);
    throw new Error(error);
  }
};

export const fetchPlaceDetails = async (placeId) => {
  const queryUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=formatted_address,url,photo&key=${GOOGLE_API_KEY}`;

  try {
    const res = await fetch(queryUrl);
    if (res.ok && res.status === 200) {
      const json = await res.json();
      const details = {
        address: json.result.formatted_address,
        photoUrls: json.result.photos
          ? json.result.photos.map(
              (photo) =>
                `https://maps.googleapis.com/maps/api/place/photo?&maxwidth=400&maxheight=780&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
            )
          : [],
      };

      return details;
    } else {
      crashlytics().recordError(
        `Failed Google Places detail query with url ${queryUrl} and response ${JSON.stringify(res)}`
      );
    }
  } catch (error) {
    crashlytics().recordError(error);
    throw new Error(error);
  }
};

export const findLocationByQuery = async (locationQuery) => {
  try {
    const query = encodeURIComponent(locationQuery.trim());
    const queryUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GOOGLE_API_KEY}`;

    const res = await fetch(queryUrl);

    if (res.ok && res.status === 200) {
      const json = await res.json();

      if (json.results.length > 0) {
        return {
          latitude: json.results[0].geometry.location.lat,
          longitude: json.results[0].geometry.location.lng,
        };
      }
    } else {
      crashlytics().recordError(res.message);
      throw new Error(res.message);
    }
  } catch (error) {
    crashlytics().recordError(error);
    throw new Error(error);
  }
};
