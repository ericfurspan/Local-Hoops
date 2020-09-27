import { StyleSheet, Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#3578E5',
    height: deviceHeight * 0.12,
    justifyContent: 'space-around',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 20,
    color: '#333',
  },
  modalBackground: {
    height: deviceHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#111',
    color: '#fff',
  },
  modalContent: {
    height: deviceHeight * 0.9,
    width: deviceWidth,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  dashHeader: {
    backgroundColor: '#3578E5',
    height: deviceHeight * 0.2,
    alignItems: 'center',
  },
  routeHeader: {
    backgroundColor: '#3578E5',
    height: deviceHeight * 0.12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    transform: [{ scaleX: 1.0 }, { scaleY: 3.5 }],
    width: deviceWidth,
    marginBottom: 20,
  },
  saveCourtButton: {
    position: 'absolute',
    bottom: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  inlineItems: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  annotationLg: {
    tintColor: 'red',
    width: 20,
    height: 35,
  },
  annotation: {
    tintColor: 'red',
  },
  fullCenterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: '#fff',
  },
  divider: {
    backgroundColor: '#FAFAFA', // '#EFEFEF'
    height: 8,
    marginBottom: 20,
  },
  cardContainer: {
    padding: 20,
    width: '90%',
    marginBottom: 50,
    borderColor: 'transparent',
  },
  calloutContainer: {
    backgroundColor: 'red',
    width: deviceWidth,
    height: 250,
    padding: 10,
  },
  calloutTitle: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  calloutSubText: {
    marginTop: 20,
    marginBottom: 20,
  },
  link: {
    color: '#0261ff',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBr: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#3578E5',
    borderColor: '#F6F8FA',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  smallRed: {
    fontSize: 14,
    color: 'red',
  },
  centeredRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  evenSpacedRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 10,
  },
  spaceAroundRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  spaceBetweenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  flexStartRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 10,
  },
  flexEndRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: deviceWidth,
  },
  listTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  listSubtext: {
    paddingLeft: 5,
    marginTop: 5,
  },
  whiteText: {
    color: '#fff',
  },
  text: {
    fontSize: 18,
  },
  accountTop: {
    height: deviceHeight * 0.3,
    backgroundColor: '#3578E5', // 3578E5
    justifyContent: 'center',
  },
  accountText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
  },
});
