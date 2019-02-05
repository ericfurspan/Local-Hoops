import React from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, Modal, Linking, Dimensions, ActivityIndicator } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { findNearbyCourtsByLatLong, findLocationByQuery } from '../api-calls/googleplaces';
import PointIcon from '../../assets/img/point.png';
import Loading from './Loading';
import { Card, Button, ListItem, SearchBar, Header, Icon, Input } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Cancel } from './navButtons';
//import { updateUserLoc } from '../actions/User';
import { saveCourt } from '../actions/Court';
import { MAPBOX_ACCESS_TOKEN } from '../../config';
import { connect } from 'react-redux';
import styles from './styles/main';

let deviceHeight= Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

class Explore extends React.Component {
    state = {
        nearbyCourts: null,
        viewMode: 'map',
        zoomLevel: 10,
        centerLocation: this.props.userLocation,
        addCourtMode: false,
        addCourtForm: {
            coords: null,
            name: null
        },
        modalVisible: false,
        activeCourt: null,
        search: null,
        error: null,
        loading: false
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
    handleSaveCourt = () => {
        this.props.dispatch(saveCourt(
            {
                lat: this.state.addCourtForm.coords.latitude,
                long: this.state.addCourtForm.coords.longitude,
                name: this.state.addCourtForm.name
            }
        ))
        this.setState({
            addCourtMode: false,
            addCourtForm: {
                coords: null,
                name: null
            }
        })
    }
    // Update state with nearby court data
    updateNearbyCourts = (courtData) => {
        this.setState({
            nearbyCourts: courtData,
            loading: false
        })
    }
    flyTo = (coords) => {
        this._mapView.flyTo([coords.longitude,coords.latitude], 1000)
    }
    openExternalMap = (lat, long) => {
        const url = `http://maps.apple.com/?daddr=${lat},${long}`
        Linking.openURL(url).catch(err => console.error('An error occurred opening Apple Map', err));
    }
    updateCenterLocation = (coords, shouldUpdateCourts) => {
        this.setState({
            centerLocation: {
                latitude: coords.latitude,
                longitude: coords.longitude
              },
              error: null
        }, () => {
            if(shouldUpdateCourts) {
                findNearbyCourtsByLatLong(coords.latitude, coords.longitude, 15000, this.updateNearbyCourts)
            }
        }
    )}
    updateAddCourtForm = (field, data) => {
        this.setState({
            addCourtForm: {
                ...this.state.addCourtForm,
                [field]: data
            }
        })
    }
    // Finds user location, finds nearby courts, adds courts to state via callback (updateNearbyCourts)
    getUserLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
          // fly to current position
          this.flyTo(position.coords);
          
          //this.props.dispatch(updateUserLoc(position.coords));

          this.setState({
            centerLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            error: null
          }, () => findNearbyCourtsByLatLong(this.state.centerLocation.latitude, this.state.centerLocation.longitude, 4000, this.updateNearbyCourts))
        }, err => this.setState({ error: err.message })),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    }

    updateCenterLocationByQuery = () => {
        this.setState({loading: true})
        findLocationByQuery(this.state.search, this.updateCenterLocation)
    }
    updateSearch = search => {
        this.setState({search})
    }
    returnAddCourtAnnotation = (coords) => {
        return (
            <Mapbox.PointAnnotation
                key={"1"}
                id={"1"}
                coordinate={[coords.longitude, coords.latitude]}
                title="annotation title"
            >
            </Mapbox.PointAnnotation>
        )  
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
    // toggles between list and map views
    toggleView = (mode) => {
        this.setState({
            viewMode: mode
        })
    }
    // toggle special modes (i.e add court)
    toggleAddCourtMode = () => {
        this.setState({addCourtMode: !this.state.addCourtMode})
    }
    // changes visibility of modal
    setModalVisible = (visible, item) => {
        this.setState({ 
            modalVisible: visible,
            activeCourt: item || null
        });
    }

    render() {
        console.log(this.state.loading)
        let lat, long, activeCourtName, activeCourtLocation, modal;
        if(this.state.centerLocation) {
            lat = this.state.centerLocation.latitude
            long = this.state.centerLocation.longitude
         
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
                    let addCourtForm, addCourtAnnotation;
                    let searchBarMargin = deviceHeight*.02;
                    if(this.state.addCourtMode === true) {
                        searchBarMargin = 0;
                        if(!this.state.addCourtForm.coords) {
                            addCourtForm = 
                                <View style={{justifyContent:'space-evenly',height:deviceHeight*.35,paddingTop:25,width:deviceWidth,zIndex:1000,backgroundColor:'#EEF0EF',borderBottomColor:'#CAD2D3',borderBottomWidth:2}}>
                                    <Text style={[styles.text,{marginBottom:5,textAlign:'center'}]}>Add a Court</Text>
                                    <Text style={{marginBottom:5,textAlign:'center'}}>Drag the map to move the pin to the location of a court, then tap Select Location</Text>
                                    <Button
                                        title='Select Location'
                                        onPress={async () => {
                                            let center = await this._mapView.getCenter();
                                            this.updateAddCourtForm('coords',center)
                                        }}
                                        buttonStyle={{backgroundColor: '#3578E5', borderColor: '#F6F8FA', borderWidth: 1, borderRadius: 10}}
                                    />   
                                </View>
                        } else if(this.state.addCourtForm.coords) {
                            addCourtForm = 
                            <View style={{justifyContent:'space-evenly',height:deviceHeight*.35,paddingTop:25,width:deviceWidth,zIndex:1000,backgroundColor:'#EEF0EF',borderBottomColor:'#CAD2D3',borderBottomWidth:2}}>
                                <Text style={[styles.text,{marginBottom:5,textAlign:'center'}]}>Add a Court</Text>
                                <Text style={{marginBottom:5,textAlign:'center'}}>Enter a name for this court</Text>
                                <Input 
                                    placeholder='Type name here'
                                    onChangeText={val => this.updateAddCourtForm('name',val)}
                                    containerStyle={{alignSelf:'center',width:deviceWidth*.85,marginTop:10,marginBottom:20}}
                                    maxLength={25}
                                    value={this.state.addCourtForm.name}
                                    inputStyle={{color: '#333'}}
                                />
                                <View style={styles.centeredRow}>
                                    <Button
                                        title='Go Back'
                                        onPress={() => {
                                            this.setState({addCourtForm: {coords: null}})
                                        }}
                                        buttonStyle={{backgroundColor: '#3578E5', borderColor: '#F6F8FA', borderWidth: 1, borderRadius: 10,padding:10}}
                                    />
                                    <Button
                                        title='Save Court'
                                        onPress={() => this.handleSaveCourt()}
                                        buttonStyle={{backgroundColor: '#3578E5', borderColor: '#F6F8FA', borderWidth: 1, borderRadius: 10,padding:10}}
                                    />
                                </View>
                            </View>
                        }
                        addCourtAnnotation = this.returnAddCourtAnnotation(this.state.centerLocation);
                    }
                    return (
                        <View style={[styles.container]}>
                            {modal}
                            {addCourtForm}
                            <Mapbox.MapView
                                ref={(c) => this._mapView = c}
                                onLongPress={(e) => {
                                    this.updateCenterLocation({latitude: e.geometry.coordinates[1],longitude: e.geometry.coordinates[0]})
                                }}
                                styleURL={Mapbox.StyleURL.Light}
                                zoomLevel={12}
                                centerCoordinate={[long, lat]}
                                showUserLocation={true}
                                style={styles.container}
                                onRegionDidChange={(e) => {
                                    if(this.state.addCourtMode === true && !this.state.addCourtForm.coords) {
                                        this.updateCenterLocation({latitude: e.geometry.coordinates[1],longitude: e.geometry.coordinates[0]}, false)}
                                    }
                                }
                            >
                                <SearchBar
                                    lightTheme
                                    containerStyle={{marginTop:searchBarMargin, backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
                                    onChangeText={this.updateSearch}
                                    inputStyle={{color: '#333'}}
                                    onSubmitEditing={() => this.updateCenterLocationByQuery()}
                                    placeholder='Search Location...' 
                                    value={this.state.search}
                                />
                                                        
                                {this.renderAnnotations()}
                                
                                {addCourtAnnotation}

                                {this.state.loading ? 
                                    (<View style={[styles.fullCenterContainer]}>
                                        <ActivityIndicator size='large' color='#3578E5'/>
                                    </View>)
                                    : <View></View>
                                }

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                    marginBottom: 50,
                                    marginRight: 5
                                }}> 
                                    <TouchableOpacity style={[styles.buttonBr]} onPress={() => this.toggleAddCourtMode()}>
                                        <Icon
                                            name='add-location'
                                            color={this.state.addCourtMode ? '#3578E5' : 'white'}
                                            size={30}
                                        />
                                    </TouchableOpacity>                            
                                    <TouchableOpacity style={[styles.buttonBr]} onPress={() => this.toggleView('list')}>
                                        <IonIcon name='md-menu' size={30} color='white'/>
                                    </TouchableOpacity>   
                                    <TouchableOpacity 
                                        style={{backgroundColor:'#fff',padding:10,marginTop:25}} 
                                        onPress={() => this.getUserLocation()}>
                                        <Icon
                                            name='gps-fixed'
                                            color='#0090F7'
                                            size={30}
                                        />                                    
                                    </TouchableOpacity>                                                           
                                    {/*
                                        <TouchableOpacity 
                                        style={{backgroundColor:'#fff',padding:10,borderBottomColor:'#333',borderBottomWidth:.5,zIndex:1000}} 
                                        onPress={() => this.zoomIn()}>
                                        <Icon
                                            name='zoom-in'
                                            color='#333'
                                            size={30}
                                        />
                                        </TouchableOpacity> 
                                        <TouchableOpacity 
                                            style={{backgroundColor:'#fff',padding:10,zIndex:1000}} 
                                            onPress={() => this.zoomOut()}>
                                            <Icon
                                                name='zoom-out'
                                                color='#333'
                                                size={30}
                                            />
                                        </TouchableOpacity>
                                    */}                          
                                </View>                                                       
                            </Mapbox.MapView>
                        </View>
                    )
                }
            } else {
                return <Loading message='' indicator={true}/>
            }
        } else {
            return <Loading message='Unknown location' indicator={true}/>
        }
    }

}

const mapStateToProps = (state) => ({
    userLocation: state.currentUser ? state.currentUser.location : null,
})

export default connect(mapStateToProps)(Explore);



