import { connect } from 'react-redux';
import { handleCreateEmailPwUser } from './handlers';

import AuthRegister from './view';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, initialProps) => ({
  tryCreateNewUser: (name, email, password, passwordConfirm) =>
    handleCreateEmailPwUser(name, email, password, passwordConfirm, dispatch, initialProps),
  redirectToLanding: () => initialProps.navigation.navigate('AuthLanding'),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthRegister);
