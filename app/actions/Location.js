
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const updateLocation = location => ({
    type: UPDATE_LOCATION,
    location
});
export const LOCATION_ERROR = 'LOCATION_ERROR';
export const locationError = message => ({
    type: LOCATION_ERROR,
    message
});
export const TOGGLE_LOCATION = 'TOGGLE_LOCATION';
export const toggleLocation = isEnabled => ({
    type: TOGGLE_LOCATION,
    isEnabled
});