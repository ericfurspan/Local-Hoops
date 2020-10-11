import { StyleSheet, PlatformColor } from 'react-native';

export default StyleSheet.create({
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    color: PlatformColor('label'),
    backgroundColor: PlatformColor('secondarySystemBackground'),
    borderRadius: 36,
    width: '75%',
    height: 42,
    marginVertical: 8,
    paddingHorizontal: 16,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
});
