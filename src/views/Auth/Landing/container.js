import { connect } from 'react-redux';
import { handleAppleLogin, handleGoogleLogin, handleFacebookLogin } from './handlers';

import AuthLanding from './view';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, initialProps) => ({
  loginApple: () => handleAppleLogin(dispatch, initialProps),
  loginGoogle: () => handleGoogleLogin(dispatch, initialProps),
  loginFacebook: () => handleFacebookLogin(dispatch, initialProps),
  redirectToLogin: () => initialProps.navigation.navigate('AuthLogin'),
  redirectToSignup: () => initialProps.navigation.navigate('AuthRegister'),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLanding);
