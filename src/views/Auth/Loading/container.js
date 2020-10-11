import { connect } from 'react-redux';
import { handleLoginSuccess, handleRedirectToLanding } from './handlers';

import AuthLoading from './view';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, initialProps) => ({
  doLoginSuccess: (user) => handleLoginSuccess(dispatch, initialProps, user),
  redirectToLanding: () => handleRedirectToLanding(dispatch, initialProps),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoading);
