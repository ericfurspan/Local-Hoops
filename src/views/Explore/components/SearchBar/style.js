import { StyleSheet, PlatformColor } from 'react-native';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  textInputContainer: {
    width: '90%',
  },
  listView: {
    width: '90%',
  },
  row: {
    backgroundColor: PlatformColor('secondarySystemBackground'),
  },
  description: {
    color: PlatformColor('label'),
  },
  searchInput: {
    color: PlatformColor('label'),
    backgroundColor: PlatformColor('secondarySystemBackground'),
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
});
