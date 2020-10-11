import { connect } from 'react-redux';
import {
  handleGetNearbyCourts,
  handleClearNearbyCourts,
  handleGetCoordsForQuery,
  handleSaveFavoriteCourt,
  handleUnsaveFavoriteCourt,
  handleGetSavedCourts,
  handleLogout,
} from './handlers';
import Explore from './view';

const mapStateToProps = (state) => ({
  nearbyCourts: state.nearbyCourts,
  currentUser: state.currentUser,
  savedCourts: state.savedCourts,
});

const mapDispatchToProps = (dispatch, initialProps) => ({
  getNearbyCourts: (coords, radius) => handleGetNearbyCourts(dispatch, coords, radius),
  clearNearbyCourts: () => handleClearNearbyCourts(dispatch),
  getCoordsForQuery: (searchInput) => handleGetCoordsForQuery(dispatch, searchInput),
  saveCourt: (uid, court) => handleSaveFavoriteCourt(dispatch, uid, court),
  unsaveCourt: (uid, courtId) => handleUnsaveFavoriteCourt(dispatch, uid, courtId),
  getSavedCourts: (savedCourtIds) => handleGetSavedCourts(dispatch, savedCourtIds),
  logout: () => handleLogout(dispatch, initialProps),
});

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
