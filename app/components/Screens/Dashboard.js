import React from 'react';
import Geolocation from '@react-native-community/geolocation';
import { View, Modal, Dimensions, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Button, Header, ButtonGroup, Text, Divider, Badge, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import Loading from '../Shared/Loading';
import Events from '../Event/Events';
import EventForm from '../Event/CreateEvent/EventForm';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { getFriends, getFriendRequestsReceived, getFriendRequestsSent } from '../../actions/User';
import { getSavedCourts, getNearbyCourts } from '../../actions/Court';
import { updateLocation } from '../../actions/Location';
import ErrorMessage from '../Shared/ErrorMessage';
import CancelButton from '../Shared/CancelButton';
import Account from '../Shared/Account';
import styles from '../../styles/main';
import FCM from '../Messaging/FCM';
import Logo from '../../../assets/img/logo_orange_ball.png';
import Mapbox from '@react-native-mapbox-gl/maps';
import { MAPBOX_ACCESS_TOKEN } from '../../../config';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

// let activityTypes = [{value: 'All'}, {value: 'Friends'}, {value: 'Only Me'}];

class Dashboard extends React.Component {
  state = {
    showEventFormModal: false,
    showAccountModal: false,
    activityType: 'All',
    selectedIndex: 0,
  }

  componentDidMount() {
    if (!this.props.loggedIn) {
      this.props.navigation.navigate('Auth');
    }

    if (this.props.currentUser && this.props.currentUser.friends && this.props.currentUser.friends.length > 0) {
      this.props.dispatch(getFriends(this.props.currentUser.friends));
    }

    this.props.dispatch(getSavedCourts());
    this.props.dispatch(getFriendRequestsReceived());
    this.props.dispatch(getFriendRequestsSent());
    this.getUserLocationAndNearbyCourts();
  }
  setEventFormModalVisible = (visible) => {
    this.setState({
      showEventFormModal: visible,
    });
  }
  setAccountModalVisible = (visible) => {
    this.setState({
      showAccountModal: visible,
    });
  }
  updateSelectedIndex = (selectedIndex) => {
    this.setState({selectedIndex});
  }
  // Finds user location
  getUserLocationAndNearbyCourts = () => {

    Geolocation.getCurrentPosition(position => {
      this.props.dispatch(updateLocation(position.coords, true));
      this.props.dispatch(getNearbyCourts(position.coords,15000));
    }, () => {
      this.props.dispatch(updateLocation(null, false));
    }),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000};

  }
  returnAnnotation = (coords) => {
    return (
      <Mapbox.PointAnnotation
        key={'2'}
        id={'2'}
        coordinate={[coords.longitude, coords.latitude]}
        title="annotation title"
      >
        <IonIcon
          name="ios-pin"
          size={30}
          color="red"
        />
      </Mapbox.PointAnnotation>
    );
  }
  render() {
    if (this.props.error) {
      return <ErrorMessage message={this.props.error}/>;
    }

    const eventViewBtns = ['Timeline', 'List'];

    if (this.props.currentUser) {

      // account notification badge
      let accountNotificationBadge;
      if (this.props.currentUser.friendRequestsReceived && this.props.currentUser.friendRequestsReceived.length > 0) {
        accountNotificationBadge = <Badge value={this.props.currentUser.friendRequestsReceived.length} status="error" />;
      }

      return (
        <View style={[styles.container,{backgroundColor: '#FAFAFA'}]} testID="Dashboard">

          {// hide status bar when modal visible
          }
          {this.state.showEventFormModal ?
            <StatusBar hidden/>
            : null
          }
          <Header
            centerComponent={
              <Image
                source={Logo}
                style={{width: 150,height: deviceHeight * 0.25}}
                PlaceholderContent={<ActivityIndicator />}
                placeholderStyle={{backgroundColor: 'transparent'}}
              />
            }
            containerStyle={styles.dashHeader}
            rightComponent={
              <TouchableOpacity
                onPress={() => this.setAccountModalVisible(true)}
                style={{flexDirection: 'row'}}
                testID="AccountButton"
              >
                <IonIcon
                  name="ios-contact"
                  size={40}
                  color="#fff"
                />
                {accountNotificationBadge}
              </TouchableOpacity>
            }
          />

          <FCM />

          <View style={[styles.centeredContainer,{paddingBottom: 20}]}>

            <ScrollView>

              {// SAVED COURTS
              }
              <View testID="SavedCourts">
                <View style={{width: deviceWidth,flexDirection: 'row',justifyContent: 'flex-start',marginTop: 15}}>
                  <Text style={styles.header}>Favorite Courts</Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{marginLeft: 10}}
                >
                  {this.props.savedCourts && this.props.savedCourts.map(court => {
                    return (
                      <TouchableOpacity
                        key={court.id}
                        style={{width: deviceWidth * 0.35,marginTop: 10,justifyContent: 'flex-start'}}
                        onPress= {() => { // navigate to this court in the Explore screen
                          this.props.navigation.navigate('Explore', { action: {type: 'showCourt', data: court} });
                        }}
                      >
                        <Mapbox.MapView
                          scrollEnabled={false}
                          styleURL={Mapbox.StyleURL.Street}
                          zoomLevel={14}
                          centerCoordinate={[court.coords.longitude, court.coords.latitude]}
                          showUserLocation={false}
                          style={{height: 150,marginBottom: 5, marginRight: 5}}
                          logoEnabled={false}
                        >
                          {this.returnAnnotation(court.coords)}
                        </Mapbox.MapView>
                        <Text style={{fontWeight: '500',textAlign: 'center',fontSize: 16}}>{court.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <Divider style={{marginBottom: 30,marginTop: 30,width: deviceWidth * 0.9,alignSelf: 'center'}}/>


              {// RECENT ACTIVITY
              }
              <View style={{height: deviceHeight * 0.6,alignItems: 'center'}} testID="RecentActivity">
                <View style={{width: deviceWidth,flexDirection: 'row',justifyContent: 'space-between'}}>
                  <Text style={styles.header}>Past Events</Text>
                  <Button
                    onPress={() => this.setEventFormModalVisible(true)}
                    icon={{name: 'ios-add',type: 'ionicon',size: 25,color: '#3578E5'}}
                    title="New Event"
                    buttonStyle={{backgroundColor: 'transparent'}}
                    containerStyle={{marginRight: 10}}
                    titleStyle={{color: '#3578E5',fontSize: 16,fontWeight: '500'}}
                    testID="newEvent"
                  />
                </View>

                {// NEW EVENT MODAL
                }
                <Modal
                  transparent={false}
                  visible={this.state.showEventFormModal}>
                  <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                      <EventForm onClose={() => this.setEventFormModalVisible(false)} currentUser={this.props.currentUser}/>
                    </View>
                    <CancelButton onCancel={() => this.setEventFormModalVisible(false)} title="Cancel"/>
                  </View>
                </Modal>

                {// USER ACCOUNT MODAL
                }
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.showAccountModal}>
                  <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                      <Account />
                    </View>
                    <CancelButton onCancel={() => this.setAccountModalVisible(false)} title="Cancel"/>
                  </View>
                </Modal>

                {/* ACTIVITY TYPE

                <View style={{alignSelf:'flex-start',marginLeft:25}}>
                  <Dropdown
                    data={activityTypes}
                    value={this.state.activityType}
                    containerStyle={{width: 100,backgroundColor:'transparent'}}
                    itemColor='#333'
                    onChangeText={val => this.setState({activityType: val})}
                  />
                </View>
                */}

                {// TIMELINE / LIST OPTION
                }
                <View style={{alignSelf: 'center',width: 200,marginBottom: 10,marginTop: 10}}>
                  <ButtonGroup
                    onPress={this.updateSelectedIndex}
                    selectedIndex={this.state.selectedIndex}
                    buttons={eventViewBtns}
                    buttonStyle={{backgroundColor: '#FAFAFA'}}
                    selectedButtonStyle={{backgroundColor: '#FFFFFF'}}
                    textStyle={{color: '#777'}}
                    selectedTextStyle={{color: '#333'}}
                  />
                </View>

                {// EVENTS
                }
                <Events
                  activityType={this.state.activityType}
                  selectedIndex={this.state.selectedIndex}
                  navigation={this.props.navigation}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      );
    } else {
      return (
        <Loading message="" indicator={false}/>
      );
    }

  }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  loggedIn: state.loggedIn,
  friends: state.friends,
  savedCourts: state.savedCourts,
  fcm: state.fcm,
  error: state.error,
});

export default connect(mapStateToProps)(Dashboard);
