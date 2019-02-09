import React from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, Modal, Linking, Dimensions, ActivityIndicator } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { findLocationByQuery } from '../api-calls/googleplaces';
import PointIcon from '../../assets/img/point.png';
import { Card, Button, ListItem, SearchBar, Icon, Input, Divider } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Cancel } from './navButtons';
import { locationError, updateLocation } from '../actions/Location';
import { saveCourt, getNearbyCourts } from '../actions/Court';
import { MAPBOX_ACCESS_TOKEN } from '../../config';
import { connect } from 'react-redux';
import LightMapLogo from '../../assets/mapStyles/light.png'
import DarkMapLogo from '../../assets/mapStyles/dark.png'
import StreetMapLogo from '../../assets/mapStyles/street.png'
import styles from './styles/main';

let deviceHeight= Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

class Explore extends React.Component {

    static navigationOptions = {
        tabBarVisible: false
    }

    state = {
        viewMode: 'map',    // 'map', 'list'
        zoomLevel: 10,
        mapCenter: {        // defaults to NYC UES
            latitude: this.props.location ? this.props.location.latitude : 40.85695626802242,
            longitude: this.props.location ? this.props.location.longitude :  -73.96452454863464
        },
        mapStyle: {
            type: 'Light',
            url: Mapbox.StyleURL.Light
        },
        addCourtMode: false,
        addCourtForm: {
            coords: null,
            name: null,
            error: null,
        },
        searchRadius: 15000, // in km
        modalVisible: false,
        selectedCourt: null,
        selectedCourtPreview: null,
        optionsMenuVisible: false,
        search: null,
        error: null
    }

    componentDidMount() {
        if(!this.props.locationEnabled) {
            navigator.geolocation.requestAuthorization();
        }
        this.props.dispatch(getNearbyCourts(this.state.mapCenter, this.state.searchRadius));
    }

    componentDidUpdate(prevProps) {
        // if user location has changed, update map center coordinates
        let prevCoords = prevProps.location;
        let newCoords = this.props.location;
        if( (prevCoords.latitude !== newCoords.latitude) || (prevCoords.longitude !== newCoords.longitude) ) {
            this.updateMapCenter(newCoords, true)
        }
    }

    handleSaveCourt = () => {
        this.props.dispatch(saveCourt(
            {
                coords: this.state.addCourtForm.coords,
                name: this.state.addCourtForm.name
            }
        ));
        this.setState({
            addCourtMode: false,
            addCourtForm: {
                coords: null,
                name: null
            }
        })
    }

    flyTo = (coords) => {
        this._mapView.flyTo([coords.longitude,coords.latitude], 1000)
    }

    openExternalMap = (coords) => {
        const url = `http://maps.apple.com/?daddr=${coords.latitude},${coords.longitude}`
        Linking.openURL(url).catch(err => console.error('An error occurred opening Apple Map', err));
    }

    updateMapCenter = (coords, shouldUpdateCourts) => {
        this.setState({
            mapCenter: {
                latitude: coords.latitude,
                longitude: coords.longitude
              },
              error: null
        }, () => {
            if(shouldUpdateCourts) {
                this.props.dispatch(getNearbyCourts(coords, this.state.searchRadius));
            }
        }
    )}

    updateAddCourtForm = (field, data) => {
        let error;
        if(field === 'name' && data.length < 3) {
            error = `Please enter a longer name`
        }
        this.setState({
            addCourtForm: {
                ...this.state.addCourtForm,
                [field]: data,
                error
            }
        })
    }

    updateMapStyle = (type) => {
        let url;
        switch(type) {
            case 'Light' :
              url = Mapbox.StyleURL.Light;
              break;
            case 'Dark' :
              url = Mapbox.StyleURL.Dark;
              break;
            case 'Street' :
              url = Mapbox.StyleURL.Street
              break;
            default :
                break;
        }
        this.setState({
            mapStyle: {
                type,
                url
            }
        })
    } 

    // Get user location, find nearby courts, adds courts to state via callback (updateNearbyCourts) and fly to current pos
    updateUserLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
          this.props.dispatch(updateLocation(position.coords));
          this.flyTo(position.coords);
          this.props.dispatch(getNearbyCourts(position.coords, this.state.searchRadius));
        }, err => {
              this.props.dispatch(locationError(err.message))
           },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000})
    }

    updateMapCenterByQuery = () => {
        // validate search input has content
        if(this.state.search && this.state.search.trim().length > 0) {
            findLocationByQuery(this.state.search, this.updateMapCenter);
        }
    }

    updateSearch = search => { this.setState({ search })}

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

    // Returns a single annotation via an index of nearbyCourts
    returnAnnotation = (counter) => {
        const coords = this.props.nearbyCourts[counter].coords;
        
        return (
            <Mapbox.PointAnnotation
                key={`pointAnnotation${counter}`}
                id={`pointAnnotation${counter}`}
                coordinate={[coords.longitude, coords.latitude]}
                onSelected={() => {
                    this.flyTo({latitude:coords.latitude,longitude:coords.longitude});
                    this.setCourtPreview(this.props.nearbyCourts[counter]);
                }}
                title="Basketball court">
                <Image source={PointIcon} style={styles.annotation}/>
            </Mapbox.PointAnnotation>
        )  
    }

    // Loop over nearbyCourts and return annotations
    renderAnnotations = () => {
        if(this.props.nearbyCourts !== null) {
            let annotations = this.props.nearbyCourts.map( (court, i) => {
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
        this.setState((prevState) => ({
            addCourtMode: !prevState.addCourtMode,
            optionsMenuVisible: false
          }));
    }

    toggleOptionsMenu = () => {
        this.setState((prevState) => ({
            optionsMenuVisible: !prevState.optionsMenuVisible,
        }));    
    }

    // changes visibility of modal
    setModalVisible = (visible, item) => {
        this.setState({ 
            modalVisible: visible,
            selectedCourt: item || null
        });
    }

    // changes visibility of court preview
    setCourtPreview = (item = null) => {
        this.setState({ 
            selectedCourtPreview: item
        });
    }

    render() {
        let loadingIndicator = <View></View>;
        if(this.props.mapLoading) {
            loadingIndicator = 
                <View style={[styles.fullCenterContainer]}>
                    <ActivityIndicator size='large' color='#3578E5'/>
                </View>
        }

        let header = 
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#3578E5',paddingTop:40}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                    <IonIcon name='ios-undo' size={30} color='white'/>
                </TouchableOpacity>
                <SearchBar
                    lightTheme
                    containerStyle={{marginLeft:10,marginRight:10,width:deviceWidth*.7,backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent',zIndex:1000}}
                    onChangeText={this.updateSearch}
                    inputStyle={{color: '#333'}}
                    onSubmitEditing={() => this.updateMapCenterByQuery()}
                    placeholder='Search' 
                    value={this.state.search}
                />
                <TouchableOpacity onPress={() => this.toggleView(this.state.viewMode === 'map' ? 'list' : 'map')}>
                    <IonIcon name={this.state.viewMode === 'map' ? 'ios-menu' : 'md-map'} size={30} color='white'/>
                </TouchableOpacity>  
            </View>


        // define modal for court view
        let modal = 
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}>
                <View style={styles.modalBackground}>
                    <View style={[styles.fullCenterContainer,styles.modalContent,{backgroundColor:'#FAFAFA'}]}>
                        <Card
                            title={this.state.selectedCourt ? this.state.selectedCourt.name : null}
                            containerStyle={styles.cardContainer}
                        >
                            <Text>{this.state.selectedCourt ? this.state.selectedCourt.location : null}</Text>
                            <Button
                                onPress={() => this.openExternalMap(this.state.mapCenter)}
                                icon={{name:'md-map',type:'ionicon',size:25,color:'#FFFFFF'}}
                                backgroundColor='transparent'
                                buttonStyle={{backgroundColor:'#3578E5'}}
                                title='Directions'
                            />
                        </Card>
                    </View>
                    <Cancel onCancel={() => this.setModalVisible(!this.state.modalVisible)} />
                </View>
            </Modal>

        // LIST VIEW of nearby courts
        if(this.state.viewMode === 'list') {
            return (
                <View style={[styles.container]}>
                    {modal}      
                    {header}
                    {loadingIndicator}
                    <FlatList
                        data={this.props.nearbyCourts}
                        keyExtractor={(item,i) => i.toString()}
                        renderItem={({item}) => (
                            <ListItem
                                title={item.name}
                                titleStyle={styles.listTitle}
                                subtitle={item.location}
                                subtitleStyle={styles.listSubtext}
                                bottomDivider
                                onPress={() => this.setModalVisible(true, item)}
                            />
                        )}
                    />
                </View>
            ) 
        // MAP VIEW of nearby courts
        } else if(this.state.viewMode === 'map') {
            
            let addCourtForm, addCourtAnnotation;

            if(this.state.addCourtMode) {
                if(!this.state.addCourtForm.coords) {
                    addCourtForm = 
                        <View style={{justifyContent:'space-around',alignItems:'center',height:deviceHeight*.20,paddingTop:10,paddingBottom:10,zIndex:1000,backgroundColor:'#EEF0EF',borderBottomColor:'#CAD2D3',borderBottomWidth:2}}>
                            <IonIcon 
                                name='md-close'
                                size={30}
                                color='#333'
                                style={{alignSelf:'flex-end',marginRight:5}}
                                onPress={() => this.toggleAddCourtMode()} 
                            />
                            <Text style={{marginBottom:5,textAlign:'center'}}>Drag the map to move the pin to the location of a court, then tap Select Location</Text>
                            <Button
                                title='Select Location'
                                onPress={async () => {
                                    let center = await this._mapView.getCenter();
                                    this.updateAddCourtForm('coords',{latitude:center[1],longitude:center[0]})
                                }}
                                raised
                                type='outline'
                                titleStyle={{color:'#3578E5',fontSize:18,fontWeight:'500',marginLeft:5}}
                                icon={{name:'md-pin',type:'ionicon',size:18,color:'#3578E5'}}
                                buttonStyle={{backgroundColor:'#fff'}}
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
                            errorMessage={this.state.addCourtForm.error}
                            value={this.state.addCourtForm.name}
                            inputStyle={{color: '#333'}}
                        />
                        <View style={[styles.spaceAroundRow,{alignItems:'center'}]}>
                            <Button
                                title='Back'
                                onPress={() => {
                                    this.setState({addCourtForm: {coords: null}})
                                }}
                                raised
                                type='outline'
                                titleStyle={{color:'#3578E5',fontSize:18,fontWeight:'500',marginLeft:5}}
                                icon={{name:'ios-arrow-back',type:'ionicon',size:18,color:'#3578E5'}}
                                buttonStyle={{backgroundColor:'#fff'}}
                            />                               
                            <Button
                                title='Save'
                                raised
                                type='outline'
                                disabled={!this.state.addCourtForm.name || this.state.addCourtForm.error}
                                onPress={() => this.handleSaveCourt()}
                                icon={{name:'ios-save',type:'ionicon',size:18,color:'#3578E5'}}
                                titleStyle={{color:'#3578E5',fontSize:18,fontWeight:'500',marginLeft:5}}
                                buttonStyle={{backgroundColor:'#fff'}}
                            />                                  
                        </View>
                    </View>
                }
                addCourtAnnotation = this.returnAddCourtAnnotation(this.state.mapCenter);
            }

            return (
                <View style={[styles.container]}>
                    {modal}
                    {header}
                    {addCourtForm}
                    <Mapbox.MapView
                        ref={(c) => this._mapView = c}
                        onLongPress={(e) => {
                            this.updateMapCenter({latitude: e.geometry.coordinates[1],longitude: e.geometry.coordinates[0]}, true)
                        }}
                        styleURL={this.state.mapStyle.url}
                        compassEnabled={false}
                        zoomLevel={this.state.zoomLevel}
                        //onPress={() => this.setCourtPreview()}
                        centerCoordinate={[this.state.mapCenter.longitude, this.state.mapCenter.latitude]}
                        showUserLocation={true}
                        style={styles.container}
                        onRegionDidChange={(e) => {
                            if(this.state.addCourtMode === true && !this.state.addCourtForm.coords) {
                                this.updateMapCenter({latitude: e.geometry.coordinates[1],longitude: e.geometry.coordinates[0]}, false)}
                            }
                        }
                    >
                          
                        {this.renderAnnotations()}
                        
                        {addCourtAnnotation}

                        {loadingIndicator}

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            marginRight: 5,
                        }}> 
                            <TouchableOpacity 
                                style={styles.buttonBr}
                                onPress={() => this.toggleOptionsMenu()}
                            >
                                <Icon
                                    name='ios-apps'
                                    type='ionicon'
                                    color={this.state.optionsMenuVisible ? '#3578E5' : '#333'}
                                    size={30}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{width:45}} 
                                onPress={() => this.updateUserLocation()}>
                                <Icon
                                    name='gps-fixed'
                                    color={this.props.locationError ? 'red' : '#3578E5'}
                                    size={30}
                                />                                    
                            </TouchableOpacity>                                                       
                        </View>
                        {/*
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-end',
                                marginBottom:100,
                                marginRight: 5,
                            }}>                             
                                { this.props.locationError ?
                                    <Text style={{zIndex:1000,alignSelf:'center',fontWeight:'bold',position:'absolute',bottom:0,color:'red'}}>{this.props.locationError}</Text>
                                    : null
                                }
                            </View>
                        */}

                        
                        {this.state.optionsMenuVisible ? 
                            (<View style={{
                                alignItems: 'center',
                                zIndex:1000,
                                position:'absolute',
                                bottom:0,
                                width:deviceWidth
                            }}>
                                <Card
                                    containerStyle={{width:deviceWidth,paddingLeft:20,paddingRight:20,zIndex:1000}}                                
                                    title={
                                        <IonIcon 
                                            name='md-close'
                                            size={30}
                                            color='#333'
                                            style={{alignSelf:'flex-end'}}
                                            onPress={() => this.toggleOptionsMenu()} 
                                        />
                                    }
                                >
                                    <Text>{"Don't see your court?"}</Text>
                                    <Button
                                        onPress={() => this.toggleAddCourtMode()}
                                        icon={{name:'md-add',type:'ionicon',size:16,color:'#3578E5'}}
                                        title='Add Court'
                                        type='outline'
                                        raised
                                        containerStyle={{alignSelf:'center',marginTop:5}}
                                        titleStyle={{color:'#3578E5',fontSize:14,fontWeight:'500'}}
                                    />        
                                    <Divider style={{marginTop:15,marginBottom:15}}/>                                                                                                    
                                    <Text>Map type</Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:5}}>
                                        <TouchableOpacity
                                            style={this.state.mapStyle.type === 'Light' ? ({borderColor:'#3578E5',borderRadius:5}) : null} 
                                            onPress={() => this.updateMapStyle('Light')}>
                                            <Image
                                                source={LightMapLogo}
                                                style={[ {width:100,height:100}, this.state.mapStyle.type === 'Light' ? {borderColor:'#3578E5',borderWidth:2} : null] }
                                            />
                                            <Text style={{alignSelf:'center'}}>Light</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.updateMapStyle('Dark')}>
                                            <Image
                                                source={DarkMapLogo}
                                                style={[ {width:100,height:100}, this.state.mapStyle.type === 'Dark' ? {borderColor:'#3578E5',borderWidth:2} : null] }
                                            />                                        
                                            <Text style={{alignSelf:'center'}}>Dark</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.updateMapStyle('Street')}>
                                            <Image
                                                source={StreetMapLogo}
                                                style={[ {width:100,height:100}, this.state.mapStyle.type === 'Street' ? {borderColor:'#3578E5',borderWidth:2} : null] }
                                            />                                            
                                            <Text style={{alignSelf:'center'}}>Street</Text>
                                        </TouchableOpacity>                                        
                                    </View>
                                </Card>
                            </View>)
                            : <View></View>
                        }

                        {this.state.selectedCourtPreview ? 
                            (<View style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                zIndex:999
                            }}>
                                <Card
                                    containerStyle={{width:deviceWidth,paddingLeft:20,paddingRight:20}}
                                    title={
                                        <View style={{flexDirection:'row',justifyContent:'space-between',zIndex:1000}}>
                                            <Text style={{fontSize:16,fontWeight:'bold',width:deviceWidth*.65}}>{this.state.selectedCourtPreview.name}</Text>
                                            <IonIcon 
                                                name='md-open'
                                                size={30}
                                                color='#3578E5'
                                                onPress={() => this.setModalVisible(true, this.state.selectedCourtPreview)} 
                                            />                                            
                                            <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                                <IonIcon 
                                                    name='md-close'
                                                    size={30}
                                                    color='#333'
                                                    onPress={() => this.setCourtPreview()} 
                                                />                                            
                                            </View>
                                        </View>
                                    }
                                >
                                    <View style={{justifyContent:'space-evenly',alignItems:'flex-start',marginTop:10}}>
                                        <Text>{`Added by: ${this.state.selectedCourtPreview.discovered_by.displayName}`}</Text>
                                        <Button
                                            onPress={() => this.openExternalMap(this.state.mapCenter)}
                                            icon={{name:'md-map',type:'ionicon',size:25,color:'#FFFFFF'}}
                                            backgroundColor='transparent'
                                            buttonStyle={{backgroundColor:'#3578E5'}}
                                            title='Directions'
                                            containerStyle={{alignSelf:'flex-end'}}
                                        />
                                    </View>
                                </Card>
                            </View>)
                            : <View></View>
                        }                                                        
                    </Mapbox.MapView>
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    nearbyCourts: state.nearbyCourts,
    location: state.location,
    locationError: state.locationError,
    mapLoading: state.mapLoading
})

export default connect(mapStateToProps)(Explore);



