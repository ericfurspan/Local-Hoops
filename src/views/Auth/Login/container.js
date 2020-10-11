import { connect } from 'react-redux';
import { handleEmailPwLogin } from './handlers';

import AuthLogin from './view';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, initialProps) => ({
  loginBasic: (email, pw) => handleEmailPwLogin(email, pw, dispatch, initialProps),
  redirectToLanding: () => initialProps.navigation.navigate('AuthLanding'),
  redirectToSignup: () => initialProps.navigation.navigate('AuthRegister'),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLogin);
