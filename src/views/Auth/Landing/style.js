import { StyleSheet } from 'react-native';
import theme from '../../../styles/theme';

export default StyleSheet.create({
  logo: {
    width: 275,
    height: 275,
  },
  buttonSize: {
    fontSize: 15,
  },
  socialLoginBtn: {
    minWidth: 250,
    borderRadius: 100,
    height: 52,
    padding: 18,
    marginBottom: 4,
  },
  actionBtn: {
    minWidth: 250,
    height: 52,
    marginTop: 8,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
    borderRadius: 100,
  },
  actionBtnTitleAlt: {
    color: theme.colors.white,
    fontWeight: '500',
    marginTop: 24,
  },
});
