import { StyleSheet, Dimensions, PlatformColor } from 'react-native';
import theme from '../../../../styles/theme';

const { height: deviceHeight } = Dimensions.get('window');

export default StyleSheet.create({
  actionBtnContainer: {
    position: 'absolute',
    top: deviceHeight * 0.05,
    right: 8,
  },
  textContainer: {
    borderRadius: 12,
    backgroundColor: PlatformColor('tertiarySystemBackground'),
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapTypeRow: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderTrackThumb: {
    backgroundColor: theme.colors.blue,
  },
  accountTooltip: {
    backgroundColor: PlatformColor('tertiarySystemBackground'),
  },
  logoutText: {
    color: PlatformColor('label'),
    marginRight: 8,
    fontSize: 16,
  },
});
