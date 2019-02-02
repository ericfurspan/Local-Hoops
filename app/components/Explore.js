import React from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, Modal, Linking, Dimensions } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { findNearbyCourtsByLatLong, findLocationByQuery } from '../api-calls/googleplaces';
import PointIcon from '../../assets/img/point.png';
import Loading from './Loading';
import { Card, Button, ListItem, SearchBar, Header} from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Cancel } from './navButtons';
import { updateUserLoc } from '../actions/User';
import { MAPBOX_ACCESS_TOKEN } from '../../config';
import { connect } from 'react-redux';
import styles from './styles/main';

let deviceHeight= Dimensions.get('window').height;

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

class Explore extends React.Component {
    state = {
        userLocation: null,
        nearbyCourts: null,
        viewMode: 'map',
        modalVisible: false,
        activeCourt: null,
        searchText: null,
        error: null
    }
    static navigationOptions = {
        title: 'Explore',
        headerStyle: {
            backgroundColor: '#d98b00'
        },
        headerTintColor: 'white'
    };
    componentWillMount() {
        findNearbyCourtsByLatLong(this.props.userLocation.latitude, this.props.userLocation.longitude, 15000, this.updateNearbyCourts)
    }
    // Update state with nearby court data
    updateNearbyCourts = (courtData) => {
        this.setState({
            nearbyCourts: courtData
        })
    }
    openExternalMap = (lat, long) => {
        const url = `http://maps.apple.com/?daddr=${lat},${long}`
        Linking.openURL(url).catch(err => console.error('An error occurred opening Apple Map', err));
    }
    updateUserLocation = (lat, long) => {
        this.setState({
            userLocation: {
                latitude: lat,
                longitude: long
              },
              error: null
        }, () => findNearbyCourtsByLatLong(this.state.userLocation.latitude, this.state.userLocation.longitude, 15000, this.updateNearbyCourts)
    )}

    // Finds user location, finds nearby courts, adds courts to state via callback (updateNearbyCourts)
    getUserLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
          this.props.dispatch(updateUserLoc(position.coords));

          this.setState({
            userLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0622,
              longitudeDelta: 0.0421
            },
            error: null
          }, () => findNearbyCourtsByLatLong(this.state.userLocation.latitude, this.state.userLocation.longitude, 4000, this.updateNearbyCourts))
        }, err => this.setState({ error: err.message })),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    }

    updateUserLocationByQuery = () => {
         findLocationByQuery(this.state.searchText, this.updateUserLocation)
    }

    // Returns a single annotation via an index of state.nearbyCourts
    returnAnnotation = (counter) => {
        const item = this.state.nearbyCourts[counter];
        const lat = this.state.nearbyCourts[counter].lat;
        const long = this.state.nearbyCourts[counter].long;
        const name = this.state.nearbyCourts[counter].name
        const location = this.state.nearbyCourts[counter].location;
        
        return (
            <Mapbox.PointAnnotation
                key={`pointAnnotation${counter}`}
                id={`pointAnnotation${counter}`}
                coordinate={[long, lat]}
                title="Basketball court">
                <Image source={PointIcon} style={styles.annotation}/>
    
                <Mapbox.Callout title={name}>
                    <View style={styles.calloutContainer}>
                        <Text style={styles.calloutTitle}>{name}</Text>
                        <Text style={styles.calloutSubText}>{location}</Text>
                        <Text style={styles.link} onPress={() => this.openExternalMap(lat, long)}>Directions</Text>
                        <Text style={styles.link} onPress={() => this.setModalVisible(true, item)}>More</Text>
                    </View>
                </Mapbox.Callout>
            </Mapbox.PointAnnotation>
        )  
    }
    // Loop over state.nearbyCourts and return annotations
    renderAnnotations = () => {
        if(this.state.nearbyCourts !== null) {
            let annotations = this.state.nearbyCourts.map( (court, i) => {
                return this.returnAnnotation(i)
            })
            return annotations;
        }
    }
    updateSearchText = (e) => {
        this.setState({
            searchText: e
        })
    }
    // toggles between list and map views
    toggleView = (mode) => {
        this.setState({
            viewMode: mode
        })
    }
    // changes visibility of modal
    setModalVisible = (visible, item) => {
        this.setState({ 
            modalVisible: visible,
            activeCourt: item || null
        });
    }

    render() {
        let lat, long, activeCourtName, activeCourtLocation, modal;
        if(this.state.userLocation !== null) {
            lat = this.state.userLocation.latitude
            long = this.state.userLocation.longitude
        } else { // default userLocation to NYC UES
            lat = 40.775616;
            long = -73.962371;
        }
        if(this.state.nearbyCourts) {

            if(this.state.activeCourt) {
                activeCourtName = this.state.activeCourt.name;
                activeCourtLocation = this.state.activeCourt.location;
            }
            modal = 
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.fullCenterContainer, {marginTop: 22}]}>
                            <Card
                                title={activeCourtName}
                                containerStyle={styles.cardContainer}
                            >
                                <Text>{activeCourtLocation}</Text>
                                <Button
                                    onPress={() => this.openExternalMap(lat, long)}
                                    icon={{name:'md-map',type:'ionicon',size:25,color:'#FFFFFF'}}
                                    backgroundColor='transparent'
                                    buttonStyle={{backgroundColor:'#3578E5'}}
                                    title='Get Directions'
                                />
                            </Card>
                        </View>
                        <Cancel onCancel={() => this.setModalVisible(!this.state.modalVisible)} />
                    </View>
                </Modal>
            // LIST VIEW
            if(this.state.viewMode === 'list') {
                return (
                    <View style={[styles.container]}>
                        {modal}      
                        <Header
                            centerComponent={{ text: 'Nearby Courts', style: { color: '#FFFFFF', fontSize:24 } }}
                            containerStyle={{
                                backgroundColor: '#3578E5',
                                justifyContent: 'space-around',
                                height:deviceHeight*.15
                            }}
                        />          
                        <FlatList
                            data={this.state.nearbyCourts}
                            renderItem={({item}) => (
                                <ListItem
                                  key={item.key}
                                  title={item.name}
                                  titleStyle={styles.listTitle}
                                  subtitle={item.location}
                                  subtitleStyle={styles.listSubtext}
                                  bottomDivider
                                  onPress={() => this.setModalVisible(true, item)}
                                />
                            )}
                        />
                        <TouchableOpacity
                            style={[styles.buttonBr, styles.buttonBottomRight]}
                            onPress={() => this.toggleView('map')}>
                            <IonIcon name='md-map' size={30} color='white'/>
                        </TouchableOpacity>
                    </View>
                )
            } else if(this.state.viewMode === 'map') {
                return (
                    <View style={[styles.container]}>
                        {modal}
                        <Mapbox.MapView
                            onLongPress={(e) => {
                                this.updateUserLocation(e.geometry.coordinates[1], e.geometry.coordinates[0])
                            }}
                            styleURL={Mapbox.StyleURL.Light}
                            zoomLevel={10}
                            centerCoordinate={[long, lat]}
                            showUserLocation={true}
                            style={styles.container}>
                            {this.renderAnnotations()}
                            <SearchBar
                                lightTheme
                                containerStyle={{marginTop: deviceHeight*.03, backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
                                onChangeText={(e) => this.updateSearchText(e)}
                                inputStyle={{color: '#333'}}
                                onSubmitEditing={() => this.updateUserLocationByQuery()}
                                placeholder='Search Location...' />
                            <TouchableOpacity style={styles.buttonBottomLeft} onPress={() => this.getUserLocation()}>
                              <IonIcon name='md-locate' size={30} color='#0090F7'/>
                            </TouchableOpacity>                            
                            <TouchableOpacity style={[styles.buttonBr, styles.buttonBottomRight]} onPress={() => this.toggleView('list')}>
                              <IonIcon name='md-menu' size={30} color='white'/>
                            </TouchableOpacity>
                        </Mapbox.MapView>
                    </View>
                )
            }
        } else {
            return <Loading message='' indicator={true}/>
        }
    }

}

const mapStateToProps = (state) => ({
    userLocation: state.currentUser ? state.currentUser.location : null,
})

export default connect(mapStateToProps)(Explore);



