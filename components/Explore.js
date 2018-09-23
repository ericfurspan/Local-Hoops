import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList, Modal, Linking } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { findNearbyCourtsByLatLong, findLocationByQuery } from '../api-calls/googleplaces';
import PointIcon from '../assets/img/point.png';
import Loading from './Loading';
import { Card, Button, ListItem, SearchBar } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';

Mapbox.setAccessToken('pk.eyJ1IjoicXVhbmRhIiwiYSI6ImNqZTd2eTRrbjBpMXQycW16eTd0ODJncjEifQ.ZFdf44K2KF8UtZBsSac0wA');

class Explore extends React.Component {
    state = {
        userLocation: null,
        nearbyCourts: null,
        viewMode: 'list',
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
        this.getUserLocation()
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
        let lat, long, activeCourtName, activeCourtLocation, modal, activeCourtGoogleUrl;
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
                activeCourtGoogleUrl = this.state.activeCourt.gMapsUrl;
            }
            modal = 
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}>
                    <View style={[styles.container, styles.center, {marginTop: 22}]}>
                        <Card
                            title={activeCourtName}
                            containerStyle={styles.cardContainer}
                            titleStyle={styles.text}
                            image={require('../assets/img/ballhoop.jpg')}>
                            <Text style={[styles.cardDescription, styles.text]}>{activeCourtLocation}</Text>
                            <Button
                                onPress={() => this.openExternalMap(lat, long)}
                                icon={{name:'md-paper-plane',type:'ionicon',size:25,color:'#333'}}
                                backgroundColor='transparent'
                                color='#333'
                                buttonStyle={{borderColor: '#333', borderWidth: 1}}
                                title='Get Directions'
                            />
                        </Card>
                        <View style={styles.bottomCenter}>
                            <TouchableOpacity
                                onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                                <IonIcon name='md-close-circle-outline' size={35} color='#444'/>
                            </TouchableOpacity>
                            <Text style={styles.text}>Cancel</Text>
                        </View>
                    </View>
                </Modal>
            // LIST VIEW
            if(this.state.viewMode === 'list') {
                return (
                    <View style={styles.container}>
                        {modal}                        
                        <FlatList
                            style={{marginTop: 50}}
                            data={this.state.nearbyCourts}
                            renderItem={({item}) => (
                                <ListItem
                                  key={item.key}
                                  title={item.name}
                                  titleStyle={styles.item}
                                  subtitle={item.location}
                                  subtitleStyle={styles.listSubtext}
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
                                containerStyle={{marginTop: 30, backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
                                onChangeText={(e) => this.updateSearchText(e)}
                                inputStyle={{color: '#fff'}}
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
            return <Loading message='courts...'/>
        }
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffdfd',
  },
  item: {
    fontSize: 18,
    color: '#444',
    fontWeight: 'bold',
  },
  listSubtext: {
    paddingLeft: 5,
    marginTop: 5
  },
  text: {
      color: '#444'
  },
  textSm: {
      fontSize: 10
  },
  textLg: {
    fontSize: 20
  },
  annotation: {
    tintColor: 'red'
  },
  calloutContainer: {
    backgroundColor: '#fffdfd',
    width: 250,
    height: 150,
    alignItems: 'center',
    position: 'relative',
    padding: 10
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
  cardContainer: {
      padding: 0,
      width: '90%',
      backgroundColor: '#fffdfd',
      borderColor: 'transparent'
  },
  cardDescription: {
      marginBottom: 10
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonBr: {
    height: 55,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 50,
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
  bottomCenter: {
    position: 'absolute',
    bottom: '8%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
export default Explore;



