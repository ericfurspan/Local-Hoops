import { StyleSheet, PlatformColor, Dimensions } from 'react-native';
import theme from './theme';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

export default StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  fullHeightModal: {
    margin: 0,
  },
  fullHeightModalContainer: {
    flex: 1,
    width: deviceWidth,
    backgroundColor: PlatformColor('secondarySystemBackground'),
    marginTop: deviceHeight * 0.1,
    padding: 12,
  },
  modalContainer: {
    width: deviceWidth,
    backgroundColor: PlatformColor('secondarySystemBackground'),
    padding: 12,
    alignSelf: 'center',
  },
  modalGrip: {
    position: 'absolute',
    top: 4,
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
  },
  modalHeaderText: {
    color: PlatformColor('label'),
    fontSize: 24,
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  iconButton: {
    backgroundColor: PlatformColor('secondarySystemBackground'),
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 96,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  sectionLabel: {
    color: PlatformColor('secondaryLabel'),
    marginBottom: 8,
  },
  label: {
    color: PlatformColor('label'),
    fontSize: 16,
  },
  secondaryLabel: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 14,
    marginVertical: 2,
  },
  bodyText: {
    color: PlatformColor('label'),
    fontWeight: '500',
    fontSize: 18,
  },
  hintText: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 8,
  },
  spaceRight: {
    marginRight: 6,
  },
  alignCenter: {
    alignItems: 'center',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  centered: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  divider: {
    backgroundColor: PlatformColor('separator'),
  },
  padding: {
    padding: 16,
  },
  spinner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  spacedDivider: {
    marginTop: 28,
    marginBottom: 28,
    backgroundColor: PlatformColor('separator'),
  },
  textInput: {
    backgroundColor: theme.colors.white,
    borderRadius: 6,
    width: '75%',
    padding: 16,
    borderColor: PlatformColor('systemFill'),
    borderWidth: 1,
    marginBottom: 16,
  },
  authContainer: {
    flex: 1,
    backgroundColor: theme.colors.blue,
    paddingTop: 48,
  },
  authHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authHeading: {
    color: theme.colors.white,
    fontSize: 21,
    marginBottom: 32,
  },
  authBackTitle: {
    color: theme.colors.white,
  },
  authContent: {
    marginTop: 48,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  authActionBtn: {
    width: 150,
    backgroundColor: theme.colors.white,
    borderColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  authActionBtnTitle: {
    color: theme.colors.blue,
    fontWeight: '500',
  },
  spaceVertical: {
    marginVertical: 28,
  },
});
