import {
  SET_CURRENT_USER,
  SET_NEARBY_COURTS,
  CLEAR_NEARBY_COURTS,
  ADD_SAVED_COURT,
  REMOVE_SAVED_COURT,
  SET_SAVED_COURTS,
} from './actions';

const initialState = {
  currentUser: null,
  nearbyCourts: [],
  savedCourts: [],
};

const reducer = (state = initialState, action) => {
  if (action.type === SET_CURRENT_USER) {
    return { ...state, currentUser: action.user };
  } else if (action.type === SET_SAVED_COURTS) {
    const merged = [...state.savedCourts, ...action.savedCourts];
    const unique = [...new Set(merged.map(({ id }) => id))].map((e) =>
      merged.find(({ id }) => id === e)
    );
    return { ...state, savedCourts: unique };
  } else if (action.type === SET_NEARBY_COURTS) {
    const merged = [...state.nearbyCourts, ...action.courts];
    const unique = [...new Set(merged.map(({ id }) => id))].map((e) =>
      merged.find(({ id }) => id === e)
    );

    return { ...state, nearbyCourts: unique };
  } else if (action.type === CLEAR_NEARBY_COURTS) {
    return { ...state, nearbyCourts: [] };
  } else if (action.type === ADD_SAVED_COURT) {
    const savedCourts = [...state.savedCourts, action.court];

    return {
      ...state,
      savedCourts,
      currentUser: {
        ...state.currentUser,
        saved_courts: [...state.currentUser.saved_courts, action.court.id],
      },
    };
  } else if (action.type === REMOVE_SAVED_COURT) {
    return {
      ...state,
      savedCourts: state.savedCourts.filter((court) => court.id !== action.courtId),
      currentUser: {
        ...state.currentUser,
        saved_courts: [...state.currentUser.saved_courts.filter((id) => id !== action.courtId)],
      },
    };
  }
  return state;
};

export default reducer;
