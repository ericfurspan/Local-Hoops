import { StyleSheet, PlatformColor } from 'react-native';
import theme from '../../styles/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
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
    marginTop: 21,
  },
  viewListContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 32,
    right: 16,
  },
});
