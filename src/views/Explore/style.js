import { StyleSheet, PlatformColor } from 'react-native';
import theme from '../../styles/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  actionBtn: {
    borderRadius: 36,
    backgroundColor: PlatformColor('secondarySystemBackground'),
    paddingHorizontal: 16,
  },
  actionBtnIcon: {
    marginLeft: 8,
  },
  actionBtnTitle: {
    color: theme.colors.blue,
    fontSize: 16,
    fontWeight: '500',
  },
  actionBtnBadge: {
    position: 'absolute',
    top: -10,
    right: 0,
  },
  searchAgainContainer: {
    alignSelf: 'center',
    marginTop: 16,
  },
  viewListContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 32,
    right: 16,
  },
});
