export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  user,
});

export const SET_NEARBY_COURTS = 'SET_NEARBY_COURTS';
export const setNearbyCourts = (courts) => ({
  type: SET_NEARBY_COURTS,
  courts,
});

export const CLEAR_NEARBY_COURTS = 'CLEAR_NEARBY_COURTS';
export const clearNearbyCourts = () => ({
  type: CLEAR_NEARBY_COURTS,
});

export const SET_SAVED_COURTS = 'SET_SAVED_COURTS';
export const setSavedCourts = (savedCourts) => ({
  type: SET_SAVED_COURTS,
  savedCourts,
});

export const ADD_SAVED_COURT = 'ADD_SAVED_COURT';
export const addSavedCourt = (court) => ({
  type: ADD_SAVED_COURT,
  court,
});

export const REMOVE_SAVED_COURT = 'REMOVE_SAVED_COURT';
export const removeSavedCourt = (courtId) => ({
  type: REMOVE_SAVED_COURT,
  courtId,
});
