
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const updateLocation = (location, locationEnabled) => ({
  type: UPDATE_LOCATION,
  location,
  locationEnabled
});