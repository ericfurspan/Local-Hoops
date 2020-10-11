import { setCurrentUser } from '../../../utils/actions';

export const handleLoginSuccess = (dispatch, initialProps, user) => {
  const { navigation } = initialProps;

  dispatch(setCurrentUser(user));
  return navigation.navigate('App');
};

export const handleRedirectToLanding = (dispatch, initialProps) => {
  const { navigation } = initialProps;

  return navigation.navigate('AuthLanding');
};
