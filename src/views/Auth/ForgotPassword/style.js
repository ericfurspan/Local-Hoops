import { StyleSheet } from 'react-native';
import theme from '../../../styles/theme';

export default StyleSheet.create({
  submitBtn: {
    backgroundColor: theme.colors.white,
    borderColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  feedbackText: {
    fontSize: 24,
    marginTop: 12,
  },
});
