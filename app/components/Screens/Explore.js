import React from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Text, View, TouchableOpacity, FlatList, Modal, Linking, Dimensions, ActivityIndicator, AlertIOS } from 'react-native';
import Mapbox from '@react-native-mapbox-gl/maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { findLocationByQuery } from '../../api-calls/googleplaces';
import { Card, Button, ListItem, SearchBar, Icon, Input, Divider, Image } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import CancelButton from '../Shared/CancelButton';
import { updateLocation } from '../../actions/Location';
import { addCourt, trySaveCourt, unSaveCourt, getNearbyCourts } from '../../actions/Court';
import { setPreferredMapType } from '../../actions/User';
import { MAPBOX_ACCESS_TOKEN } from '../../../config';
import { connect } from 'react-redux';
import LightMapLogo from '../../../assets/mapStyles/light.png';
import DarkMapLogo from '../../../assets/mapStyles/dark.png';
import StreetMapLogo from '../../../assets/mapStyles/street.png';
import styles from '../../styles/main';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

class Explore extends React.Component {

    static navigationOptions = {
      tabBarVisible: false,
    }
    state = {
      viewMode: 'map',    // 'map', 'list'
      zoomLevel: 10,
      mapCenter: {        // defaults to NYC UES
        latitude: this.props.location ? this.props.location.latitude : 40.85695626802242,
        longitude: this.props.location ? this.props.location.longitude :  -73.96452454863464,
      },
      tempMapType: null,
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
      error: null,
    }

    componentDidMount() {
      if (!this.props.locationEnabled) {
        Geolocation.requestAuthorization();
      }

      this.handleNavigationActions();
    }

    componentDidUpdate(prevProps) {
      let prevCoords = prevProps.location;
      let newCoords = this.props.location;

      // if lat or long has changed, update map center
      if ( (prevCoords && newCoords) && ( (prevCoords.latitude !== newCoords.latitude) || (prevCoords.longitude !== newCoords.longitude)) ) {
        this.updateMapCenter(newCoords, true);
      }

      this.handleNavigationActions();
    }

    // handles navigation actions from another screen
    handleNavigationActions = () => {
      if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.action) {
        const action = this.props.navigation.state.params.action;
        switch (action.type) {
          case 'showAddCourtForm' :
            this.props.navigation.setParams({action: null});
            this.toggleAddCourtMode(true);
            break;
          case 'showCourt' :
            this.props.navigation.setParams({action: null});
            this.setState({
              mapCenter: {
                latitude: action.data.coords.latitude,
                longitude: action.data.coords.longitude,
              },
              zoomLevel: 15,
              selectedCourtPreview: action.data,
              viewMode: 'map',
            }, () => {
              this.props.dispatch(getNearbyCourts({latitude: action.data.coords.latitude,longitude: action.data.coords.longitude}, this.state.searchRadius));
            });
            break;
          default :
            break;
        }
      }
    }

    sendAlert = (header, message) => {
      AlertIOS.alert(header, message, () => {
        this.renderAnnotations();
      });
    }

    handleAddCourt = () => {
      this.props.dispatch(addCourt(
        {
          coords: this.state.addCourtForm.coords,
          name: this.state.addCourtForm.name,
        }
      ));
      this.setState({
        addCourtMode: false,
        addCourtForm: {
          coords: null,
          name: null,
        },
      });
    }

    handleSaveCourt = () => {
      this.props.dispatch(trySaveCourt(this.state.selectedCourtPreview));
    }

    handleUnSaveCourt = () => {
      this.props.dispatch(unSaveCourt(this.state.selectedCourtPreview.id));
    }

    flyTo = (coords) => {
      this._mapView.flyTo([coords.longitude,coords.latitude], 1000);
    }

    openExternalMap = (coords) => {
      const url = `http://maps.apple.com/?daddr=${coords.latitude},${coords.longitude}`;
      Linking.openURL(url).catch(err => console.log('An error occurred opening Apple Map', err));
    }

    updateMapCenter = (coords, shouldUpdateCourts) => {
      this.setState({
        mapCenter: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        // zoomLevel: 8,
        error: null,
      }, () => {
        if (shouldUpdateCourts) {
          this.props.dispatch(getNearbyCourts(coords, this.state.searchRadius));
        }
      }
      );}

    updateAddCourtForm = (field, data) => {
      let error;
      if (field === 'name' && data.length < 3) {
        error = 'Please enter a longer name';
      }
      this.setState({
        addCourtForm: {
          ...this.state.addCourtForm,
          [field]: data,
          error,
        },
      });
    }
    updateTempMapType = (tempMapType) => {
      this.setState({
        tempMapType,
      });
    }
    returnMapStyleUrl = (type) => {
      let url;
      switch (type) {
        case 'Light' :
          url = Mapbox.StyleURL.Light;
          break;
        case 'Dark' :
          url = Mapbox.StyleURL.Dark;
          break;
        case 'Street' :
          url = Mapbox.StyleURL.Street;
          break;
        default :
          break;
      }
      return url;
    }

    // Get user location, find nearby courts, adds courts to state via callback (updateNearbyCourts) and fly to current pos
    updateUserLocation = () => {
      Geolocation.getCurrentPosition(position => {
        this.props.dispatch(updateLocation(position.coords, true));
        this.flyTo(position.coords);
        this.props.dispatch(getNearbyCourts(position.coords, this.state.searchRadius));
      }, () => { // ERROR
        this.props.dispatch(updateLocation(null, false));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
    }

    updateMapCenterByQuery = () => {
      // validate search input has content
      if (this.state.search && this.state.search.trim().length > 0) {
        findLocationByQuery(this.state.search, this.updateMapCenter);
      }
    }

    updateSearch = search => { this.setState({ search });}

    returnAddCourtAnnotation = (coords) => {
      return (
        <Mapbox.PointAnnotation
          key={'1'}
          id={'1'}
          coordinate={[coords.longitude, coords.latitude]}
          title="annotation title"
          containerStyle={{alignItems: 'center', justifyContent: 'center'}}
        >
          <FontAwesome5 name={'hand-point-down'} size={40} color="#3578E5" solid/>
        </Mapbox.PointAnnotation>
      );
    }
    isCourtSaved = (courtId) => {
      const isSaved = this.props.currentUser && this.props.currentUser.saved_courts && this.props.currentUser.saved_courts.includes(courtId);
      return isSaved;
    }

    // Returns a single annotation via an index of nearbyCourts
    returnAnnotation = (counter) => {
      const coords = this.props.nearbyCourts[counter].coords;
      // const isSaved = this.props.currentUser && this.props.currentUser.saved_courts && this.props.currentUser.saved_courts.includes(this.props.nearbyCourts[counter].id);
      const isSaved = this.isCourtSaved(this.props.nearbyCourts[counter].id);

      return (
        <Mapbox.PointAnnotation
          key={this.props.nearbyCourts[counter].id}
          id={this.props.nearbyCourts[counter].id}
          coordinate={[coords.longitude, coords.latitude]}
          onSelected={() => {
            this.flyTo({latitude: coords.latitude,longitude: coords.longitude});
            this.setCourtPreview(this.props.nearbyCourts[counter]);
          }}
          // title="Basketball court"
        >
          <IonIcon
            name={isSaved ? 'ios-star' : 'ios-pin'}
            size={30}
            color={isSaved ? 'gold' : 'red'}
          />
        </Mapbox.PointAnnotation>
      );
    }

    // Loop over nearbyCourts and return annotations
    renderAnnotations = () => {
      if (this.props.nearbyCourts !== null) {
        let annotations = this.props.nearbyCourts.map( (court, i) => {
          return this.returnAnnotation(i);
        });
        return annotations;
      }
    }

    // toggles between list and map views
    toggleView = (mode) => {
      this.setState({
        viewMode: mode,
      });
    }

    // toggle special modes (i.e add court)
    toggleAddCourtMode = (visible) => {
      this.setState({
        addCourtMode: visible,
        optionsMenuVisible: false,
        selectedCourtPreview: null,
      });
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
        selectedCourt: item || null,
      });
    }

    // changes visibility of court preview
    setCourtPreview = (item = null) => {
      this.setState({
        selectedCourtPreview: item,
      });
    }

    render() {

      let { currentUser } = this.props;

      let loadingIndicator = <View />;
      if (this.props.mapLoading) {
        loadingIndicator =
                <View style={styles.loading}>
                  <ActivityIndicator size="large" color="#3578E5"/>
                </View>;
      }

      let header =
            <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',backgroundColor: '#3578E5',paddingTop: 40}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')} testID="exitExplore">
                <IonIcon name="ios-undo" size={30} color="white"/>
              </TouchableOpacity>
              <SearchBar
                containerStyle={{marginLeft: 10,marginRight: 10,width: deviceWidth * 0.7,backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent',zIndex: 1000}}
                inputContainerStyle={{backgroundColor: '#fff'}}
                round
                onChangeText={this.updateSearch}
                inputStyle={{color: '#333'}}
                onSubmitEditing={() => this.updateMapCenterByQuery()}
                placeholder="Search"
                value={this.state.search}
              />
              <TouchableOpacity onPress={() => this.toggleView(this.state.viewMode === 'map' ? 'list' : 'map')} testID="toggleExploreViewMode">
                <IonIcon name={this.state.viewMode === 'map' ? 'ios-menu' : 'ios-map'} size={30} color="white"/>
              </TouchableOpacity>
            </View>;


      // define modal for court view
      let modal =
            <Modal
              transparent={false}
              visible={this.state.modalVisible}>
              <View style={styles.modalBackground}>
                <View style={[styles.fullCenterContainer,styles.modalContent,{backgroundColor: '#FAFAFA'}]}>
                  <Card
                    title={this.state.selectedCourt ? this.state.selectedCourt.name : null}
                    containerStyle={styles.cardContainer}
                  >
                    <Text>{this.state.selectedCourt ? this.state.selectedCourt.location : null}</Text>
                    <Button
                      onPress={() => this.openExternalMap(this.state.mapCenter)}
                      icon={{name: 'ios-map',type: 'ionicon',size: 25,color: '#FFFFFF'}}
                      backgroundColor="transparent"
                      buttonStyle={{backgroundColor: '#3578E5'}}
                      title="Directions"
                    />
                  </Card>
                </View>
                <CancelButton onCancel={() => this.setModalVisible(!this.state.modalVisible)} />
              </View>
            </Modal>;

      // LIST VIEW of nearby courts
      if (this.state.viewMode === 'list') {
        return (
          <View style={[styles.container]} testID="ExploreListContainer">
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
                  rightIcon={
                    <View style={{alignItems: 'center'}}>
                      <Icon
                        type="ionicon"
                        name="ios-navigate"
                        size={30}
                        color="#3578E5"
                        onPress={() => this.openExternalMap(item.coords)}
                      />
                      <Text style={{fontWeight: 'bold',color: '#3578E5',fontSize: 14}}>Directions</Text>
                    </View>
                  }
                  // uncomment for v2 court details modal
                  // onPress={() => this.setModalVisible(true, item)}
                />
              )}
            />
          </View>
        );
        // MAP VIEW of nearby courts
      } else if (this.state.viewMode === 'map') {
        let { tempMapType } = this.state;
        let mapStyleUrl = this.returnMapStyleUrl(tempMapType || currentUser && currentUser.preferredMapType);

        let addCourtAnnotation, selectLocation, addCourtName;

        if (this.state.addCourtMode) {
          if (!this.state.addCourtForm.coords) {
            selectLocation =
                        <View style={{padding: 10, zIndex: 1005,borderBottomColor: '#CAD2D3',borderBottomWidth: 2}}>
                          <View style={{justifyContent: 'flex-start',alignSelf: 'flex-end'}}>
                            <IonIcon
                              name="ios-close-circle"
                              size={30}
                              color="#ccc"
                              style={{alignSelf: 'flex-start',marginRight: 5}}
                              onPress={() => this.toggleAddCourtMode(false)}
                            />
                          </View>
                          <ListItem
                            containerStyle={{width: '100%'}}
                            title="Move pointer to Court"
                            titleStyle={{fontSize: 18}}
                          />
                          <Button
                            title="SELECT LOCATION"
                            onPress={async () => {
                              const center = await this._mapView.getCenter();
                              const zoomLevel = await this._mapView.getZoom();
                              if (zoomLevel > 14) {
                                return this.updateAddCourtForm('coords',{latitude: center[1],longitude: center[0]});
                              } else {
                                return this.sendAlert('Please zoom in for a more precise reading');
                              }
                            }}
                            raised
                            type="outline"
                            titleStyle={{color: '#fff',fontSize: 18,fontWeight: '500'}}
                            buttonStyle={{backgroundColor: '#3578E5', borderRadius: 15, padding: 10}}
                            containerStyle={{marginBottom: 5}}
                          />
                        </View>;
          } else if (this.state.addCourtForm.coords) {
            addCourtName =
                    <View style={{justifyContent: 'center',height: deviceHeight * 0.3,padding: 10,zIndex: 1005,borderBottomColor: '#CAD2D3',borderBottomWidth: 2}}>
                      <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                        <Button
                          title="Back"
                          onPress={() => this.setState({addCourtForm: {coords: null}})}
                          titleStyle={{color: '#3578E5',fontSize: 18,fontWeight: '500',marginLeft: 5}}
                          icon={{name: 'ios-arrow-back',type: 'ionicon',size: 30,color: '#3578E5'}}
                          buttonStyle={{backgroundColor: 'transparent'}}
                          containerStyle={{marginRight: 10,alignSelf: 'flex-start'}}
                        />
                        <Button
                          title=""
                          onPress={() => this.toggleAddCourtMode(false)}
                          icon={{name: 'ios-close-circle',type: 'ionicon',size: 30,color: '#ccc'}}
                          buttonStyle={{backgroundColor: 'transparent'}}
                          containerStyle={{alignSelf: 'flex-end'}}
                        />
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <Input
                          placeholder="Type court name here"
                          onChangeText={val => this.updateAddCourtForm('name',val)}
                          containerStyle={{alignSelf: 'center',width: deviceWidth * 0.85,marginBottom: 20,marginTop: 20}}
                          maxLength={25}
                          errorMessage={this.state.addCourtForm.error}
                          value={this.state.addCourtForm.name}
                          inputStyle={{color: '#333'}}
                        />
                        <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                          <Button
                            title="Save"
                            raised
                            type="outline"
                            disabled={!this.state.addCourtForm.name ? true : false}
                            disabledStyle={{backgroundColor: '#fff'}}
                            disabledTitleStyle={{color: '#ccc'}}
                            onPress={() => this.handleAddCourt()}
                            icon={{name: 'ios-save',type: 'ionicon',size: 18,color: !this.state.addCourtForm.name || this.state.addCourtForm.error ? '#ccc' : '#fff'}}
                            titleStyle={{color: '#fff',fontSize: 18,fontWeight: '500',marginLeft: 5}}
                            buttonStyle={{backgroundColor: '#3578E5'}}
                          />
                        </View>
                      </View>
                    </View>;
          }
          addCourtAnnotation = this.returnAddCourtAnnotation(this.state.mapCenter);
        }

        return (
          <View style={[styles.container]} testID="ExploreMapContainer">
            {modal}
            {header}
            {selectLocation}
            {addCourtName}
            <Mapbox.MapView
              ref={(c) => this._mapView = c}
              onLongPress={(e) => {
                this.updateMapCenter({latitude: e.geometry.coordinates[1],longitude: e.geometry.coordinates[0]}, true);
              }}
              styleURL={mapStyleUrl}
              compassEnabled={false}
              zoomLevel={this.state.zoomLevel}
              // onPress={() => this.setCourtPreview()}
              centerCoordinate={[this.state.mapCenter.longitude, this.state.mapCenter.latitude]}
              showUserLocation={true}
              style={styles.container}
              onRegionDidChange={(e) => {
                if (this.state.addCourtMode === true && !this.state.addCourtForm.coords) {
                  this.updateMapCenter({latitude: e.geometry.coordinates[1],longitude: e.geometry.coordinates[0]}, false);}
              }}
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
                    name="ios-apps"
                    type="ionicon"
                    color={this.state.optionsMenuVisible ? '#3578E5' : '#333'}
                    size={30}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: 45}}
                  onPress={() => this.updateUserLocation()}>
                  <Icon
                    name="gps-fixed"
                    color={this.props.location ? '#3578E5' : 'red'}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              <View style={{zIndex: 1000}}>
                {this.state.optionsMenuVisible ?
                  (<View style={{
                    alignItems: 'center',
                    zIndex: 1005,
                    position: 'absolute',
                    bottom: 0,
                    width: deviceWidth,
                  }}>
                    <Card
                      containerStyle={{width: deviceWidth,paddingLeft: 20,paddingRight: 20,zIndex: 1005}}
                      title={
                        <IonIcon
                          name="ios-close-circle"
                          size={30}
                          color="#ccc"
                          style={{alignSelf: 'flex-end'}}
                          onPress={() => this.toggleOptionsMenu()}
                        />
                      }
                    >
                      <View style={{justifyContent: 'center',alignItems: 'center',marginTop: 15}}>
                        <Text style={{fontSize: 15,fontWeight: '500',marginBottom: 10}}>{'Missing a court? Help improve the map!'}</Text>
                        <Button
                          onPress={() => this.toggleAddCourtMode(true)}
                          icon={{name: 'ios-add',type: 'ionicon',size: 18,color: '#fff'}}
                          title="Add Court"
                          raised
                          type="outline"
                          buttonStyle={{backgroundColor: '#3578E5'}}
                          titleStyle={{color: '#fff',fontSize: 16,fontWeight: '500'}}
                        />
                      </View>

                      <Divider style={{marginTop: 15,marginBottom: 15}}/>

                      <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                        <Text style={{fontSize: 16,fontWeight: '500'}}>Map type</Text>
                        <TouchableOpacity onPress={() => this.props.dispatch(setPreferredMapType(this.state.tempMapType))}>
                          <Text style={{color: '#3578E5',fontWeight: '500'}}>Save as default</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{flexDirection: 'row',justifyContent: 'space-evenly',alignItems: 'center',marginTop: 5}}>
                        <TouchableOpacity onPress={() => this.updateTempMapType('Light')}>
                          <Image
                            source={LightMapLogo}
                            PlaceholderContent={<ActivityIndicator />}
                            style={[ {width: 100,height: 100}, this.state.tempMapType && this.state.tempMapType === 'Light' || !this.state.tempMapType && this.props.preferredMapType === 'Light' ? {borderColor: '#3578E5',borderWidth: 2} : null] }
                          />
                          <Text style={{alignSelf: 'center'}}>Light</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.updateTempMapType('Dark')}>
                          <Image
                            source={DarkMapLogo}
                            PlaceholderContent={<ActivityIndicator />}
                            style={[ {width: 100,height: 100}, this.state.tempMapType && this.state.tempMapType === 'Dark' || !this.state.tempMapType && this.props.preferredMapType === 'Dark' ? {borderColor: '#3578E5',borderWidth: 2} : null] }
                          />
                          <Text style={{alignSelf: 'center'}}>Dark</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.updateTempMapType('Street')}>
                          <Image
                            source={StreetMapLogo}
                            PlaceholderContent={<ActivityIndicator />}
                            style={[ {width: 100,height: 100}, this.state.tempMapType && this.state.tempMapType === 'Street' || !this.state.tempMapType && this.props.preferredMapType === 'Street' ? {borderColor: '#3578E5',borderWidth: 2} : null] }
                          />
                          <Text style={{alignSelf: 'center'}}>Street</Text>
                        </TouchableOpacity>
                      </View>
                    </Card>
                  </View>)
                  : <View />
                }

                {this.state.selectedCourtPreview ?
                  (<View style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    zIndex: 1000,
                  }}>
                    <Card
                      containerStyle={{backgroundColor: '#fff', width: deviceWidth,paddingLeft: 20,paddingRight: 20,zIndex: 1000}}
                      title={
                        <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                          <Text style={{fontSize: 16,fontWeight: 'bold',width: deviceWidth * 0.65}}>{this.state.selectedCourtPreview.name}</Text>
                          {/*   2/8/18 - postpone court details/modal until v2.0
                                                <IonIcon
                                                    name='ios-open'
                                                    size={30}
                                                    color='#3578E5'
                                                    onPress={() => this.setModalVisible(true, this.state.selectedCourtPreview)}
                                                />
                                            */}
                          <View style={{flexDirection: 'row',justifyContent: 'flex-end'}}>
                            <IonIcon
                              name="ios-close-circle"
                              size={30}
                              color="#ccc"
                              onPress={() => this.setCourtPreview()}
                            />
                          </View>
                        </View>
                      }
                    >
                      <View style={{justifyContent: 'space-evenly',alignItems: 'flex-start'}}>
                        {this.state.selectedCourtPreview.verified ? (
                          <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#3578E5',fontWeight: 'bold',marginRight: 3,marginTop: 6}}>Verified</Text>
                            <IonIcon
                              name="ios-checkmark-circle"
                              size={35}
                              color="#3578E5"
                            />
                          </View>)
                          : null
                        }
                        <Text style={{marginTop: 10}}>{`Added by: ${this.state.selectedCourtPreview.discovered_by.displayName}`}</Text>

                        <View style={{flexDirection: 'row',alignSelf: 'flex-end'}}>

                          <View style={{alignItems: 'center',marginRight: 15}}>
                            {this.props.currentUser && this.props.currentUser.saved_courts && this.props.currentUser.saved_courts.includes(this.state.selectedCourtPreview.id) ? (
                              <TouchableOpacity
                                onPress={() => this.handleUnSaveCourt()}
                              >
                                <IonIcon
                                  name="ios-star"
                                  size={30}
                                  color="gold"
                                />
                              </TouchableOpacity>
                            )
                              :
                              <TouchableOpacity
                                onPress={() => this.handleSaveCourt()}
                              >
                                <IonIcon
                                  name="ios-star-outline"
                                  size={30}
                                  color="gold"
                                />
                              </TouchableOpacity>
                            }
                            <Text style={{fontWeight: '500',color: '#333',fontSize: 14}}>Favorite</Text>
                          </View>

                          <TouchableOpacity>
                            <View style={{alignItems: 'center'}}>
                              <Icon
                                type="ionicon"
                                name="ios-navigate"
                                size={30}
                                color="#3578E5"
                                onPress={() => this.openExternalMap(this.state.selectedCourtPreview.coords)}
                              />
                              <Text style={{fontWeight: '500',color: '#333',fontSize: 14}}>Directions</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Card>
                  </View>)
                  : <View />
                }
              </View>
            </Mapbox.MapView>
          </View>
        );
      }
    }
}

const mapStateToProps = (state) => ({
  nearbyCourts: state.nearbyCourts,
  location: state.location,
  error: state.error,
  currentUser: state.currentUser,
  mapLoading: state.mapLoading,
});

export default connect(mapStateToProps)(Explore);



