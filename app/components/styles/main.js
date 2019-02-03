import { StyleSheet, Dimensions } from "react-native"
let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    centeredContainer: {
        alignItems: 'center', 
        flex: 1       
    },
    headerContainer: {
        backgroundColor: '#3578E5',
        height: deviceHeight*.12,
        justifyContent: 'space-around',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingBottom: 10
    },
    header: {
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 20,
        color: '#333',
        marginTop:5
    },
    modalBackground: {
        height: deviceHeight,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#333',
        color: '#fff'
    },
    modalContent: {
        height: deviceHeight*.85,
        width: deviceWidth*.98,
        backgroundColor: '#fff',
        borderRadius: 5,
        top: deviceHeight*.05
    },
    modalHeader: {
        fontSize: 16,
        fontWeight:'bold',
        alignSelf:'center',
        textAlign:'center',
        width:'100%',
        color:'#333',
        padding:5,
        backgroundColor:'#FAFAFA'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressBar: {
        transform: [{ scaleX: 1.0 }, { scaleY: 3.5 }],
        width: deviceWidth*.98,
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
        flexDirection:'row',
    },
    annotationLg: {
        tintColor: 'red',
        width: 20,
        height: 35
    },
    annotation: {
        tintColor: '#EF8333'
    },
    fullCenterContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullScreen: {
        width: deviceWidth,
        height: deviceHeight,
        backgroundColor: '#fff'
    },
    divider: {
        backgroundColor:'#FAFAFA',  //'#EFEFEF'
        height:8,
        marginBottom:20,
    },
    cardContainer: {
        padding: 20,
        width: '90%',
        marginBottom:50,
        borderColor: 'transparent'
    },
    calloutContainer: {
        backgroundColor: '#fffdfd',
        width: 250,
        height: 150,
        alignItems: 'center',
        position: 'relative',
        padding: 10,
    },
    calloutTitle: {
        marginTop: 10,
        fontWeight: 'bold'
    },
    calloutSubText: {
        marginTop: 20,
        marginBottom: 20
    },
    link: {
        color: '#0261ff'
    },
    buttonBr: {
        height: 55,
        width: 55,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        borderRadius: 50,
        marginBottom: 10,
    },
    buttonBottomRight: {
        bottom: '8%',
        right: 10,
        position: 'absolute'
    },
    buttonBottomLeft: {
        bottom: '10%',
        left: 10,
        position: 'absolute'
    },
    row: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#3578E5',
        borderColor: '#F6F8FA',
        borderWidth: 1, 
        borderRadius: 10,
        padding: 10
    },
    smallRed: {
        fontSize: 14,
        color: 'red'
    },
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    evenSpacedRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin:10
    },
    flexStartRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        margin:10
    },
    flexEndRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: deviceWidth
    },
    listTitle: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    listSubtext: {
        paddingLeft: 5,
        marginTop: 5
    },
    whiteText: {
        color: '#fff'
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    account: {
        height: deviceHeight*.45,
        backgroundColor: '#3578E5' //3578E5
    },
    accountText: {
        fontSize: 24,
        color: '#333',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 10
    }
})