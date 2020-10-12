import { StyleSheet } from 'react-native';
import theme from '../../../../styles/theme';

export default StyleSheet.create({
  actionBtnRow: {
    paddingBottom: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  directionsBtn: {
    minWidth: 150,
    backgroundColor: theme.colors.blue,
  },
  saveBtn: {
    flexDirection: 'column',
  },
  saveBtnTitle: {
    color: 'rgb(237, 73, 86)',
    fontSize: 16,
  },
  courtImage: {
    width: 200,
    height: 200,
    marginRight: 4,
  },
});
